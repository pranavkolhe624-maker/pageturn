import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShoppingBag, ListPlus, Heart, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { booksData } from '../data/books';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  if (!isAuthenticated()) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const orders = [
    {
      id: 'PG-001',
      date: '2024-03-15',
      total: 599,
      status: 'Delivered',
      items: ['The Alchemist', 'Atomic Habits'],
    },
    {
      id: 'PG-002',
      date: '2024-03-10',
      total: 399,
      status: 'Shipped',
      items: ['1984'],
    },
  ];

  const listings = [
    {
      id: 1,
      title: 'Python Programming',
      price: 299,
      status: 'Active',
      views: 45,
    },
    {
      id: 2,
      title: 'Data Science Handbook',
      price: 449,
      status: 'Pending Review',
      views: 0,
    },
  ];

  const wishlist = booksData.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-playfair text-4xl font-bold text-primary mb-2">
                Welcome, {user?.name}!
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 font-semibold whitespace-nowrap pb-4 border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'text-accent border-accent'
                : 'text-gray-600 border-transparent hover:text-primary'
            }`}
          >
            <ShoppingBag className="w-5 h-5 inline mr-2" />
            My Orders
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-6 py-2 font-semibold whitespace-nowrap pb-4 border-b-2 transition-colors ${
              activeTab === 'listings'
                ? 'text-accent border-accent'
                : 'text-gray-600 border-transparent hover:text-primary'
            }`}
          >
            <ListPlus className="w-5 h-5 inline mr-2" />
            My Listings
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-6 py-2 font-semibold whitespace-nowrap pb-4 border-b-2 transition-colors ${
              activeTab === 'wishlist'
                ? 'text-accent border-accent'
                : 'text-gray-600 border-transparent hover:text-primary'
            }`}
          >
            <Heart className="w-5 h-5 inline mr-2" />
            Wishlist
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2 font-semibold whitespace-nowrap pb-4 border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'text-accent border-accent'
                : 'text-gray-600 border-transparent hover:text-primary'
            }`}
          >
            <Settings className="w-5 h-5 inline mr-2" />
            Settings
          </button>
        </div>

        {/* My Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="font-playfair text-2xl font-bold text-primary">My Orders</h2>
            </div>
            <div className="divide-y">
              {orders.map(order => (
                <div key={order.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-mono text-sm text-gray-600 mb-1">Order {order.id}</p>
                      <p className="text-gray-600">{order.date}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3 text-sm">{order.items.join(', ')}</p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-xl font-bold text-primary">₹{order.total}</span>
                    <button className="text-accent hover:underline font-semibold text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Listings Tab */}
        {activeTab === 'listings' && (
          <div>
            <button className="mb-6 bg-accent hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              + Add New Listing
            </button>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="font-playfair text-2xl font-bold text-primary">My Listings</h2>
              </div>
              <div className="divide-y">
                {listings.map(listing => (
                  <div key={listing.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-primary mb-2">{listing.title}</h3>
                        <div className="flex gap-6 text-sm text-gray-600">
                          <span>₹{listing.price}</span>
                          <span>{listing.views} views</span>
                          <span className={`font-semibold ${
                            listing.status === 'Active' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {listing.status}
                          </span>
                        </div>
                      </div>
                      <div className="space-x-2">
                        <button className="text-accent hover:underline text-sm font-semibold">Edit</button>
                        <button className="text-red-500 hover:underline text-sm font-semibold">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="font-playfair text-2xl font-bold text-primary">My Wishlist</h2>
            </div>
            <div className="divide-y">
              {wishlist.map(book => (
                <div key={book.id} className="p-6 flex items-center justify-between">
                  <div className="flex gap-6 flex-1">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x150?text=Book';
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-primary mb-1">{book.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                      <p className="text-xl font-bold text-accent">₹{book.price}</p>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <button className="bg-accent hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded text-sm transition-colors">
                      Add to Cart
                    </button>
                    <button className="text-red-500 hover:bg-red-50 px-4 py-2 rounded text-sm font-semibold">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="font-playfair text-2xl font-bold text-primary mb-6">Account Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <button className="text-accent font-semibold hover:underline text-sm">
                  Change Password
                </button>
              </div>
              <div className="pt-6 border-t">
                <button className="bg-primary hover:bg-primary/80 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
