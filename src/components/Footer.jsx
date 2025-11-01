import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div className="md:col-span-1">
          <h3 className="text-xl font-bold font-serif mb-4 text-white">Artisan Totes</h3>
          <p className="text-sm">Handcrafted tote bags with a story to tell.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/products" className="hover:text-white">Shop</Link></li>
            <li><Link to="/art" className="hover:text-white">Art Gallery</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/shipping" className="hover:text-white">Shipping & Returns</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold mb-4 text-white">Join Our Newsletter</h4>
          <p className="text-sm mb-2">Get updates on new arrivals and special offers.</p>
          <form>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full px-3 py-2 rounded-l-md text-sm text-gray-900 focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-gray-600 text-white px-4 py-2 rounded-r-md hover:bg-gray-500"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Artisan Totes. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          {/* Replace with actual social media links */}
          <a href="#" className="hover:text-white">Facebook</a>
          <a href="#" className="hover:text-white">Instagram</a>
          <a href="#" className="hover:text-white">Pinterest</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;