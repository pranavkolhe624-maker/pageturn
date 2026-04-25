import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart as CartIcon, ArrowRight, Gift, Shield, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 100%)' }}>
        <div className="text-center">
          <div className="w-28 h-28 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CartIcon className="w-14 h-14 text-indigo-300" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Your Cart is Empty
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-sm mx-auto">
            Looks like you haven't added any books yet. Start exploring our collection!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 25px rgba(99,102,241,0.4)' }}
          >
            Browse Books <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 100%)' }}>
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
            Shopping Cart
          </h1>
          <p className="text-gray-500">
            You have <span className="font-bold text-indigo-600">{cartItems.length}</span> item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex gap-5 hover:shadow-md transition-shadow duration-200"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-20 h-28 object-cover rounded-xl shadow-md"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100x150/6366f1/ffffff?text=📚'; }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="min-w-0 pr-3">
                      <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{item.author}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex-shrink-0 p-2 rounded-xl border-2 border-red-100 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Control */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-indigo-500 hover:text-white text-gray-600 transition-all duration-200 font-bold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 font-bold text-gray-900 text-sm min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-indigo-500 hover:text-white text-gray-600 transition-all duration-200 font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-xs text-gray-400">₹{item.price} × {item.quantity}</p>
                      <p className="text-lg font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Promo Banner */}
            <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50">
              <Gift className="w-6 h-6 text-indigo-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-indigo-700">🎉 Free Shipping on all orders!</p>
                <p className="text-xs text-indigo-500">No minimum order value required. Enjoy free delivery nationwide.</p>
              </div>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div>
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Order Summary
              </h2>

              <div className="space-y-3 pb-5 border-b border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-emerald-600">FREE 🎁</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-semibold text-gray-900">₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-5">
                <span className="font-bold text-gray-800 text-lg">Total</span>
                <span className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ₹{total.toFixed(2)}
                </span>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl mb-3"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 6px 20px rgba(99,102,241,0.35)' }}
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/shop"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
              >
                ← Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                {[
                  { icon: Shield, text: '100% Secure Checkout' },
                  { icon: Truck, text: 'Free delivery on all orders' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-gray-400">
                    <Icon className="w-3.5 h-3.5 text-indigo-400" /> {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
