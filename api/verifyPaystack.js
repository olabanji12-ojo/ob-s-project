// api/verifyPaystack.js
import axios from "axios";

export default async function handler(req, res) {
  // ✅ Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { reference, userId, items, formData, totalPrice } = req.body;

  if (!reference || !userId || !items) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1️⃣ Verify the payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data;

    // 2️⃣ Check if payment was successful
    if (data.status && data.data.status === "success") {
      return res.status(200).json({
        verified: true,
        message: "Payment verified successfully",
      });
    } else {
      return res.status(400).json({
        verified: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({
      verified: false,
      error: error.message,
    });
  }
}