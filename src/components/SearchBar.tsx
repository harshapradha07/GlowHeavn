import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, ArrowRight, Star } from 'lucide-react';
import { Product } from '../types';

interface SearchBarProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onClose: () => void;
  isOpen: boolean;
}

const TRENDING_SEARCHES = [
  'Vitamin C Elixir',
  'Velvet Matte Lipstick',
  'Dew Cushion SPF 50',
  'Ceramide Cream',
  'Rosemary Scalp',
  'Centella Tonic',
  'Monoi Body Oil'
];

export const SearchBar: React.FC<SearchBarProps> = ({
  products,
  onSelectProduct,
  onClose,
  isOpen
}) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('glowheavn_recent_searches');
      return saved ? JSON.parse(saved) : ['Squalane', 'Rose Lip', 'Pore Tonic'];
    } catch {
      return ['Squalane', 'Rose Lip', 'Pore Tonic'];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filteredProducts = query.trim() === ''
    ? []
    : products.filter((product) => {
        const q = query.toLowerCase();
        return (
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.tagline.toLowerCase().includes(q) ||
          product.concerns.some(c => c.toLowerCase().includes(q)) ||
          product.keyIngredients.some(k => k.toLowerCase().includes(q))
        );
      }).slice(0, 6);

  const handleSelectRecent = (term: string) => {
    setQuery(term);
  };

  const handleProductClick = (product: Product) => {
    // Save to recents
    if (query.trim() && !recentSearches.includes(query.trim())) {
      const updated = [query.trim(), ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      try {
        localStorage.setItem('glowheavn_recent_searches', JSON.stringify(updated));
      } catch {}
    }
    onSelectProduct(product);
    onClose();
  };

  const clearRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('glowheavn_recent_searches');
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-100">
          <Search className="w-5 h-5 text-rose-800 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skincare, makeup, shades, ingredients (e.g. Squalane, BHA, SPF)..."
            className="flex-1 text-base text-stone-900 placeholder:text-stone-400 bg-transparent outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-900 px-2 py-1 rounded cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecent}
                      className="text-xs text-rose-800 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSelectRecent(term)}
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 hover:text-rose-900 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending In Beauty */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold uppercase tracking-wider text-stone-400">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  <span>Popular Right Now on GlowHeavn</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSelectRecent(term)}
                      className="px-3.5 py-1.5 rounded-lg border border-stone-200 hover:border-rose-300 hover:bg-rose-50/50 text-stone-700 hover:text-rose-950 text-xs font-medium transition-all cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm font-medium text-stone-600">
                No beauty matches found for "{query}"
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Try searching for "serum", "lipstick", "cushion", or "ceramides".
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Products ({filteredProducts.length})
                </span>
                <span className="text-xs text-stone-400">Instant Match</span>
              </div>

              <div className="divide-y divide-stone-100">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-rose-50/40 transition-colors cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200/60">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback container
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="font-semibold text-rose-800">{product.brand}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.category}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-stone-900 truncate group-hover:text-rose-900 transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-stone-600">
                        <span className="font-medium text-stone-900 font-mono tabular-nums">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-stone-400 line-through font-mono tabular-nums">
                            ${product.originalPrice}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-amber-700">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="font-mono tabular-nums">{product.rating}</span>
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-stone-400 group-hover:text-rose-900 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
