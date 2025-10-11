import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const Payment_success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get payment details passed from checkout page (if available)
  const paymentData = location.state || {};

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your payment was successful.
        </p>

        {/* Display transaction info if available */}
        {paymentData?.reference && (
          <div className="bg-gray-100 p-4 rounded-lg text-sm text-left mb-6">
            <p><strong>Amount:</strong> ₦{(paymentData.amount / 100).toLocaleString()}</p>
            <p><strong>Reference:</strong> {paymentData.reference}</p>
            <p><strong>Status:</strong> {paymentData.status}</p>
          </div>
        )}

        <button
          onClick={() => navigate("/")}
          className="bg-[#8B5E3C] hover:bg-[#6B4423] text-white py-2 px-6 rounded-md transition duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Payment_success;
