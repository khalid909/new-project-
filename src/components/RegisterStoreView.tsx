import React, { useState } from 'react';
import { PlanType, Store, Language, Currency } from '../types';

import { 
  Store as StoreIcon, Sparkles, Check, ArrowRight, ArrowLeft, 
  ShieldCheck, Globe, Zap, CheckCircle2, Copy, ExternalLink,
  Laptop, ShoppingBag, BarChart2, Sliders
} from 'lucide-react';

interface RegisterStoreViewProps {
  language: Language;
  currency: Currency;
  onRegisterSuccess: (store: Store, targetMode?: 'store' | 'dashboard') => void;
  onGoToExistingStore: () => void;
  existingStoreName: string;
}

export const RegisterStoreView: React.FC<RegisterStoreViewProps> = ({
  language,
  currency,
  onRegisterSuccess,
  onGoToExistingStore,
  existingStoreName
}) => {
  const isAr = language === 'ar';

  // Form State
  const [storeName, setStoreName] = useState('');
  const [storeNameAr, setStoreNameAr] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [category, setCategory] = useState('Fashion & Apparel');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [wilaya, setWilaya] = useState('الجزائر العاصمة');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Post-Registration Independence Launch State
  const [createdStore, setCreatedStore] = useState<Store | null>(null);

  // Auto-generate subdomain from store name
  const handleStoreNameChange = (val: string) => {
    setStoreName(val);
    if (!subdomain || subdomain === storeName.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      const slug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setSubdomain(slug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const cleanSlug = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '') || 'my-store';
      const newStoreId = `str_${Date.now()}`;
      const newStore: Store = {
        id: newStoreId,
        name: storeName.trim(),
        nameAr: storeNameAr.trim() || storeName.trim(),
        slug: cleanSlug,
        slogan: isAr ? 'المتجر الإلكتروني المعتمد' : 'Official Verified Store',
        sloganAr: storeNameAr.trim() ? `المتجر الرسمي لـ ${storeNameAr.trim()}` : 'المتجر الإلكتروني المعتمد',
        description: isAr 
          ? `مرحباً بك في متجر ${storeNameAr.trim() || storeName.trim()} المستقل.` 
          : `Welcome to the independent ${storeName.trim()} storefront.`,
        descriptionAr: `متجر سحابي مستقل متخصص في ${category}. نوفر أفضل المنتجات مع شحن سريع وضمان معتمد.`,
        category,
        categoryAr: category,
        ownerName: ownerName.trim(),
        ownerEmail: ownerEmail.trim().toLowerCase(),
        ownerPhone: ownerPhone.trim() || '0550 12 34 56',
        wilaya: wilaya,
        status: 'active',
        plan: 'free',
        accentColor: '#059669',
        totalSales: 0,
        ordersCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        supabaseConnected: true,
        githubConnected: true,
        settings: {
          subdomain: `${cleanSlug}.wasladz.app`,
          customDomain: undefined,
          themeColor: '#059669',
          shippingRate: 450,
          freeShippingThreshold: 8000,
          taxRate: 0,
          currency: 'DZD',
          isPublished: true,
          payoutBank: 'بريد الجزائر (BaridiMob / CCP) / بنك BNA',
          payoutIban: '00799999000123456789 (RIP BaridiMob)',
          activeCarrier: 'yalidine',
          defaultDeliveryType: 'home',
          enableFakeOrderShield: true,
          enableLandingPageDirectBuy: true
        }
      };

      setIsSubmitting(false);
      setCreatedStore(newStore);
    }, 600);
  };

  const handleCopyStoreUrl = () => {
    if (!createdStore) return;
    const url = `https://${createdStore.settings.subdomain}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // If store was just created, show the Independence & Launch Screen
  if (createdStore) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-10 space-y-8 text-center">
          
          {/* Success Badge */}
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isAr ? 'تم إطلاق المتجر كصفحة مستقلة بنجاح 🚀' : 'Independent Store Successfully Launched 🚀'}</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {isAr ? `تهانينا! متجرك "${createdStore.nameAr}" أصبح مستقلاً الآن` : `Congratulations! "${createdStore.name}" is now live & independent`}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              {isAr
                ? 'تم إنشاء متجرك وفصله بالكامل عن المنصة. يملك متجرك الآن رابطه الخاص وشعاره وعربته وبوابته، ولن تظهر للزبائن أي عناصر من منصة وصلة ديزاد (WaslaDZ).'
                : 'Your store has been created and fully separated from the platform. It has its own domain, branding, shopping cart, and catalog with zero platform branding for buyers.'}
            </p>
          </div>

          {/* Store Independence Details Box */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-start space-y-4">
            {/* 1. Customer Store URL */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs text-slate-500 font-bold block">
                  {isAr ? '1. رابط متجرك المستقل المخصص للزبائن:' : '1. Independent Store Public URL (For Customers):'}
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 mt-0.5">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>https://{createdStore.settings.subdomain}</span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyStoreUrl}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink ? (isAr ? 'تم النسخ بنجاح ✓' : 'Copied ✓') : (isAr ? 'نسخ رابط المتجر' : 'Copy Store URL')}</span>
              </button>
            </div>

            {/* 2. Merchant Admin Dashboard Direct Link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs text-slate-500 font-bold block">
                  {isAr ? '2. رابط لوحة تحكم وإدارة المتجر (للتاجر فقط):' : '2. Store Admin Dashboard Direct URL:'}
                </span>
                <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2 mt-0.5">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>https://{createdStore.settings.subdomain}/admin</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const adminUrl = `${window.location.origin}${window.location.pathname}?mode=dashboard&store=${createdStore.slug}`;
                  navigator.clipboard?.writeText(adminUrl);
                  alert(isAr ? 'تم نسخ رابط لوحة تحكم المتجر بنجاح!' : 'Admin URL copied!');
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isAr ? 'نسخ رابط الإدارة' : 'Copy Admin URL'}</span>
              </button>
            </div>

            {/* 3. Independent Platform Portal Link (If ever needed) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs text-slate-500 font-bold block">
                  {isAr ? '3. رابط منصة وصلة ديزاد (رابط مستقل تماماً):' : '3. WaslaDZ Platform Portal (Independent Link):'}
                </span>
                <span className="font-mono text-slate-600 text-xs flex items-center gap-2 mt-0.5">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>https://wasladz.app/?portal=platform</span>
                </span>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                  {isAr 
                    ? '✨ متجرك مستقل تماماً الآن مثل كبرى المتاجر العالمية ولن ترى واجهة المنصة بعد الآن إلا عبر هذا الرابط المستقل.' 
                    : '✨ Your store is completely independent. You will not see the platform again except via this independent link.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const portalUrl = `${window.location.origin}${window.location.pathname}?portal=platform`;
                  navigator.clipboard?.writeText(portalUrl);
                  alert(isAr ? 'تم نسخ رابط منصة المتاجر المستقل!' : 'Platform portal URL copied!');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isAr ? 'نسخ رابط المنصة' : 'Copy Platform Link'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
              <div>
                <span className="text-slate-400 block">{isAr ? 'التاجر' : 'Merchant'}</span>
                <span className="font-bold text-slate-800">{createdStore.ownerName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{isAr ? 'حالة الحساب' : 'Account Status'}</span>
                <span className="font-bold text-emerald-700">{isAr ? 'مجاني 100%' : '100% Free'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{isAr ? 'التصنيف' : 'Category'}</span>
                <span className="font-bold text-slate-800">{createdStore.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{isAr ? 'حالة الاستقلالية' : 'Independence'}</span>
                <span className="font-bold text-emerald-600">{isAr ? 'مستقل 100% 🚀' : '100% Standalone 🚀'}</span>
              </div>
            </div>
          </div>

          {/* New Seller Feature Highlight Banner: Control Storefront from Homepage */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/5 border-2 border-emerald-500/30 text-start space-y-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                {isAr ? '✨ خاصية حصرية مفعلة لمتجرك الجديد' : '✨ Exclusive Feature Activated'}
              </span>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>{isAr ? 'التحكم في جميع خصائص متجرك ابتداءً من الصفحة الرئيسية' : 'Control All Store Features Starting From Homepage'}</span>
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {isAr
                  ? 'بصفتك بائعاً جديداً، يمكنك الآن تخصيص متجرك مباشرة من الصفحة الرئيسية بنظام الأزرار الثلاثة على كل قسم: [زر التفعيل والتعطيل] + أمامه [زر التعديل ✏️ لتغيير النصوص والقيم] + أمامه [زر الحذف 🗑️ لإخفاء أو حذف العنصر].'
                  : 'As a new merchant, you can control everything directly on the homepage via 3 unified buttons on every section: [Toggle Switch] + [Edit Button ✏️] + [Delete Button 🗑️].'}
              </p>
            </div>
          </div>

          {/* Action Decision Buttons: Homepage Live Control vs Dashboard vs Store */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            
            {/* 1. Primary: Start Controlling Store from Homepage */}
            <button
              onClick={() => onRegisterSuccess(createdStore, 'store')}
              className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs flex flex-col items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all hover:scale-102 active:scale-98 cursor-pointer group border-2 border-emerald-400/50"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                <Sliders className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-extrabold text-center">
                {isAr ? 'التحكم بالصفحة الرئيسية الآن ⚡' : 'Control Homepage Now ⚡'}
              </span>
              <span className="text-[11px] text-white/90 font-normal text-center">
                {isAr ? 'تعديل وحذف وتفعيل الأقسام مباشرة' : 'Edit, delete & toggle sections live'}
              </span>
            </button>

            {/* 2. Visit Store as Normal Buyer */}
            <button
              onClick={() => onRegisterSuccess(createdStore, 'store')}
              className="p-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 font-bold text-xs flex flex-col items-center justify-center gap-2 shadow-xs transition-all hover:scale-102 active:scale-98 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-sm font-extrabold">
                {isAr ? 'معاينة المتجر كزبون 🛍️' : 'Customer View 🛍️'}
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                {isAr ? 'تصفح كصفحة زبائن مستقلة' : 'View as a real customer'}
              </span>
            </button>

            {/* 3. Go to Merchant Dashboard */}
            <button
              onClick={() => onRegisterSuccess(createdStore, 'dashboard')}
              className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex flex-col items-center justify-center gap-2 shadow-lg shadow-slate-900/20 transition-all hover:scale-102 active:scale-98 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-extrabold">
                {isAr ? 'لوحة تحكم التاجر ⚙️' : 'Merchant Dashboard ⚙️'}
              </span>
              <span className="text-[11px] text-white/80 font-normal">
                {isAr ? 'إدارة الطلبات والشحن والتقارير' : 'Manage orders, couriers & stats'}
              </span>
            </button>

          </div>

          {/* Additional note */}
          <p className="text-[11px] text-slate-400">
            {isAr
              ? '💡 يمكنك في أي وقت التبديل بين وضع التحكم المباشر بالصفحة الرئيسية ولوحة التحكم عبر الشريط العلوي.'
              : '💡 You can switch between live storefront editing and the dashboard anytime.'}
          </p>

        </div>
      </div>
    );
  }

  // Registration Form View
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
          <StoreIcon className="w-3.5 h-3.5" />
          <span>{isAr ? 'إنشاء متجر إلكتروني جزائري مستقل' : 'Create Algerian COD Store'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
          {isAr ? 'سجل متجرك المستقل في 30 ثانية' : 'Register Your Independent Store'}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isAr
            ? 'أدخل بيانات متجرك الأساسية، اختر خطتك (مجانية أو احترافية بـ 0% عمولة)، وسنطلق لك متجراً مستقلاً تماماً برابط خاص وهوية منفصلة عن المنصة.'
            : 'Fill in your store details, select a plan, and get a 100% independent store with 0% commission.'}
        </p>

        {/* Existing Store Shortcut */}
        <div className="pt-1">
          <button
            onClick={onGoToExistingStore}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <span>{isAr ? `لديك متجر مسجل مسبقاً (${existingStoreName})؟ التوجه للوحة التحكم مباشرة` : `Already have a store? Go to dashboard`}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Registration Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8">
        
        {/* Step 1: Store Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              1
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isAr ? 'بيانات المتجر المستقل' : 'Independent Store Details'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isAr ? 'ستظهر هذه البيانات لزبائنك في المتجر المستقل' : 'These details will appear on your independent storefront'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                {isAr ? 'اسم المتجر بالإنجليزية' : 'Store Name (English)'} *
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => handleStoreNameChange(e.target.value)}
                placeholder="e.g. Royal Elegance"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                {isAr ? 'اسم المتجر بالعربية' : 'Store Name (Arabic)'}
              </label>
              <input
                type="text"
                value={storeNameAr}
                onChange={(e) => setStoreNameAr(e.target.value)}
                placeholder="مثال: متجر الأناقة الملكية"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                {isAr ? 'رابط النطاق المستقل لمتجرك' : 'Subdomain Slug'} *
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  required
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
                  placeholder="royal-elegance"
                  className="w-full bg-slate-50 border border-slate-200 rounded-s-xl p-3 text-slate-900 font-mono focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
                />
                <span className="bg-slate-100 border border-slate-200 border-s-0 px-3 py-3 rounded-e-xl text-slate-700 font-mono text-[11px] font-bold whitespace-nowrap">
                  .wasladz.app
                </span>
              </div>
              <p className="text-[10px] text-emerald-600 mt-1">
                {isAr ? '✓ هذا هو الرابط المباشر المستقل الذي سيدخل عليه زبائنك.' : '✓ This is the standalone link your customers will use.'}
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                {isAr ? 'نشاط وتصنيف المتجر' : 'Store Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="Fashion & Apparel">{isAr ? 'أزياء وملابس' : 'Fashion & Apparel'}</option>
                <option value="Watches & Horology">{isAr ? 'ساعات وإكسسوارات' : 'Watches & Horology'}</option>
                <option value="Perfumes & Fragrances">{isAr ? 'عطور وبخور وتجميل' : 'Perfumes & Beauty'}</option>
                <option value="Electronics & Tech">{isAr ? 'إلكترونيات وهواتف' : 'Electronics & Tech'}</option>
                <option value="Home & Interior">{isAr ? 'أثاث وديكور منزلي' : 'Home & Living'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Merchant / Owner Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              2
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isAr ? 'بيانات مالك المتجر (التاجر)' : 'Merchant Contact Info'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isAr ? 'لإدارة المتجر واستقبال إشعارات الطلبات الجديدة' : 'For store administration & order notifications'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                {isAr ? 'الاسم الكامل للتاجر' : 'Owner Full Name'} *
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder={isAr ? 'مثال: خالد حسن' : 'e.g. Khalid Hassan'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                {isAr ? 'رقم الهاتف (الجزائر)' : 'Phone Number (Algeria)'}
              </label>
              <input
                type="tel"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                placeholder="0550 12 34 56"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                {isAr ? 'البريد الإلكتروني للتاجر' : 'Owner Email'} *
              </label>
              <input
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="merchant@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                {isAr ? 'الولاية ومقر النشاط' : 'Merchant Wilaya'}
              </label>
              <input
                type="text"
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                placeholder="الجزائر العاصمة، وهران، سطيف..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>



        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? 'متجر مستقل وفوري بدون تعقيد برمجيات وبـ 0% عمولة' : 'Instant independent store launch with 0% commission'}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 text-xs flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isAr ? 'إطلاق المتجر المستقل الآن 🚀' : 'Launch Independent Store 🚀'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
