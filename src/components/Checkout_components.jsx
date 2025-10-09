import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Checkout_components = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
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
  const cartItems = [
    {
      id: 1,
      name: 'Forest Tales Tote',
      image: '/totebag1.jpg',
      quantity: 1,
      total: 15500,
    },
    {
      id: 2,
      name: 'Ocean Whispers Tote',
      image: '/totebag2.jpg',
      quantity: 2,
      total: 33000,
    },
  ];
  const cartTotal = 48500;

  // Fetch user data from Firestore on mount
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

      // Fetch additional user data from Firestore
      const fetchUserData = async () => {
        try {
          console.log('Fetching Firestore data for UID:', currentUser.uid);
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('Firestore data retrieved:', userData);
            setFormData((prev) => ({
              ...prev,
              phone: userData.phone || '',
              address: userData.address || '',
              city: userData.city || '',
              state: userData.state || '',
              zipcode: userData.zipcode || '',
            }));
          } else {
            console.log('No Firestore document found for UID:', currentUser.uid);
          }
        } catch (err) {
          console.error('Error fetching user data:', err.message, err.code);
          setError('Failed to load user data. Please try again.');
        }
      };
      fetchUserData();
    } else {
      console.log('No authenticated user. Should redirect to /signup via PrivateCheckoutRoute.');
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted. Current user:', currentUser);
    setError('');
    setLoading(true);

    if (!currentUser) {
      console.log('No authenticated user. Redirecting to /signup.');
      setError('You must be logged in to proceed with checkout.');
      navigate('/signup_page');
      setLoading(false);
      return;
    }

    try {
      console.log('Saving data to Firestore for UID:', currentUser.uid);
      await setDoc(
        doc(db, 'users', currentUser.uid),
        {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
        },
        { merge: true }
      );
      console.log('Firestore data saved successfully.');

      // Placeholder for payment integration
      console.log('Checkout submitted:', { formData, cartItems, cartTotal });
      alert('Form submitted! (Payment integration placeholder)');
      // TODO: Integrate payment gateway (e.g., Paystack, Stripe)
      // navigate('/payment-success'); // Example redirect after payment
    } catch (err) {
      console.error('Error saving data:', err.message, err.code);
      setError(
        err.code === 'permission-denied'
          ? 'Permission denied. Please check Firestore rules.'
          : 'Failed to process checkout. Please try again.'
      );
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
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:border-[#F4C430] transition-colors"
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
                Total: <span className="text-[#8B5E3C]">₦{cartTotal.toLocaleString()}</span>
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
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center"
                  data-aos="fade-left"
                  data-aos-delay={400 + index * 100}
                  data-aos-duration="800"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-[#8B5E3C] font-semibold">₦{item.total.toLocaleString()}</p>
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
              Total: <span className="text-[#8B5E3C]">₦{cartTotal.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout_components;