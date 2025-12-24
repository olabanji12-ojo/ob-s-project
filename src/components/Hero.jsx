import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden bg-[#FDFCFB] flex items-center">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f7f3f0] -skew-x-12 translate-x-1/2 z-0 hidden lg:block"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Content: Narrative */}
        <div data-aos="fade-right" data-aos-duration="1200">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-[#8B5E3C]/10 rounded-full mb-6"
          >
            <span className="w-2 h-2 bg-[#8B5E3C] rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B5E3C]">Bomffa Heritage</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-serif font-black text-gray-900 leading-[1.1] mb-8">
            Every Bag <br />
            <span className="italic text-[#8B5E3C] relative shadow-accent">
              Tells
            </span> A Story
          </h1>

          <p className="text-xl text-gray-500 font-light leading-relaxed max-w-xl mb-12">
            Discover handcrafted tote bags, each woven with care and connected to
            a unique narrative. Where artisanal quality meets storytelling.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="bg-gray-900 hover:bg-[#8B5E3C] text-white px-10 py-5 rounded-2xl font-bold transition-all duration-500 shadow-xl shadow-gray-900/10 active:scale-95 text-center"
            >
              Explore Collection
            </Link>
            <Link
              to="/art"
              className="border-2 border-gray-100 hover:border-[#F4C430] px-10 py-5 rounded-2xl font-bold transition-all duration-500 text-center"
            >
              View Art Gallery
            </Link>
          </div>
        </div>

        {/* Right Content: Immersive Image Container */}
        <div
          className="relative aspect-[4/5] lg:aspect-auto lg:h-[70vh] rounded-[3rem] overflow-hidden shadow-2xl group"
          data-aos="fade-left"
          data-aos-duration="1200"
        >
          <img
            src="https://res.cloudinary.com/dhgkmjnvl/image/upload/v1762972408/tote-bags/Knotstory2.png"
            alt="Artisanal Tote Bag"
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

          <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-white">
            <p className="font-serif italic text-lg line-clamp-2">"This isn't just a bag; it's a piece of the soul woven into canvas."</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest">Handmade in Nigeria</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Est. 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Micro-details */}
      <div className="absolute bottom-10 left-10 opacity-10 pointer-events-none hidden lg:block">
        <span className="text-9xl font-serif font-black text-gray-900">OB</span>
      </div>
    </section>
  );
};

export default Hero;
