import React, { useState } from 'react';
import { 
  Store, Product, Order, Customer, Coupon, PlanType, 
  Currency, Language, SupabaseConfig, GitHubConfig, SellerUser, 
  PlatformFeatureItem, StoreFeatureItem, AbandonedCart, LandingPageFunnel,
  WilayaDeliveryRate, CarrierConfig
} from '../types';
import { 
  CURRENCY_RATES, PLANS, ALGERIA_58_WILAYAS, 
  ALGERIA_CARRIERS, INITIAL_ABANDONED_CARTS, INITIAL_LANDING_PAGES 
} from '../data/initialData';
import { PlansPricingView } from './PlansPricingView';
import { StoreFeaturesManager } from './StoreFeaturesManager';
import { 
  Store as StoreIcon, Package, ShoppingCart, Settings, 
  ExternalLink, Plus, CheckCircle2, Clock, Trash2, 
  TrendingUp, ShieldCheck, Database, GitBranch, Globe, 
  Check, ArrowRight, ArrowLeft, AlertCircle, Copy, Terminal, 
  Edit3, Users, Tag, DollarSign, Printer, Lock, LogOut, Sparkles,
  BarChart3, RefreshCw, Eye, Sliders, RotateCcw, ShoppingBag,
  Link2, Share2, QrCode, Smartphone, CheckCheck, Truck, UploadCloud,
  MessageCircle, Zap, PhoneCall, Filter, HelpCircle
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
  features: PlatformFeatureItem[];
  storeFeatures?: StoreFeatureItem[];
  onToggleFeature: (featureId: string) => void;
  onRemoveFeature: (featureId: string) => void;
  onRestoreFeature: (featureId: string) => void;
  onOpenFeaturesModal: () => void;
  onToggleStoreFeature?: (featureId: string) => void;
  onRemoveStoreFeature?: (featureId: string) => void;
  onRestoreStoreFeature?: (featureId: string) => void;
  onEnableAllStoreFeatures?: () => void;
  onResetDefaultStoreFeatures?: () => void;
  onAddStoreFeature?: (newFeature: StoreFeatureItem) => void;
  onUpdateStoreFeature?: (updatedFeature: StoreFeatureItem) => void;
  onUpdateStoreSettings: (updated: Partial<Store['settings']>) => void;
  onUpdateStorePlan: (plan: PlanType) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateProductStock: (productId: string, stock: number) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateOrderCallStatus?: (orderId: string, callStatus: Order['callStatus']) => void;
  onDispatchOrderToCarrier?: (orderId: string, carrierName: string) => void;
  onAddCoupon: (coupon: Coupon) => void;
  onToggleCoupon: (couponId: string) => void;
  onOpenLivePreview: () => void;
  onOpenStandaloneStore?: () => void;
  onOpenCreateNewStore: () => void;
  onBackToPlatform?: () => void;
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
  features,
  storeFeatures,
  onToggleFeature,
  onRemoveFeature,
  onRestoreFeature,
  onOpenFeaturesModal,
  onToggleStoreFeature,
  onRemoveStoreFeature,
  onRestoreStoreFeature,
  onEnableAllStoreFeatures,
  onResetDefaultStoreFeatures,
  onAddStoreFeature,
  onUpdateStoreFeature,
  onUpdateStoreSettings,
  onUpdateStorePlan,
  onAddProduct,
  onDeleteProduct,
  onUpdateProductStock,
  onUpdateOrderStatus,
  onUpdateOrderCallStatus,
  onDispatchOrderToCarrier,
  onAddCoupon,
  onToggleCoupon,
  onOpenLivePreview,
  onOpenStandaloneStore,
  onOpenCreateNewStore,
  onBackToPlatform,
  onLogout
}) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'shipping58' | 'aiLanding' | 'abandonedCarts' | 'pixels' | 'customers' | 'coupons' | 'plans' | 'storeFeatures' | 'settings' | 'developer' | 'features'>('overview');
  
  // Feature Helper
  const isFeatureActive = (id: string) => {
    const feat = features?.find((f) => f.id === id);
    return feat ? feat.isEnabled && !feat.isRemoved : true;
  };
  const activeFeaturesCount = (features || []).filter((f) => f.isEnabled && !f.isRemoved).length;
  const activeStoreFeaturesCount = (storeFeatures || []).filter((f) => f.isEnabled && !f.isRemoved).length;
  
  // Modals & Algerian COD States
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [showAddCouponModal, setShowAddCouponModal] = useState<boolean>(false);
  const [showImporterModal, setShowImporterModal] = useState<boolean>(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [selectedWaybillOrder, setSelectedWaybillOrder] = useState<Order | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState<boolean>(false);
  
  // 58 Wilayas & Carrier Rates State
  const [wilayaRates, setWilayaRates] = useState<WilayaDeliveryRate[]>(ALGERIA_58_WILAYAS);
  const [wilayaFilter, setWilayaFilter] = useState('');
  const [carriers, setCarriers] = useState<CarrierConfig[]>(ALGERIA_CARRIERS);
  const [yalidineKey, setYalidineKey] = useState(store.settings.yalidineApiKey || 'YAL_API_KEY_LIVE_9921');
  const [yalidineToken, setYalidineToken] = useState(store.settings.yalidineApiToken || 'YAL_TOKEN_SEC_7718');
  const [zrKey, setZrKey] = useState(store.settings.zrExpressKey || 'ZR_KEY_LIVE_7712');
  const [ecotrackToken, setEcotrackToken] = useState('ECOTRACK_LIVE_TOKEN_773');
  const [savedCarrierNotice, setSavedCarrierNotice] = useState<string | null>(null);

  // Abandoned Carts State
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>(INITIAL_ABANDONED_CARTS);

  // AI Landing Pages State
  const [landingPages, setLandingPages] = useState<LandingPageFunnel[]>(INITIAL_LANDING_PAGES);
  const [selectedAiProdId, setSelectedAiProdId] = useState<string>('');
  const [aiFunnelLang, setAiFunnelLang] = useState<'darija' | 'fr' | 'ar'>('darija');
  const [isGeneratingLp, setIsGeneratingLp] = useState(false);

  // Multi-Pixel Marketing State
  const [fbPixel, setFbPixel] = useState(store.settings.facebookPixel || 'PIXEL_FB_99182374');
  const [ttPixel, setTtPixel] = useState(store.settings.tiktokPixel || 'PIXEL_TT_88129033');
  const [snapPixel, setSnapPixel] = useState('PIXEL_SNAP_771892');
  const [gtmId, setGtmId] = useState('GTM-DZ99482');
  const [pixelSaved, setPixelSaved] = useState(false);

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
  const [newProdPrice, setNewProdPrice] = useState(250);
  const [newProdCost, setNewProdCost] = useState(120);
  const [newProdStock, setNewProdStock] = useState(20);
  const [newProdCategory, setNewProdCategory] = useState('Fashion & Apparel');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');

  // New Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValue, setCouponValue] = useState(15);
  const [couponMinOrder, setCouponMinOrder] = useState(150);

  // Store Settings Form State
  const [shippingRate, setShippingRate] = useState(store.settings.shippingRate);
  const [freeThreshold, setFreeThreshold] = useState(store.settings.freeShippingThreshold);
  const [taxRate, setTaxRate] = useState(store.settings.taxRate);
  const [themeColor, setThemeColor] = useState(store.settings.themeColor);
  const [isPublished, setIsPublished] = useState(store.settings.isPublished);
  const [payoutBank, setPayoutBank] = useState(store.settings.payoutBank || 'بريد الجزائر (BaridiMob / CCP) / بنك BNA');
  const [payoutIban, setPayoutIban] = useState(store.settings.payoutIban || '00799999000123456789 (RIP BaridiMob)');

  // Normal Link & Subdomain Configuration State
  const [preferredLinkFormat, setPreferredLinkFormat] = useState<'standard' | 'subdomain'>('standard');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getStandardStoreUrl = () => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const path = window.location.pathname === '/' ? '' : window.location.pathname;
      return `${origin}${path}?mode=store&store=${store.slug}`;
    }
    return `https://wasladz.app/?mode=store&store=${store.slug}`;
  };

  const getSubdomainUrl = () => {
    return `https://${store.settings.subdomain || `${store.slug}.wasladz.app`}`;
  };

  const activeDisplayUrl = preferredLinkFormat === 'standard' ? getStandardStoreUrl() : getSubdomainUrl();

  const handleCopyStoreLink = (format: 'standard' | 'subdomain' = preferredLinkFormat) => {
    const url = format === 'standard' ? getStandardStoreUrl() : getSubdomainUrl();
    try {
      navigator.clipboard?.writeText(url);
      showToast(
        format === 'standard' 
          ? (isAr ? 'تم نسخ الرابط العادي المباشر بنجاح! يعمل فوراً في أي متصفح.' : 'Direct standard URL copied! Works in any browser.')
          : (isAr ? 'تم نسخ رابط النطاق الفرعي للمتجر.' : 'Subdomain link copied!')
      );
    } catch (e) {
      showToast(isAr ? 'تم نسخ الرابط.' : 'Link copied.');
    }
  };

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    if (isFreePlan && storeProducts.length >= 10) {
      showToast(isAr ? 'وصلت للحد الأقصى للمنتجات في الخطة المجانية (10 منتجات). قم بالترقية للخطة الاحترافية للحصول على عدد غير محدود!' : 'Free plan limit reached (10 products). Upgrade to Pro for unlimited products!');
      return;
    }

    const prod: Product = {
      id: `prod_${Date.now()}`,
      storeId: store.id,
      name: newProdName,
      nameAr: newProdNameAr || newProdName,
      description: newProdDesc || 'منتج عالي الجودة متوفر للطلب الفوري.',
      descriptionAr: newProdDesc || 'منتج عالي الجودة متوفر للطلب الفوري.',
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
    setNewProdPrice(250);
    setNewProdCost(120);
    setNewProdStock(20);
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const newCoupon: Coupon = {
      id: `cpn_${Date.now()}`,
      storeId: store.id,
      code: couponCode.trim().toUpperCase(),
      discountType: couponType,
      value: Number(couponValue),
      minOrder: Number(couponMinOrder),
      isActive: true,
      usageCount: 0
    };

    onAddCoupon(newCoupon);
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
      
      {/* 1. STORE HEADER BAR (Clean SaaS Style) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900">
              {isAr ? store.nameAr : store.name}
            </h1>
            
            {/* Plan Badge */}
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
              isFreePlan
                ? 'bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}>
              {isAr ? currentPlanDetails.nameAr : currentPlanDetails.name}
            </span>

            {/* Online Status */}
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isAr ? 'المتجر نشط أونلاين' : 'Store Live & Online'}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-indigo-600 font-semibold">{store.settings.subdomain}</span>
            </span>
            <span>•</span>
            <span>{isAr ? `التاجر: ${store.ownerName}` : `Merchant: ${store.ownerName}`}</span>
            <span>•</span>
            <span>{isAr ? `التصنيف: ${store.category}` : `Category: ${store.category}`}</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Back to SaaS Platform */}
          {onBackToPlatform && (
            <button
              onClick={onBackToPlatform}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title={isAr ? 'العودة لصفحة المنصة السحابية الرئيسية' : 'Return to main platform'}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isAr ? 'المنصة الرئيسية' : 'Platform'}</span>
            </button>
          )}

          {/* Visit Standalone Independent Store */}
          <button
            onClick={onOpenStandaloneStore || onOpenLivePreview}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
            title={isAr ? 'فتح المتجر كصفحة مستقلة بالكامل بدون أي عناصر للمنصة' : 'Open 100% independent standalone store page'}
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>{isAr ? 'زيارة المتجر المستقل 🛍️' : 'Visit Independent Store 🛍️'}</span>
          </button>

          {/* Store Features Button (Direct shortcut to the seller's toggle/delete system) */}
          <button
            onClick={() => setActiveTab('storeFeatures')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              activeTab === 'storeFeatures'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
            }`}
            title={isAr ? 'التحكم في خصائص متجرك بنظام الزر والحذف' : 'Manage store features & modules'}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isAr ? 'خصائص المتجر' : 'Store Features'}</span>
            <span className={`w-5 h-5 rounded-full font-mono text-[10px] font-bold flex items-center justify-center ${
              activeTab === 'storeFeatures' ? 'bg-white text-indigo-700' : 'bg-indigo-600 text-white'
            }`}>
              {activeStoreFeaturesCount}
            </span>
          </button>

          {/* Share & Copy Normal Store URL */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold shadow-2xs transition-all cursor-pointer"
            title={isAr ? 'مشاركة رابط المتجر العادي وتفاصيله والباركود QR' : 'Share & manage normal store link'}
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">{isAr ? 'مشاركة الرابط العادي' : 'Share Link'}</span>
          </button>

          <button
            onClick={() => handleCopyStoreLink('standard')}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold shadow-2xs transition-all cursor-pointer"
            title={isAr ? 'نسخ الرابط العادي المباشر الذي يعمل في أي متصفح' : 'Copy direct standard store link'}
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">{isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
          </button>

          {/* Platform Features Control Modal Trigger */}
          <button
            onClick={onOpenFeaturesModal}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title={isAr ? 'التحكم في خصائص المنصة الأم' : 'Platform Features'}
          >
            <Sliders className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">{isAr ? 'خصائص المنصة' : 'Platform Features'}</span>
            <span className="w-5 h-5 rounded-full bg-slate-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
              {activeFeaturesCount}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('products');
              setShowAddProductModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة منتج' : 'Add Product'}</span>
          </button>

          <button
            onClick={onLogout}
            title={isAr ? 'تسجيل الخروج' : 'Log out'}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. DASHBOARD NAVIGATION TABS */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 pb-px scrollbar-none">
        {[
          { id: 'overview', label: isAr ? 'نظرة عامة والتقارير' : 'Overview & Stats', icon: BarChart3, show: true },
          { id: 'orders', label: isAr ? `الطلبات وتأكيد الكول سنتر (${storeOrders.length})` : `Orders & Call Center (${storeOrders.length})`, icon: ShoppingCart, show: true },
          { id: 'products', label: isAr ? `المنتجات والاستيراد (${storeProducts.length})` : `Products (${storeProducts.length})`, icon: Package, show: true },
          { id: 'shipping58', label: isAr ? 'شحن 58 ولاية و 102 شركة توصيل' : '58 Wilayas & Couriers', icon: Truck, show: true },
          { id: 'aiLanding', label: isAr ? 'صفحات الهبوط بالذكاء الاصطناعي' : 'AI Landing Pages', icon: Sparkles, show: true },
          { id: 'abandonedCarts', label: isAr ? `السلات المتروكة (${abandonedCarts.length})` : `Abandoned Carts (${abandonedCarts.length})`, icon: MessageCircle, show: true },
          { id: 'pixels', label: isAr ? 'بكسلات التتبع (Meta / TikTok)' : 'Pixels Engine', icon: Zap, show: true },
          { id: 'customers', label: isAr ? `العملاء (${storeCustomers.length})` : `Customers (${storeCustomers.length})`, icon: Users, show: isFeatureActive('customersCRM') },
          { id: 'coupons', label: isAr ? `الكوبونات (${storeCoupons.length})` : `Coupons (${storeCoupons.length})`, icon: Tag, show: isFeatureActive('coupons') },
          { id: 'plans', label: isAr ? 'الباقات (0% عمولة)' : 'Plans & 0% Fee', icon: Sparkles, show: isFeatureActive('plansAndUpgrades') },
          { id: 'storeFeatures', label: isAr ? `خصائص وإعدادات المتجر (${activeStoreFeaturesCount})` : `Store Features & Settings (${activeStoreFeaturesCount})`, icon: Sliders, show: true },
          { id: 'settings', label: isAr ? 'إعدادات المتجر والرابط' : 'Store Settings', icon: Settings, show: true },
          { id: 'developer', label: isAr ? 'بوابة المطورين والـ API' : 'Integrations & API', icon: Database, show: isFeatureActive('developerIntegrations') },
          { id: 'features', label: isAr ? `خصائص المنصة (${activeFeaturesCount})` : `Platform Features (${activeFeaturesCount})`, icon: Sliders, show: true }
        ].filter(t => t.show).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                isActive
                  ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT */}
      
      {/* ─── TAB: OVERVIEW ─── */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Independent Storefront Live Status & Link Management Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-transparent border border-emerald-200/80 bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-2xs">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {isAr ? 'متجرك الإلكتروني المستقل مفصول ويعمل أونلاين' : 'Your Independent Store is Live & Standalone'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {isAr ? 'مستقل 100%' : '100% Standalone'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 flex items-center gap-1">
                    <Link2 className="w-2.5 h-2.5" />
                    <span>
                      {preferredLinkFormat === 'standard' 
                        ? (isAr ? 'صيغة: رابط عادي قياسي' : 'Format: Standard URL') 
                        : (isAr ? 'صيغة: نطاق فرعي' : 'Format: Subdomain')}
                    </span>
                  </span>
                </div>

                {/* Displaying the Actual Link with Format Toggle */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs max-w-lg truncate border border-slate-800 select-all shadow-inner">
                    {activeDisplayUrl}
                  </div>
                  
                  {/* Format Switcher Buttons */}
                  <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-0.5 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setPreferredLinkFormat('standard')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        preferredLinkFormat === 'standard'
                          ? 'bg-white text-indigo-700 shadow-2xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title={isAr ? 'الرابط العادي يعمل فوراً في أي متصفح وجهاز بدون DNS' : 'Standard direct URL works immediately in any browser'}
                    >
                      <Link2 className="w-3 h-3" />
                      <span>{isAr ? 'رابط عادي قياسي ⚡' : 'Standard Link ⚡'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferredLinkFormat('subdomain')}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        preferredLinkFormat === 'subdomain'
                          ? 'bg-white text-indigo-700 shadow-2xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title={isAr ? 'نطاق فرعي مخصص للمتجر' : 'Store Subdomain'}
                    >
                      <Globe className="w-3 h-3" />
                      <span>{isAr ? 'نطاق فرعي 🌐' : 'Subdomain 🌐'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  {preferredLinkFormat === 'standard'
                    ? (isAr ? '✓ هذا هو الرابط العادي المباشر الذي يمكنك نسخه ولصقه في أي متصفح آخر أو إرساله للعملاء لفتح المتجر مباشرة.' : '✓ This is the standard normal link you can copy and open in any other browser directly.')
                    : (isAr ? 'ℹ️ صيغة النطاق الفرعي المخصص (يتطلب ربط DNS CNAME عند النشر الفعلي).' : 'ℹ️ Custom branded subdomain format (requires DNS CNAME in production).')
                  }
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => handleCopyStoreLink(preferredLinkFormat)}
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                title={isAr ? 'نسخ الرابط المعروض حالياً' : 'Copy displayed link'}
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>{isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                title={isAr ? 'عرض خيارات مشاركة الرابط العادي والباركود QR' : 'Share link & QR code'}
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isAr ? 'مشاركة وتفاصيل الرابط 📲' : 'Share & Details 📲'}</span>
              </button>

              <button
                onClick={onOpenStandaloneStore || onOpenLivePreview}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAr ? 'زيارة المتجر المستقل 🛍️' : 'Visit Independent Store 🛍️'}</span>
              </button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Sales */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {isAr ? 'إجمالي المبيعات' : 'Gross Sales'}
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {formatPrice(store.totalSales)}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% {isAr ? 'مقارنة بالشهر السابق' : 'vs last month'}</span>
              </div>
            </div>

            {/* Total Orders */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {isAr ? 'عدد الطلبات' : 'Total Orders'}
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {storeOrders.length}
              </div>
              <div className="text-[11px] text-indigo-600 font-semibold">
                {storeOrders.filter(o => o.status === 'processing').length} {isAr ? 'طلبات قيد المعالجة' : 'in processing'}
              </div>
            </div>

            {/* Active Products */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {isAr ? 'المنتجات في المتجر' : 'Active Products'}
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {storeProducts.length}
              </div>
              <div className="text-[11px] text-slate-500">
                {isFreePlan ? `${storeProducts.length} / 10 ${isAr ? 'من الحد الأقصى' : 'capacity'}` : (isAr ? 'سعة غير محدودة' : 'Unlimited capacity')}
              </div>
            </div>

            {/* Customers */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {isAr ? 'قاعدة العملاء' : 'Total Customers'}
                </span>
                <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {storeCustomers.length}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold">
                100% {isAr ? 'معدل رضا العملاء' : 'satisfaction rate'}
              </div>
            </div>

          </div>

          {/* Recent Orders Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isAr ? 'أحدث طلبات الزبائن' : 'Recent Customer Orders'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isAr ? 'متابعة وتحديث حالات الشحن وتأكيد المعاملات' : 'Fulfill and manage your latest incoming purchases'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <span>{isAr ? 'عرض جميع الطلبات' : 'View all orders'}</span>
                {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>

            {storeOrders.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                {isAr ? 'لا توجد طلبات بعد. يمكنك إنشاء طلب تجريبي من "المتجر الحي" بالأعلى.' : 'No orders yet. Place a test order via View Live Store!'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500">
                      <th className="py-2.5 text-start font-semibold">{isAr ? 'رقم الطلب' : 'Order ID'}</th>
                      <th className="py-2.5 text-start font-semibold">{isAr ? 'العميل' : 'Customer'}</th>
                      <th className="py-2.5 text-start font-semibold">{isAr ? 'التاريخ' : 'Date'}</th>
                      <th className="py-2.5 text-start font-semibold">{isAr ? 'المبلغ الإجمالي' : 'Total'}</th>
                      <th className="py-2.5 text-start font-semibold">{isAr ? 'حالة الطلب' : 'Status'}</th>
                      <th className="py-2.5 text-end font-semibold">{isAr ? 'إجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {storeOrders.slice(0, 4).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-900">
                          {order.orderNumber}
                        </td>
                        <td className="py-3">
                          <div className="font-bold text-slate-800">{order.customerName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{order.customerCity}</div>
                        </td>
                        <td className="py-3 text-slate-500 font-mono">
                          {order.createdAt}
                        </td>
                        <td className="py-3 font-bold text-slate-900 font-mono">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            order.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.status === 'shipped'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {order.status === 'delivered' ? (isAr ? 'تم التوصيل' : 'Delivered') :
                             order.status === 'shipped' ? (isAr ? 'تم الشحن' : 'Shipped') :
                             (isAr ? 'قيد المعالجة' : 'Processing')}
                          </span>
                        </td>
                        <td className="py-3 text-end">
                          <button
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Printer className="w-3 h-3 text-slate-500" />
                            <span>{isAr ? 'الفاتورة' : 'Invoice'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Setup Checklist */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-700 uppercase font-mono">
                {isAr ? 'إطلاق المبيعات' : 'GROWTH TIPS'}
              </span>
              <h4 className="text-base font-bold text-slate-900">
                {isAr ? 'شارك رابط متجرك مع زبائنك وابدأ باستقبال الطلبات' : 'Share your store link with customers to start selling'}
              </h4>
              <p className="text-xs text-slate-600">
                {isAr ? `رابط متجرك المباشر: ${store.settings.subdomain}` : `Your live storefront: ${store.settings.subdomain}`}
              </p>
            </div>
            <button
              onClick={onOpenLivePreview}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 whitespace-nowrap cursor-pointer transition-all active:scale-98"
            >
              {isAr ? 'زيارة المتجر الحي الآن' : 'Visit Live Store Now'}
            </button>
          </div>

        </div>
      )}

      {/* ─── TAB: PRODUCTS ─── */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isAr ? 'كتالوج المنتجات والمخزون' : 'Product Catalog & Inventory'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr ? 'أضف منتجاتك وعدّل الأسعار والكميات المتاحة للبيع' : 'Manage your items, prices, and available stock units'}
              </p>
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة منتج جديد' : 'New Product'}</span>
            </button>
          </div>

          {storeProducts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">
                {isAr ? 'لا توجد منتجات مسجلة في هذا المتجر حتى الآن.' : 'No products found in this store.'}
              </p>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold cursor-pointer"
              >
                {isAr ? 'أضف أول منتج الآن' : 'Add First Product'}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500">
                    <th className="py-2.5 text-start font-semibold">{isAr ? 'المنتج' : 'Product'}</th>
                    <th className="py-2.5 text-start font-semibold">{isAr ? 'رمز SKU' : 'SKU'}</th>
                    <th className="py-2.5 text-start font-semibold">{isAr ? 'سعر البيع' : 'Price'}</th>
                    <th className="py-2.5 text-start font-semibold">{isAr ? 'سعر التكلفة' : 'Cost'}</th>
                    <th className="py-2.5 text-start font-semibold">{isAr ? 'المخزون' : 'Stock'}</th>
                    <th className="py-2.5 text-start font-semibold">{isAr ? 'الحالة' : 'Status'}</th>
                    <th className="py-2.5 text-end font-semibold">{isAr ? 'إجراء' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {storeProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{isAr ? prod.nameAr : prod.name}</div>
                        <div className="text-[11px] text-slate-400">{prod.category}</div>
                      </td>
                      <td className="py-3 font-mono text-slate-500">
                        {prod.sku}
                      </td>
                      <td className="py-3 font-bold text-slate-900 font-mono">
                        {formatPrice(prod.price)}
                      </td>
                      <td className="py-3 font-mono text-slate-500">
                        {prod.costPrice ? formatPrice(prod.costPrice) : '—'}
                      </td>
                      <td className="py-3">
                        {isFeatureActive('stockAdjuster') ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onUpdateProductStock(prod.id, Math.max(0, prod.stock - 1))}
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-slate-900 w-8 text-center">{prod.stock}</span>
                            <button
                              onClick={() => onUpdateProductStock(prod.id, prod.stock + 1)}
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono font-bold text-slate-900">{prod.stock}</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prod.stock > 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {prod.stock > 0 ? (isAr ? 'متوفر' : 'In Stock') : (isAr ? 'نفذ المخزون' : 'Out of Stock')}
                        </span>
                      </td>
                      <td className="py-3 text-end">
                        <button
                          onClick={() => onDeleteProduct(prod.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title={isAr ? 'حذف المنتج' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: ORDERS ─── */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">
              {isAr ? 'إدارة الطلبات والشحن والفواتير' : 'Customer Orders & Fulfillment'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAr ? 'تحديث حالات الشحن وتأكيد التسليم وطباعة الفواتير الرسمية للزبائن' : 'Update dispatch status, tracking, and generate commercial invoices'}
            </p>
          </div>

          {storeOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              {isAr ? 'لا توجد طلبات بعد. زر المتجر الحي وضع طلب تجريبي لمعاينته هنا.' : 'No orders yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500">
                    <th className="py-2.5 text-start font-semibold">{isAr ? 'رقم الطلب' : 'Order ID'}</th>
                    <th className="py-2.5 text-start font-semibold">{isAr ? 'بيانات العميل' : 'Customer'}</th>
                    <th className="py-2.5 text-start font-semibold">{isAr ? 'المنتجات' : 'Items'}</th>
                    <th className="py-2.5 text-start font-semibold">{isAr ? 'الإجمالي' : 'Total'}</th>
                    <th className="py-2.5 text-start font-semibold">{isAr ? 'طريقة الدفع' : 'Payment'}</th>
                    <th className="py-2.5 text-start font-semibold">{isAr ? 'حالة الطلب' : 'Status'}</th>
                    <th className="py-2.5 text-end font-semibold">{isAr ? 'الفاتورة' : 'Invoice'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {storeOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-mono font-bold text-slate-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{order.customerName}</div>
                        <div className="text-[11px] text-slate-500">{order.customerPhone}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{order.customerCity}</div>
                      </td>
                      <td className="py-3 text-slate-600">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="text-[11px]">
                            {it.quantity}x {isAr ? it.product.nameAr : it.product.name}
                          </div>
                        ))}
                      </td>
                      <td className="py-3 font-bold text-slate-900 font-mono">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3 text-slate-500 font-medium text-[11px]">
                        {order.paymentMethod}
                      </td>
                      <td className="py-3">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer"
                        >
                          <option value="pending">{isAr ? 'قيد الانتظار' : 'Pending'}</option>
                          <option value="processing">{isAr ? 'قيد التجهيز' : 'Processing'}</option>
                          <option value="shipped">{isAr ? 'تم الشحن' : 'Shipped'}</option>
                          <option value="delivered">{isAr ? 'تم التوصيل' : 'Delivered'}</option>
                        </select>
                      </td>
                      <td className="py-3 text-end">
                        {isFeatureActive('invoicing') ? (
                          <button
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>{isAr ? 'طباعة' : 'Print'}</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: CUSTOMERS ─── */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">
              {isAr ? 'قاعدة بيانات العملاء' : 'Customer Directory'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAr ? 'سجل الزبائن الذين قاموا بالشراء من متجرك مع إجمالي مشترياتهم' : 'Client profiles, purchase histories, and contact info'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="py-2.5 text-start font-semibold">{isAr ? 'العميل' : 'Customer'}</th>
                  <th className="py-2.5 text-start font-semibold">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th className="py-2.5 text-start font-semibold">{isAr ? 'الهاتف' : 'Phone'}</th>
                  <th className="py-2.5 text-start font-semibold">{isAr ? 'المدينة' : 'City'}</th>
                  <th className="py-2.5 text-start font-semibold">{isAr ? 'إجمالي الطلبات' : 'Orders'}</th>
                  <th className="py-2.5 text-end font-semibold">{isAr ? 'إجمالي المشتريات' : 'Total Spent'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {storeCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-bold text-slate-900">
                      {cust.name}
                    </td>
                    <td className="py-3 text-slate-500 font-mono">
                      {cust.email}
                    </td>
                    <td className="py-3 text-slate-500 font-mono">
                      {cust.phone}
                    </td>
                    <td className="py-3 text-slate-700">
                      {cust.city}
                    </td>
                    <td className="py-3 font-mono text-slate-700">
                      {cust.totalOrders} {isAr ? 'طلبات' : 'orders'}
                    </td>
                    <td className="py-3 text-end font-bold font-mono text-slate-900">
                      {formatPrice(cust.totalSpent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB: COUPONS ─── */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isAr ? 'كوبونات الخصم والعروض الترويجية' : 'Promotional Discount Codes'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr ? 'أنشئ أكواد خصم لتحفيز زبائنك وزيادة متوسط قيمة السلة' : 'Create percentage or fixed discount codes for marketing campaigns'}
              </p>
            </div>

            <button
              onClick={() => setShowAddCouponModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إنشاء كود خصم' : 'New Coupon'}</span>
            </button>
          </div>

          {storeCoupons.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              {isAr ? 'لا توجد كوبونات مسجلة. اضغط "إنشاء كود خصم" للبدء.' : 'No coupons active.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {storeCoupons.map((cpn) => (
                <div key={cpn.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded">
                      {cpn.code}
                    </span>
                    <button
                      onClick={() => onToggleCoupon(cpn.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                        cpn.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cpn.isActive ? (isAr ? 'مفعل' : 'Active') : (isAr ? 'معطل' : 'Disabled')}
                    </button>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>
                      {isAr ? 'قيمة الخصم:' : 'Discount:'}{' '}
                      <span className="font-bold text-slate-900">
                        {cpn.discountType === 'percentage' ? `${cpn.value}%` : `${cpn.value} ${isAr ? 'ر.س' : 'SAR'}`}
                      </span>
                    </div>
                    <div>
                      {isAr ? 'الحد الأدنى للطلب:' : 'Min Order:'}{' '}
                      <span className="font-mono">{cpn.minOrder} {isAr ? 'ر.س' : 'SAR'}</span>
                    </div>
                    <div>
                      {isAr ? 'مرات الاستخدام:' : 'Uses:'}{' '}
                      <span className="font-mono">{cpn.usageCount || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: PLANS ─── */}
      {activeTab === 'plans' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
          <PlansPricingView
            currentPlan={store.plan}
            onChangePlan={onUpdateStorePlan}
            language={language}
            currency={currency}
          />
        </div>
      )}

      {/* ─── TAB: SETTINGS ─── */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">
              {isAr ? 'إعدادات المتجر والشحن والحساب البنكي' : 'Store Settings & Payout Preferences'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAr ? 'تخصيص سياسات الشحن والضريبة والحساب البنكي لتحويل الأرباح' : 'Configure delivery fees, tax rates, and payout banking details'}
            </p>
          </div>

          {/* Quick Features & Settings Switcher Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  {isAr ? 'نظام التحكم في إعدادات وخصائص المتجر (الأزرار والحذف)' : 'Store Features & Settings Button / Delete System'}
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {isAr
                    ? `لديك ${activeStoreFeaturesCount} خاصية وإعداد نشط في المتجر. يمكنك تفعيل، إلغاء تنشيط، أو حذف أي ميزة بنقرة زر واحدة.`
                    : `${activeStoreFeaturesCount} active features & settings. Toggle or delete modules with instant live update.`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('storeFeatures')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isAr ? 'فتح لوحة الأزرار والحذف 🎛️' : 'Open Button & Delete Panel 🎛️'}</span>
            </button>
          </div>

          {/* Store URL & Link Formats Guide Card */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {isAr ? 'روابط المتجر ونوع الظهور (الرابط العادي القياسي vs النطاق المخصص)' : 'Store Link Formats (Standard Normal URL vs Subdomain)'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {isAr 
                      ? 'اختر الرابط الذي تفضل مشاركته مع الزبائن أو استخدامه في المتصفحات الأخرى'
                      : 'Choose between the direct standard URL and your branded subdomain'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'فتح نافذة المشاركة والباركود' : 'Share & QR Window'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* 1. Normal Standard Link */}
              <div className={`p-4 rounded-xl border transition-all ${
                preferredLinkFormat === 'standard' ? 'border-indigo-400 bg-white ring-2 ring-indigo-500/10 shadow-xs' : 'border-slate-200 bg-white/70'
              }`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-slate-900 text-xs">
                      {isAr ? '1. الرابط العادي القياسي (Direct URL)' : '1. Standard Direct URL'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {isAr ? 'يعمل فوراً ⚡' : 'Works Instantly ⚡'}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[11px] truncate select-all mb-2.5">
                  {getStandardStoreUrl()}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  {isAr 
                    ? 'هذا هو الرابط الفعلي الذي يفتح المتجر مباشرة في أي متصفح (Safari, Chrome, Firefox) بدون أي إعداد، ومثالي لإرساله للعملاء في واتساب أو تجربته في نافذة أخرى.'
                    : 'This standard web link works in any browser immediately without extra configuration. Great for WhatsApp and testing in any browser.'}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyStoreLink('standard')}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نسخ الرابط العادي' : 'Copy Normal Link'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredLinkFormat('standard')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      preferredLinkFormat === 'standard' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {preferredLinkFormat === 'standard' ? (isAr ? 'محدد كافتراضي ✓' : 'Default ✓') : (isAr ? 'جعله الافتراضي' : 'Set Default')}
                  </button>
                </div>
              </div>

              {/* 2. Custom Subdomain Link */}
              <div className={`p-4 rounded-xl border transition-all ${
                preferredLinkFormat === 'subdomain' ? 'border-indigo-400 bg-white ring-2 ring-indigo-500/10 shadow-xs' : 'border-slate-200 bg-white/70'
              }`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-bold text-slate-900 text-xs">
                      {isAr ? '2. النطاق الفرعي / المخصص (Subdomain)' : '2. Custom Subdomain'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {isAr ? 'يتطلب DNS' : 'Requires DNS'}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 text-indigo-300 font-mono text-[11px] truncate select-all mb-2.5">
                  {getSubdomainUrl()}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  {isAr 
                    ? 'رابط باسم تجاري فرعي لمتجرك. في بيئة الإنتاج الفعلية يتم توجيهه بسجل DNS CNAME لنطاقك الخاص.'
                    : 'A clean branded subdomain format. In production environments, this maps to custom domains via DNS CNAME.'}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyStoreLink('subdomain')}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نسخ النطاق الفرعي' : 'Copy Subdomain'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredLinkFormat('subdomain')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      preferredLinkFormat === 'subdomain' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {preferredLinkFormat === 'subdomain' ? (isAr ? 'محدد كافتراضي ✓' : 'Default ✓') : (isAr ? 'جعله الافتراضي' : 'Set Default')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  {isAr ? 'تكلفة الشحن الثابتة (ر.س)' : 'Flat Shipping Rate'}
                </label>
                <input
                  type="number"
                  value={shippingRate}
                  onChange={(e) => setShippingRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  {isAr ? 'الشحن المجاني عند الطلب بأكثر من (ر.س)' : 'Free Shipping Threshold'}
                </label>
                <input
                  type="number"
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  {isAr ? 'نسبة ضريبة القيمة المضافة (%)' : 'VAT / Tax Rate (%)'}
                </label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  {isAr ? 'اسم البنك للتحويلات' : 'Payout Bank Name'}
                </label>
                <input
                  type="text"
                  value={payoutBank}
                  onChange={(e) => setPayoutBank(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1.5">
                  {isAr ? 'رقم الآيبان البنكي (IBAN)' : 'IBAN Account Number'}
                </label>
                <input
                  type="text"
                  value={payoutIban}
                  onChange={(e) => setPayoutIban(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm cursor-pointer"
            >
              {isAr ? 'حفظ إعدادات المتجر' : 'Save Store Settings'}
            </button>
          </form>
        </div>
      )}

      {/* ─── TAB: DEVELOPER (Supabase & GitHub) ─── */}
      {activeTab === 'developer' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">
              {isAr ? 'التكامل التقني مع Supabase و GitHub' : 'Developer Integrations & Data Sync'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAr ? 'ربط مباشر لقاعدة بيانات متجرك والتحكم بنسخ الأكواد والنشر التلقائي' : 'Database schema migration, real-time sync, and Git repository hooks'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Supabase Status */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Supabase Database</h4>
                    <span className="text-[10px] text-emerald-600 font-mono font-bold">Connected • PostgreSQL 16</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {isAr ? 'متصل بنجاح' : 'Connected'}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1 font-mono text-[11px]">
                <div>URL: {supabaseConfig.projectUrl}</div>
                <div>Tables: stores, store_products, store_orders</div>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(supabaseSql);
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 2000);
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedSql ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? (isAr ? 'تم نسخ كود SQL بنجاح!' : 'SQL Copied!') : (isAr ? 'نسخ مخطط قاعدة البيانات (SQL Schema)' : 'Copy SQL Schema')}</span>
              </button>
            </div>

            {/* GitHub Status */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">GitHub Repository</h4>
                    <span className="text-[10px] text-indigo-600 font-mono font-bold">{gitHubConfig.repoUrl}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 font-mono">
                  {gitHubConfig.branch}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1 font-mono text-[11px]">
                <div>Repository: {gitHubConfig.repoUrl}</div>
                <div>Branch: {gitHubConfig.branch} (Auto-deploy CI/CD)</div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-500">
                {isAr
                  ? 'أي تعديل على المنتجات أو إعدادات المتجر يمكن تصديره ومزامنته فورياً مع مستودع GitHub.'
                  : 'All store settings and schemas can be synced continuously with your GitHub repository.'}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─── TAB: FEATURES MANAGEMENT ─── */}
      {activeTab === 'features' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {isAr ? 'التحكم في خصائص المنصة (تفعيل / إلغاء تنشيط / حذف)' : 'Platform Feature & Module Flags'}
                </h3>
                <span className="text-xs font-mono font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full">
                  {activeFeaturesCount} / {features.length} {isAr ? 'نشط' : 'Active'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAr
                  ? 'يمكنك تفعيل أو إيقاف أو حذف أي ميزة في المنصة بنقرة زر واحدة دون الحاجة لتعديل برمجي.'
                  : 'Toggle, deactivate, or remove any core platform feature with instant live reactivity.'}
              </p>
            </div>

            <button
              onClick={onOpenFeaturesModal}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>{isAr ? 'فتح النافذة الشاملة للخصائص' : 'Open Full Feature Manager'}</span>
            </button>
          </div>

          {/* Quick Notice */}
          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                {isAr
                  ? 'التغييرات تطبق فوراً: إلغاء تنشيط خاصية يخفي تبويبها وأزرارها من المتجر، ويمكنك استعادتها في أي وقت.'
                  : 'Changes take effect immediately across all interfaces, live store, and customer checkout.'}
              </span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feat) => {
              const isEnabled = feat.isEnabled && !feat.isRemoved;

              return (
                <div
                  key={feat.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                    feat.isRemoved
                      ? 'bg-rose-50/30 border-rose-200 opacity-75'
                      : isEnabled
                      ? 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {isAr ? feat.nameAr : feat.name}
                        </span>

                        {feat.isRemoved ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            {isAr ? 'محذوفة' : 'Removed'}
                          </span>
                        ) : isEnabled ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {isAr ? 'نشطة ✓' : 'Active'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            {isAr ? 'معطلة' : 'Disabled'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        {isAr ? feat.descriptionAr : feat.description}
                      </p>
                    </div>

                    {/* Switch Toggle */}
                    {!feat.isRemoved && (
                      <button
                        onClick={() => onToggleFeature(feat.id)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          feat.isEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                        }`}
                        role="switch"
                        aria-checked={feat.isEnabled}
                        title={feat.isEnabled ? (isAr ? 'إلغاء التنشيط' : 'Disable') : (isAr ? 'تفعيل' : 'Enable')}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            feat.isEnabled
                              ? (isAr ? '-translate-x-5' : 'translate-x-5')
                              : 'translate-x-0'
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {feat.id}
                    </span>

                    {feat.isRemoved ? (
                      <button
                        onClick={() => onRestoreFeature(feat.id)}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{isAr ? 'استعادة الخاصية' : 'Restore'}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleFeature(feat.id)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition-colors ${
                            feat.isEnabled
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {feat.isEnabled ? (isAr ? 'إلغاء التنشيط' : 'Deactivate') : (isAr ? 'تفعيل الخاصية' : 'Activate')}
                        </button>

                        <button
                          onClick={() => onRemoveFeature(feat.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                          title={isAr ? 'حذف أو استبعاد من المنصة' : 'Remove from view'}
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{isAr ? 'حذف' : 'Remove'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── TAB: STORE FEATURES (SELLER TOGGLES & DELETION) ─── */}
      {activeTab === 'storeFeatures' && storeFeatures && (
        <div className="space-y-6">
          {/* Direct Homepage Control Shortcut Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-emerald-600/15">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
                {isAr ? '⚡ جديد: التحكم المباشر من الصفحة الرئيسية' : '⚡ Live Homepage Control'}
              </span>
              <h4 className="text-sm sm:text-base font-extrabold">
                {isAr ? 'تحكّم في كل أقسام متجرك مباشرة من الصفحة الرئيسية' : 'Control All Store Sections Directly on Homepage'}
              </h4>
              <p className="text-xs text-white/80 max-w-2xl leading-relaxed">
                {isAr
                  ? 'يمكنك التعديل والحذف والتفعيل الفوري لأي قسم بالضغط على الزر وأمامه زر التعديل ✏️ وزر الحذف 🗑️ أثناء تصفحك للمتجر.'
                  : 'Toggle, edit, or delete any section directly on the live homepage via the 3-button control system.'}
              </p>
            </div>
            {(onOpenStandaloneStore || onOpenLivePreview) && (
              <button
                onClick={onOpenStandaloneStore || onOpenLivePreview}
                className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-slate-100 font-extrabold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-sm transition-all cursor-pointer hover:scale-102"
              >
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'فتح الصفحة الرئيسية للتحكم الآن' : 'Control Homepage Now'}</span>
              </button>
            )}
          </div>

          <StoreFeaturesManager
            storeFeatures={storeFeatures}
            onToggleStoreFeature={onToggleStoreFeature || (() => {})}
            onRemoveStoreFeature={onRemoveStoreFeature || (() => {})}
            onRestoreStoreFeature={onRestoreStoreFeature || (() => {})}
            onEnableAllStoreFeatures={onEnableAllStoreFeatures || (() => {})}
            onResetDefaultStoreFeatures={onResetDefaultStoreFeatures || (() => {})}
            onAddStoreFeature={onAddStoreFeature}
            onUpdateStoreFeature={onUpdateStoreFeature}
            language={language}
            onViewStore={onOpenStandaloneStore || onOpenLivePreview}
          />
        </div>
      )}

      {/* ─── MODAL: ADD PRODUCT ─── */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {isAr ? 'إضافة منتج جديد للمتجر' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'اسم المنتج (بالإنجليزية)' : 'Product Name (English)'} *
                </label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Leather Travel Backpack"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'اسم المنتج (بالعربية)' : 'Product Name (Arabic)'}
                </label>
                <input
                  type="text"
                  value={newProdNameAr}
                  onChange={(e) => setNewProdNameAr(e.target.value)}
                  placeholder="مثال: حقيبة سفر جلدية فاخرة"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isAr ? 'سعر البيع (ر.س)' : 'Selling Price'} *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isAr ? 'سعر التكلفة (ر.س)' : 'Cost Price'}
                  </label>
                  <input
                    type="number"
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isAr ? 'الكمية المتوفرة بالمخزون' : 'Stock Quantity'}
                  </label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isAr ? 'التصنيف' : 'Category'}
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="Fashion & Apparel">{isAr ? 'أزياء وملابس' : 'Fashion & Apparel'}</option>
                    <option value="Accessories">{isAr ? 'إكسسوارات وساعات' : 'Accessories'}</option>
                    <option value="Perfumes">{isAr ? 'عطور وبخور' : 'Perfumes'}</option>
                    <option value="Electronics">{isAr ? 'إلكترونيات' : 'Electronics'}</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  {isAr ? 'حفظ المنتج' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: ADD COUPON ─── */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {isAr ? 'إنشاء كود خصم جديد' : 'Create Discount Code'}
              </h3>
              <button
                onClick={() => setShowAddCouponModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCouponSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'رمز الكوبون' : 'Coupon Code'} *
                </label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER25"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-mono focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isAr ? 'نوع الخصم' : 'Discount Type'}
                  </label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="percentage">{isAr ? 'نسبة مئوية (%)' : 'Percentage (%)'}</option>
                    <option value="fixed">{isAr ? 'مبلغ ثابت (ر.س)' : 'Fixed Amount'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {isAr ? 'قيمة الخصم' : 'Value'}
                  </label>
                  <input
                    type="number"
                    required
                    value={couponValue}
                    onChange={(e) => setCouponValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'الحد الأدنى لقيمة الطلب (ر.س)' : 'Minimum Order Amount'}
                </label>
                <input
                  type="number"
                  value={couponMinOrder}
                  onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCouponModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  {isAr ? 'تفعيل الكوبون' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: INVOICE PRINT VIEW ─── */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {isAr ? `فاتورة ضريبية رسمية #${selectedInvoiceOrder.orderNumber}` : `Commercial Invoice #${selectedInvoiceOrder.orderNumber}`}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-4">
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">{isAr ? store.nameAr : store.name}</div>
                  <div className="text-slate-500 font-mono">{store.settings.subdomain}</div>
                </div>
                <div className="text-end">
                  <div className="font-mono font-bold text-slate-900">{selectedInvoiceOrder.orderNumber}</div>
                  <div className="text-slate-500">{selectedInvoiceOrder.createdAt}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3">
                <div>
                  <div className="font-bold text-slate-700">{isAr ? 'بيانات العميل:' : 'Customer Details:'}</div>
                  <div className="text-slate-900 font-medium">{selectedInvoiceOrder.customerName}</div>
                  <div className="text-slate-500 font-mono">{selectedInvoiceOrder.customerPhone}</div>
                  <div className="text-slate-500">{selectedInvoiceOrder.customerCity}</div>
                </div>
                <div>
                  <div className="font-bold text-slate-700">{isAr ? 'طريقة الدفع:' : 'Payment Method:'}</div>
                  <div className="text-slate-900">{selectedInvoiceOrder.paymentMethod}</div>
                  <div className="text-emerald-600 font-bold mt-1">✓ {isAr ? 'تم استلام المبلغ بنجاح' : 'Paid in Full'}</div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-start">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-200">
                    <th className="py-1.5 text-start">{isAr ? 'المنتج' : 'Item'}</th>
                    <th className="py-1.5 text-center">{isAr ? 'الكمية' : 'Qty'}</th>
                    <th className="py-1.5 text-end">{isAr ? 'السعر' : 'Price'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoiceOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2 font-medium text-slate-800">{isAr ? it.product.nameAr : it.product.name}</td>
                      <td className="py-2 text-center font-mono">{it.quantity}</td>
                      <td className="py-2 text-end font-mono font-bold">{formatPrice(it.product.price * it.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-slate-300 pt-3 flex justify-between font-extrabold text-sm text-slate-900">
                <span>{isAr ? 'المجموع الإجمالي المطلوب:' : 'Grand Total:'}</span>
                <span className="font-mono text-indigo-700">{formatPrice(selectedInvoiceOrder.total)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isAr ? 'طباعة الفاتورة الآن' : 'Print Invoice'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: SHARE & NORMAL STORE LINK ─── */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 text-start">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isAr ? 'مشاركة ورابط المتجر للعملاء' : 'Share & Store Link'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isAr ? 'روابط متجرك الجزائري المستقل المخصصة للمتصفحات والزبائن' : 'Your live customer-facing store links'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsShareModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Link Format Switcher */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                {isAr ? 'اختر صيغة الرابط المطلوبة:' : 'Select Link Format:'}
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPreferredLinkFormat('standard')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    preferredLinkFormat === 'standard'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'رابط عادي مباشر ⚡' : 'Standard URL ⚡'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredLinkFormat('subdomain')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    preferredLinkFormat === 'subdomain'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'نطاق فرعي 🌐' : 'Subdomain 🌐'}</span>
                </button>
              </div>
            </div>

            {/* URL Input Box with Copy Button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  {preferredLinkFormat === 'standard' 
                    ? (isAr ? 'الرابط العادي القياسي (جاهز للنسخ والمشاركة):' : 'Standard Direct URL (Ready to Share):')
                    : (isAr ? 'رابط النطاق الفرعي التجاري:' : 'Branded Subdomain URL:')}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{preferredLinkFormat === 'standard' ? (isAr ? 'يعمل في أي متصفح فوراً' : 'Works anywhere') : (isAr ? 'صيغة تجارية' : 'Branded')}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={activeDisplayUrl}
                  className="flex-1 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl p-3 border border-slate-800 select-all focus:outline-none"
                />
                <button
                  onClick={() => handleCopyStoreLink(preferredLinkFormat)}
                  className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors whitespace-nowrap"
                >
                  <Copy className="w-4 h-4" />
                  <span>{isAr ? 'نسخ' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Explanation Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'كيف تجعله يظهر في شكل رابط عادي يعمل في أي متصفح؟' : 'How does the normal link work?'}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-900/80">
                {isAr
                  ? 'الرابط العادي القياسي أعلاه يبدأ بنطاق الموقع الحالي متبوعاً بمعرّف المتجر (?mode=store&store=...). يمكنك نسخه وفتحه في أي متصفح آخر (Chrome, Safari, Edge, Firefox) أو إرساله للزبائن على الهواتف وسيفتح متجرك المستقل فوراً بكامل منتجاته وسلته.'
                  : 'The standard URL above appends the store parameters (?mode=store&store=...). It can be opened in any browser or device immediately without DNS configuration.'}
              </p>
            </div>

            {/* QR Code & Share Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* QR Code Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-2">
                {/* SVG QR Code Simulation */}
                <div className="w-24 h-24 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center">
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
                <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isAr ? 'امسح الباركود بهاتفك' : 'Scan with mobile camera'}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 flex flex-col justify-center">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    (isAr ? 'تفضل بزيارة متجري الإلكتروني: ' : 'Visit my store: ') + activeDisplayUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>{isAr ? 'مشاركة عبر واتساب 💬' : 'Share on WhatsApp 💬'}</span>
                </a>

                <button
                  type="button"
                  onClick={onOpenStandaloneStore || onOpenLivePreview}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isAr ? 'فتح وتجربة المتجر الآن' : 'Test Store Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
