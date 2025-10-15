import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Added import
import { db } from '../firebase/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';  // ✅ Add updateDoc
import { useNavigate } from 'react-router-dom';
import Paystack from '@paystack/inline-js';


const Checkout_components = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Check stock availability before checkout
  const checkStockForCart = async (cartItems) => {
    const outOfStockItems = [];
  
    for (const item of cartItems) {
      const productRef = doc(db, "products", item.productId);  // ✅ Use productId
      const productSnap = await getDoc(productRef);
  
      if (!productSnap.exists()) {
        outOfStockItems.push(item.name + " (not found)");
        continue;
      }
  
      const productData = productSnap.data();
      if (productData.stock < item.quantity) {
        outOfStockItems.push(`${item.name} (only ${productData.stock} left)`);
      }
    }
  
    if (outOfStockItems.length > 0) {
      alert("The following items are out of stock:\n\n" + outOfStockItems.join("\n"));
      return { ok: false };
    }
  
    return { ok: true };
  };
  

  // ✅ Update product stock after successful payment
  const updateProductStock = async (cartItems) => {
    for (const item of cartItems) {
      const productRef = doc(db, "products", item.productId);  // ✅ Use productId
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        const productData = productSnap.data();
        const newStock = productData.stock - item.quantity;
        await updateDoc(productRef, { stock: Math.max(newStock, 0) });
      }
    }
  };
  

  // Prefill user info
  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipcode: '',
      });

      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFormData((prev) => ({
              ...prev,
              phone: userData.phone || '',
              address: userData.address || '',
              city: userData.city || '',
              state: userData.state || '',
              zipcode: userData.zipcode || '',
            }));
          }
        } catch (err) {
          setError('Failed to load user data.');
        }
      };
      fetchUserData();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Main checkout logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!currentUser) {
      alert('You must be logged in to proceed.');
      navigate('/login_page');
      setLoading(false);
      return;
    }

    // Step 1: Check stock before payment
    const stockCheck = await checkStockForCart(items);
    if (!stockCheck.ok) {
      setLoading(false);
      return;
    }

    try {
      // Step 2: Save user info
      await setDoc(
        doc(db, 'users', currentUser.uid),
        { ...formData },
        { merge: true }
      );

      // Step 3: Start Paystack Payment
      const paystack = new Paystack();
      paystack.checkout({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: formData.email,
        amount: totalPrice * 100,
        currency: 'NGN',

        onSuccess: async (transaction) => {
          try {
            const res = await fetch(`api/verifyPaystack`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reference: transaction.reference,
                userId: currentUser?.uid,
                items: items,
                formData: formData,
                totalPrice: totalPrice
              }),
            });
        
            let data;
            try {
              data = await res.json();
            } catch (err) {
              console.error('Failed to parse JSON from backend:', await res.text());
              navigate("/payment-failed");
              return;
            }

            console.log("Verification response:", data);
        
            if (data.verified) {
              clearCart();
              navigate("/payment-success", { state: { reference: transaction.reference } });
            } else {
              navigate("/payment-failed");
            }
          } catch (err) {
            console.error("Payment verification failed:", err);
            navigate("/payment-failed");
          }
        },
        
        onCancel: () => {
          navigate('/payment-failed', { state: { reason: 'User canceled payment' } });
        },

        onError: (error) => {
          console.error('Payment error:', error);
          navigate('/payment-failed', {
            state: { reason: 'Payment error', details: error.message },
          });
        },
      });
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to process checkout. Please try again.');
    }

    setLoading(false);
  };
  

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      data-aos="fade-in"
      data-aos-duration="800"
    >
      <h2
        className="text-3xl font-bold text-center mb-8"
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="800"
      >
        Checkout
      </h2>
      {error && (
        <p
          className="text-red-500 text-center mb-4"
          data-aos="fade-up"
          data-aos-delay="150"
          data-aos-duration="800"
        >
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div
          className="bg-white p-6 rounded-lg shadow-md"
          data-aos="fade-right"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          <h3
            className="text-xl font-semibold mb-4"
            data-aos="fade-right"
            data-aos-delay="300"
            data-aos-duration="800"
          >
            Customer & Shipping Details
          </h3>
          <form id="checkout-form" onSubmit={handleSubmit}>
            <div
              className="mb-4"
              data-aos="fade-right"
              data-aos-delay="400"
              data-aos-duration="800"
            >
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:border-[#F4C430] transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div
              className="mb-4"
              data-aos="fade-right"
              data-aos-delay="450"
              data-aos-duration="800"
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:border-[#F4C430] transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
            <div
              className="mb-4"
              data-aos="fade-right"
              data-aos-delay="500"
              data-aos-duration="800"
            >
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full borde r-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:border-[#F4C430] transition-colors"
                placeholder="Enter your phone number"
              />
            </div>
            <div
              className="mb-4"
              data-aos="fade-right"
              data-aos-delay="550"
              data-aos-duration="800"
            >
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Delivery Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:border-[#F4C430] transition-colors"
                placeholder="Street address"
                required
              />
            </div>
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
              data-aos="fade-right"
              data-aos-delay="600"
              data-aos-duration="800"
            >
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:border-[#F4C430] transition-colors"
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:border-[#F4C430] transition-colors"
                  placeholder="State"
                  required
                />
              </div>
            </div>
            <div
              className="mb-4"
              data-aos="fade-right"
              data-aos-delay="650"
              data-aos-duration="800"
            >
              <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">
                Zipcode
              </label>
              <input
                type="text"
                id="zipcode"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:border-[#F4C430] transition-colors"
                placeholder="Zipcode"
                required
              />
            </div>
            <div
              className="text-right"
              data-aos="zoom-in"
              data-aos-delay="700"
              data-aos-duration="800"
            >
              <p className="text-lg font-semibold">
                Total: <span className="text-[#8B5E3C]">₦{totalPrice.toLocaleString()}</span>
              </p>
              <button
                type="submit"
                id="place-order-btn"
                disabled={loading}
                className={`mt-4 w-full bg-[#8B5E3C] text-white py-2 px-4 rounded-md hover:bg-[#6B4423] transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div
          className="bg-white p-6 rounded-lg shadow-md"
          data-aos="fade-left"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          <h3
            className="text-xl font-semibold mb-4"
            data-aos="fade-left"
            data-aos-delay="300"
            data-aos-duration="800"
          >
            Order Items
          </h3>
          <div className="space-y-4">
            {items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={item.productId || item.id}
                  className="flex items-center"
                  data-aos="fade-left"
                  data-aos-delay={400 + index * 100}
                  data-aos-duration="800"
                >
                  <img
                    src={item.image && item.image.length > 0 ? item.image[0] : "/placeholder.png"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-[#8B5E3C] font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p
                className="text-gray-600"
                data-aos="fade-left"
                data-aos-delay="400"
                data-aos-duration="800"
              >
                No items in your order.
              </p>
            )}
          </div>
          <div
            className="mt-6 text-right"
            data-aos="zoom-in"
            data-aos-delay="600"
            data-aos-duration="800"
          >
            <p className="text-lg font-semibold">
              Total: <span className="text-[#8B5E3C]">₦{totalPrice.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout_components;