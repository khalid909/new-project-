import React from 'react';
import { Currency, Language } from '../types';
import { ShoppingBag, Store as StoreIcon, Database, GitBranch, Globe, SlidersHorizontal, Search } from 'lucide-react';

interface NavbarProps {
  currentTab: 'marketplace' | 'boutiques' | 'merchant' | 'sync';
  setCurrentTab: (tab: 'marketplace' | 'boutiques' | 'merchant' | 'sync') => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  cartCount: number;
  openCart: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeStoreName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currency,
  setCurrency,
  language,
  setLanguage,
  cartCount,
  openCart,
  searchQuery,
  setSearchQuery,
  activeStoreName
}) => {
  const isAr = language === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-xl border-b border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Single Element Brand Wordmark */}
          <button
            onClick={() => setCurrentTab('marketplace')}
            className="flex items-center gap-3 text-start shrink-0 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 flex items-center justify-center shadow-[0_0_20px_rgba(217,119,6,0.3)] transition-transform duration-300 group-hover:scale-105">
              <span className="font-serif font-bold text-neutral-950 text-xl tracking-tight">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider text-neutral-100 group-hover:text-amber-400 transition-colors uppercase">
                {isAr ? 'سُوقِفاي' : 'SOUQIFY'}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">
                {isAr ? 'منصة المتاجر السحابية' : 'LUXURY CLOUD COMMERCE'}
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('marketplace')}
              className={`whitespace-nowrap transition-colors pb-1 relative ${
                currentTab === 'marketplace'
                  ? 'text-amber-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {isAr ? 'السوق الشامل' : 'Marketplace'}
              {currentTab === 'marketplace' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('boutiques')}
              className={`whitespace-nowrap transition-colors pb-1 relative ${
                currentTab === 'boutiques'
                  ? 'text-amber-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {isAr ? 'المتاجر والماركات' : 'Brand Boutiques'}
              {currentTab === 'boutiques' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('merchant')}
              className={`flex items-center gap-2 whitespace-nowrap transition-colors pb-1 relative ${
                currentTab === 'merchant'
                  ? 'text-amber-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <StoreIcon className="w-4 h-4 text-amber-500" />
              <span>{isAr ? 'استوديو التاجر (Shopify)' : 'Merchant Studio'}</span>
              {currentTab === 'merchant' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('sync')}
              className={`flex items-center gap-2 whitespace-nowrap transition-colors pb-1 relative ${
                currentTab === 'sync'
                  ? 'text-amber-400 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'Supabase & GitHub' : 'Supabase & GitHub'}</span>
              {currentTab === 'sync' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          </nav>

          {/* Zone 3: Controls, Currency, Language & Cart */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-neutral-900 border border-neutral-800 text-xs font-mono rounded-lg px-2.5 py-2 text-neutral-300 hover:border-neutral-700 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
              aria-label="Select currency"
            >
              <option value="SAR">SAR (ر.س)</option>
              <option value="USD">USD ($)</option>
              <option value="AED">AED (د.إ)</option>
              <option value="EUR">EUR (€)</option>
            </select>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:text-amber-400 hover:border-neutral-700 transition-colors"
              title="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-medium">{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-neutral-950 text-[11px] font-bold font-mono w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Merchant Quick Portal CTA */}
            <button
              onClick={() => setCurrentTab('merchant')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm transition-all duration-200 active:scale-95"
            >
              <StoreIcon className="w-3.5 h-3.5" />
              <span>{isAr ? 'لوحة التحكم' : 'Merchant Portal'}</span>
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden items-center justify-around py-2.5 border-t border-neutral-900 text-xs text-neutral-400">
          <button
            onClick={() => setCurrentTab('marketplace')}
            className={`px-2 py-1 ${currentTab === 'marketplace' ? 'text-amber-400 font-bold' : ''}`}
          >
            {isAr ? 'السوق' : 'Market'}
          </button>
          <button
            onClick={() => setCurrentTab('boutiques')}
            className={`px-2 py-1 ${currentTab === 'boutiques' ? 'text-amber-400 font-bold' : ''}`}
          >
            {isAr ? 'المتاجر' : 'Boutiques'}
          </button>
          <button
            onClick={() => setCurrentTab('merchant')}
            className={`px-2 py-1 ${currentTab === 'merchant' ? 'text-amber-400 font-bold' : ''}`}
          >
            {isAr ? 'التاجر' : 'Merchant'}
          </button>
          <button
            onClick={() => setCurrentTab('sync')}
            className={`px-2 py-1 ${currentTab === 'sync' ? 'text-emerald-400 font-bold' : ''}`}
          >
            Supabase/Git
          </button>
        </div>
      </div>
    </header>
  );
};
