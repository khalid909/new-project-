import React, { useState } from 'react';
import { Store, Product, Order, Currency, Language } from '../types';
import { CURRENCY_RATES } from '../data/initialData';
import { 
  Store as StoreIcon, Plus, Package, ShoppingCart, TrendingUp, 
  BarChart3, RefreshCw, Trash2, Edit3, CheckCircle, Clock, Truck, 
  Search, ShieldCheck, ChevronDown, Check 
} from 'lucide-react';

interface MerchantStudioProps {
  stores: Store[];
  products: Product[];
  orders: Order[];
  activeStoreId: string;
  setActiveStoreId: (id: string) => void;
  currency: Currency;
  language: Language;
  onAddProduct: (newProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onCreateStore: (newStore: Store) => void;
}

export const MerchantStudio: React.FC<MerchantStudioProps> = ({
  stores,
  products,
  orders,
  activeStoreId,
  setActiveStoreId,
  currency,
  language,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onCreateStore
}) => {
  const isAr = language === 'ar';
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'products' | 'orders'>('analytics');
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [showCreateStoreModal, setShowCreateStoreModal] = useState<boolean>(false);
  const [productSearch, setProductSearch] = useState<string>('');

  const currentStore = stores.find((s) => s.id === activeStoreId) || stores[0];

  const formatPrice = (usdAmount: number) => {
    const rateInfo = CURRENCY_RATES[currency];
    const converted = Math.round(usdAmount * rateInfo.rate);
    return `${converted.toLocaleString()} ${isAr ? rateInfo.symbolAr : rateInfo.symbol}`;
  };

  // Filter products & orders for active store
  const storeProducts = products.filter((p) => p.storeId === currentStore.id);
  const storeOrders = orders.filter((o) => o.storeId === currentStore.id);

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTitleAr, setNewTitleAr] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newSubtitleAr, setNewSubtitleAr] = useState('');
  const [newPrice, setNewPrice] = useState(950);
  const [newCategory, setNewCategory] = useState<'watches' | 'interiors' | 'fragrance' | 'leather' | 'audio'>('watches');
  const [newStock, setNewStock] = useState(10);
  const [newSku, setNewSku] = useState('');

  // New Store Form State
  const [storeName, setStoreName] = useState('');
  const [storeNameAr, setStoreNameAr] = useState('');
  const [storeSlogan, setStoreSlogan] = useState('');
  const [storeSloganAr, setStoreSloganAr] = useState('');
  const [storeCategory, setStoreCategory] = useState('Luxury Boutique');

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const prod: Product = {
      id: `prod_${Date.now()}`,
      storeId: currentStore.id,
      storeName: currentStore.name,
      storeNameAr: currentStore.nameAr,
      name: newTitle,
      nameAr: newTitleAr || newTitle,
      subtitle: newSubtitle || 'Artisanal limited edition',
      subtitleAr: newSubtitleAr || 'إصدار حرفي محدود',
      description: 'Handcrafted luxury piece strictly cataloged and inspected for supreme durability and elegance.',
      descriptionAr: 'قطعة فاخرة مصنوعة يدوياً تم فحصها واعتمادها لضمان أعلى معايير الجودة والأناقة.',
      price: Number(newPrice),
      category: newCategory,
      categoryAr: isAr ? 'معروضات خاصة' : 'Special Collection',
      rating: 5.0,
      reviewsCount: 1,
      stock: Number(newStock),
      isFeatured: true,
      sku: newSku || `SQF-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      tags: ['New Arrival', 'Verified Atelier'],
      specs: [
        { label: 'Craftsmanship', labelAr: 'طريقة التصنيع', value: 'Bespoke Atelier Production', valueAr: 'إنتاج استثنائي خاص' },
        { label: 'Warranty', labelAr: 'الضمان', value: '5-Year International Guarantee', valueAr: 'ضمان دولي معتمد 5 سنوات' }
      ],
      visualGradient: 'from-zinc-900 via-neutral-900 to-amber-950/40',
      accentBadge: 'New Release',
      accentBadgeAr: 'إصدار جديد'
    };

    onAddProduct(prod);
    setShowAddProductModal(false);
    // Reset form
    setNewTitle('');
    setNewTitleAr('');
    setNewSubtitle('');
    setNewPrice(950);
  };

  const handleCreateStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;

    const newStore: Store = {
      id: `store_${Date.now()}`,
      name: storeName,
      nameAr: storeNameAr || storeName,
      slug: storeName.toLowerCase().replace(/\s+/g, '-'),
      slogan: storeSlogan || 'Independent luxury house',
      sloganAr: storeSloganAr || 'دار فاخرة مستقلة',
      description: 'Verified independent atelier operating exclusively on the SOUQIFY cloud marketplace platform.',
      descriptionAr: 'أتيليه مستقل معتمد يعمل حصرياً عبر منصة سُوقِفاي السحابية للمتاجر.',
      category: storeCategory,
      categoryAr: storeCategory,
      rating: 5.0,
      totalSales: 0,
      verified: true,
      accentColor: '#D4AF37',
      badge: 'Certified Seller',
      badgeAr: 'بائع معتمد',
      inventoryCount: 0,
      joinedYear: 2026,
      supabaseConnected: true
    };

    onCreateStore(newStore);
    setActiveStoreId(newStore.id);
    setShowCreateStoreModal(false);
    setStoreName('');
    setStoreNameAr('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Studio Header & Store Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500">
              {isAr ? 'استوديو إدارة التاجر (Shopify Experience)' : 'MERCHANT STUDIO & CONTROL TOWER'}
            </span>
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-mono">
              Live Cloud Active
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100">
              {isAr ? currentStore.nameAr : currentStore.name}
            </h1>
            <span className="text-xs text-neutral-400 font-mono">
              ({currentStore.joinedYear})
            </span>
          </div>

          <p className="text-xs text-neutral-400 mt-1">
            {isAr ? currentStore.sloganAr : currentStore.slogan}
          </p>
        </div>

        {/* Store Switcher & New Store CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={activeStoreId}
              onChange={(e) => setActiveStoreId(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer pe-8"
              aria-label="Switch active store"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {isAr ? s.nameAr : s.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowCreateStoreModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'إنشاء متجر جديد' : 'New Boutique'}</span>
          </button>

          <button
            onClick={() => setShowAddProductModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-xs font-bold text-neutral-950 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-neutral-950" />
            <span>{isAr ? 'إضافة منتج' : 'Add Product'}</span>
          </button>
        </div>
      </div>

      {/* Merchant Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
            activeSubTab === 'analytics'
              ? 'bg-neutral-850 text-amber-400 font-bold border border-neutral-700'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{isAr ? 'المؤشرات والتحليلات' : 'Analytics & Sales'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('products')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
            activeSubTab === 'products'
              ? 'bg-neutral-850 text-amber-400 font-bold border border-neutral-700'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{isAr ? `إدارة الكتالوج (${storeProducts.length})` : `Catalog (${storeProducts.length})`}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
            activeSubTab === 'orders'
              ? 'bg-neutral-850 text-amber-400 font-bold border border-neutral-700'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{isAr ? `طلبات الشحن والتجهيز (${storeOrders.length})` : `Fulfillment (${storeOrders.length})`}</span>
        </button>
      </div>

      {/* SUB-TAB 1: ANALYTICS & REVENUE */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <span className="text-xs text-neutral-400 font-mono">
                {isAr ? 'إجمالي الإيرادات (Gross Sales)' : 'Total Gross Volume'}
              </span>
              <div className="text-2xl font-extrabold text-neutral-100 font-mono tabular-nums">
                {formatPrice(currentStore.totalSales)}
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% {isAr ? 'عن الشهر الماضي' : 'vs last month'}</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <span className="text-xs text-neutral-400 font-mono">
                {isAr ? 'الطلبات المسجلة' : 'Total Orders Processed'}
              </span>
              <div className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums">
                {storeOrders.length + 128}
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                100% {isAr ? 'تسليم مؤمّن' : 'Insured delivery'}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <span className="text-xs text-neutral-400 font-mono">
                {isAr ? 'متوسط قيمة الطلب (AOV)' : 'Average Order Value'}
              </span>
              <div className="text-2xl font-extrabold text-neutral-100 font-mono tabular-nums">
                {formatPrice(1850)}
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                {isAr ? 'شريحة المقتنيات الفاخرة' : 'High-ticket luxury tier'}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <span className="text-xs text-neutral-400 font-mono">
                {isAr ? 'معدل التحويل (Conversion Rate)' : 'Online Conversion'}
              </span>
              <div className="text-2xl font-extrabold text-neutral-100 font-mono tabular-nums">
                3.82%
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">
                {isAr ? 'أعلى من متوسط التجارة بـ 2.1x' : '2.1x higher than benchmark'}
              </div>
            </div>
          </div>

          {/* Real-time Sales Volume Chart Representation */}
          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-200">
                  {isAr ? 'نشاط المبيعات والأداء الأسبوعي' : 'Weekly Sales Velocity & Payouts'}
                </h3>
                <span className="text-xs text-neutral-500 font-mono">
                  {isAr ? 'بيانات متزامنة لحظياً مع جداول Supabase' : 'Real-time telemetry stream from Supabase'}
                </span>
              </div>
              <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Supabase Live</span>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="grid grid-cols-7 gap-3 pt-4 h-48 items-end">
              {[
                { day: 'Mon', dayAr: 'الإثنين', val: 65, sales: 12400 },
                { day: 'Tue', dayAr: 'الثلاثاء', val: 45, sales: 8600 },
                { day: 'Wed', dayAr: 'الأربعاء', val: 80, sales: 15200 },
                { day: 'Thu', dayAr: 'الخميس', val: 95, sales: 18100 },
                { day: 'Fri', dayAr: 'الجمعة', val: 100, sales: 22400 },
                { day: 'Sat', dayAr: 'السبت', val: 85, sales: 16800 },
                { day: 'Sun', dayAr: 'الأحد', val: 70, sales: 13900 }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono tabular-nums text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatPrice(item.sales)}
                  </span>
                  <div
                    style={{ height: `${item.val}%` }}
                    className="w-full max-w-[48px] rounded-t-md bg-gradient-to-t from-amber-600 to-amber-400 group-hover:from-amber-500 group-hover:to-amber-300 transition-all duration-300"
                  />
                  <span className="text-[11px] font-mono text-neutral-400 mt-1">
                    {isAr ? item.dayAr : item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PRODUCT CATALOG MANAGEMENT */}
      {activeSubTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute start-3 top-2.5 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder={isAr ? 'بحث بالاسم أو SKU...' : 'Search product title or SKU...'}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 ps-9 pe-3 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة منتج جديد للكتالوج' : 'Add New Item'}</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-neutral-950/80 border-b border-neutral-800 text-neutral-400 uppercase font-mono">
                <tr>
                  <th className="py-3 px-4 text-start">{isAr ? 'المنتج' : 'Product'}</th>
                  <th className="py-3 px-4 text-start">SKU</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'السعر' : 'Price'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'المخزون' : 'Stock'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="py-3 px-4 text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850 font-mono tabular-nums">
                {storeProducts
                  .filter((p) => {
                    if (!productSearch.trim()) return true;
                    const q = productSearch.toLowerCase();
                    return p.name.toLowerCase().includes(q) || p.nameAr.includes(q) || p.sku.toLowerCase().includes(q);
                  })
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-850/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-sans">
                          <span className="font-semibold text-neutral-100 block">{isAr ? p.nameAr : p.name}</span>
                          <span className="text-[11px] text-neutral-400">{isAr ? p.categoryAr : p.category}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-xs">{p.sku}</td>
                      <td className="py-3 px-4 text-neutral-200 font-bold">{formatPrice(p.price)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          p.stock > 5 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                        }`}>
                          {p.stock} {isAr ? 'قطعة' : 'units'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                          <Check className="w-3.5 h-3.5" />
                          <span>{isAr ? 'نشط في السوق' : 'Published'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-end">
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1.5 rounded text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
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

      {/* SUB-TAB 3: ORDERS FULFILLMENT CENTER */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-200">
              {isAr ? 'سجل طلبات الشحن والتسليم' : 'Order Fulfillment Dispatch Pipeline'}
            </h3>
            <span className="text-xs font-mono text-neutral-400">
              {storeOrders.length} {isAr ? 'طلبات قيد المتابعة' : 'orders logged'}
            </span>
          </div>

          <div className="space-y-3">
            {storeOrders.length === 0 ? (
              <div className="text-center py-12 rounded-xl bg-neutral-900/30 border border-neutral-850 text-neutral-500 text-xs">
                {isAr ? 'لا توجد طلبات جديدة لهذا المتجر بعد.' : 'No orders recorded for this boutique yet.'}
              </div>
            ) : (
              storeOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-850 pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-neutral-400 ms-3 font-mono">
                        {new Date(order.createdAt).toLocaleString(isAr ? 'ar-SA' : 'en-US')}
                      </span>
                    </div>

                    {/* Status Badge & Status Selector */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded text-xs font-mono font-semibold ${
                        order.status === 'delivered'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : order.status === 'shipped'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>

                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                        className="bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-xs text-neutral-300 focus:outline-none cursor-pointer"
                        aria-label="Update order status"
                      >
                        <option value="pending">{isAr ? 'قيد الانتظار' : 'Pending'}</option>
                        <option value="processing">{isAr ? 'قيد التجهيز' : 'Processing'}</option>
                        <option value="shipped">{isAr ? 'تم الشحن' : 'Shipped'}</option>
                        <option value="delivered">{isAr ? 'تم التسليم' : 'Delivered'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer & Shipping Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-500 block">{isAr ? 'العميل' : 'Customer'}</span>
                      <span className="font-semibold text-neutral-200">{order.customer.fullName}</span>
                      <span className="text-neutral-400 block text-[11px] font-mono">{order.customer.phone}</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 block">{isAr ? 'وجهة التسليم' : 'Destination'}</span>
                      <span className="text-neutral-300">{order.customer.city} - {order.customer.address}</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 block">{isAr ? 'بوليصة الشحن' : 'Tracking'}</span>
                      <span className="font-mono text-neutral-200">{order.trackingNumber}</span>
                    </div>
                  </div>

                  {/* Items list & Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-850 text-xs">
                    <span className="text-neutral-400 font-mono">
                      {order.items.length} {isAr ? 'منتجات مطلوبة' : 'items'}
                    </span>
                    <span className="font-bold font-mono text-amber-400 text-sm">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-neutral-100">
                {isAr ? 'إضافة قطعة أو منتج إلى الكتالوج' : 'Add New Product to Atelier'}
              </h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-neutral-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">
                  {isAr ? 'اسم المنتج (إنجليزي)' : 'Product Name (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Chronometre Skeleton Tourbillon"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">
                  {isAr ? 'اسم المنتج (عربي)' : 'Product Name (Arabic)'}
                </label>
                <input
                  type="text"
                  value={newTitleAr}
                  onChange={(e) => setNewTitleAr(e.target.value)}
                  placeholder="مثال: ساعة كرونوميتر مفرغة توربيون"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">
                    {isAr ? 'السعر (USD)' : 'Price (USD)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">
                    {isAr ? 'الكمية في المخزون' : 'Stock Quantity'}
                  </label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">
                    {isAr ? 'التصنيف' : 'Category'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="watches">Watches</option>
                    <option value="interiors">Interiors</option>
                    <option value="fragrance">Fragrance</option>
                    <option value="leather">Leather</option>
                    <option value="audio">Audiophile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">SKU</label>
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    placeholder="e.g. MH-AUTO-09"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold"
                >
                  {isAr ? 'حفظ ونشر القطعة' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW STORE */}
      {showCreateStoreModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-neutral-100">
                {isAr ? 'إطلاق بوتيك أو دار جديدة' : 'Launch New Brand Boutique'}
              </h3>
              <button onClick={() => setShowCreateStoreModal(false)} className="text-neutral-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStoreSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">
                  {isAr ? 'اسم المتجر / العلامة (English)' : 'Store Name (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Atelier Valois Paris"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">
                  {isAr ? 'اسم المتجر (عربي)' : 'Store Name (Arabic)'}
                </label>
                <input
                  type="text"
                  value={storeNameAr}
                  onChange={(e) => setStoreNameAr(e.target.value)}
                  placeholder="مثال: أتيليه فالوا باريس"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">
                  {isAr ? 'الشعار التسويقي (Slogan)' : 'Slogan / Tagline'}
                </label>
                <input
                  type="text"
                  value={storeSlogan}
                  onChange={(e) => setStoreSlogan(e.target.value)}
                  placeholder="e.g. Masterful crystal and high jewelry"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateStoreModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold"
                >
                  {isAr ? 'إنشاء وتفعيل المتجر' : 'Activate Boutique'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
