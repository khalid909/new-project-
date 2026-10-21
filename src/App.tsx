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
import { RegisterStoreView } from './components/RegisterStoreView';
import { StoreDashboardView } from './components/StoreDashboardView';
import { PlatformAdminView } from './components/PlatformAdminView';
import { PublicStoreView } from './components/PublicStoreView';
import { PlatformFeaturesModal } from './components/PlatformFeaturesModal';
import { 
  ShieldCheck, LogIn, LogOut, Lock, Mail, Key, ShoppingBag, Plus, ExternalLink 
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [currency, setCurrency] = useState<Currency>('DZD');
  
  // بيانات دخول المؤسس الرسمية
  const FOUNDER_EMAIL = "founder@wasladz.app";
  const FOUNDER_PIN = "WASLADZ2026";

  const [founderEmailInput, setFounderEmailInput] = useState('');
  const [founderPinInput, setFounderPinInput] = useState('');
  const [founderLoginError, setFounderLoginError] = useState(false);

  // جعل الحالة الافتراضية مقفلة تماماً (false) في أي متصفح جديد حتى يتم تسجيل الدخول الصحيح
  const [isFounderAuthenticated, setIsFounderAuthenticated] = useState<boolean>(() => {
    try {
      const auth = sessionStorage.getItem('wasladz_founder_session');
      return auth === 'true';
    } catch (e) {}
    return false;
  });

  const [appMode, setAppMode] = useState<'dashboard' | 'store' | 'admin' | 'register'>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const modeParam = urlParams.get('mode') || urlParams.get('view');
      if (modeParam === 'store') return 'store';
      if (modeParam === 'admin') return 'admin';
      if (modeParam === 'register') return 'register';
    } catch (e) {}
    return 'dashboard';
  });

  const [currentUser, setCurrentUser] = useState<SellerUser | null>(INITIAL_SELLER_USER);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState<boolean>(false);

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
  const [features, setFeatures] = useState<PlatformFeatureItem[]>(INITIAL_PLATFORM_FEATURES);
  const [storeFeatures, setStoreFeatures] = useState<StoreFeatureItem[]>(INITIAL_STORE_FEATURES);

  const isAr = language === 'ar';
  const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0] || INITIAL_STORE;

  useEffect(() => {
    try {
      localStorage.setItem('avanto_stores', JSON.stringify(stores));
    } catch (e) {}
  }, [stores]);

  const switchMode = (newMode: 'dashboard' | 'store' | 'admin' | 'register') => {
    setAppMode(newMode);
  };

  const handleFounderLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (founderEmailInput.trim() === FOUNDER_EMAIL && founderPinInput.trim() === FOUNDER_PIN) {
      setIsFounderAuthenticated(true);
      try {
        // استخدام sessionStorage لضمان إبقاء الجلسة في المتصفح الحالي فقط أو قفلها عند إغلاق المتصفح
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

  // شاشة قفل المنصة: تظهر في أي متصفح أو جهاز جديد تلقائياً
  if (!isFounderAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white">المنصة مغلقة (خاصة بالمؤسس)</h1>
            <p className="text-xs text-slate-400">
              هذه المنصة محمية بالكامل. يرجى إدخال بيانات المؤسس للوصول إلى النظام.
            </p>
          </div>

          <form onSubmit={handleFounderLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block text-slate-300 font-bold">البريد الإلكتروني للمؤسس</label>
              <div className="relative">
                <Mail className="absolute top-3.5 start-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={founderEmailInput}
                  onChange={(e) => setFounderEmailInput(e.target.value)}
                  placeholder="founder@wasladz.app"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-10 pe-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-300 font-bold">رمز السر (PIN / Password)</label>
              <div className="relative">
                <Key className="absolute top-3.5 start-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={founderPinInput}
                  onChange={(e) => setFounderPinInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-10 pe-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {founderLoginError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-center font-bold">
                البريد الإلكتروني أو رمز السر غير صحيح!
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 cursor-pointer transition-all"
            >
              تسجيل الدخول كمؤسس 🔓
            </button>
          </form>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
            <div className="text-emerald-400 font-bold">بيانات الدخول:</div>
            <div>البريد: <span className="text-white">founder@wasladz.app</span></div>
            <div>الرمز: <span className="text-white">WASLADZ2026</span></div>
          </div>
        </div>
      </div>
    );
  }

  // 1. المتجر المستقل للزبائن
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
            setStores((prev) => prev.map((s) => s.id === newOrder.storeId ? { ...s, ordersCount: s.ordersCount + 1, totalSales: s.totalSales + newOrder.total } : s));
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

  // 2. لوحة تحكم الإدارة المركزية الشاملة (للمؤسس)
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

  // 3. تسجيل متجر جديد
  if (appMode === 'register') {
    return (
      <RegisterStoreView
        language={language}
        currency={currency}
        onRegisterSuccess={(newStore) => {
          setStores((prev) => [newStore, ...prev]);
          setActiveStoreId(newStore.id);
          switchMode('dashboard');
        }}
        onGoToExistingStore={() => switchMode('dashboard')}
        existingStoreName={isAr ? activeStore.nameAr : activeStore.name}
      />
    );
  }

  // 4. لوحة تحكم التاجر / المؤسس الرئيسية
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-800" dir="rtl">
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

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                🔒 المنصة مغلقة (وضع المؤسس)
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => switchMode('admin')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>إدارة كل التجار 👑</span>
              </button>

              <button
                onClick={() => switchMode('store')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>عرض المتجر 🛍️</span>
              </button>

              <button
                onClick={() => switchMode('register')}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>تسجيل متجر جديد</span>
              </button>

              <button
                onClick={handleFounderLogout}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer transition-colors"
                title="تسجيل خروج المؤسس"
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
          supabaseConfig={SUPABASE_CONFIG_DEFAULT}
          gitHubConfig={GITHUB_CONFIG_DEFAULT}
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
          onLogout={handleFounderLogout}
        />
      </main>
    </div>
  );
}

const SUPABASE_CONFIG_DEFAULT = { projectUrl: 'https://xyz.supabase.co', anonKey: 'public-key' };
const GITHUB_CONFIG_DEFAULT = { repoUrl: 'https://github.com/user/store', branch: 'main' };