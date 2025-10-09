import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Product_id = () => {
  // Product catalog (temporary; replace with Firestore fetch)
  const catalog = useMemo(() => ([
    { id: 't1', name: 'Sunset Paths Tote', price: 15000, description: 'Warm sunset tones with hand-printed patterns.', images: ['/totebag1.jpg', '/totebag2.jpg', '/totebag3.jpg', '/totebag4.jpg'] },
    { id: 't2', name: 'Ocean Whispers Tote', price: 16500, description: 'Calming ocean hues for everyday style.', images: ['/totebag2.jpg', '/totebag1.jpg', '/totebag3.jpg', '/totebag4.jpg'] },
    { id: 't3', name: 'Forest Tales Tote', price: 15000, description: 'Botanical-inspired tote with leaf patterns.', images: ['/totebag3.jpg', '/totebag1.jpg', '/totebag2.jpg', '/totebag4.jpg'] },
    { id: 't4', name: 'Golden Harvest Tote', price: 17000, description: 'Harvest-inspired tones with robust build.', images: ['/totebag4.jpg', '/totebag1.jpg', '/totebag2.jpg', '/totebag3.jpg'] },
    { id: 't5', name: 'Golden Harvest Tote', price: 17000, description: 'Variant of Golden Harvest.', images: ['/totebag5.jpg', '/totebag1.jpg', '/totebag2.jpg', '/totebag3.jpg'] },
    { id: 't6', name: 'Golden Harvest Tote', price: 17000, description: 'Variant of Golden Harvest.', images: ['/totebag6.jpeg', '/totebag1.jpg', '/totebag2.jpg', '/totebag3.jpg'] },
    { id: 't7', name: 'Golden Harvest Tote', price: 17000, description: 'Variant of Golden Harvest.', images: ['/totebag7.jpeg', '/totebag1.jpg', '/totebag2.jpg', '/totebag3.jpg'] },
  ]), []);

  const { id } = useParams();
  const product = useMemo(() => catalog.find(p => p.id === id) || catalog[0], [catalog, id]);

  // State for carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // State for quantity
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Carousel navigation
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  // Quantity handlers
  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Add to cart handler
  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      navigate('/cart_page');
    } catch (e) {
      console.error('Add to cart failed:', e);
    }
  };

  return (
    <section
      className="py-12 px-4 sm:px-6 lg:px-8 bg-[#f7ead7]"
      data-aos="fade-in"
      data-aos-duration="800"
    >
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav
          className="text-sm text-gray-600 mb-6"
          data-aos="fade-right"
          data-aos-delay="100"
          data-aos-duration="800"
        >
          <Link to="/" className="hover:text-[#F4C430]">
            Home
          </Link>{' '}
          /{' '}
          <Link to="/products" className="hover:text-[#F4C430]">
            Shop
          </Link>{' '}
          / <span>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Image Carousel */}
          <div
            className="space-y-4"
            data-aos="fade-left"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            {/* Main Image Display */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Navigation Arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                <span>{currentImageIndex + 1}</span> / <span>{product.images.length}</span>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    currentImageIndex === index ? 'border-[#8B5E3C]' : 'border-gray-300'
                  }`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Name */}
            <h1
              className="text-3xl sm:text-4xl font-serif font-bold text-gray-800"
              data-aos="fade-right"
              data-aos-delay="300"
              data-aos-duration="800"
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div
              className="flex items-center gap-2"
              data-aos="fade-right"
              data-aos-delay="400"
              data-aos-duration="800"
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <span className="text-gray-600">(24 reviews)</span>
            </div>

            {/* Price */}
            <p
              className="text-4xl font-bold text-[#8B5E3C]"
              data-aos="fade-right"
              data-aos-delay="500"
              data-aos-duration="800"
            >
              ₦{product.price.toLocaleString()}
            </p>

            {/* Description */}
            <div
              className="border-t border-b border-gray-200 py-6"
              data-aos="fade-right"
              data-aos-delay="600"
              data-aos-duration="800"
            >
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#8B5E3C] hover:bg-[#6B4423] text-white font-bold py-4 rounded-lg transition duration-300 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl"
              data-aos="zoom-in"
              data-aos-delay="800"
              data-aos-duration="800"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Add to Cart - ₦{(product.price * quantity).toLocaleString()}
            </button>

            {/* Read the Story Link */}
            <Link
              to="/read_story"
              className="text-[#F4C430] hover:underline text-sm block"
              data-aos="fade-left"
              data-aos-delay="900"
              data-aos-duration="800"
            >
              Read the Story
            </Link>
          </div>
        </div>

        {/* Back to Shop */}
        <Link
          to="/products"
          className="inline-flex items-center text-[#8B5E3C] hover:text-[#6B4423] font-semibold mt-6 transition"
          data-aos="fade-left"
          data-aos-delay="1000"
          data-aos-duration="800"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Shop
        </Link>
      </div>
    </section>
  );
};

export default Product_id;