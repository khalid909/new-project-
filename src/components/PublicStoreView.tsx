import React, { useState } from 'react';
import { Store, Product, Order, Language, Currency, StoreFeatureItem } from '../types';
import { CURRENCY_RATES } from '../data/initialData';
import { 
  ShoppingBag, CheckCircle2, ArrowRight, ArrowLeft, 
  Lock, X, ShieldCheck, Truck, Star, Check, Plus, Minus, Printer, 
  CreditCard, Search, Tag, Copy, ExternalLink, Eye, RotateCcw, 
  ChevronRight, Phone, Mail, HelpCircle, Package, ArrowUpRight, Globe,
  MessageCircle, AlertTriangle, Link2, Share2,
  Edit3, Trash2, Power, Sliders, Sparkles, Layers, CheckSquare, Settings,
  Camera, Palette, Image as ImageIcon,
  Play, Bell, Send, Heart, Monitor, Headphones, Home, Smartphone
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
  initialMerchantMode = !isStandalonePage
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

  // Appearance & Theme State (Color, Name, Slogan)
  const [isAppearanceModalOpen, setIsAppearanceModalOpen] = useState<boolean>(false);
  const [appearanceColor, setAppearanceColor] = useState<string>(store.accentColor || '#059669');
  const [appearanceNameAr, setAppearanceNameAr] = useState<string>(store.nameAr);
  const [appearanceSloganAr, setAppearanceSloganAr] = useState<string>(store.sloganAr);

  const handleOpenAppearanceModal = () => {
    setAppearanceColor(store.accentColor || '#059669');
    setAppearanceNameAr(store.nameAr);
    setAppearanceSloganAr(store.sloganAr);
    setIsAppearanceModalOpen(true);
  };

  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateStore) {
      onUpdateStore({
        accentColor: appearanceColor,
        nameAr: appearanceNameAr.trim() || store.nameAr,
        name: appearanceNameAr.trim() || store.name,
        sloganAr: appearanceSloganAr.trim() || store.sloganAr
      });
    }
    const appFeat = getFeature('storeAppearance');
    if (appFeat && onUpdateStoreFeature) {
      onUpdateStoreFeature({
        ...appFeat,
        customValue: appearanceColor
      });
    }
    setIsAppearanceModalOpen(false);
    showToast(isAr ? 'تم تحديث هوية ومظهر المتجر والألوان بنجاح ✓' : 'Store appearance updated successfully ✓');
  };

  // 3-Button Control Bar Renderer for Sections
  const renderSectionControlStrip = (
    featureId: string,
    defaultNameAr: string,
    defaultDescAr: string,
    defaultCustomVal: string = ''
  ) => {
    if (!isMerchantMode) return null;
    const feat = getFeature(featureId) || {
      id: featureId,
      name: defaultNameAr,
      nameAr: defaultNameAr,
      description: defaultDescAr,
      descriptionAr: defaultDescAr,
      category: 'storefront' as const,
      isEnabled: true,
      isRemoved: false,
      customValue: defaultCustomVal
    };

    const isEnabled = feat.isEnabled && !feat.isRemoved;

    return (
      <div className="bg-slate-900 text-white px-3 sm:px-4 py-2 border-y-2 border-emerald-500/40 flex flex-wrap items-center justify-between gap-2 shadow-md relative z-30 transition-all select-none">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          <span className="text-xs font-black text-slate-100 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>{feat.nameAr || defaultNameAr}</span>
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isEnabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
          }`}>
            {isEnabled ? (isAr ? 'مُفعّل بالمتجر' : 'Active') : (isAr ? 'معطّل مؤقتاً' : 'Disabled')}
          </span>
        </div>

        {/* The 3 Core Control Buttons: Toggle | Edit | Delete */}
        <div className="flex items-center gap-1.5">
          {/* Button 1: Toggle (الزر الأول للتفعيل أو التعطيل) */}
          <button
            type="button"
            onClick={() => handleToggleFeature(featureId)}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
              isEnabled 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
            title={isEnabled ? (isAr ? 'انقر لإلغاء تفعيل هذا القسم' : 'Click to deactivate') : (isAr ? 'انقر لتفعيل هذا القسم' : 'Click to activate')}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isEnabled ? (isAr ? 'مُفعّل ✓' : 'Active') : (isAr ? 'معطّل ⏸️' : 'Off')}</span>
          </button>

          {/* Button 2: Edit Button (وامام هذا الزر زر آخر للتعديل) */}
          <button
            type="button"
            onClick={() => handleOpenEditModal(feat)}
            className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs"
            title={isAr ? 'تعديل نصوص وبيانات ومظهر هذا القسم' : 'Edit section content'}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isAr ? 'تعديل ✏️' : 'Edit'}</span>
          </button>

          {/* Button 3: Delete Button (وزر للحذف) */}
          <button
            type="button"
            onClick={() => handleRemoveFeature(featureId)}
            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs"
            title={isAr ? 'حذف هذا القسم من الصفحة الرئيسية (يمكن استعادته في أي وقت)' : 'Delete section from homepage'}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'حذف 🗑️' : 'Delete'}</span>
          </button>
        </div>
      </div>
    );
  };

  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [cart, setCart] = useState<{ product: Product; quantity: number; selectedColor?: string }[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = useState<Order | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [selectedColorVariant, setSelectedColorVariant] = useState<string | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState<boolean>(false);
  const [trackingNumberInput, setTrackingNumberInput] = useState<string>('');
  const [trackedOrderResult, setTrackedOrderResult] = useState<string | null>(null);
  
  // Maintenance Mode admin bypass state
  const [maintenanceBypassed, setMaintenanceBypassed] = useState<boolean>(false);
  
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

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    const initialImg = (product.images && product.images.length > 0) ? product.images[0] : (product.imageUrl || null);
    setSelectedGalleryImage(initialImg);
    if (product.colors && product.colors.length > 0) {
      const first = product.colors[0];
      setSelectedColorVariant(typeof first === 'string' ? first : (isAr ? first.nameAr || first.name : first.name));
    } else {
      setSelectedColorVariant(null);
    }
  };

  const handleAddToCart = (product: Product, chosenColor?: string) => {
    let colorToUse = chosenColor;
    if (!colorToUse && product.colors && product.colors.length > 0) {
      const first = product.colors[0];
      colorToUse = typeof first === 'string' ? first : (isAr ? first.nameAr || first.name : first.name);
    }

    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id && i.selectedColor === colorToUse);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [...prev, { product, quantity: 1, selectedColor: colorToUse }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number, color?: string) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId && item.selectedColor === color) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: Product; quantity: number; selectedColor?: string }[];
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
        id: `item_${c.product.id}_${c.selectedColor || 'default'}`,
        product: c.product,
        quantity: c.quantity,
        selectedColor: c.selectedColor
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
  const renderStoreContent = () => {
    const isMaintenanceActive = store.settings?.maintenanceMode?.isEnabled || false;

    // Full Maintenance Screen for regular shoppers
    if (isMaintenanceActive && !maintenanceBypassed && !isMerchantMode) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden" dir="rtl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-950 to-slate-950 pointer-events-none" />
          
          {/* Top Brand */}
          <div className="max-w-4xl mx-auto w-full flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg"
                style={{ backgroundColor: store.accentColor || '#059669' }}
              >
                {(store.nameAr || store.name).charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-black text-white">{store.nameAr || store.name}</h1>
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>وضع التحديث والصيانة المؤقتة</span>
                </span>
              </div>
            </div>

            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              >
                لوحة التحكم ⚙️
              </button>
            )}
          </div>

          {/* Center Card */}
          <div className="max-w-xl mx-auto w-full my-auto py-12 text-center space-y-6 z-10">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/10">
              <AlertTriangle className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {isAr ? 'المتجر قيد الصيانة والتحديث المؤقت' : 'Store is Under Scheduled Maintenance'}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                {store.settings?.maintenanceMode?.message || (isAr ? 'نعمل حالياً على تحديث المنتجات وتجهيز عروض وتخفيضات مميزة لخدمتكم بشكل أفضل. سنعاود استقبال طلباتكم قريباً جداً!' : 'We are updating our store to serve you better. We will be back soon!')}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono flex items-center gap-2">
                <span className="text-amber-400">🕒</span>
                <span>{store.settings?.maintenanceMode?.estimatedReturn ? `العودة المتوقعة: ${store.settings.maintenanceMode.estimatedReturn}` : (isAr ? 'العودة المتوقعة: خلال ساعات قليلة' : 'Expected: Soon')}</span>
              </div>

              {(store.settings?.maintenanceMode?.contactPhone || store.ownerPhone) && (
                <a
                  href={`https://wa.me/${(store.settings?.maintenanceMode?.contactPhone || store.ownerPhone || '').replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAr ? `تواصل واتساب: ${store.settings?.maintenanceMode?.contactPhone || store.ownerPhone}` : `WhatsApp: ${store.settings?.maintenanceMode?.contactPhone || store.ownerPhone}`}</span>
                </a>
              )}
            </div>

            {/* Admin Bypass Button */}
            <div className="pt-6 border-t border-slate-800/80">
              <button
                onClick={() => setMaintenanceBypassed(true)}
                className="text-xs text-slate-400 hover:text-white underline font-medium cursor-pointer"
              >
                {isAr ? 'أنا مدير/صاحب هذا المتجر (تخطي للمعاينة والإدارة 🔓)' : 'Store Admin Bypass (Preview Mode 🔓)'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 z-10 pt-8">
            © 2026 {store.nameAr || store.name}. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </div>
        </div>
      );
    }

    // Active currencies configured by merchant
    const enabledCurrencies = (store.settings?.availableCurrencies && store.settings.availableCurrencies.length > 0)
      ? store.settings.availableCurrencies.filter(c => c.isEnabled)
      : [
          { code: 'DZD' as Currency, nameAr: 'دينار جزائري (DZD)', symbol: 'د.ج', isEnabled: true },
          { code: 'EUR' as Currency, nameAr: 'يورو (EUR)', symbol: '€', isEnabled: true },
          { code: 'USD' as Currency, nameAr: 'دولار أمريكي (USD)', symbol: '$', isEnabled: true },
          { code: 'SAR' as Currency, nameAr: 'ريال سعودي (SAR)', symbol: 'ر.س', isEnabled: true }
        ];

    const currentThemePreset = store.settings?.themePreset || 'lumora_dark';
    const isDarkTheme = currentThemePreset === 'lumora_dark';

    return (
      <div className={`min-h-screen flex flex-col ${
        isDarkTheme 
          ? 'bg-[#0B132B] text-white selection:bg-purple-500 selection:text-white' 
          : 'bg-[#F8FAFC] text-slate-800 selection:bg-indigo-100 selection:text-indigo-900'
      }`}>
      
      {/* ─── Top Merchant 3-in-1 Live Control Hub (Bar for Seller) ─── */}
      {isMerchantMode && (
        <aside aria-label="Merchant 3-in-1 Live Control Hub" className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white border-b-2 border-emerald-500/50 p-3 sm:px-6 shadow-xl relative z-40">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Left: Mode Title & Info */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-inner">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-sm">
                    {isAr ? 'نظام التحكم المباشر بالمتجر (3 أزرار)' : 'Storefront 3-in-1 Live Control'}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                    {isAr ? 'زر تفعيل • تعديل • حذف' : 'Toggle • Edit • Delete'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 hidden sm:block">
                  {isAr ? 'تحكّم في كل قسم بمفرده: زر التفعيل/التعطيل، وأمامه زر التعديل ✏️ وزر الحذف 🗑️' : 'Control every section directly: Toggle, Edit, and Delete.'}
                </p>
              </div>
            </div>

            {/* Right: Appearance Button, Trash/Restore Dropdown, Reset, and Customer Preview Toggle */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Store Appearance 3-Button Controller */}
              <button
                type="button"
                onClick={handleOpenAppearanceModal}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-emerald-900/30 border border-emerald-400/40"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isAr ? 'مظهر وهوية المتجر والألوان 🎨' : 'Store Theme & Colors 🎨'}</span>
              </button>

              {/* Removed Sections Restorer Dropdown */}
              {removedFeaturesCount > 0 && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowRestoreDropdown(!showRestoreDropdown)}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs border border-rose-400/50"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{isAr ? `المحذوفات (${removedFeaturesCount})` : `Trash (${removedFeaturesCount})`}</span>
                  </button>

                  {showRestoreDropdown && (
                    <div className="absolute end-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 space-y-2 text-start">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-bold text-slate-200 text-xs">{isAr ? 'الأقسام المحذوفة' : 'Removed Sections'}</span>
                        <button
                          onClick={() => setShowRestoreDropdown(false)}
                          className="text-slate-400 hover:text-white text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/60">
                        {removedFeatures.map((rf) => (
                          <div key={rf.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                            <span className="text-slate-300 truncate font-medium">{rf.nameAr || rf.name}</span>
                            <button
                              type="button"
                              onClick={() => {
                                handleRestoreFeature(rf.id);
                                setShowRestoreDropdown(false);
                              }}
                              className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shrink-0 cursor-pointer"
                            >
                              {isAr ? 'استعادة ↩️' : 'Restore'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Enable All Features */}
              {onEnableAllStoreFeatures && (
                <button
                  type="button"
                  onClick={() => {
                    onEnableAllStoreFeatures();
                    showToast(isAr ? 'تم تفعيل واستعادة كافة أقسام المتجر بنجاح ⚡' : 'All sections enabled ⚡');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-700"
                  title={isAr ? 'تفعيل جميع الأقسام دفعة واحدة' : 'Enable all sections'}
                >
                  <span>{isAr ? 'تفعيل الكل ⚡' : 'Enable All'}</span>
                </button>
              )}

              {/* Store Operations Dashboard Button */}
              {onBackToDashboard && (
                <button
                  type="button"
                  onClick={onBackToDashboard}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-all border border-slate-700 shadow-xs"
                  title={isAr ? 'لوحة تحكم المتجر (إدارة الطلبات والمنتجات والشحن)' : 'Store Operations Dashboard'}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isAr ? 'لوحة التحكم ⚙️' : 'Dashboard ⚙️'}</span>
                </button>
              )}

              {/* Mode Switcher: Switch to Customer View */}
              <button
                type="button"
                onClick={() => {
                  setIsMerchantMode(false);
                  showToast(isAr ? 'تم الانتقال لمعاينة المتجر كما يراه المشتري تماماً 👁️' : 'Switched to buyer view');
                }}
                className="px-3 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm transition-all hover:scale-102"
                title={isAr ? 'إخفاء أزرار التحكم لتجربة مظهر المتجر العادي' : 'Preview as normal customer'}
              >
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isAr ? 'معاينة كزبون 👁️' : 'Buyer Preview'}</span>
              </button>

            </div>

          </div>
        </aside>
      )}

      {/* Floating Button to re-enable Merchant Mode when in Buyer Preview */}
      {!isMerchantMode && (
        <button
          type="button"
          onClick={() => {
            setIsMerchantMode(true);
            showToast(isAr ? 'تم تفعيل وضع تحكم التاجر المباشر (3 أزرار) 🛠️' : 'Merchant control mode enabled');
          }}
          className="fixed bottom-6 end-6 z-50 px-4 py-2.5 rounded-full bg-slate-900 text-white border-2 border-emerald-400 font-extrabold text-xs flex items-center gap-2 shadow-2xl hover:scale-105 transition-all cursor-pointer group"
        >
          <Sliders className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
          <span>{isAr ? 'وضع تحكم التاجر (3 أزرار) 🛠️' : 'Merchant Controls 🛠️'}</span>
        </button>
      )}

      {/* Lumora 3-Column Layout Matching Reference Screenshot */}
      {isDarkTheme ? (
        <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
          
          {/* 1. Left Dark Navigation Sidebar */}
          <aside className="w-full lg:w-64 bg-[#121B2B] text-slate-300 border-e border-slate-800 flex flex-col shrink-0 p-5 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-purple-900/40">
                {store.name.charAt(0) || 'L'}
              </div>
              <div>
                <span className="font-black text-white text-lg tracking-wider">{store.nameAr || store.name || 'Lumora'}</span>
                <span className="block text-[10px] text-purple-400 font-bold">AI E-Commerce Pro</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1 text-xs font-bold">
              {[
                { name: 'الرئيسية', icon: <Home className="w-4 h-4" />, active: true },
                { name: 'المنتجات', icon: <Tag className="w-4 h-4" /> },
                { name: 'الأقسام', icon: <Layers className="w-4 h-4" /> },
                { name: 'العروض الخاصة', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
                { name: 'الذكاء الاصطناعي', icon: <Sparkles className="w-4 h-4 text-purple-400" />, badge: 'جديد' },
                { name: 'المفضلة', icon: <Heart className="w-4 h-4" /> },
                { name: 'سلة التسوق', icon: <ShoppingBag className="w-4 h-4" />, count: totalItemsCount },
                { name: 'طلباتي', icon: <Package className="w-4 h-4" /> },
                { name: 'المساعدة', icon: <HelpCircle className="w-4 h-4" /> },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.name === 'سلة التسوق') setIsCheckoutOpen(true);
                    if (item.name === 'طلباتي') setIsTrackingModalOpen(true);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    item.active 
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' 
                      : 'text-slate-400 hover:text-white hover:bg-[#1A263C]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white text-[9px] font-black">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-black flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Special Features Section */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2">مميزات خاصة</span>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-800/50">
                  <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                  <span>تجربة افتراضية للمنتجات</span>
                </div>
                <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-800/50">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>توصيل سريع 58 ولاية</span>
                </div>
                <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-800/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>دفع آمن ومحمي</span>
                </div>
                <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-800/50">
                  <Headphones className="w-3.5 h-3.5 text-amber-400" />
                  <span>دعم على مدار الساعة</span>
                </div>
              </div>
            </div>
          </aside>

          {/* 2. Center Main Content & 3. Right Widgets Sidebar Grid */}
          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 min-w-0">
            
            {/* Center Main Store Content (8 cols) */}
            <div className="lg:col-span-8 flex flex-col min-w-0 border-e border-slate-800">
              
              {/* Top Header with Search & User Profile */}
              <header className="sticky top-0 z-30 bg-[#121B2B]/95 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 max-w-md relative">
                  <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن أي منتج، أو اكتب ما تحتاجه بالذكاء الاصطناعي..."
                    className="w-full bg-[#1A263C] border border-slate-700/80 rounded-xl ps-10 pe-16 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                  />
                  <span className="absolute top-1/2 -translate-y-1/2 end-3 px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                    Ctrl + K
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-xl bg-[#1A263C] border border-slate-700 text-slate-300 hover:text-white relative cursor-pointer">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-purple-500" />
                  </button>
                  <button className="p-2 rounded-xl bg-[#1A263C] border border-slate-700 text-slate-300 hover:text-white cursor-pointer">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-xl bg-[#1A263C] border border-slate-700 text-slate-300 hover:text-white cursor-pointer">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  
                  {/* User profile */}
                  <div className="flex items-center gap-2.5 ps-2 border-s border-slate-700">
                    <img
                      src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                      alt="User"
                      className="w-9 h-9 rounded-xl object-cover border border-purple-500/50"
                    />
                    <div className="hidden sm:block text-start">
                      <span className="text-[10px] text-slate-400 block">أهلاً بك</span>
                      <span className="font-black text-white text-xs">{currentUser?.name || 'أحمد'}</span>
                    </div>
                  </div>
                </div>
              </header>

              {/* Hero Banner with Neon Glow */}
              <section className="p-6">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-[#121B2B] border border-purple-500/30 p-8 shadow-2xl">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent pointer-events-none" />
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>تقنية الذكاء الاصطناعي في التسوق</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                        مستقبلك بين يديك اكتشف أحدث المنتجات مع تقنية الذكاء الاصطناعي
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        تسوق بذكاء مع لومورا، حيث تلتقي التكنولوجيا بالأناقة لتجربة تسوق فريدة ومخصصة لك.
                      </p>
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => setIsCheckoutOpen(true)}
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 cursor-pointer"
                        >
                          تسوق الآن 🛍️
                        </button>
                        <button className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 cursor-pointer">
                          <Play className="w-3.5 h-3.5 text-purple-400" />
                          <span>شاهد الفيديو</span>
                        </button>
                      </div>
                    </div>
                    <div className="lg:col-span-5 hidden lg:flex justify-center">
                      <div className="relative w-48 h-48 rounded-full bg-gradient-to-tr from-purple-600/30 to-indigo-600/30 flex items-center justify-center animate-pulse">
                        <Smartphone className="w-24 h-24 text-purple-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Categories Bar */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-extrabold text-white text-sm">التصنيفات والأقسام</span>
                  <button className="text-xs text-purple-400 font-bold hover:underline cursor-pointer">عرض الكل ←</button>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-2">
                  {[
                    { name: 'الكل', icon: '🛍️' },
                    { name: 'الأزياء', icon: '👗' },
                    { name: 'الهواتف', icon: '📱' },
                    { name: 'الإلكترونيات', icon: '💻' },
                    { name: 'المنزل', icon: '🏠' },
                    { name: 'الجمال', icon: '💄' },
                    { name: 'الرياضة', icon: '⚽' },
                    { name: 'الكتب', icon: '📚' },
                    { name: 'الألعاب', icon: '🎮' },
                  ].map((cat, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedCategory(cat.name === 'الكل' ? 'all' : cat.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer min-w-[76px] ${
                        selectedCategory === (cat.name === 'الكل' ? 'all' : cat.name)
                          ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20'
                          : 'bg-[#172132] text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-xl mb-1">{cat.icon}</span>
                      <span className="text-[11px] font-bold">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Grid ("منتجات مميزة") */}
              <div className="px-6 pb-12 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h3 className="font-black text-white text-base">منتجات مميزة</h3>
                  </div>
                  <span className="text-xs text-slate-400">{filteredProducts.length} منتج متاح</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((prod) => (
                    <div key={prod.id} className="bg-[#172132] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 group hover:border-purple-500/50 transition-all">
                      <div className="relative h-44 rounded-xl bg-slate-900 overflow-hidden cursor-pointer" onClick={() => handleOpenQuickView(prod)}>
                        <img src={prod.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80'} alt={prod.nameAr} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute top-2 start-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-600 text-white">الأكثر مبيعاً</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold mb-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>4.9 (128)</span>
                        </div>
                        <h4 className="font-black text-white text-xs line-clamp-1 cursor-pointer" onClick={() => handleOpenQuickView(prod)}>{prod.nameAr}</h4>
                        <span className="font-mono font-black text-sm text-purple-300 mt-1 block">{formatPrice(prod.price)}</span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(prod)}
                        className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                      >
                        إضافة للسلة 🛍️
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <footer className="mt-auto bg-[#121B2B] border-t border-slate-800 p-6 text-center text-xs text-slate-400">
                <p>© 2026 {store.nameAr || store.name}. جميع الحقوق محفوظة.</p>
              </footer>
            </div>

            {/* Right Sidebar Widgets (4 cols): AI Assistant & Order Tracker */}
            <div className="lg:col-span-4 bg-[#121B2B] p-5 space-y-6 flex flex-col">
              
              {/* 1. AI Assistant Widget */}
              <div className="p-5 rounded-3xl bg-[#172132] border border-purple-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-xs">المساعد الذكي</h4>
                      <span className="text-[10px] text-purple-400">اسألني عن أي منتج أو توصيات</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white text-[9px] font-black">جديد</span>
                </div>

                <div className="p-3 rounded-2xl bg-[#0F172A] border border-slate-800 text-xs text-slate-300">
                  ما هي أفضل سماعات لعشاق الألعاب مع إلغاء الضوضاء؟
                </div>

                {/* Recommended Product Box */}
                <div className="p-3 rounded-2xl bg-[#121B2B] border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80" alt="Sony" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-white text-xs truncate">Sony WH-1000XM5</h5>
                    <span className="text-[10px] text-amber-400 font-bold">⭐ 4.8 (12,450)</span>
                    <span className="block font-mono font-black text-purple-300 text-xs">$349</span>
                  </div>
                  <button onClick={() => setIsCheckoutOpen(true)} className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-[11px] font-black cursor-pointer">
                    شراء
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="اكتب سؤالك هنا..."
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl ps-3 pe-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <button className="absolute top-1/2 -translate-y-1/2 end-2 p-1.5 rounded-lg bg-purple-600 text-white cursor-pointer">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 2. Order Tracker Widget ("تتبع طلبك") */}
              <div className="p-5 rounded-3xl bg-[#172132] border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-black text-white text-xs flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span>تتبع طلبك</span>
                  </h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1 font-bold">رقم الطلب</label>
                    <input
                      type="text"
                      value={trackingNumberInput}
                      onChange={(e) => setTrackingNumberInput(e.target.value)}
                      placeholder="أدخل رقم الطلب..."
                      className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <button
                    onClick={handleTrackOrder}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md cursor-pointer"
                  >
                    تتبع الطلب 🚀
                  </button>

                  {/* Steps visual */}
                  <div className="pt-2 flex items-center justify-between text-center text-[10px] text-slate-400">
                    <div className="flex flex-col items-center gap-1">
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">✓</span>
                      <span>تم التأكيد</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-purple-600 mx-1" />
                    <div className="flex flex-col items-center gap-1">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold">2</span>
                      <span>في الطريق</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-slate-800 mx-1" />
                    <div className="flex flex-col items-center gap-1">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold">3</span>
                      <span>تم التوصيل</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* Standard Light Theme fallback */
        <div className="flex-1 flex flex-col">
          ...
        </div>
      )}


      {/* Floating Button to re-enable Merchant Mode when in Buyer Preview */}
      {!isMerchantMode && (
        <button
          type="button"
          onClick={() => {
            setIsMerchantMode(true);
            showToast(isAr ? 'تم تفعيل وضع تحكم التاجر المباشر (3 أزرار) 🛠️' : 'Merchant control mode enabled');
          }}
          className="fixed bottom-6 end-6 z-50 px-4 py-2.5 rounded-full bg-slate-900 text-white border-2 border-emerald-400 font-extrabold text-xs flex items-center gap-2 shadow-2xl hover:scale-105 transition-all cursor-pointer group"
        >
          <Sliders className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
          <span>{isAr ? 'وضع تحكم التاجر (3 أزرار) 🛠️' : 'Merchant Controls 🛠️'}</span>
        </button>
      )}
      
      {/* Maintenance Mode Banner (Controlled by maintenanceMode setting or feature) */}
      {(isMaintenanceActive || isStoreFeatureActive('maintenanceMode')) && (
        <div className="bg-amber-400 text-slate-950 font-bold px-4 py-2.5 text-xs text-center border-b border-amber-500 shadow-xs flex flex-wrap items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0" />
          <span>
            {isAr
              ? '⚠️ المتجر في وضع الصيانة والتحديث المؤقت حالياً (الزبائن العاديون يرون صفحة الصيانة). يمكنك الاستمرار بالتصفح والمعاينة كمدير.'
              : '⚠️ Store is in maintenance mode (regular visitors see maintenance screen). Viewing in admin preview mode.'}
          </span>
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="ms-2 px-2.5 py-0.5 rounded-lg bg-slate-950 text-amber-300 font-bold text-[11px] hover:bg-slate-900 cursor-pointer"
            >
              لوحة التحكم ⚙️
            </button>
          )}
        </div>
      )}

      {/* Custom Promotional Banner from store.settings.bannerConfig */}
      {store.settings?.bannerConfig?.isEnabled && !store.settings?.bannerConfig?.isRemoved && (
        <aside
          aria-label="Store Promotional Banner"
          className="py-2.5 px-4 text-center font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          style={{
            backgroundColor: store.settings.bannerConfig.bgColor || '#0F172A',
            color: store.settings.bannerConfig.textColor || '#FFFFFF'
          }}
        >
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
          <span>{store.settings.bannerConfig.text || (isAr ? '🔥 تخفيضات كبرى لفترة محدودة على كافة المنتجات!' : '🔥 Special offers!')}</span>
          {store.settings.bannerConfig.link && (
            <a
              href={store.settings.bannerConfig.link}
              className="ms-2 underline opacity-95 hover:opacity-100 flex items-center gap-1 font-bold"
            >
              <span>{isAr ? 'تسوق الآن' : 'Shop Now'}</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </a>
          )}
        </aside>
      )}

      {/* ─── 1. INDEPENDENT STORE HEADER ─── */}
      {renderSectionControlStrip('topAnnouncement', 'شريط الإعلانات الترويجي العلوي', 'شريط علوي بارز للإعلان عن العروض الحصرية وشحن الـ 58 ولاية', '🚚 توصيل سريع لـ 58 ولاية جزائرية + الدفع عند الاستلام!')}
      
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b shadow-2xs ${
        isDarkTheme ? 'bg-[#172132]/95 border-slate-800 text-white' : 'bg-white/95 border-slate-200/90 text-slate-900'
      }`}>
        
        {/* Top Mini Announcement Bar (Controlled by topAnnouncement feature) */}
        {isStoreFeatureActive('topAnnouncement') && (
          <div 
            className="text-white text-[11px] font-bold py-1.5 px-4 text-center transition-colors"
            style={{ backgroundColor: store.accentColor || '#059669' }}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <span className="hidden sm:inline">
                {isAr ? '✨ متجر مستقل معتمد - شحن سريع وضمان استرجاع' : '✨ Official Independent Store - Fast Shipping & Returns'}
              </span>
              <span className="mx-auto sm:mx-0">
                {isStoreFeatureActive('shippingThreshold') ? (
                  isAr
                    ? `🚚 شحن مجاني لكافة الطلبات فوق ${store.settings.freeShippingThreshold || 300} د.ج!`
                    : `🚚 Free shipping on orders over ${store.settings.freeShippingThreshold || 300} DZD!`
                ) : (
                  isAr ? '🚚 توصيل لكافة الولايات' : '🚚 Fast shipping available'
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

        {/* ─── Header Section Controls ─── */}
        {renderSectionControlStrip('storeHeader', 'رأس الصفحة وشعار واسم المتجر', 'شعار المتجر، الاسم التجاري، وأزرار السلة والبحث', 'متجر مستقل معتمد - تشغيل مباشر')}

        {/* Main Store Navbar */}
        {isStoreFeatureActive('storeHeader') && (
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
              
              {/* Currency Selector for buyer (Controlled by buyerCurrency feature & merchant settings) */}
              {isStoreFeatureActive('buyerCurrency') && (
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-2.5 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  aria-label="Buyer currency"
                >
                  {enabledCurrencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} ({c.code})
                    </option>
                  ))}
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
        )}

        {/* Mobile Search Bar (Controlled by storeSearch feature) */}
        {renderSectionControlStrip('storeSearch', 'شريط البحث المباشر في منتجات المتجر', 'يتيح للزبائن البحث الفوري والفلترة بالاسم والتفاصيل', 'ابحث عن منتج...')}
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
      {renderSectionControlStrip('heroBanner', 'البانر الترويجي وقسم الترحيب بالمتجر', 'العنوان الرئيسي الترويجي ونبذة المتجر وأزرار الشحن', 'أفضل المنتجات الأصلية بأفضل الأسعار مع ضمان الاستبدال السريع')}
      {isStoreFeatureActive('heroBanner') && (
      <section className={`relative overflow-hidden border-b ${
        isDarkTheme 
          ? 'bg-gradient-to-br from-[#172132] to-[#0F172A] border-slate-800 text-white' 
          : 'bg-white border-slate-200/80 text-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                isDarkTheme ? 'bg-purple-950/50 text-purple-300 border-purple-800/60' : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'متجر مستقل معتمد - تشغيل مباشر' : 'Independent Verified Store'}</span>
              </div>

              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black leading-tight ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                {isAr ? `مرحباً بك في ${store.nameAr}` : `Welcome to ${store.name}`}
              </h2>

              <p className={`text-sm sm:text-base max-w-2xl leading-relaxed ${isDarkTheme ? 'text-slate-300' : 'text-slate-600'}`}>
                {isAr ? store.descriptionAr : store.description}
              </p>

              <div className={`flex flex-wrap items-center gap-6 pt-2 text-xs font-bold ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'شحن فوري لباب البيت (58 ولاية)' : 'Fast Doorstep Delivery (58 Wilayas)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'الدفع عند الاستلام بعد المعاينة' : 'COD After Inspection'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'استرجاع مضمون 48 ساعة' : '48h Easy Returns'}</span>
                </div>
              </div>
            </div>

            {/* Quick Hero Box with Accent styling (Controlled by welcomeDiscount feature) */}
            {isStoreFeatureActive('welcomeDiscount') && (
              <div className="lg:col-span-4">
                <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
                  isDarkTheme ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 text-slate-900'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isAr ? 'رمز خصم ترحيبي للزبائن:' : 'Welcome discount code:'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                      -10%
                    </span>
                  </div>
                  <div className={`flex items-center justify-between p-3 rounded-xl border font-mono font-bold text-sm ${
                    isDarkTheme ? 'bg-[#172132] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}>
                    <span>WELCOME10</span>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText('WELCOME10');
                        setCouponCode('WELCOME10');
                        alert(isAr ? 'تم نسخ الرمز وسيتم تطبيقه بالسلة!' : 'Code copied!');
                      }}
                      className="text-xs text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
                    >
                      {isAr ? 'استخدمه الآن' : 'Use'}
                    </button>
                  </div>
                  <p className={`text-[11px] ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isAr ? 'ينطبق على كافة المنتجات عند إتمام الطلب.' : 'Applies to all products at checkout.'}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
      )}

      {/* ─── TRUST & GUARANTEES BADGES SECTION ─── */}
      {renderSectionControlStrip('trustBadges', 'شارات الثقة ومزايا التوصيل والضمان', 'شريط مزايا الشحن للـ 58 ولاية والدفع بعد المعاينة والاسترجاع', 'شحن فوري لباب البيت • فحص المنتج قبل الدفع • استبدال مضمون')}
      {isStoreFeatureActive('trustBadges') && (
        <section className={`border-b py-6 px-4 ${isDarkTheme ? 'bg-[#172132] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: <Truck className="w-5 h-5 text-emerald-400 mx-auto" />, title: isAr ? 'توصيل لـ 58 ولاية' : '58 Wilayas Delivery', desc: isAr ? 'توصيل للمنزل أو المكتب' : 'Home or Desk pickup' },
              { icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />, title: isAr ? 'الدفع عند الاستلام' : 'COD Payment', desc: isAr ? 'افحص طلبك ثم ادفع' : 'Inspect before paying' },
              { icon: <RotateCcw className="w-5 h-5 text-amber-400 mx-auto" />, title: isAr ? 'استبدال مضمون' : 'Easy Returns', desc: isAr ? 'خلال 48 ساعة من الاستلام' : 'Within 48 hours' },
              { icon: <ShieldCheck className="w-5 h-5 text-purple-400 mx-auto" />, title: isAr ? 'منتجات أصلية 100%' : '100% Genuine', desc: isAr ? 'جودة عالية وضمان' : 'Premium quality' }
            ].map((b, i) => (
              <div key={i} className={`p-3 rounded-2xl border shadow-2xs space-y-1 ${isDarkTheme ? 'bg-[#0F172A] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                {b.icon}
                <div className="font-extrabold text-xs">{b.title}</div>
                <div className={`text-[11px] ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>{b.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 3. STORE PRODUCTS CATALOG ─── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Free Shipping Dynamic Progress Bar (shippingThreshold) */}
        {renderSectionControlStrip('shippingThreshold', 'شريط تقدم الشحن والتوصيل المجاني', 'عرض شريط تفاعلي لحساب المبلغ المتبقي للحصول على شحن مجاني', 'أضف منتجات بقيمة 5,000 د.ج للحصول على شحن مجاني!')}
        {isStoreFeatureActive('shippingThreshold') && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="font-extrabold text-emerald-950">
                  {rawCartTotal >= (store.settings.freeShippingThreshold || 5000)
                    ? (isAr ? '🎉 تهانينا! لقد حصلت على شحن مجاني لكافة الـ 58 ولاية!' : '🎉 Free shipping unlocked for all wilayas!')
                    : (isAr ? `🚚 أضف منتجات بقيمة ${((store.settings.freeShippingThreshold || 5000) - rawCartTotal).toLocaleString()} د.ج إضافية للحصول على توصيل مجاني!` : `Add more for free delivery!`)}
                </span>
                <p className="text-[11px] text-emerald-800">
                  {isAr ? 'توصيل سريع مع ياليدين وزد آر إكسبريس لباب البيت أو المكتب' : 'Fast express delivery with COD'}
                </p>
              </div>
            </div>
            <div className="w-full sm:w-48 bg-emerald-200/80 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (rawCartTotal / (store.settings.freeShippingThreshold || 5000)) * 100)}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Category Filters Bar & Sort */}
        {renderSectionControlStrip('categoriesBar', 'شريط تصنيفات وفلترة المنتجات', 'أزرار التصنيفات الأفقية لتسهيل تصفح الأقسام والمنتجات', 'جميع الأقسام')}
        {isStoreFeatureActive('categoriesBar') && (
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
        )}

        {/* ─── PRODUCTS CATALOG GRID ─── */}
        {renderSectionControlStrip('featuredProducts', 'شبكة عرض منتجات المتجر والكتالوج', 'شبكة المنتجات المعروضة للبيع مع الأسعار والأزرار', 'منتجاتنا المميزة')}
        {isStoreFeatureActive('featuredProducts') && (
        <>
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
                  className={`rounded-2xl border transition-all p-5 flex flex-col justify-between space-y-4 group ${
                    isDarkTheme 
                      ? 'bg-[#172132] border-slate-800 text-white shadow-xl shadow-purple-950/20' 
                      : 'bg-white border-slate-200 shadow-xs hover:shadow-lg'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Visual Box */}
                    {(() => {
                      const coverImg = (product.images && product.images.length > 0) ? product.images[0] : product.imageUrl;
                      return (
                        <div 
                          onClick={() => handleOpenQuickView(product)}
                          className="w-full h-52 rounded-xl bg-slate-100 flex flex-col items-center justify-center border border-slate-200/70 relative overflow-hidden group/img cursor-pointer"
                        >
                          {coverImg ? (
                            <img
                              src={coverImg}
                              alt={isAr ? product.nameAr : product.name}
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
                              <ShoppingBag 
                                className="w-12 h-12 transition-transform duration-300 group-hover/img:scale-110" 
                                style={{ color: store.accentColor || '#059669' }}
                              />
                              <span className="text-[11px] font-mono text-slate-500 mt-2 font-bold">
                                {product.category}
                              </span>
                            </div>
                          )}

                          {/* 10-Image count badge */}
                          {product.images && product.images.length > 1 && (
                            <span className="absolute bottom-2.5 start-2.5 text-[10px] bg-slate-900/85 backdrop-blur-xs text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm font-mono">
                              <Camera className="w-3 h-3 text-amber-300" />
                              <span>{product.images.length} {isAr ? 'صور' : 'photos'}</span>
                            </span>
                          )}
                          
                          {/* Stock Badge (Controlled by stockIndicator feature) */}
                          {isStoreFeatureActive('stockIndicator') && (
                            <span className="absolute top-2.5 end-2.5 text-[10px] bg-white/95 backdrop-blur-xs font-mono font-bold text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
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
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenQuickView(product);
                              }}
                              className="absolute bottom-2.5 inset-x-3 py-1.5 rounded-lg bg-white/95 text-slate-900 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md text-center cursor-pointer"
                            >
                              {isAr ? 'عرض التفاصيل والصور 👁️' : 'View Photos & Details 👁️'}
                            </button>
                          )}
                        </div>
                      );
                    })()}

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

                      <h3 
                        onClick={() => handleOpenQuickView(product)}
                        className="font-extrabold text-slate-900 text-sm line-clamp-1 group-hover:text-emerald-600 transition-colors cursor-pointer"
                      >
                        {isAr ? product.nameAr : product.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {isAr ? product.descriptionAr : product.description}
                      </p>

                      {/* Color swatches preview */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-2">
                          <span className="text-[10px] text-slate-400 font-bold">{isAr ? 'الألوان:' : 'Colors:'}</span>
                          <div className="flex items-center gap-1">
                            {product.colors.map((c, idx) => {
                              const hex = typeof c === 'string' ? '#6B7280' : c.hex;
                              const title = typeof c === 'string' ? c : (isAr ? c.nameAr || c.name : c.name);
                              return (
                                <span
                                  key={idx}
                                  className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs inline-block"
                                  style={{ backgroundColor: hex }}
                                  title={title}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}
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
                        backgroundColor: inCart ? '#059669' : (store.accentColor || '#059669')
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
        </>
        )}

        {/* ─── CUSTOMER REVIEWS & TESTIMONIALS SECTION ─── */}
        {renderSectionControlStrip('reviewsSection', 'قسم تقييمات وآراء وتجارب الزبائن الموثقة', 'عرض آراء الزبائن الحقيقية وتقييمات الـ 5 نجوم لبناء الثقة ومضاعفة المبيعات', 'أكثر من 2,400+ زبون سعيد في كافة ولايات الجزائر')}
        {isStoreFeatureActive('reviewsSection') && (
          <section className="pt-8 border-t border-slate-200 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <span>{isAr ? 'تقييمات وتجارب الزبائن الحقيقية' : 'Verified Customer Reviews'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isAr ? 'ماذا يقول عملاؤنا عن منتجاتنا وتوصيلنا؟' : 'What Our Customers Say'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr ? 'تجارب حقيقية لزبائن من مختلف ولايات الجزائر بعد استلام ومعاينة الطلبيات' : 'Real customer feedback from Algerian buyers.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'محمد ب. (الجزائر العاصمة)', review: 'المنتج ممتاز والتوصيل سريع جداً مع ياليدين خلال 24 ساعة، فحصت السلعة قبل ما ندفع. شكراً لكم!', rating: 5, date: 'منذ يومين' },
                { name: 'سميرة ك. (وهران)', review: 'جودة السلعة أحسن من الصور، تعامل راقي والدفع عند الاستلام ريحني بزاف. ننصح الجميع بهذا المتجر.', rating: 5, date: 'منذ 3 أيام' },
                { name: 'عبد الرحمن م. (سطيف)', review: 'سعر مناسب وتغليف احترافي، خدمة الزبائن عبر واتساب جاوبوني في دقائق وأكدوا لي الطلبية فوراً.', rating: 5, date: 'منذ أسبوع' }
              ].map((rev, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">"{rev.review}"</p>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                      {rev.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-slate-900">{rev.name}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                      {isAr ? 'شراء مؤكد ✓' : 'Verified'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* ─── 4. INDEPENDENT STORE FOOTER ─── */}
      {renderSectionControlStrip('storeFooterLinks', 'تذييل المتجر وروابط السياسات والدعم', 'عرض سياسة الاسترجاع والضمان والشروط وحقوق النشر', 'جميع الحقوق محفوظة')}
      {isStoreFeatureActive('storeFooterLinks') && (store.settings?.footerConfig?.isEnabled !== false) && (!store.settings?.footerConfig?.isRemoved) && (
      <footer className={`border-t mt-16 pt-12 pb-8 ${isDarkTheme ? 'bg-[#172132] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Store Brand Info */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm"
                  style={{ backgroundColor: store.accentColor || '#059669' }}
                >
                  {(store.nameAr || store.name).charAt(0)}
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  {isAr ? store.nameAr : store.name}
                </h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                {store.settings?.footerConfig?.aboutText || (isAr ? store.descriptionAr : store.description)}
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-600 pt-1 font-mono">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{store.ownerEmail}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{store.ownerPhone || '0550 12 34 56'}</span>
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2.5 text-xs text-slate-600">
              <h5 className="font-bold text-slate-900 text-sm">
                {isAr ? 'روابط المتجر' : 'Store Links'}
              </h5>
              <ul className="space-y-2">
                <li><a href="#products" className="hover:text-emerald-600 transition-colors">{isAr ? 'جميع المنتجات' : 'All Products'}</a></li>
                <li><button onClick={() => setIsTrackingModalOpen(true)} className="hover:text-emerald-600 transition-colors cursor-pointer">{isAr ? 'تتبع حالة الشحنة' : 'Track Order'}</button></li>
                <li><a href="#about" className="hover:text-emerald-600 transition-colors">{isAr ? 'من نحن' : 'About Us'}</a></li>
                <li><a href="#contact" className="hover:text-emerald-600 transition-colors">{isAr ? 'خدمة العملاء' : 'Customer Support'}</a></li>
              </ul>
            </div>

            {/* Security & Policies */}
            <div className="space-y-2.5 text-xs text-slate-600">
              <h5 className="font-bold text-slate-900 text-sm">
                {isAr ? 'السياسات والضمان' : 'Policies & Trust'}
              </h5>
              <ul className="space-y-2">
                <li><span className="hover:text-emerald-600 cursor-pointer">{isAr ? 'سياسة الاستبدال والاسترجاع' : 'Refund Policy'}</span></li>
                <li><span className="hover:text-emerald-600 cursor-pointer">{isAr ? 'سياسة الخصوصية وسرية البيانات' : 'Privacy Policy'}</span></li>
                <li><span className="hover:text-emerald-600 cursor-pointer">{isAr ? 'الشروط والأحكام' : 'Terms of Service'}</span></li>
                <li>
                  <span className="inline-block bg-slate-100 text-slate-700 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-200">
                    {isAr ? 'سجل تجاري إلكتروني: DZ-COMM-2026' : 'Reg: DZ-COMM-2026'}
                  </span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              {store.settings?.footerConfig?.copyright || `© 2026 ${isAr ? store.nameAr : store.name}. ${isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}`}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'متجر مستقل معتمد - شحن 58 ولاية ودفع عند الاستلام' : 'Independent Store - 58 Wilayas COD'}</span>
              </div>
            </div>
          </div>

        </div>
      </footer>
      )}

      {/* ─── FLOATING WHATSAPP CHAT BUTTON (Controlled by whatsappChat feature) ─── */}
      {isStoreFeatureActive('whatsappChat') && (
        <aside aria-label="WhatsApp Support" className="fixed bottom-6 start-6 z-40 flex items-center gap-2">
          <button
            onClick={() => {
              alert(isAr ? `بدء محادثة الدعم الفني عبر واتساب لمتجر ${store.nameAr}...` : `Starting WhatsApp chat for ${store.name}...`);
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white stroke-none" />
            <span>{isAr ? 'محادثة واتساب مباشرة' : 'WhatsApp Support'}</span>
          </button>
          {isMerchantMode && (
            <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-xs p-1 rounded-full border border-slate-700 shadow-xl">
              <button
                type="button"
                onClick={() => handleToggleFeature('whatsappChat')}
                className="p-1.5 rounded-full hover:bg-slate-800 text-emerald-400 cursor-pointer"
                title={isAr ? 'تعطيل زر الواتساب' : 'Disable WhatsApp'}
              >
                <Power className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleOpenEditModal(getFeature('whatsappChat') || {
                  id: 'whatsappChat',
                  name: 'WhatsApp Support',
                  nameAr: 'زر التواصل السريع عبر واتساب',
                  description: 'Floating button connecting shoppers directly to merchant',
                  descriptionAr: 'زر عائم في أسفل المتجر يتيح للزبون الاستفسار مباشرة عبر واتساب',
                  category: 'customer',
                  isEnabled: true,
                  isRemoved: false,
                  customValue: '+213555000000'
                })}
                className="p-1.5 rounded-full hover:bg-slate-800 text-amber-400 cursor-pointer"
                title={isAr ? 'تعديل رقم واتساب' : 'Edit WhatsApp'}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemoveFeature('whatsappChat')}
                className="p-1.5 rounded-full hover:bg-slate-800 text-rose-400 cursor-pointer"
                title={isAr ? 'حذف زر الواتساب' : 'Delete WhatsApp'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
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
                  <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                    {cart.map((item, idx) => (
                      <div key={`${item.product.id}_${item.selectedColor || idx}`} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            <img
                              src={item.product.images?.[0] || item.product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&q=80'}
                              alt={isAr ? item.product.nameAr : item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 truncate">
                              {isAr ? item.product.nameAr : item.product.name}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-slate-500 font-mono text-[11px]">
                                {formatPrice(item.product.price)} × {item.quantity}
                              </span>
                              {item.selectedColor && (
                                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                                  {isAr ? `لون: ${item.selectedColor}` : `Color: ${item.selectedColor}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, -1, item.selectedColor)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-slate-900 font-mono w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, 1, item.selectedColor)}
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
      {/* ─── 7. QUICK VIEW PRODUCT MODAL (WITH 10-IMAGE GALLERY & COLOR SELECTOR) ─── */}
      {quickViewProduct && (() => {
        const allImages = quickViewProduct.images && quickViewProduct.images.length > 0 
          ? quickViewProduct.images 
          : (quickViewProduct.imageUrl ? [quickViewProduct.imageUrl] : []);
        const currentImg = selectedGalleryImage || allImages[0];

        return (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto text-start">
              
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 end-4 w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100 flex items-center justify-center cursor-pointer transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* 1. Interactive Image Gallery */}
              <div className="space-y-2">
                <div className="w-full h-64 sm:h-72 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center">
                  {currentImg ? (
                    <img
                      src={currentImg}
                      alt={isAr ? quickViewProduct.nameAr : quickViewProduct.name}
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                  ) : (
                    <ShoppingBag className="w-16 h-16" style={{ color: store.accentColor || '#059669' }} />
                  )}

                  {allImages.length > 1 && (
                    <span className="absolute bottom-3 start-3 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-md">
                      <Camera className="w-3.5 h-3.5 text-amber-300" />
                      <span>{allImages.length} {isAr ? 'صور متوفرة' : 'photos'}</span>
                    </span>
                  )}
                </div>

                {/* Thumbnails Strip (Up to 10 images) */}
                {allImages.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedGalleryImage(img)}
                        className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          currentImg === img
                            ? 'border-emerald-600 ring-2 ring-emerald-400/50 scale-102 shadow-xs'
                            : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Product Name, Category & Price */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold text-slate-400 font-mono">
                    {quickViewProduct.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    <span>4.9</span>
                    <span className="text-slate-400 font-normal">({isAr ? 'تقييم ممتاز' : 'Top rated'})</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                    {isAr ? quickViewProduct.nameAr : quickViewProduct.name}
                  </h3>
                  <span className="font-black text-xl text-slate-900 font-mono shrink-0">
                    {formatPrice(quickViewProduct.price)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                  {isAr ? quickViewProduct.descriptionAr : quickViewProduct.description}
                </p>
              </div>

              {/* 3. Color Swatches Selection */}
              {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-emerald-600" />
                      <span>{isAr ? 'الألوان المتوفرة (اضغط للاختيار):' : 'Available Colors:'}</span>
                    </span>
                    {selectedColorVariant && (
                      <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300 text-[11px]">
                        {isAr ? `اللون: ${selectedColorVariant}` : `Color: ${selectedColorVariant}`}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {quickViewProduct.colors.map((c, idx) => {
                      const hex = typeof c === 'string' ? '#6B7280' : c.hex;
                      const name = typeof c === 'string' ? c : (isAr ? c.nameAr || c.name : c.name);
                      const isSelected = selectedColorVariant === name;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedColorVariant(name)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-emerald-500/40'
                              : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-inner"
                            style={{ backgroundColor: hex }}
                          />
                          <span>{name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 ms-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock and Shipping Guarantee */}
              <div className="flex items-center justify-between p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs">
                <span className="text-emerald-950 flex items-center gap-1 font-bold">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? 'شحن سريع لـ 58 ولاية والدفع بعد المعاينة' : 'Fast shipping to 58 wilayas'}</span>
                </span>
                <span className="font-bold text-emerald-700">
                  {quickViewProduct.stock > 0 
                    ? (isAr ? `${quickViewProduct.stock} قطعة بالمخزون` : `${quickViewProduct.stock} in stock`)
                    : (isAr ? 'نفذت الكمية' : 'Out of stock')}
                </span>
              </div>

              {/* Add to Cart & Checkout Button */}
              <button
                type="button"
                onClick={() => {
                  handleAddToCart(quickViewProduct, selectedColorVariant || undefined);
                  setQuickViewProduct(null);
                  setIsCheckoutOpen(true);
                }}
                disabled={quickViewProduct.stock <= 0}
                className="w-full py-3.5 rounded-xl text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-101 active:scale-99 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: store.accentColor || '#059669' }}
              >
                <Plus className="w-4 h-4" />
                <span>
                  {selectedColorVariant 
                    ? (isAr ? `إضافة (${selectedColorVariant}) للسلة والدفع 🛍️` : `Add (${selectedColorVariant}) to Cart 🛍️`)
                    : (isAr ? 'إضافة للسلة والذهاب للدفع 🛍️' : 'Add to Cart & Checkout 🛍️')}
                </span>
              </button>
            </div>
          </div>
        );
      })()}

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

      {/* ─── 9. SECTION EDIT MODAL (نظام التعديل) ─── */}
      {editingFeature && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 text-start">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">
                    {isAr ? 'تعديل قسم المتجر' : 'Edit Section'}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {editingFeature.nameAr || editingFeature.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingFeature(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveFeatureEdit} className="space-y-4 text-xs">
              
              {/* Section Title */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'عنوان أو اسم القسم بالمتجر' : 'Section Title'}
                </label>
                <input
                  type="text"
                  required
                  value={editNameAr}
                  onChange={(e) => setEditNameAr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-indigo-600 transition-colors"
                />
              </div>

              {/* Section Subtitle / Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'النص التوضيحي أو النبذة' : 'Subtitle / Description'}
                </label>
                <input
                  type="text"
                  value={editDescAr}
                  onChange={(e) => setEditDescAr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 transition-colors"
                />
              </div>

              {/* Custom Value / Banner / Contact */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'القيمة المعروضة أو النص الإعلاني أو رقم الاتصال' : 'Custom Banner / Contact Text'}
                </label>
                <textarea
                  rows={2}
                  value={editCustomValue}
                  onChange={(e) => setEditCustomValue(e.target.value)}
                  placeholder={isAr ? 'أدخل العبارة أو النص أو الرقم المخصص...' : 'Enter custom text or value...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 transition-colors resize-none"
                />
              </div>

              {/* State Toggle Checkbox */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">
                    {isAr ? 'تفعيل هذا القسم في المتجر' : 'Enable Section in Store'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {editIsEnabled ? (isAr ? 'القسم ظاهر للزبائن حالياً' : 'Currently visible to customers') : (isAr ? 'القسم معطل ومخفي مؤقتاً' : 'Temporarily disabled')}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editIsEnabled}
                  onChange={(e) => setEditIsEnabled(e.target.checked)}
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveFeature(editingFeature.id);
                    setEditingFeature(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-rose-200 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'حذف هذا القسم 🗑️' : 'Delete Section 🗑️'}</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setEditingFeature(null)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md shadow-slate-900/20 cursor-pointer transition-all hover:scale-102 flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    <span>{isAr ? 'حفظ التعديلات وتطبيقها فوراً ✓' : 'Save & Apply ✓'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ─── 10. STORE APPEARANCE & THEME MODAL (مظهر وهوية المتجر) ─── */}
      {isAppearanceModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 text-start">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">
                    {isAr ? 'مظهر وهوية المتجر والألوان الرئيسية' : 'Store Appearance & Branding'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {isAr ? 'تخصيص لون الهوية، اسم المتجر، والعبارة الترويجية' : 'Customize theme accent color, brand name, and slogan'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAppearanceModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAppearance} className="space-y-4 text-xs">
              
              {/* Color Preset Palette */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  {isAr ? 'اختر لون الهوية الرئيسي للمتجر:' : 'Select Accent Theme Color:'}
                </label>
                <div className="flex flex-wrap items-center gap-2.5">
                  {[
                    { color: '#059669', name: 'أخضر جزائري (Emerald DZ)' },
                    { color: '#4F46E5', name: 'أزرق نيلي حديث (Indigo)' },
                    { color: '#7C3AED', name: 'بنفسجي ملكي (Royal Violet)' },
                    { color: '#D97706', name: 'كهرماني ذهبي (Amber Gold)' },
                    { color: '#E11D48', name: 'وردي ياقوتي (Rose Ruby)' },
                    { color: '#0284C7', name: 'أزرق بحري (Ocean Sky)' },
                    { color: '#0F172A', name: 'كحلي داكن (Midnight Slate)' }
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setAppearanceColor(c.color)}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                        appearanceColor.toLowerCase() === c.color.toLowerCase()
                          ? 'ring-4 ring-slate-900 scale-110 shadow-md'
                          : 'hover:scale-105 opacity-90 hover:opacity-100'
                      }`}
                    >
                      {appearanceColor.toLowerCase() === c.color.toLowerCase() && (
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      )}
                    </button>
                  ))}

                  {/* Custom Hex Input */}
                  <div className="flex items-center gap-1.5 ms-auto">
                    <input
                      type="color"
                      value={appearanceColor}
                      onChange={(e) => setAppearanceColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                    />
                    <input
                      type="text"
                      value={appearanceColor}
                      onChange={(e) => setAppearanceColor(e.target.value)}
                      className="w-20 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-center font-mono font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Store Name in Arabic */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'اسم المتجر التجاري' : 'Store Name'}
                </label>
                <input
                  type="text"
                  required
                  value={appearanceNameAr}
                  onChange={(e) => setAppearanceNameAr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold focus:bg-white focus:outline-none focus:border-indigo-600 transition-colors"
                />
              </div>

              {/* Store Slogan */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'العبارة الترويجية للمتجر (Slogan)' : 'Store Slogan'}
                </label>
                <input
                  type="text"
                  value={appearanceSloganAr}
                  onChange={(e) => setAppearanceSloganAr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 transition-colors"
                />
              </div>

              {/* Live Preview Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  {isAr ? 'معاينة فورية لمظهر المتجر:' : 'Instant Live Preview:'}
                </span>
                <div className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-xs"
                      style={{ backgroundColor: appearanceColor }}
                    >
                      {appearanceNameAr.charAt(0) || 'م'}
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900">{appearanceNameAr || 'متجري'}</div>
                      <div className="text-[10px] text-slate-400">{appearanceSloganAr || 'توصيل سريع لكافة الولايات'}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    style={{ backgroundColor: appearanceColor }}
                    className="px-3 py-1.5 rounded-lg text-white font-bold text-[11px] shadow-xs cursor-default"
                  >
                    {isAr ? 'أضف للسلة' : 'Add to Cart'}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAppearanceModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 cursor-pointer transition-all hover:scale-102 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isAr ? 'حفظ وتطبيق المظهر الجديد ✓' : 'Save & Apply New Theme ✓'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
    );
  };

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
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3" />
                  <span>{isAr ? 'لوحة تحكم المتجر (Admin)' : 'Store Dashboard'}</span>
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
