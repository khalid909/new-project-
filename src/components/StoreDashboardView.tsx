import React, { useState, useMemo } from 'react';
import { 
  Store, Product, Order, Customer, Coupon, SellerUser, 
  Currency, Language, PlanType, SupabaseConfig, GitHubConfig, 
  PlatformFeatureItem, StoreFeatureItem, WilayaShippingRate, ProductColor, DnsRecord
} from '../types';
import { CURRENCY_RATES } from '../data/initialData';
import { DEFAULT_WILAYAS_69 } from '../data/wilayasData';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { 
  LayoutDashboard, ShoppingCart, Package, Truck, Users, 
  Settings, Plus, Trash2, Edit2, Check, X, Search, 
  ExternalLink, Phone, MapPin, DollarSign, TrendingUp, 
  AlertCircle, ShieldCheck, Sparkles, Image as ImageIcon, 
  Palette, RefreshCw, Eye, ArrowUpRight, CheckCircle2,
  AlertTriangle, Filter, Building, CreditCard, Globe,
  SlidersHorizontal, Lock, Copy, Layers, Power, Clock,
  HelpCircle, Monitor, Wrench, Shield, CheckSquare, Tag,
  Link2, Save, RotateCcw, Home, Ticket, LayoutGrid, Share2, 
  Headphones, ChevronDown, ChevronUp, Menu, Bell, Percent, Send,
  Store as StoreIcon, FileText, Smartphone, Laptop, MessageCircle, QrCode
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
  storeFeatures: StoreFeatureItem[];
  onToggleFeature: (id: string) => void;
  onRemoveFeature: (id: string) => void;
  onRestoreFeature: (id: string) => void;
  onOpenFeaturesModal: () => void;
  onToggleStoreFeature: (id: string) => void;
  onRemoveStoreFeature: (id: string) => void;
  onRestoreStoreFeature: (id: string) => void;
  onEnableAllStoreFeatures: () => void;
  onResetDefaultStoreFeatures: () => void;
  onAddStoreFeature: (feature: any) => void;
  onUpdateStoreFeature: (feature: any) => void;
  onUpdateStoreSettings: (settings: any) => void;
  onUpdateStore?: (updated: Partial<Store>) => void;
  onUpdateStorePlan: (plan: PlanType) => void;
  onAddProduct: (prod: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateProductStock: (id: string, stock: number) => void;
  onUpdateOrderStatus: (id: string, status: any) => void;
  onAddCoupon: (cpn: Coupon) => void;
  onToggleCoupon: (id: string) => void;
  onOpenLivePreview: () => void;
  onOpenStandaloneStore: () => void;
  onOpenCreateNewStore: () => void;
  onLogout?: () => void;
}

const LOGO_PRESETS = [
  { name: 'حقيبة براند', icon: '🛍️', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80' },
  { name: 'أزياء وموضة', icon: '👗', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&auto=format&fit=crop&q=80' },
  { name: 'عطور وكوزمتيك', icon: '💎', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&auto=format&fit=crop&q=80' },
  { name: 'إلكترونيات وذكاء', icon: '📱', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop&q=80' },
  { name: 'أحذية ورياضة', icon: '👟', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80' },
  { name: 'ملكي فاخر', icon: '👑', url: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=200&auto=format&fit=crop&q=80' },
];

const THEME_PALETTES = [
  { name: 'أخضر زمردي', hex: '#10B981' },
  { name: 'أزرق ملكي', hex: '#2563EB' },
  { name: 'بنفسجي فاخر', hex: '#8B5CF6' },
  { name: 'أسود داكن فخم', hex: '#0F172A' },
  { name: 'ذهبي عنبري', hex: '#D97706' },
  { name: 'وردي أنيق', hex: '#EC4899' },
  { name: 'أحمر قرمزي', hex: '#EF4444' },
  { name: 'تركواز بحري', hex: '#06B6D4' },
];

const BANNER_PRESETS = [
  { name: 'أزياء وملابس راقية', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80' },
  { name: 'أجهزة وإلكترونيات', url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80' },
  { name: 'عطور ومستحضرات تجميل', url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&auto=format&fit=crop&q=80' },
  { name: 'تخفيضات ومهرجان تسوق', url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80' },
  { name: 'أحذية ومستلزمات رياضية', url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200&auto=format&fit=crop&q=80' },
];

export const StoreDashboardView: React.FC<StoreDashboardViewProps> = ({
  store,
  products,
  orders,
  customers,
  coupons = [],
  currency,
  language,
  onUpdateStoreSettings,
  onUpdateStore,
  onAddProduct,
  onDeleteProduct,
  onUpdateProductStock,
  onUpdateOrderStatus,
  onOpenLivePreview
}) => {
  const isAr = language === 'ar';
  
  // Navigation Tabs matching user reference sidebar:
  // لوحة التحكم | الطلبيات | المنتجات | Up Sells | كوبون | العملاء | متجر | إحصائيات | الفواتير | التطبيقات | التسويق بالعمولة | الدعم | إعدادات
  type DashboardTab = 
    | 'overview' 
    | 'orders' 
    | 'products' 
    | 'upsells' 
    | 'upsells_all' 
    | 'upsells_new' 
    | 'coupons' 
    | 'customers' 
    | 'store' 
    | 'analytics' 
    | 'invoices' 
    | 'apps' 
    | 'affiliate' 
    | 'support' 
    | 'settings'
    | 'shipping'
    | 'domains'
    | 'store_controls';

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpsellsMenuOpen, setIsUpsellsMenuOpen] = useState(true);

  // Up Sells State
  const [upsellsList, setUpsellsList] = useState([
    {
      id: 'upsell_1',
      title: 'عرض القطعتين + 1 مجاناً (3 بسعر 2)',
      productId: products[0]?.id || 'p1',
      productName: products[0]?.nameAr || 'المنتج المميز',
      type: 'buy_x_get_y',
      discountPercentage: 33,
      triggerType: 'cart_popup',
      status: 'active',
      viewsCount: 420,
      conversionsCount: 78,
      extraRevenue: 156000
    },
    {
      id: 'upsell_2',
      title: 'تخفيض 25% على الإكسسوار عند الشراء',
      productId: products[1]?.id || 'p2',
      productName: products[1]?.nameAr || 'حزام جلدي فاخر',
      type: 'discount',
      discountPercentage: 25,
      triggerType: 'product_page',
      status: 'active',
      viewsCount: 290,
      conversionsCount: 45,
      extraRevenue: 89000
    }
  ]);
  const [newUpsellTitle, setNewUpsellTitle] = useState('');
  const [newUpsellProdId, setNewUpsellProdId] = useState(products[0]?.id || '');
  const [newUpsellDiscount, setNewUpsellDiscount] = useState(20);
  const [newUpsellType, setNewUpsellType] = useState('discount');
  const [newUpsellTrigger, setNewUpsellTrigger] = useState('cart_popup');

  // Affiliate State
  const [affiliateCommission, setAffiliateCommission] = useState(10);
  const [affiliateCopied, setAffiliateCopied] = useState(false);

  // Support Ticket State
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatPrice = (amount: number) => {
    const rateInfo = CURRENCY_RATES[currency] || { rate: 1, symbol: 'DZD', symbolAr: 'د.ج' };
    const converted = Math.round(amount * rateInfo.rate);
    return `${converted.toLocaleString()} ${isAr ? rateInfo.symbolAr : rateInfo.symbol}`;
  };

  // ─────────────────────────────────────────────────────────────
  // 1. ALGERIA 69 WILAYAS SHIPPING STATE & MANAGEMENT
  // ─────────────────────────────────────────────────────────────
  const [wilayasList, setWilayasList] = useState<WilayaShippingRate[]>(() => {
    try {
      const saved = localStorage.getItem(`wasladz_shipping_wilayas_${store.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_WILAYAS_69;
  });

  const [shippingSearch, setShippingSearch] = useState('');
  const [shippingZoneFilter, setShippingZoneFilter] = useState<string>('all');
  const [editingWilaya, setEditingWilaya] = useState<WilayaShippingRate | null>(null);
  const [editDeskPrice, setEditDeskPrice] = useState<number>(0);
  const [editHomePrice, setEditHomePrice] = useState<number>(0);

  const saveWilayas = (newList: WilayaShippingRate[]) => {
    setWilayasList(newList);
    try {
      localStorage.setItem(`wasladz_shipping_wilayas_${store.id}`, JSON.stringify(newList));
    } catch (e) {}
  };

  const handleToggleWilaya = (code: string) => {
    const updated = wilayasList.map(w => w.code === code ? { ...w, isEnabled: !w.isEnabled } : w);
    saveWilayas(updated);
    showToast(isAr ? 'تم تعديل حالة تفعيل الولاية' : 'Wilaya status toggled');
  };

  const handleDeleteWilaya = (code: string) => {
    const updated = wilayasList.map(w => w.code === code ? { ...w, isDeleted: true } : w);
    saveWilayas(updated);
    showToast(isAr ? 'تم حذف الولاية من قائمة الشحن' : 'Wilaya removed from shipping');
  };

  const handleRestoreAllWilayas = () => {
    const reset = DEFAULT_WILAYAS_69.map(w => ({ ...w, isDeleted: false, isEnabled: true }));
    saveWilayas(reset);
    showToast(isAr ? 'تم استعادة كافة الـ 69 ولاية بنجاح' : 'All 69 wilayas restored');
  };

  const handleSavePrices = () => {
    if (!editingWilaya) return;
    const updated = wilayasList.map(w => w.code === editingWilaya.code ? { 
      ...w, 
      deskPrice: Number(editDeskPrice), 
      homePrice: Number(editHomePrice) 
    } : w);
    saveWilayas(updated);
    setEditingWilaya(null);
    showToast(isAr ? `تم تحديث أسعار الشحن لولاية ${editingWilaya.nameAr}` : 'Prices updated');
  };

  const activeWilayasCount = wilayasList.filter(w => w.isEnabled && !w.isDeleted).length;

  const filteredWilayas = useMemo(() => {
    return wilayasList.filter(w => {
      if (w.isDeleted) return false;
      const q = shippingSearch.toLowerCase().trim();
      const matchesSearch = !q || w.nameAr.includes(q) || w.name.toLowerCase().includes(q) || w.code.includes(q);
      const matchesZone = shippingZoneFilter === 'all' || w.zone === shippingZoneFilter;
      return matchesSearch && matchesZone;
    });
  }, [wilayasList, shippingSearch, shippingZoneFilter]);

  // ─────────────────────────────────────────────────────────────
  // 2. PRODUCT MANAGEMENT (UP TO 10 IMAGES + COLORS + SIZES + EDIT)
  // ─────────────────────────────────────────────────────────────
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [prodNameAr, setProdNameAr] = useState('');
  const [prodNameEn, setProdNameEn] = useState('');
  const [prodDescAr, setProdDescAr] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(3900);
  const [prodComparePrice, setProdComparePrice] = useState<number>(4900);
  const [prodCostPrice, setProdCostPrice] = useState<number>(2200);
  const [prodStock, setProdStock] = useState<number>(30);
  const [prodCategory, setProdCategory] = useState(store.categoryAr || 'أزياء وملابس');
  const [prodImages, setProdImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80'
  ]);
  const [primaryImageIdx, setPrimaryImageIdx] = useState<number>(0);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [prodColors, setProdColors] = useState<ProductColor[]>([
    { name: 'Black', nameAr: 'أسود فخم', hex: '#111827' },
    { name: 'Silver', nameAr: 'فضي لامع', hex: '#9CA3AF' }
  ]);
  const [colorHex, setColorHex] = useState('#2563EB');
  const [colorNameAr, setColorNameAr] = useState('أزرق كحلي');
  const [prodSizes, setProdSizes] = useState<string[]>(['M', 'L', 'XL']);
  const [sizeInput, setSizeInput] = useState('');

  // Open Add modal fresh
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdNameAr('');
    setProdNameEn('');
    setProdDescAr('');
    setProdPrice(3900);
    setProdComparePrice(4900);
    setProdCostPrice(2200);
    setProdStock(30);
    setProdImages([
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80'
    ]);
    setPrimaryImageIdx(0);
    setProdColors([
      { name: 'Black', nameAr: 'أسود فخم', hex: '#111827' },
      { name: 'Silver', nameAr: 'فضي لامع', hex: '#9CA3AF' }
    ]);
    setProdSizes(['M', 'L', 'XL']);
    setIsAddProductOpen(true);
  };

  // Open Edit modal populated
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdNameAr(p.nameAr);
    setProdNameEn(p.name);
    setProdDescAr(p.descriptionAr || p.description);
    setProdPrice(p.price);
    setProdComparePrice(p.compareAtPrice || 0);
    setProdCostPrice(p.costPrice || 0);
    setProdStock(p.stock);
    setProdCategory(p.category);
    setProdImages(p.images && p.images.length > 0 ? p.images : [p.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80']);
    setPrimaryImageIdx(0);
    setProdColors((p.colors || []).map(c => typeof c === 'string' ? { name: c, nameAr: c, hex: '#111827' } : c));
    setProdSizes(p.sizes || []);
    setIsAddProductOpen(true);
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (prodImages.length >= 10) {
      showToast(isAr ? 'الحد الأقصى هو 10 صور لكل منتج' : 'Maximum 10 images');
      return;
    }
    setProdImages([...prodImages, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    if (prodImages.length <= 1) {
      showToast(isAr ? 'يجب أن يحتوي المنتج على صورة واحدة على الأقل' : 'At least 1 image required');
      return;
    }
    const updated = prodImages.filter((_, idx) => idx !== index);
    setProdImages(updated);
    if (primaryImageIdx >= updated.length) {
      setPrimaryImageIdx(0);
    }
  };

  const handleAddColor = () => {
    if (!colorNameAr.trim()) return;
    setProdColors([...prodColors, { name: colorNameAr, nameAr: colorNameAr, hex: colorHex }]);
    setColorNameAr('');
  };

  const handleRemoveColor = (hex: string) => {
    setProdColors(prodColors.filter(c => c.hex !== hex));
  };

  const handleAddSize = () => {
    if (!sizeInput.trim()) return;
    if (!prodSizes.includes(sizeInput.trim().toUpperCase())) {
      setProdSizes([...prodSizes, sizeInput.trim().toUpperCase()]);
    }
    setSizeInput('');
  };

  const handleRemoveSize = (sz: string) => {
    setProdSizes(prodSizes.filter(s => s !== sz));
  };

  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodNameAr.trim() || prodPrice <= 0) return;

    const primaryImg = prodImages[primaryImageIdx] || prodImages[0];

    if (editingProduct) {
      // Edit existing product
      const updated: Product = {
        ...editingProduct,
        name: prodNameEn.trim() || prodNameAr.trim(),
        nameAr: prodNameAr.trim(),
        description: prodDescAr.trim(),
        descriptionAr: prodDescAr.trim(),
        price: Number(prodPrice),
        compareAtPrice: Number(prodComparePrice) || undefined,
        costPrice: Number(prodCostPrice) || undefined,
        category: prodCategory,
        stock: Number(prodStock),
        imageUrl: primaryImg,
        images: prodImages,
        colors: prodColors,
        sizes: prodSizes
      };
      // Replace in products
      onDeleteProduct(editingProduct.id);
      onAddProduct(updated);
      showToast(isAr ? 'تم تعديل المنتج وتحديث الصور والمخزون بنجاح ✓' : 'Product updated successfully');
    } else {
      // Create new product
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        storeId: store.id,
        name: prodNameEn.trim() || prodNameAr.trim(),
        nameAr: prodNameAr.trim(),
        description: prodDescAr.trim() || 'منتج أصلي مع دفع عند الاستلام وضمان الجودة لـ 69 ولاية.',
        descriptionAr: prodDescAr.trim() || 'منتج أصلي مع دفع عند الاستلام وضمان الجودة لـ 69 ولاية.',
        price: Number(prodPrice),
        compareAtPrice: Number(prodComparePrice) || undefined,
        costPrice: Number(prodCostPrice) || undefined,
        category: prodCategory,
        stock: Number(prodStock),
        sku: `DZ-${Date.now().toString().slice(-6)}`,
        isPublished: true,
        imageUrl: primaryImg,
        images: prodImages,
        colors: prodColors,
        sizes: prodSizes,
        isFeatured: true
      };
      onAddProduct(newProduct);
      showToast(isAr ? 'تمت إضافة المنتج بنجاح مع الصور والألوان والمقاسات! 🚀' : 'Product created successfully');
    }

    setIsAddProductOpen(false);
  };

  // ─────────────────────────────────────────────────────────────
  // 3. CUSTOM DOMAIN CONFIGURATION FOR MERCHANTS
  // ─────────────────────────────────────────────────────────────
  const [customDomainInput, setCustomDomainInput] = useState(store.settings?.customDomain || '');
  const [isVerifyingDns, setIsVerifyingDns] = useState(false);
  const [domainStatus, setDomainStatus] = useState<'connected' | 'verifying' | 'unlinked'>(() => {
    return store.settings?.customDomain ? 'connected' : 'unlinked';
  });
  const [copiedDnsKey, setCopiedDnsKey] = useState<string | null>(null);

  const dnsRecords: DnsRecord[] = [
    { type: 'CNAME', host: 'www', value: 'cname.wasladz.app', ttl: 'Automatic', status: domainStatus === 'connected' ? 'verified' : 'pending' },
    { type: 'A', host: '@', value: '216.24.57.1', ttl: 'Automatic', status: domainStatus === 'connected' ? 'verified' : 'pending' },
    { type: 'TXT', host: '_wasladz-verify', value: `wasladz-challenge-${store.slug}-${store.id.slice(-6)}`, ttl: 'Automatic', status: domainStatus === 'connected' ? 'verified' : 'pending' }
  ];

  const handleCopyDns = (val: string, key: string) => {
    navigator.clipboard?.writeText(val);
    setCopiedDnsKey(key);
    setTimeout(() => setCopiedDnsKey(null), 2000);
  };

  const handleConnectDomain = () => {
    if (!customDomainInput.trim()) return;
    const clean = customDomainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    setIsVerifyingDns(true);
    setDomainStatus('verifying');

    setTimeout(() => {
      setIsVerifyingDns(false);
      setDomainStatus('connected');
      onUpdateStoreSettings({
        customDomain: clean,
        customDomainStatus: 'connected',
        customDomainSsl: 'active'
      });
      showToast(isAr ? `تم ربط وتفعيل النطاق الخاص (${clean}) بنجاح مع شهادة SSL مجانية! 🔒` : 'Domain connected with SSL');
    }, 1200);
  };

  const handleDisconnectDomain = () => {
    setDomainStatus('unlinked');
    setCustomDomainInput('');
    onUpdateStoreSettings({
      customDomain: undefined,
      customDomainStatus: 'unlinked',
      customDomainSsl: 'inactive'
    });
    showToast(isAr ? 'تم فصل النطاق الخاص والعودة للنطاق المجاني' : 'Domain disconnected');
  };

  // ─────────────────────────────────────────────────────────────
  // 4. THE 3-BUTTON SYSTEM (MAINTENANCE, FOOTER, BANNER, CURRENCIES, LANGUAGES)
  // ─────────────────────────────────────────────────────────────
  // Maintenance Mode State
  const [maintenanceConfig, setMaintenanceConfig] = useState(() => {
    return store.settings?.maintenanceMode || {
      isEnabled: false,
      title: 'المتجر قيد التحديث والصيانة الدورية',
      message: 'نعمل على تحسين تجربة التسوق وإضافة منتجات جديدة. سنعود لاستقبال طلباتكم قريباً!',
      estimatedEndTime: 'خلال ساعتين',
      contactPhone: store.ownerPhone || '0550 00 00 00',
      allowAdminBypass: true,
      isDeleted: false
    };
  });
  const [isEditingMaintenance, setIsEditingMaintenance] = useState(false);

  // Footer State
  const [footerConfig, setFooterConfig] = useState(() => {
    return store.settings?.footerConfig || {
      isEnabled: true,
      copyrightText: `جميع الحقوق محفوظة © ${new Date().getFullYear()} ${store.nameAr}`,
      contactPhone: store.ownerPhone || '0550 00 00 00',
      contactEmail: store.ownerEmail || 'contact@store.dz',
      showSocialLinks: true,
      showWilayasNotice: true,
      isDeleted: false
    };
  });
  const [isEditingFooter, setIsEditingFooter] = useState(false);

  // Banner State
  const [bannerConfig, setBannerConfig] = useState(() => {
    return store.settings?.bannerConfig || {
      isEnabled: true,
      text: '🎉 تخفيضات كبرى لفترة محدودة + شحن مجاني للطلبات أكثر من 8000 د.ج لـ 69 ولاية!',
      link: '#',
      bgColor: '#059669',
      textColor: '#FFFFFF',
      hasCountdown: true,
      countdownHours: 24,
      isDeleted: false
    };
  });
  const [isEditingBanner, setIsEditingBanner] = useState(false);

  // Currencies 3-Button Config
  const [storeCurrencies, setStoreCurrencies] = useState([
    { code: 'DZD' as Currency, name: 'دينار جزائري', symbol: 'DA', symbolAr: 'د.ج', rate: 1, isEnabled: true, isDeleted: false },
    { code: 'EUR' as Currency, name: 'يورو أوروبي', symbol: '€', symbolAr: '€', rate: 0.0068, isEnabled: true, isDeleted: false },
    { code: 'USD' as Currency, name: 'دولار أمريكي', symbol: '$', symbolAr: '$', rate: 0.0074, isEnabled: false, isDeleted: false },
    { code: 'SAR' as Currency, name: 'ريال سعودي', symbol: 'SAR', symbolAr: 'ر.س', rate: 0.028, isEnabled: false, isDeleted: false }
  ]);
  const [editingCurrencyCode, setEditingCurrencyCode] = useState<Currency | null>(null);
  const [editCurrRate, setEditCurrRate] = useState<number>(1);
  const [editCurrSymbol, setEditCurrSymbol] = useState<string>('د.ج');

  // Languages 3-Button Config
  const [storeLanguages, setStoreLanguages] = useState([
    { code: 'ar' as Language, name: 'العربية (الافتراضية)', dir: 'rtl' as const, isEnabled: true, isDeleted: false },
    { code: 'fr' as Language, name: 'Français (الفرنسية)', dir: 'ltr' as const, isEnabled: true, isDeleted: false },
    { code: 'en' as Language, name: 'English (الإنجليزية)', dir: 'ltr' as const, isEnabled: false, isDeleted: false }
  ]);
  const [editingLangCode, setEditingLangCode] = useState<Language | null>(null);
  const [editLangName, setEditLangName] = useState<string>('');

  // ─── INDEPENDENT STORE URL & COPY ───
  const externalStoreUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?mode=store&store=${store.slug}`
    : `?mode=store&store=${store.slug}`;

  const handleCopyStoreUrl = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(externalStoreUrl);
      }
      showToast(isAr ? 'تم نسخ رابط متجرك الخارجي المستقل بنجاح! 📋' : 'Store link copied!');
    } catch (e) {
      showToast(isAr ? 'الرابط: ' + externalStoreUrl : 'Copied');
    }
  };

  // ─── STORE APPEARANCE & CUSTOMIZATION STATE ───
  const [storeNameState, setStoreNameState] = useState(store.nameAr || store.name || '');
  const [storeSloganState, setStoreSloganState] = useState(store.sloganAr || store.slogan || '');
  const [storeDescState, setStoreDescState] = useState(store.descriptionAr || store.description || '');
  const [storeLogoState, setStoreLogoState] = useState(store.logoUrl || '');
  const [storeAccentColorState, setStoreAccentColorState] = useState(store.accentColor || '#10B981');
  const [storeCategoryState, setStoreCategoryState] = useState(store.categoryAr || 'أزياء وملابس');
  const [storePhoneState, setStorePhoneState] = useState(store.supportPhone || store.ownerPhone || '0550123456');
  const [storeInstagramState, setStoreInstagramState] = useState(store.instagramUrl || '');
  const [storeFacebookState, setStoreFacebookState] = useState(store.facebookUrl || '');
  const [storeTiktokState, setStoreTiktokState] = useState(store.tiktokUrl || '');
  const [thankYouMessageState, setThankYouMessageState] = useState(store.settings?.thankYouMessage || 'شكراً لثقتكم بنا! سيتم الاتصال بكم هاتفياً خلال 24 ساعة لتأكيد الطلب وشحنه فوراً.');

  // Hero & Banner Appearance
  const [heroHeadlineState, setHeroHeadlineState] = useState(store.settings?.bannerHeadline || (store.nameAr ? `مرحباً بكم في متجر ${store.nameAr}` : 'تشكيلة حصرية من أرقى المنتجات الأصلية'));
  const [heroSubtitleState, setHeroSubtitleState] = useState(store.settings?.bannerSubtitle || (store.sloganAr || 'جودة مضمونة • توصيل سريع لـ 58 ولاية • الدفع عند الاستلام بعد المعاينة'));
  const [heroCtaTextState, setHeroCtaTextState] = useState(store.settings?.bannerCtaText || 'تسوق التشكيلة الآن 🛍️');
  const [heroImageState, setHeroImageState] = useState(store.settings?.bannerImageUrl || store.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80');
  const [isHeroEnabledState, setIsHeroEnabledState] = useState(true);

  // Layout & Display
  const [productColumnsState, setProductColumnsState] = useState<2 | 3 | 4>(store.settings?.productColumns || 3);
  const [showQuickBuyState, setShowQuickBuyState] = useState<boolean>(store.settings?.showQuickBuy !== false);
  const [showDiscountBadgesState, setShowDiscountBadgesState] = useState<boolean>(store.settings?.showDiscountBadges !== false);
  const [showReviewsState, setShowReviewsState] = useState<boolean>(store.settings?.showReviews !== false);

  // Store Customizer Tabs & Preview
  const [storeCustomizerTab, setStoreCustomizerTab] = useState<'branding' | 'banner' | 'announcement' | 'layout' | 'contact' | 'preview' | 'system'>('branding');
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  // Save full appearance customizations back to Store and Settings
  const handleSaveStoreCustomizations = () => {
    const storeUpdates: Partial<Store> = {
      name: storeNameState,
      nameAr: storeNameState,
      slogan: storeSloganState,
      sloganAr: storeSloganState,
      description: storeDescState,
      descriptionAr: storeDescState,
      logoUrl: storeLogoState,
      accentColor: storeAccentColorState,
      categoryAr: storeCategoryState,
      supportPhone: storePhoneState,
      instagramUrl: storeInstagramState,
      facebookUrl: storeFacebookState,
      tiktokUrl: storeTiktokState,
      bannerUrl: heroImageState,
    };

    const settingsUpdates = {
      themeColor: storeAccentColorState,
      bannerHeadline: heroHeadlineState,
      bannerSubtitle: heroSubtitleState,
      bannerCtaText: heroCtaTextState,
      bannerImageUrl: heroImageState,
      thankYouMessage: thankYouMessageState,
      productColumns: productColumnsState,
      showQuickBuy: showQuickBuyState,
      showDiscountBadges: showDiscountBadgesState,
      showReviews: showReviewsState,
      bannerConfig: bannerConfig,
      footerConfig: footerConfig,
      maintenanceMode: maintenanceConfig
    };

    if (onUpdateStore) {
      onUpdateStore({ ...storeUpdates, settings: { ...store.settings, ...settingsUpdates } });
    }
    onUpdateStoreSettings(settingsUpdates);
    showToast(isAr ? 'تم حفظ ونشر مظهر وإعدادات المتجر بنجاح! 🚀' : 'Store appearance and settings saved!');
  };

  // Save 3-Button changes back to Store Settings
  const persistControls = (updates: any) => {
    onUpdateStoreSettings(updates);
    showToast(isAr ? 'تم حفظ وتطبيق التعديل بنجاح ✓' : 'Settings saved');
  };

  // ─────────────────────────────────────────────────────────────
  // 5. RECHARTS SALES CHARTS
  // ─────────────────────────────────────────────────────────────
  const salesByDateData = useMemo(() => {
    return [
      { day: 'السبت', sales: 48000, orders: 12 },
      { day: 'الأحد', sales: 65000, orders: 15 },
      { day: 'الإثنين', sales: 89000, orders: 21 },
      { day: 'الثلاثاء', sales: 74000, orders: 18 },
      { day: 'الأربعاء', sales: 98000, orders: 24 },
      { day: 'الخميس', sales: 125000, orders: 30 },
      { day: 'الجمعة', sales: 110000, orders: 26 }
    ];
  }, []);

  const totalStoreSales = orders.reduce((acc, o) => acc + (o.total || 0), store.totalSales || 0);
  const totalOrdersCount = orders.length > 0 ? orders.length : store.ordersCount || 0;

  return (
    <div className="min-h-screen bg-[#F0F3F7] text-slate-800 font-sans flex flex-col lg:flex-row relative selection:bg-emerald-500 selection:text-white" dir="rtl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 start-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-emerald-500/50 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ─── SLEEK DARK NAVY SIDEBAR (EXACT MATCH TO REFERENCE IMAGE) ─── */}
      <aside className={`
        fixed lg:sticky top-0 right-0 z-50 h-screen w-64 bg-[#172132] text-slate-300 
        flex flex-col border-s border-slate-800/80 shadow-2xl lg:shadow-none
        transition-transform duration-300 ease-in-out shrink-0
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header: Store Name on Left, Hamburger on Right */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-extrabold text-white text-base tracking-tight truncate">
              {store.name || store.nameAr || 'InYourBest'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="القائمة"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <nav className="flex-1 overflow-y-auto py-2 px-0 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-700">
          
          {/* 1. لوحة التحكم */}
          <button
            type="button"
            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer text-xs font-semibold ${
              activeTab === 'overview' ? 'bg-[#243046] text-white' : 'text-slate-300 hover:bg-[#1f2b3f] hover:text-white'
            }`}
          >
            <span className="ms-2">لوحة التحكم</span>
            <Home className="w-5 h-5 text-current shrink-0" />
          </button>

          {/* 2. الطلبيات (مع دائرة رقم 1 الزرقاء الدائرية الفاقعة) */}
          <button
            type="button"
            onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer text-xs font-semibold ${
              activeTab === 'orders' ? 'bg-[#243046] text-white' : 'text-slate-300 hover:bg-[#1f2b3f] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0ea5e9] text-white text-[11px] font-black flex items-center justify-center font-mono shadow-xs">
                {totalOrdersCount || 1}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span>الطلبيات</span>
              <Package className="w-5 h-5 text-current shrink-0" />
            </div>
          </button>

          {/* 3. المنتجات */}
          <button
            type="button"
            onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer text-xs font-semibold ${
              activeTab === 'products' ? 'bg-[#243046] text-white' : 'text-slate-300 hover:bg-[#1f2b3f] hover:text-white'
            }`}
          >
            <span className="ms-2">المنتجات</span>
            <Tag className="w-5 h-5 text-current shrink-0" />
          </button>

          {/* 4. Up Sells (قائمة منسدلة مفتوحة كما في الصورة) */}
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => setIsUpsellsMenuOpen(!isUpsellsMenuOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer text-xs font-semibold ${
                (activeTab === 'upsells' || activeTab === 'upsells_all' || activeTab === 'upsells_new' || isUpsellsMenuOpen)
                  ? 'bg-[#243046] text-white'
                  : 'text-slate-300 hover:bg-[#1f2b3f] hover:text-white'
              }`}
            >
              <span className="font-bold tracking-wide">Up Sells</span>
              {isUpsellsMenuOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-300 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-300 shrink-0" />
              )}
            </button>

            {/* Up Sells Submenu */}
            {isUpsellsMenuOpen && (
              <div className="bg-[#1b2638] py-1 border-y border-slate-800/40 space-y-0.5">
                <button
                  type="button"
                  onClick={() => { setActiveTab('upsells_all'); setIsSidebarOpen(false); }}
                  className={`w-full text-end pe-10 py-2 text-xs transition-colors cursor-pointer font-medium block ${
                    activeTab === 'upsells_all' || activeTab === 'upsells'
                      ? 'text-white font-bold bg-[#25334c]'
                      : 'text-slate-400 hover:text-white hover:bg-[#1f2b3f]'
                  }`}
                >
                  جميع Up Sells
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('upsells_new'); setIsSidebarOpen(false); }}
                  className={`w-full text-end pe-10 py-2 text-xs transition-colors cursor-pointer font-medium block ${
                    activeTab === 'upsells_new'
                      ? 'text-white font-bold bg-[#25334c]'
                      : 'text-slate-400 hover:text-white hover:bg-[#1f2b3f]'
                  }`}
                >
                  Up Sell جديد
                </button>
              </div>
            )}
          </div>

          {/* 5. كوبون */}
          <button
            type="button"
            onClick={() => { setActiveTab('coupons'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer text-xs font-semibold ${
              activeTab === 'coupons' ? 'bg-[#243046] text-white' : 'text-slate-300 hover:bg-[#1f2b3f] hover:text-white'
            }`}
          >
            <span className="ms-2">كوبون</span>
            <Ticket className="w-5 h-5 text-current shrink-0" />
          </button>

          {/* 6. العملاء */}
          <button
            type="button"
            onClick={() => { setActiveTab('customers'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer text-xs font-semibold ${
              activeTab === 'customers' ? 'bg-[#243046] text-white' : 'text-slate-300 hover:bg-[#1f2b3f] hover:text-white'
            }`}
          >
            <span className="ms-2">العملاء</span>
            <Users className="w-5 h-5 text-current shrink-0" />
          </button>

          {/* 7. متجر */}
          <button
            type="button"
            onClick={() => { setActiveTab('store'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer text-xs font-semibold ${
              activeTab === 'store' || activeTab === 'store_controls' ? 'bg-[#243046] text-white' : 'text-slate-300 hover:bg-[#1f2b3f] hover:text-white'
            }`}
          >
            <span className="ms-2">متجر</span>
            <StoreIcon className="w-5 h-5 text-current shrink-0" />
          </button>

          {/* 8. إحصائيات */}
          <button
            type="button"
            onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer text-xs font-semibold ${
              activeTab === 'analytics' ? 'bg-[#243046] text-white' : 'text-slate-300 hover:bg-[#1f2b3f] hover:text-white'
            }`}
          >
            <span className="ms-2">إحصائيات</span>
            <TrendingUp className="w-5 h-5 text-current shrink-0" />
          </button>

          {/* 9. الفواتير */}
          <button
            type="button"
            onClick={() => { setActiveTab('invoices'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer text-xs font-semibold ${
              activeTab === 'invoices' ? 'bg-[#243046] text-white' : 'text-slate-300 hover:bg-[#1f2b3f] hover:text-white'
            }`}
          >
            <span className="ms-2">الفواتير</span>
            <FileText className="w-5 h-5 text-current shrink-0" />
          </button>

          {/* 10. التطبيقات */}
          <button
            type="button"
            onClick={() => { setActiveTab('apps'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer text-xs font-semibold ${
              activeTab === 'apps' || activeTab === 'shipping' || activeTab === 'domains' ? 'bg-[#243046] text-white' : 'text-slate-300 hover:bg-[#1f2b3f] hover:text-white'
            }`}
          >
            <span className="ms-2">التطبيقات</span>
            <LayoutGrid className="w-5 h-5 text-current shrink-0" />
          </button>

          {/* 11. التسويق بالعمولة */}
          <button
            type="button"
            onClick={() => { setActiveTab('affiliate'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer text-xs font-semibold ${
              activeTab === 'affiliate' ? 'bg-[#243046] text-white' : 'text-slate-300 hover:bg-[#1f2b3f] hover:text-white'
            }`}
          >
            <span className="ms-2">التسويق بالعمولة</span>
            <Share2 className="w-5 h-5 text-current shrink-0" />
          </button>

          {/* 12. الدعم */}
          <button
            type="button"
            onClick={() => { setActiveTab('support'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer text-xs font-semibold ${
              activeTab === 'support' ? 'bg-[#243046] text-white' : 'text-slate-300 hover:bg-[#1f2b3f] hover:text-white'
            }`}
          >
            <span className="ms-2">الدعم</span>
            <Headphones className="w-5 h-5 text-current shrink-0" />
          </button>

          {/* 13. إعدادات */}
          <button
            type="button"
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer text-xs font-semibold ${
              activeTab === 'settings' ? 'bg-[#243046] text-white' : 'text-slate-300 hover:bg-[#1f2b3f] hover:text-white'
            }`}
          >
            <span className="ms-2">إعدادات</span>
            <Settings className="w-5 h-5 text-current shrink-0" />
          </button>

        </nav>

        {/* Footer of Sidebar */}
        <div className="p-3 border-t border-slate-800/80 bg-[#121a28] shrink-0 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="truncate font-mono">{store.settings?.subdomain || 'wasladz.app'}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        
        {/* Modern Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 h-16 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              title="فتح القائمة"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-slate-900 truncate">
                {store.nameAr || store.name}
              </h1>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>متجر مستقل نشط 🟢</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Add Product */}
            <button
              type="button"
              onClick={handleOpenAddProduct}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">إضافة منتج 🚀</span>
              <span className="sm:hidden">منتج +</span>
            </button>

            {/* Independent External Store Link (Opens directly in external new tab) */}
            <a
              href={externalStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#172132] hover:bg-[#243046] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all border border-slate-700 shrink-0"
              title="فتح المتجر المستقل برابط خارجي في نافذة جديدة"
            >
              <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">رابط المتجر الخارجي ↗️</span>
              <span className="sm:hidden">المتجر ↗️</span>
            </a>

            {/* Quick Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyStoreUrl}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all border border-slate-200 shrink-0"
              title="نسخ رابط المتجر الخارجي"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">نسخ 📋</span>
            </button>

            {/* In-app Preview Live Store */}
            {onOpenLivePreview && (
              <button
                type="button"
                onClick={onOpenLivePreview}
                className="hidden lg:flex px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold items-center gap-1 cursor-pointer transition-all border border-slate-200 shrink-0"
                title="معاينة داخلية للمتجر"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>معاينة</span>
              </button>
            )}
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">

        {/* ─── 0. INDEPENDENT EXTERNAL STOREFRONT LINK BANNER ─── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#172132] via-[#1E293B] to-[#0F172A] text-white border border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>رابط المتجر المستقل الخارجي 🌐</span>
              </span>
              <span className="text-[11px] text-slate-300 font-medium">
                متاح لجميع الزبائن في كافة المتصفحات والأجهزة دون الحاجة لتسجيل دخول
              </span>
            </div>
            
            <div className="flex items-center gap-2 font-mono text-xs text-teal-300 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700/80 w-fit max-w-full overflow-hidden">
              <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="truncate select-all">{externalStoreUrl}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Open in New Window */}
            <a
              href={externalStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>فتح المتجر ↗️</span>
            </a>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopyStoreUrl}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-600 transition-all cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>نسخ الرابط 📋</span>
            </button>

            {/* Share WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`تفضل بزيارة متجري الإلكتروني: ${externalStoreUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center gap-1 transition-all"
              title="مشاركة الرابط على واتساب"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">واتساب 💬</span>
            </a>

            {/* Direct Customize Appearance button */}
            <button
              type="button"
              onClick={() => setActiveTab('store')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                activeTab === 'store' 
                  ? 'bg-indigo-600 text-white border-indigo-500' 
                  : 'bg-slate-800/90 hover:bg-slate-700 text-indigo-300 border-indigo-500/40'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>تعديل المظهر والإعدادات 🎨</span>
            </button>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            TAB 1: OVERVIEW & RECHARTS SALES CHARTS
        ───────────────────────────────────────────────────────────── */}
        {(activeTab === 'overview' || activeTab === 'analytics') && (
          <div className="space-y-6">
            
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase">إجمالي المبيعات</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{formatPrice(totalStoreSales)}</div>
                <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18.4% نمو هذا الأسبوع</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase">إجمالي الطلبات (COD)</span>
                  <ShoppingCart className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{totalOrdersCount} طلب</div>
                <div className="text-[10px] text-slate-400">دفع موثق عند الاستلام</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase">تغطية الولايات</span>
                  <Truck className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{activeWilayasCount} / 69</div>
                <div className="text-[10px] text-emerald-600 font-semibold">توصيل مفعل للمكتب والمنزل</div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase">النطاق والربط</span>
                  <Globe className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-sm font-bold text-slate-900 font-mono truncate">
                  {store.settings?.customDomain || store.settings.subdomain}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>شهادة SSL نشطة 🔒</span>
                </div>
              </div>
            </div>

            {/* Recharts Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">رسم بياني للمبيعات اليومية والأسبوعية (Recharts)</h3>
                    <p className="text-xs text-slate-500">متابعة دقيقة لحجم الإيرادات المسجلة بالدينار الجزائري (د.ج)</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 self-start sm:self-auto">
                    آخر 7 أيام
                  </span>
                </div>

                <div className="h-64 sm:h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesByDateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="storeSalesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                      <Tooltip 
                        formatter={(val: any) => [`${Number(val).toLocaleString()} د.ج`, 'المبيعات']}
                        contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px', textAlign: 'right' }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#storeSalesGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">توزيع الطلبات الأسبوعية</h3>
                  <p className="text-xs text-slate-500">عدد الطلبات المسجلة لكل يوم</p>
                </div>

                <div className="h-64 sm:h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesByDateData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <Tooltip 
                        formatter={(val: any) => [`${val} طلب`, 'الطلبات']}
                        contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px', textAlign: 'right' }}
                      />
                      <Bar dataKey="orders" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 2: ORDERS MANAGEMENT
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">إدارة طلبات الزبائن (COD)</h3>
                <p className="text-xs text-slate-500">تأكيد وتوجيه الطلبات لشركات الشحن (ياليدين / ZR Express)</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th className="py-3 px-4">رقم الطلب</th>
                    <th className="py-3 px-4">الزبون والهاتف</th>
                    <th className="py-3 px-4">الولاية ونوع الشحن</th>
                    <th className="py-3 px-4">المنتجات</th>
                    <th className="py-3 px-4">المجموع</th>
                    <th className="py-3 px-4">حالة الطلب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{order.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono" dir="ltr">{order.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{order.wilayaName || order.customerCity || 'الجزائر'}</div>
                        <span className="text-[10px] text-slate-500">
                          {order.deliveryType === 'desk' ? 'استلام من المكتب' : 'توصيل للمنزل'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-700">{order.items?.length || 1} منتج</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="pending">معلق (جديد)</option>
                          <option value="processing">تم التأكيد هاتفياً</option>
                          <option value="shipped">قيد الشحن</option>
                          <option value="delivered">تم التسليم بنجاح</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 3: REVAMPED PRODUCTS CATALOG (10 IMAGES, VARIANTS, EDIT)
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">منتجات المتجر والمخزون</h3>
                <p className="text-xs text-slate-500">إدارة المنتجات، رفع حتى 10 صور عالية الجودة، الألوان، والمقاسات</p>
              </div>
              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة منتج جديد (مع 10 صور وألوان)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(prod => (
                <div key={prod.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between hover:border-emerald-500/40 transition-all">
                  <div>
                    {/* Primary Image with badges */}
                    <div className="h-48 bg-slate-100 relative overflow-hidden group">
                      <img 
                        src={prod.imageUrl || (prod.images && prod.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'} 
                        alt={prod.nameAr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Image count pill */}
                      {prod.images && prod.images.length > 0 && (
                        <span className="absolute top-2.5 start-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-emerald-400" />
                          <span>{prod.images.length} صور</span>
                        </span>
                      )}

                      {/* Stock pill */}
                      <span className={`absolute bottom-2.5 end-2.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        prod.stock > 10 ? 'bg-emerald-500 text-white' : prod.stock > 0 ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                      }`}>
                        المخزون: {prod.stock}
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="p-4 space-y-2.5 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{prod.nameAr}</h4>
                          <span className="text-[11px] text-slate-400">{prod.category}</span>
                        </div>
                        <div className="text-start">
                          <div className="font-mono font-bold text-emerald-600 text-sm">{formatPrice(prod.price)}</div>
                          {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                            <div className="font-mono text-slate-400 line-through text-[11px]">{formatPrice(prod.compareAtPrice)}</div>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-500 text-[11px] line-clamp-2">{prod.descriptionAr || prod.description}</p>

                      {/* Color swatches */}
                      {prod.colors && prod.colors.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-400">الألوان:</span>
                          <div className="flex items-center gap-1">
                            {prod.colors.map((c, i) => {
                              const hex = typeof c === 'string' ? c : c.hex;
                              return (
                                <span 
                                  key={i} 
                                  className="w-4 h-4 rounded-full border border-slate-300 shadow-xs" 
                                  style={{ backgroundColor: hex }} 
                                  title={typeof c === 'string' ? c : c.nameAr || c.name} 
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Sizes */}
                      {prod.sizes && prod.sizes.length > 0 && (
                        <div className="flex items-center gap-1 pt-0.5">
                          <span className="text-[10px] text-slate-400">المقاسات:</span>
                          <div className="flex flex-wrap gap-1">
                            {prod.sizes.map((sz, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                                {sz}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenEditProduct(prod)}
                      className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>تعديل المنتج</span>
                    </button>

                    <button
                      onClick={() => {
                        onDeleteProduct(prod.id);
                        showToast(isAr ? 'تم حذف المنتج من المتجر' : 'Product deleted');
                      }}
                      className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 text-rose-500 transition-colors cursor-pointer"
                      title="حذف المنتج"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 4: ALGERIA 69 WILAYAS SHIPPING
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'shipping' && (
          <div className="space-y-4">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>إدارة أسعار الشحن لـ 69 ولاية جزائرية</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {activeWilayasCount} / 69 مفعلة
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  تحكم كامل في تفعيل أو تعديل سعر التوصيل للمكتب (Stop-Desk) والمنزل (Domicile) لكل ولاية جزائرية.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRestoreAllWilayas}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  استعادة الـ 69 ولاية
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute top-3 start-3.5" />
                <input
                  type="text"
                  value={shippingSearch}
                  onChange={(e) => setShippingSearch(e.target.value)}
                  placeholder="ابحث بالاسم أو رقم الولاية (مثال: 16، وهران، سطيف، قسنطينة)..."
                  className="w-full bg-white border border-slate-200 rounded-xl ps-10 pe-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={shippingZoneFilter}
                  onChange={(e) => setShippingZoneFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer w-full sm:w-auto"
                >
                  <option value="all">جميع المناطق الجغرافية</option>
                  <option value="center">وسط الجزائر</option>
                  <option value="east">الشرق الجزائري</option>
                  <option value="west">الغرب الجزائري</option>
                  <option value="south">الجنوب والهضاب</option>
                  <option value="sahara">الصحراء الكبرى</option>
                </select>
              </div>
            </div>

            {/* 69 Wilayas Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <th className="py-3 px-4 w-14">الرمز</th>
                      <th className="py-3 px-4">اسم الولاية</th>
                      <th className="py-3 px-4">توصيل للمكتب (Stop-Desk)</th>
                      <th className="py-3 px-4">توصيل للمنزل (Domicile)</th>
                      <th className="py-3 px-4">المدة المتوقعة</th>
                      <th className="py-3 px-4 text-center">أزرار التحكم الثلاثة (تمكين / تعديل / حذف)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredWilayas.map((wilaya) => (
                      <tr 
                        key={wilaya.code}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          !wilaya.isEnabled ? 'opacity-50 bg-slate-50/40' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {wilaya.code}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{wilaya.nameAr}</div>
                          <div className="text-[11px] text-slate-400 font-sans">{wilaya.name}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                          {wilaya.deskPrice} د.ج
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                          {wilaya.homePrice} د.ج
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-medium">
                          {wilaya.estimatedDays}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* Button 1: Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleWilaya(wilaya.code)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                wilaya.isEnabled 
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                              }`}
                            >
                              {wilaya.isEnabled ? 'مفعل 🟢' : 'معطل ⚪'}
                            </button>

                            {/* Button 2: Edit Prices */}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingWilaya(wilaya);
                                setEditDeskPrice(wilaya.deskPrice);
                                setEditHomePrice(wilaya.homePrice);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>تعديل</span>
                            </button>

                            {/* Button 3: Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteWilaya(wilaya.code)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer"
                              title="حذف الولاية من القائمة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 5: CUSTOM DOMAIN MANAGEMENT (قسم ربط الدومين للبائعين)
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'domains' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1">
                <Globe className="w-3.5 h-3.5" />
                <span>إدارة النطاق المخصص (Custom Domain Engine)</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                ربط النطاق الخاص بمتجرك (www.yourstore.com أو .dz)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                اربط اسم نطاقك المخصص لتعزيز ثقة زبائنك وعلامتك التجارية. نوفر شهادة أمان SSL Let's Encrypt مجانية وتشفير HTTPS تلقائي لجميع المتاجر.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form & Current Domain Status (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* 1. Free Subdomain Card */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">النطاق الفرعي السحابي المجاني (WaslaDZ Subdomain)</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      نشط دائماً ✓
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-mono font-bold text-slate-800 text-xs sm:text-sm">
                      https://{store.settings.subdomain}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(`https://${store.settings.subdomain}`);
                        showToast(isAr ? 'تم نسخ الرابط' : 'Copied');
                      }}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-600"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2. Connect Custom Domain Card */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-emerald-600" />
                    <span>إضافة وربط نطاق خاص جديد</span>
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1.5">
                        أدخل اسم النطاق الخاص بك (Domain Name)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={customDomainInput}
                          onChange={(e) => setCustomDomainInput(e.target.value)}
                          placeholder="مثال: www.elegance-store.com أو mystore.dz"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono text-xs focus:outline-none focus:border-emerald-600"
                          dir="ltr"
                        />
                        <button
                          type="button"
                          disabled={isVerifyingDns}
                          onClick={handleConnectDomain}
                          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
                        >
                          {isVerifyingDns ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <span>ربط والتحقق ⚡</span>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Status Feedback */}
                    {domainStatus === 'connected' && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-bold">النطاق متصل ويعمل بنجاح (Connected & Active)</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleDisconnectDomain}
                          className="text-xs text-rose-600 hover:text-rose-800 font-bold"
                        >
                          فصل النطاق
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Free SSL Certificate Badge */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                      شهادة أمان مجانية Let's Encrypt Wildcard SSL 🔒
                    </h5>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      يتم تفعيل التشفير التلقائي وحماية معاملات الزبائن مجاناً لجميع النطاقات المربوطة.
                    </p>
                  </div>
                </div>

              </div>

              {/* Right Column: Required DNS Records (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-bold text-xs flex items-center gap-1.5 text-emerald-400">
                      <Settings className="w-4 h-4" />
                      <span>سجلات الـ DNS المطلوبة في لوحة تحكم النطاق</span>
                    </span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">DNS Guide</span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    توجه إلى لوحة تحكم مزود النطاق الخاص بك (مثل Namecheap, GoDaddy, Cloudflare, أو مسجلي نطاقات .dz الجزائريين) وأضف السجلات التالية:
                  </p>

                  <div className="space-y-3 font-mono text-[11px]">
                    {dnsRecords.map((rec, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400">
                            {rec.type} Record
                          </span>
                          <span className="text-[10px] text-emerald-400 font-sans">
                            {rec.status === 'verified' ? '✓ تم التحقق' : 'قيد الانتشار'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300 pt-1">
                          <span>المضيف (Host): <strong className="text-white">{rec.host}</strong></span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="truncate max-w-[180px]">القيمة: <strong className="text-white">{rec.value}</strong></span>
                          <button
                            type="button"
                            onClick={() => handleCopyDns(rec.value, `${rec.type}_${i}`)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedDnsKey === `${rec.type}_${i}` ? 'تم ✓' : 'نسخ'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-400 pt-1">
                    💡 قد يستغرق انتشار سجلات الـ DNS بين 15 دقيقة إلى 24 ساعة كحد أقصى حسب مزود النطاق.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 6: STORE APPEARANCE & SETTINGS CUSTOMIZER (مظهر وإعدادات المتجر داخل لوحة التحكم)
        ───────────────────────────────────────────────────────────── */}
        {(activeTab === 'store' || activeTab === 'store_controls') && (
          <div className="space-y-6">
            
            {/* Customizer Master Header */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Palette className="w-3.5 h-3.5" />
                  <span>محرر مظهر وإعدادات المتجر المستقل (Store Customizer Studio)</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  تخصيص الهوية البصرية، الشعار، الألوان، البانر، وإعدادات العرض
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                  تحكم كامل في كيفية ظهور متجرك أمام الزبائن في جميع المتصفحات والأجهزة دون الحاجة لتسجيل دخول. يمكنك تخصيص الألوان والشعار والبانرات وحفظ التغييرات لتنعكس فوراً على رابط متجرك الخارجي المستقل.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {/* Save & Publish All Changes */}
                <button
                  type="button"
                  onClick={handleSaveStoreCustomizations}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ ونشر التعديلات فوراً 🚀</span>
                </button>

                {/* External Store Link Button */}
                <a
                  href={externalStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#172132] hover:bg-[#243046] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
                  title="فتح المتجر المستقل في نافذة خارجية جديدة"
                >
                  <ExternalLink className="w-4 h-4 text-teal-400" />
                  <span>رابط المتجر المستقل ↗️</span>
                </a>
              </div>
            </div>

            {/* 1. Maintenance Mode (وضعية الصيانة) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">1. وضعية الصيانة والتحديث (Maintenance Mode)</h4>
                    <p className="text-xs text-slate-500">إغلاق مؤقت للمتجر أمام الزبائن عند جرد المخزون أو التحديث مع رسالة مخصصة</p>
                  </div>
                </div>

                {/* The 3 Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...maintenanceConfig, isEnabled: !maintenanceConfig.isEnabled };
                      setMaintenanceConfig(updated);
                      persistControls({ maintenanceMode: updated });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      maintenanceConfig.isEnabled 
                        ? 'bg-amber-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {maintenanceConfig.isEnabled ? 'الوضعية مفعلة 🟢' : 'معطلة ⚪'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditingMaintenance(!isEditingMaintenance)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const reset = { ...maintenanceConfig, isEnabled: false, message: 'المتجر يعمل بصورة طبيعية' };
                      setMaintenanceConfig(reset);
                      persistControls({ maintenanceMode: reset });
                      showToast(isAr ? 'تمت إعادة تعيين وضعية الصيانة' : 'Maintenance reset');
                    }}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer"
                    title="حذف / إعادة تعيين الصيانة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Maintenance Edit Drawer */}
              {isEditingMaintenance && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">عنوان صفحة الصيانة</label>
                      <input
                        type="text"
                        value={maintenanceConfig.title}
                        onChange={(e) => setMaintenanceConfig({ ...maintenanceConfig, title: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">وقت العودة المتوقع</label>
                      <input
                        type="text"
                        value={maintenanceConfig.estimatedEndTime}
                        onChange={(e) => setMaintenanceConfig({ ...maintenanceConfig, estimatedEndTime: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">رسالة التنبيه للزبائن</label>
                    <textarea
                      rows={2}
                      value={maintenanceConfig.message}
                      onChange={(e) => setMaintenanceConfig({ ...maintenanceConfig, message: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 resize-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      persistControls({ maintenanceMode: maintenanceConfig });
                      setIsEditingMaintenance(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    حفظ تعديلات الصيانة ✓
                  </button>
                </div>
              )}
            </div>

            {/* 2. Top Promotional Banner (البانر ومحتوياته) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">2. الشريط الإعلاني الترويجي (Top Banner)</h4>
                    <p className="text-xs text-slate-500">شريط العروض الحصرية والخصومات أعلى المتجر مع مؤقت عد تنازلي</p>
                  </div>
                </div>

                {/* The 3 Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...bannerConfig, isEnabled: !bannerConfig.isEnabled };
                      setBannerConfig(updated);
                      persistControls({ bannerConfig: updated });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      bannerConfig.isEnabled 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {bannerConfig.isEnabled ? 'مفعل 🟢' : 'معطل ⚪'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditingBanner(!isEditingBanner)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...bannerConfig, isEnabled: false, text: '' };
                      setBannerConfig(updated);
                      persistControls({ bannerConfig: updated });
                      showToast(isAr ? 'تم حذف نص البانر' : 'Banner deleted');
                    }}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer"
                    title="حذف البانر"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Banner Edit Drawer */}
              {isEditingBanner && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs animate-in fade-in duration-200">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">نص الإعلان الترويجي</label>
                    <input
                      type="text"
                      value={bannerConfig.text}
                      onChange={(e) => setBannerConfig({ ...bannerConfig, text: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">لون خلفية البانر</label>
                      <input
                        type="color"
                        value={bannerConfig.bgColor}
                        onChange={(e) => setBannerConfig({ ...bannerConfig, bgColor: e.target.value })}
                        className="w-full h-9 p-0.5 rounded-xl border border-slate-200 bg-white cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">لون النص</label>
                      <input
                        type="color"
                        value={bannerConfig.textColor}
                        onChange={(e) => setBannerConfig({ ...bannerConfig, textColor: e.target.value })}
                        className="w-full h-9 p-0.5 rounded-xl border border-slate-200 bg-white cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">العد التنازلي (بالساعات)</label>
                      <input
                        type="number"
                        value={bannerConfig.countdownHours || 24}
                        onChange={(e) => setBannerConfig({ ...bannerConfig, countdownHours: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      persistControls({ bannerConfig: bannerConfig });
                      setIsEditingBanner(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    حفظ تعديلات البانر ✓
                  </button>
                </div>
              )}
            </div>

            {/* 3. Footer Configuration (الفوتر ومحتوياته) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">3. الفوتر ومحتوياته (Footer Configuration)</h4>
                    <p className="text-xs text-slate-500">روابط التواصل، نصوص الحقوق، وتنبيه الشحن في أسفل المتجر</p>
                  </div>
                </div>

                {/* The 3 Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...footerConfig, isEnabled: !footerConfig.isEnabled };
                      setFooterConfig(updated);
                      persistControls({ footerConfig: updated });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      footerConfig.isEnabled 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {footerConfig.isEnabled ? 'مفعل 🟢' : 'معطل ⚪'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditingFooter(!isEditingFooter)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...footerConfig, isEnabled: false };
                      setFooterConfig(updated);
                      persistControls({ footerConfig: updated });
                      showToast(isAr ? 'تم إخفاء الفوتر' : 'Footer hidden');
                    }}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer"
                    title="حذف / إخفاء الفوتر"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Footer Edit Drawer */}
              {isEditingFooter && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs animate-in fade-in duration-200">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">نص حقوق الملكية في الفوتر</label>
                    <input
                      type="text"
                      value={footerConfig.copyrightText}
                      onChange={(e) => setFooterConfig({ ...footerConfig, copyrightText: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">رقم هاتف المتجر</label>
                      <input
                        type="text"
                        value={footerConfig.contactPhone}
                        onChange={(e) => setFooterConfig({ ...footerConfig, contactPhone: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={footerConfig.contactEmail}
                        onChange={(e) => setFooterConfig({ ...footerConfig, contactEmail: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      persistControls({ footerConfig: footerConfig });
                      setIsEditingFooter(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    حفظ تعديلات الفوتر ✓
                  </button>
                </div>
              )}
            </div>

            {/* 4. Currencies List with 3 Buttons (العملات) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>4. إدارة العملات في المتجر (نظام الـ 3 أزرار)</span>
                </h4>
                <p className="text-xs text-slate-500">تمكين، تعديل أسعار الصرف، أو حذف العملات المتاحة للمشترين</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs min-w-[550px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">الرمز الكودي</th>
                      <th className="py-2.5 px-3">اسم العملة</th>
                      <th className="py-2.5 px-3">الرمز المعروض</th>
                      <th className="py-2.5 px-3">سعر التحويل مقابل د.ج</th>
                      <th className="py-2.5 px-3 text-center">أزرار التحكم (تمكين / تعديل / حذف)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {storeCurrencies.map(curr => (
                      <tr key={curr.code} className={curr.isDeleted ? 'opacity-40' : ''}>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{curr.code}</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{curr.name}</td>
                        <td className="py-3 px-3 font-bold text-emerald-600 font-mono">{curr.symbolAr}</td>
                        <td className="py-3 px-3 font-mono text-slate-600">{curr.rate}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center gap-2">
                            {/* Button 1: Toggle */}
                            <button
                              type="button"
                              onClick={() => {
                                setStoreCurrencies(storeCurrencies.map(c => c.code === curr.code ? { ...c, isEnabled: !c.isEnabled } : c));
                                showToast(isAr ? `تم تعديل حالة تفعيل عملة ${curr.name}` : 'Currency toggled');
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                curr.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {curr.isEnabled ? 'مفعل 🟢' : 'معطل ⚪'}
                            </button>

                            {/* Button 2: Edit */}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCurrencyCode(curr.code);
                                setEditCurrRate(curr.rate);
                                setEditCurrSymbol(curr.symbolAr);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold"
                            >
                              تعديل
                            </button>

                            {/* Button 3: Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                setStoreCurrencies(storeCurrencies.map(c => c.code === curr.code ? { ...c, isDeleted: true, isEnabled: false } : c));
                                showToast(isAr ? `تم حذف عملة ${curr.name}` : 'Currency removed');
                              }}
                              className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Currency Edit Mini Drawer */}
              {editingCurrencyCode && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs">
                  <span>تعديل ({editingCurrencyCode}):</span>
                  <input
                    type="number"
                    step="0.0001"
                    value={editCurrRate}
                    onChange={(e) => setEditCurrRate(Number(e.target.value))}
                    className="w-24 bg-white border border-slate-200 rounded-lg p-1.5 font-mono"
                    placeholder="سعر التحويل"
                  />
                  <input
                    type="text"
                    value={editCurrSymbol}
                    onChange={(e) => setEditCurrSymbol(e.target.value)}
                    className="w-20 bg-white border border-slate-200 rounded-lg p-1.5"
                    placeholder="الرمز"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setStoreCurrencies(storeCurrencies.map(c => c.code === editingCurrencyCode ? { ...c, rate: editCurrRate, symbolAr: editCurrSymbol } : c));
                      setEditingCurrencyCode(null);
                      showToast(isAr ? 'تم حفظ سعر صرف العملة' : 'Currency updated');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
                  >
                    حفظ ✓
                  </button>
                </div>
              )}
            </div>

            {/* 5. Languages List with 3 Buttons (اللغات) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-600" />
                  <span>5. إدارة اللغات المتاحة في المتجر (نظام الـ 3 أزرار)</span>
                </h4>
                <p className="text-xs text-slate-500">تمكين، تعديل، أو حذف اللغات المتاحة للمشترين</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs min-w-[550px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">الكود</th>
                      <th className="py-2.5 px-3">اسم اللغة</th>
                      <th className="py-2.5 px-3">اتجاه النص</th>
                      <th className="py-2.5 px-3 text-center">أزرار التحكم (تمكين / تعديل / حذف)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {storeLanguages.map(lang => (
                      <tr key={lang.code} className={lang.isDeleted ? 'opacity-40' : ''}>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 uppercase">{lang.code}</td>
                        <td className="py-3 px-3 font-bold text-slate-800">{lang.name}</td>
                        <td className="py-3 px-3 font-mono text-slate-500 uppercase">{lang.dir}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center gap-2">
                            {/* Button 1: Toggle */}
                            <button
                              type="button"
                              onClick={() => {
                                setStoreLanguages(storeLanguages.map(l => l.code === lang.code ? { ...l, isEnabled: !l.isEnabled } : l));
                                showToast(isAr ? `تم تعديل حالة تفعيل لغة ${lang.name}` : 'Language toggled');
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                lang.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {lang.isEnabled ? 'مفعل 🟢' : 'معطل ⚪'}
                            </button>

                            {/* Button 2: Edit */}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingLangCode(lang.code);
                                setEditLangName(lang.name);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold"
                            >
                              تعديل
                            </button>

                            {/* Button 3: Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                setStoreLanguages(storeLanguages.map(l => l.code === lang.code ? { ...l, isDeleted: true, isEnabled: false } : l));
                                showToast(isAr ? `تم حذف لغة ${lang.name}` : 'Language removed');
                              }}
                              className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Language Edit Drawer */}
              {editingLangCode && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs">
                  <span>تعديل اسم اللغة ({editingLangCode}):</span>
                  <input
                    type="text"
                    value={editLangName}
                    onChange={(e) => setEditLangName(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-lg p-1.5"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setStoreLanguages(storeLanguages.map(l => l.code === editingLangCode ? { ...l, name: editLangName } : l));
                      setEditingLangCode(null);
                      showToast(isAr ? 'تم حفظ تعديل اسم اللغة' : 'Language updated');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
                  >
                    حفظ ✓
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 7: CUSTOMERS
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">سجل الزبائن وقاعدة البيانات</h3>
                <p className="text-xs text-slate-500">متابعة الزبائن المتكررين وقيمة المشتريات الإجمالية</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <th className="py-3 px-4">اسم الزبون</th>
                    <th className="py-3 px-4">الهاتف والبريد</th>
                    <th className="py-3 px-4">المدينة / الولاية</th>
                    <th className="py-3 px-4">عدد الطلبات</th>
                    <th className="py-3 px-4">إجمالي المشتريات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-slate-800" dir="ltr">{c.phone}</div>
                        <div className="text-[11px] text-slate-400">{c.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">{c.city}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{c.totalOrders} طلب</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{formatPrice(c.totalSpent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB: COUPONS (كوبونات وقسائم التخفيض)
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>قسائم التخفيض وكودات الخصم (Coupons)</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    {coupons.length} كودات خصم
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  إنشاء كودات ترويجية لزبائنك لزيادة المبيعات بنسبة مئوية أو تخفيض ثابت أو شحن مجاني
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <th className="py-3 px-4">كود الكوبون</th>
                      <th className="py-3 px-4">قيمة الخصم</th>
                      <th className="py-3 px-4">الحد الأدنى للطلب</th>
                      <th className="py-3 px-4">الاستخدامات</th>
                      <th className="py-3 px-4">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {coupons.map(cpn => (
                      <tr key={cpn.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-black text-purple-700 text-sm">
                          <span className="bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
                            {cpn.code}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {cpn.discountType === 'percentage' ? `${cpn.value}% خصم` : `${cpn.value} د.ج خصم ثابت`}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono">
                          {cpn.minOrder ? formatPrice(cpn.minOrder) : 'بدون حد أدنى'}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                          {cpn.usageCount || 0} مرة
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cpn.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {cpn.isActive ? 'فعال ونشط 🟢' : 'معطل ⚪'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB 8: STORE SETTINGS & PAYOUTS
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">إعدادات الدفع والحسابات البنكية (BaridiMob / CCP)</h3>
                <p className="text-xs text-slate-500">بيانات تحويل أرباح مبيعات الدفع عند الاستلام لحساب التاجر</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">طريقة استلام الأرباح</label>
                  <input
                    type="text"
                    defaultValue={store.settings?.payoutBank || 'بريد الجزائر (BaridiMob / CCP) / بنك BNA'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">رقم الحساب الجاري / RIP BaridiMob</label>
                  <input
                    type="text"
                    defaultValue={store.settings?.payoutIban || '00799999000123456789 (RIP BaridiMob)'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB: UP SELLS (جميع Up Sells)
        ───────────────────────────────────────────────────────────── */}
        {(activeTab === 'upsells' || activeTab === 'upsells_all') && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>عروض الـ Up Sells وزيادة متوسط قيمة السلة (AOV)</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {upsellsList.filter(u => u.status === 'active').length} عروض نشطة
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  مضاعفة أرباح متجرك عبر اقتراح عروض إضافية مغرية للزبائن أثناء الشراء في السلة أو صفحة المنتج.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('upsells_new')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء Up Sell جديد 🚀</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">إجمالي المبيعات الإضافية من Up Sells</span>
                <div className="text-xl font-black text-slate-900 font-mono text-emerald-600">
                  {formatPrice(upsellsList.reduce((acc, u) => acc + (u.extraRevenue || 0), 0))}
                </div>
                <div className="text-[10px] text-slate-400">إيرادات إضافية بدون زيادة تكلفة الإعلانات</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">متوسط نسبة التحويل (Conversion)</span>
                <div className="text-xl font-black text-indigo-600 font-mono">18.4%</div>
                <div className="text-[10px] text-indigo-500 font-semibold">1 من كل 5 زبائن يقبلون العرض</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">العروض المفعلة حالياً</span>
                <div className="text-xl font-black text-slate-900 font-mono">
                  {upsellsList.length} عروض
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold">تظهر تلقائياً في السلة والصفحة</div>
              </div>
            </div>

            {/* Up Sells List Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">قائمة عروض الـ Up Sells</h4>
              </div>

              <div className="divide-y divide-slate-100">
                {upsellsList.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.status === 'active' ? 'نشط 🟢' : 'معطل ⚪'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span>المنتج المرتبط: <strong className="text-slate-700">{item.productName}</strong></span>
                        <span>•</span>
                        <span>الخصم: <strong className="text-emerald-600 font-mono font-bold">-{item.discountPercentage}%</strong></span>
                        <span>•</span>
                        <span>الموقع: {item.triggerType === 'cart_popup' ? 'نافذة منبثقة في السلة' : 'صفحة المنتج'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto">
                      <div className="text-end">
                        <div className="text-xs font-mono font-bold text-emerald-600">
                          +{formatPrice(item.extraRevenue)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.conversionsCount} تحويل / {item.viewsCount} مشاهدة
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setUpsellsList(prev => prev.map(u => u.id === item.id ? { ...u, status: u.status === 'active' ? 'paused' : 'active' } : u));
                            showToast(isAr ? 'تم تعديل حالة العرض' : 'Status toggled');
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            item.status === 'active' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {item.status === 'active' ? 'إيقاف' : 'تفعيل'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUpsellsList(prev => prev.filter(u => u.id !== item.id));
                            showToast(isAr ? 'تم حذف العرض بنجاح' : 'Offer deleted');
                          }}
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="حذف العرض"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB: UP SELL جديد (NEW UP SELL)
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'upsells_new' && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">إنشاء عرض Up Sell ترويجي جديد</h3>
                <p className="text-xs text-slate-500">ارفع مبيعات كل طلب بعرض قطع إضافية أو خصم على حزمة المنتجات</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('upsells_all')}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold"
              >
                العودة للقائمة ←
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newUpsellTitle.trim()) return;
                const selectedProd = products.find(p => p.id === newUpsellProdId) || products[0];
                const newOffer = {
                  id: `upsell_${Date.now()}`,
                  title: newUpsellTitle.trim(),
                  titleAr: newUpsellTitle.trim(),
                  productId: selectedProd?.id || 'p1',
                  productName: selectedProd?.nameAr || 'منتج إضافي',
                  type: newUpsellType,
                  discountPercentage: Number(newUpsellDiscount) || 20,
                  triggerType: newUpsellTrigger,
                  status: 'active',
                  viewsCount: 0,
                  conversionsCount: 0,
                  extraRevenue: 0
                };
                setUpsellsList([newOffer, ...upsellsList]);
                setNewUpsellTitle('');
                setActiveTab('upsells_all');
                showToast(isAr ? 'تم إنشاء ونشر عرض الـ Up Sell بنجاح! 🚀' : 'Up Sell created');
              }}
              className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-bold mb-1">عنوان العرض الترويجي (يظهر للزبون) *</label>
                <input
                  type="text"
                  required
                  value={newUpsellTitle}
                  onChange={(e) => setNewUpsellTitle(e.target.value)}
                  placeholder="مثال: احصل على القطعة الثانية بخصم 40% فقط!"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">المنتج المقترح بالعرض *</label>
                  <select
                    value={newUpsellProdId}
                    onChange={(e) => setNewUpsellProdId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold cursor-pointer"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.nameAr || p.name} — {formatPrice(p.price)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">نوع العرض الترويجي *</label>
                  <select
                    value={newUpsellType}
                    onChange={(e) => setNewUpsellType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold cursor-pointer"
                  >
                    <option value="discount">خصم بنسبة مئوية (%)</option>
                    <option value="buy_x_get_y">اشتري 2 واحصل على 1 مجاناً</option>
                    <option value="free_shipping">شحن مجاني فوري للطلب</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">نسبة التخفيض (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="90"
                    value={newUpsellDiscount}
                    onChange={(e) => setNewUpsellDiscount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">مكان ظهور العرض *</label>
                  <select
                    value={newUpsellTrigger}
                    onChange={(e) => setNewUpsellTrigger(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold cursor-pointer"
                  >
                    <option value="cart_popup">نافذة منبثقة ذكية في سلة المشتريات (Cart Popup)</option>
                    <option value="product_page">أسفل صفحة المنتج مباشرة (Product Page)</option>
                    <option value="checkout">في استمارة الدفع عند الاستلام (Checkout Form)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('upsells_all')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md cursor-pointer"
                >
                  حفظ وتفعيل الـ Up Sell 🚀
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB: الفواتير والأرباح (INVOICES & BARIDIMOB PAYOUTS)
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">إدارة الفواتير وتحويل الأرباح (BaridiMob / CCP)</h3>
                <p className="text-xs text-slate-500">متابعة دفعات مبيعات الدفع عند الاستلام (COD) وتحويلها لحسابك البنكي</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  showToast(isAr ? 'تم استلام طلب تحويل الأرباح إلى BaridiMob بنجاح! سيتم التحويل خلال 24 ساعة ⚡' : 'Payout requested');
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <CreditCard className="w-4 h-4" />
                <span>طلب سحب الأرباح فوراً 💰</span>
              </button>
            </div>

            {/* Balances Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">الرصيد المتاح للسحب الآن</span>
                <div className="text-2xl font-black text-emerald-600 font-mono">145,000 د.ج</div>
                <div className="text-[10px] text-slate-400">جاهز للتحويل الفوري عبر BaridiMob</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">أرباح قيد التسوية مع شركة الشحن</span>
                <div className="text-2xl font-black text-amber-600 font-mono">68,500 د.ج</div>
                <div className="text-[10px] text-slate-400">طلبات تم تسليمها وتنتظر تحصيل النقد</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">إجمالي المسحوبات السابقة</span>
                <div className="text-2xl font-black text-slate-900 font-mono">920,000 د.ج</div>
                <div className="text-[10px] text-emerald-600 font-semibold">12 عملية تحويل مكتملة ✓</div>
              </div>
            </div>

            {/* Payout Account Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-xs">الحساب المعتمد لتحويل أموالك</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">موثق ومفعل</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block mb-0.5">البنك / الخدمة:</span>
                  <span className="font-bold text-slate-800">بريد الجزائر (BaridiMob / Algérie Poste)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block mb-0.5">رقم الحساب الجاري والـ RIP:</span>
                  <span className="font-mono font-bold text-slate-800">00799999000123456789</span>
                </div>
              </div>
            </div>

            {/* Recent Payouts Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-4 border-b border-slate-100 font-bold text-slate-900 text-xs">سجل الفواتير والتحويلات البنكية الأخيرة</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold">
                    <tr>
                      <th className="p-3">رقم الفاتورة</th>
                      <th className="p-3">التاريخ</th>
                      <th className="p-3">المبلغ</th>
                      <th className="p-3">طريقة الدفع</th>
                      <th className="p-3">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-800">INV-2026-089</td>
                      <td className="p-3 text-slate-500">2026/10/20</td>
                      <td className="p-3 font-mono font-bold text-emerald-600">85,000 د.ج</td>
                      <td className="p-3 text-slate-700">BaridiMob RIP</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">مكتمل ومحول ✓</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-800">INV-2026-088</td>
                      <td className="p-3 text-slate-500">2026/10/12</td>
                      <td className="p-3 font-mono font-bold text-emerald-600">120,000 د.ج</td>
                      <td className="p-3 text-slate-700">BaridiMob RIP</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">مكتمل ومحول ✓</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB: التطبيقات والميزات (APPS & INTEGRATIONS)
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'apps' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
              <h3 className="text-base sm:text-lg font-black text-slate-900">مركز التطبيقات والربط السحابي</h3>
              <p className="text-xs text-slate-500">تطبيقات الشحن لـ 69 ولاية، ربط شركات التوصيل الجزائرية، والدومين المخصص</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                onClick={() => setActiveTab('shipping')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">تطبيق الشحن لـ 69 ولاية جزائرية</h4>
                  <p className="text-xs text-slate-500 mt-1">تحديد أسعار المكتب والمنزل لكل ولاية جزائرية وحساب التكلفة تلقائياً.</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <span>فتح إدارة الشحن</span>
                  <span>←</span>
                </span>
              </div>

              <div 
                onClick={() => setActiveTab('domains')}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">تطبيق النطاق المخصص (Custom Domain)</h4>
                  <p className="text-xs text-slate-500 mt-1">ربط متجرك بنطاق خاص (yourbrand.com أو .dz) مع شهادة SSL مجانية.</p>
                </div>
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                  <span>إعدادات الدومين</span>
                  <span>←</span>
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">شركات التوصيل (Yalidine & ZR Express)</h4>
                  <p className="text-xs text-slate-500 mt-1">مزامنة تتبع الطرود وتوليد بوليصات الشحن تلقائياً عبر API.</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 inline-block">
                  مفعل افتراضياً
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB: التسويق بالعمولة (AFFILIATE MARKETING)
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'affiliate' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
              <h3 className="text-base sm:text-lg font-black text-slate-900">نظام التسويق بالعمولة للمسوقين (Affiliate Program)</h3>
              <p className="text-xs text-slate-500">تمكين المسوقين وصناع المحتوى من الترويج لمنتجاتك وجلب مبيعات مقابل نسبة محددة</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">رابط التسويق الخاص بالمتجر</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://${store.settings?.subdomain || 'wasladz.app'}/?ref=partner`}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-mono font-bold"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(`https://${store.settings?.subdomain || 'wasladz.app'}/?ref=partner`);
                      setAffiliateCopied(true);
                      setTimeout(() => setAffiliateCopied(false), 2000);
                      showToast(isAr ? 'تم نسخ رابط المسوق بنجاح!' : 'Copied');
                    }}
                    className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-all"
                  >
                    {affiliateCopied ? 'تم النسخ ✓' : 'نسخ'}
                  </button>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-slate-700 font-bold">نسبة عمولة المسوق لكل مبيعة مكتملة: {affiliateCommission}%</label>
                  <input
                    type="range"
                    min="5"
                    max="35"
                    step="1"
                    value={affiliateCommission}
                    onChange={(e) => setAffiliateCommission(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>5%</span>
                    <span>10% (موصى بها)</span>
                    <span>20%</span>
                    <span>35%</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">إحصائيات المسوقين الحاليين</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-400">عدد المسوقين النشطين</span>
                    <div className="text-lg font-black text-slate-900 font-mono">6 مسوقين</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-400">مبيعات المسوقين</span>
                    <div className="text-lg font-black text-emerald-600 font-mono">182,000 د.ج</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            TAB: الدعم الفني (SUPPORT & HELP)
        ───────────────────────────────────────────────────────────── */}
        {activeTab === 'support' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
              <h3 className="text-base sm:text-lg font-black text-slate-900">مركز الدعم والمساعدة المباشرة للبائع</h3>
              <p className="text-xs text-slate-500">فريق الدعم الجزائري متاح يومياً لمساعدتك في زيادة مبيعاتك وحل أي استفسار</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">الدعم المباشر عبر واتساب (WhatsApp)</h4>
                <p className="text-xs text-slate-500">تواصل فوري وسريع مع فريق الدعم لحل المشكلات التقنية وتعديل المتاجر.</p>
                <a
                  href="https://wa.me/213550000000"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>مراسلة واتساب (+213 550 00 00 00)</span>
                </a>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Headphones className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">مركز الاتصال الهاتفي بالجزائر</h4>
                <p className="text-xs text-slate-500">متاح من السبت إلى الخميس (08:30 صباحاً إلى 18:00 مساءً).</p>
                <div className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 p-2.5 rounded-xl border border-indigo-200 text-center">
                  الهاتف: 023 45 67 89
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">فتح تذكرة مساعدة سريعة</h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSupportSubmitted(true);
                  showToast(isAr ? 'تم إرسال تذكرتك بنجاح! سيتم الرد عليك عبر البريد أو الهاتف قريباً' : 'Ticket sent');
                  setSupportSubject('');
                  setSupportMessage('');
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-slate-700 font-bold mb-1">موضوع التذكرة *</label>
                  <input
                    type="text"
                    required
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    placeholder="مثال: استفسار حول ربط دومين خاص أو تسعير الشحن..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-emerald-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">تفاصيل الرسالة أو المشكلة *</label>
                  <textarea
                    rows={4}
                    required
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="اكتب بالتفصيل ما تحتاجه..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 resize-none focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
                >
                  إرسال التذكرة ✉️
                </button>
              </form>
            </div>
          </div>
        )}

        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: EDIT WILAYA PRICES
      ───────────────────────────────────────────────────────────── */}
      {editingWilaya && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                تعديل أسعار الشحن لولاية ({editingWilaya.code} - {editingWilaya.nameAr})
              </h3>
              <button onClick={() => setEditingWilaya(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  سعر التوصيل للمكتب (Stop-Desk) بالدينار الجزائري (د.ج)
                </label>
                <input
                  type="number"
                  value={editDeskPrice}
                  onChange={(e) => setEditDeskPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  سعر التوصيل للمنزل (Domicile) بالدينار الجزائري (د.ج)
                </label>
                <input
                  type="number"
                  value={editHomePrice}
                  onChange={(e) => setEditHomePrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingWilaya(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                onClick={handleSavePrices}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
              >
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: ADD & EDIT PRODUCT (UP TO 10 IMAGES, SIZES, COLORS, COST)
      ───────────────────────────────────────────────────────────── */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="max-w-2xl w-full bg-white rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 text-right max-h-[92vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingProduct ? 'تعديل بيانات المنتج والمخزون' : 'إضافة منتج جديد (مع 10 صور وألوان ومقاسات)'}
                </h3>
              </div>
              <button onClick={() => setIsAddProductOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4 text-xs overflow-y-auto flex-1 p-1">
              
              {/* Product Names (Arabic & English) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">اسم المنتج بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={prodNameAr}
                    onChange={(e) => setProdNameAr(e.target.value)}
                    placeholder="مثال: طقم ساعة يد وإكسسوار فاخر"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-emerald-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الاسم بالإنجليزية (Latin)</label>
                  <input
                    type="text"
                    value={prodNameEn}
                    onChange={(e) => setProdNameEn(e.target.value)}
                    placeholder="e.g. Luxury Watch Set"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Pricing, Cost & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">سعر البيع (د.ج) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">السعر قبل الخصم</label>
                  <input
                    type="number"
                    value={prodComparePrice}
                    onChange={(e) => setProdComparePrice(Number(e.target.value))}
                    placeholder="شطب السعر"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">سعر التكلفة (Cost)</label>
                  <input
                    type="number"
                    value={prodCostPrice}
                    onChange={(e) => setProdCostPrice(Number(e.target.value))}
                    placeholder="لحساب الأرباح"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">الكمية بالمخزون</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Profit Margin Indicator */}
              {prodPrice > 0 && prodCostPrice > 0 && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between font-bold text-[11px]">
                  <span>صافي الربح المتوقع لكل قطعة:</span>
                  <span className="font-mono text-xs font-black">
                    +{(prodPrice - prodCostPrice).toLocaleString()} د.ج ({Math.round(((prodPrice - prodCostPrice) / prodPrice) * 100)}% هامش ربح)
                  </span>
                </div>
              )}

              {/* 10 Images Upload Section with Primary Selector */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>صور المنتج (حتى 10 صور) — حالياً {prodImages.length} من 10</span>
                  </span>
                  <span className="text-[11px] text-slate-500">انقر على أي صورة لتعيينها كرئيسية ⭐</span>
                </div>

                {/* Input to add Image URL */}
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="ألصق رابط صورة إضافية (URL)..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                  >
                    إضافة صورة
                  </button>
                </div>

                {/* Images Preview Grid with Primary Badge */}
                <div className="grid grid-cols-5 gap-2.5 pt-1">
                  {prodImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setPrimaryImageIdx(idx)}
                      className={`relative group rounded-xl overflow-hidden border-2 h-20 bg-white cursor-pointer transition-all ${
                        primaryImageIdx === idx ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      
                      {primaryImageIdx === idx && (
                        <span className="absolute top-1 start-1 bg-emerald-600 text-white rounded text-[9px] font-black px-1.5 py-0.5 shadow">
                          رئيسية ⭐
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(idx);
                        }}
                        className="absolute bottom-1 end-1 p-1 bg-black/75 hover:bg-rose-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="حذف الصورة"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Variants with Hex Picker */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-indigo-600" />
                    <span>خيارات الألوان المتاحة للمشتري</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-10 h-9 p-0.5 rounded-xl border border-slate-200 bg-white cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorNameAr}
                    onChange={(e) => setColorNameAr(e.target.value)}
                    placeholder="اسم اللون (مثال: أزرق كحلي، أحمر ياقوتي)..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs cursor-pointer"
                  >
                    + إضافة لون
                  </button>
                </div>

                {/* Colors List */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {prodColors.map((c, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 flex items-center gap-2 text-xs font-bold shadow-2xs"
                    >
                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: c.hex }} />
                      <span>{c.nameAr || c.name}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveColor(c.hex)}
                        className="text-slate-400 hover:text-rose-600 ms-1 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Size Variants (S, M, L, XL, 38, 39, 40...) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-600" />
                    <span>المقاسات المتوفرة (Sizes)</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    placeholder="أدخل مقاس (مثال: M, L, XL, 42, 43)..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-3 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs cursor-pointer"
                  >
                    + إضافة مقاس
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {prodSizes.map((sz, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 shadow-2xs"
                    >
                      <span>{sz}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSize(sz)}
                        className="text-slate-400 hover:text-rose-600 ms-1 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">وصف المنتج ومميزاته للزبون</label>
                <textarea
                  rows={3}
                  value={prodDescAr}
                  onChange={(e) => setProdDescAr(e.target.value)}
                  placeholder="اكتب وصفاً جذاباً للمنتج..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 resize-none focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md cursor-pointer"
                >
                  {editingProduct ? 'حفظ التعديلات ✓' : 'حفظ ونشر المنتج 🚀'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};