import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Pagination from "./utils/Pagination";

const Product_component = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-40 bg-[#FDFCFB]">
        <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-serif italic">Curating our collection...</p>
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
          <nav
            className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-6"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <Link to="/" className="hover:text-[#8B5E3C] transition-colors">
              Home
            </Link>{" "}
            <span className="mx-2">/</span> <span className="text-gray-900">Shop</span>
          </nav>
          <h2
            className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-6"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            The Artisan <span className="italic text-[#8B5E3C]">Tote</span> Collection
          </h2>
          <p
            className="text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Explore our meticulously handcrafted pieces, where traditional craftsmanship meets contemporary utility.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-gray-400 font-serif italic text-xl">No treasures found in our vault yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {currentProducts.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative"
                  data-aos="fade-up"
                  data-aos-delay={100 + index * 50}
                >
                  <Link to={`/product/${item.id}`} className="block overflow-hidden rounded-2xl bg-gray-100 aspect-[4/5] relative">
                    <img
                      src={item.image && item.image.length > 0 ? item.image[0] : "/placeholder.jpg"}
                      alt={item.name}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                    {item.stock <= 5 && item.stock > 0 && (
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#8B5E3C] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm">
                        Only {item.stock} left
                      </span>
                    )}
                    {item.stock === 0 && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-white/90 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </Link>

                  <div className="mt-6 flex flex-col items-center">
                    <h3 className="text-lg font-serif font-bold text-gray-900 group-hover:text-[#8B5E3C] transition-colors">{item.name}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <p className="text-[#8B5E3C] font-bold text-sm tracking-wide">
                        ₦{item.price?.toLocaleString()}
                      </p>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Handcrafted</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={products.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default Product_component;