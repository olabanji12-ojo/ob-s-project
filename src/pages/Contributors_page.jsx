import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Quote, Feather } from 'lucide-react';

const Contributors_page = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'contributors'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setContributors(data);
      } catch (error) {
        console.error("Error fetching contributors: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContributors();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] poppins-regular">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl poppins-bold mb-6 text-[#3E3E3E]">
          Our Amazing <span className="text-[#F4C430]">Contributors</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
          Meet the talented writers, editors, and volunteers who bring our stories to life. 
          We are incredibly grateful for their dedication and creativity.
        </p>
      </div>

      {/* Contributors Grid */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#F4C430] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading contributors...</p>
          </div>
        ) : contributors.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <p className="text-xl font-medium text-gray-500">No contributors found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contributors.map((contributor) => (
              <div 
                key={contributor.id} 
                className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col h-full"
              >
                <div className="flex-1 relative z-10">
                  {/* Top Icon & Role */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#3E3E3E] text-[#F4C430] flex items-center justify-center shadow-lg shrink-0">
                      <Feather size={20} />
                    </div>
                    <span className="bg-[#F4C430]/10 text-[#D4A017] px-4 py-1.5 rounded-full text-xs poppins-bold uppercase tracking-wider text-right ml-4">
                      {contributor.role}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-2xl poppins-bold text-[#3E3E3E] mb-4">
                    {contributor.name}
                  </h3>

                  {/* Bio */}
                  <div className="relative">
                    <p className="text-gray-600 text-sm leading-relaxed poppins-regular relative z-10 pb-4">
                      {contributor.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contributors_page;
