import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Check, ShoppingBag, ShieldCheck, Truck, Sparkles, ArrowRight, Gift } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onToggleSelectItem: (id: string) => void;
  onToggleSelectAll: () => void;
  onProceedToCheckout: () => void;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => { success: boolean; message: string };
  onRemoveCoupon: () => void;
  selectedSample: string;
  onSelectSample: (sample: string) => void;
}

const LUXURY_SAMPLES = [
  'Mini Squalane Glow Drops (5ml)',
  'Damask Rose Velvet Mist (10ml)',
  'Peptide Lip Nectar Treatment'
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onToggleSelectItem,
  onToggleSelectAll,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  selectedSample,
  onSelectSample
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const selectedItems = items.filter(item => item.selected);
  const selectedItemsCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const allSelected = items.length > 0 && items.every(item => item.selected);

  // Subtotal calculated strictly for selected items (seamless checkbox behavior)
  const subtotal = selectedItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon === 'GLOW20') {
    discount = Math.round(subtotal * 0.20);
  } else if (appliedCoupon === 'FIRSTBUY') {
    discount = Math.min(15, subtotal);
  }

  const freeShippingThreshold = 75;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 6;
  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = onApplyCoupon(couponInput.trim().toUpperCase());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F6] shadow-2xl flex flex-col border-l border-stone-200">
          
          {/* Drawer Header */}
          <div className="p-5 bg-white border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-900" />
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Shopping Bag ({totalItemsCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-5 py-3 bg-rose-50/70 border-b border-rose-100 text-xs text-rose-950">
            <div className="flex items-center justify-between font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-rose-800" />
                {amountNeededForFreeShipping === 0 
                  ? 'Unlocked: Complimentary Express Shipping!' 
                  : `Add $${amountNeededForFreeShipping} more for Free Shipping`}
              </span>
              <span className="font-mono tabular-nums">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full bg-rose-200/80 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-rose-800 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Master "Select All" Seamless Checkbox Row */}
          {items.length > 0 && (
            <div className="px-5 py-2.5 bg-stone-100/70 border-b border-stone-200/80 flex items-center justify-between text-xs text-stone-700">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded text-rose-900 accent-rose-800 cursor-pointer"
                />
                <span className="font-semibold text-stone-900">
                  Select All Items ({items.length})
                </span>
              </label>
              <span className="text-stone-500 font-mono tabular-nums">
                {selectedItemsCount} ready for checkout
              </span>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-stone-900">Your bag is empty</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Explore our curated skincare, dewy foundations, and velvet lipsticks to fill your bag.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => {
                const { product, quantity, selected, selectedShade, selectedSize } = item;
                return (
                  <div
                    key={product.id}
                    className={`p-3.5 rounded-xl border transition-all flex gap-3 ${
                      selected
                        ? 'bg-white border-stone-200 shadow-xs'
                        : 'bg-stone-50/80 border-stone-200/60 opacity-75'
                    }`}
                  >
                    {/* Seamless Selection Checkbox */}
                    <div className="pt-2">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => onToggleSelectItem(product.id)}
                        className="w-4 h-4 rounded text-rose-900 accent-rose-800 cursor-pointer"
                        title={selected ? 'Item selected for checkout' : 'Item saved in cart'}
                      />
                    </div>

                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200/70">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                              {product.brand}
                            </span>
                            <h4 className="text-xs font-semibold text-stone-900 truncate">
                              {product.name}
                            </h4>
                          </div>
                          <button
                            onClick={() => onRemoveItem(product.id)}
                            className="text-stone-400 hover:text-rose-700 p-1 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Selected Variants */}
                        {(selectedShade || selectedSize) && (
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            {selectedShade && <span>Shade: {selectedShade}</span>}
                            {selectedShade && selectedSize && <span> · </span>}
                            {selectedSize && <span>Size: {selectedSize}</span>}
                          </div>
                        )}
                      </div>

                      {/* Stepper & Price */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                        <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                          <button
                            onClick={() => onUpdateQuantity(product.id, -1)}
                            className="p-1 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold font-mono tabular-nums text-stone-900">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, 1)}
                            className="p-1 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right font-mono tabular-nums">
                          <span className="text-xs font-bold text-stone-900">
                            ${product.price * quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Deluxe Free Sample Picker */}
            {items.length > 0 && (
              <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-950 mb-2">
                  <Gift className="w-4 h-4 text-rose-700" />
                  <span>Choose 1 Complimentary Deluxe Sample</span>
                </div>
                <div className="space-y-1.5">
                  {LUXURY_SAMPLES.map((sample) => (
                    <label
                      key={sample}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white border border-stone-200/80 text-xs text-stone-700 cursor-pointer hover:border-rose-300 transition-colors"
                    >
                      <input
                        type="radio"
                        name="sample-selection"
                        checked={selectedSample === sample}
                        onChange={() => onSelectSample(sample)}
                        className="accent-rose-800 cursor-pointer"
                      />
                      <span className="truncate">{sample}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer with Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-stone-200 space-y-3">
              {/* Promo Coupon Box */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="font-semibold">{appliedCoupon} Applied!</span>
                    </div>
                    <button
                      onClick={onRemoveCoupon}
                      className="text-emerald-700 hover:text-emerald-950 font-medium underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Promo code (e.g. GLOW20)"
                      className="flex-1 px-3 py-1.5 text-xs uppercase bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-rose-900"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-700 mt-1">{couponError}</p>
                )}
              </div>

              {/* Price Calculation breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Selected Items Subtotal ({selectedItemsCount})</span>
                  <span className="font-mono tabular-nums text-stone-900 font-medium">
                    ${subtotal}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-${discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-mono tabular-nums text-stone-900">
                    {shippingFee === 0 ? 'Free' : `$${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total Due</span>
                  <span className="font-mono tabular-nums text-rose-950 text-base">
                    ${finalTotal}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                disabled={selectedItems.length === 0}
                onClick={onProceedToCheckout}
                className={`w-full py-3.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                  selectedItems.length > 0
                    ? 'bg-rose-900 hover:bg-rose-950 text-white'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <span>
                  {selectedItems.length === 0
                    ? 'Check items to checkout'
                    : `Checkout Selected (${selectedItemsCount} Items · $${finalTotal})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Authentic Beauty Guarantee
                </span>
                <span>·</span>
                <span>Easy 15-Day Returns</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
