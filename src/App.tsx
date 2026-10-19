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
import { RegisterStoreView } from './components/RegisterStoreView';
import { StoreDashboardView } from './components/StoreDashboardView';
import { SellerLoginModal } from './components/SellerLoginModal';
import { PublicStoreView } from './components/PublicStoreView';
import { Footer } from './components/Footer';
import { 
  Store as StoreIcon, Plus, ExternalLink, Globe, 
  Layers, ShieldCheck, ChevronDown, Check, LogIn, LogOut, User 
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [appMode, setAppMode] = useState<'dashboard' | 'register'>('dashboard');
  
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
    // Increment store stats
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
    <div className="min-h-screen flex flex-col bg-[#080C15] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-[#080C15]/90 backdrop-blur-xl border-b border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-20">
            
            {/* Brand Logo & Tag */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAppMode('dashboard')}
                className="flex items-center gap-3 text-start group focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all">
                  <span className="font-sans font-black text-white text-xl">A</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold tracking-wider text-white uppercase">
                      AVANTO
                    </span>
                    <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono px-1.5 py-0.5 rounded">
                      COMMERCE
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {isAr ? 'منصة المتاجر السحابية للتجار' : 'MERCHANT PLATFORM'}
                  </span>
                </div>
              </button>

              {/* Store Switcher */}
              {appMode === 'dashboard' && currentUser && (
                <div className="hidden sm:flex items-center gap-2 ps-4 border-s border-slate-800">
                  <select
                    value={activeStoreId}
                    onChange={(e) => setActiveStoreId(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[180px] truncate"
                    aria-label="Switch active store"
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={s.id} className="bg-[#0B0F19]">
                        {isAr ? s.nameAr : s.name} ({s.plan.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center gap-2.5">
              {/* Currency Selector */}
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-slate-900 border border-slate-800 text-xs font-mono rounded-lg px-2.5 py-2 text-slate-300 hover:border-slate-700 focus:outline-none cursor-pointer"
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

              {/* Auth / Action Button */}
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewingStore(activeStore)}
                    className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-indigo-400 text-xs font-medium text-slate-200 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isAr ? 'المتجر الحي' : 'Live Store'}</span>
                  </button>

                  <button
                    onClick={() => setAppMode(appMode === 'dashboard' ? 'register' : 'dashboard')}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-all active:scale-95"
                  >
                    {appMode === 'dashboard' ? (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAr ? 'متجر جديد' : 'New Store'}</span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-3.5 h-3.5" />
                        <span>{isAr ? 'لوحة التحكم' : 'Dashboard'}</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isAr ? 'تسجيل دخول التاجر' : 'Seller Login'}</span>
                  </button>

                  <button
                    onClick={() => setAppMode('register')}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'أنشئ متجرك' : 'Create Store'}</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {appMode === 'register' ? (
          <RegisterStoreView
            language={language}
            currency={currency}
            onRegisterSuccess={handleRegisterSuccess}
            onGoToExistingStore={() => setAppMode('dashboard')}
            existingStoreName={isAr ? activeStore.nameAr : activeStore.name}
          />
        ) : (
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
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onNavigateTab={(tab) => {
          if (tab === 'stores') {
            setAppMode('register');
          } else {
            setAppMode('dashboard');
          }
        }}
      />

      {/* Seller Login Modal */}
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

      {/* Customer Live Storefront Simulation */}
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
