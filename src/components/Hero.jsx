import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // 👈 Animation library

const Hero = () => {
  return (
    <section className="relative h-[600px] md:h-[650px] lg:h-[700px] w-full overflow-hidden bg-brown-800">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-[#f7ead7] bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dhgkmjnvl/image/upload/v1762972408/tote-bags/Knotstory2.png')" }}
      >
        <div className="absolute inset-0 bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-[Dancing Script] font-bold text-black mb-4 md:mb-6 leading-tight"
        >
          Every Bag Tells a Story
        </motion.h1>

        {/* Animated Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-black max-w-3xl mb-8 md:mb-10 leading-relaxed px-4"
        >
          Discover handcrafted tote bags, each woven with care and connected to
          a unique narrative. Where artisanal quality meets storytelling.
        </motion.p>

        {/* Button (unchanged) */}
        <Link
          to="/products"
          className="bg-[#F4C430] hover:bg-[#E5B520] text-[#3E3E3E] font-semibold px-4 py-2 rounded-lg text-base transition-all duration-300 hover:shadow-lg"
          data-aos="zoom-in"
          data-aos-delay="300"
          data-aos-duration="800"
        >
          Explore All Tote Bags
        </Link>
      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block"
        data-aos="fade-up"
        data-aos-delay="400"
        data-aos-duration="800"
      >
        <svg 
          className="w-6 h-6 text-white opacity-75" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
