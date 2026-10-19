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
import { PlansPricingView } from './components/PlansPricingView';
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
  // 'landing' (SaaS Platform Homepage) 
  // 'dashboard' (Seller Merchant Admin) 
  // 'register' (Register New Store) 
  // 'pricing' (SaaS Platform Plans)
  // 'store' (100% Independent Standalone Storefront, completely separated from the platform)
  const [appMode, setAppMode] = useState<'landing' | 'dashboard' | 'register' | 'pricing' | 'store'>('landing');
  
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

  // Platform Modular Features State (Active / Inactive / Removed)
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

  // Seller Store Features & Settings State (Active / Inactive / Removed / Custom)
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

  // Live Customer Store Preview Modal (Dialog Mode)
  const [previewingStore, setPreviewingStore] = useState<Store | null>(null);

  // Supabase & GitHub State
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(INITIAL_SUPABASE_CONFIG);
  const [gitHubConfig, setGitHubConfig] = useState<GitHubConfig>(INITIAL_GITHUB_CONFIG);

  const isAr = language === 'ar';
  const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0] || INITIAL_STORE;

  // ─── LocalStorage Synchronization ───
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

  // Sync HTML dir and lang
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Check URL parameters for cross-browser direct navigation (?mode=store, ?mode=dashboard, ?mode=landing, ?store=slug)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const modeParam = urlParams.get('mode') || urlParams.get('view');
      const storeSlug = urlParams.get('store');

      if (modeParam === 'store' || window.location.hash === '#store') {
        setAppMode('store');
      } else if (modeParam === 'dashboard' || window.location.hash === '#dashboard') {
        setAppMode('dashboard');
      } else if (modeParam === 'register' || window.location.hash === '#register') {
        setAppMode('register');
      } else if (modeParam === 'pricing' || window.location.hash === '#pricing') {
        setAppMode('pricing');
      } else if (modeParam === 'landing' || modeParam === 'platform') {
        setAppMode('landing');
      }

      if (storeSlug) {
        const found = stores.find((s) => s.slug === storeSlug || s.settings.subdomain.startsWith(storeSlug));
        if (found) {
          setActiveStoreId(found.id);
          setAppMode('store');
        } else {
          // If opened in another browser or incognito window, instantiate store cleanly
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
    } catch (e) {
      // safe fallback for iframes and cross-origin environments
    }
  }, [stores]);

  // Mode Switcher that keeps URL query in sync
  const switchMode = (newMode: 'landing' | 'dashboard' | 'register' | 'pricing' | 'store') => {
    setAppMode(newMode);
    try {
      const url = new URL(window.location.href);
      if (newMode === 'landing') {
        url.searchParams.delete('mode');
        url.searchParams.delete('store');
      } else if (newMode === 'store') {
        url.searchParams.set('mode', 'store');
        if (activeStore?.slug) url.searchParams.set('store', activeStore.slug);
      } else {
        url.searchParams.set('mode', newMode);
        url.searchParams.delete('store');
      }
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  };

  // ─── Platform Feature Helpers ───
  const isFeatureActive = (id: string) => {
    const feat = features.find((f) => f.id === id);
    return feat ? feat.isEnabled && !feat.isRemoved : true;
  };
  const activeFeaturesCount = features.filter((f) => f.isEnabled && !f.isRemoved).length;

  const handleToggleFeature = (featureId: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, isEnabled: !f.isEnabled } : f))
    );
  };

  const handleRemoveFeature = (featureId: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, isRemoved: true, isEnabled: false } : f))
    );
  };

  const handleRestoreFeature = (featureId: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, isRemoved: false, isEnabled: true } : f))
    );
  };

  const handleEnableAllFeatures = () => {
    setFeatures((prev) => prev.map((f) => ({ ...f, isEnabled: true, isRemoved: false })));
  };

  const handleResetDefaultFeatures = () => {
    setFeatures(INITIAL_PLATFORM_FEATURES);
  };

  // ─── Seller Store Features & Settings Handlers ───
  const handleToggleStoreFeature = (featureId: string) => {
    setStoreFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, isEnabled: !f.isEnabled } : f))
    );
  };

  const handleRemoveStoreFeature = (featureId: string) => {
    setStoreFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, isRemoved: true, isEnabled: false } : f))
    );
  };

  const handleRestoreStoreFeature = (featureId: string) => {
    setStoreFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, isRemoved: false, isEnabled: true } : f))
    );
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
    setStoreFeatures((prev) =>
      prev.map((f) => (f.id === updatedFeature.id ? updatedFeature : f))
    );
  };

  const handleUpdateStoreInfo = (updatedStoreInfo: Partial<Store>) => {
    setStores((prev) =>
      prev.map((s) => (s.id === activeStore.id ? { ...s, ...updatedStoreInfo } : s))
    );
  };

  // Auth Handlers
  const handleLoginSuccess = (user: SellerUser, storeId: string) => {
    setCurrentUser(user);
    setActiveStoreId(storeId);
    switchMode('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoginModalOpen(true);
  };

  // Handler: Register New Store
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
    switchMode(targetMode);
  };

  // Handler: Update Store Settings
  const handleUpdateStoreSettings = (updated: Partial<Store['settings']>) => {
    setStores((prev) =>
      prev.map((s) =>
        s.id === activeStore.id
          ? { ...s, settings: { ...s.settings, ...updated } }
          : s
      )
    );
  };

  // Handler: Change Store Plan (Free vs Pro)
  const handleUpdateStorePlan = (newPlan: PlanType) => {
    setStores((prev) =>
      prev.map((s) =>
        s.id === activeStore.id ? { ...s, plan: newPlan } : s
      )
    );
  };

  // Handler: Add Product
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  // Handler: Delete Product
  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Handler: Update Stock
  const handleUpdateProductStock = (productId: string, stock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock } : p))
    );
  };

  // Handler: Update Order Status
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // Handler: Update Order Call Status (Confirmation Tracker for Algerian COD)
  const handleUpdateOrderCallStatus = (orderId: string, callStatus: Order['callStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, callStatus } : o))
    );
  };

  // Handler: Dispatch Order to Algerian Carrier (Yalidine / ZR Express)
  const handleDispatchOrderToCarrier = (orderId: string, carrierName: string) => {
    const trackingCode = `${carrierName.toUpperCase().slice(0, 3)}-DZ-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'shipped',
              carrier: carrierName,
              trackingNumber: trackingCode
            }
          : o
      )
    );
  };

  // Handler: Add Coupon
  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  // Handler: Toggle Coupon
  const handleToggleCoupon = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Handler: Customer Order from Public Store
  const handleNewCustomerOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setStores((prev) =>
      prev.map((s) =>
        s.id === newOrder.storeId
          ? {
              ...s,
              ordersCount: s.ordersCount + 1,
              totalSales: s.totalSales + newOrder.total
            }
          : s
      )
    );

    // Update or add customer
    setCustomers((prev) => {
      const existing = prev.find((c) => c.email === newOrder.customerEmail);
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: c.totalSpent + newOrder.total,
                lastOrderDate: new Date().toISOString().split('T')[0]
              }
            : c
        );
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

  // ══════════════════════════════════════════════════════════════════════
  // 100% INDEPENDENT STANDALONE STORE MODE:
  // When in 'store' mode, the store is completely isolated from the platform!
  // No Avanto Navbar, no Avanto Footer, pure merchant storefront!
  // Has a prominent top switcher button to return to the SaaS platform anytime.
  // ══════════════════════════════════════════════════════════════════════
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
          onBackToPlatform={() => switchMode('landing')}
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 transition-colors">
      
      {/* ─── TOP WEBSITE HEADER (Clean Normal Professional SaaS Navbar) ─── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-20">
            
            {/* Left: Brand Logo & Navigation Links */}
            <div className="flex items-center gap-8">
              
              {/* Brand Logo */}
              <button
                onClick={() => switchMode('landing')}
                className="flex items-center gap-3 text-start group focus:outline-none cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm shadow-emerald-600/30 group-hover:scale-105 transition-all text-white font-extrabold text-xl">
                  W
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-wider text-slate-900 uppercase">
                      WASLA<span className="text-emerald-600">DZ</span>
                    </span>
                    <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                      COD 58
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {isAr ? 'منصة التجارة والدفع عند الاستلام' : 'Algerian COD Commerce Platform'}
                  </span>
                </div>
              </button>

              {/* Normal Website Navigation Links */}
              <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600">
                <button
                  onClick={() => switchMode('landing')}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    appMode === 'landing' ? 'text-emerald-700 bg-emerald-50/90 font-extrabold' : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {isAr ? 'الرئيسية' : 'Home'}
                </button>

                <button
                  onClick={() => switchMode('dashboard')}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    appMode === 'dashboard' ? 'text-emerald-700 bg-emerald-50/90 font-extrabold' : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {isAr ? 'لوحة تحكم المتجر' : 'Dashboard'}
                </button>

                {isFeatureActive('plansAndUpgrades') && (
                  <button
                    onClick={() => switchMode('pricing')}
                    className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      appMode === 'pricing' ? 'text-emerald-700 bg-emerald-50/90 font-extrabold' : 'hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {isAr ? 'الباقات والأسعار' : 'Pricing'}
                  </button>
                )}

                {/* Independent Standalone Store Direct Access Button */}
                <button
                  onClick={() => switchMode('store')}
                  className="px-3 py-2 rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer font-bold shadow-2xs"
                  title={isAr ? 'فتح المتجر المستقل كصفحة مستقلة بالكامل بدون عناصر المنصة' : 'Open 100% independent standalone store'}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isAr ? 'المتجر المستقل' : 'Independent Store'}</span>
                  <ExternalLink className="w-3 h-3 text-emerald-600" />
                </button>
              </nav>

            </div>

            {/* Right: Feature Manager Trigger, Currency, Language & CTA Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              
              {/* Feature Manager Trigger Button (Controlled by button in header) */}
              <button
                onClick={() => setIsFeaturesModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/90 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title={isAr ? 'التحكم في تفعيل أو حذف خصائص المنصة عبر زر' : 'Platform Features Manager'}
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden lg:inline">{isAr ? 'خصائص المنصة' : 'Features'}</span>
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {activeFeaturesCount}
                </span>
              </button>

              {/* Currency Selector */}
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold rounded-xl px-2.5 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer transition-colors"
                  aria-label="Currency"
                >
                  <option value="DZD">د.ج (DZD - الجزائر)</option>
                  <option value="EUR">€ (EUR - أوروبا)</option>
                  <option value="USD">$ (USD - دولار)</option>
                  <option value="SAR">ر.س (SAR - ريال)</option>
                </select>
              </div>

              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
              >
                {language === 'ar' ? 'EN' : 'العربية'}
              </button>

              {/* Auth or Dashboard CTA */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => switchMode('dashboard')}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer border border-slate-200"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors cursor-pointer"
                    title={isAr ? 'تسجيل الخروج' : 'Logout'}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAr ? 'دخول التاجر' : 'Login'}</span>
                </button>
              )}

              {/* Share Platform Link Button (Works in any phone & browser) */}
              <button
                onClick={() => setIsGlobalShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title={isAr ? 'فتح ومشاركة رابط المنصة لأي متصفح وهاتف' : 'Share live platform link'}
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden xl:inline">{isAr ? 'رابط المنصة' : 'Platform Link'}</span>
              </button>

              {/* Start New Store CTA */}
              <button
                onClick={() => switchMode('register')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'إنشاء متجر جديد' : 'Create Store'}</span>
                <span className="sm:hidden">{isAr ? 'متجر' : 'Store'}</span>
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center justify-between text-xs font-bold overflow-x-auto scrollbar-none gap-2 bg-slate-50/50">
          <button
            onClick={() => switchMode('landing')}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
              appMode === 'landing' ? 'bg-white text-emerald-700 shadow-2xs font-extrabold' : 'text-slate-600'
            }`}
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <button
            onClick={() => switchMode('dashboard')}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
              appMode === 'dashboard' ? 'bg-white text-emerald-700 shadow-2xs font-extrabold' : 'text-slate-600'
            }`}
          >
            {isAr ? 'لوحة التحكم' : 'Dashboard'}
          </button>
          <button
            onClick={() => switchMode('store')}
            className="px-2.5 py-1.5 rounded-lg whitespace-nowrap text-emerald-800 bg-emerald-50 border border-emerald-200 cursor-pointer flex items-center gap-1 font-bold"
          >
            <span>{isAr ? 'المتجر المستقل 🛍️' : 'Store 🛍️'}</span>
          </button>
          <button
            onClick={() => switchMode('pricing')}
            className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
              appMode === 'pricing' ? 'bg-white text-emerald-700 shadow-2xs font-extrabold' : 'text-slate-600'
            }`}
          >
            {isAr ? 'الباقات' : 'Pricing'}
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT VIEW SWITCHER ─── */}
      <main className="flex-1">
        {appMode === 'landing' && (
          <LandingPageView
            language={language}
            currency={currency}
            onRegisterSuccess={(store) => handleRegisterSuccess(store, 'store')}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onGoToDashboard={() => switchMode('dashboard')}
            onOpenLivePreview={() => switchMode('store')}
            existingStore={activeStore}
          />
        )}

        {appMode === 'dashboard' && (
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
            onOpenLivePreview={() => setPreviewingStore(activeStore)}
            onOpenStandaloneStore={() => switchMode('store')}
            onOpenCreateNewStore={() => switchMode('register')}
            onBackToPlatform={() => switchMode('landing')}
            onLogout={handleLogout}
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

        {appMode === 'pricing' && (
          <div className="py-12">
            <PlansPricingView
              currentPlan={activeStore.plan}
              onChangePlan={handleUpdateStorePlan}
              language={language}
              currency={currency}
              onSelectRegisterPlan={(planId) => {
                handleUpdateStorePlan(planId);
                switchMode('register');
              }}
            />
          </div>
        )}
      </main>

      {/* ─── FOOTER ─── */}
      <Footer
        language={language}
        onNavigateTab={(tab) => switchMode(tab)}
      />

      {/* ─── SELLER LOGIN MODAL ─── */}
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
        isDemoLoginEnabled={isFeatureActive('demoLogin')}
      />

      {/* ─── PLATFORM MODULAR FEATURES MODAL ─── */}
      <PlatformFeaturesModal
        isOpen={isFeaturesModalOpen}
        onClose={() => setIsFeaturesModalOpen(false)}
        features={features}
        onToggleFeature={handleToggleFeature}
        onRemoveFeature={handleRemoveFeature}
        onRestoreFeature={handleRestoreFeature}
        onEnableAll={handleEnableAllFeatures}
        onResetDefaults={handleResetDefaultFeatures}
        language={language}
      />

      {/* ─── GLOBAL PLATFORM & STORE SHARE MODAL ─── */}
      {isGlobalShareModalOpen && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-start animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {isAr ? 'روابط المنصة والمتجر لفتحها في أي هاتف ومتصفح' : 'Platform & Store Links (Any Device & Browser)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAr ? 'روابط ويب قياسية تعمل فوراً على Android و iPhone و PC دون أي متطلبات خاصة' : 'Standard live URLs working on any mobile browser'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsGlobalShareModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Links List */}
            <div className="space-y-4">
              
              {/* 1. Platform Main Link */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isAr ? '1. رابط منصة وصلة ديزاد الرئيسية (WaslaDZ):' : '1. Main Platform URL:'}</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    {isAr ? 'المنصة كاملة' : 'Full Platform'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-dpfft72pkywmphfmost32j-8726732667.europe-west2.run.app'}
                    className="flex-1 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl p-2.5 border border-slate-800 select-all focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      const url = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-dpfft72pkywmphfmost32j-8726732667.europe-west2.run.app';
                      navigator.clipboard?.writeText(url);
                      setCopiedLinkType('platform');
                      setTimeout(() => setCopiedLinkType(null), 2500);
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLinkType === 'platform' ? (isAr ? 'تم النسخ ✓' : 'Copied ✓') : (isAr ? 'نسخ' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              {/* 2. Standalone Store Direct Customer Link */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isAr ? `2. رابط متجرك المستقل المباشر (${activeStore.nameAr}):` : `2. Independent Store Direct Link:`}</span>
                  </span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                    {isAr ? 'مخصص للزبائن' : 'For Customers'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-dpfft72pkywmphfmost32j-8726732667.europe-west2.run.app'}?mode=store&store=${activeStore.slug}`}
                    className="flex-1 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl p-2.5 border border-slate-800 select-all focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-dpfft72pkywmphfmost32j-8726732667.europe-west2.run.app'}?mode=store&store=${activeStore.slug}`;
                      navigator.clipboard?.writeText(url);
                      setCopiedLinkType('store');
                      setTimeout(() => setCopiedLinkType(null), 2500);
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLinkType === 'store' ? (isAr ? 'تم النسخ ✓' : 'Copied ✓') : (isAr ? 'نسخ' : 'Copy')}</span>
                  </button>
                </div>
              </div>

              {/* 3. Merchant Dashboard Direct Link */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isAr ? '3. رابط لوحة تحكم التاجر المباشر:' : '3. Merchant Dashboard Direct Link:'}</span>
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full font-bold">
                    {isAr ? 'للتاجر فقط' : 'For Merchant'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-dpfft72pkywmphfmost32j-8726732667.europe-west2.run.app'}?mode=dashboard`}
                    className="flex-1 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl p-2.5 border border-slate-800 select-all focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      const url = `${typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-dpfft72pkywmphfmost32j-8726732667.europe-west2.run.app'}?mode=dashboard`;
                      navigator.clipboard?.writeText(url);
                      setCopiedLinkType('dashboard');
                      setTimeout(() => setCopiedLinkType(null), 2500);
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLinkType === 'dashboard' ? (isAr ? 'تم النسخ ✓' : 'Copied ✓') : (isAr ? 'نسخ' : 'Copy')}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* QR Code & Mobile Instructions */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-center gap-4 text-xs">
              <div className="w-20 h-20 bg-white p-1.5 rounded-xl border border-emerald-300 shadow-2xs shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  <rect x="0" y="0" width="30" height="30" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" />
                  <rect x="70" y="0" width="30" height="30" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" />
                  <rect x="0" y="70" width="30" height="30" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" />
                  <rect x="36" y="10" width="8" height="8" />
                  <rect x="48" y="10" width="8" height="8" />
                  <rect x="36" y="24" width="8" height="8" />
                  <rect x="48" y="36" width="14" height="8" />
                  <rect x="10" y="44" width="8" height="14" />
                  <rect x="70" y="44" width="10" height="8" />
                  <rect x="84" y="44" width="8" height="8" />
                  <rect x="36" y="70" width="10" height="10" />
                  <rect x="50" y="76" width="8" height="14" />
                  <rect x="70" y="70" width="12" height="12" />
                  <rect x="86" y="80" width="8" height="12" />
                </svg>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'كيف تفتح الرابط في أي هاتف أو متصفح؟' : 'How to open on any phone?'}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {isAr
                    ? 'انسخ أي رابط من الروابط أعلاه وقم بلصقه في متصفح Safari على iPhone أو Chrome على Android أو كمبيوترك، أو امسح الباركود مباشرة بكاميرا هاتفك ليفتح فوراً بكامل مميزاته.'
                    : 'Copy any URL above and paste it into Safari on iOS, Chrome on Android, or scan the QR code directly with your camera.'}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsGlobalShareModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                {isAr ? 'إغلاق النافذة' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── CUSTOMER LIVE STOREFRONT SIMULATION (MODAL MODE) ─── */}
      {previewingStore && (
        <PublicStoreView
          store={previewingStore}
          products={products}
          language={language}
          currency={currency}
          storeFeatures={storeFeatures}
          currentUser={currentUser}
          onClose={() => setPreviewingStore(null)}
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
      )}

    </div>
  );
}
