import React from 'react';

const About_section = () => {
  return (
    <section 
      className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-[#f7ead7]"
      data-aos="fade-in"
      data-aos-duration="800"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div 
          className="md:pr-8"
          data-aos="fade-right"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          <h2 
            className="text-3xl sm:text-4xl font-serif text-center font-bold text-gray-800 mb-6"
          >
            About Our Craft
          </h2>
          <p 
            className="text-base sm:text-lg text-gray-600 leading-relaxed"
          >
            At Artisan Totes, we believe that every object we carry should have meaning. Our tote bags are more than just accessories—they're companions on your journey, each one crafted with intention and linked to a story that will inspire you. From the golden paths of sunset walks to the whispers of ocean waves, every design is born from real experiences and crafted by hands that care. When you choose one of our bags, you're not just buying a product; you're becoming part of a narrative.
          </p>
        </div>
        <div
          data-aos="fade-left"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          <img 
            src="https://res.cloudinary.com/dhgkmjnvl/image/upload/v1762972416/tote-bags/logo%202.png" 
            alt="Artisan crafting a tote bag"
            className="rounded-2xl shadow-lg w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default About_section;