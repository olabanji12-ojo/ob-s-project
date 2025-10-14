import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart_components = () => {
  const { items, totalCount, totalPrice, updateQuantity, removeFromCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <section 
      className="py-8 md:py-16 px-4 bg-[#FAF8F5] min-h-screen"
      data-aos="fade-in"
      data-aos-duration="800"
    >
      <div className="max-w-6xl mx-auto">
        <h1 
          className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-8 md:mb-12 text-[#3E3E3E] text-center"
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          Shopping Cart
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items (Left Side - 2/3 width) */}
          <div 
            className="lg:col-span-2 space-y-4 md:space-y-6"
            data-aos="fade-left"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            {items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={item.productId || item.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  data-aos="fade-left"
                  data-aos-delay={300 + index * 100}
                  data-aos-duration="800"
                >
                  {/* Mobile Layout */}
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <img
                      src={item.image && item.image.length > 0 ? item.image[0] : "/placeholder.png"}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded flex-shrink-0"
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                    
                    {/* Product Info & Controls */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      {/* Name and Remove Button Row */}
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-[#3E3E3E] line-clamp-2">
                          {item.name}
                        </h3>
                        <button 
                          onClick={() => removeFromCart(item.productId || item.id)}
                          className="text-red-500 hover:text-red-700 transition flex-shrink-0 p-1"
                          aria-label="Remove item"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Price */}
                      <p className="text-base sm:text-lg text-[#D4785C] font-semibold">
                        ₦{item.price.toLocaleString()}
                      </p>
                      
                      {/* Quantity Controls and Total */}
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <button onClick={() => updateQuantity(item.productId || item.id, (item.quantity || 0) - 1)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition text-[#3E3E3E] font-semibold">
                            −
                          </button>
                          <span className="text-base sm:text-lg font-semibold w-6 sm:w-8 text-center text-[#3E3E3E]">
                            {item.quantity}
                          </span>
                          <button onClick={() => updateQuantity(item.productId || item.id, (item.quantity || 0) + 1)} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition text-[#3E3E3E] font-semibold">
                            +
                          </button>
                        </div>
                        
                        {/* Item Total */}
                        <div className="text-base sm:text-lg font-bold text-[#3E3E3E]">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div 
                className="bg-white rounded-lg p-12 text-center"
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-duration="800"
              >
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                <Link
                  to="/products"
                  className="inline-block bg-[#F4C430] hover:bg-[#E5B520] text-[#3E3E3E] font-semibold px-6 py-3 rounded-lg transition"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary (Right Side - 1/3 width) */}
          <div 
            className="lg:col-span-1"
            data-aos="fade-right"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            <div className="bg-white rounded-lg p-5 sm:p-6 shadow-sm border border-gray-200 lg:sticky lg:top-20">
              <h2 
                className="text-xl sm:text-2xl font-serif font-bold mb-4 sm:mb-6 text-[#3E3E3E]"
                data-aos="fade-right"
                data-aos-delay="300"
                data-aos-duration="800"
              >
                Order Summary
              </h2>
              
              {/* Items */}
              <div 
                className="flex justify-between mb-3 text-sm sm:text-base"
                data-aos="fade-right"
                data-aos-delay="400"
                data-aos-duration="800"
              >
                <span className="text-gray-600">
                  Items ({totalCount})
                </span>
                <span className="text-[#3E3E3E] font-semibold">
                  ₦{totalPrice.toLocaleString()}
                </span>
              </div>
              
              {/* Shipping */}
              <div 
                className="flex justify-between mb-4 sm:mb-6 text-sm sm:text-base"
                data-aos="fade-right"
                data-aos-delay="450"
                data-aos-duration="800"
              >
                <span className="text-gray-600">Shipping</span>
                <span className="text-[#3E3E3E] font-semibold">Free</span>
              </div>
              
              {/* Divider */}
              <div 
                className="border-t border-gray-300 my-4"
                data-aos="fade-right"
                data-aos-delay="500"
                data-aos-duration="800"
              ></div>
              
              {/* Total */}
              <div 
                className="flex justify-between mb-6"
                data-aos="fade-right"
                data-aos-delay="550"
                data-aos-duration="800"
              >
                <span className="text-lg sm:text-xl font-bold text-[#3E3E3E]">Total</span>
                <span className="text-lg sm:text-xl font-bold text-[#3E3E3E]">
                  ₦{totalPrice.toLocaleString()}
                </span>
              </div>
              
              {/* Proceed to Checkout */}
              <button
                onClick={async () => {
                  navigate('/checkout_page')
                }}
                className="w-full text-center bg-[#F4C430] hover:bg-[#E5B520] text-[#3E3E3E] font-semibold py-3 sm:py-3.5 rounded-lg mb-3 transition duration-300 shadow-sm hover:shadow-md"
                data-aos="zoom-in"
                data-aos-delay="600"
                data-aos-duration="800"
              >
                Proceed to Checkout
              </button>
              
              {/* Continue Shopping */}
              <Link
                to="/products"
                className="block text-center text-[#3E3E3E] hover:text-[#F4C430] font-semibold transition duration-300 py-2"
                data-aos="zoom-in"
                data-aos-delay="650"
                data-aos-duration="800"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart_components;