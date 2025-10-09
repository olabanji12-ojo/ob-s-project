import React from 'react';
import { Link } from 'react-router-dom';

const Featured_collection = () => {
  return (
    <section 
      className="py-12 px-4 sm:px-6 lg:px-8"
      data-aos="fade-in"
      data-aos-duration="800"
    >
      <div className="text-center mb-10">
        <h2 
          className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-2"
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          Featured Collection
        </h2>
        <p 
          className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          Each tote is carefully crafted by skilled artisans and comes with its own story.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          { src: '/totebag1.jpg', alt: 'Sunset Paths Tote', name: 'Sunset Paths Tote', price: 15000, delay: 300 },
          { src: '/totebag2.jpg', alt: 'Ocean Whispers Tote', name: 'Ocean Whispers Tote', price: 16500, delay: 400 },
          { src: '/totebag3.jpg', alt: 'Forest Tales Tote', name: 'Forest Tales Tote', price: 15000, delay: 500 },
        ].map((item, index) => (
          <div 
            key={index}
            className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out"
            data-aos="fade-up"
            data-aos-delay={item.delay}
            data-aos-duration="800"
          >
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="text-yellow-600 font-bold mt-2">₦{item.price.toLocaleString()}</p>
            <Link
              to="/productId"
              className="mt-4 inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
      <div 
        className="text-center mt-8"
        data-aos="zoom-in"
        data-aos-delay="600"
        data-aos-duration="800"
      >
        <Link
          to="/products"
          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default Featured_collection;


