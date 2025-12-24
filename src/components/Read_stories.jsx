import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // ✅ adjust import if needed

const Read_stories = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const docRef = doc(db, 'stories', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStory(docSnap.data());
        } else {
          console.log('No story found for this product');
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  if (loading) {
    return (
      <section className="py-20 text-center text-gray-600 bg-[#f7ead7]">
        <p>Loading story...</p>
      </section>
    );
  }

  if (!story) {
    return (
      <section className="py-20 text-center text-gray-600 bg-[#f7ead7]">
        <p>No story found for this product.</p>
      </section>
    );
  }

  return (
    <section 
      className="py-12 px-4 sm:px-6 lg:px-8 bg-[#f7ead7]"
      data-aos="fade-in"
      data-aos-duration="800"
    >
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav 
          className="text-sm text-gray-600 mb-6"
          data-aos="fade-right"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          <Link to="/" className="hover:text-yellow-500">Home</Link> / 
          <Link to="/products" className="hover:text-yellow-500">Shop</Link> / 
          <Link to={`/product/${id}`} className="hover:text-yellow-500">Product</Link> / 
          <span>Read the Story</span>
        </nav>

        {/* Story layout */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          

          {/* Story Image */}
          {story.image && (
            <div
              className="flex justify-center md:justify-end"
              data-aos="fade-left"
              data-aos-delay="300"
              data-aos-duration="800"
            >
              <Link to={`/art/${id}`}>
                <img 
                  src={story.image} 
                  alt={story.title} 
                  className="rounded-2xl shadow-lg max-h-[500px] object-cover cursor-pointer transform transition-transform duration-300 hover:scale-105"
                />
              </Link>
            </div>
          )}
          
          {/* Story Text */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-6">
              {story.title || 'Untitled Story'}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed whitespace-pre-line">
              {story.content || 'No story content available.'}
            </p>

            {/* Back to Product Button */}
            <Link 
              to={`/product/${id}`} 
              className="inline-flex items-center text-[#8B5E3C] hover:text-[#6B4423] font-semibold mt-8 transition text-base sm:text-lg"
              data-aos="fade-left"
              data-aos-delay="400"
              data-aos-duration="800"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Product
            </Link>
          </div>

          

        </div>
      </div>
    </section>
  );
};

export default Read_stories;
