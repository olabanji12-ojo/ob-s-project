import React from 'react';

const About_section = () => {
  return (
    <section 
      className="py-12 px-4 sm:px-6 lg:px-8 bg-[#f7ead7] text-center"
      data-aos="fade-in"
      data-aos-duration="800"
    >
      <div className="max-w-3xl mx-auto">
        <h2 
          className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-6"
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          About Our Craft
        </h2>
        <p 
          className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8"
          data-aos="fade-up"
          data-aos-delay="200"
          // data-aos-duration="800"
        >
          At Artisan Totes, we believe that every object we carry should have meaning. Our tote bags are more than just accessories—they're companions on your journey, each one crafted with intention and linked to a story that will inspire you. From the golden paths of sunset walks to the whispers of ocean waves, every design is born from real experiences and crafted by hands that care. When you choose one of our bags, you're not just buying a product; you're becoming part of a narrative.
        </p>
      </div>
    </section>
  );
};

export default About_section;