import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Share2, Heart, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Subscribed to newsletter!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Newsletter Section */}
        <div className="mb-12 bg-accent bg-opacity-10 rounded-lg p-8 text-center">
          <h3 className="font-playfair text-2xl md:text-3xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-gray-200 mb-6">
            Get updates on new releases, special offers, and exclusive deals!
          </p>
          <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-primary outline-none"
              required
            />
            <button
              type="submit"
              className="bg-accent hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h4 className="font-playfair text-xl font-bold mb-4">PageTurn</h4>
            <p className="text-gray-300 text-sm mb-4">
              Your ultimate destination for buying, selling, and discovering books. Connect with fellow readers and book lovers.
            </p>
            <div className="flex gap-4">
              <Share2 className="w-5 h-5 cursor-pointer hover:text-accent" />
              <Heart className="w-5 h-5 cursor-pointer hover:text-accent" />
              <Zap className="w-5 h-5 cursor-pointer hover:text-accent" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-accent transition-colors">Shop</Link></li>
              <li><Link to="/sell" className="hover:text-accent transition-colors">Sell a Book</Link></li>
              <li><Link to="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+91 1234-567-890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@pageturn.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>123 Book Street, New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2024 PageTurn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
