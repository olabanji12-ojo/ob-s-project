import React from 'react';
import { Link } from 'react-router-dom';

const Product_component = () => {
  return (
    <section 
      className="py-12 px-4 sm:px-6 lg:px-8 bg-[#f7ead7]"
      data-aos="fade-in"
      data-aos-duration="800"
    >
      <div className="text-center mb-10">
        <nav 
          className="text-sm text-gray-600 mb-4"
          data-aos="fade-right"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          <Link to="/" className="hover:text-yellow-500">Home</Link> / <span>Shop</span>
        </nav>
        <h2 
          className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-2"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          Our Tote Bags
        </h2>
        <p 
          className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="300"
          data-aos-duration="800"
        >
          Browse our complete collection of handcrafted artisanal tote bags
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {[
          { id: 't1', src: '/totebag1.jpg', alt: 'Sunset Paths Tote', name: 'Sunset Paths Tote', price: 15000, delay: 400 },
          { id: 't2', src: '/totebag2.jpg', alt: 'Ocean Whispers Tote', name: 'Ocean Whispers Tote', price: 16500, delay: 500 },
          { id: 't3', src: '/totebag3.jpg', alt: 'Forest Tales Tote', name: 'Forest Tales Tote', price: 15000, delay: 600 },
          { id: 't4', src: '/totebag4.jpg', alt: 'Golden Harvest Tote', name: 'Golden Harvest Tote', price: 17000, delay: 700 },
          { id: 't5', src: '/totebag5.jpg', alt: 'Golden Harvest Tote', name: 'Golden Harvest Tote', price: 17000, delay: 800 },
          { id: 't6', src: '/totebag6.jpeg', alt: 'Golden Harvest Tote', name: 'Golden Harvest Tote', price: 17000, delay: 900 },
          { id: 't7', src: '/totebag7.jpeg', alt: 'Golden Harvest Tote', name: 'Golden Harvest Tote', price: 17000, delay: 1000 },
        ].map((item, index) => (
          <div 
            key={index}
            className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out"
            data-aos="fade-up"
            data-aos-delay={item.delay}
            data-aos-duration="500"
          >
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="text-yellow-600 font-bold mt-2">₦{item.price.toLocaleString()}</p>
            <Link
              to={`/product/${item.id}`}
              className="mt-4 inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Product_component;

