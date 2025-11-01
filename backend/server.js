import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import axios from 'axios';  // ✅ Add this import

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// ✅ Paystack verification route
app.post('/api/verifyPaystack', async (req, res) => {
  try {
    console.log('📥 Received verification request:', req.body); // Debug log

    const { reference, userId, items, formData, totalPrice } = req.body;

    if (!reference || !userId || !items) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1️⃣ Verify payment with Paystack
    console.log('🔍 Verifying payment with Paystack...');
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data;
    console.log('✅ Paystack response:', data);

    if (!data.status || data.data.status !== 'success') {
      return res.status(400).json({
        verified: false,
        message: "Payment verification failed",
      });
    }

    // 2️⃣ Payment verified → update Firestore
    console.log('💾 Updating Firestore...');
    const batch = db.batch();

    // Update stock
    for (const item of items) {
      const productRef = db.collection('products').doc(item.productId);
      const productSnap = await productRef.get();
      if (productSnap.exists) {
        const productData = productSnap.data();
        const newStock = Math.max(productData.stock - item.quantity, 0);
        batch.update(productRef, { stock: newStock });
      }
    }

    // Create order
    const orderRef = db.collection('orders').doc(reference);
    batch.set(orderRef, {
      userId,
      items: items.map(i => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image
      })),
      total: totalPrice,
      paymentStatus: 'paid',
      shippingStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      transactionRef: reference,
      deliveryAddress: {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        country: 'Nigeria',
        zipcode: formData.zipcode
      },
      customerInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone
      }
    });

    // Create transaction
    const transactionRef = db.collection('transactions').doc(reference);
    batch.set(transactionRef, {
      userId,
      email: formData.email,
      amount: totalPrice,
      status: 'success',
      reference,
      paid_at: new Date().toISOString(),
      items: items.map(i => ({
        id: i.productId,
        name: i.name,
        quantity: i.quantity,
        price: i.price
      }))
    });

    // Commit all writes
    await batch.commit();
    console.log('✅ Firestore updated successfully');

    res.status(200).json({
      verified: true,
      message: "Payment verified successfully"
    });

  } catch (err) {
    console.error("❌ Backend verification error:", err.response?.data || err.message);
    res.status(500).json({
      verified: false,
      error: err.response?.data || err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});