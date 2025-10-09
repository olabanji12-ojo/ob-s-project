import React from 'react';
import { Link } from 'react-router-dom';

const Read_stories = () => {
  return (
    <section 
      className="py-12 px-4 sm:px-6 lg:px-8 bg-[#f7ead7]"
      data-aos="fade-in"
      data-aos-duration="800"
    >
      <div className="max-w-3xl mx-auto">
        <nav 
          className="text-sm text-gray-600 mb-6"
          data-aos="fade-right"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          <Link to="/" className="hover:text-yellow-500">Home</Link> / 
          <Link to="/products" className="hover:text-yellow-500">Shop</Link> / 
          <Link to="/productId" className="hover:text-yellow-500">Forest Tales Tote</Link> / 
          <span>Read the Story</span>
        </nav>
        <h2 
          className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-6"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          The Story of Forest Tales Tote
        </h2>
        <p 
          className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8"
          data-aos="fade-up"
          data-aos-delay="300"
          data-aos-duration="800"
        >
          Inspired by the serene beauty of ancient forests, the Forest Tales Tote was born from a journey through the whispering woods. Our artisan, Amina, spent days sketching the delicate interplay of light and shadow among the trees, capturing the essence of nature’s quiet strength. Each leaf pattern is hand-printed with eco-friendly ink, a tribute to the sustainable practices that guide our craft. This tote is more than a bag—it’s a piece of the forest you can carry with you, a reminder of nature’s enduring stories.
        </p>
        <Link 
          to="/productId" 
          className="text-yellow-500 hover:underline text-sm inline-block"
          data-aos="fade-left"
          data-aos-delay="400"
          data-aos-duration="800"
        >
          ← Back to Product
        </Link>
      </div>
    </section>
  );
};

export default Read_stories;