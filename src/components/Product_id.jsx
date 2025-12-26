import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, Download, BookOpen } from 'lucide-react';

const Product_id = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("No product ID found.");
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
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

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

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      navigate("/cart_page");
    } catch (e) {
      console.error("Add to cart failed:", e);
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('product-qr-code');
    if (!svg) return;
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
      downloadLink.download = `QR-${product.name}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#FDFCFB]">
        <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-serif italic text-lg tracking-widest">Studying the details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#FDFCFB] p-4 text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Something went wrong</h2>
        <p className="text-red-500 mb-8 max-w-md">{error}</p>
        <Link to="/products" className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold">Back to Shop</Link>
      </div>
    );
  }

  const qrCodeURL = `${window.location.origin}/read_story/${product.id}`;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FDFCFB]">
      <div className="max-w-7xl mx-auto">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-12">
          <Link to="/products" className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Collection
          </Link>
          <div className="hidden sm:block">
            <nav className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              <Link to="/" className="hover:text-gray-900">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/products" className="hover:text-gray-900">Shop</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">

          {/* Visuals Column */}
          <div className="space-y-8" data-aos="fade-right">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 shadow-2xl group">
              <img
                src={product.image && product.image.length > 0 ? product.image[currentImageIndex] : "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-cover shadow-inner"
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />

              {product.image && product.image.length > 1 && (
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button onClick={handlePrevImage} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-gray-900 transition-all">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={handleNextImage} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-gray-900 transition-all">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}

              {/* Counter */}
              <div className="absolute bottom-8 right-8 bg-gray-900/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-gray-900 border border-gray-900/5">
                {currentImageIndex + 1} / {product.image?.length || 1}
              </div>
            </div>

            {/* Thumbnails */}
            {product.image && product.image.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {product.image.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-32 rounded-2xl overflow-hidden border-4 transition-all ${index === currentImageIndex ? "border-[#8B5E3C] scale-105" : "border-transparent opacity-60"
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="space-y-10" data-aos="fade-left">
            <div>
              <div className="flex items-center gap-2 text-[#8B5E3C] mb-4">
                <span className="w-2 h-2 bg-[#8B5E3C] rounded-full"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exquisite Craftsmanship</span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-serif font-black text-gray-900 leading-tight mb-6">
                {product.name}
              </h1>
              <div className="flex items-center gap-6">
                <p className="text-4xl font-bold text-[#8B5E3C]">
                  ₦{product.price?.toLocaleString()}
                </p>
                <div className="h-8 w-[1px] bg-gray-200"></div>
                <div className="flex gap-1 text-[#F4C430]">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-xl">★</span>)}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400">The Narrative</h3>
              <p className="text-xl text-gray-500 font-light leading-relaxed">
                {product.description || "Every stitch in this piece tells a tale of tradition, resilience, and art. Handcrafted to accompany you on your own unique journey."}
              </p>
            </div>

            <div className="p-8 bg-[#f7f3f0] rounded-[2rem] space-y-8 relative overflow-hidden group">
              <div className="flex items-start gap-8 relative z-10">
                <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-100 transition-transform duration-500 group-hover:rotate-6">
                  <QRCodeSVG
                    id="product-qr-code"
                    value={qrCodeURL}
                    size={120}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div>
                  <h4 className="text-lg font-serif font-bold text-gray-900 mb-2 italic">A Story Woven In...</h4>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">Every bag comes with a unique tag. Scan it to meet the artisan and hear the inspiration behind this artwork.</p>
                  <button onClick={downloadQRCode} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#8B5E3C] hover:text-gray-900 transition-all">
                    <Download className="w-4 h-4" />
                    Archive QR Design
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200/20 -translate-y-12 translate-x-12 rounded-full"></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock < 1}
                className={`flex-[2] py-6 px-10 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-500 shadow-2xl active:scale-95 ${product.stock > 0
                  ? "bg-gray-900 text-white hover:bg-[#8B5E3C] shadow-gray-900/20"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {product.stock > 0 ? "Add To Collection" : "Sold Out"}
              </button>

              <Link
                to={`/read_story/${product.id}`}
                className="flex-1 py-6 px-10 rounded-2xl border-2 border-gray-100 font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:border-[#F4C430] hover:bg-[#F4C430]/5 transition-all duration-500 active:scale-95"
              >
                <BookOpen className="w-5 h-5" />
                Story
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-8 border-t border-gray-100">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Availability</span>
                <span className="font-bold text-gray-900">{product.stock || 0} pieces left</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Shipping</span>
                <span className="font-bold text-gray-900">Crafted 48h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product_id;