import React from 'react';
import { Search, ShoppingBag, Heart, User, Sparkles } from 'lucide-react';
import { UserPersona, Category } from '../types';

interface HeaderProps {
  activeCategory: Category | 'All';
  onSelectCategory: (cat: Category | 'All') => void;
  currentUser: UserPersona | null;
  onOpenUserModal: () => void;
  onOpenCart: () => void;
  cartCount: number;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  isSearchActive: boolean;
  onOpenQuiz: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  currentUser,
  onOpenUserModal,
  onOpenCart,
  cartCount,
  wishlistCount,
  onOpenWishlist,
  onOpenSearch,
  isSearchActive,
  onOpenQuiz
}) => {
  const categories: (Category | 'All')[] = ['All', 'Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Bath & Body'];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Bar strictly complying with 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onSelectCategory('All'); }}
          className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-stone-900 hover:text-rose-900 transition-colors shrink-0"
        >
          GlowHeavn
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                activeCategory === cat 
                  ? 'text-rose-900 font-semibold' 
                  : 'hover:text-stone-900'
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-800 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search toggle */}
          <button
            onClick={onOpenSearch}
            className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-full border transition-all cursor-pointer ${
              isSearchActive 
                ? 'border-rose-900 bg-rose-50/70 text-rose-950 ring-2 ring-rose-900/10' 
                : 'border-stone-200 bg-white/80 text-stone-600 hover:border-stone-400 hover:text-stone-900'
            }`}
            aria-label="Search beauty products"
          >
            <Search className="w-4 h-4 text-stone-500" />
            <span className="hidden md:inline text-stone-400">Search products, brands...</span>
            <span className="md:hidden">Search</span>
          </button>

          {/* User Persona / Login Indicator */}
          <button
            onClick={onOpenUserModal}
            className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-full border border-stone-200 bg-white/90 text-stone-800 hover:border-stone-300 hover:bg-stone-50 transition-all cursor-pointer shrink-0"
            title={currentUser ? `Logged in as ${currentUser.name}` : 'Login / Switch Persona'}
          >
            <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-900 flex items-center justify-center text-xs font-semibold">
              {currentUser ? currentUser.avatar : <User className="w-3.5 h-3.5" />}
            </div>
            <span className="hidden sm:inline font-medium max-w-[100px] truncate">
              {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-all cursor-pointer shadow-sm shrink-0"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium font-mono tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Category Scroll Bar */}
      <div className="lg:hidden flex items-center gap-4 px-4 py-2.5 overflow-x-auto border-t border-stone-200/60 no-scrollbar text-xs font-medium text-stone-600">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`whitespace-nowrap px-3 py-1 rounded-full cursor-pointer transition-colors ${
              activeCategory === cat
                ? 'bg-stone-900 text-white font-semibold'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </header>
  );
};
