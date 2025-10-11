import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

const Payment_failed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed ❌
        </h1>

        <p className="text-gray-600 mb-6">
          Oops! Something went wrong while processing your payment.  
          Please try again or contact support if the issue persists.
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate()} // Go back to checkout
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md transition duration-300"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-[#8B5E3C] hover:bg-[#6B4423] text-white py-2 px-6 rounded-md transition duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment_failed;
