import React, { useState } from 'react';
import { Store, Product, Order, PlanType, Currency, Language, SupabaseConfig, GitHubConfig } from '../types';
import { CURRENCY_RATES, PLANS } from '../data/initialData';
import { PlansPricingView } from './PlansPricingView';
import { 
  Store as StoreIcon, Package, ShoppingCart, Settings, 
  ExternalLink, Plus, CheckCircle2, Clock, Trash2, 
  TrendingUp, ShieldCheck, Database, GitBranch, Globe, 
  Check, ArrowRight, ArrowLeft, AlertCircle, Copy, Terminal, Edit3
} from 'lucide-react';

interface StoreDashboardViewProps {
  store: Store;
  products: Product[];
  orders: Order[];
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
  onOpenLivePreview: () => void;
  onOpenCreateNewStore: () => void;
}

export const StoreDashboardView: React.FC<StoreDashboardViewProps> = ({
  store,
  products,
  orders,
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
  onOpenLivePreview,
  onOpenCreateNewStore
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'plans' | 'settings'>('overview');
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState<boolean>(false);

  // Filter products and orders for this specific store
  const storeProducts = products.filter((p) => p.storeId === store.id);
  const storeOrders = orders.filter((o) => o.storeId === store.id);

  const formatPrice = (amount: number) => {
    const rateInfo = CURRENCY_RATES[currency];
    const converted = Math.round(amount * rateInfo.rate);
    return `${converted.toLocaleString()} ${isAr ? rateInfo.symbolAr : rateInfo.symbol}`;
  };

  const currentPlanDetails = PLANS.find((p) => p.id === store.plan) || PLANS[0];
  const isFreePlan = store.plan === 'free';
  const maxProducts = currentPlanDetails.maxProducts;

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(250);
  const [newProdStock, setNewProdStock] = useState(10);
  const [newProdCategory, setNewProdCategory] = useState('Accessories');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Store Settings Form State
  const [shippingRate, setShippingRate] = useState(store.settings.shippingRate);
  const [freeThreshold, setFreeThreshold] = useState(store.settings.freeShippingThreshold);
  const [taxRate, setTaxRate] = useState(store.settings.taxRate);
  const [themeColor, setThemeColor] = useState(store.settings.themeColor);
  const [isPublished, setIsPublished] = useState(store.settings.isPublished);

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    if (isFreePlan && storeProducts.length >= 10) {
      alert(isAr ? 'وصلت للحد الأقصى للمنتجات في الخطة المجانية (10 منتجات). قم بالترقية للخطة الاحترافية لعدد غير محدود!' : 'Free plan limit reached (10 products). Upgrade to Pro for unlimited products!');
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
      category: newProdCategory,
      stock: Number(newProdStock),
      sku: newProdSku || `SKU-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      isPublished: true
    };

    onAddProduct(prod);
    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdNameAr('');
    setNewProdPrice(250);
    setNewProdStock(10);
    setNewProdDesc('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreSettings({
      shippingRate: Number(shippingRate),
      freeShippingThreshold: Number(freeThreshold),
      taxRate: Number(taxRate),
      themeColor,
      isPublished
    });
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 2500);
  };

  const supabaseSql = `-- Supabase Migration for ${store.name} (${store.settings.subdomain})
CREATE TABLE IF NOT EXISTS public.store_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id TEXT DEFAULT '${store.id}',
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER DEFAULT 10,
  sku TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.store_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON public.store_products FOR SELECT USING (true);`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Store Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              {isAr ? 'لوحة تحكم المتجر' : 'STORE CONTROL PANEL'}
            </span>
            
            {/* Plan Badge with Upgrade CTA */}
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
              isFreePlan
                ? 'bg-slate-800 text-slate-300 border-slate-700'
                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
            }`}>
              {isAr ? currentPlanDetails.nameAr : currentPlanDetails.name}
            </span>

            {/* Store Status Badge */}
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{isAr ? 'المتجر منشور ونشط' : 'Store Live & Online'}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isAr ? store.nameAr : store.name}
          </h1>

          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
            <span>https://{store.settings.subdomain}</span>
            <span>·</span>
            <span>{isAr ? store.categoryAr : store.category}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenLivePreview}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-400 text-xs font-semibold text-white shadow-sm transition-all active:scale-95"
          >
            <ExternalLink className="w-4 h-4 text-indigo-400" />
            <span>{isAr ? 'معاينة متجر الزبائن' : 'View Live Store'}</span>
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
            title={isAr ? 'إنشاء وتسجيل متجر جديد آخر' : 'Create another store'}
          >
            <StoreIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: isAr ? 'نظرة عامة' : 'Overview', icon: TrendingUp },
          { id: 'products', label: isAr ? `المنتجات (${storeProducts.length})` : `Products (${storeProducts.length})`, icon: Package },
          { id: 'orders', label: isAr ? `الطلبات (${storeOrders.length})` : `Orders (${storeOrders.length})`, icon: ShoppingCart },
          { id: 'plans', label: isAr ? 'خطة الاشتراك' : 'Subscription & Plans', icon: ShieldCheck },
          { id: 'settings', label: isAr ? 'الإعدادات ومزامنة Supabase' : 'Settings & Supabase', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-mono">
                {isAr ? 'إجمالي المبيعات' : 'Total Revenue'}
              </span>
              <p className="text-2xl font-extrabold text-white font-mono tabular-nums">
                {formatPrice(store.totalSales)}
              </p>
              <span className="text-[11px] text-emerald-400 font-mono">
                {isAr ? 'أرباح متجرك الصافية' : 'Net store earnings'}
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
                {isAr ? 'المنتجات في الكتالوج' : 'Active Products'}
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
                {isAr ? 'الباقة الحالية' : 'Current Plan'}
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
                {currentPlanDetails.transactionFee} {isAr ? 'عمولة المنصة' : 'fee'}
              </span>
            </div>
          </div>

          {/* Quick Setup Checklist */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">
              {isAr ? 'خطوات إطلاق وتفعيل متجرك بنجاح' : 'Store Setup Checklist'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAr ? '1. تسجيل وتفعيل المتجر' : '1. Store Activated'}</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {isAr ? `متجرك جاهز ويعمل على ${store.settings.subdomain}` : `Store is live on ${store.settings.subdomain}`}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <Package className="w-4 h-4" />
                  <span>{isAr ? '2. إضافة المنتجات للمتجر' : '2. Add Products'}</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {storeProducts.length > 0
                    ? isAr ? `لديك ${storeProducts.length} منتجات منشورة.` : `${storeProducts.length} items live.`
                    : isAr ? 'أضف أول منتج لك وابدأ باستقبال المبيعات.' : 'Add your first product.'}
                </p>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="text-indigo-400 hover:underline font-medium block"
                >
                  + {isAr ? 'إضافة منتج الآن' : 'Add product now'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <ExternalLink className="w-4 h-4" />
                  <span>{isAr ? '3. مشاركة المتجر مع الزبائن' : '3. Share With Buyers'}</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {isAr ? 'عاين واجهة المتجر كما يراها المشتري وشارك الرابط على منصاتك.' : 'Preview how customers see your store and share link.'}
                </p>
                <button
                  onClick={onOpenLivePreview}
                  className="text-cyan-400 hover:underline font-medium block"
                >
                  {isAr ? 'معاينة متجر الزبائن' : 'Open live store'}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'أحدث الطلبات الواردة' : 'Latest Received Orders'}
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-indigo-400 hover:underline font-bold"
              >
                {isAr ? 'عرض جميع الطلبات' : 'View all orders'}
              </button>
            </div>

            <div className="divide-y divide-slate-850">
              {storeOrders.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  {isAr ? 'لم تصل أي طلبات شراء بعد. يمكنك تجربة عمل طلب شراء تجريبي عبر "معاينة متجر الزبائن".' : 'No orders yet. Place a test order via View Live Store.'}
                </p>
              ) : (
                storeOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="font-mono font-bold text-white">{order.orderNumber}</span>
                      <span className="text-slate-400 ms-3">{order.customerName} · {order.customerCity}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-indigo-400 tabular-nums">
                        {formatPrice(order.total)}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-400">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CATALOG */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">
                {isAr ? 'إدارة كتالوج المنتجات' : 'Products & Catalog Management'}
              </h3>
              <p className="text-xs text-slate-400">
                {isFreePlan
                  ? isAr ? `أنت في الخطة المجانية (${storeProducts.length} من أصل 10 منتجات مسجلة).` : `Free Plan: ${storeProducts.length}/10 products used.`
                  : isAr ? 'أنت في الخطة الاحترافية: عدد غير محدود من المنتجات.' : 'Pro Plan: Unlimited products active.'}
              </p>
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة منتج جديد' : 'New Product'}</span>
            </button>
          </div>

          {/* Products List Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-x-auto shadow-xl">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-3 px-4 text-start">{isAr ? 'المنتج' : 'Product'}</th>
                  <th className="py-3 px-4 text-start">SKU</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'السعر' : 'Price'}</th>
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

      {/* TAB 3: ORDERS */}
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
            {storeOrders.length === 0 ? (
              <div className="text-center py-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
                {isAr ? 'لا توجد طلبات جديدة بعد في متجرك.' : 'No orders recorded yet.'}
              </div>
            ) : (
              storeOrders.map((order) => (
                <div key={order.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
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
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">{isAr ? 'العميل' : 'Customer'}</span>
                      <span className="font-bold text-white">{order.customerName}</span>
                      <span className="text-slate-400 block font-mono text-[11px]">{order.customerPhone}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">{isAr ? 'عنوان التوصيل' : 'Address'}</span>
                      <span className="text-slate-300">{order.customerCity} - {order.customerAddress}</span>
                    </div>

                    <div className="text-end font-mono">
                      <span className="text-slate-500 block text-[10px] uppercase">{isAr ? 'الإجمالي' : 'Total'}</span>
                      <span className="font-extrabold text-indigo-400 text-sm">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PLANS & PRICING */}
      {activeTab === 'plans' && (
        <PlansPricingView
          currentPlan={store.plan}
          onChangePlan={onUpdateStorePlan}
          language={language}
        />
      )}

      {/* TAB 5: SETTINGS & SUPABASE/GITHUB */}
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
              {isAr ? 'إعدادات الشحن وهوية المتجر' : 'Store Settings & Brand Theme'}
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
                  {isAr ? 'حالة ظهور المتجر' : 'Publish Status'}
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

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-slate-400">Supabase URL:</span>
                <span className="text-white">{supabaseConfig.projectUrl}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-850">
                <span className="text-slate-400">GitHub Repo:</span>
                <span className="text-indigo-400">{gitHubConfig.repoUrl}</span>
              </div>
            </div>

            {/* SQL Script Box */}
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
                  <span>{copiedSql ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الكود' : 'Copy SQL')}</span>
                </button>
              </div>

              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 overflow-x-auto max-h-40">
                {supabaseSql}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
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
                    {isAr ? 'سعر البيع (SAR)' : 'Price (SAR)'} *
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

    </div>
  );
};
