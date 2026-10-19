import React, { useState } from 'react';
import { Store, PlanType, Language, Currency } from '../types';
import { PLANS, ALGERIA_58_WILAYAS, ALGERIA_CARRIERS } from '../data/initialData';
import { 
  Store as StoreIcon, ArrowRight, ArrowLeft, Check, ShieldCheck, 
  Package, Truck, Sparkles, Globe, Database, 
  Smartphone, BarChart2, CheckCircle2, ChevronDown, 
  ShoppingBag, Users, Zap, ExternalLink, HelpCircle, Tag,
  PhoneCall, AlertTriangle, Printer, Layers, Filter, CheckCheck,
  UploadCloud, MessageCircle, RefreshCw, BarChart3, Eye, Copy
} from 'lucide-react';

interface LandingPageViewProps {
  language: Language;
  currency: Currency;
  onRegisterSuccess: (newStore: Store) => void;
  onOpenLogin: () => void;
  onGoToDashboard: () => void;
  onOpenLivePreview: () => void;
  existingStore: Store;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  language,
  currency,
  onRegisterSuccess,
  onOpenLogin,
  onGoToDashboard,
  onOpenLivePreview,
  existingStore
}) => {
  const isAr = language === 'ar';

  // Fast store registration form state
  const [storeName, setStoreName] = useState('');
  const [storeNameAr, setStoreNameAr] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [category, setCategory] = useState('Fashion & Apparel');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Interactive 58-Wilayas Calculator State
  const [calcWilayaCode, setCalcWilayaCode] = useState('16');
  const selectedCalcWilaya = ALGERIA_58_WILAYAS.find(w => w.code === calcWilayaCode) || ALGERIA_58_WILAYAS[15];

  // Interactive Anti-Fraud Phone Scanner Simulator
  const [scannerPhone, setScannerPhone] = useState('0550123456');
  const [scanResult, setScanResult] = useState<{ status: 'valid' | 'invalid' | 'suspicious'; message: string; carrierName?: string }>({
    status: 'valid',
    message: isAr ? '✓ رقم جزائري صالح ومعتمد (Mobilis 4G) - معدل تسليم مرتفع 98%' : 'Valid Algerian mobile number (Mobilis)',
    carrierName: 'Mobilis 4G'
  });

  // Interactive AI Landing Page Previewer
  const [lpLang, setLpLang] = useState<'darija' | 'fr' | 'ar'>('darija');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleTestPhone = (phoneInput: string) => {
    setScannerPhone(phoneInput);
    const clean = phoneInput.replace(/\s+/g, '').replace(/[-+]/g, '');
    
    // Check Algerian mobile format (05, 06, 07 with 10 digits)
    if (/^0[567][0-9]{8}$/.test(clean) || /^213[567][0-9]{8}$/.test(clean)) {
      let carrier = 'Ooredoo / Mobilis / Djezzy';
      if (clean.startsWith('05') || clean.startsWith('2135')) carrier = 'Ooredoo 4G';
      if (clean.startsWith('06') || clean.startsWith('2136')) carrier = 'Mobilis 4G';
      if (clean.startsWith('07') || clean.startsWith('2137')) carrier = 'Djezzy 4G';

      setScanResult({
        status: 'valid',
        message: isAr ? `✓ رقم جزائري موثق وصحيح (${carrier}) - معدل تسليم الطلب: ممتاز 98%` : `✓ Valid verified Algerian phone (${carrier}) - 98% Delivery success`,
        carrierName: carrier
      });
    } else if (clean.length < 10) {
      setScanResult({
        status: 'suspicious',
        message: isAr ? '⚠️ الرقم غير مكتمل (أقل من 10 أرقام) - سيتم تنبيه المشتري لتصحيحه فوراً' : '⚠️ Incomplete phone number (less than 10 digits)',
      });
    } else {
      setScanResult({
        status: 'invalid',
        message: isAr ? '⛔ رقم غير جزائري أو وهمي - يتم حظر الطلب تلقائياً لحماية التاجر من الخسارة' : '⛔ Invalid or fake phone number - Automatically blocked',
      });
    }
  };

  const handleNameChange = (val: string) => {
    setStoreName(val);
    if (!subdomain) {
      setSubdomain(val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
    }
  };

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !ownerName.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const cleanSlug = (subdomain || storeName).toLowerCase().replace(/[^a-z0-9]/g, '-');
      const newStore: Store = {
        id: `store_${Date.now()}`,
        name: storeName,
        nameAr: storeNameAr || storeName,
        slug: cleanSlug,
        slogan: isAr ? 'المتجر الإلكتروني المعتمد' : 'Official Verified Store',
        sloganAr: storeNameAr ? `المتجر الإلكتروني لـ ${storeNameAr}` : 'متجر رسمي معتمد',
        description: 'Store created on WASLADZ commerce engine.',
        descriptionAr: 'متجر سحابي مستقل مدعوم بمنصة وصلة ديزاد (WaslaDZ).',
        category,
        categoryAr: category,
        ownerName,
        ownerEmail: 'seller@wasladz.com',
        plan: selectedPlan,
        accentColor: '#059669',
        totalSales: 0,
        ordersCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        supabaseConnected: true,
        githubConnected: true,
        settings: {
          subdomain: `${cleanSlug}.wasladz.app`,
          customDomain: selectedPlan === 'enterprise' ? `www.${cleanSlug}.dz` : undefined,
          themeColor: '#059669',
          shippingRate: 450,
          freeShippingThreshold: 8000,
          taxRate: 0,
          currency: 'DZD',
          isPublished: true,
          payoutBank: 'بريد الجزائر (BaridiMob / CCP) / بنك BNA',
          payoutIban: '00799999000123456789',
          activeCarrier: 'yalidine',
          defaultDeliveryType: 'home',
          enableFakeOrderShield: true,
          enableLandingPageDirectBuy: true,
          yalidineApiKey: 'YAL_DEMO_KEY',
          yalidineApiToken: 'YAL_DEMO_TOKEN'
        }
      };

      onRegisterSuccess(newStore);
      setIsSubmitting(false);
    }, 500);
  };

  const faqs = [
    {
      q: isAr ? 'كيف تختلف منصة وصلة ديزاد (WaslaDZ) عن شوبيفاي ويوكان و DZBuild؟' : 'How does WaslaDZ compare to Shopify, YouCan and DZBuild?',
      a: isAr 
        ? 'وصلة ديزاد هي منصة جزائرية متكاملة بـ 0% عمولة على المبيعات، مبنية خصيصاً للتجارة المحلية والدفع عند الاستلام (COD). توفر ربطاً فورياً مع أكثر من 102 شركة توصيل وشبكة Ecotrack الموحدة، فحصاً ذكياً لأرقام الهواتف لحمايتك من الطلبات الوهمية، منشئ صفحات هبوط بالذكاء الاصطناعي بالدارجة الجزائرية، وتوليد بوالص الشحن الحرارية بضغطة واحدة.'
        : 'WaslaDZ is 100% tailored for Algerian COD with 0% sales commission, 102+ courier integrations via Ecotrack, smart Algerian phone anti-fraud filtering, AI landing pages in Darija, and 1-click thermal barcode waybills.'
    },
    {
      q: isAr ? 'كيف يتم ربط شركات التوصيل مثل ياليدين (Yalidine) و ZR Express و Ecotrack؟' : 'How does courier integration work (Yalidine, ZR Express, Ecotrack)?',
      a: isAr
        ? 'بكل بساطة! تدخل مفاتيح الـ API الخاصة بك من لوحة تحكم شركة التوصيل في إعدادات وصلة ديزاد. بعدها يمكنك تأكيد الطلبيات وإرسالها لشركة الشحن بنقرة واحدة وتوليد رقم التتبع وبوليصة الشحن (Bordereau) مع الباركود وتتبع حالتها حتى الاستلام.'
        : 'Enter your courier API credentials in the settings tab to dispatch parcels with 1 click, print thermal barcodes, and automatically synchronize delivery statuses in real-time.'
    },
    {
      q: isAr ? 'هل تأخذ المنصة أي نسبة مئوية أو عمولة على مبيعاتي؟' : 'Do you charge any commission on sales?',
      a: isAr
        ? 'لا إطلاقاً! 0% عمولة على كافة المبيعات في جميع الباقات. جميع أرباحك وعائداتك تبقى لك بنسبة 100% بدون أي اقتطاع خفي.'
        : 'Zero percent (0%) commission across all plans. Your sales revenue remains entirely yours.'
    },
    {
      q: isAr ? 'ما هو نظام حماية الطلبات الوهمية (Anti-Fraud Shield)؟' : 'What is the Anti-Fraud Phone Shield?',
      a: isAr
        ? 'نظام فحص ذكي يتحقق تلقائياً من صحة أرقام الهواتف الجزائرية (Mobilis 06, Djezzy 07, Ooredoo 05)، ويكتشف الأرقام غير المكتملة أو الوهمية، ويمنع تكرار إرسال الطلبات من نفس العميل في أوقات متقاربة، مما يخفض نسبة المرتجعات (Taux de retour) بأكثر من 40%.'
        : 'Smart phone verification engine that validates Algerian 10-digit formats, detects bogus orders, and prevents duplicates, reducing return rates by more than 40%.'
    },
    {
      q: isAr ? 'هل أستطيع استيراد منتجاتي من شوبيفاي أو يوكان أو ملف إكسل؟' : 'Can I import products from Shopify, YouCan or Excel?',
      a: isAr
        ? 'نعم! توفر منصة وصلة ديزاد ميزة الاستيراد الذكي بضغطة زر. يمكنك رفع ملف CSV / Excel أو مزامنة كتالوج منتجاتك وصورها وأسعارها في أقل من دقيقة.'
        : 'Yes, 1-click catalog importer supports CSV, Excel, Shopify, and YouCan product files with images and variants.'
    },
    {
      q: isAr ? 'كيف يعمل منشئ صفحات الهبوط بالذكاء الاصطناعي (AI Landing Pages)؟' : 'How does the AI Landing Page Builder work?',
      a: isAr
        ? 'بضغطة زر واحدة، يولد لك الذكاء الاصطناعي صفحة هبوط سريعة جداً للمنتج بالدارجة الجزائرية أو الفرنسية أو العربية مع نموذج طلب مدمج بالدفع عند الاستلام وعروض كميات ترفع معدل التحويل بمقدار 35%.'
        : 'Instant high-converting single-product landing page generated in Algerian Darija, French, or Arabic with sticky mobile COD form and quantity bundles.'
    }
  ];

  return (
    <div className="space-y-24 py-8 pb-20 overflow-hidden">
      
      {/* ─── 1. HERO SECTION (High-Converting Algerian COD Focus) ─── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8 pt-4">
        
        {/* Top Algerian COD Focus Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-xs font-bold shadow-2xs mx-auto">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span>🇩🇿 {isAr ? 'المنصة الجزائرية المتكاملة للتجارة الإلكترونية والدفع عند الاستلام (COD)' : 'The #1 Cash-on-Delivery E-Commerce Platform for Algeria'}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.18]">
          {isAr ? (
            <>
              أنشئ متجرك وصفحات الهبوط بذكاء{' '}
              <span className="text-emerald-600">مع 0% عمولة</span> وبشحن الـ 58 ولاية
            </>
          ) : (
            <>
              Launch Your Store & Landing Pages in 60s{' '}
              <span className="text-emerald-600">with 0% Commission</span> & 58 Wilayas COD
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {isAr
            ? 'الحل الشامل للتجارة المحلية في الجزائر: ربط تلقائي مع أكثر من 102 شركة توصيل (Yalidine, ZR Express, Ecotrack)، نظام حماية الطلبات ومكافحة الاحتيال، صفحات هبوط بالدارجة بالذكاء الاصطناعي، وطباعة بوالص الشحن الحرارية بضغطة زر.'
            : 'Everything you need to scale COD in Algeria: 102+ courier integrations via Ecotrack, smart Algerian phone anti-fraud shield, AI landing pages in Darija, and instant thermal barcode waybills.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#create-store"
            className="px-8 py-3.5 rounded-xl font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 text-xs sm:text-sm transition-all duration-150 active:scale-98 flex items-center gap-2 cursor-pointer"
          >
            <span>{isAr ? 'ابدأ مجاناً الآن (30 طلب تجريبي) 🚀' : 'Start Free (30 Orders Trial) 🚀'}</span>
            {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </a>

          <button
            onClick={onGoToDashboard}
            className="px-6 py-3.5 rounded-xl font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <BarChart2 className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? 'تجربة لوحة التحكم المباشرة' : 'Live Dashboard Demo'}</span>
          </button>

          <button
            onClick={onOpenLivePreview}
            className="px-6 py-3.5 rounded-xl font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
            title={isAr ? 'فتح المتجر المستقل كصفحة مستقلة بالكامل' : 'Open independent live store'}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isAr ? 'معاينة متجر الزبائن (مستقل 100%)' : 'Visit Customer Storefront'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
          </button>
        </div>

        {/* Key Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs text-slate-600 font-semibold">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? '0% عمولة على المبيعات' : '0% Sales Commission'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? 'تغطية 58 ولاية و 1,541 بلدية' : 'All 58 Algerian Wilayas'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>{isAr ? 'ربط 102+ شركة توصيل وشبكة Ecotrack' : '102+ Couriers & Ecotrack Hub'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? 'فحص وحماية أرقام الهواتف من الاحتيال' : 'Anti-Fraud Phone Scanner'}</span>
          </div>
        </div>

        {/* ─── LIVE HERO MOCKUP: Algerian COD Command Center ─── */}
        <div className="pt-6 max-w-5xl mx-auto">
          <div className="rounded-3xl border border-slate-200/90 bg-white shadow-2xl p-4 sm:p-7 text-start space-y-5">
            
            {/* Window Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-slate-500 font-mono ms-2 font-bold">
                  wasladz.app/admin/dashboard — {isAr ? 'لوحة تحكم التجارة والدفع عند الاستلام' : 'Algerian COD Merchant Hub'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {isAr ? 'ربط ياليدين: متصل ✓' : 'Yalidine: Connected ✓'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {isAr ? 'إيكوتراك: متصل ✓' : 'Ecotrack: Connected ✓'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {isAr ? '58 ولاية: مفعلة' : '58 Wilayas: Active'}
                </span>
              </div>
            </div>

            {/* Quick Stats Grid in DZD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] text-slate-500 font-medium">{isAr ? 'مبيعات اليوم (COD)' : "Today's Sales"}</div>
                <div className="text-lg font-black text-slate-900 font-mono">148,500 د.ج</div>
                <div className="text-[10px] text-emerald-600 font-bold">+28% {isAr ? 'نمو الطلبات المؤكدة' : 'confirmed'}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] text-slate-500 font-medium">{isAr ? 'طرود قيد الشحن (Yalidine & ZR)' : 'In Transit (Yalidine & ZR)'}</div>
                <div className="text-lg font-black text-slate-900 font-mono">34 {isAr ? 'طرد' : 'parcels'}</div>
                <div className="text-[10px] text-emerald-600 font-bold">{isAr ? 'تتبع لحظي متزامن' : 'live tracking'}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] text-slate-500 font-medium">{isAr ? 'طلبات وهمية محظورة' : 'Fake Orders Blocked'}</div>
                <div className="text-lg font-black text-amber-600 font-mono">12 {isAr ? 'طلب' : 'blocked'}</div>
                <div className="text-[10px] text-slate-500 font-semibold">{isAr ? 'وفّرت 8,400 دج شحن ملغي' : 'Saved 8.4k DZD'}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] text-slate-500 font-medium">{isAr ? 'عمولة المنصة' : 'Platform Fee'}</div>
                <div className="text-lg font-black text-emerald-600 font-mono">0 د.ج (0%)</div>
                <div className="text-[10px] text-emerald-600 font-bold">{isAr ? 'أرباحك لك 100%' : '100% yours'}</div>
              </div>
            </div>

            {/* Quick Interactive Prompt */}
            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-emerald-950 font-semibold">
                {isAr 
                  ? '✨ المنصة مهيأة فوراً بكل خصائص متجر جزائري متكامل: إدارة الطلبات، طباعة البوالص الحرارية، واختبار فحص الهواتف الآن!'
                  : '✨ Fully equipped with Algerian COD workflows: dispatch to Yalidine, print thermal waybills, and scan fake orders!'}
              </span>
              <button
                onClick={onGoToDashboard}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer whitespace-nowrap shadow-xs"
              >
                {isAr ? 'فتح لوحة التحكم والتجربة 🎛️' : 'Open Live Dashboard 🎛️'}
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* ─── 2. 102+ COURIERS & ECOTRACK SHOWCASE ─── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>{isAr ? 'الربط المباشر مع شركات التوصيل' : 'CONNECTED COURIERS NETWORK'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isAr ? 'ربط رسمي مع أكثر من 102 شركة توصيل وشبكة Ecotrack' : 'Official Integration with 102+ Couriers & Ecotrack Hub'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAr ? 'أرسل طلبياتك بضغطة زر واحدة، اطبع بوليصة الشحن الحرارية مع الباركود وتتبع كل طرد لحظة بلحظة.' : 'Dispatch orders in 1 click, print thermal airway bills with barcodes, and sync delivery statuses.'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { name: 'Yalidine Delivery', nameAr: 'ياليدين دليفري', badge: 'API مباشر' },
            { name: 'ZR Express', nameAr: 'زد آر إكسبريس', badge: 'API مباشر' },
            { name: 'Ecotrack Hub', nameAr: 'شبكة إيكوتراك (82 شركة)', badge: 'شبكة موحدة' },
            { name: 'Maystro Delivery', nameAr: 'مايسترو دليفري', badge: 'متصل' },
            { name: 'Procolis Express', nameAr: 'بروكولي إكسبريس', badge: 'متصل' },
            { name: 'NOEST Delivery', nameAr: 'نوست دليفري', badge: 'Stop-Desk' },
            { name: 'Nord et Sud', nameAr: 'شمال وجنوب', badge: 'متصل' },
            { name: 'Anderson Delivery', nameAr: 'أندرسون دليفري', badge: 'متصل' },
            { name: 'Fast Delivery DZ', nameAr: 'فاست دليفري', badge: 'متصل' },
            { name: 'Speed Mail', nameAr: 'سبيد ميل', badge: 'متصل' },
            { name: 'Colis Express', nameAr: 'كولي إكسبريس', badge: 'متصل' },
            { name: 'Kazitour Express', nameAr: 'كازيتور', badge: 'متصل' }
          ].map((carrier, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between text-center space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center font-bold text-xs">
                🚚
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">{carrier.nameAr}</div>
                <div className="text-[10px] text-slate-400 font-mono">{carrier.name}</div>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {carrier.badge}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. INTERACTIVE TOOLS SHOWCASE (58 Wilayas Calculator + Fake Order Phone Scanner) ─── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'أدوات حصرية لتجار الجزائر' : 'NATIVE ALGERIAN TOOLS'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isAr ? 'جرب أدوات وصلة ديزاد الذكية مجاناً' : 'Test Our Native Algerian Tools Live'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAr ? 'حاسبة تسعير الـ 58 ولاية وفاحص أرقام الهواتف لحماية متجرك من الطلبات الوهمية.' : 'Calculate delivery per wilaya and simulate phone number fraud screening.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Tool 1: 58-Wilayas Shipping Calculator */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {isAr ? 'حاسبة تسعير وتوصيل الـ 58 ولاية' : '58 Wilayas Shipping Matrix'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAr ? 'احسب تكلفة التوصيل للمنزل والمكتب لكل ولاية جزائرية' : 'Instant Domicile vs Stop-Desk rates'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                58 Wilayas
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  {isAr ? 'اختر الولاية للاستعلام عن سعر التوصيل:' : 'Select Wilaya:'}
                </label>
                <select
                  value={calcWilayaCode}
                  onChange={(e) => setCalcWilayaCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold focus:bg-white focus:border-emerald-600 focus:outline-none cursor-pointer"
                >
                  {ALGERIA_58_WILAYAS.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code} - {isAr ? w.nameAr : w.name} ({w.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rates Display Card */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1 text-center">
                  <span className="text-[11px] font-bold text-emerald-900 block">
                    {isAr ? 'توصيل للمنزل (Domicile)' : 'Home Delivery'}
                  </span>
                  <div className="text-xl font-black text-emerald-800 font-mono">
                    {selectedCalcWilaya.homePrice} د.ج
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    {isAr ? 'توصيل لباب العميل خلال 24-48 ساعة' : 'To door in 24-48h'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-center">
                  <span className="text-[11px] font-bold text-slate-700 block">
                    {isAr ? 'استلام من المكتب (Stop-Desk)' : 'Pickup Desk'}
                  </span>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    {selectedCalcWilaya.deskPrice} د.ج
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    {isAr ? 'توفير يصل لـ 200 دج للعميل' : 'Save up to 200 DZD'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 flex items-center justify-between">
                <span>{isAr ? 'الشركات المدعومة في هذه الولاية:' : 'Supported Carriers:'}</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="text-emerald-700">Yalidine ✓</span>
                  <span>•</span>
                  <span className="text-amber-700">ZR Express ✓</span>
                  <span>•</span>
                  <span>Ecotrack ✓</span>
                </span>
              </div>
            </div>
          </div>

          {/* Tool 2: Fake Order Phone Scanner Simulator */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {isAr ? 'فاحص وكاشف الطلبات الوهمية' : 'Anti-Fraud Phone Scanner'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAr ? 'جرب إدخال رقم هاتف لمعاينة فحص الأرقام الجزائرية تلقائياً' : 'Test phone verification and spam protection'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                {isAr ? 'حماية فورية' : 'Active Shield'}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  {isAr ? 'أدخل رقم هاتف لاختبار الفحص (مثال: 0550123456 أو رقم خاطئ):' : 'Enter phone to scan (e.g. 0550123456):'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={scannerPhone}
                    onChange={(e) => handleTestPhone(e.target.value)}
                    placeholder="05 / 06 / 07 ..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono text-xs focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleTestPhone('0550123456')}
                    className="px-3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer whitespace-nowrap"
                  >
                    {isAr ? 'رقم صحيح' : 'Valid Demo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTestPhone('0123456789')}
                    className="px-3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer whitespace-nowrap"
                  >
                    {isAr ? 'رقم وهمي' : 'Fake Demo'}
                  </button>
                </div>
              </div>

              {/* Scanner Result Card */}
              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                scanResult.status === 'valid'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : scanResult.status === 'suspicious'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="font-extrabold flex items-center gap-2">
                  {scanResult.status === 'valid' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {scanResult.status === 'suspicious' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                  {scanResult.status === 'invalid' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
                  <span>{scanResult.message}</span>
                </div>
                {scanResult.carrierName && (
                  <div className="text-[11px] text-emerald-800 font-mono">
                    {isAr ? `الشبكة المكتشفة: ${scanResult.carrierName}` : `Carrier: ${scanResult.carrierName}`}
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block">
                  {isAr ? 'كيف يحميك هذا النظام؟' : 'How does this protect your store?'}
                </span>
                <p className="leading-relaxed">
                  {isAr
                    ? 'في كل مرة يقوم زبون بملء الطلب، يفحص النظام الرقم فورياً ويمنع الطلبات المتكررة في أقل من 30 دقيقة، مع تسجيل محاولات الاتصال (لم يرد، مغلق) لتقليل طرود الرجوع المرتجعة.'
                    : 'Blocks repeated submissions within 30m, validates 10-digit formats, and tracks confirmation calls to prevent return losses.'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 4. AI-POWERED LANDING PAGE BUILDER SHOWCASE (DZBuild Signature Feature) ─── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-12 text-white space-y-8 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'صفحات هبوط بالذكاء الاصطناعي (AI Landing Pages)' : 'AI-POWERED PRODUCT FUNNELS'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black">
              {isAr ? 'أنشئ صفحات هبوط فيروسية بالدارجة الجزائرية والفرنسية' : 'Generate Viral Landing Pages in Algerian Darija & French'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isAr 
                ? 'يقوم الذكاء الاصطناعي في وصلة ديزاد بكتابة نصوص إقناعية باللهجة الجزائرية أو الفرنسية، توليد عروض الكميات، ونموذج طلب سريع بنقرة واحدة لرفع المبيعات بنسبة 35%.'
                : 'Our AI generates high-converting sales copy in Algerian Darija, French or Arabic with sticky 1-click mobile checkout.'}
            </p>
          </div>

          {/* Interactive Language Previewer Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLpLang('darija')}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                lpLang === 'darija' ? 'bg-emerald-500 text-slate-950 shadow-md font-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🇩🇿 الدارجة الجزائرية (Algerian Darija)
            </button>
            <button
              onClick={() => setLpLang('fr')}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                lpLang === 'fr' ? 'bg-emerald-500 text-slate-950 shadow-md font-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🇫🇷 Français (Algérie)
            </button>
            <button
              onClick={() => setLpLang('ar')}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                lpLang === 'ar' ? 'bg-emerald-500 text-slate-950 shadow-md font-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              العربية الفصحى
            </button>
          </div>

          {/* Landing Page Preview Card */}
          <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 space-y-5 max-w-4xl shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest font-mono">
                  {lpLang === 'darija' ? 'توليد ذكي بالدارجة' : lpLang === 'fr' ? 'Généré en Français' : 'توليد بالعربية'}
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {lpLang === 'darija' 
                    ? 'ساعة التيتانيوم الذكية ألترا برو - الأصلية المقاومة للماء' 
                    : lpLang === 'fr'
                    ? 'Montre Connectée Titanium Ultra Pro - Originale Waterproof'
                    : 'ساعة التيتانيوم الذكية ألترا برو - الأصلية المقاومة للماء'}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{lpLang === 'fr' ? 'Offre Limitée: -30%' : 'عرض محدود: تخفيض 30%'}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {lpLang === 'darija' && '« خاوتنا، هاذي هي الساعة لي راك تحوس عليها! بطارية تشدلك حتى 10 أيام، ضد الماء 100%، وتقدر تهدر بيها مكالمات وتشوف رسائل الواتساب والفيسبوك. التوصيل متوفر لـ 58 ولاية حتى لباب دارك وما تخلصش حتى تلحقك السلعة وتشوفها بعينيك! »'}
              {lpLang === 'fr' && '« Profitez de la montre intelligente la plus performante en Algérie: Batterie longue durée 10 jours, étanchéité IP68, appels Bluetooth en haute définition. Livraison express dans les 58 wilayas et paiement à la livraison après vérification du colis! »'}
              {lpLang === 'ar' && '« الساعة الذكية الأقوى من التيتانيوم الخالص: تدعم إجراء المكالمات والإشعارات بالعربية، قياس دقات القلب، بطارية تدوم 10 أيام مع شاحن لاسلكي. التوصيل متوفر لكافة الـ 58 ولاية والدفع بعد المعاينة! »'}
            </p>

            {/* Sticky Bundle Selector Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl border border-slate-200 text-center space-y-1">
                <div className="text-xs font-bold text-slate-900">1 {isAr ? 'قطعة' : 'Pièce'}</div>
                <div className="text-base font-black text-slate-900 font-mono">4,900 د.ج</div>
                <div className="text-[10px] text-slate-500">{isAr ? '+ مصاريف التوصيل' : '+ Livraison'}</div>
              </div>

              <div className="p-3 rounded-xl border-2 border-emerald-600 bg-emerald-50/70 text-center space-y-1 relative">
                <span className="absolute -top-2.5 end-3 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white">
                  {isAr ? 'الأكثر طلباً' : 'Populaire'}
                </span>
                <div className="text-xs font-bold text-emerald-950">2 {isAr ? 'قطع (وفر 900 دج)' : 'Pièces'}</div>
                <div className="text-base font-black text-emerald-800 font-mono">8,900 د.ج</div>
                <div className="text-[10px] text-emerald-700 font-bold">{isAr ? 'توفير حقيقي' : 'Économisez 900 DA'}</div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 text-center space-y-1">
                <div className="text-xs font-bold text-slate-900">3 {isAr ? 'قطع' : 'Pièces'}</div>
                <div className="text-base font-black text-slate-900 font-mono">12,500 د.ج</div>
                <div className="text-[10px] text-emerald-700 font-bold">{isAr ? '+ توصيل مجاني 🎁' : '+ Livraison Gratuite'}</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 5. FAST 30-SECOND STORE CREATOR ─── */}
      <section id="create-store" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 space-y-8">
          
          <div className="border-b border-slate-100 pb-5 text-center sm:text-start">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase font-mono tracking-wider mb-1">
              <StoreIcon className="w-4 h-4" />
              <span>{isAr ? 'إنشاء متجر جديد في 30 ثانية' : 'Fast 30-Second Store Creator'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {isAr ? 'أطلق متجرك الإلكتروني وصفحات الهبوط الآن' : 'Launch Your Algerian COD Storefront'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isAr ? 'املأ الحقول التالية وسنقوم بإنشاء متجرك وإدخالك إلى لوحة التحكم فوراً بدون بطاقة بنكية' : 'Fill in the fields below to instantly launch your dashboard with 0 upfront cost'}
            </p>
          </div>

          <form onSubmit={handleCreateStore} className="space-y-6 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  {isAr ? 'اسم المتجر (بالحروف اللاتينية/English)' : 'Store Name (English)'} *
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Elegance DZ"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  {isAr ? 'اسم المتجر (بالعربية)' : 'Store Name (Arabic)'}
                </label>
                <input
                  type="text"
                  value={storeNameAr}
                  onChange={(e) => setStoreNameAr(e.target.value)}
                  placeholder="مثال: متجر إليغانس ديزاد"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  {isAr ? 'رابط النطاق الفرعي المجاني' : 'Free Subdomain URL'} *
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
                    placeholder="elegance"
                    className="w-full bg-slate-50 border border-slate-200 rounded-s-xl p-3 text-slate-900 font-mono focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                  />
                  <span className="bg-slate-100 border border-slate-200 border-s-0 px-3.5 py-3 rounded-e-xl text-slate-700 font-mono text-[11px] whitespace-nowrap font-bold">
                    .wasladz.app
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  {isAr ? 'نشاط وتصنيف المتجر' : 'Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="Fashion & Tech">{isAr ? 'أزياء وإلكترونيات وساعات' : 'Fashion & Tech'}</option>
                  <option value="Beauty & Cosmetics">{isAr ? 'تجميل وعطور وعناية' : 'Beauty & Cosmetics'}</option>
                  <option value="Home & Kitchen">{isAr ? 'أواني وأجهزة منزلية وديكور' : 'Home & Kitchen'}</option>
                  <option value="Health & Fitness">{isAr ? 'صحة ورياضة ولياقة' : 'Health & Fitness'}</option>
                  <option value="Baby & Toys">{isAr ? 'مستلزمات أطفال وألعاب' : 'Baby & Toys'}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  {isAr ? 'اسم مالك المتجر / التاجر' : 'Merchant Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder={isAr ? 'مثال: كريم بلحاج' : 'e.g. Karim Belhadj'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  {isAr ? 'رقم الهاتف للتواصل وتأكيد الحساب' : 'Phone Number'} *
                </label>
                <input
                  type="tel"
                  required
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="05xx / 06xx / 07xx ..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Plan Selector */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-slate-700 font-bold">
                {isAr ? 'اختر خطة الاشتراك لبداية متجرك:' : 'Select Your Initial Plan:'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PLANS.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {isAr ? plan.nameAr : plan.name}
                          </span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{isAr ? plan.descriptionAr : plan.description}</p>
                      </div>

                      <div className="pt-3 mt-2 border-t border-slate-100 flex items-baseline justify-between font-mono">
                        <span className="text-base font-bold text-slate-900">
                          {plan.price === 0 ? (isAr ? '0 د.ج (30 طلب مجاناً)' : '0 DZD Free') : `${plan.price} ${isAr ? 'د.ج / شهرياً' : 'DZD / mo'}`}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-sans font-bold">
                          0% {isAr ? 'عمولة' : 'fee'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-slate-500 text-xs">
                {isAr ? '✓ إعداد فوري خلال 30 ثانية بدون أي تعقيد' : '✓ Instant 30-second setup'}
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/30 transition-all text-xs active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isAr ? 'إنشاء المتجر والدخول للوحة التحكم 🚀' : 'Create Store & Go to Dashboard 🚀'}</span>
                    {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </section>

      {/* ─── 6. COMPARISON: WASLADZ VS GLOBAL PLATFORMS (Why Algerian Merchants Switch) ─── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isAr ? 'لماذا يختار تجار الجزائر منصة وصلة ديزاد (WaslaDZ)؟' : 'Why Algerian Merchants Choose WaslaDZ'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAr ? 'مقارنة مباشرة بين وصلة ديزاد والحلول العالمية المعقدة مثل شوبيفاي وووكومرس' : 'A direct comparison with Shopify and WooCommerce in the local market'}
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700">
                <th className="py-3.5 px-4 text-start font-extrabold">{isAr ? 'الميزة / الخاصية' : 'Feature'}</th>
                <th className="py-3.5 px-4 text-center font-black text-emerald-800 bg-emerald-50/70">WASLADZ</th>
                <th className="py-3.5 px-4 text-center font-semibold text-slate-500">Shopify</th>
                <th className="py-3.5 px-4 text-center font-semibold text-slate-500">WooCommerce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">{isAr ? 'العمولة على المبيعات' : 'Sales Commission'}</td>
                <td className="py-3 px-4 text-center font-extrabold text-emerald-700 bg-emerald-50/30">0% {isAr ? 'بدون عمولة' : '0% Fee'}</td>
                <td className="py-3 px-4 text-center text-rose-600 font-bold">2.0% + رسوم دفع</td>
                <td className="py-3 px-4 text-center text-slate-600">رسوم استضافة وخوادم</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">{isAr ? 'شحن الـ 58 ولاية (منزل ومكتب)' : '58 Wilayas Rates'}</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-700 bg-emerald-50/30">✓ مدمج تلقائياً مجاناً</td>
                <td className="py-3 px-4 text-center text-slate-400">يتطلب تطبيقات مدفوعة</td>
                <td className="py-3 px-4 text-center text-slate-400">إضافات معقدة وبطيئة</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">{isAr ? 'ربط ياليدين، زد آر، وشبكة Ecotrack' : 'Yalidine & Ecotrack API'}</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-700 bg-emerald-50/30">✓ بنقرة واحدة مع بوالص</td>
                <td className="py-3 px-4 text-center text-slate-400">غير مدعوم أصلاً</td>
                <td className="py-3 px-4 text-center text-slate-400">إضافة خارجية غير مستقرة</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">{isAr ? 'كشف وفلترة الطلبات الوهمية' : 'Anti-Fraud Shield'}</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-700 bg-emerald-50/30">✓ فحص أرقام الهواتف 05/06/07</td>
                <td className="py-3 px-4 text-center text-slate-400">غير متوفر محلياً</td>
                <td className="py-3 px-4 text-center text-slate-400">غير متوفر</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">{isAr ? 'صفحات هبوط بالذكاء الاصطناعي (Landing Pages)' : 'AI Landing Pages'}</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-700 bg-emerald-50/30">✓ بالدارجة الجزائرية والفرنسية</td>
                <td className="py-3 px-4 text-center text-slate-400">تطبيقات باهظة الثمن</td>
                <td className="py-3 px-4 text-center text-slate-400">تصميم يدوي معقد</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">{isAr ? 'استرجاع السلات المتروكة بواتساب' : 'Abandoned Cart WhatsApp'}</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-700 bg-emerald-50/30">✓ قوالب رسائل فورية</td>
                <td className="py-3 px-4 text-center text-slate-400">رسوم شهرية إضافية</td>
                <td className="py-3 px-4 text-center text-slate-400">غير مدمج</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── 7. PRICING PLANS SECTION (In DZD, 0% Commission) ─── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'باقات الاشتراك الشهرية (دينار جزائري)' : 'SUBSCRIPTION PLANS IN DZD'}</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900">
            {isAr ? 'أسعار شفافة وبسيطة بالدينار الجزائري وبـ 0% عمولة' : 'Simple Pricing in Algerian Dinars & 0% Fee'}
          </h2>
          <p className="text-sm text-slate-500">
            {isAr ? '0% عمولة على المبيعات. ابدأ بـ 30 طلب مجاناً تماماً للتجربة.' : '0% commission on sales. Start with 30 free orders.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-7 rounded-3xl border flex flex-col justify-between ${
                plan.isPopular
                  ? 'bg-white border-emerald-600 shadow-xl ring-2 ring-emerald-600/15 relative'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3.5 end-6 px-3.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white shadow-sm">
                  {isAr ? 'الأكثر طلباً للتجار' : 'Most Popular'}
                </span>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">
                  {isAr ? plan.nameAr : plan.name}
                </h3>
                <p className="text-xs text-slate-500 min-h-[32px]">
                  {isAr ? plan.descriptionAr : plan.description}
                </p>

                <div className="flex items-baseline gap-1.5 pt-2 font-mono">
                  <span className="text-3xl font-black text-slate-900">
                    {plan.price === 0 ? (isAr ? '0 د.ج' : '0 DZD') : `${plan.price} ${isAr ? 'د.ج' : 'DZD'}`}
                  </span>
                  <span className="text-xs text-slate-500 font-sans">
                    {plan.price === 0 ? (isAr ? 'تجربة مجانية' : 'free trial') : (isAr ? '/ شهرياً' : '/ month')}
                  </span>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  {(isAr ? plan.featuresAr : plan.features).map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <a
                  href="#create-store"
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    plan.isPopular
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>{isAr ? 'اختيار هذه الخطة' : 'Select Plan'}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 8. FAQ SECTION ─── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>{isAr ? 'الأسئلة الشائعة' : 'FAQ'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {isAr ? 'كل ما يهمك معرفته عن منصة وصلة ديزاد' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-start flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 cursor-pointer hover:bg-slate-50/60"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
