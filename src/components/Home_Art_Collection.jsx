import React, { useState, useEffect } from 'react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Home_Art_Collection = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    loop: true,
    slides: {
      perView: 1,
      spacing: 15,
    },
    breakpoints: {
      '(min-width: 768px)': {
        slides: {
          perView: 2,
          spacing: 20,
        },
      },
      '(min-width: 1024px)': {
        slides: {
          perView: 3,
          spacing: 30,
        },
      },
    },
  });

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const storiesCollection = collection(db, 'stories');
        const q = query(storiesCollection, limit(6)); // Increased limit for better slider experience
        const storiesSnapshot = await getDocs(q);
        const artworksData = storiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setArtworks(artworksData);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-[#FDFCFB] flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-serif italic">Loading exhibition...</p>
      </section>
    );
  }

  const isSliderReady = loaded && instanceRef.current;

  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FDFCFB]"
      data-aos="fade-up"
      data-aos-duration="1000"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#8B5E3C] font-black mb-4">The Narrative Gallery</h2>
            <h3 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 leading-tight">
              Stories <span className="italic font-light">Beyond</span> The Canvas
            </h3>
          </div>
          <div className="flex gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                instanceRef.current?.prev();
              }}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                instanceRef.current?.next();
              }}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all shadow-sm active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="navigation-wrapper group">
          <div ref={sliderRef} className="keen-slider">
            {artworks.map(art => (
              <div key={art.id} className="keen-slider__slide pb-12">
                <Link to={`/read_story/${art.id}`} className="block group/card">
                  <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 group-hover/card:-translate-y-2">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover grayscale-[20%] group-hover/card:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                      <p className="text-[10px] uppercase tracking-widest text-[#F4C430] font-black mb-2 opacity-0 group-hover/card:opacity-100 transition-all duration-500 transform translate-y-4 group-hover/card:translate-y-0">The Story</p>
                      <h4 className="text-2xl font-serif font-bold text-white leading-tight">{art.title}</h4>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Link
            to="/art"
            className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1 hover:text-[#8B5E3C] hover:border-[#8B5E3C] transition-all"
          >
            Explore Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home_Art_Collection;