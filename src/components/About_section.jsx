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
            About Our Collection
          </h2>
          <div className="space-y-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            <p>Knots’ Stories is a community of storytellers, proudly and creatively sharing African stories, art and fashion.</p>
            <p>The Forty Faces of Knots tote bag collection is an original concept of Knots’ stories. The collection celebrates our Individuality and Identity through unique characters, each one telling their story. The bags are specially designed to carry a likeness of the characters, every patch, every stitch playing its own role in shaping the story of the characters.</p>
            <p>The Forty Faces of Knots tote bag collection is more than a bag. It's a concept that combines elements of art, storytelling and fashion.</p>
          </div>
        </div>
        <div
          data-aos="fade-left"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          <img 
            src="https://res.cloudinary.com/dhgkmjnvl/image/upload/v1768605584/tote-bags/footer.jpg     
" 
            alt="Artisan crafting a tote bag"
            className="rounded-2xl shadow-lg w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default About_section;