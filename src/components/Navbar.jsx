import React, { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path if needed
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalCount } = useCart();
  const [activeLink, setActiveLink] = useState('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login_page'); // Redirect to login after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-[#FAF8F5] border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-serif text-[#3E3E3E] font-semibold">
              Bomffa
            </h1>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              onClick={() => handleLinkClick('Home')}
              className={`text-[#3E3E3E] font-medium hover:text-[#F4C430] transition-colors duration-200
                ${activeLink === 'Home' ? 'text-[#F4C430]' : ''}`}
            >
              Home
            </Link>

            <Link
              to="/products"
              onClick={() => handleLinkClick('Shop')}
              className={`text-[#3E3E3E] font-medium hover:text-[#F4C430] transition-colors duration-200
                ${activeLink === 'Shop' ? 'text-[#F4C430]' : ''}`}
            >
              Shop
            </Link>

            {/* Conditional Auth Links */}
            {currentUser ? (
              <>
                <span className="text-[#3E3E3E] font-medium">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[#3E3E3E] font-medium hover:text-[#F4C430] transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login_page"
                onClick={() => handleLinkClick('Login')}
                className={`text-[#3E3E3E] font-medium hover:text-[#F4C430] transition-colors duration-200
                  ${activeLink === 'Login' ? 'text-[#F4C430]' : ''}`}
              >
                Login
              </Link>
            )}
          </div>

          {/* Desktop Cart Icon */}
          <div className="hidden md:flex items-center">
            <Link
              to="/cart_page"
              className="relative p-2 hover:bg-[#E8DCC4] rounded-lg transition-colors duration-200"
            >
              <ShoppingBag className="w-6 h-6 text-[#3E3E3E]" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F4C430] text-[#3E3E3E] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className="flex md:hidden items-center space-x-4">
            <Link
              to="/cart_page"
              className="relative p-2 hover:bg-[#E8DCC4] rounded-lg transition-colors duration-200"
            >
              <ShoppingBag className="w-6 h-6 text-[#3E3E3E]" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F4C430] text-[#3E3E3E] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-[#E8DCC4] rounded-lg transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#3E3E3E]" />
              ) : (
                <Menu className="w-6 h-6 text-[#3E3E3E]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-out */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 w-64 bg-[#FAF8F5] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-serif text-[#3E3E3E] font-semibold">
              Bonfer
            </h2>
            <button
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-[#E8DCC4] rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-[#3E3E3E]" />
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className="flex flex-col p-4 space-y-1">
            <Link
              to="/"
              onClick={() => handleLinkClick('Home')}
              className={`px-4 py-3 text-[#3E3E3E] font-medium rounded-lg hover:bg-opacity-50 transition-all duration-200
                ${activeLink === 'Home' ? 'bg-[#F4C430] text-[#3E3E3E]' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => handleLinkClick('Shop')}
              className={`px-4 py-3 text-[#3E3E3E] font-medium hover:bg-[#E8DCC4] hover:bg-opacity-30 rounded-lg transition-all duration-200
                ${activeLink === 'Shop' ? 'bg-[#F4C430] text-[#3E3E3E]' : ''}`}
            >
              Shop
            </Link>
            {/* Conditional Auth Links for Mobile */}
            {currentUser ? (
              <>
                <span className="px-4 py-3 text-[#3E3E3E] font-medium">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="px-4 py-3 text-[#3E3E3E] font-medium rounded-lg hover:bg-[#E8DCC4] transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login_page"
                onClick={() => handleLinkClick('Login')}
                className={`px-4 py-3 text-[#3E3E3E] font-medium hover:bg-[#E8DCC4] hover:bg-opacity-30 rounded-lg transition-all duration-200
                  ${activeLink === 'Login' ? 'bg-[#F4C430] text-[#3E3E3E]' : ''}`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[-1]"
          onClick={toggleMobileMenu}
        />
      )}
    </nav>
  );
};

export default Navbar;