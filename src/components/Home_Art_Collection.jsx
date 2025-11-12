import React, { useState, useEffect } from 'react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { Link } from 'react-router-dom';

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
          spacing: 25,
        },
      },
    },
  });

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const storiesCollection = collection(db, 'stories');
        const q = query(storiesCollection, limit(3));
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
      <section className="py-20 text-center text-gray-600 bg-[#f7ead7]">
        <p>Loading artworks...</p>
      </section>
    );
  }

  // Check if slider is properly initialized
  const isSliderReady = loaded && instanceRef.current && instanceRef.current.track?.details?.slides;
  const totalSlides = isSliderReady ? instanceRef.current.track.details.slides.length : 0;

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

      <div className="navigation-wrapper">
        <div ref={sliderRef} className="keen-slider">
          {artworks.map(art => (
            <div key={art.id} className="keen-slider__slide">
              <Link to={`/read_story/${art.id}`}>
                <div className="rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-96 object-cover"
                  />
                  <div className="p-4 bg-white">
                    <h3 className="text-lg font-bold text-gray-800">{art.title}</h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows - Only show when slider is ready */}
        {isSliderReady && (
          <>
            <Arrow
              left
              onClick={(e) => {
                e.stopPropagation();
                instanceRef.current?.prev();
              }}
              disabled={currentSlide === 0}
            />

            <Arrow
              onClick={(e) => {
                e.stopPropagation();
                instanceRef.current?.next();
              }}
              disabled={currentSlide === totalSlides - 1}
            />
          </>
        )}
      </div>
      
      {/* Dots Navigation - Only show when slider is ready */}
      {isSliderReady && (
        <div className="dots">
          {[...Array(totalSlides).keys()].map((idx) => (
            <button
              key={idx}
              onClick={() => {
                instanceRef.current?.moveToIdx(idx);
              }}
              className={"dot" + (currentSlide === idx ? " active" : "")}
            ></button>
          ))}
        </div>
      )}
    </section>
  );
};

function Arrow(props) {
  const disabled = props.disabled ? " arrow--disabled" : "";
  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${
        props.left ? "arrow--left" : "arrow--right"
      } ${disabled}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  );
}

export default Home_Art_Collection;