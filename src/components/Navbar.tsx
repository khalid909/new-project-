import React from 'react';
import { Currency, Language, Store } from '../types';
import { 
  Layers, Store as StoreIcon, Package, ShoppingCart, 
  Users, Database, Globe, ExternalLink, Plus, ChevronDown 
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'stores' | 'products' | 'orders' | 'customers' | 'sync';
  setCurrentTab: (tab: 'dashboard' | 'stores' | 'products' | 'orders' | 'customers' | 'sync') => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  stores: Store[];
  activeStoreId: string;
  setActiveStoreId: (id: string) => void;
  onOpenStorePreview: () => void;
  onOpenCreateStore: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currency,
  setCurrency,
  language,
  setLanguage,
  stores,
  activeStoreId,
  setActiveStoreId,
  onOpenStorePreview,
  onOpenCreateStore
}) => {
  const isAr = language === 'ar';
  const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0];

  return (
    <header className="sticky top-0 z-40 bg-[#080C15]/90 backdrop-blur-xl border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          
          {/* Zone 1: AVANTO Brand Lockup */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-3 text-start group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all duration-300 group-hover:scale-105">
                <span className="font-sans font-black text-white text-xl tracking-tighter">A</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-wider text-white group-hover:text-indigo-400 transition-colors uppercase">
                    AVANTO
                  </span>
                  <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono px-1.5 py-0.5 rounded">
                    OS
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">
                  {isAr ? 'نظام إدارة المتاجر السحابية' : 'MERCHANT CLOUD OS'}
                </span>
              </div>
            </button>

            {/* Active Store Quick Switcher Dropdown */}
            <div className="hidden xl:flex items-center gap-2 ps-4 border-s border-slate-800">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-1.5 transition-colors">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: activeStore?.accentColor || '#6366F1' }}
                />
                <select
                  value={activeStoreId}
                  onChange={(e) => setActiveStoreId(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer max-w-[150px] truncate"
                  aria-label="Active store switcher"
                >
                  {stores.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#0B0F19] text-slate-200">
                      {isAr ? s.nameAr : s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Zone 2: Pure Merchant Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-1.5 whitespace-nowrap transition-colors pb-1 relative ${
                currentTab === 'dashboard'
                  ? 'text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{isAr ? 'لوحة التحكم' : 'Dashboard'}</span>
              {currentTab === 'dashboard' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('stores')}
              className={`flex items-center gap-1.5 whitespace-nowrap transition-colors pb-1 relative ${
                currentTab === 'stores'
                  ? 'text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <StoreIcon className="w-4 h-4" />
              <span>{isAr ? `متاجري (${stores.length})` : `My Stores (${stores.length})`}</span>
              {currentTab === 'stores' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('products')}
              className={`flex items-center gap-1.5 whitespace-nowrap transition-colors pb-1 relative ${
                currentTab === 'products'
                  ? 'text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>{isAr ? 'المنتجات والمخزون' : 'Products & Inventory'}</span>
              {currentTab === 'products' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('orders')}
              className={`flex items-center gap-1.5 whitespace-nowrap transition-colors pb-1 relative ${
                currentTab === 'orders'
                  ? 'text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isAr ? 'الطلبات والشحن' : 'Orders & Dispatch'}</span>
              {currentTab === 'orders' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('customers')}
              className={`flex items-center gap-1.5 whitespace-nowrap transition-colors pb-1 relative ${
                currentTab === 'customers'
                  ? 'text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isAr ? 'العملاء (CRM)' : 'Customers CRM'}</span>
              {currentTab === 'customers' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setCurrentTab('sync')}
              className={`flex items-center gap-1.5 whitespace-nowrap transition-colors pb-1 relative ${
                currentTab === 'sync'
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Supabase & GitHub</span>
              {currentTab === 'sync' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          </nav>

          {/* Zone 3: Actions, Currency, Language, & Live Storefront Preview */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-slate-900 border border-slate-800 text-xs font-mono rounded-lg px-2.5 py-2 text-slate-300 hover:border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
              aria-label="Currency"
            >
              <option value="SAR">SAR (ر.س)</option>
              <option value="USD">USD ($)</option>
              <option value="AED">AED (د.إ)</option>
              <option value="EUR">EUR (€)</option>
            </select>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-indigo-400 hover:border-slate-700 transition-colors"
              title="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Live Customer Storefront Preview CTA */}
            <button
              onClick={onOpenStorePreview}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-200 bg-slate-900 border border-indigo-500/30 hover:border-indigo-400 hover:text-white transition-all shadow-sm active:scale-95"
              title={isAr ? 'معاينة واجهة متجر العميل' : 'Preview Live Storefront'}
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">
                {isAr ? 'معاينة متجر العميل' : 'Live Storefront'}
              </span>
            </button>

            {/* New Store Button */}
            <button
              onClick={onOpenCreateStore}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 rounded-lg shadow-md shadow-indigo-500/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إطلاق متجر' : 'New Store'}</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden items-center justify-around py-2.5 border-t border-slate-900 text-xs text-slate-400 overflow-x-auto">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-2 py-1 whitespace-nowrap ${currentTab === 'dashboard' ? 'text-indigo-400 font-bold' : ''}`}
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <button
            onClick={() => setCurrentTab('stores')}
            className={`px-2 py-1 whitespace-nowrap ${currentTab === 'stores' ? 'text-indigo-400 font-bold' : ''}`}
          >
            {isAr ? 'المتاجر' : 'Stores'}
          </button>
          <button
            onClick={() => setCurrentTab('products')}
            className={`px-2 py-1 whitespace-nowrap ${currentTab === 'products' ? 'text-indigo-400 font-bold' : ''}`}
          >
            {isAr ? 'المنتجات' : 'Products'}
          </button>
          <button
            onClick={() => setCurrentTab('orders')}
            className={`px-2 py-1 whitespace-nowrap ${currentTab === 'orders' ? 'text-indigo-400 font-bold' : ''}`}
          >
            {isAr ? 'الطلبات' : 'Orders'}
          </button>
          <button
            onClick={() => setCurrentTab('customers')}
            className={`px-2 py-1 whitespace-nowrap ${currentTab === 'customers' ? 'text-indigo-400 font-bold' : ''}`}
          >
            {isAr ? 'العملاء' : 'CRM'}
          </button>
          <button
            onClick={() => setCurrentTab('sync')}
            className={`px-2 py-1 whitespace-nowrap ${currentTab === 'sync' ? 'text-emerald-400 font-bold' : ''}`}
          >
            Supabase/Git
          </button>
        </div>
      </div>
    </header>
  );
};
