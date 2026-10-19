import React, { useState } from 'react';
import { 
  Store, Product, Order, Customer, Coupon, PlanType, 
  Currency, Language, SupabaseConfig, GitHubConfig, SellerUser 
} from '../types';
import { CURRENCY_RATES, PLANS } from '../data/initialData';
import { PlansPricingView } from './PlansPricingView';
import { 
  Store as StoreIcon, Package, ShoppingCart, Settings, 
  ExternalLink, Plus, CheckCircle2, Clock, Trash2, 
  TrendingUp, ShieldCheck, Database, GitBranch, Globe, 
  Check, ArrowRight, ArrowLeft, AlertCircle, Copy, Terminal, 
  Edit3, Users, Tag, DollarSign, Printer, Lock, LogOut, Sparkles 
} from 'lucide-react';

interface StoreDashboardViewProps {
  store: Store;
  products: Product[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  currentUser: SellerUser | null;
  currency: Currency;
  language: Language;
  supabaseConfig: SupabaseConfig;
  gitHubConfig: GitHubConfig;
  onUpdateStoreSettings: (updated: Partial<Store['settings']>) => void;
  onUpdateStorePlan: (plan: PlanType) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateProductStock: (productId: string, stock: number) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onToggleCoupon: (couponId: string) => void;
  onOpenLivePreview: () => void;
  onOpenCreateNewStore: () => void;
  onLogout: () => void;
}

export const StoreDashboardView: React.FC<StoreDashboardViewProps> = ({
  store,
  products,
  orders,
  customers,
  coupons,
  currentUser,
  currency,
  language,
  supabaseConfig,
  gitHubConfig,
  onUpdateStoreSettings,
  onUpdateStorePlan,
  onAddProduct,
  onDeleteProduct,
  onUpdateProductStock,
  onUpdateOrderStatus,
  onAddCoupon,
  onToggleCoupon,
  onOpenLivePreview,
  onOpenCreateNewStore,
  onLogout
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'coupons' | 'plans' | 'settings'>('overview');
  
  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [showAddCouponModal, setShowAddCouponModal] = useState<boolean>(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState<boolean>(false);

  // Store-specific data
  const storeProducts = products.filter((p) => p.storeId === store.id);
  const storeOrders = orders.filter((o) => o.storeId === store.id);
  const storeCustomers = customers.filter((c) => c.storeId === store.id);
  const storeCoupons = coupons.filter((c) => c.storeId === store.id);

  const formatPrice = (amount: number) => {
    const rateInfo = CURRENCY_RATES[currency];
    const converted = Math.round(amount * rateInfo.rate);
    return `${converted.toLocaleString()} ${isAr ? rateInfo.symbolAr : rateInfo.symbol}`;
  };

  const currentPlanDetails = PLANS.find((p) => p.id === store.plan) || PLANS[0];
  const isFreePlan = store.plan === 'free';

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(350);
  const [newProdCost, setNewProdCost] = useState(140);
  const [newProdStock, setNewProdStock] = useState(15);
  const [newProdCategory, setNewProdCategory] = useState('Accessories');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');

  // New Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValue, setCouponValue] = useState(20);
  const [couponMinOrder, setCouponMinOrder] = useState(200);

  // Store Settings Form State
  const [shippingRate, setShippingRate] = useState(store.settings.shippingRate);
  const [freeThreshold, setFreeThreshold] = useState(store.settings.freeShippingThreshold);
  const [taxRate, setTaxRate] = useState(store.settings.taxRate);
  const [themeColor, setThemeColor] = useState(store.settings.themeColor);
  const [isPublished, setIsPublished] = useState(store.settings.isPublished);
  const [payoutBank, setPayoutBank] = useState(store.settings.payoutBank || '');
  const [payoutIban, setPayoutIban] = useState(store.settings.payoutIban || '');

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    if (isFreePlan && storeProducts.length >= 10) {
      alert(isAr ? 'وصلت للحد الأقصى للمنتجات في الخطة المجانية (10 منتجات). قم بالترقية للخطة الاحترافية للحصول على عدد غير محدود!' : 'Free plan limit reached (10 products). Upgrade to Pro for unlimited products!');
      return;
    }

    const prod: Product = {
      id: `prod_${Date.now()}`,
      storeId: store.id,
      name: newProdName,
      nameAr: newProdNameAr || newProdName,
      description: newProdDesc || 'Handcrafted item engineered for supreme durability and elegance.',
      descriptionAr: newProdDesc || 'قطعة مختارة بعناية ومصنوعة بأعلى معايير الجودة والأناقة.',
      price: Number(newProdPrice),
      costPrice: Number(newProdCost),
      category: newProdCategory,
      stock: Number(newProdStock),
      sku: newProdSku || `SKU-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      isPublished: true
    };

    onAddProduct(prod);
    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdNameAr('');
    setNewProdPrice(350);
    setNewProdCost(140);
    setNewProdStock(15);
    setNewProdDesc('');
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const newCpn: Coupon = {
      id: `cpn_${Date.now()}`,
      storeId: store.id,
      code: couponCode.trim().toUpperCase(),
      discountType: couponType,
      value: Number(couponValue),
      minOrder: Number(couponMinOrder),
      usageCount: 0,
      isActive: true
    };

    onAddCoupon(newCpn);
    setShowAddCouponModal(false);
    setCouponCode('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreSettings({
      shippingRate: Number(shippingRate),
      freeShippingThreshold: Number(freeThreshold),
      taxRate: Number(taxRate),
      themeColor,
      isPublished,
      payoutBank,
      payoutIban
    });
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 2500);
  };

  const supabaseSql = `-- Supabase Migration for ${store.name} (${store.settings.subdomain})
CREATE TABLE IF NOT EXISTS public.stores (
  id TEXT PRIMARY KEY DEFAULT '${store.id}',
  name TEXT NOT NULL,
  subdomain TEXT NOT NULL,
  plan TEXT DEFAULT '${store.plan}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.store_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id TEXT REFERENCES public.stores(id),
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER DEFAULT 10,
  sku TEXT UNIQUE NOT NULL,
  is_published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.store_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  store_id TEXT REFERENCES public.stores(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'processing'
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON public.store_products FOR SELECT USING (true);`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Store Header Bar with Seller Identity & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              {isAr ? 'لوحة تحكم المتجر' : 'MERCHANT STORE DASHBOARD'}
            </span>
            
            {/* Current Plan Badge */}
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
              isFreePlan
                ? 'bg-slate-800 text-slate-300 border-slate-700'
                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
            }`}>
              {isAr ? currentPlanDetails.nameAr : currentPlanDetails.name}
            </span>

            {/* Store Status Indicator */}
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{isAr ? 'المتجر منشور ونشط' : 'Store Live & Online'}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isAr ? store.nameAr : store.name}
            </h1>
            <span className="text-xs text-slate-400 font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
              {store.settings.subdomain}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
            <span>{isAr ? 'التاجر المعتمد:' : 'Seller:'} {currentUser?.name || store.ownerName}</span>
            <span>·</span>
            <span>{isAr ? store.categoryAr : store.category}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenLivePreview}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-400 text-xs font-semibold text-white shadow-sm transition-all active:scale-95"
          >
            <ExternalLink className="w-4 h-4 text-indigo-400" />
            <span>{isAr ? 'معاينة متجر الزبائن' : 'Live Store'}</span>
          </button>

          <button
            onClick={() => setShowAddProductModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة منتج' : 'Add Product'}</span>
          </button>

          <button
            onClick={onOpenCreateNewStore}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            title={isAr ? 'تسجيل متجر جديد' : 'New store'}
          >
            <StoreIcon className="w-4 h-4" />
          </button>

          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors"
            title={isAr ? 'تسجيل الخروج من الحساب' : 'Logout'}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comprehensive Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: isAr ? 'الرئيسية' : 'Overview', icon: TrendingUp },
          { id: 'products', label: isAr ? `المنتجات (${storeProducts.length})` : `Products (${storeProducts.length})`, icon: Package },
          { id: 'orders', label: isAr ? `الطلبات (${storeOrders.length})` : `Orders (${storeOrders.length})`, icon: ShoppingCart },
          { id: 'customers', label: isAr ? `العملاء (${storeCustomers.length})` : `Customers (${storeCustomers.length})`, icon: Users },
          { id: 'coupons', label: isAr ? `الكوبونات (${storeCoupons.length})` : `Coupons (${storeCoupons.length})`, icon: Tag },
          { id: 'plans', label: isAr ? 'الباقات والترقية' : 'Plans & Pricing', icon: ShieldCheck },
          { id: 'settings', label: isAr ? 'الإعدادات و Supabase' : 'Settings & Supabase', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-mono">
                {isAr ? 'إجمالي المبيعات' : 'Total Revenue'}
              </span>
              <p className="text-2xl font-extrabold text-white font-mono tabular-nums">
                {formatPrice(store.totalSales)}
              </p>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+24.6% {isAr ? 'عن الشهر الماضي' : 'vs last month'}</span>
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-mono">
                {isAr ? 'الطلبات المنجزة' : 'Total Orders'}
              </span>
              <p className="text-2xl font-extrabold text-indigo-400 font-mono tabular-nums">
                {store.ordersCount + storeOrders.length}
              </p>
              <span className="text-[11px] text-slate-400 font-mono">
                {storeOrders.filter(o => o.status === 'processing').length} {isAr ? 'قيد التجهيز الآن' : 'in processing'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-mono">
                {isAr ? 'المنتجات في المتجر' : 'Active Products'}
              </span>
              <p className="text-2xl font-extrabold text-white font-mono tabular-nums">
                {storeProducts.length}
              </p>
              <span className="text-[11px] text-slate-400 font-mono">
                {isFreePlan ? `${storeProducts.length}/10 ${isAr ? 'في الخطة المجانية' : 'on Free plan'}` : isAr ? 'غير محدود (Pro)' : 'Unlimited (Pro)'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 font-mono">
                {isAr ? 'خطة الاشتراك الحالية' : 'Subscription Plan'}
              </span>
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-base">
                  {isAr ? currentPlanDetails.nameAr : currentPlanDetails.name}
                </span>
                <button
                  onClick={() => setActiveTab('plans')}
                  className="text-xs text-indigo-400 hover:underline font-bold"
                >
                  {isFreePlan ? (isAr ? 'ترقية' : 'Upgrade') : (isAr ? 'تفاصيل' : 'Details')}
                </button>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono block">
                {currentPlanDetails.transactionFee} {isAr ? 'عمولة المنصة' : 'platform fee'}
              </span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setShowAddProductModal(true)}
              className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 text-start space-y-1 transition-all group"
            >
              <Package className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-xs block">{isAr ? 'إضافة منتج جديد' : 'Add Product'}</span>
              <span className="text-[11px] text-slate-400 block">{isAr ? 'رفع قطعة للكتالوج' : 'Catalog item'}</span>
            </button>

            <button
              onClick={onOpenLivePreview}
              className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 text-start space-y-1 transition-all group"
            >
              <ExternalLink className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-xs block">{isAr ? 'معاينة متجر الزبائن' : 'Live Storefront'}</span>
              <span className="text-[11px] text-slate-400 block">{isAr ? 'اختبار تجربة الشراء' : 'Test checkout'}</span>
            </button>

            <button
              onClick={() => setShowAddCouponModal(true)}
              className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 text-start space-y-1 transition-all group"
            >
              <Tag className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-xs block">{isAr ? 'إنشاء كود خصم' : 'New Coupon'}</span>
              <span className="text-[11px] text-slate-400 block">{isAr ? 'حملة تسويقية' : 'Promo discount'}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-violet-500/50 text-start space-y-1 transition-all group"
            >
              <Database className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-xs block">{isAr ? 'مزامنة Supabase' : 'Supabase Sync'}</span>
              <span className="text-[11px] text-slate-400 block">{isAr ? 'نسخ مخطط SQL' : 'SQL schema'}</span>
            </button>
          </div>

          {/* Recent Orders Queue */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'أحدث الطلبات الواردة للمتجر' : 'Latest Received Orders'}
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-indigo-400 hover:underline font-bold"
              >
                {isAr ? 'عرض جميع الطلبات' : 'View all orders'}
              </button>
            </div>

            <div className="divide-y divide-slate-850">
              {storeOrders.slice(0, 4).map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-mono font-bold text-white">{order.orderNumber}</span>
                    <span className="text-slate-400 ms-3">{order.customerName} · {order.customerCity}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-indigo-400 tabular-nums">
                      {formatPrice(order.total)}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: PRODUCTS & INVENTORY */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">
                {isAr ? 'كتالوج المنتجات والمخزون' : 'Products & Inventory Catalog'}
              </h3>
              <p className="text-xs text-slate-400">
                {isFreePlan
                  ? isAr ? `أنت في الخطة المجانية (${storeProducts.length} من أصل 10 منتجات).` : `Free Plan: ${storeProducts.length}/10 products used.`
                  : isAr ? 'أنت في الخطة الاحترافية: عدد غير محدود من المنتجات.' : 'Pro Plan: Unlimited products active.'}
              </p>
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة منتج جديد' : 'New Product'}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-x-auto shadow-xl">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-3 px-4 text-start">{isAr ? 'المنتج' : 'Product'}</th>
                  <th className="py-3 px-4 text-start">SKU</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'سعر البيع' : 'Retail Price'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'المخزون' : 'Stock'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="py-3 px-4 text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 font-mono tabular-nums">
                {storeProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-4 font-sans">
                      <span className="font-semibold text-white block">{isAr ? p.nameAr : p.name}</span>
                      <span className="text-[11px] text-slate-400">{p.category}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{p.sku}</td>
                    <td className="py-3.5 px-4 text-white font-bold">{formatPrice(p.price)}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateProductStock(p.id, Math.max(0, p.stock - 1))}
                          className="w-5 h-5 rounded bg-slate-800 text-slate-300 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          p.stock <= 5 ? 'text-amber-400 bg-amber-500/10' : 'text-emerald-400 bg-emerald-500/10'
                        }`}>
                          {p.stock}
                        </span>
                        <button
                          onClick={() => onUpdateProductStock(p.id, p.stock + 1)}
                          className="w-5 h-5 rounded bg-slate-800 text-slate-300 flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                        <Check className="w-3.5 h-3.5" />
                        <span>{isAr ? 'منشور في المتجر' : 'Active'}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-end">
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TAB: ORDERS & SHIPMENTS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              {isAr ? 'سجل طلبات وشحنات الزبائن' : 'Customer Orders & Shipments'}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {storeOrders.length} {isAr ? 'طلبات مسجلة' : 'orders'}
            </span>
          </div>

          <div className="space-y-3">
            {storeOrders.map((order) => (
              <div key={order.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-white">{order.orderNumber}</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(order.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                      className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="pending">{isAr ? 'قيد الانتظار' : 'Pending'}</option>
                      <option value="processing">{isAr ? 'قيد التجهيز' : 'Processing'}</option>
                      <option value="shipped">{isAr ? 'تم الشحن' : 'Shipped'}</option>
                      <option value="delivered">{isAr ? 'تم التسليم' : 'Delivered'}</option>
                    </select>

                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title={isAr ? 'طباعة الفاتورة' : 'Print Invoice'}
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">{isAr ? 'العميل' : 'Customer'}</span>
                    <span className="font-bold text-white">{order.customerName}</span>
                    <span className="text-slate-400 block font-mono text-[11px]">{order.customerPhone}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">{isAr ? 'وجهة الشحن' : 'Address'}</span>
                    <span className="text-slate-300">{order.customerCity} - {order.customerAddress}</span>
                  </div>

                  <div className="text-end font-mono">
                    <span className="text-slate-500 block text-[10px] uppercase">{isAr ? 'الإجمالي' : 'Total'}</span>
                    <span className="font-extrabold text-indigo-400 text-sm">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB: CUSTOMERS CRM */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                {isAr ? 'سجل وقاعدة بيانات العملاء' : 'Customer Directory'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr ? 'تتبع زبائن متجرك، إجمالي مشترياتهم، ومعلومات التواصل معهم.' : 'Track repeat customers, total spent, and contact info.'}
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {storeCustomers.length} {isAr ? 'عملاء مسجلون' : 'customers'}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-x-auto shadow-xl">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-3 px-4 text-start">{isAr ? 'العميل' : 'Customer'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'المدينة' : 'City'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'الطلبات' : 'Orders'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'إجمالي المشتريات' : 'Total Spent'}</th>
                  <th className="py-3 px-4 text-end">{isAr ? 'آخر طلب' : 'Last Purchase'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 font-mono tabular-nums">
                {storeCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-4 font-sans">
                      <span className="font-bold text-white block">{c.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{c.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-sans">{c.city}</td>
                    <td className="py-3.5 px-4 text-white font-bold">{c.totalOrders}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">{formatPrice(c.totalSpent)}</td>
                    <td className="py-3.5 px-4 text-end text-slate-400">{c.lastOrderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB: MARKETING & COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                {isAr ? 'أكواد الخصم والعروض الترويجية' : 'Promotional Coupons & Marketing'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr ? 'أنشئ كوبونات خصم لزيادة مبيعات متجرك ومشاركتها مع المتابعين.' : 'Create coupon codes to boost conversion.'}
              </p>
            </div>

            <button
              onClick={() => setShowAddCouponModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إنشاء كود خصم' : 'New Coupon'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storeCoupons.map((coupon) => (
              <div key={coupon.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                      {coupon.code}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {coupon.discountType === 'percentage' ? `${coupon.value}% خصم` : `${coupon.value} ر.س خصم`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono">
                    {isAr ? `الحد الأدنى للطلب: ${formatPrice(coupon.minOrder)} · استُخدم ${coupon.usageCount} مرة` : `Min order: ${formatPrice(coupon.minOrder)} · Used ${coupon.usageCount} times`}
                  </p>
                </div>

                <button
                  onClick={() => onToggleCoupon(coupon.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                    coupon.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {coupon.isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معطل' : 'Paused')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB: PLANS & PRICING */}
      {activeTab === 'plans' && (
        <PlansPricingView
          currentPlan={store.plan}
          onChangePlan={onUpdateStorePlan}
          language={language}
        />
      )}

      {/* 7. TAB: SETTINGS & SUPABASE/GITHUB */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {saveSettingsSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{isAr ? 'تم حفظ إعدادات المتجر بنجاح!' : 'Store settings updated successfully!'}</span>
            </div>
          )}

          {/* Store Settings Form */}
          <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
              {isAr ? 'إعدادات الشحن والدفع وهوية المتجر' : 'Store Settings & Payouts'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">
                  {isAr ? 'سعر الشحن الافتراضي (SAR)' : 'Flat Shipping Fee'}
                </label>
                <input
                  type="number"
                  value={shippingRate}
                  onChange={(e) => setShippingRate(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {isAr ? 'حد الشحن المجاني (SAR)' : 'Free Shipping Threshold'}
                </label>
                <input
                  type="number"
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {isAr ? 'الحساب البنكي لاستلام الأرباح' : 'Payout Bank Name'}
                </label>
                <input
                  type="text"
                  value={payoutBank}
                  onChange={(e) => setPayoutBank(e.target.value)}
                  placeholder="e.g. Al Rajhi Bank"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {isAr ? 'رقم الآيبان البنكي (IBAN)' : 'IBAN Number'}
                </label>
                <input
                  type="text"
                  value={payoutIban}
                  onChange={(e) => setPayoutIban(e.target.value)}
                  placeholder="SA0000000000000000000000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {isAr ? 'لون هوية المتجر' : 'Store Accent Color'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-10 h-9 rounded bg-slate-950 border border-slate-800 p-1 cursor-pointer"
                  />
                  <span className="font-mono text-slate-300">{themeColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {isAr ? 'حالة المتجر للعامة' : 'Publish Status'}
                </label>
                <select
                  value={isPublished ? 'true' : 'false'}
                  onChange={(e) => setIsPublished(e.target.value === 'true')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="true">{isAr ? 'منشور للعامة (Public Live)' : 'Public Live'}</option>
                  <option value="false">{isAr ? 'مسودة خاصة (Private Draft)' : 'Private Draft'}</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
              >
                {isAr ? 'حفظ إعدادات المتجر' : 'Save Settings'}
              </button>
            </div>
          </form>

          {/* Supabase & GitHub Sync Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Database className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">
                  {isAr ? 'مزامنة قاعدة بيانات Supabase و GitHub' : 'Supabase Database & GitHub Sync'}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Connected
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-slate-400">Supabase URL:</span>
                <span className="text-white">{supabaseConfig.projectUrl}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-slate-400">GitHub Repo:</span>
                <span className="text-indigo-400">{gitHubConfig.repoUrl}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {isAr ? 'كود SQL لإنشاء جداول هذا المتجر في Supabase:' : 'PostgreSQL Migration SQL for Supabase:'}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(supabaseSql);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2000);
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs flex items-center gap-1"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ كود SQL' : 'Copy SQL')}</span>
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 overflow-x-auto max-h-40">
                {supabaseSql}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {isAr ? 'إضافة منتج جديد للمتجر' : 'Add New Product to Store'}
              </h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isAr ? 'اسم المنتج (English)' : 'Product Name (English)'} *
                </label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Leather Card Holder"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isAr ? 'اسم المنتج (بالعربية)' : 'Product Name (Arabic)'}
                </label>
                <input
                  type="text"
                  value={newProdNameAr}
                  onChange={(e) => setNewProdNameAr(e.target.value)}
                  placeholder="مثال: محفظة بطاقات جلدية فاخرة"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isAr ? 'سعر البيع للزبون (SAR)' : 'Retail Price (SAR)'} *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isAr ? 'الكمية في المخزون' : 'Stock Units'} *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isAr ? 'التصنيف' : 'Category'}
                  </label>
                  <input
                    type="text"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    placeholder="Accessories"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    placeholder="e.g. CRD-01"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  {isAr ? 'نشر المنتج في المتجر' : 'Publish to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD COUPON */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {isAr ? 'إنشاء كود خصم جديد' : 'Create New Promo Coupon'}
              </h3>
              <button onClick={() => setShowAddCouponModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCouponSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isAr ? 'كود الكوبون (رمز الخصم)' : 'Coupon Code'} *
                </label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SAVE25"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isAr ? 'نوع الخصم' : 'Discount Type'}
                  </label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="percentage">{isAr ? 'نسبة مئوية (%)' : 'Percentage (%)'}</option>
                    <option value="fixed">{isAr ? 'مبلغ ثابت (SAR)' : 'Fixed Amount (SAR)'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {isAr ? 'قيمة الخصم' : 'Value'} *
                  </label>
                  <input
                    type="number"
                    required
                    value={couponValue}
                    onChange={(e) => setCouponValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {isAr ? 'الحد الأدنى لقيمة الطلب (SAR)' : 'Minimum Order Amount (SAR)'}
                </label>
                <input
                  type="number"
                  value={couponMinOrder}
                  onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCouponModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  {isAr ? 'حفظ وتفعيل الكوبون' : 'Save & Activate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT INVOICE MODAL */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {isAr ? 'فاتورة تجارية ضريبية' : 'Commercial Invoice'}
              </h3>
              <button onClick={() => setSelectedInvoiceOrder(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs tabular-nums text-start">
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-500">Order Ref:</span>
                <span className="font-bold text-indigo-400">{selectedInvoiceOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="text-white">{selectedInvoiceOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="text-slate-300">{selectedInvoiceOrder.customerCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tracking Code:</span>
                <span className="text-slate-300">{selectedInvoiceOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between border-t border-slate-850 pt-2 font-bold text-white">
                <span>Total Amount:</span>
                <span className="text-emerald-400">{formatPrice(selectedInvoiceOrder.total)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isAr ? 'طباعة الفاتورة' : 'Print Invoice'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
