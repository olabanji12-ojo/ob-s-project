// api/verifyPaystack.js
import axios from "axios";

export default async function handler(req, res) {
  const { reference } = req.query;

  if (!reference) {
    return res.status(400).json({ error: "Transaction reference is required" });
  }

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = response.data;

    if (data.status && data.data.status === "success") {
      res.status(200).json({ verified: true, data: data.data });
    } else {
      res.status(400).json({ verified: false, data: data.data });
    }
  } catch (error) {
    res.status(500).json({ verified: false, error: error.message });
  }
}
