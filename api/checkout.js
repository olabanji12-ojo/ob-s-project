// Vercel serverless function: Initialize Paystack transaction and create a pending order
import crypto from 'node:crypto';
// Node 18+ has global fetch; no import needed
import { getAdmin } from './_firebaseAdmin.js';

export const config = {
  runtime: 'nodejs18.x',
};

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
  if (!PAYSTACK_SECRET_KEY) return json(res, 500, { error: 'Missing PAYSTACK_SECRET_KEY' });

  try {
    const { uid, email } = req.body || {};
    if (!uid || !email) return json(res, 400, { error: 'Missing uid or email' });

    const { db } = getAdmin();

    // Load cart server-side to compute amount
    const cartSnap = await db.collection('cart').where('userId', '==', uid).get();
    const items = cartSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (!items.length) return json(res, 400, { error: 'Cart is empty' });

    const amountNaira = items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0);
    const amountKobo = amountNaira * 100;

    // Create order
    const reference = `ps_${uid}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const orderRef = db.collection('orders').doc();
    const orderData = {
      userId: uid,
      items: items.map(({ productId, name, price, image, quantity }) => ({ productId, name, price, image, quantity })),
      amount: amountKobo,
      currency: 'NGN',
      provider: 'paystack',
      status: 'pending',
      reference,
      createdAt: new Date(),
      customer: { email },
    };
    await orderRef.set(orderData);

    // Initialize Paystack transaction
    const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        currency: 'NGN',
        reference,
        callback_url: `${FRONTEND_BASE_URL}/order/complete?ref=${reference}&oid=${orderRef.id}`,
        metadata: { orderId: orderRef.id, uid },
      }),
    });

    const initJson = await initRes.json();
    if (!initRes.ok || !initJson.status) {
      await orderRef.update({ status: 'failed', failureReason: initJson?.message || 'init failed' });
      return json(res, 502, { error: 'Paystack init failed', details: initJson });
    }

    // Return authorization_url to client
    return json(res, 200, { authorization_url: initJson.data.authorization_url, reference, orderId: orderRef.id });
  } catch (e) {
    console.error('Checkout error:', e);
    return json(res, 500, { error: 'Server error' });
  }
}
