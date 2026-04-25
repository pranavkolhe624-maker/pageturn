import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Truck, Lock, ArrowLeft, CheckCircle, Shield, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white transition-all duration-200"
    />
  </div>
);

const PaymentOption = ({ id, value, selected, onChange, icon: Icon, title, subtitle, gradient }) => (
  <label
    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
      selected ? 'border-indigo-400 bg-indigo-50 shadow-md shadow-indigo-100' : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
    }`}
  >
    <input type="radio" name="payment" value={value} checked={selected} onChange={onChange} className="sr-only" />
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${gradient}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1">
      <p className={`font-semibold text-sm ${selected ? 'text-indigo-700' : 'text-gray-800'}`}>{title}</p>
      <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
      selected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
    }`}>
      {selected && <div className="w-2 h-2 bg-white rounded-full" />}
    </div>
  </label>
);

export const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = address, 2 = payment

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      toast.error('Please log in to place an order');
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearCart();
      toast.success('🎉 Order placed successfully!');
      navigate('/order-success');
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getTotalPrice();
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 100%)' }}>
        <div className="text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🛒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some books before checking out!</p>
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: 'linear-gradient(135deg, #f8f7ff 0%, #f0f4ff 100%)' }}>
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-indigo-600 font-semibold mb-4 hover:gap-3 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </button>
          <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Checkout</h1>
          <p className="text-gray-500 mt-1">Complete your order securely</p>

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mt-6">
            {['Shipping Details', 'Payment', 'Confirm'].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  i + 1 <= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${i + 1 <= step ? 'bg-white/30' : 'bg-gray-300'}`}>{i + 1}</span>
                  {s}
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 max-w-12 rounded ${i + 1 < step ? 'bg-indigo-400' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: Form ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipping Address */}
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                <span className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-indigo-600" />
                </span>
                Shipping Address
              </h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="First Name" type="text" name="firstName" placeholder="Enter first name" value={formData.firstName} onChange={handleInputChange} required />
                  <InputField label="Last Name" type="text" name="lastName" placeholder="Enter last name" value={formData.lastName} onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Email Address" type="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleInputChange} required />
                  <InputField label="Phone Number" type="tel" name="phone" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <InputField label="Street Address" type="text" name="address" placeholder="House no., Street name, Area" value={formData.address} onChange={handleInputChange} required />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField label="City" type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required />
                  <InputField label="State" type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} required />
                  <InputField label="PIN Code" type="text" name="zipCode" placeholder="PIN Code" value={formData.zipCode} onChange={handleInputChange} required />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                <span className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-indigo-600" />
                </span>
                Payment Method
              </h2>
              <div className="space-y-3">
                <PaymentOption
                  value="cod"
                  selected={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  icon={Truck}
                  title="Cash on Delivery"
                  subtitle="Pay when your order arrives at your doorstep"
                  gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
                />
                <PaymentOption
                  value="upi"
                  selected={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  icon={Smartphone}
                  title="UPI Payment"
                  subtitle="Pay instantly via Google Pay, PhonePe, Paytm"
                  gradient="bg-gradient-to-br from-purple-400 to-indigo-500"
                />
                <PaymentOption
                  value="card"
                  selected={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  icon={CreditCard}
                  title="Credit / Debit Card"
                  subtitle="Visa, Mastercard, RuPay accepted"
                  gradient="bg-gradient-to-br from-blue-400 to-indigo-600"
                />
              </div>

              {paymentMethod === 'upi' && (
                <div className="mt-4">
                  <InputField label="UPI ID" type="text" placeholder="yourname@upi" />
                </div>
              )}
              {paymentMethod === 'card' && (
                <div className="mt-4 space-y-3">
                  <InputField label="Card Number" type="text" placeholder="XXXX XXXX XXXX XXXX" />
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="Expiry Date" type="text" placeholder="MM / YY" />
                    <InputField label="CVV" type="text" placeholder="•••" />
                  </div>
                  <InputField label="Cardholder Name" type="text" placeholder="Name on card" />
                </div>
              )}
            </div>

            {/* Place Order */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-2xl'
              }`}
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 25px rgba(99,102,241,0.4)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing your order...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Place Order · ₹{total}
                </>
              )}
            </button>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-10 h-14 object-cover rounded-lg flex-shrink-0 shadow-sm"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/50x80/6366f1/ffffff?text=📚'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-xs line-clamp-2 leading-snug">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">₹{item.price} × {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900 text-sm flex-shrink-0">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-4 space-y-2.5 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GST (5%)</span><span className="font-semibold">₹{tax}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span><span className="font-bold text-emerald-600">FREE 🎁</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 rounded-xl mb-5" style={{ background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)' }}>
                <span className="font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ₹{total}
                </span>
              </div>

              {/* Security Badges */}
              <div className="space-y-2">
                {[
                  { icon: Shield, text: 'All payments secured & encrypted' },
                  { icon: Truck, text: 'Delivered in 3–5 business days' },
                  { icon: CheckCircle, text: '14-day hassle-free returns' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
                    <Icon className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    {text}
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
