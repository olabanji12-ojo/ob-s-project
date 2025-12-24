import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import Pagination from './utils/Pagination';

const Art_components = () => {
  const { artworkId } = useParams();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const highlightedArtworkRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const storiesCollection = collection(db, 'stories');
        const storiesSnapshot = await getDocs(storiesCollection);
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

  useEffect(() => {
    if (!loading && highlightedArtworkRef.current) {
      highlightedArtworkRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [loading, artworks]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArtworks = artworks.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-40 bg-[#FDFCFB]">
        <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-serif italic">Opening the gallery doors...</p>
      </div>
    );
  }

  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FDFCFB]"
      data-aos="fade-in"
      data-aos-duration="1000"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-6"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            The <span className="italic text-[#8B5E3C]">Art</span> Gallery
          </h2>
          <p
            className="text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            A visual retrospective of our journey. Each piece represents a unique narrative woven into the fabric of our brand.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {currentArtworks.map((art, index) => {
            const isHighlighted = art.id === artworkId;
            return (
              <div
                key={art.id}
                ref={isHighlighted ? highlightedArtworkRef : null}
                className={`group relative bg-white p-4 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 ${isHighlighted ? 'ring-4 ring-[#8B5E3C]/20 border-[#8B5E3C]' : ''}`}
                data-aos="fade-up"
                data-aos-delay={100 + index * 100}
              >
                <Link to={`/read_story/${art.id}`} className="block">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-[#FDFCFB] transition-colors">
                    {/* Fixed Image handling: Use object-contain to show full image if aspect ratio differs */}
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 p-4"
                      onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        View Story
                      </span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-xl font-serif font-bold text-gray-900 group-hover:text-[#8B5E3C] transition-colors">{art.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-8 h-[1px] bg-[#F4C430]"></span>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Featured Artwork</p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={artworks.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default Art_components;


