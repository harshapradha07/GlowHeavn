import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  SlidersHorizontal, 
  ShieldCheck, 
  Droplets, 
  Leaf, 
  Truck, 
  Check, 
  Filter, 
  RotateCcw,
  Heart,
  ChevronDown
} from 'lucide-react';

import { Product, Category, UserPersona, CartItem, Order, SkinType } from './types';
import { INITIAL_PRODUCTS, HERO_IMAGE } from './data/products';
import { INITIAL_PERSONAS } from './data/personas';
import { getPersonalizedProducts } from './utils/recommendations';

import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { UserModal } from './components/UserModal';
import { SkinQuizModal } from './components/SkinQuizModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ChatBot } from './components/ChatBot';

export default function App() {
  // Products State
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);

  // Active User / Persona State
  const [currentUser, setCurrentUser] = useState<UserPersona | null>(() => {
    try {
      const saved = localStorage.getItem('glowheavn_user');
      return saved ? JSON.parse(saved) : INITIAL_PERSONAS[0];
    } catch {
      return INITIAL_PERSONAS[0];
    }
  });

  // Category & Filter State
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [selectedConcern, setSelectedConcern] = useState<string>('All');
  const [selectedSkinType, setSelectedSkinType] = useState<string>('All');
  const [selectedFinish, setSelectedFinish] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');

  // Modals & Drawers State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart State (Initialized with 2 items for immediate seamless checkbox demonstration)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('glowheavn_cart');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { product: INITIAL_PRODUCTS[0], quantity: 1, selectedSize: '30ml / 1.0 fl. oz.', selected: true },
      { product: INITIAL_PRODUCTS[1], quantity: 1, selectedShade: '01 Rose Petal Muse', selected: true }
    ];
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('glowheavn_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [INITIAL_PRODUCTS[2]];
  });

  // Coupon & Samples State
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('GLOW20');
  const [selectedSample, setSelectedSample] = useState<string>('Mini Squalane Glow Drops (5ml)');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('glowheavn_user', JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('glowheavn_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('glowheavn_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // Personalized products calculation
  const scoredProducts = useMemo(() => {
    return getPersonalizedProducts(products, currentUser);
  }, [products, currentUser]);

  // Filtered & Sorted Catalog
  const filteredProducts = useMemo(() => {
    let result = [...scoredProducts];

    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (selectedConcern !== 'All') {
      result = result.filter(p => p.concerns.includes(selectedConcern));
    }

    if (selectedSkinType !== 'All') {
      result = result.filter(p => p.skinTypes.includes(selectedSkinType as SkinType));
    }

    if (selectedFinish !== 'All') {
      result = result.filter(p => p.finish === selectedFinish);
    }

    if (sortBy === 'recommended') {
      result.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [scoredProducts, activeCategory, selectedConcern, selectedSkinType, selectedFinish, sortBy]);

  // Top personalized recommendations for Hero/Curated showcase (top 4 matches)
  const topPersonalizedMatches = useMemo(() => {
    return scoredProducts.slice(0, 4);
  }, [scoredProducts]);

  // Cart operations
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== id));
    showToast('Item removed from bag');
  };

  // Seamless item selection checkbox handler
  const handleToggleSelectItem = (id: string) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === id) {
        return { ...item, selected: !item.selected };
      }
      return item;
    }));
  };

  // Master Select All checkbox
  const handleToggleSelectAll = () => {
    const allSelected = cartItems.length > 0 && cartItems.every(i => i.selected);
    setCartItems(prev => prev.map(i => ({ ...i, selected: !allSelected })));
  };

  const handleAddToCart = (product: Product, quantity: number = 1, shade?: string, size?: string) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedShade === shade && item.selectedSize === size);
      if (existing) {
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + quantity, selected: true } : item);
      }
      return [...prev, { product, quantity, selectedShade: shade, selectedSize: size, selected: true }];
    });
    showToast(`Added ${product.name} to bag`);
  };

  const handleBuyNow = (product: Product, shade?: string, size?: string) => {
    handleAddToCart(product, 1, shade, size);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some(p => p.id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(p => p.id !== product.id));
      showToast(`Removed from wishlist`);
    } else {
      setWishlist(prev => [...prev, product]);
      showToast(`Saved to wishlist`);
    }
  };

  const handleMoveToBag = (product: Product) => {
    handleAddToCart(product, 1);
    setWishlist(prev => prev.filter(p => p.id !== product.id));
  };

  // Coupon handling
  const handleApplyCoupon = (code: string) => {
    if (code === 'GLOW20') {
      setAppliedCoupon('GLOW20');
      showToast('Coupon GLOW20 applied: 20% discount!');
      return { success: true, message: '20% off applied' };
    }
    if (code === 'FIRSTBUY') {
      setAppliedCoupon('FIRSTBUY');
      showToast('Coupon FIRSTBUY applied: $15 off!');
      return { success: true, message: '$15 off applied' };
    }
    return { success: false, message: 'Invalid promo code. Try GLOW20 or FIRSTBUY' };
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed');
  };

  // Checkout calculations for selected items
  const selectedCartItems = cartItems.filter(i => i.selected);
  const checkoutSubtotal = selectedCartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const checkoutDiscount = appliedCoupon === 'GLOW20' 
    ? Math.round(checkoutSubtotal * 0.20) 
    : appliedCoupon === 'FIRSTBUY' 
      ? Math.min(15, checkoutSubtotal) 
      : 0;
  const checkoutShipping = checkoutSubtotal >= 75 || checkoutSubtotal === 0 ? 0 : 6;
  const checkoutTotal = Math.max(0, checkoutSubtotal - checkoutDiscount + checkoutShipping);

  const handleOrderPlaced = (order: Order) => {
    // Remove only checked-out items from cart (seamless checkbox behavior)
    setCartItems(prev => prev.filter(i => !i.selected));
    showToast(`Order ${order.id} confirmed!`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col selection:bg-rose-100 selection:text-rose-950 font-sans">
      
      {/* Slim Dismissible Top Notification Banner */}
      <aside aria-label="Announcement" className="bg-stone-900 text-[#FAF7F5] text-xs py-2 px-4 text-center border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-rose-300" />
          <span>Exclusive: Receive 20% off all formulations with code <strong className="font-mono text-rose-200">GLOW20</strong></span>
          <span className="hidden sm:inline">· Free Worldwide Express on Orders over $75</span>
        </div>
      </aside>

      {/* Primary Header following Section 2 Top Bar Contract */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        currentUser={currentUser}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        isSearchActive={isSearchOpen}
        onOpenQuiz={() => setIsQuizModalOpen(true)}
      />

      {/* MAIN VIEWPORT */}
      <main className="flex-1">

        {/* SECTION 1: STOREFRONT HERO CAMPAIGN */}
        <section className="relative overflow-hidden bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Editorial & Value Proposition */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-800">
                  <Sparkles className="w-4 h-4" />
                  <span>The Dermal Innovation Atelier</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15] text-balance">
                  Luxury Beauty Formulated For Your Skin’s Dermal Rhythm.
                </h1>

                <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
                  Discover clean clinical skincare, weightless cashmere lipsticks, and dewy cushion foundations. Every visit adapts dynamically to your unique skin profile.
                </p>

                {/* Quick Persona Status Bar */}
                {currentUser && (
                  <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-rose-900 text-white flex items-center justify-center font-bold text-xs">
                        {currentUser.avatar}
                      </div>
                      <div>
                        <span className="font-semibold text-rose-950 block">
                          Personalized for {currentUser.name}
                        </span>
                        <span className="text-stone-500">
                          {currentUser.skinType} Skin · {currentUser.aestheticPreference}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsQuizModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 hover:bg-rose-100/50 text-rose-900 font-semibold transition-colors cursor-pointer shrink-0"
                    >
                      Refine Profile
                    </button>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#catalog-section"
                    className="px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <span>Explore Formulations</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="px-5 py-3.5 rounded-xl border border-stone-200 hover:border-stone-400 bg-white text-stone-800 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-stone-500" />
                    <span>Search by Ingredient or Concern</span>
                  </button>
                </div>

                {/* Trust Markers */}
                <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-5 text-xs text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    100% Verified Authentic
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-700" />
                    Clean & Certified Vegan
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-stone-700" />
                    Express Tracked Dispatch
                  </span>
                </div>
              </div>

              {/* Right Column: Hero Visual Showcase */}
              <div className="lg:col-span-6">
                <div className="relative aspect-16/10 rounded-3xl overflow-hidden shadow-xl border border-stone-200 bg-stone-100 group">
                  <img
                    src={HERO_IMAGE}
                    alt="GlowHeavn luxury skincare and radiant cosmetics campaign"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                    <span className="text-xs uppercase font-mono tracking-widest text-rose-300 mb-1">
                      Autumn Collection 2026
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold leading-tight">
                      Botanical Squalane & Rose Cashmere
                    </h2>
                    <p className="text-xs text-stone-200 mt-1 max-w-md line-clamp-2">
                      Hand-blended cold-pressed active formulations tested on all dermal undertones.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: PERSONALIZED FOR YOU (Dynamic AI / Dermal Algorithm) */}
        {currentUser && (
          <section className="py-12 bg-[#FAF7F5] border-b border-stone-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-800 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Personalized Match Engine</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                    Specially Curated for {currentUser.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Ranked by dermatological synergy with your <strong className="font-semibold text-stone-700">{currentUser.skinType} skin</strong> and focus on <strong className="font-semibold text-stone-700">{currentUser.concerns.join(', ')}</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsQuizModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:border-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                  >
                    Customize Dermal Profile
                  </button>
                  <button
                    onClick={() => setIsUserModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Switch User
                  </button>
                </div>
              </div>

              {/* 4-Item Curated Grid with High-Synergy Scores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {topPersonalizedMatches.map((product) => (
                  <ProductCard
                    key={`curated-${product.id}`}
                    product={product}
                    onOpenDetails={(p) => setSelectedProduct(p)}
                    onQuickAdd={(p) => handleAddToCart(p, 1)}
                    isWishlisted={wishlist.some(w => w.id === product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    showPersonalizedScore={true}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 3: THE COMPLETE BEAUTY CATALOG WITH FILTER CONTROLS */}
        <section id="catalog-section" className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Functional Filter Bar */}
          <div className="space-y-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                  {activeCategory === 'All' ? 'All Beauty Formulations' : activeCategory}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Showing {filteredProducts.length} formulations crafted with bio-compatible actives.
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-white rounded-xl border border-stone-200 text-xs font-semibold text-stone-800 outline-none focus:border-rose-900 cursor-pointer shadow-xs"
                >
                  <option value="recommended">Best Match For You</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Interactive Filter Tabs compliant with Section 1.A */}
            <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
              {/* Category Segmented Control */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
                  Category:
                </span>
                {(['All', 'Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Bath & Body'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-rose-900 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Secondary Filter Row: Skin Type & Concern */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-3 text-xs">
                {/* Skin Type selector */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-500">Skin Type:</span>
                  <select
                    value={selectedSkinType}
                    onChange={(e) => setSelectedSkinType(e.target.value)}
                    className="px-2.5 py-1 bg-stone-50 rounded-lg border border-stone-200 font-medium text-stone-800 outline-none cursor-pointer"
                  >
                    <option value="All">All Skin Types</option>
                    <option value="Dry">Dry</option>
                    <option value="Oily">Oily</option>
                    <option value="Combination">Combination</option>
                    <option value="Sensitive">Sensitive</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>

                {/* Concern selector */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-500">Target Concern:</span>
                  <select
                    value={selectedConcern}
                    onChange={(e) => setSelectedConcern(e.target.value)}
                    className="px-2.5 py-1 bg-stone-50 rounded-lg border border-stone-200 font-medium text-stone-800 outline-none cursor-pointer"
                  >
                    <option value="All">All Dermal Concerns</option>
                    <option value="Dullness & Glow">Dullness & Glow</option>
                    <option value="Hydration">Hydration</option>
                    <option value="Acne & Blemishes">Acne & Blemishes</option>
                    <option value="Fine Lines">Fine Lines</option>
                    <option value="Pores & Texture">Pores & Texture</option>
                    <option value="Redness & Irritation">Redness & Irritation</option>
                  </select>
                </div>

                {/* Finish selector */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-500">Finish:</span>
                  <select
                    value={selectedFinish}
                    onChange={(e) => setSelectedFinish(e.target.value)}
                    className="px-2.5 py-1 bg-stone-50 rounded-lg border border-stone-200 font-medium text-stone-800 outline-none cursor-pointer"
                  >
                    <option value="All">Any Finish</option>
                    <option value="Dewy">Dewy / Glass Skin</option>
                    <option value="Velvet Matte">Velvet Matte</option>
                    <option value="Radiant">Radiant Satin</option>
                    <option value="Natural">Natural Balance</option>
                  </select>
                </div>

                {/* Reset Filters */}
                {(activeCategory !== 'All' || selectedConcern !== 'All' || selectedSkinType !== 'All' || selectedFinish !== 'All') && (
                  <button
                    onClick={() => {
                      setActiveCategory('All');
                      setSelectedConcern('All');
                      setSelectedSkinType('All');
                      setSelectedFinish('All');
                    }}
                    className="flex items-center gap-1 text-rose-800 hover:text-rose-950 font-semibold cursor-pointer ml-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-stone-200">
              <p className="text-base font-semibold text-stone-800">
                No formulations match the selected filter combination.
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Try loosening your skin type or concern filters to view more products.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSelectedConcern('All');
                  setSelectedSkinType('All');
                  setSelectedFinish('All');
                }}
                className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={(p) => setSelectedProduct(p)}
                  onQuickAdd={(p) => handleAddToCart(p, 1)}
                  isWishlisted={wishlist.some(w => w.id === product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  showPersonalizedScore={Boolean(currentUser)}
                />
              ))}
            </div>
          )}
        </section>

        {/* SECTION 4: EDITORIAL CRAFTSMANSHIP & DERMAL INTEGRITY */}
        <section className="py-16 bg-white border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="p-6 rounded-2xl bg-[#FAF8F6] border border-stone-200/80 space-y-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-900 flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Clean Biomimetic Ingredients
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Every lipid, antioxidant, and peptide is chosen to mirror your skin's natural hydrolipidic film. Zero mineral oils, parabens, or synthetic fragrance.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAF8F6] border border-stone-200/80 space-y-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-900 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Personalized Synergy Matching
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Our algorithm analyzes dermal sensitivity, undertones, and environmental stressors to match formulas that elevate your routine without irritation.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAF8F6] border border-stone-200/80 space-y-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-900 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Seamless Delivery & Returns
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Temperature-controlled eco-packaging ensures raw botanical potency from our laboratory directly to your vanity. 15-day effortless returns.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Brand Col */}
            <div className="space-y-4">
              <span className="text-2xl font-serif font-bold text-white tracking-tight">
                GlowHeavn
              </span>
              <p className="text-xs text-stone-400 leading-relaxed">
                The premier destination for conscious luxury beauty, dewy complexion science, and tailored dermal care.
              </p>
              <div className="text-xs text-stone-400">
                100% Genuine Certified Formulation Standard
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Collections
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li><button onClick={() => setActiveCategory('Skincare')} className="hover:text-white transition-colors cursor-pointer">Biotech Skincare</button></li>
                <li><button onClick={() => setActiveCategory('Makeup')} className="hover:text-white transition-colors cursor-pointer">Cashmere Lipsticks & Tints</button></li>
                <li><button onClick={() => setActiveCategory('Haircare')} className="hover:text-white transition-colors cursor-pointer">Scalp & Follicle Serums</button></li>
                <li><button onClick={() => setActiveCategory('Fragrance')} className="hover:text-white transition-colors cursor-pointer">Maison Fragrances</button></li>
                <li><button onClick={() => setActiveCategory('Bath & Body')} className="hover:text-white transition-colors cursor-pointer">Shimmer Dry Oils</button></li>
              </ul>
            </div>

            {/* Personalized Concierge */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Beauty Concierge
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li><button onClick={() => setIsQuizModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">Take Dermal Skin Quiz</button></li>
                <li><button onClick={() => setIsUserModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">Switch Account Profile</button></li>
                <li><button onClick={() => setIsWishlistOpen(true)} className="hover:text-white transition-colors cursor-pointer">Saved Wishlist</button></li>
                <li><button onClick={() => setIsCartOpen(true)} className="hover:text-white transition-colors cursor-pointer">Bag & Selective Checkout</button></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                GlowHeavn Dispatch
              </h4>
              <p className="text-xs text-stone-400 mb-3">
                Subscribe for private releases, masterclasses, and an immediate 20% privilege code.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); showToast('Subscribed to GlowHeavn Dispatch!'); }} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-xs text-white placeholder:text-stone-500 outline-none flex-1 focus:border-rose-400"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-rose-900 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Join
                </button>
              </form>
            </div>

          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
            <div>
              © 2026 GlowHeavn Atelier Inc. All rights reserved.
            </div>
            <div className="flex gap-6">
              <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-stone-300 cursor-pointer">Terms of Service</span>
              <span className="hover:text-stone-300 cursor-pointer">Shipping & Returns</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS & DRAWERS */}

      {/* 1. Intuitive Search Modal */}
      <SearchBar
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onClose={() => setIsSearchOpen(false)}
        isOpen={isSearchOpen}
      />

      {/* 2. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToBag={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={selectedProduct ? wishlist.some(w => w.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        currentUser={currentUser}
      />

      {/* 3. Shopping Bag Drawer with Item Selection Checkboxes */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onToggleSelectItem={handleToggleSelectItem}
        onToggleSelectAll={handleToggleSelectAll}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        selectedSample={selectedSample}
        onSelectSample={setSelectedSample}
      />

      {/* 4. Seamless Checkout Flow Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={selectedCartItems}
        subtotal={checkoutSubtotal}
        discount={checkoutDiscount}
        shipping={checkoutShipping}
        total={checkoutTotal}
        currentUser={currentUser}
        onOrderPlaced={handleOrderPlaced}
        selectedSample={selectedSample}
      />

      {/* 5. User Persona Profile & Switcher */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        currentUser={currentUser}
        onSelectPersona={(persona) => {
          setCurrentUser(persona);
          showToast(persona ? `Switched profile to ${persona.name}` : 'Browsing as Guest');
        }}
        onOpenQuiz={() => setIsQuizModalOpen(true)}
      />

      {/* 6. Skin Quiz / Beauty Profile Customizer */}
      <SkinQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        currentUser={currentUser}
        onSaveProfile={(updated) => {
          setCurrentUser(updated);
          showToast(`Beauty profile updated for ${updated.name}!`);
        }}
      />

      {/* 7. Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToBag={handleMoveToBag}
        onOpenDetails={(p) => setSelectedProduct(p)}
      />

      {/* 8. Live n8n Beauty Concierge ChatBot */}
      <ChatBot
        currentUser={currentUser}
        webhookUrl="https://harshapradha.app.n8n.cloud/webhook/55430de3-a12a-419c-8317-aa1d8be07798/chat"
      />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-stone-900 text-white rounded-full text-xs font-semibold shadow-2xl border border-stone-700/80 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
