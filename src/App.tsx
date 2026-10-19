import React, { useState, useEffect } from 'react';
import { 
  Currency, Language, Store, Product, Order, Customer, Coupon, 
  PlanType, SupabaseConfig, GitHubConfig, SellerUser 
} from './types';
import { 
  INITIAL_STORE, INITIAL_PRODUCTS, INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, INITIAL_COUPONS, INITIAL_SELLER_USER, 
  INITIAL_SUPABASE_CONFIG, INITIAL_GITHUB_CONFIG, PLANS 
} from './data/initialData';
import { LandingPageView } from './components/LandingPageView';
import { RegisterStoreView } from './components/RegisterStoreView';
import { StoreDashboardView } from './components/StoreDashboardView';
import { PlansPricingView } from './components/PlansPricingView';
import { SellerLoginModal } from './components/SellerLoginModal';
import { PublicStoreView } from './components/PublicStoreView';
import { Footer } from './components/Footer';
import { 
  Store as StoreIcon, Plus, ExternalLink, Globe, 
  Layers, ShieldCheck, ChevronDown, Check, LogIn, LogOut, User,
  BarChart2, Sparkles
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [currency, setCurrency] = useState<Currency>('SAR');
  
  // Navigation mode: 'landing' (Normal Website Homepage) | 'dashboard' | 'register' | 'pricing'
  const [appMode, setAppMode] = useState<'landing' | 'dashboard' | 'register' | 'pricing'>('landing');
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<SellerUser | null>(INITIAL_SELLER_USER);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Stores State
  const [stores, setStores] = useState<Store[]>([INITIAL_STORE]);
  const [activeStoreId, setActiveStoreId] = useState<string>(INITIAL_STORE.id);
  
  // Products, Orders, Customers, Coupons
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);

  // Live Customer Store Preview Modal
  const [previewingStore, setPreviewingStore] = useState<Store | null>(null);

  // Supabase & GitHub State
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(INITIAL_SUPABASE_CONFIG);
  const [gitHubConfig, setGitHubConfig] = useState<GitHubConfig>(INITIAL_GITHUB_CONFIG);

  const isAr = language === 'ar';
  const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0];

  // Sync HTML dir and lang
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Auth Handlers
  const handleLoginSuccess = (user: SellerUser, storeId: string) => {
    setCurrentUser(user);
    setActiveStoreId(storeId);
    setAppMode('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoginModalOpen(true);
  };

  // Handler: Register New Store
  const handleRegisterSuccess = (newStore: Store) => {
    setStores((prev) => [newStore, ...prev]);
    setActiveStoreId(newStore.id);
    const seller: SellerUser = {
      id: `usr_${newStore.id}`,
      name: newStore.ownerName,
      email: newStore.ownerEmail,
      storeId: newStore.id
    };
    setCurrentUser(seller);
    setAppMode('dashboard');
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
                onClick={() => setAppMode('landing')}
                className="flex items-center gap-3 text-start group focus:outline-none cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-600/25 group-hover:scale-105 transition-all text-white font-extrabold text-xl">
                  A
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-wider text-slate-900 uppercase">
                      AVANTO
                    </span>
                    <span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                      COMMERCE
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {isAr ? 'منصة المتاجر السحابية' : 'SaaS Commerce Platform'}
                  </span>
                </div>
              </button>

              {/* Normal Website Navigation Links */}
              <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600">
                <button
                  onClick={() => setAppMode('landing')}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    appMode === 'landing' ? 'text-indigo-600 bg-indigo-50/70 font-extrabold' : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {isAr ? 'الرئيسية' : 'Home'}
                </button>

                <button
                  onClick={() => setAppMode('dashboard')}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    appMode === 'dashboard' ? 'text-indigo-600 bg-indigo-50/70 font-extrabold' : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {isAr ? 'لوحة تحكم المتجر' : 'Dashboard'}
                </button>

                <button
                  onClick={() => setAppMode('pricing')}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    appMode === 'pricing' ? 'text-indigo-600 bg-indigo-50/70 font-extrabold' : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {isAr ? 'الباقات والأسعار' : 'Pricing'}
                </button>

                <button
                  onClick={() => setPreviewingStore(activeStore)}
                  className="px-3 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{isAr ? 'متجر تجريبي حي' : 'Demo Store'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </nav>

            </div>

            {/* Right: Currency, Language & CTA Actions */}
            <div className="flex items-center gap-2.5">
              
              {/* Currency Selector */}
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-2.5 py-2 text-slate-700 hover:border-slate-300 focus:outline-none focus:border-indigo-600 cursor-pointer"
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:border-slate-300 transition-colors cursor-pointer"
                title="Toggle language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{language === 'ar' ? 'English' : 'عربي'}</span>
              </button>

              {/* Active Store Switcher (if in dashboard) */}
              {appMode === 'dashboard' && currentUser && (
                <div className="hidden lg:flex items-center gap-1.5 ps-2 border-s border-slate-200">
                  <select
                    value={activeStoreId}
                    onChange={(e) => setActiveStoreId(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer max-w-[170px] truncate"
                    aria-label="Switch active store"
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>
                        {isAr ? s.nameAr : s.name} ({s.plan.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* User / Action Buttons */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAppMode('dashboard')}
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                  >
                    <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isAr ? 'لوحة التحكم' : 'Dashboard'}</span>
                  </button>

                  <button
                    onClick={() => setAppMode('register')}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/20 transition-all active:scale-98 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'متجر جديد' : 'New Store'}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                  </button>

                  <button
                    onClick={() => setAppMode('register')}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/20 transition-all active:scale-98 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'ابدأ مجاناً' : 'Start Free'}</span>
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1">
        {appMode === 'landing' && (
          <LandingPageView
            language={language}
            currency={currency}
            onRegisterSuccess={handleRegisterSuccess}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onGoToDashboard={() => setAppMode('dashboard')}
            onOpenLivePreview={() => setPreviewingStore(activeStore)}
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
            onUpdateStoreSettings={handleUpdateStoreSettings}
            onUpdateStorePlan={handleUpdateStorePlan}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProductStock={handleUpdateProductStock}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddCoupon={handleAddCoupon}
            onToggleCoupon={handleToggleCoupon}
            onOpenLivePreview={() => setPreviewingStore(activeStore)}
            onOpenCreateNewStore={() => setAppMode('register')}
            onLogout={handleLogout}
          />
        )}

        {appMode === 'register' && (
          <RegisterStoreView
            language={language}
            currency={currency}
            onRegisterSuccess={handleRegisterSuccess}
            onGoToExistingStore={() => setAppMode('dashboard')}
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
                setAppMode('register');
              }}
            />
          </div>
        )}
      </main>

      {/* ─── FOOTER ─── */}
      <Footer
        language={language}
        onNavigateTab={(tab) => setAppMode(tab)}
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
          setAppMode('register');
        }}
      />

      {/* ─── CUSTOMER LIVE STOREFRONT SIMULATION ─── */}
      {previewingStore && (
        <PublicStoreView
          store={previewingStore}
          products={products}
          language={language}
          currency={currency}
          onClose={() => setPreviewingStore(null)}
          onNewCustomerOrder={handleNewCustomerOrder}
        />
      )}

    </div>
  );
}
