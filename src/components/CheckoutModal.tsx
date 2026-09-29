import React, { useState } from 'react';
import { X, Check, ShieldCheck, Truck, CreditCard, Banknote, Smartphone, ChevronRight, Sparkles } from 'lucide-react';
import { CartItem, ShippingAddress, Order, UserPersona } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currentUser: UserPersona | null;
  onOrderPlaced: (order: Order) => void;
  selectedSample?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  shipping,
  total,
  currentUser,
  onOrderPlaced,
  selectedSample
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: currentUser?.name || 'Harsha P.',
    email: currentUser?.email || 'harshapradhakundan@gmail.com',
    phone: '+1 (555) 382-9012',
    street: '742 Evergreen Terrace, Suite 4B',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    country: 'United States'
  });

  // Card State
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('888');

  if (!isOpen) return null;

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const orderId = `GH-${Math.floor(100000 + Math.random() * 900000)}`;
    const tracking = `TRK-GLOW-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...items],
      shippingAddress: { ...address },
      paymentMethod: paymentMethod === 'card' ? 'Visa •••• 4242' : paymentMethod === 'upi' ? 'UPI Instant Pay' : 'Cash on Delivery',
      subtotal,
      discount,
      shipping,
      total,
      status: 'Confirmed',
      estimatedDelivery: '3–4 Business Days (Express Courier)',
      trackingNumber: tracking
    };

    setCompletedOrder(newOrder);
    onOrderPlaced(newOrder);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/60">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
              GlowHeavn Express
            </span>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              {step === 'success' ? 'Order Confirmed' : 'Seamless Checkout'}
            </h2>
          </div>
          {step !== 'success' && (
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        {step !== 'success' && (
          <div className="flex border-b border-stone-200 bg-white text-xs font-semibold">
            <button
              onClick={() => setStep('details')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
                step === 'details'
                  ? 'border-rose-900 text-rose-950 bg-rose-50/30'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              1. Delivery Address
            </button>
            <button
              disabled={step === 'details'}
              onClick={() => setStep('payment')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                step === 'payment'
                  ? 'border-rose-900 text-rose-950 bg-rose-50/30'
                  : 'border-transparent text-stone-400'
              }`}
            >
              2. Payment & Confirmation
            </button>
          </div>
        )}

        <div className="p-6">
          {/* STEP 1: ADDRESS DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleSubmitDetails} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-rose-900 outline-none bg-stone-50/50 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-rose-900 outline-none bg-stone-50/50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address for Tracking Updates
                </label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-rose-900 outline-none bg-stone-50/50 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-rose-900 outline-none bg-stone-50/50 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:border-rose-900 outline-none bg-stone-50/50 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:border-rose-900 outline-none bg-stone-50/50 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:border-rose-900 outline-none bg-stone-50/50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Items in Checkout Preview */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                <span>Shipping {items.length} items to this address</span>
                <span className="font-bold text-stone-900 font-mono tabular-nums">Total: ${total}</span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD & REVIEW */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-rose-900 bg-rose-50/50 text-rose-950 ring-2 ring-rose-900/10'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-rose-800" />
                    <div>
                      <div className="text-xs font-bold">Credit / Debit</div>
                      <div className="text-[11px] text-stone-500">Visa, MC, Amex</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-rose-900 bg-rose-50/50 text-rose-950 ring-2 ring-rose-900/10'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-rose-800" />
                    <div>
                      <div className="text-xs font-bold">UPI / NetBank</div>
                      <div className="text-[11px] text-stone-500">GPay, PhonePe</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-rose-900 bg-rose-50/50 text-rose-950 ring-2 ring-rose-900/10'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-rose-800" />
                    <div>
                      <div className="text-xs font-bold">Cash on Delivery</div>
                      <div className="text-[11px] text-stone-500">Pay at doorstep</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Method Details */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-stone-50/70 rounded-xl border border-stone-200/80 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-xs font-mono tabular-nums outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-xs font-mono tabular-nums outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-stone-200 text-xs font-mono tabular-nums outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                  <p className="font-semibold mb-1">Instant UPI Auto-Verification</p>
                  <p className="text-emerald-800">
                    A secure payment request will be sent to your UPI app (GPay / PhonePe / BHIM) upon confirmation.
                  </p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-950">
                  <p className="font-semibold mb-1">Cash on Delivery Verified</p>
                  <p className="text-amber-900">
                    Please keep exact cash (${total}) ready at the time of courier handover. Contactless UPI on delivery also accepted.
                  </p>
                </div>
              )}

              {/* Order Summary Recap */}
              <div className="p-4 rounded-xl bg-stone-100/70 border border-stone-200/80 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Shipping To</span>
                  <span className="font-medium text-stone-900 truncate max-w-[240px]">
                    {address.fullName} · {address.city}, {address.state}
                  </span>
                </div>
                {selectedSample && (
                  <div className="flex justify-between text-rose-800 font-medium">
                    <span>Deluxe Complimentary Sample</span>
                    <span className="truncate max-w-[240px]">{selectedSample}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-900">
                  <span>Final Charged Amount</span>
                  <span className="font-mono tabular-nums text-rose-950">${total}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-rose-900 hover:bg-rose-950 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Place Order (${total})</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER CONFIRMED CELEBRATION */}
          {step === 'success' && completedOrder && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Payment Received & Verified
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mt-1">
                  Thank You, {completedOrder.shippingAddress.fullName.split(' ')[0]}!
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Order <span className="font-mono font-semibold text-stone-900">{completedOrder.id}</span> has been confirmed.
                </p>
              </div>

              {/* Tracking & Delivery Box */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-left space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Tracking Reference</span>
                  <span className="font-mono font-semibold text-stone-900">
                    {completedOrder.trackingNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Estimated Delivery</span>
                  <span className="font-semibold text-emerald-800">
                    {completedOrder.estimatedDelivery}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Paid with</span>
                  <span className="font-medium text-stone-800">
                    {completedOrder.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Purchased items list */}
              <div className="text-left space-y-2 max-h-40 overflow-y-auto pr-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  Items in this shipment
                </span>
                {completedOrder.items.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-xs py-1 border-b border-stone-100">
                    <span className="truncate max-w-[280px] font-medium text-stone-800">
                      {item.product.name} (x{item.quantity})
                    </span>
                    <span className="font-mono tabular-nums text-stone-900 font-semibold">
                      ${item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Continue Exploring GlowHeavn
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
