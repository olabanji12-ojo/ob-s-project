import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { db } from '../firebase/firebase';
import { doc, setDoc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'; 
import { useNavigate, Link } from 'react-router-dom';


const Checkout_components = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [shippingFee, setShippingFee] = useState(0);

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
      // Note: We could use showNotification here if we passed it in, but alert is fine for now as per plan
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

  // Sync shipping fee whenever city changes (including on profile load)
  useEffect(() => {
    if (formData.city === 'Lagos') {
      setShippingFee(2500);
    } else if (formData.city === 'Ibadan') {
      setShippingFee(3500);
    } else {
      setShippingFee(0);
    }
  }, [formData.city]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'city') {
      let state = 'Oyo'; 
      if (value === 'Lagos') state = 'Lagos';
      setFormData(prev => ({ ...prev, city: value, state: state }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
        amount: (totalPrice + shippingFee) * 100,
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
                totalPrice: totalPrice + shippingFee
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
              // Save to shipping/orders collection for Admin Dashboard
              await addDoc(collection(db, 'orders'), {
                userId: currentUser.uid,
                formData: formData,
                items: items,
                totalPrice: totalPrice,
                shippingFee: shippingFee,
                grandTotal: totalPrice + shippingFee,
                createdAt: serverTimestamp(),
                status: 'paid'
              });

              // Reduce stock
              await updateProductStock(items);

              clearCart();
              navigate("/payment-success", {
                state: {
                  reference: transaction.reference,
                  amount: (totalPrice + shippingFee) * 100,
                  status: transaction.status || 'success'
                }
              });
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

          {/* Disclaimer Box */}
          <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg" data-aos="fade-up">
            <div className="flex gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1">Shipping Disclaimer</p>
                <p className="text-sm font-medium leading-relaxed">
                  We currently offer direct shipping selection for <span className="font-bold">Lagos</span> and <span className="font-bold">Ibadan</span> only. 
                </p>
                <p className="text-xs mt-2 opacity-80">
                  Staying elsewhere? <Link to="/contact" className="underline font-bold hover:text-yellow-900">Contact us for a special delivery quote</Link>.
                </p>
              </div>
            </div>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit}>
            {/* City Selection First */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-aos="fade-right">
              <div>
                <label htmlFor="city" className="block text-sm font-black uppercase text-gray-400 tracking-widest mb-2">
                  Delivery City
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 text-gray-900 focus:ring-4 focus:ring-yellow-500/10 transition-all font-medium appearance-none"
                  required
                >
                  <option value="">Select your city...</option>
                  <option value="Lagos">Lagos (₦2,500)</option>
                  <option value="Ibadan">Ibadan (₦3,500)</option>
                </select>
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-black uppercase text-gray-400 tracking-widest mb-2">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  readOnly
                  className="w-full bg-gray-100 border-0 rounded-2xl px-5 py-4 text-gray-500 font-medium cursor-not-allowed"
                  placeholder="Computed from City"
                />
              </div>
            </div>

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
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shippingFee > 0 ? `₦${shippingFee.toLocaleString()}` : "Select city"}</span>
              </div>
              <div className="h-px bg-gray-100 my-4"></div>
              <div className="flex justify-between text-xl font-black text-gray-900 border-t pt-4">
                <span>Total</span>
                <span className="text-[#8B5E3C]">₦{(totalPrice + shippingFee).toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              id="place-order-btn"
              disabled={loading || shippingFee === 0}
              className={`w-full bg-gray-900 text-white py-5 px-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#8B5E3C] transition duration-300 shadow-xl ${loading || shippingFee === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
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