import React, { useState, useMemo } from 'react';
import { Store, Currency, Language, PlanType } from '../types';
import { CURRENCY_RATES } from '../data/initialData';
import { DEFAULT_WILAYAS_69 } from '../data/wilayasData';
import { 
  Store as StoreIcon, Users, DollarSign, ShoppingCart, 
  Trash2, ExternalLink, Globe, Search, ShieldCheck, BarChart3, 
  LogOut, Plus, Phone, Mail, MapPin, Eye, CheckCircle2, 
  AlertTriangle, Filter, Download, ChevronRight, SlidersHorizontal, 
  RefreshCw, Package, Check, X, Building, Clock, Activity, 
  Award, Sparkles, UserCheck, ArrowUpRight, TrendingUp,
  LayoutGrid, Table as TableIcon, Copy, Smartphone, CreditCard
} from 'lucide-react';

interface PlatformAdminViewProps {
  stores: Store[];
  currency: Currency;
  language: Language;
  onSelectStore: (storeId: string) => void;
  onDeleteStore: (storeId: string) => void;
  onToggleStoreStatus?: (storeId: string, status: 'active' | 'suspended' | 'pending') => void;
  onUpdateStorePlan?: (storeId: string, plan: PlanType) => void;
  onAddStore?: (store: Store) => void;
  onBackToPlatform?: () => void;
}

export const PlatformAdminView: React.FC<PlatformAdminViewProps> = ({
  stores,
  currency,
  language,
  onSelectStore,
  onDeleteStore,
  onToggleStoreStatus,
  onUpdateStorePlan,
  onAddStore,
  onBackToPlatform
}) => {
  const isAr = language === 'ar';

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [planFilter, setPlanFilter] = useState<'all' | PlanType>('all');
  const [wilayaFilter, setWilayaFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'sales_desc' | 'orders_desc' | 'newest' | 'name_asc'>('sales_desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals & Drawers
  const [selectedMerchant, setSelectedMerchant] = useState<Store | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Store | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // New Merchant Form State
  const [newStoreNameAr, setNewStoreNameAr] = useState('');
  const [newStoreNameEn, setNewStoreNameEn] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerPhone, setNewOwnerPhone] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [newWilaya, setNewWilaya] = useState('الجزائر العاصمة');
  const [newCategory, setNewCategory] = useState('أزياء وإلكترونيات');
  const [newPlan, setNewPlan] = useState<PlanType>('pro');

  const formatPrice = (amount: number) => {
    const rateInfo = CURRENCY_RATES[currency] || { rate: 1, symbol: 'DZD', symbolAr: 'د.ج' };
    const converted = Math.round(amount * rateInfo.rate);
    return `${converted.toLocaleString()} ${isAr ? rateInfo.symbolAr : rateInfo.symbol}`;
  };

  // Filtering and Sorting
  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        s.name.toLowerCase().includes(q) ||
        s.nameAr.toLowerCase().includes(q) ||
        s.ownerName.toLowerCase().includes(q) ||
        (s.ownerEmail && s.ownerEmail.toLowerCase().includes(q)) ||
        (s.ownerPhone && s.ownerPhone.includes(q)) ||
        (s.wilaya && s.wilaya.toLowerCase().includes(q)) ||
        s.slug.toLowerCase().includes(q) ||
        (s.categoryAr && s.categoryAr.toLowerCase().includes(q));

      const storeStatus = s.status || 'active';
      const matchesStatus = statusFilter === 'all' || storeStatus === statusFilter;
      const matchesPlan = planFilter === 'all' || s.plan === planFilter;
      const matchesWilaya = wilayaFilter === 'all' || s.wilaya === wilayaFilter;

      return matchesSearch && matchesStatus && matchesPlan && matchesWilaya;
    }).sort((a, b) => {
      if (sortBy === 'sales_desc') return (b.totalSales || 0) - (a.totalSales || 0);
      if (sortBy === 'orders_desc') return (b.ordersCount || 0) - (a.ordersCount || 0);
      if (sortBy === 'newest') return (b.createdAt || '').localeCompare(a.createdAt || '');
      if (sortBy === 'name_asc') return a.nameAr.localeCompare(b.nameAr);
      return 0;
    });
  }, [stores, searchQuery, statusFilter, planFilter, wilayaFilter, sortBy]);

  // Overall Platform Metrics
  const totalStoresCount = stores.length;
  const activeStoresCount = stores.filter(s => (s.status || 'active') === 'active').length;
  const pendingStoresCount = stores.filter(s => s.status === 'pending').length;
  const suspendedStoresCount = stores.filter(s => s.status === 'suspended').length;
  const totalPlatformSales = stores.reduce((acc, s) => acc + (s.totalSales || 0), 0);
  const totalPlatformOrders = stores.reduce((acc, s) => acc + (s.ordersCount || 0), 0);
  const avgStoreSales = totalStoresCount > 0 ? Math.round(totalPlatformSales / totalStoresCount) : 0;

  // Top 3 merchants leaderboard
  const topMerchants = useMemo(() => {
    return [...stores].sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0)).slice(0, 3);
  }, [stores]);

  // Copy Slug
  const handleCopyLink = (slug: string) => {
    const fullUrl = `https://${slug}.wasladz.app`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Export to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    const headers = ['معرف المتجر', 'اسم المتجر بالعربية', 'اسم المتجر بالإنجليزية', 'اسم التاجر', 'رقم الهاتف', 'البريد الإلكتروني', 'الولاية', 'الفئة', 'الباقة', 'إجمالي المبيعات (د.ج)', 'عدد الطلبات', 'الحالة', 'تاريخ التسجيل'];
    const rows = filteredStores.map(s => [
      s.id,
      `"${s.nameAr.replace(/"/g, '""')}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.ownerName.replace(/"/g, '""')}"`,
      `"${s.ownerPhone || 'غير مسجل'}"`,
      `"${s.ownerEmail || 'غير مسجل'}"`,
      `"${s.wilaya || 'الجزائر العاصمة'}"`,
      `"${s.categoryAr || s.category}"`,
      s.plan,
      s.totalSales || 0,
      s.ordersCount || 0,
      s.status || 'active',
      s.createdAt || ''
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `wasladz_merchants_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Merchant Form Submit
  const handleCreateMerchant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreNameAr.trim() || !newOwnerName.trim()) return;

    const baseSlug = newStoreNameEn.trim() 
      ? newStoreNameEn.toLowerCase().replace(/[^a-z0-9]/g, '-')
      : `store-${Date.now().toString().slice(-4)}`;

    const newStore: Store = {
      id: `str_${Date.now()}`,
      name: newStoreNameEn.trim() || newStoreNameAr.trim(),
      nameAr: newStoreNameAr.trim(),
      slug: baseSlug,
      slogan: 'متجر إلكتروني معتمد مع دفع عند الاستلام',
      sloganAr: `المتجر الإلكتروني المعتمد لـ ${newStoreNameAr.trim()}`,
      description: `متجر سحابي مستقل في ولاية ${newWilaya}`,
      descriptionAr: `متجر متخصص في ${newCategory} بولاية ${newWilaya} مع التوصيل السريع لكافة الولايات.`,
      category: newCategory,
      categoryAr: newCategory,
      ownerName: newOwnerName.trim(),
      ownerEmail: newOwnerEmail.trim() || `${baseSlug}@merchant.dz`,
      ownerPhone: newOwnerPhone.trim() || '0550 00 00 00',
      wilaya: newWilaya,
      wilayaCode: DEFAULT_WILAYAS_69.find(w => w.nameAr === newWilaya)?.code || '16',
      status: 'active',
      plan: newPlan,
      accentColor: '#059669',
      totalSales: 0,
      ordersCount: 0,
      productsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      supabaseConnected: true,
      githubConnected: false,
      settings: {
        subdomain: `${baseSlug}.wasladz.app`,
        themeColor: '#059669',
        shippingRate: 450,
        freeShippingThreshold: 8000,
        taxRate: 0,
        currency: 'DZD',
        isPublished: true,
        payoutBank: 'بريد الجزائر (BaridiMob)',
        payoutIban: '00799999000000000000',
        activeCarrier: 'yalidine',
        defaultDeliveryType: 'home',
        enableFakeOrderShield: true,
        enableLandingPageDirectBuy: true
      }
    };

    if (onAddStore) {
      onAddStore(newStore);
    }
    setIsAddModalOpen(false);
    // Reset inputs
    setNewStoreNameAr('');
    setNewStoreNameEn('');
    setNewOwnerName('');
    setNewOwnerPhone('');
    setNewOwnerEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white pb-16" dir="rtl">
      
      {/* 1. Header Bar: Central SaaS Tower */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
            
            {/* Platform Branding & Super-Admin Badge */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-white tracking-tight">
                    لوحة الإدارة المركزية للمنصة
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    WaslaDZ Super-Admin
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>متابعة كاملة لبيانات ومبيعات التجار المسجلين في الـ 69 ولاية</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة تاجر جديد</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="تصدير تقرير التجار بتنسيق Excel/CSV"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">تصدير CSV</span>
              </button>

              {onBackToPlatform && (
                <button
                  onClick={onBackToPlatform}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>العودة للمتجر</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* 2. Global Platform KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Total Stores */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold tracking-wider uppercase">إجمالي التجار والمتاجر</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <StoreIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-mono">{totalStoresCount}</div>
            <div className="flex items-center gap-2 mt-2 text-[11px]">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {activeStoresCount} نشط
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400 font-semibold">{pendingStoresCount} قيد المراجعة</span>
              {suspendedStoresCount > 0 && (
                <>
                  <span className="text-slate-500">•</span>
                  <span className="text-rose-400 font-semibold">{suspendedStoresCount} معلق</span>
                </>
              )}
            </div>
          </div>

          {/* Platform GMV */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold tracking-wider uppercase">حجم مبيعات المنصة (GMV)</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">{formatPrice(totalPlatformSales)}</div>
            <div className="flex items-center gap-1 text-[11px] text-indigo-400 font-semibold mt-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>مبيعات موثقة بالدفع عند الاستلام (COD)</span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold tracking-wider uppercase">إجمالي الطلبات المحققة</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white font-mono">{totalPlatformOrders.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold mt-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تم شحنها وتوجيهها لشركات التوصيل</span>
            </div>
          </div>

          {/* Average Sales / Merchant */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-teal-500/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all"></div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold tracking-wider uppercase">متوسط مبيعات التاجر</span>
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{formatPrice(avgStoreSales)}</div>
            <div className="flex items-center gap-1 text-[11px] text-teal-400 font-semibold mt-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>معدل نمو تجارة الـ E-Commerce الجزائري</span>
            </div>
          </div>

        </div>

        {/* 3. Top Performing Merchants Leaderboard & Insights Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Top 3 Merchants Podium */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-white">المتاجر الأعلى مبيعاً على المنصة (Leaderboard)</h2>
              </div>
              <span className="text-[11px] text-slate-400">تحديث فوري للترتيب</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topMerchants.map((merchant, idx) => {
                const rankColor = idx === 0 
                  ? 'from-amber-500/20 to-amber-900/20 border-amber-500/40 text-amber-400' 
                  : idx === 1 
                    ? 'from-slate-400/20 to-slate-800/20 border-slate-400/40 text-slate-300' 
                    : 'from-amber-700/20 to-amber-950/20 border-amber-700/40 text-amber-600';
                
                const rankBadge = idx === 0 ? '🥇 المركز الأول' : idx === 1 ? '🥈 المركز الثاني' : '🥉 المركز الثالث';

                return (
                  <div 
                    key={merchant.id}
                    onClick={() => setSelectedMerchant(merchant)}
                    className={`p-4 rounded-xl bg-gradient-to-b ${rankColor} border transition-all cursor-pointer hover:scale-[1.02] flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                        <span>{rankBadge}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-900/60 text-slate-300 text-[10px]">
                          {merchant.wilaya || 'الجزائر'}
                        </span>
                      </div>
                      <div className="font-bold text-white text-sm line-clamp-1">{merchant.nameAr}</div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-500" />
                        <span>{merchant.ownerName}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between">
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        {formatPrice(merchant.totalSales || 0)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {merchant.ordersCount || 0} طلب
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coverage & Logistics Brief */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-sm font-bold text-white">تغطية الولايات والشحن (69 ولاية)</h2>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  100% مغطاة
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                جميع المتاجر مربوطة تلقائياً بنظام الشحن الموحد لـ 69 ولاية جزائرية، مع تسعيرتين: للمكتب (Stop-Desk) والمنزل (Domicile).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-slate-400 text-[10px]">شركات الشحن المدعومة</div>
                <div className="font-bold text-white mt-1">Yalidine / ZR / Maystro</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-slate-400 text-[10px]">نظام الدفع المعتمد</div>
                <div className="font-bold text-emerald-400 mt-1">الدفع عند الاستلام + BaridiMob</div>
              </div>
            </div>
          </div>

        </div>

        {/* 4. Controls, Search, Filter & View Mode Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute top-3.5 start-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، اسم التاجر، رقم الهاتف، البريد، الولاية، أو الرابط (slug)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-10 pe-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute top-3 end-3 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter by Wilaya */}
            <div className="w-full sm:w-48">
              <select
                value={wilayaFilter}
                onChange={(e) => setWilayaFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">كل الولايات (69 ولاية)</option>
                {DEFAULT_WILAYAS_69.map((w) => (
                  <option key={w.code} value={w.nameAr}>
                    {w.code} - {w.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="w-full sm:w-44">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="sales_desc">الأعلى مبيعاً (GMV)</option>
                <option value="orders_desc">الأكثر طلباً</option>
                <option value="newest">الأحدث تسجيلاً</option>
                <option value="name_asc">الاسم أبجدياً</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl self-start lg:self-auto">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="عرض الجدول المفصل"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="عرض البطاقات"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Secondary Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60 text-xs">
            <span className="text-slate-500 text-[11px] font-bold">الحالة:</span>
            {[
              { id: 'all', label: `الكل (${stores.length})` },
              { id: 'active', label: `نشطة (${activeStoresCount})` },
              { id: 'pending', label: `قيد المراجعة (${pendingStoresCount})` },
              { id: 'suspended', label: `معلقة (${suspendedStoresCount})` },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {st.label}
              </button>
            ))}

            <span className="text-slate-500 text-[11px] font-bold ms-3">الباقة:</span>
            {[
              { id: 'all', label: 'الكل' },
              { id: 'pro', label: 'Pro Unlocked' },
              { id: 'enterprise', label: 'Enterprise' },
              { id: 'free', label: 'Free' },
            ].map((pl) => (
              <button
                key={pl.id}
                onClick={() => setPlanFilter(pl.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  planFilter === pl.id
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {pl.label}
              </button>
            ))}

            <span className="ms-auto text-slate-500 text-[11px]">
              عرض <strong className="text-white font-mono">{filteredStores.length}</strong> من إجمالي {stores.length} متجر
            </span>
          </div>

        </div>

        {/* 5. Main Merchant Data: Table or Grid */}
        {filteredStores.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">لم يتم العثور على أي متجر يطابق البحث</h3>
            <p className="text-xs text-slate-400">
              يرجى تجربة كلمات بحث أخرى أو إلغاء تطبيق الفلاتر.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPlanFilter('all');
                setWilayaFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-950/70 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
                    <th className="py-3.5 px-4">المتجر والرابط</th>
                    <th className="py-3.5 px-4">التاجر ومعلومات الاتصال</th>
                    <th className="py-3.5 px-4">الولاية والمقر</th>
                    <th className="py-3.5 px-4">الفئة والباقة</th>
                    <th className="py-3.5 px-4">المبيعات (GMV)</th>
                    <th className="py-3.5 px-4">الطلبات</th>
                    <th className="py-3.5 px-4">الحالة</th>
                    <th className="py-3.5 px-4 text-center">إجراءات الإدارة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-xs">
                  {filteredStores.map((store) => {
                    const status = store.status || 'active';
                    const isSuspended = status === 'suspended';

                    return (
                      <tr 
                        key={store.id}
                        className={`hover:bg-slate-800/40 transition-colors ${isSuspended ? 'opacity-60 bg-rose-950/10' : ''}`}
                      >
                        {/* Store Info */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md"
                              style={{ backgroundColor: store.accentColor || '#059669' }}
                            >
                              {store.nameAr.slice(0, 1)}
                            </div>
                            <div className="space-y-0.5">
                              <div className="font-bold text-white text-sm hover:text-emerald-400 transition-colors cursor-pointer" onClick={() => setSelectedMerchant(store)}>
                                {store.nameAr}
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                                <span>{store.slug}.wasladz.app</span>
                                <button 
                                  onClick={() => handleCopyLink(store.slug)}
                                  className="text-slate-500 hover:text-emerald-400"
                                  title="نسخ رابط المتجر"
                                >
                                  {copiedSlug === store.slug ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Owner Info & Contacts */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="font-bold text-slate-200 flex items-center gap-1.5">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{store.ownerName}</span>
                            </div>
                            <div className="flex flex-col gap-0.5 text-[11px] text-slate-400">
                              {store.ownerPhone && (
                                <a 
                                  href={`tel:${store.ownerPhone}`}
                                  className="hover:text-emerald-400 flex items-center gap-1 font-mono"
                                  title="اتصال هاتفي"
                                >
                                  <Phone className="w-3 h-3 text-slate-500" />
                                  <span dir="ltr">{store.ownerPhone}</span>
                                </a>
                              )}
                              {store.ownerEmail && (
                                <span className="text-slate-500 font-mono truncate max-w-[170px]" title={store.ownerEmail}>
                                  {store.ownerEmail}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Wilaya & Location */}
                        <td className="py-4 px-4">
                          <div className="space-y-0.5">
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold">
                              <MapPin className="w-3 h-3 text-emerald-400" />
                              <span>{store.wilaya || 'الجزائر العاصمة'}</span>
                            </div>
                            {store.wilayaCode && (
                              <div className="text-[10px] text-slate-500 font-mono ms-1">
                                ولاية رقم {store.wilayaCode}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Category & Plan */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="text-slate-300 font-medium">
                              {store.categoryAr || store.category}
                            </div>
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              store.plan === 'pro'
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                                : store.plan === 'enterprise'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              {store.plan === 'pro' ? 'Pro Unlocked' : store.plan === 'enterprise' ? 'Enterprise' : 'Free Plan'}
                            </span>
                          </div>
                        </td>

                        {/* Sales (GMV) */}
                        <td className="py-4 px-4 font-mono font-bold text-emerald-400 text-sm">
                          {formatPrice(store.totalSales || 0)}
                        </td>

                        {/* Orders Count */}
                        <td className="py-4 px-4">
                          <div className="font-mono font-bold text-white">
                            {store.ordersCount || 0}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {store.productsCount || 10}+ منتج
                          </div>
                        </td>

                        {/* Status Switch */}
                        <td className="py-4 px-4">
                          <button
                            onClick={() => {
                              if (onToggleStoreStatus) {
                                const nextStatus = status === 'active' ? 'suspended' : 'active';
                                onToggleStoreStatus(store.id, nextStatus);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                              status === 'active'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                                : status === 'pending'
                                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25'
                            }`}
                            title="انقر لتغيير حالة المتجر"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              status === 'active' ? 'bg-emerald-400' : status === 'pending' ? 'bg-amber-400' : 'bg-rose-400'
                            }`}></span>
                            <span>{status === 'active' ? 'نشط أونلاين' : status === 'pending' ? 'قيد المراجعة' : 'مجمّد وموقوف'}</span>
                          </button>
                        </td>

                        {/* Admin Action Buttons */}
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            
                            {/* Impersonate / Enter as Merchant */}
                            <button
                              onClick={() => onSelectStore(store.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
                              title="الدخول إلى لوحة تحكم هذا التاجر"
                            >
                              <span>الدخول كتاجر</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>

                            {/* View Details Drawer */}
                            <button
                              onClick={() => setSelectedMerchant(store)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="عرض ملف التاجر الكامل"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Delete Store */}
                            <button
                              onClick={() => setDeleteCandidate(store)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                              title="حذف المتجر نهائياً"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStores.map((store) => {
              const status = store.status || 'active';
              const isSuspended = status === 'suspended';

              return (
                <div 
                  key={store.id}
                  className={`rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg transition-all hover:border-slate-700 flex flex-col justify-between ${
                    isSuspended ? 'opacity-70 border-rose-900/50' : ''
                  }`}
                >
                  <div>
                    {/* Store Card Header Banner */}
                    <div 
                      className="p-4 border-b border-slate-800 relative"
                      style={{
                        background: `linear-gradient(135deg, ${store.accentColor || '#059669'}22 0%, rgba(15,23,42,0.95) 100%)`
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-base shadow"
                            style={{ backgroundColor: store.accentColor || '#059669' }}
                          >
                            {store.nameAr.slice(0, 1)}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-base leading-tight">{store.nameAr}</h3>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">{store.slug}.wasladz.app</div>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          status === 'active' 
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}>
                          {status === 'active' ? 'نشط' : 'معلق'}
                        </span>
                      </div>
                    </div>

                    {/* Merchant Details Info */}
                    <div className="p-4 space-y-3 text-xs">
                      
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                        <span className="text-slate-400">صاحب المتجر:</span>
                        <span className="font-bold text-white flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          {store.ownerName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                        <span className="text-slate-400">الهاتف / الولاية:</span>
                        <span className="font-mono text-slate-200">
                          {store.ownerPhone || '0550 00 00 00'} • {store.wilaya || 'الجزائر'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                        <span className="text-slate-400">الفئة والباقة:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-300">{store.categoryAr || store.category}</span>
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">
                            {store.plan.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Stats Mini Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                          <div className="text-[10px] text-slate-400">حجم المبيعات</div>
                          <div className="font-bold font-mono text-emerald-400 text-sm mt-0.5">
                            {formatPrice(store.totalSales || 0)}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                          <div className="text-[10px] text-slate-400">عدد الطلبات</div>
                          <div className="font-bold font-mono text-white text-sm mt-0.5">
                            {store.ordersCount || 0} طلب
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectStore(store.id)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>الدخول كتاجر</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setSelectedMerchant(store)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="عرض التفاصيل الكاملة"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteCandidate(store)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="حذف المتجر"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* 6. Merchant Deep-Dive Modal / Drawer */}
      {selectedMerchant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-6 text-right max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div 
              className="p-6 border-b border-slate-800 relative"
              style={{
                background: `linear-gradient(135deg, ${selectedMerchant.accentColor || '#059669'}33 0%, rgba(15,23,42,0.95) 100%)`
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg"
                    style={{ backgroundColor: selectedMerchant.accentColor || '#059669' }}
                  >
                    {selectedMerchant.nameAr.slice(0, 1)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">{selectedMerchant.nameAr}</h2>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">https://{selectedMerchant.slug}.wasladz.app</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMerchant(null)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              
              {/* Merchant Contact Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>بيانات التاجر الشخصية والاتصال</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[11px]">الاسم الكامل:</span>
                    <strong className="text-white text-sm">{selectedMerchant.ownerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">رقم الهاتف:</span>
                    <strong className="text-white font-mono text-sm" dir="ltr">{selectedMerchant.ownerPhone || '0550 12 34 56'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">البريد الإلكتروني:</span>
                    <strong className="text-white font-mono">{selectedMerchant.ownerEmail}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">المقر والولاية:</span>
                    <strong className="text-emerald-400">{selectedMerchant.wilaya || 'الجزائر العاصمة'} (ولاية {selectedMerchant.wilayaCode || '16'})</strong>
                  </div>
                </div>
              </div>

              {/* Financial & Order Performance */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">إجمالي المبيعات</div>
                  <div className="text-base font-black text-emerald-400 font-mono mt-1">
                    {formatPrice(selectedMerchant.totalSales || 0)}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">الطلبات المسجلة</div>
                  <div className="text-base font-black text-white font-mono mt-1">
                    {selectedMerchant.ordersCount || 0}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">تاريخ التسجيل</div>
                  <div className="text-xs font-bold text-slate-300 font-mono mt-1.5">
                    {selectedMerchant.createdAt || '2026-10-18'}
                  </div>
                </div>
              </div>

              {/* Algerian COD Logistics Settings */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-400" />
                  <span>إعدادات الشحن والدفع الخاصة بالمتجر</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[11px]">شركة التوصيل المعتمدة:</span>
                    <span className="font-bold text-white uppercase">{selectedMerchant.settings?.activeCarrier || 'yalidine'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">نوع التوصيل الافتراضي:</span>
                    <span className="text-white">
                      {selectedMerchant.settings?.defaultDeliveryType === 'desk' ? 'استلام من المكتب (Stop-Desk)' : 'توصيل للمنزل (Domicile)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">حساب استلام الأرباح:</span>
                    <span className="text-emerald-400 font-mono text-[11px]">
                      {selectedMerchant.settings?.payoutBank || 'بريد الجزائر BaridiMob'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">درع تصفية الطلبات الوهمية:</span>
                    <span className="text-emerald-400 font-bold">مفعّل (Fake Order Shield ON)</span>
                  </div>
                </div>
              </div>

              {/* Status and Plan Modifiers */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-slate-400 block text-[11px]">ترقية أو تعديل الباقة:</span>
                  <div className="flex items-center gap-2 mt-1">
                    {(['free', 'pro', 'enterprise'] as PlanType[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          if (onUpdateStorePlan) {
                            onUpdateStorePlan(selectedMerchant.id, p);
                            setSelectedMerchant({ ...selectedMerchant, plan: p });
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                          selectedMerchant.plan === p
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">حالة المتجر:</span>
                  <div className="flex items-center gap-2 mt-1">
                    {(['active', 'pending', 'suspended'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          if (onToggleStoreStatus) {
                            onToggleStoreStatus(selectedMerchant.id, st);
                            setSelectedMerchant({ ...selectedMerchant, status: st });
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          (selectedMerchant.status || 'active') === st
                            ? st === 'active' ? 'bg-emerald-600 text-white' : st === 'pending' ? 'bg-amber-600 text-white' : 'bg-rose-600 text-white'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {st === 'active' ? 'نشط' : st === 'pending' ? 'مراجعة' : 'معلق'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  onSelectStore(selectedMerchant.id);
                  setSelectedMerchant(null);
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <span>الدخول والتحكم كتاجر</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedMerchant(null)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 7. Add New Merchant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-5 text-right">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                  <StoreIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">إضافة تاجر ومتجر جديد للمنصة</h3>
                  <p className="text-xs text-slate-400">تجهيز متجر جزائري مع تفعيل الشحن لـ 69 ولاية</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMerchant} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">اسم المتجر بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={newStoreNameAr}
                    onChange={(e) => setNewStoreNameAr(e.target.value)}
                    placeholder="مثال: متجر السعادة وهران"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">الاسم بالإنجليزية (Slug)</label>
                  <input
                    type="text"
                    value={newStoreNameEn}
                    onChange={(e) => setNewStoreNameEn(e.target.value)}
                    placeholder="al-saada-oran"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">اسم التاجر / المالك *</label>
                  <input
                    type="text"
                    required
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    placeholder="محمد بن علي"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">رقم الهاتف (الجزائر)</label>
                  <input
                    type="tel"
                    value={newOwnerPhone}
                    onChange={(e) => setNewOwnerPhone(e.target.value)}
                    placeholder="0550 12 34 56"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={newOwnerEmail}
                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                    placeholder="merchant@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">الولاية والمقر</label>
                  <select
                    value={newWilaya}
                    onChange={(e) => setNewWilaya(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {DEFAULT_WILAYAS_69.map((w) => (
                      <option key={w.code} value={w.nameAr}>
                        {w.code} - {w.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">فئة المتجر</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="أزياء وإلكترونيات">أزياء وإلكترونيات</option>
                    <option value="مستحضرات تجميل وعناية">مستحضرات تجميل وعناية</option>
                    <option value="أدوات منزلية ومطبخ">أدوات منزلية ومطبخ</option>
                    <option value="ساعات وإكسسوارات">ساعات وإكسسوارات</option>
                    <option value="رياضة ولياقة بدنية">رياضة ولياقة بدنية</option>
                    <option value="أزياء تقليدية وتراثية">أزياء تقليدية وتراثية</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-300 font-bold">خطة الاشتراك</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="pro">باقة Pro Unlocked (موصى بها)</option>
                    <option value="enterprise">باقة Enterprise للشركات</option>
                    <option value="free">باقة مجانية Free</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  إنشاء المتجر فوراً
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 8. Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">تأكيد حذف متجر التاجر نهائياً</h3>
              <p className="text-xs text-slate-400">
                هل أنت متأكد من رغبتك في حذف متجر <strong className="text-rose-400">{deleteCandidate.nameAr}</strong> للتاجر <strong className="text-white">{deleteCandidate.ownerName}</strong>؟
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              سيتم حذف جميع إعدادات المتجر وبياناته ولن يتمكن التاجر من الوصول إليه.
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                تراجع
              </button>
              <button
                onClick={() => {
                  onDeleteStore(deleteCandidate.id);
                  setDeleteCandidate(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 cursor-pointer"
              >
                نعم، احذف المتجر
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
