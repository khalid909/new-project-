import React, { useState } from 'react';
import { Store, Product, Order, Language, Currency, StoreFeatureItem } from '../types';
import { CURRENCY_RATES } from '../data/initialData';
import { 
  ShoppingBag, CheckCircle2, ArrowRight, ArrowLeft, 
  Lock, X, ShieldCheck, Truck, Star, Check, Plus, Minus, Printer, 
  CreditCard, Search, Tag, Copy, ExternalLink, Eye, RotateCcw, 
  ChevronRight, Phone, Mail, HelpCircle, Package, ArrowUpRight, Globe,
  MessageCircle, AlertTriangle, Link2, Share2,
  Edit3, Trash2, Power, Sliders, Sparkles, Layers, CheckSquare, Settings
} from 'lucide-react';

interface PublicStoreViewProps {
  store: Store;
  products: Product[];
  language: Language;
  currency: Currency;
  storeFeatures?: StoreFeatureItem[];
  currentUser?: any;
  onClose?: () => void;
  onBackToDashboard?: () => void;
  onBackToPlatform?: () => void;
  onNewCustomerOrder: (order: Order) => void;
  onToggleStoreFeature?: (id: string) => void;
  onRemoveStoreFeature?: (id: string) => void;
  onRestoreStoreFeature?: (id: string) => void;
  onUpdateStoreFeature?: (updated: StoreFeatureItem) => void;
  onUpdateStore?: (updated: Partial<Store>) => void;
  onResetDefaultStoreFeatures?: () => void;
  onEnableAllStoreFeatures?: () => void;
  isOnlinePaymentsEnabled?: boolean;
  isStandalonePage?: boolean;
  initialMerchantMode?: boolean;
}

export const PublicStoreView: React.FC<PublicStoreViewProps> = ({
  store,
  products,
  language,
  currency: initialCurrency,
  storeFeatures,
  currentUser,
  onClose,
  onBackToDashboard,
  onBackToPlatform,
  onNewCustomerOrder,
  onToggleStoreFeature,
  onRemoveStoreFeature,
  onRestoreStoreFeature,
  onUpdateStoreFeature,
  onUpdateStore,
  onResetDefaultStoreFeatures,
  onEnableAllStoreFeatures,
  isOnlinePaymentsEnabled = true,
  isStandalonePage = false,
  initialMerchantMode = true
}) => {
  const isAr = language === 'ar';
  
  // Merchant Live Control Mode (Enabled by default for sellers, allows 3-button section control starting from homepage)
  const [isMerchantMode, setIsMerchantMode] = useState<boolean>(initialMerchantMode);
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [showRestoreDropdown, setShowRestoreDropdown] = useState<boolean>(false);

  // Edit Feature Form State
  const [editingFeature, setEditingFeature] = useState<StoreFeatureItem | null>(null);
  const [editNameAr, setEditNameAr] = useState<string>('');
  const [editDescAr, setEditDescAr] = useState<string>('');
  const [editCustomValue, setEditCustomValue] = useState<string>('');
  const [editIsEnabled, setEditIsEnabled] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3000);
  };

  // Helper to check if a specific store-level feature is enabled & not removed
  const isStoreFeatureActive = (id: string) => {
    if (!storeFeatures || storeFeatures.length === 0) return true;
    const feat = storeFeatures.find((f) => f.id === id);
    return feat ? feat.isEnabled && !feat.isRemoved : true;
  };

  const getFeature = (id: string) => {
    return (storeFeatures || []).find((f) => f.id === id);
  };

  const activeFeaturesCount = (storeFeatures || []).filter((f) => f.isEnabled && !f.isRemoved).length;
  const removedFeatures = (storeFeatures || []).filter((f) => f.isRemoved);
  const removedFeaturesCount = removedFeatures.length;

  // Actions for Feature Control System
  const handleToggleFeature = (id: string) => {
    if (onToggleStoreFeature) {
      onToggleStoreFeature(id);
    }
    const feat = getFeature(id);
    const newStatus = feat ? !feat.isEnabled : false;
    showToast(isAr ? `تم ${newStatus ? 'تفعيل' : 'تعطيل'} القسم بنجاح ✓` : `Section ${newStatus ? 'enabled' : 'disabled'} ✓`);
  };

  const handleRemoveFeature = (id: string) => {
    const feat = getFeature(id);
    if (onRemoveStoreFeature) {
      onRemoveStoreFeature(id);
    }
    showToast(isAr ? `تم حذف قسم "${feat?.nameAr || id}" من الصفحة الرئيسية (يمكنك استعادته في أي وقت) 🗑️` : `Section removed from homepage 🗑️`);
  };

  const handleRestoreFeature = (id: string) => {
    const feat = getFeature(id);
    if (onRestoreStoreFeature) {
      onRestoreStoreFeature(id);
    }
    showToast(isAr ? `تمت استعادة قسم "${feat?.nameAr || id}" للصفحة الرئيسية بنجاح ↩️` : `Section restored successfully ↩️`);
  };

  const handleOpenEditModal = (feat: StoreFeatureItem) => {
    setEditingFeature(feat);
    setEditNameAr(feat.nameAr);
    setEditDescAr(feat.descriptionAr);
    setEditCustomValue(feat.customValue || '');
    setEditIsEnabled(feat.isEnabled);
  };

  const handleSaveFeatureEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature) return;

    const updated: StoreFeatureItem = {
      ...editingFeature,
      nameAr: editNameAr.trim() || editingFeature.nameAr,
      descriptionAr: editDescAr.trim() || editingFeature.descriptionAr,
      customValue: editCustomValue.trim(),
      isEnabled: editIsEnabled
    };

    if (onUpdateStoreFeature) {
      onUpdateStoreFeature(updated);
    }

    // If editing storeHeader or heroBanner, sync with store info if updated
    if (editingFeature.id === 'storeHeader' && onUpdateStore) {
      onUpdateStore({ sloganAr: editDescAr.trim() || store.sloganAr });
    }
    if (editingFeature.id === 'heroBanner' && onUpdateStore) {
      onUpdateStore({ descriptionAr: editDescAr.trim() || store.descriptionAr });
    }

    setEditingFeature(null);
    showToast(isAr ? `تم حفظ وتطبيق تعديل قسم "${updated.nameAr}" في الصفحة الرئيسية بنجاح ✓` : `Section updated successfully ✓`);
  };

  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = useState<Order | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState<boolean>(false);
  const [trackingNumberInput, setTrackingNumberInput] = useState<string>('');
  const [trackedOrderResult, setTrackedOrderResult] = useState<string | null>(null);
  
  // Independent Top Simulator Bar
  const [showSimulatorBar, setShowSimulatorBar] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [simulatorUrlType, setSimulatorUrlType] = useState<'standard' | 'subdomain'>('standard');

  const getStandardStoreUrl = () => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const path = window.location.pathname === '/' ? '' : window.location.pathname;
      return `${origin}${path}?mode=store&store=${store.slug}`;
    }
    return `https://wasladz.app/?mode=store&store=${store.slug}`;
  };

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Coupon state in checkout
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>('');
  const [couponSuccess, setCouponSuccess] = useState<string>('');

  // Customer Checkout Form (Algerian COD Preset)
  const [custName, setCustName] = useState(isAr ? 'أمين بن سالم' : 'Amine Bensalem');
  const [custEmail, setCustEmail] = useState('amine.bensalem@gmail.com');
  const [custPhone, setCustPhone] = useState('0555123456');
  const [custCity, setCustCity] = useState(isAr ? 'الجزائر العاصمة (16)' : 'Algiers (16)');
  const [custAddress, setCustAddress] = useState(isAr ? 'شارع ديدوش مراد، الجزائر الوسطى' : 'Didouche Mourad St, Alger Centre');
  const [selectedPayment, setSelectedPayment] = useState<'cod' | 'baridimob' | 'cib'>('cod');

  // Filter products for this specific independent store
  const storeProducts = products.filter((p) => p.storeId === store.id && p.isPublished);

  // Categories list
  const categories = ['all', ...Array.from(new Set(storeProducts.map((p) => p.category)))];

  // Filtered & sorted products
  const filteredProducts = storeProducts
    .filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchQuery = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  const formatPrice = (amount: number) => {
    const rateInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.SAR;
    const converted = Math.round(amount * rateInfo.rate);
    return `${converted.toLocaleString()} ${isAr ? rateInfo.symbolAr : rateInfo.symbol}`;
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: Product; quantity: number }[];
    });
  };

  const rawCartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = isStoreFeatureActive('discountCoupons') 
    ? Math.round((rawCartTotal * appliedDiscount) / 100) 
    : 0;
  
  const isFreeShipping = isStoreFeatureActive('shippingThreshold') 
    ? rawCartTotal >= (store.settings.freeShippingThreshold || 300) 
    : false;
  
  const hasFlatShipping = isStoreFeatureActive('shippingFlat');
  const shippingCost = isFreeShipping 
    ? 0 
    : (hasFlatShipping ? (store.settings.shippingRate || 25) : 0);
  
  const hasVatCalculation = isStoreFeatureActive('taxCalculation');
  const taxableAmount = Math.max(0, rawCartTotal - discountAmount);
  const taxAmount = hasVatCalculation ? Math.round(taxableAmount * ((store.settings.taxRate || 15) / 100)) : 0;
  
  const finalTotal = taxableAmount + shippingCost + taxAmount;
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'WELCOME10' || code === 'AVANTO10' || code === 'START10') {
      setAppliedDiscount(10);
      setCouponSuccess(isAr ? 'تم تطبيق خصم 10% بنجاح!' : '10% discount applied!');
    } else if (code === 'VIP20' || code === 'PRO20') {
      setAppliedDiscount(20);
      setCouponSuccess(isAr ? 'تم تطبيق خصم 20% بنجاح!' : '20% VIP discount applied!');
    } else {
      setCouponError(isAr ? 'رمز الكوبون غير صالح أو منتهي الصلاحية' : 'Invalid coupon code');
    }
  };

  const handleCopyLink = () => {
    const url = simulatorUrlType === 'standard'
      ? getStandardStoreUrl()
      : `https://${store.settings.subdomain || `${store.slug}.wasladz.app`}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNum = `ORD-DZ-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingCode = `TRK-DZ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    let payMethodName = isAr ? 'الدفع عند الاستلام (COD)' : 'Cash on Delivery (COD)';
    if (selectedPayment === 'baridimob') payMethodName = isAr ? 'بريدي موب (BaridiMob / CCP)' : 'BaridiMob / CCP Transfer';
    if (selectedPayment === 'cib') payMethodName = isAr ? 'البطاقة الذهبية / CIB' : 'Edahabia / CIB Card';

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      storeId: store.id,
      customerName: custName,
      customerEmail: custEmail,
      customerPhone: custPhone,
      customerCity: custCity,
      customerAddress: custAddress,
      items: cart.map((c) => ({
        id: `item_${c.product.id}`,
        product: c.product,
        quantity: c.quantity
      })),
      total: finalTotal,
      currency,
      status: 'processing',
      paymentMethod: payMethodName,
      createdAt: new Date().toISOString().split('T')[0],
      trackingNumber: trackingCode
    };

    onNewCustomerOrder(newOrder);
    setOrderConfirmed(newOrder);
    setCart([]);
  };

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumberInput.trim()) return;
    setTrackedOrderResult(
      isAr 
        ? `طلبك (${trackingNumberInput.trim()}) قيد التجهيز وسيتم تسليمه لشركة الشحن (ياليدين / ZR Express) خلال 24 ساعة. حالة الشحنة: جاري التغليف والتجهيز للـ 58 ولاية.`
        : `Order (${trackingNumberInput.trim()}) is being prepared and will be handed to carrier (Yalidine/ZR Express) within 24h.`
    );
  };

  const storeSubdomain = store.settings?.subdomain || `${store.slug}.wasladz.app`;

  // Render Inner Content
  const renderStoreContent = () => (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Maintenance Mode Banner (Controlled by maintenanceMode feature) */}
      {isStoreFeatureActive('maintenanceMode') && (
        <div className="bg-amber-400 text-slate-950 font-bold px-4 py-2.5 text-xs text-center border-b border-amber-500 shadow-xs flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0" />
          <span>
            {isAr
              ? '⚠️ المتجر في وضع الصيانة والتحديث المؤقت حالياً. يمكنك تصفح المنتجات وسنعاود قبول الطلبات قريباً!'
              : '⚠️ Store is temporarily in maintenance mode. Browsing is active, checkout will resume shortly!'}
          </span>
        </div>
      )}

      {/* ─── 1. INDEPENDENT STORE HEADER ─── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        
        {/* Top Mini Announcement Bar (Controlled by topAnnouncement feature) */}
        {isStoreFeatureActive('topAnnouncement') && (
          <div 
            className="text-white text-[11px] font-bold py-1.5 px-4 text-center transition-colors"
            style={{ backgroundColor: store.accentColor || '#4F46E5' }}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <span className="hidden sm:inline">
                {isAr ? '✨ متجر مستقل معتمد - شحن سريع وضمان استرجاع' : '✨ Official Independent Store - Fast Shipping & Returns'}
              </span>
              <span className="mx-auto sm:mx-0">
                {isStoreFeatureActive('shippingThreshold') ? (
                  isAr
                    ? `🚚 شحن مجاني لكافة الطلبات فوق ${store.settings.freeShippingThreshold || 300} ر.س!`
                    : `🚚 Free shipping on orders over ${store.settings.freeShippingThreshold || 300} SAR!`
                ) : (
                  isAr ? '🚚 توصيل لكافة المناطق' : '🚚 Fast shipping available'
                )}
              </span>
              {isStoreFeatureActive('orderTracking') && (
                <button
                  onClick={() => setIsTrackingModalOpen(true)}
                  className="hidden sm:flex items-center gap-1 underline hover:text-white/80 cursor-pointer"
                >
                  <Package className="w-3 h-3" />
                  <span>{isAr ? 'تتبع طلبي' : 'Track Order'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Store Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-20">
            
            {/* Store Brand & Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-md transition-transform hover:scale-105"
                style={{ backgroundColor: store.accentColor || '#4F46E5' }}
              >
                {store.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    {isAr ? store.nameAr : store.name}
                  </h1>
                  <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{isAr ? 'متجر مستقل' : 'Live Store'}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {isAr ? store.sloganAr : store.slogan}
                </p>
              </div>
            </div>

            {/* Live Search Bar (Controlled by storeSearch feature) */}
            {isStoreFeatureActive('storeSearch') && (
              <div className="hidden md:flex flex-1 max-w-md mx-6">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? `ابحث عن منتج في ${store.nameAr}...` : `Search in ${store.name}...`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-10 pe-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute top-1/2 -translate-y-1/2 end-3 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Store Header Right Actions */}
            <div className="flex items-center gap-3">
              
              {/* Currency Selector for buyer (Controlled by buyerCurrency feature) */}
              {isStoreFeatureActive('buyerCurrency') && (
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-2.5 py-2 text-slate-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
                  aria-label="Buyer currency"
                >
                  <option value="SAR">ر.س (SAR)</option>
                  <option value="USD">$ (USD)</option>
                  <option value="AED">د.إ (AED)</option>
                  <option value="EUR">€ (EUR)</option>
                </select>
              )}

              {/* Order Tracking Button for Mobile (Controlled by orderTracking feature) */}
              {isStoreFeatureActive('orderTracking') && (
                <button
                  onClick={() => setIsTrackingModalOpen(true)}
                  className="sm:hidden p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                  title={isAr ? 'تتبع طلبي' : 'Track Order'}
                >
                  <Package className="w-4 h-4" />
                </button>
              )}

              {/* Cart Drawer Trigger Button (Controlled by cartAndCheckout feature) */}
              {isStoreFeatureActive('cartAndCheckout') && (
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-md shadow-indigo-600/15 transition-all active:scale-98 cursor-pointer"
                  style={{ backgroundColor: store.accentColor || '#4F46E5' }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">{isAr ? 'سلة المشتريات' : 'Shopping Cart'}</span>
                  {totalItemsCount > 0 ? (
                    <span className="w-5 h-5 rounded-full bg-white text-slate-900 font-mono font-extrabold text-[10px] flex items-center justify-center shadow-xs">
                      {totalItemsCount}
                    </span>
                  ) : (
                    <span className="text-[11px] opacity-80">(0)</span>
                  )}
                </button>
              )}

              {/* Close Button if Modal view */}
              {!isStandalonePage && onClose && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title={isAr ? 'إغلاق المعاينة' : 'Close'}
                >
                  <X className="w-5 h-5" />
                </button>
              )}

            </div>

          </div>
        </div>

        {/* Mobile Search Bar (Controlled by storeSearch feature) */}
        {isStoreFeatureActive('storeSearch') && (
          <div className="md:hidden px-4 pb-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث عن منتج...' : 'Search products...'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-9 pe-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        )}
      </header>

      {/* ─── 2. STORE HERO BANNER ─── */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isAr ? 'متجر مستقل معتمد - تشغيل مباشر' : 'Independent Verified Store'}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                {isAr ? `مرحباً بك في ${store.nameAr}` : `Welcome to ${store.name}`}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                {isAr ? store.descriptionAr : store.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'شحن فوري لباب البيت' : 'Fast Doorstep Delivery'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>{isAr ? 'دفع آمن بالبطاقة ومدى' : 'Secure Mada & Card Payments'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>{isAr ? 'استرجاع مضمون 14 يوماً' : '14-Day Easy Returns'}</span>
                </div>
              </div>
            </div>

            {/* Quick Hero Box with Accent styling (Controlled by welcomeDiscount feature) */}
            {isStoreFeatureActive('welcomeDiscount') && (
              <div className="lg:col-span-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      {isAr ? 'رمز خصم ترحيبي للزبائن:' : 'Welcome discount code:'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      -10%
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-slate-900 text-sm">
                    <span>WELCOME10</span>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText('WELCOME10');
                        setCouponCode('WELCOME10');
                        alert(isAr ? 'تم نسخ الرمز وسيتم تطبيقه بالسلة!' : 'Code copied!');
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer"
                    >
                      {isAr ? 'استخدمه الآن' : 'Use'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isAr ? 'ينطبق على كافة المنتجات عند إتمام الطلب.' : 'Applies to all products at checkout.'}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ─── 3. STORE PRODUCTS CATALOG ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Category Filters Bar & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {cat === 'all' ? (isAr ? 'جميع المنتجات' : 'All Products') : cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown & Product Count */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
            <span className="text-slate-500 font-medium">
              {filteredProducts.length} {isAr ? 'منتج متوفر' : 'products'}
            </span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold focus:outline-none focus:border-indigo-600 cursor-pointer"
              aria-label="Sort products"
            >
              <option value="default">{isAr ? 'الترتيب: الافتراضي' : 'Sort: Default'}</option>
              <option value="price-asc">{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              <option value="price-desc">{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
            </select>
          </div>

        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">
              {isAr ? 'لا توجد منتجات مطابقة للبحث' : 'No products found'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAr ? 'جرّب البحث بكلمات أخرى أو اختر تصنيفاً آخر.' : 'Try adjusting your search query or filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
            >
              {isAr ? 'إعادة ضبط التصفية' : 'Reset filters'}
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const inCart = cart.find((c) => c.product.id === product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all p-5 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Visual Box */}
                    <div className="w-full h-48 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4 border border-slate-200/70 relative overflow-hidden">
                      <ShoppingBag 
                        className="w-12 h-12 transition-transform duration-300 group-hover:scale-110" 
                        style={{ color: store.accentColor || '#4F46E5' }}
                      />
                      <span className="text-[11px] font-mono text-slate-500 mt-2 font-bold">
                        {product.category}
                      </span>
                      
                      {/* Stock Badge (Controlled by stockIndicator feature) */}
                      {isStoreFeatureActive('stockIndicator') && (
                        <span className="absolute top-3 end-3 text-[10px] bg-white/90 backdrop-blur-xs font-mono font-bold text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                          {product.stock > 0 ? (
                            <span className="text-emerald-700">{product.stock} {isAr ? 'متوفر' : 'in stock'}</span>
                          ) : (
                            <span className="text-rose-600">{isAr ? 'نفذت الكمية' : 'Out of stock'}</span>
                          )}
                        </span>
                      )}

                      {/* Quick View Button (Controlled by quickView feature) */}
                      {isStoreFeatureActive('quickView') && (
                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="absolute bottom-3 inset-x-4 py-1.5 rounded-lg bg-white/95 text-slate-900 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm text-center cursor-pointer"
                        >
                          {isAr ? 'نظرة سريعة 👁️' : 'Quick View 👁️'}
                        </button>
                      )}
                    </div>

                    {/* Product Details */}
                    <div>
                      {/* Customer Reviews (Controlled by customerReviews feature) */}
                      {isStoreFeatureActive('customerReviews') && (
                        <div className="flex items-center gap-1 text-amber-500 text-[11px] font-bold mb-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                          <span>4.9</span>
                          <span className="text-slate-400 font-normal">({isAr ? '128 تقييم' : '128 reviews'})</span>
                        </div>
                      )}

                      <h3 className="font-extrabold text-slate-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {isAr ? product.nameAr : product.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {isAr ? product.descriptionAr : product.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{isAr ? 'السعر' : 'Price'}</span>
                      <span className="font-black text-base text-slate-900 font-mono">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        inCart
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-white hover:opacity-90 shadow-sm'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                      style={{
                        backgroundColor: inCart ? '#059669' : (store.accentColor || '#4F46E5')
                      }}
                    >
                      {inCart ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{inCart.quantity} {isAr ? 'بالسلة' : 'in cart'}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isAr ? 'إضافة' : 'Add'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* ─── 4. INDEPENDENT STORE FOOTER ─── */}
      <footer className="bg-white border-t border-slate-200 mt-16 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Store Brand Info */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm"
                  style={{ backgroundColor: store.accentColor || '#4F46E5' }}
                >
                  {store.name.charAt(0)}
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  {isAr ? store.nameAr : store.name}
                </h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                {isAr ? store.descriptionAr : store.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-600 pt-1 font-mono">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{store.ownerEmail}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>+966 50 123 4567</span>
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2.5 text-xs text-slate-600">
              <h5 className="font-bold text-slate-900 text-sm">
                {isAr ? 'روابط المتجر' : 'Store Links'}
              </h5>
              <ul className="space-y-2">
                <li><a href="#products" className="hover:text-indigo-600 transition-colors">{isAr ? 'جميع المنتجات' : 'All Products'}</a></li>
                <li><button onClick={() => setIsTrackingModalOpen(true)} className="hover:text-indigo-600 transition-colors cursor-pointer">{isAr ? 'تتبع حالة الشحنة' : 'Track Order'}</button></li>
                <li><a href="#about" className="hover:text-indigo-600 transition-colors">{isAr ? 'من نحن' : 'About Us'}</a></li>
                <li><a href="#contact" className="hover:text-indigo-600 transition-colors">{isAr ? 'خدمة العملاء' : 'Customer Support'}</a></li>
              </ul>
            </div>

            {/* Security & Policies */}
            <div className="space-y-2.5 text-xs text-slate-600">
              <h5 className="font-bold text-slate-900 text-sm">
                {isAr ? 'السياسات والضمان' : 'Policies & Trust'}
              </h5>
              <ul className="space-y-2">
                <li><span className="hover:text-indigo-600">{isAr ? 'سياسة الاستبدال والاسترجاع' : 'Refund Policy'}</span></li>
                <li><span className="hover:text-indigo-600">{isAr ? 'سياسة الخصوصية وسرية البيانات' : 'Privacy Policy'}</span></li>
                <li><span className="hover:text-indigo-600">{isAr ? 'الشروط والأحكام' : 'Terms of Service'}</span></li>
                <li>
                  <span className="inline-block bg-slate-100 text-slate-700 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-200">
                    {isAr ? 'الرقم الضريبي: 30092837400003' : 'VAT: 30092837400003'}
                  </span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 {isAr ? store.nameAr : store.name}. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'متجر سحابي مستقل يعمل بنظام التجارة الإلكترونية' : 'Independent Cloud Storefront'}</span>
              </div>
              {onBackToPlatform && (
                <button
                  onClick={onBackToPlatform}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-extrabold flex items-center gap-1 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{isAr ? 'زيارة المنصة الرئيسية (AVANTO)' : 'Visit Main Platform'}</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </footer>

      {/* ─── FLOATING WHATSAPP CHAT BUTTON (Controlled by whatsappChat feature) ─── */}
      {isStoreFeatureActive('whatsappChat') && (
        <aside aria-label="WhatsApp Support" className="fixed bottom-6 start-6 z-40">
          <button
            onClick={() => {
              alert(isAr ? `بدء محادثة الدعم الفني عبر واتساب لمتجر ${store.nameAr}...` : `Starting WhatsApp chat for ${store.name}...`);
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white stroke-none" />
            <span>{isAr ? 'محادثة واتساب مباشرة' : 'WhatsApp Support'}</span>
          </button>
        </aside>
      )}

      {/* ─── 5. CART & CHECKOUT DRAWER ─── */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {isAr ? 'سلة المشتريات والدفع' : 'Shopping Cart & Checkout'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-700 text-sm">
                    {isAr ? 'سلة المشتريات فارغة' : 'Your cart is empty'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isAr ? 'تصفح منتجات المتجر وأضف ما يعجبك للسلة.' : 'Browse the catalog and add products.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Cart Items List */}
                  <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.product.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div className="flex-1">
                          <div className="font-bold text-slate-900">
                            {isAr ? item.product.nameAr : item.product.name}
                          </div>
                          <div className="text-slate-500 font-mono mt-0.5">
                            {formatPrice(item.product.price)} × {item.quantity}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, -1)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-slate-900 font-mono w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, 1)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Application (Controlled by discountCoupons feature) */}
                  {isStoreFeatureActive('discountCoupons') && (
                    <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder={isAr ? 'كود الخصم (مثال: WELCOME10)' : 'Discount code (WELCOME10)'}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-9 pe-3 py-2 text-xs font-mono uppercase text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
                        >
                          {isAr ? 'تطبيق' : 'Apply'}
                        </button>
                      </div>
                      {couponSuccess && <p className="text-[11px] text-emerald-600 font-bold">{couponSuccess}</p>}
                      {couponError && <p className="text-[11px] text-rose-600 font-bold">{couponError}</p>}
                    </form>
                  )}

                  {/* Customer Checkout Form */}
                  <form onSubmit={handleConfirmOrder} className="pt-3 border-t border-slate-100 space-y-3 text-xs">
                    <span className="font-bold text-slate-900 block text-xs">
                      {isAr ? 'بيانات الشحن والاستلام:' : 'Shipping Address:'}
                    </span>

                    <div>
                      <label className="text-slate-600 block mb-1 font-medium">{isAr ? 'اسم المستلم' : 'Recipient Name'}</label>
                      <input
                        type="text"
                        required
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-600 block mb-1 font-medium">{isAr ? 'رقم الجوال' : 'Mobile'}</label>
                        <input
                          type="text"
                          required
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 block mb-1 font-medium">{isAr ? 'المدينة' : 'City'}</label>
                        <input
                          type="text"
                          required
                          value={custCity}
                          onChange={(e) => setCustCity(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-600 block mb-1 font-medium">{isAr ? 'العنوان / الحي' : 'Street Address'}</label>
                      <input
                        type="text"
                        required
                        value={custAddress}
                        onChange={(e) => setCustAddress(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    {/* Payment Method Selector (Respects onlinePayments & cashOnDelivery features) */}
                    {/* Payment Method Selector (DZ COD & BaridiMob) */}
                    <div>
                      <label className="text-slate-700 block mb-1.5 font-bold">{isAr ? 'طريقة الدفع في الجزائر' : 'Payment Method'}</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPayment('cod')}
                          className={`p-2.5 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                            selectedPayment === 'cod'
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/15'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-extrabold">{isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</div>
                          <div className="text-[10px] text-emerald-600 font-normal">{isAr ? 'معاينة قبل الدفع' : 'Pay on arrival'}</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedPayment('baridimob')}
                          className={`p-2.5 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                            selectedPayment === 'baridimob'
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/15'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-extrabold">{isAr ? 'بريدي موب (CCP)' : 'BaridiMob'}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{isAr ? 'تحويل فوري RIP' : 'Instant transfer'}</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedPayment('cib')}
                          className={`p-2.5 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                            selectedPayment === 'cib'
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/15'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-extrabold">{isAr ? 'الذهبية / CIB' : 'Edahabia Card'}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{isAr ? 'بطاقة بنكية' : 'Bank card'}</div>
                        </button>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 font-mono">
                      <div className="flex justify-between">
                        <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                        <span>{formatPrice(rawCartTotal)}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>{isAr ? 'خصم الكوبون:' : 'Discount:'}</span>
                          <span>-{formatPrice(discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>{isAr ? 'الشحن والتوصيل:' : 'Shipping:'}</span>
                        <span>{isFreeShipping ? (isAr ? 'مجاني 🚚' : 'Free 🚚') : formatPrice(shippingCost)}</span>
                      </div>
                      {hasVatCalculation && taxAmount > 0 && (
                        <div className="flex justify-between text-slate-500">
                          <span>{isAr ? 'ضريبة القيمة المضافة (15%):' : 'VAT (15%):'}</span>
                          <span>{formatPrice(taxAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
                        <span>{isAr ? 'الإجمالي النهائي:' : 'Final Total:'}</span>
                        <span className="text-indigo-600">{formatPrice(finalTotal)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl font-bold text-white text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 transition-all active:scale-98"
                      style={{ backgroundColor: store.accentColor || '#4F46E5' }}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{isAr ? 'إتمام وتأكيد الطلب الآن 🛍️' : 'Place Order Now 🛍️'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
              {isAr ? 'دفع آمن ومشفر 256-bit عبر بوابات معتمدة' : '256-bit SSL encrypted secure checkout'}
            </div>

          </div>
        </div>
      )}

      {/* ─── 6. ORDER CONFIRMATION MODAL & INVOICE ─── */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                {isAr ? 'تم استلام وتأكيد الطلب بنجاح' : 'Order Confirmed'}
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                {isAr ? `شكراً لك، ${orderConfirmed.customerName}!` : `Thank you, ${orderConfirmed.customerName}!`}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isAr ? `تم تسجيل طلبك في متجر ${store.nameAr} برقم:` : `Your order in ${store.name} was placed:`}
              </p>
              <p className="font-mono font-bold text-indigo-600 text-sm mt-0.5">
                {orderConfirmed.orderNumber}
              </p>
            </div>

            {/* Invoice Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-start space-y-2.5">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">{isAr ? 'رقم التتبع السريع:' : 'Tracking Code:'}</span>
                <span className="font-mono font-bold text-slate-900">{orderConfirmed.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isAr ? 'المدينة والعنوان:' : 'Delivery Address:'}</span>
                <span className="font-semibold text-slate-800">{orderConfirmed.customerCity} - {orderConfirmed.customerAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isAr ? 'طريقة الدفع:' : 'Payment:'}</span>
                <span className="text-slate-800 font-semibold">{orderConfirmed.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                <span className="font-bold text-slate-900">{isAr ? 'المبلغ الإجمالي:' : 'Total Amount:'}</span>
                <span className="font-mono font-black text-emerald-600">{formatPrice(orderConfirmed.total)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isAr ? 'طباعة الفاتورة' : 'Print Invoice'}</span>
              </button>

              <button
                onClick={() => {
                  setOrderConfirmed(null);
                  setIsCheckoutOpen(false);
                }}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-sm"
              >
                {isAr ? 'متابعة التسوق' : 'Continue Shopping'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 7. QUICK VIEW PRODUCT MODAL ─── */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 end-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center border border-slate-200">
              <ShoppingBag className="w-14 h-14" style={{ color: store.accentColor || '#4F46E5' }} />
              <span className="text-xs font-mono text-slate-500 mt-2 font-bold">{quickViewProduct.category}</span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-slate-900">
                  {isAr ? quickViewProduct.nameAr : quickViewProduct.name}
                </h3>
                <span className="font-black text-xl text-slate-900 font-mono">
                  {formatPrice(quickViewProduct.price)}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {isAr ? quickViewProduct.descriptionAr : quickViewProduct.description}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between">
              <span className="text-slate-500">{isAr ? 'الكمية المتوفرة بالمخزون:' : 'In stock:'}</span>
              <span className="font-bold text-emerald-700">{quickViewProduct.stock} {isAr ? 'قطعة' : 'units'}</span>
            </div>

            <button
              onClick={() => {
                handleAddToCart(quickViewProduct);
                setQuickViewProduct(null);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-3.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              style={{ backgroundColor: store.accentColor || '#4F46E5' }}
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة للسلة والذهاب للدفع 🛍️' : 'Add to Cart & Checkout 🛍️'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── 8. ORDER TRACKING MODAL ─── */}
      {isTrackingModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200 text-start">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                <h4 className="font-extrabold text-slate-900 text-base">
                  {isAr ? 'تتبع شحنة الطلب' : 'Track Your Order'}
                </h4>
              </div>
              <button
                onClick={() => {
                  setIsTrackingModalOpen(false);
                  setTrackedOrderResult(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              {isAr ? 'أدخل رقم الطلب أو رقم التتبع المرسل إليك لمعرفة حالة التوصيل الحالية.' : 'Enter your order ID or tracking number.'}
            </p>

            <form onSubmit={handleTrackOrder} className="space-y-3">
              <input
                type="text"
                required
                value={trackingNumberInput}
                onChange={(e) => setTrackingNumberInput(e.target.value)}
                placeholder="e.g. ORD-10294 or TRK-A7X9"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                {isAr ? 'استعلام عن حالة الطلب' : 'Check Status'}
              </button>
            </form>

            {trackedOrderResult && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'تم العثور على الشحنة' : 'Shipment Located'}</span>
                </div>
                <p className="text-[11px] leading-relaxed">{trackedOrderResult}</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );

  // If this is a standalone independent page (not a modal popup):
  if (isStandalonePage) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        
        {/* Top Independent Simulator Bar */}
        {showSimulatorBar ? (
          <aside aria-label="Independent Store Simulator Bar" className="sticky top-0 z-50 bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-slate-200">
                {isAr ? 'وضع المتجر المستقل (مفصول عن المنصة):' : 'Independent Store Mode (Separated):'}
              </span>
              <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg font-mono text-[11px] text-emerald-300">
                {simulatorUrlType === 'standard' ? <Link2 className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-emerald-400" />}
                <span className="max-w-xs sm:max-w-sm truncate select-all">
                  {simulatorUrlType === 'standard' ? getStandardStoreUrl() : `https://${storeSubdomain}`}
                </span>
              </div>

              {/* Format Toggle Switch */}
              <div className="inline-flex rounded-lg border border-slate-700 bg-slate-800 p-0.5 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setSimulatorUrlType('standard')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    simulatorUrlType === 'standard'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title={isAr ? 'عرض ونسخ الرابط العادي الذي يعمل في كافة المتصفحات' : 'Standard direct URL'}
                >
                  {isAr ? 'رابط عادي ⚡' : 'Normal Link ⚡'}
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatorUrlType('subdomain')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    simulatorUrlType === 'subdomain'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title={isAr ? 'عرض النطاق الفرعي التجاري' : 'Subdomain'}
                >
                  {isAr ? 'نطاق فرعي' : 'Subdomain'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
                title={isAr ? 'نسخ الرابط المعروض للعملاء ولصقه في أي متصفح' : 'Copy link'}
              >
                <Copy className="w-3 h-3" />
                <span>
                  {copiedLink 
                    ? (isAr ? 'تم نسخ الرابط ✓' : 'Copied ✓') 
                    : (simulatorUrlType === 'standard' 
                        ? (isAr ? 'نسخ الرابط العادي' : 'Copy Normal Link') 
                        : (isAr ? 'نسخ الرابط' : 'Copy Link'))}
                </span>
              </button>

              {onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3" />
                  <span>{isAr ? 'لوحة تحكم المتجر (Admin)' : 'Store Dashboard'}</span>
                </button>
              )}

              {onBackToPlatform && (
                <button
                  onClick={onBackToPlatform}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-sm transition-all cursor-pointer ring-1 ring-indigo-400"
                  title={isAr ? 'العودة لواجهة المنصة الرئيسية (AVANTO)' : 'Go to main platform'}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{isAr ? '🏢 المنصة الرئيسية (AVANTO)' : 'Main Platform 🏢'}</span>
                </button>
              )}

              <button
                onClick={() => setShowSimulatorBar(false)}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 text-[11px] cursor-pointer"
                title={isAr ? 'إخفاء هذا الشريط لتجربة المتجر كما يراه المشتري تماماً' : 'Hide bar for pure customer view'}
              >
                {isAr ? 'إخفاء الشريط' : 'Hide Bar'}
              </button>
            </div>
          </aside>
        ) : (
          <button
            onClick={() => setShowSimulatorBar(true)}
            className="fixed top-2 end-2 z-50 bg-slate-900/90 hover:bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-slate-700 cursor-pointer flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            <span>{isAr ? 'إظهار شريط المتجر المستقل' : 'Show Store Bar'}</span>
          </button>
        )}

        {/* The Pure Storefront */}
        <div className="flex-1">
          {renderStoreContent()}
        </div>

      </div>
    );
  }

  // Otherwise, render as a simulated browser window dialog
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white border border-slate-300 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[94vh]">
        
        {/* Top Browser URL Bar */}
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
          </div>

          <div className="flex-1 max-w-md mx-auto bg-white border border-slate-300 rounded-lg px-3 py-1 flex items-center justify-center gap-2 text-xs font-mono text-slate-700 shadow-2xs truncate">
            <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-slate-400">https://</span>
            <span className="text-slate-900 font-bold">{storeSubdomain}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedLink ? (isAr ? 'تم النسخ ✓' : 'Copied ✓') : (isAr ? 'نسخ الرابط' : 'Copy')}</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                title={isAr ? 'إغلاق المعاينة' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Store Inside */}
        <div className="flex-1 overflow-y-auto">
          {renderStoreContent()}
        </div>

      </div>
    </div>
  );
};
