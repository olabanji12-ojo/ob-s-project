import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
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
              <div
                style={{ backgroundImage: `url(${art.image})` }}
                className="w-full h-64 bg-cover bg-center"
              ></div>
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


// author
// content
// createdAt
// image
// title

// Inspired by the serene beauty of ancient forests, the Forest Tales Tote was born from a journey through the whispering woods. Our artisan, Amina, spent days sketching the delicate interplay of light and shadow among the trees, capturing the essence of nature’s quiet strength. Each leaf pattern is hand-printed with eco-friendly ink, a tribute to the sustainable practices that guide our craft. This tote is more than a bag—it’s a piece of the forest you can carry with you, a reminder of nature’s enduring stories.

// The Story of Forest Tales Tote

const toteBagImages = [
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856205/tote-bags/1..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856217/tote-bags/2..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856229/tote-bags/3..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856238/tote-bags/4..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856239/tote-bags/5..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856239/tote-bags/6..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856240/tote-bags/7..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856242/tote-bags/8..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856242/tote-bags/9..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856206/tote-bags/10..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856207/tote-bags/11..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856209/tote-bags/12..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856210/tote-bags/13..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856211/tote-bags/14..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856212/tote-bags/15..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856213/tote-bags/16..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856214/tote-bags/17..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856215/tote-bags/18..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856216/tote-bags/19..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856218/tote-bags/20..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856219/tote-bags/21..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856220/tote-bags/22..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856221/tote-bags/23.%20%281%29.jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856222/tote-bags/23..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856223/tote-bags/24.%20%281%29.jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856224/tote-bags/24..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856225/tote-bags/25..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856226/tote-bags/26..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856227/tote-bags/27..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856228/tote-bags/28..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856229/tote-bags/29..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856230/tote-bags/30..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856231/tote-bags/31..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856232/tote-bags/32..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856233/tote-bags/33..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856234/tote-bags/34..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856235/tote-bags/35..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856237/tote-bags/36..jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856243/tote-bags/Cyril.jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856244/tote-bags/Kwaku.jpg",
  "https://res.cloudinary.com/dhgkmjnvl/image/upload/v1761856245/tote-bags/Oma.jpg"
];