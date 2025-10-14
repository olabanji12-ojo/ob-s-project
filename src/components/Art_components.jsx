import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Art_components = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const artItems = [
    { id: 'a1', src: '/art1.jpg', alt: 'Abstract Harmony', title: 'Abstract Harmony', artist: 'Local Artist' },
    { id: 'a2', src: '/art2.jpg', alt: 'Sunset Dreams', title: 'Sunset Dreams', artist: 'Local Artist' },
    { id: 'a3', src: '/art3.jpg', alt: 'Urban Tales', title: 'Urban Tales', artist: 'Local Artist' },
    { id: 'a4', src: '/art4.jpg', alt: 'Nature\'s Echo', title: 'Nature\'s Echo', artist: 'Local Artist' },
    { id: 'a5', src: '/art5.jpg', alt: 'Golden Hour', title: 'Golden Hour', artist: 'Local Artist' },
  ];

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === artItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, artItems.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? artItems.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === artItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section 
      className="py-12 px-4 sm:px-6 lg:px-8 bg-[#f7ead7]"
      data-aos="fade-in"
      data-aos-duration="800"
    >
      <div className="text-center mb-10">
        <h2 
          className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-2"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          Our Art Collection
        </h2>
        <p 
          className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="300"
          data-aos-duration="800"
        >
          Discover unique artworks from talented local artists
        </p>
      </div>

      <div className="relative">
        {/* Main Carousel Container */}
        <div 
          className="relative overflow-hidden bg-white"
          data-aos="zoom-in"
          data-aos-delay="400"
          data-aos-duration="800"
        >
          {/* Slides */}
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {artItems.map((art) => (
              <div key={art.id} className="min-w-full">
                <div className="relative">
                  <img
                    src={art.src}
                    alt={art.alt}
                    className="w-full h-[500px] sm:h-[600px] lg:h-[700px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-2xl font-serif font-bold text-white mb-1">
                      {art.title}
                    </h3>
                    <p className="text-gray-200 text-sm">by {art.artist}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {artItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'bg-yellow-500 w-8 h-3'
                  : 'bg-gray-400 w-3 h-3 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="text-center mt-4">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isAutoPlaying ? '⏸ Pause Auto-play' : '▶ Resume Auto-play'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Art_components;