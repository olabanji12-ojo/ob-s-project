import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { QRCodeSVG } from 'qrcode.react';

const Product_id = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch product details from Firestore
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("No product ID found in the URL.");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Product not found.");
          setTimeout(() => navigate("/products"), 2000);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // Handle image navigation
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      product.image && product.image.length > 0 
        ? (prev - 1 + product.image.length) % product.image.length 
        : 0
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      product.image && product.image.length > 0 
        ? (prev + 1) % product.image.length 
        : 0
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  // Add to Cart
  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      navigate("/cart_page");
    } catch (e) {
      console.error("Add to cart failed:", e);
      alert("Could not add to cart. Please try again.");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading product...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  // Placeholder image for empty or invalid cases
  const placeholderImage = "/placeholder.png";
  
  // QR Code URL - points to the story page for this product
  const qrCodeURL = `${window.location.origin}/read_story/${product.id}`;

  // Download QR Code function
  const downloadQRCode = () => {
    const svg = document.getElementById('product-qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR-${product.name}-${product.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#f7ead7]">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-[#F4C430]">Home</Link> /{" "}
          <Link to="/products" className="hover:text-[#F4C430]">Shop</Link> /{" "}
          <span>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Carousel */}
          <div className="space-y-4">
            {/* Main Image Display */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: "500px" }}>
              <img
                src={product.image && product.image.length > 0 ? product.image[currentImageIndex] : placeholderImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = placeholderImage)}
              />
              {/* Navigation Arrows */}
              {product.image && product.image.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition"
                  >
                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition"
                  >
                    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    <span>{currentImageIndex + 1}</span> / <span>{product.image?.length || 1}</span>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.image && product.image.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {product.image.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`border-2 rounded-lg overflow-hidden ${
                      index === currentImageIndex ? "border-[#8B5E3C]" : "border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-24 object-cover"
                      onError={(e) => (e.target.src = placeholderImage)}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* QR Code Section - NEW! */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md border-2 border-[#8B5E3C]">
              <h3 className="text-lg font-bold mb-3 text-center text-[#8B5E3C]">
                📱 Scan the Story
              </h3>
              <div className="flex justify-center">
                <QRCodeSVG 
                  id="product-qr-code"
                  value={qrCodeURL}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-xs text-gray-600 mt-4 text-center leading-relaxed">
                This QR code will be on your tote bag tag. Scan it anytime to read the story behind this beautiful artwork!
              </p>
              
              {/* Download Button */}
              <button
                onClick={downloadQRCode}
                className="mt-4 w-full bg-[#8B5E3C] hover:bg-[#6B4423] text-white font-semibold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download QR Code for Printing
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-800">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <span className="text-gray-600">(24 reviews)</span>
            </div>

            {/* Price */}
            <p className="text-4xl font-bold text-[#8B5E3C]">
              ₦{product.price?.toLocaleString()}
            </p>

            {/* Remaining Stock */}
            <p className="text-sm text-gray-700">
              <strong>Available:</strong> {product.stock ?? "N/A"} in stock
            </p>

            {/* Description */}
            <div className="border-t border-b border-gray-200 py-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!product.stock || product.stock < 1}
              className={`w-full font-bold py-4 rounded-lg transition duration-300 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl ${
                product.stock > 0
                  ? "bg-[#8B5E3C] hover:bg-[#6B4423] text-white"
                  : "bg-gray-400 cursor-not-allowed text-gray-100"
              }`}
            >
              {product.stock > 0
                ? `Add to Cart - ₦${(product.price * quantity).toLocaleString()}`
                : "Out of Stock"}
            </button>

            {/* Story Link */}
            <Link
              to={`/read_story/${product.id}`}
              className="inline-flex items-center justify-center gap-2 bg-[#F4C430] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#e3b920] hover:shadow-lg transition duration-300 text-base sm:text-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20l9-5-9-5-9 5 9 5zM3 10l9-5 9 5"
                />
              </svg>
              Read the Story
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center text-[#8B5E3C] hover:text-[#6B4423] font-semibold mt-6 transition"
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
          Back to Shop
        </Link>
      </div>
    </section>
  );
};

export default Product_id;