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
  
  // Navigation mode: 
  // يفصل المنصة تماماً: إذا كان هناك متجر مسجل مسبقاً ولا يوجد طلب صريح لزيارة المنصة عبر ?portal=platform، 
  // فسيدخل التاجر مباشرة إلى لوحة التحكم الخاصة بمتجره أو متجره المستقل.
  const [appMode, setAppMode] = useState<'landing' | 'dashboard' | 'register' | 'pricing' | 'store'>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const portal = urlParams.get('portal');
      const modeParam = urlParams.get('mode') || urlParams.get('view');
      const storeSlug = urlParams.get('store');

      // طلب صريح لزيارة بوابة المنصة الأم
      if (portal === 'platform' || modeParam === 'platform') {
        return 'landing';
      }

      if (storeSlug || modeParam === 'store') return 'store';
      if (modeParam === 'dashboard') return 'dashboard';
      if (modeParam === 'register') return 'register';

      // بمجرد أن يقوم التاجر بإنشاء متجر، يتم توجيهه تلقائياً للوحة التحكم أو المتجر الخاص به حصراً
      const hasCreatedStore = localStorage.getItem('has_created_store') === 'true';
      if (hasCreatedStore) {
        return 'dashboard';
      }
    } catch (e) {}
    return 'dashboard'; // الافتراضي هو لوحة التحكم المستقلة للمتجر لضمان الفصل التام
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
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((f: PlatformFeatureItem) => f.id === 'plansAndUpgrades' ? { ...f, isEnabled: false, isRemoved: true } : f);
        }
      }
    } catch (e) {}
    return INITIAL_PLATFORM_FEATURES;
  });
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState<boolean>(false);

  // Seller Store Features & Settings State
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
  
  // Products, Orders, Customers, Coupons
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('avanto_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('avanto_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_ORDERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('avanto_customers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_CUSTOMERS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('avanto_coupons');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_COUPONS;
  });

  const [previewingStore, setPreviewingStore] = useState<Store | null>(null);

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(INITIAL_SUPABASE_CONFIG);
  const [gitHubConfig, setGitHubConfig] = useState<GitHubConfig>(INITIAL_GITHUB_CONFIG);

  const isAr = language === 'ar';
  const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0] || INITIAL_STORE;

  // LocalStorage Sync
  useEffect(() => {
    try {
      localStorage.setItem('avanto_stores', JSON.stringify(stores));
    } catch (e) {}
  }, [stores]);

  useEffect(() => {
    try {
      localStorage.setItem('avanto_active_store_id', activeStoreId);
    } catch (e) {}
  }, [activeStoreId]);

  useEffect(() => {
    try {
      localStorage.setItem('avanto_platform_features', JSON.stringify(features));
    } catch (e) {}
  }, [features]);

  useEffect(() => {
    try {
      localStorage.setItem('avanto_store_features', JSON.stringify(storeFeatures));
    } catch (e) {}
  }, [storeFeatures]);

  useEffect(() => {
    try {
      localStorage.setItem('avanto_products', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('avanto_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('avanto_coupons', JSON.stringify(coupons));
    } catch (e) {}
  }, [coupons]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('avanto_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('avanto_current_user');
      }
    } catch (e) {}
  }, [currentUser]);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const portal = urlParams.get('portal');
      const modeParam = urlParams.get('mode') || urlParams.get('view');
      const storeSlug = urlParams.get('store');

      if (portal === 'platform' || modeParam === 'platform') {
        setAppMode('landing');
      } else if (modeParam === 'store' || window.location.hash === '#store') {
        setAppMode('store');
      } else if (modeParam === 'dashboard' || window.location.hash === '#dashboard') {
        setAppMode('dashboard');
      } else if (modeParam === 'register' || window.location.hash === '#register') {
        setAppMode('register');
      } else {
        // إذا كان هناك متجر مسجل مسبقاً، توجه فوراً للوحة التحكم المستقلة
        setAppMode('dashboard');
      }

      if (storeSlug) {
        const found = stores.find((s) => s.slug === storeSlug || s.settings.subdomain.startsWith(storeSlug));
        if (found) {
          setActiveStoreId(found.id);
          setAppMode('store');
        } else {
          const cleanName = storeSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
          const newStore: Store = {
            ...INITIAL_STORE,
            id: `store_${storeSlug}`,
            slug: storeSlug,
            name: cleanName,
            nameAr: `متجر ${cleanName}`,
            settings: {
              ...INITIAL_STORE.settings,
              subdomain: `${storeSlug}.wasladz.app`
            }
          };
          setStores((prev) => [newStore, ...prev]);
          setActiveStoreId(newStore.id);
          setAppMode('store');
        }
      }
    } catch (e) {}
  }, [stores]);

  const switchMode = (newMode: 'landing' | 'dashboard' | 'register' | 'pricing' | 'store') => {
    setAppMode(newMode);
    try {
      const url = new URL(window.location.href);
      if (newMode === 'landing') {
        url.searchParams.set('portal', 'platform');
        url.searchParams.delete('mode');
        url.searchParams.delete('store');
      } else if (newMode === 'store') {
        url.searchParams.delete('portal');
        url.searchParams.set('mode', 'store');
        if (activeStore?.slug) url.searchParams.set('store', activeStore.slug);
      } else if (newMode === 'dashboard') {
        url.searchParams.delete('portal');
        url.searchParams.set('mode', 'dashboard');
        if (activeStore?.slug) url.searchParams.set('store', activeStore.slug);
      } else {
        url.searchParams.delete('portal');
        url.searchParams.set('mode', newMode);
        url.searchParams.delete('store');
      }
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  };

  const isFeatureActive = (id: string) => {
    const feat = features.find((f) => f.id === id);
    return feat ? feat.isEnabled && !feat.isRemoved : true;
  };
  const activeFeaturesCount = features.filter((f) => f.isEnabled && !f.isRemoved).length;

  const handleToggleFeature = (featureId: string) => {
    setFeatures((prev) => prev.map((f) => (f.id === featureId ? { ...f, isEnabled: !f.isEnabled } : f)));
  };

  const handleRemoveFeature = (featureId: string) => {
    setFeatures((prev) => prev.map((f) => (f.id === featureId ? { ...f, isRemoved: true, isEnabled: false } : f)));
  };

  const handleRestoreFeature = (featureId: string) => {
    setFeatures((prev) => prev.map((f) => (f.id === featureId ? { ...f, isRemoved: false, isEnabled: true } : f)));
  };

  const handleEnableAllFeatures = () => {
    setFeatures((prev) => prev.map((f) => ({ ...f, isEnabled: true, isRemoved: false })));
  };

  const handleResetDefaultFeatures = () => {
    setFeatures(INITIAL_PLATFORM_FEATURES);
  };

  const handleToggleStoreFeature = (featureId: string) => {
    setStoreFeatures((prev) => prev.map((f) => (f.id === featureId ? { ...f, isEnabled: !f.isEnabled } : f)));
  };

  const handleRemoveStoreFeature = (featureId: string) => {
    setStoreFeatures((prev) => prev.map((f) => (f.id === featureId ? { ...f, isRemoved: true, isEnabled: false } : f)));
  };

  const handleRestoreStoreFeature = (featureId: string) => {
    setStoreFeatures((prev) => prev.map((f) => (f.id === featureId ? { ...f, isRemoved: false, isEnabled: true } : f)));
  };

  const handleEnableAllStoreFeatures = () => {
    setStoreFeatures((prev) => prev.map((f) => ({ ...f, isEnabled: true, isRemoved: false })));
  };

  const handleResetDefaultStoreFeatures = () => {
    setStoreFeatures(INITIAL_STORE_FEATURES);
  };

  const handleAddStoreFeature = (newFeature: StoreFeatureItem) => {
    setStoreFeatures((prev) => [newFeature, ...prev]);
  };

  const handleUpdateStoreFeature = (updatedFeature: StoreFeatureItem) => {
    setStoreFeatures((prev) => prev.map((f) => (f.id === updatedFeature.id ? updatedFeature : f)));
  };

  const handleUpdateStoreInfo = (updatedStoreInfo: Partial<Store>) => {
    setStores((prev) => prev.map((s) => (s.id === activeStore.id ? { ...s, ...updatedStoreInfo } : s)));
  };

  const handleLoginSuccess = (user: SellerUser, storeId: string) => {
    setCurrentUser(user);
    setActiveStoreId(storeId);
    switchMode('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoginModalOpen(true);
  };

  const handleRegisterSuccess = (newStore: Store, targetMode: 'store' | 'dashboard' = 'store') => {
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

  const handleUpdateStoreSettings = (updated: Partial<Store['settings']>) => {
    setStores((prev) => prev.map((s) => s.id === activeStore.id ? { ...s, settings: { ...s.settings, ...updated } } : s));
  };

  const handleUpdateStorePlan = (newPlan: PlanType) => {
    setStores((prev) => prev.map((s) => s.id === activeStore.id ? { ...s, plan: newPlan } : s));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateProductStock = (productId: string, stock: number) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock } : p)));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const handleUpdateOrderCallStatus = (orderId: string, callStatus: Order['callStatus']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, callStatus } : o)));
  };

  const handleDispatchOrderToCarrier = (orderId: string, carrierName: string) => {
    const trackingCode = `${carrierName.toUpperCase().slice(0, 3)}-DZ-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'shipped', carrier: carrierName, trackingNumber: trackingCode } : o));
  };

  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const handleToggleCoupon = (couponId: string) => {
    setCoupons((prev) => prev.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c)));
  };

  const handleNewCustomerOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setStores((prev) => prev.map((s) => s.id === newOrder.storeId ? { ...s, ordersCount: s.ordersCount + 1, totalSales: s.totalSales + newOrder.total } : s));

    setCustomers((prev) => {
      const existing = prev.find((c) => c.email === newOrder.customerEmail);
      if (existing) {
        return prev.map((c) => c.id === existing.id ? { ...c, totalOrders: c.totalOrders + 1, totalSpent: c.totalSpent + newOrder.total, lastOrderDate: new Date().toISOString().split('T')[0] } : c);
      }
      return [
        {
          id: `cust_${Date.now()}`,
          storeId: newOrder.storeId,
          name: newOrder.customerName,
          email: newOrder.customerEmail,
          phone: newOrder.customerPhone,
          city: newOrder.customerCity,
          totalOrders: 1,
          totalSpent: newOrder.total,
          lastOrderDate: new Date().toISOString().split('T')[0]
        },
        ...prev
      ];
    });
  };

  // 1. المتجر المستقل (Store Mode)
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
          onToggleStoreFeature={handleToggleStoreFeature}
          onRemoveStoreFeature={handleRemoveStoreFeature}
          onRestoreStoreFeature={handleRestoreStoreFeature}
          onUpdateStoreFeature={handleUpdateStoreFeature}
          onUpdateStore={handleUpdateStoreInfo}
          onResetDefaultStoreFeatures={handleResetDefaultStoreFeatures}
          onEnableAllStoreFeatures={handleEnableAllStoreFeatures}
          isOnlinePaymentsEnabled={isFeatureActive('onlinePayments')}
        />
      </div>
    );
  }

  // 2. لوحة تحكم التاجر المستقل (Dashboard Mode - مفصولة تماماً عن المنصة)
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
                  title={isAr ? 'زيارة المتجر المستقل' : 'View Store'}
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

                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {isAr ? 'لوحة تحكم المتجر المستقل' : 'Independent Store Admin'}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => switchMode('store')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isAr ? 'عرض المتجر المستقل 🛍️' : 'View Store 🛍️'}</span>
                </button>

                <button
                  onClick={() => setIsGlobalShareModalOpen(true)}
                  className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden md:inline">{isAr ? 'رابط المنصة 🌐' : 'Platform Link 🌐'}</span>
                </button>

                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="bg-slate-100 border border-slate-200 text-xs font-bold rounded-xl px-2.5 py-2 text-slate-700 focus:outline-none cursor-pointer"
                  aria-label="Currency"
                >
                  <option value="DZD">د.ج (DZD)</option>
                  <option value="EUR">€ (EUR)</option>
                  <option value="USD">$ (USD)</option>
                  <option value="SAR">ر.س (SAR)</option>
                </select>

                <button
                  onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                  className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  {language === 'ar' ? 'EN' : 'عربي'}
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
            onToggleFeature={handleToggleFeature}
            onRemoveFeature={handleRemoveFeature}
            onRestoreFeature={handleRestoreFeature}
            onOpenFeaturesModal={() => setIsFeaturesModalOpen(true)}
            onToggleStoreFeature={handleToggleStoreFeature}
            onRemoveStoreFeature={handleRemoveStoreFeature}
            onRestoreStoreFeature={handleRestoreStoreFeature}
            onEnableAllStoreFeatures={handleEnableAllStoreFeatures}
            onResetDefaultStoreFeatures={handleResetDefaultStoreFeatures}
            onAddStoreFeature={handleAddStoreFeature}
            onUpdateStoreFeature={handleUpdateStoreFeature}
            onUpdateStoreSettings={handleUpdateStoreSettings}
            onUpdateStorePlan={handleUpdateStorePlan}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProductStock={handleUpdateProductStock}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateOrderCallStatus={handleUpdateOrderCallStatus}
            onDispatchOrderToCarrier={handleDispatchOrderToCarrier}
            onAddCoupon={handleAddCoupon}
            onToggleCoupon={handleToggleCoupon}
            onOpenLivePreview={() => switchMode('store')}
            onOpenStandaloneStore={() => switchMode('store')}
            onOpenCreateNewStore={() => switchMode('register')}
            onLogout={handleLogout}
          />
        </main>
      </div>
    );
  }

  // 3. بوابة المنصة الأم (