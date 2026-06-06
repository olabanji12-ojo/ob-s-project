import React from 'react';
import { contributorsData } from '../utils/contributorsData';

const Contributors_page = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans">
      {/* Hero Section */}
      <div className="relative pt-24 pb-20 px-4 text-center overflow-hidden bg-[#3E3E3E] text-white">
        {/* Golden Gradient Orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#F4C430] rounded-full mix-blend-overlay filter blur-[100px] opacity-30 -translate-x-1/2 -translate-y-1/2 animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#F4C430] rounded-full mix-blend-overlay filter blur-[120px] opacity-20 translate-x-1/4 translate-y-1/4 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white">
            Our Amazing <span className="text-[#F4C430] inline-block relative">Contributors
              <svg className="absolute w-full h-3 -bottom-2 left-0 text-[#F4C430]/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/>
              </svg>
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-300 leading-relaxed">
            Meet the talented writers, editors, and volunteers who bring our stories to life. 
            We are incredibly grateful for their dedication and creativity.
          </p>
        </div>
      </div>

      {/* Contributors Grid */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {contributorsData.map((contributor) => (
            <div 
              key={contributor.id} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 group"
            >
              {/* Image Container */}
              <div className="w-full h-64 overflow-hidden relative">
                <img 
                  src={contributor.image} 
                  alt={contributor.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Details */}
              <div className="p-6 relative">
                <div className="absolute -top-6 right-6 bg-[#F4C430] text-[#3E3E3E] w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                  ★
                </div>
                <h3 className="text-xl font-bold text-[#3E3E3E] mb-1">{contributor.name}</h3>
                <p className="text-sm font-semibold text-[#F4C430] mb-3">{contributor.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {contributor.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contributors_page;
