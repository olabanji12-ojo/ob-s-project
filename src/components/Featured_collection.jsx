import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../firebase/firebase";

const Featured_collection = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const q = query(collection(db, "products"), limit(3));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeatured(data);
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading featured collection...
        </p>
      </div>
    );
  }

  return (
    <section
      className="w-full py-12 px-4 sm:px-6 lg:px-8"
      data-aos="fade-in"
      data-aos-duration="800"
    >
      <div className="text-center mb-10">
        <h2
          className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-2"
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          View Collectibles
        </h2>
        <p
          className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="800"
        >
          Each tote is carefully crafted by skilled artisans and comes with its own story.
        </p>
      </div>

      {featured.length === 0 ? (
        <p className="text-center text-gray-600">
          No featured products available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featured.map((item, index) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out"
              data-aos="fade-up"
              data-aos-delay={300 + index * 100}
              data-aos-duration="800"
            >
              <img
                src={item.image && item.image.length > 0 ? item.image[0] : "/placeholder.jpg"}
                alt={item.name}
                className="w-full h-64 object-cover rounded-md mb-4"
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="text-yellow-600 font-bold mt-2">
                ₦{item.price?.toLocaleString()}
              </p>

              {item.stock > 0 ? (
                <p className="text-sm text-green-600 font-medium mt-1">
                  {item.stock} left in stock
                </p>
              ) : (
                <p className="text-sm text-red-500 font-medium mt-1">Out of stock</p>
              )}

              <Link
                to={`/product/${item.id}`}
                className={`mt-4 inline-block ${item.stock > 0
                    ? "bg-yellow-400 hover:bg-yellow-500"
                    : "bg-gray-400 cursor-not-allowed"
                  } text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors duration-300`}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      <div
        className="text-center mt-8"
        data-aos="zoom-in"
        data-aos-delay="600"
        data-aos-duration="800"
      >
        <Link
          to="/products"
          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default Featured_collection;