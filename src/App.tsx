import React, { useState, useEffect } from 'react';
import { 
  Currency, Language, Store, Product, Order, Customer, Coupon, 
  PlanType, SupabaseConfig, GitHubConfig, SellerUser, PlatformFeatureItem, StoreFeatureItem 
} from './types';
import { 
  INITIAL_STORE, INITIAL_STORES, INITIAL_PRODUCTS, INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, INITIAL_COUPONS, INITIAL_SELLER_USER, 
  INITIAL_PLATFORM_FEATURES, INITIAL_STORE_FEATURES 
} from './data/initialData';
import { PlatformPortalView } from './components/PlatformPortalView';
import { StoreDashboardView } from './components/StoreDashboardView';
import { PlatformAdminView } from './components/PlatformAdminView';
import { PublicStoreView } from './components/PublicStoreView';
import { 
  ShieldCheck, LogOut, Lock, Mail, Key, ShoppingBag, 
  ExternalLink, ArrowLeft, ArrowRight
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [currency, setCurrency] = useState<Currency>('DZD');
  
  // ─── بيانات دخول المؤسس الرسمية ───
  const FOUNDER_EMAIL = "founder@wasladz.app";
  const FOUNDER_PIN = "WASLADZ2026";

  const [founderEmailInput, setFounderEmailInput] = useState('');
  const [founderPinInput, setFounderPinInput] = useState('');
  const [founderLoginError, setFounderLoginError] = useState(false);

  // جلسة المؤسس المنفصلة
  const [isFounderAuthenticated, setIsFounderAuthenticated] = useState<boolean>(() => {
    try {
      const auth = sessionStorage.getItem('wasladz_founder_session');
      return auth === 'true';
    } catch (e) {}
    return false;
  });

  // ─── STORES REPOSITORY (Synced with LocalStorage) ───
  const [stores, setStores] = useState<Store[]>(() => {
    try {
      const saved = localStorage.getItem('wasladz_stores_repo');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_STORES;
  });

  // Active Store Selection
  const [activeStoreId, setActiveStoreId] = useState<string>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const storeParam = urlParams.get('store');
      if (storeParam) {
        const found = INITIAL_STORES.find(s => s.slug === storeParam || s.id === storeParam);
        if (found) return found.id;
      }
      const saved = localStorage.getItem('wasladz_active_store_id');
      if (saved) return saved;
    } catch (e) {}
    return INITIAL_STORE.id;
  });

  // Mode routing: 'platform' (Landing & Register) | 'dashboard' (Merchant Private) | 'store' (Customer) | 'founder' (Founder Tower)
  const [appMode, setAppMode] = useState<'platform' | 'dashboard' | 'store' | 'founder'>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const portalParam = urlParams.get('portal');
      const modeParam = urlParams.get('mode') || urlParams.get('view');
      
      if (portalParam === 'founder' || modeParam === 'founder' || modeParam === 'admin') {
        return 'founder';
      }
      if (modeParam === 'store' || portalParam === 'store') {
        return 'store';
      }
      if (modeParam === 'dashboard' || portalParam === 'merchant') {
        return 'dashboard';
      }
      if (portalParam === 'platform' || modeParam === 'platform' || modeParam === 'register') {
        return 'platform';
      }
    } catch (e) {}
    // Default to platform landing page so new users can register or existing can login
    return 'platform';
  });

  const [currentUser, setCurrentUser] = useState<SellerUser | null>(INITIAL_SELLER_USER);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [features, setFeatures] = useState<PlatformFeatureItem[]>(INITIAL_PLATFORM_FEATURES);
  const [storeFeatures, setStoreFeatures] = useState<StoreFeatureItem[]>(INITIAL_STORE_FEATURES);

  const isAr = language === 'ar';
  const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0] || INITIAL_STORE;

  // Persist stores to LocalStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('wasladz_stores_repo', JSON.stringify(stores));
    } catch (e) {}
  }, [stores]);

  // Persist active store
  useEffect(() => {
    try {
      localStorage.setItem('wasladz_active_store_id', activeStoreId);
    } catch (e) {}
  }, [activeStoreId]);

  // Sync mode changes to URL query parameters cleanly
  const switchMode = (newMode: 'platform' | 'dashboard' | 'store' | 'founder', targetStoreId?: string) => {
    if (targetStoreId) {
      setActiveStoreId(targetStoreId);
    }
    setAppMode(newMode);
    try {
      const selected = targetStoreId ? stores.find(s => s.id === targetStoreId) : activeStore;
      const slug = selected?.slug || 'store';
      
      let newUrl = window.location.pathname;
      if (newMode === 'founder') {
        newUrl += '?portal=founder';
      } else if (newMode === 'dashboard') {
        newUrl += `?mode=dashboard&store=${slug}`;
      } else if (newMode === 'store') {
        newUrl += `?mode=store&store=${slug}`;
      } else {
        newUrl += '?portal=platform';
      }
      window.history.replaceState({}, '', newUrl);
    } catch (e) {}
  };

  // Founder Login Handlers
  const handleFounderLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (founderEmailInput.trim().toLowerCase() === FOUNDER_EMAIL.toLowerCase() && founderPinInput.trim() === FOUNDER_PIN) {
      setIsFounderAuthenticated(true);
      try {
        sessionStorage.setItem('wasladz_founder_session', 'true');
      } catch (e) {}
      setFounderLoginError(false);
    } else {
      setFounderLoginError(true);
    }
  };

  const handleFounderLogout = () => {
    setIsFounderAuthenticated(false);
    try {
      sessionStorage.removeItem('wasladz_founder_session');
    } catch (e) {}
  };

  // New Merchant Registration Handler (Immediate Transition to Private Store Dashboard)
  const handleRegisterNewStore = (newStore: Store) => {
    setStores((prev) => [newStore, ...prev]);
    setActiveStoreId(newStore.id);
    switchMode('dashboard', newStore.id);
  };

  // ─────────────────────────────────────────────────────────────
  // 1. INDEPENDENT FOUNDER TOWER (موقع المؤسس المستقل تماماً)
  // ─────────────────────────────────────────────────────────────
  if (appMode === 'founder') {
    // If not authenticated, show Founder Private Gate
    if (!isFounderAuthenticated) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans" dir="rtl">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-black text-white">بوابة المؤسس المستقلة</h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                منطقة الإدارة العليا الخاصة بمؤسس منصة وصلة ديزاد (WaslaDZ Tower). تتيح لك الاطلاع على كل المتاجر المسجلة، إحصائيات المبيعات، وإدارة الباقات.
              </p>
            </div>

            <form onSubmit={handleFounderLogin} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-bold">البريد الإلكتروني للمؤسس</label>
                <div className="relative">
                  <Mail className="absolute top-3.5 start-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={founderEmailInput}
                    onChange={(e) => setFounderEmailInput(e.target.value)}
                    placeholder="founder@wasladz.app"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-10 pe-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-bold">رمز السر (Founder PIN)</label>
                <div className="relative">
                  <Key className="absolute top-3.5 start-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={founderPinInput}
                    onChange={(e) => setFounderPinInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-10 pe-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {founderLoginError && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-center font-bold">
                  بيانات المؤسس غير صحيحة! يرجى التحقق من البريد ورمز السر.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-600/30 cursor-pointer transition-all"
              >
                الدخول كـ مؤسس المنصة 🔓
              </button>
            </form>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
              <div className="text-amber-400 font-bold">بيانات دخول المؤسس المعتمدة:</div>
              <div>البريد: <span className="text-white">founder@wasladz.app</span></div>
              <div>الرمز: <span className="text-white">WASLADZ2026</span></div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => switchMode('platform')}
                className="text-xs text-slate-500 hover:text-slate-300 font-medium flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <span>العودة إلى المنصة العامة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      );
    }

    // Authenticated Founder View: Platform Admin Dashboard
    return (
      <PlatformAdminView
        stores={stores}
        currency={currency}
        language={language}
        onSelectStore={(storeId) => {
          setActiveStoreId(storeId);
          switchMode('dashboard', storeId);
        }}
        onDeleteStore={(storeId) => {
          setStores(stores.filter(s => s.id !== storeId));
        }}
        onToggleStoreStatus={(storeId, status) => {
          setStores(stores.map(s => s.id === storeId ? { ...s, status } : s));
        }}
        onUpdateStorePlan={(storeId, plan) => {
          setStores(stores.map(s => s.id === storeId ? { ...s, plan } : s));
        }}
        onAddStore={(newStore) => {
          setStores([newStore, ...stores]);
        }}
        onBackToPlatform={handleFounderLogout}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. PUBLIC STOREFRONT (متجر الزبائن المستقل)
  // ─────────────────────────────────────────────────────────────
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
          onNewCustomerOrder={(newOrder) => {
            setOrders((prev) => [newOrder, ...prev]);
            setStores((prev) => prev.map((s) => s.id === newOrder.storeId ? { 
              ...s, 
              ordersCount: (s.ordersCount || 0) + 1, 
              totalSales: (s.totalSales || 0) + newOrder.total 
            } : s));
          }}
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

  // ─────────────────────────────────────────────────────────────
  // 3. PLATFORM PORTAL (المنصة العامة لتسجيل المتاجر - شوبيفاي ويوكان)
  // ─────────────────────────────────────────────────────────────
  if (appMode === 'platform') {
    return (
      <PlatformPortalView
        language={language}
        currency={currency}
        onRegisterStore={handleRegisterNewStore}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 4. PRIVATE MERCHANT STORE DASHBOARD (لوحة تحكم التاجر الخاصة)
  // "ثم لا يزيد يرى اي رابط أو اي زر للمنصة لانه الان في متجره الخاص"
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800" dir="rtl">
      
      {/* ─── PRIVATE MERCHANT STORE HEADER (NO PLATFORM LINKS / BRANDING) ─── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16">
            
            {/* Merchant's Store Identity */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-sm"
                style={{ backgroundColor: activeStore?.accentColor || '#059669' }}
              >
                {(activeStore.nameAr || activeStore.name).charAt(0)}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm sm:text-base text-slate-900">
                    {isAr ? activeStore.nameAr : activeStore.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>متجر نشط</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                  <span>{activeStore.settings?.subdomain || `${activeStore.slug}.wasladz.app`}</span>
                  {activeStore.wilaya && (
                    <span className="text-slate-400 font-sans">
                      • 📍 {activeStore.wilaya}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Merchant Actions ONLY: View Live Store & Logout of Store */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => switchMode('store')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>معاينة متجري المباشر للزبائن 🛍️</span>
              </button>

              <button
                onClick={() => switchMode('platform')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="تسجيل الخروج من لوحة تحكم المتجر"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ─── MERCHANT STORE BODY (Dashboard, Orders, Products, 69 Wilayas, Recharts) ─── */}
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
          supabaseConfig={SUPABASE_CONFIG_DEFAULT}
          gitHubConfig={GITHUB_CONFIG_DEFAULT}
          features={features}
          storeFeatures={storeFeatures}
          onToggleFeature={() => {}}
          onRemoveFeature={() => {}}
          onRestoreFeature={() => {}}
          onOpenFeaturesModal={() => {}}
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
          onOpenCreateNewStore={() => switchMode('platform')}
          onLogout={() => switchMode('platform')}
        />
      </main>
    </div>
  );
}

const SUPABASE_CONFIG_DEFAULT = { projectUrl: 'https://xyz.supabase.co', anonKey: 'public-key', isConnected: true };
const GITHUB_CONFIG_DEFAULT = { repoUrl: 'https://github.com/user/store', branch: 'main', connected: true };