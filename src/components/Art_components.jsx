import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const Art_components = () => {
  const { artworkId } = useParams();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const highlightedArtworkRef = useRef(null);

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
  }, [loading, artworks]); // Also depend on artworks to ensure it runs after they are set

  if (loading) {
    return (
      <section className="py-20 text-center text-gray-600 bg-[#f7ead7]">
        <p>Loading artworks...</p>
      </section>
    );
  }

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artworks.map(art => {
          const isHighlighted = art.id === artworkId;
          return (
            <div 
              key={art.id} 
              ref={isHighlighted ? highlightedArtworkRef : null}
              className={`rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 ${isHighlighted ? 'ring-4 ring-yellow-500 ring-offset-2' : ''}`}
            >
              <Link to={`/read_story/${art.id}`}>
              <div
                style={{ backgroundImage: `url(${art.image})` }}
                className="w-full h-64 bg-cover bg-center"
              ></div></Link>
              <div className="p-4 bg-white">
                <h3 className="text-lg font-bold text-gray-800">{art.title}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Art_components;


