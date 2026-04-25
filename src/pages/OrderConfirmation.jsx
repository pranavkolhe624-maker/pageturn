import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ShoppingBag, ArrowRight, Star } from 'lucide-react';

export const OrderConfirmation = () => {
  const orderId = 'PG' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const orderDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const steps = [
    { icon: CheckCircle, label: 'Order Confirmed', desc: 'Your order has been received', done: true },
    { icon: Package, label: 'Processing', desc: 'Books will be carefully packed', done: false },
    { icon: Truck, label: 'Shipped', desc: 'Track your shipment online', done: false },
    { icon: Home, label: 'Delivered', desc: 'Expected in 3–5 business days', done: false },
  ];

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #f0f4ff 100%)' }}>
      <div className="max-w-2xl mx-auto">

        {/* ── Success Card ── */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center mb-6">

          {/* Animated Check */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute w-28 h-28 bg-green-100 rounded-full animate-ping opacity-30" />
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Order Confirmed! 🎉
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Thank you for your purchase! Your books are on their way.
          </p>

          {/* Order Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, #f8f7ff, #f0f4ff)' }}>
            {[
              { label: 'Order ID', value: orderId, mono: true },
              { label: 'Date', value: orderDate },
              { label: 'Amount', value: '₹2,499', highlight: true },
              { label: 'Status', value: 'Confirmed', green: true },
            ].map(({ label, value, mono, highlight, green }) => (
              <div key={label} className="text-left">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                <p className={`text-sm font-bold ${mono ? 'font-mono text-indigo-700' : highlight ? 'text-indigo-700 text-base' : green ? 'text-emerald-600' : 'text-gray-800'}`}>
                  {green ? <span className="bg-emerald-100 px-2 py-0.5 rounded-full">{value}</span> : value}
                </p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 6px 20px rgba(99,102,241,0.35)' }}
            >
              <Truck className="w-4 h-4" /> Track Your Order
            </button>
            <Link
              to="/shop"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-indigo-200 text-indigo-600 font-bold hover:bg-indigo-50 transition-all duration-200"
            >
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* ── Delivery Timeline ── */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-gray-800 text-lg mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            What's Next?
          </h3>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gradient-to-b from-emerald-400 via-gray-200 to-gray-200" />

            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={step.label} className="flex gap-4 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    step.done
                      ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-200'
                      : 'bg-gray-200'
                  }`}>
                    <step.icon className={`w-5 h-5 ${step.done ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="pt-1.5">
                    <p className={`font-bold text-sm ${step.done ? 'text-emerald-700' : 'text-gray-500'}`}>{step.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Info Cards ── */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: Package, label: 'Secure Packaging', desc: 'Books wrapped safely', color: 'from-blue-400 to-indigo-500' },
            { icon: Truck, label: 'Free Shipping', desc: 'To your doorstep', color: 'from-purple-400 to-pink-500' },
            { icon: Star, label: 'Easy Returns', desc: '14-day guarantee', color: 'from-amber-400 to-orange-500' },
          ].map(({ icon: Icon, label, desc, color }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
              <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-bold text-gray-800">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        {/* Help */}
        <div className="text-center text-sm text-gray-500">
          <p>Check your email for order confirmation & tracking details.</p>
          <p className="mt-1">
            Questions?{' '}
            <a href="#" className="text-indigo-600 font-semibold hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};
