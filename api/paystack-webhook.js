// Vercel serverless function: Paystack webhook handler
import crypto from 'node:crypto';
// Node 18+ has global fetch; no import needed
import { getAdmin } from './_firebaseAdmin.js';

export const config = {
  runtime: 'nodejs',
};

function text(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain');
  res.end(body);
}

function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return text(res, 405, 'Method not allowed');

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return text(res, 500, 'Missing PAYSTACK_SECRET_KEY');

  // Get raw body for HMAC verification
  const raw = await buffer(req);
  const signature = req.headers['x-paystack-signature'];
  const expected = crypto.createHmac('sha512', secret).update(raw).digest('hex');
  if (signature !== expected) return text(res, 401, 'Invalid signature');

  const event = JSON.parse(raw.toString('utf8'));

  try {
    const { db } = getAdmin();

    // Verify via Paystack API (defensive)
    const reference = event?.data?.reference;
    if (!reference) return text(res, 400, 'No reference');

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const verifyJson = await verifyRes.json();
    if (!verifyRes.ok || !verifyJson.status) {
      return text(res, 400, 'Verify failed');
    }

    const status = verifyJson.data.status;
    const metadata = verifyJson.data.metadata || {};
    const orderId = metadata.orderId;
    const uid = metadata.uid;

    if (!orderId || !uid) return text(res, 400, 'Missing metadata');

    const orderRef = db.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) return text(res, 404, 'Order not found');

    if (status === 'success') {
      await orderRef.update({ status: 'paid', paidAt: new Date(), payment: verifyJson.data });

      // Clear cart
      const cartSnap = await db.collection('cart').where('userId', '==', uid).get();
      const batch = db.batch();
      cartSnap.forEach((d) => batch.delete(db.collection('cart').doc(d.id)));
      await batch.commit();
    } else if (status === 'failed') {
      await orderRef.update({ status: 'failed', payment: verifyJson.data });
    } else {
      await orderRef.update({ status, payment: verifyJson.data });
    }

    return text(res, 200, 'ok');
  } catch (e) {
    console.error('Webhook error:', e);
    return text(res, 500, 'Server error');
  }
}
