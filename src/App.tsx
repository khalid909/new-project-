import React, { useState, useEffect } from 'react';
import { 
  Currency, Language, Store, Product, Order, Customer, Coupon, 
  PlanType, SupabaseConfig, GitHubConfig, SellerUser, PlatformFeatureItem, StoreFeatureItem 
} from './types';
import { 
  INITIAL_STORE, INITIAL_PRODUCTS, INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, INITIAL_COUPONS, INITIAL_SELLER_USER, 
  INITIAL_SUPABASE_CONFIG, INITIAL_GITHUB_CONFIG, PLANS, 
  INITIAL_PLATFORM_FEATURES, INITIAL_STORE_FEATURES 
} from './data/initialData';
import { LandingPageView } from './components/LandingPageView';
import { RegisterStoreView } from './components/RegisterStoreView';
import { StoreDashboardView } from './components/StoreDashboardView';
import { PlatformAdminView } from './components/PlatformAdminView';

import { SellerLoginModal } from './components/SellerLoginModal';
import { PublicStoreView } from './components/PublicStoreView';
import { PlatformFeaturesModal } from './components/PlatformFeaturesModal';
import { Footer } from './components/Footer';
import { 
  Store as StoreIcon, Plus, ExternalLink, Globe, 
  Layers, ShieldCheck, ChevronDown, Check, LogIn, LogOut, User,
  BarChart2, Sparkles, Sliders, ShoppingBag, Copy, ArrowRight, ArrowLeft,
  Share2, Link2, CheckCircle2, Smartphone, X
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [currency, setCurrency] = useState<Currency>('DZD');
  
  // Navigation mode: 'landing' | 'dashboard' | 'register' | 'store' | 'admin'
  const [appMode, setAppMode] = useState<'landing' | 'dashboard' | 'register' | 'pricing' | 'store' | 'admin'>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const portal = urlParams.get('portal');
      const modeParam = urlParams.get('mode') || urlParams.get('view');
      const storeSlug = urlParams.get('store');

      if (portal === 'platform' || modeParam === 'platform') {
        return 'landing';
      }
      if (modeParam === 'admin') return 'admin';
      if (storeSlug || modeParam === 'store') return 'store';
      if (modeParam === 'dashboard') return 'dashboard';
      if (modeParam === 'register') return 'register';

      const hasCreatedStore = localStorage.getItem('has_created_store') === 'true';
      if (hasCreatedStore) {
        return 'dashboard';
      }
    } catch (e) {}
    return 'dashboard';
  });
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<SellerUser | null>(() => {
    try {
      const saved = localStorage.getItem('avanto_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SELLER_USER;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isGlobalShareModalOpen, setIsGlobalShareModalOpen] = useState<boolean>(false);
  const [copiedLinkType, setCopiedLinkType] = useState<string | null>(null);

  // Platform Modular Features State
  const [features, setFeatures] = useState<PlatformFeatureItem[]>(() => {
    try {
      const saved = localStorage.getItem('avanto_platform_features');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_PLATFORM_FEATURES;
  });
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState<boolean>(false);

  // Seller Store Features State
  const [storeFeatures, setStoreFeatures] = useState<StoreFeatureItem[]>(() => {
    try {
      const saved = localStorage.getItem('avanto_store_features');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_STORE_FEATURES;
  });

  // Stores State
  const [stores, setStores] = useState<Store[]>(() => {
    try {
      const saved = localStorage.getItem('avanto_stores');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [INITIAL_STORE];
  });
  const [activeStoreId, setActiveStoreId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('avanto_active_store_id');
      if (saved) return saved;
    } catch (e) {}
    return INITIAL_STORE.id;
  });
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [previewingStore, setPreviewingStore] = useState<Store | null>(null);

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(INITIAL_SUPABASE_CONFIG);
  const [gitHubConfig, setGitHubConfig] = useState<GitHubConfig>(INITIAL_GITHUB_CONFIG);

  const isAr = language === 'ar';
  const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0] || INITIAL_STORE;

  useEffect(() => {
    try {
      localStorage.setItem('avanto_stores', JSON.stringify(stores));
    } catch (e) {}
  }, [stores]);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const switchMode = (newMode: 'landing' | 'dashboard' | 'register' | 'pricing' | 'store' | 'admin') => {
    setAppMode(newMode);
    try {
      const url = new URL(window.location.href);
      if (newMode === 'landing') {
        url.searchParams.set('portal', 'platform');
        url.searchParams.delete('mode');
      } else {
        url.searchParams.delete('portal');
        url.searchParams.set('mode', newMode);
      }
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  };

  const isFeatureActive = (id: string) => {
    const feat = features.find((f) => f.id === id);
    return feat ? feat.isEnabled && !feat.isRemoved : true;
  };
  const activeFeaturesCount = features.filter((f) => f.isEnabled && !f.isRemoved).length;

  const handleLoginSuccess = (user: SellerUser, storeId: string) => {
    setCurrentUser(user);
    setActiveStoreId(storeId);
    switchMode('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoginModalOpen(true);
  };

  const handleRegisterSuccess = (newStore: Store, targetMode: 'store' | 'dashboard' = 'dashboard') => {
    setStores((prev) => [newStore, ...prev]);
    setActiveStoreId(newStore.id);
    const seller: SellerUser = {
      id: `usr_${newStore.id}`,
      name: newStore.ownerName,
      email: newStore.ownerEmail,
      storeId: newStore.id
    };
    setCurrentUser(seller);
    try {
      localStorage.setItem('has_created_store', 'true');
      localStorage.setItem('merchant_store_id', newStore.id);
      localStorage.setItem('avanto_active_store_id', newStore.id);
    } catch (e) {}
    switchMode(targetMode);
  };

  const handleNewCustomerOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setStores((prev) => prev.map((s) => s.id === newOrder.storeId ? { ...s, ordersCount: s.ordersCount + 1, totalSales: s.totalSales + newOrder.total } : s));
  };

  // 1. المتجر المستقل
  if (appMode === 'store') {
    return (
      <div className="min-h-screen">
        <PublicStoreView
          store={activeStore}
          products={products}
          language={language}
          currency={currency}
          storeFeatures={storeFeatures}
          currentUser={currentUser}
          isStandalonePage={true}
          onBackToDashboard={() => switchMode('dashboard')}
          onNewCustomerOrder={handleNewCustomerOrder}
          onToggleStoreFeature={() => {}}
          onRemoveStoreFeature={() => {}}
          onRestoreStoreFeature={() => {}}
          onUpdateStoreFeature={() => {}}
          onUpdateStore={() => {}}
          onResetDefaultStoreFeatures={() => {}}
          onEnableAllStoreFeatures={() => {}}
          isOnlinePaymentsEnabled={true}
        />
      </div>
    );
  }

  // 2. لوحة تحكم المنصة المركزية للإدارة (Platform Admin View)
  if (appMode === 'admin') {
    return (
      <PlatformAdminView
        stores={stores}
        currency={currency}
        language={language}
        onSelectStore={(storeId) => {
          setActiveStoreId(storeId);
          switchMode('dashboard');
        }}
        onDeleteStore={(storeId) => {
          setStores(stores.filter(s => s.id !== storeId));
        }}
        onBackToPlatform={() => switchMode('dashboard')}
      />
    );
  }

  // 3. لوحة تحكم التاجر المستقل
  if (appMode === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 h-16">
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => switchMode('store')}
                  className="flex items-center gap-2.5 text-start group cursor-pointer"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-xs"
                    style={{ backgroundColor: activeStore?.accentColor || '#059669' }}
                  >
                    {(activeStore.nameAr || activeStore.name).charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {isAr ? activeStore.nameAr : activeStore.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {activeStore.settings.subdomain}
                    </span>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                {/* زر الدخول للوحة تحكم الإدارة المركزية للمنصة */}
                <button
                  onClick={() => switchMode('admin')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'إدارة المنصة والتجار 👑' : 'Platform Admin 👑'}</span>
                </button>

                <button
                  onClick={() => switchMode('store')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isAr ? 'عرض المتجر المستقل 🛍️' : 'View Store 🛍️'}</span>
                </button>

                {/* زر تسجيل الدخول للمنصة الأم / التبديل */}
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تسجيل الدخول' : 'Login'}</span>
                </button>

                {/* زر تسجيل متجر جديد */}
                <button
                  onClick={() => switchMode('register')}
                  className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تسجيل متجر جديد' : 'Register Store'}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 cursor-pointer transition-colors"
                  title={isAr ? 'تسجيل الخروج' : 'Logout'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </header>

        <main className="flex-1">
          <StoreDashboardView
            store={activeStore}
            products={products}
            orders={orders}
            customers={customers}
            coupons={coupons}
            currentUser={currentUser}
            currency={currency}
            language={language}
            supabaseConfig={supabaseConfig}
            gitHubConfig={gitHubConfig}
            features={features}
            storeFeatures={storeFeatures}
            onToggleFeature={() => {}}
            onRemoveFeature={() => {}}
            onRestoreFeature={() => {}}
            onOpenFeaturesModal={() => setIsFeaturesModalOpen(true)}
            onToggleStoreFeature={() => {}}
            onRemoveStoreFeature={() => {}}
            onRestoreStoreFeature={() => {}}
            onEnableAllStoreFeatures={() => {}}
            onResetDefaultStoreFeatures={() => {}}
            onAddStoreFeature={() => {}}
            onUpdateStoreFeature={() => {}}
            onUpdateStoreSettings={(settings) => {
              setStores(stores.map(s => s.id === activeStore.id ? { ...s, settings: { ...s.settings, ...settings } } : s));
            }}
            onUpdateStorePlan={(plan) => {
              setStores(stores.map(s => s.id === activeStore.id ? { ...s, plan } : s));
            }}
            onAddProduct={(prod) => setProducts([prod, ...products])}
            onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))}
            onUpdateProductStock={(id, stock) => setProducts(products.map(p => p.id === id ? { ...p, stock } : p))}
            onUpdateOrderStatus={(id, status) => setOrders(orders.map(o => o.id === id ? { ...o, status } : o))}
            onAddCoupon={(cpn) => setCoupons([cpn, ...coupons])}
            onToggleCoupon={(id) => setCoupons(coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c))}
            onOpenLivePreview={() => switchMode('store')}
            onOpenStandaloneStore={() => switchMode('store')}
            onOpenCreateNewStore={() => switchMode('register')}
            onLogout={handleLogout}
          />
        </main>
      </div>
    );
  }

  // 4. وضع التسجيل أو الهبوط للمنصة الأم
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button onClick={() => switchMode('dashboard')} className="font-black text-xl text-slate-900 uppercase">
            WASLA<span className="text-emerald-600">DZ</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
            >
              {isAr ? 'تسجيل الدخول' : 'Login'}
            </button>
            <button
              onClick={() => switchMode('register')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              {isAr ? 'إنشاء متجر جديد' : 'Register Store'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {appMode === 'landing' && (
          <LandingPageView
            language={language}
            currency={currency}
            onRegisterSuccess={(store) => handleRegisterSuccess(store, 'dashboard')}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onGoToDashboard={() => switchMode('dashboard')}
            onOpenLivePreview={() => switchMode('store')}
            existingStore={activeStore}
          />
        )}

        {appMode === 'register' && (
          <RegisterStoreView
            language={language}
            currency={currency}
            onRegisterSuccess={handleRegisterSuccess}
            onGoToExistingStore={() => switchMode('dashboard')}
            existingStoreName={isAr ? activeStore.nameAr : activeStore.name}
          />
        )}
      </main>

      <SellerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        language={language}
        stores={stores}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          switchMode('register');
        }}
        isDemoLoginEnabled={true}
      />
    </div>
  );
}