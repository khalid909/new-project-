import React, { useState } from 'react';
import { Store, PlanType, Language, Currency } from '../types';
import { PLANS, CURRENCY_RATES } from '../data/initialData';
import { 
  Store as StoreIcon, ArrowRight, ArrowLeft, Check, ShieldCheck, 
  CreditCard, Package, Truck, Sparkles, Globe, Database, 
  Smartphone, BarChart2, Star, CheckCircle2, ChevronDown, 
  ShoppingBag, Users, Zap, ExternalLink, HelpCircle, Tag 
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
  const [ownerEmail, setOwnerEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('free');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
        slogan: isAr ? 'المتجر الرسمي المعتمد' : 'Official Verified Store',
        sloganAr: storeNameAr ? `المتجر الرسمي لـ ${storeNameAr}` : 'المتجر الإلكتروني المعتمد',
        description: 'Store created on AVANTO Merchant Platform.',
        descriptionAr: 'متجر سحابي مستقل مدعوم بمنصة أفانتو.',
        category,
        categoryAr: category,
        ownerName,
        ownerEmail: ownerEmail || 'merchant@domain.com',
        plan: selectedPlan,
        accentColor: selectedPlan === 'pro' ? '#4F46E5' : '#059669',
        totalSales: 0,
        ordersCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        supabaseConnected: true,
        githubConnected: true,
        settings: {
          subdomain: `${cleanSlug}.avanto.store`,
          customDomain: selectedPlan === 'pro' ? `www.${cleanSlug}.com` : undefined,
          themeColor: selectedPlan === 'pro' ? '#4F46E5' : '#059669',
          shippingRate: 20,
          freeShippingThreshold: 300,
          taxRate: 15,
          currency,
          isPublished: true,
          payoutBank: 'مصرف الراجحي',
          payoutIban: 'SA0000000000000000000000'
        }
      };

      onRegisterSuccess(newStore);
      setIsSubmitting(false);
    }, 500);
  };

  const faqs = [
    {
      q: isAr ? 'هل أحتاج لخبرة برمجية لإطلاق متجري؟' : 'Do I need coding experience to launch a store?',
      a: isAr 
        ? 'أبداً! منصة أفانتو صُممت لتكون في غاية السهولة، يمكنك إدخال اسم متجرك وإضافة منتجاتك والبدء باستقبال طلبات العملاء فوراً بدون كتابة سطر برمجي واحد.'
        : 'Not at all! AVANTO is designed to be effortless. You can configure your store, add items, and receive orders without writing a single line of code.'
    },
    {
      q: isAr ? 'ما هي تكلفة البدء؟ وهل الخطة المجانية دائمة؟' : 'What is the starting cost? Is the free plan permanent?',
      a: isAr
        ? 'الخطة المجانية (Starter) مجانية بنسبة 100% مدى الحياة بدون رسوم اشتراك، وتتيح لك حتى 10 منتجات مع دومين فرعي مجاني ولوحة تحكم كاملة.'
        : 'Our Starter plan is 100% free forever with no monthly subscription, allowing up to 10 active products, a free subdomain, and full dashboard access.'
    },
    {
      q: isAr ? 'هل توجد عمولة مقتطعة على المبيعات؟' : 'Are there any sales commission fees?',
      a: isAr
        ? '0% عمولة على المبيعات! كل ما تبيعه يذهب مباشرة إلى حسابك البنكي بدون أي اقتطاعات من المنصة.'
        : '0% sales commissions! 100% of your earnings go straight to your registered payout account.'
    },
    {
      q: isAr ? 'هل المتجر الذي أنشئه يكون مستقلاً ومنفصلاً عن المنصة؟' : 'Is my store completely independent of the platform?',
      a: isAr
        ? 'نعم، 100%! بمجرد تسجيل متجرك، يتم فصله بالكامل عن المنصة. يحصل متجرك على نطاق مستقل (subdomain أو دومين مخصص) وهوية بصرية وعربة تسوق خاصة به، ولن تظهر للزبائن أي عناصر من منصة أفانتو.'
        : 'Yes, 100%! Your store is completely separated from the platform with its own domain, branding, catalog, and checkout. Customers interact only with your independent store.'
    },
    {
      q: isAr ? 'كيف يتم الربط مع Supabase و GitHub؟' : 'How does Supabase & GitHub integration work?',
      a: isAr
        ? 'توفر لوحة التحكم قسماً خاصاً للمطورين يتيح لك فحص الاتصال الحي وتصدير مخطط قاعدة البيانات (PostgreSQL SQL Schema) ومزامنة الفروع مع GitHub بنقرة واحدة.'
        : 'The dashboard includes a dedicated Developer tab with live database connection testing, automated SQL migrations, and Git branch syncing.'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="pt-12 sm:pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        
        {/* Trust Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>{isAr ? 'المنصة السحابية المخصصة للتجار الإلكترونيين ورواد الأعمال' : 'The Premier Cloud Platform for Independent Online Merchants'}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.2] max-w-4xl mx-auto">
          {isAr ? (
            <>
              أطلق متجرك الإلكتروني الاحترافي{' '}
              <span className="text-indigo-600 underline decoration-indigo-200 decoration-wavy">
                وزد مبيعاتك بكل سهولة
              </span>
            </>
          ) : (
            <>
              Build and Scale Your Online Store{' '}
              <span className="text-indigo-600">
                with Professional Simplicity
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {isAr
            ? 'كل ما تحتاجه لإدارة تجارتك: كتالوج المنتجات، متابعة الطلبات، إصدار الفواتير، بوابات الدفع، والربط التقني مع Supabase و GitHub — مع خطة مجانية للبدء فوراً.'
            : 'Everything you need: inventory control, automated invoicing, order fulfillment, and developer sync with Supabase and GitHub.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#create-store"
            className="px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 text-xs sm:text-sm transition-all duration-150 active:scale-98 flex items-center gap-2 cursor-pointer"
          >
            <span>{isAr ? 'أنشئ متجرك مجاناً الآن' : 'Create Free Store'}</span>
            {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </a>

          <button
            onClick={onGoToDashboard}
            className="px-6 py-3.5 rounded-xl font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <BarChart2 className="w-4 h-4 text-indigo-600" />
            <span>{isAr ? 'تجربة لوحة التحكم' : 'View Dashboard'}</span>
          </button>

          <button
            onClick={onOpenLivePreview}
            className="px-6 py-3.5 rounded-xl font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
            title={isAr ? 'فتح المتجر المستقل كصفحة منفصلة بالكامل عن المنصة' : 'Open independent store page'}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isAr ? 'زيارة المتجر المستقل (مفصول 100%)' : 'Visit Independent Store'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? 'خطة مجانية 100% بدون بطاقة' : 'Free tier, no card required'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? '0% عمولة على المبيعات' : '0% commission on sales'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? 'إعداد فوري خلال 60 ثانية' : 'Instant 60s setup'}</span>
          </div>
        </div>

        {/* ─── HERO INTERACTIVE PREVIEW MOCKUP ─── */}
        <div className="pt-8 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xl p-4 sm:p-6 text-start space-y-4">
            
            {/* Window Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-slate-400 font-mono ms-2">
                  {existingStore.settings.subdomain} — {isAr ? 'لوحة القيادة المباشرة' : 'Live Merchant Control'}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                {isAr ? 'متصل ومباشر' : 'Live Demo'}
              </span>
            </div>

            {/* Mock Dashboard Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] text-slate-500">{isAr ? 'المبيعات' : 'Sales'}</div>
                <div className="text-lg font-bold text-slate-900 font-mono">18,450 ر.س</div>
                <div className="text-[10px] text-emerald-600 font-semibold">+24% هذا الشهر</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] text-slate-500">{isAr ? 'الطلبات' : 'Orders'}</div>
                <div className="text-lg font-bold text-slate-900 font-mono">42 طلب</div>
                <div className="text-[10px] text-indigo-600 font-semibold">5 قيد الشحن</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] text-slate-500">{isAr ? 'المنتجات' : 'Products'}</div>
                <div className="text-lg font-bold text-slate-900 font-mono">12 منتج</div>
                <div className="text-[10px] text-slate-600 font-semibold">جاهزة للطلب</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[11px] text-slate-500">{isAr ? 'العملاء' : 'Customers'}</div>
                <div className="text-lg font-bold text-slate-900 font-mono">38 عميل</div>
                <div className="text-[10px] text-emerald-600 font-semibold">100% تقييم إيجابي</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs">
              <span className="text-indigo-900 font-medium">
                {isAr ? 'يمكنك استكشاف لوحة التحكم بالكامل وتعديل البيانات وحفظ التغييرات الآن!' : 'Explore and interact with the full dashboard right now!'}
              </span>
              <button
                onClick={onGoToDashboard}
                className="font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isAr ? 'فتح لوحة التحكم' : 'Open Dashboard'}</span>
                {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* 2. FAST 30-SECOND STORE CREATOR */}
      <section id="create-store" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-10 space-y-8">
          
          <div className="border-b border-slate-100 pb-5 text-center sm:text-start">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase font-mono tracking-wider mb-1">
              <StoreIcon className="w-4 h-4" />
              <span>{isAr ? 'إنشاء متجر جديد في 30 ثانية' : 'Fast 30-Second Store Creator'}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isAr ? 'ابدأ متجرك الإلكتروني الآن' : 'Configure Your Store & Jump into Control Panel'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isAr ? 'املأ الحقول التالية وسنقوم بإنشاء متجرك وإدخالك إلى لوحة التحكم فوراً' : 'Fill in the fields below to instantly launch your dashboard'}
            </p>
          </div>

          <form onSubmit={handleCreateStore} className="space-y-6 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  {isAr ? 'اسم المتجر (English)' : 'Store Name (English)'} *
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Elegant Lifestyle"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
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
                  placeholder="مثال: متجر الحياة الأنيقة"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
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
                    placeholder="elegant"
                    className="w-full bg-slate-50 border border-slate-200 rounded-s-xl p-3 text-slate-900 font-mono focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                  />
                  <span className="bg-slate-100 border border-slate-200 border-s-0 px-3.5 py-3 rounded-e-xl text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    .avanto.store
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                >
                  <option value="Fashion & Apparel">{isAr ? 'أزياء وملابس' : 'Fashion & Apparel'}</option>
                  <option value="Watches & Accessories">{isAr ? 'ساعات وإكسسوارات' : 'Watches & Accessories'}</option>
                  <option value="Perfumes & Beauty">{isAr ? 'عطور وبخور وتجميل' : 'Perfumes & Beauty'}</option>
                  <option value="Electronics & Tech">{isAr ? 'إلكترونيات وهواتف' : 'Electronics & Tech'}</option>
                  <option value="Home & Furniture">{isAr ? 'أثاث وديكور منزلي' : 'Home & Living'}</option>
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
                  placeholder={isAr ? 'مثال: خالد العمري' : 'e.g. Khalid Al-Omari'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  {isAr ? 'البريد الإلكتروني للتاجر' : 'Email Address'} *
                </label>
                <input
                  type="email"
                  required
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="seller@domain.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
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
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">
                            {isAr ? plan.nameAr : plan.name}
                          </span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{isAr ? plan.descriptionAr : plan.description}</p>
                      </div>

                      <div className="pt-3 mt-2 border-t border-slate-100 flex items-baseline justify-between font-mono">
                        <span className="text-base font-bold text-slate-900">
                          {plan.id === 'free' ? (isAr ? '0 ر.س (مجاناً)' : 'Free') : (isAr ? '199 ر.س / شهرياً' : '$49/mo')}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-sans font-bold">
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
                {isAr ? '✓ جاهز للإطلاق فوراً بدون شروط معقدة' : '✓ Ready for instant launch'}
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all text-xs active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
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

      {/* 3. CORE FEATURES SECTION (6 Cards) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>{isAr ? 'مميزات المنصة للتجار' : 'POWERFUL FEATURES'}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isAr ? 'كل ما تحتاجه لإدارة تجارتك باحترافية' : 'Everything You Need to Scale Your Business'}
          </h2>
          <p className="text-sm text-slate-500">
            {isAr ? 'أدوات مرنة صُممت لتوفير وقتك وزيادة مبيعاتك وأرباحك من اليوم الأول.' : 'Modern merchant tools built for higher conversions and effortless management.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {isAr ? 'إدارة المنتجات والمخزون' : 'Real-time Stock Management'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isAr ? 'أضف منتجاتك في ثوانٍ، عدّل الأسعار والكميات بنقرة واحدة، واحصل على تنبيهات عند اقتراب نفاذ المخزون.' : 'Add items, adjust inventory with one click, and track low stock alerts.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {isAr ? 'بوابات دفع ومدفوعات فورية' : 'Instant Payment Gateways'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isAr ? 'استقبل المدفوعات فوراً عبر مدى و Apple Pay والبطاقات الائتمانية مع تحويلات بنكية مباشرة لحسابك.' : 'Accept Apple Pay, Mada, and credit cards with instant bank settlement.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {isAr ? 'شحن الطلبات والفواتير الضريبية' : 'Order Dispatch & Invoicing'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isAr ? 'أدر دورة حياة كل طلب، حدّث حالات الشحن، واطبع فواتير رسمية وبوالص شحن لزبائنك بضغطة زر.' : 'Update order lifecycles and print commercial invoices for shipping.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Tag className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {isAr ? 'كوبونات وعروض ترويجية' : 'Discount Coupons & Offers'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isAr ? 'أنشئ أكواد خصم بنسبة مئوية أو بمبلغ ثابت لتحفيز عملائك على الشراء ومضاعفة مبيعاتك.' : 'Create promo codes to increase average cart size and drive repeat purchases.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {isAr ? 'ربط مباشر مع Supabase و GitHub' : 'Supabase & GitHub Sync'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isAr ? 'تحكم كامل ببياناتك البرمجية مع إمكانية تصدير مخطط SQL وتوصيل مستودع GitHub بدون قيود.' : 'Complete technical control with direct PostgreSQL schema exports and Git branching.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {isAr ? 'متجر متجاوب وسريع جداً' : 'Mobile-First Storefront'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isAr ? 'واجهة متجر جذابة وفائقة السرعة مهيأة لتجربة تسوق سلسة من شاشات الجوال والحاسوب.' : 'Lightning-fast consumer storefront optimized for seamless mobile checkout.'}
            </p>
          </div>

        </div>
      </section>

      {/* 4. PRICING PLANS SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'باقات الاشتراك' : 'PRICING PLANS'}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            {isAr ? 'باقات واضحة بدون أي رسوم خفية' : 'Simple, Transparent Pricing'}
          </h2>
          <p className="text-sm text-slate-500">
            {isAr ? 'ابدأ مجاناً تماماً، وعندما تكبر مبيعاتك يمكنك الترقية للخطة الاحترافية.' : 'Start 100% free and upgrade anytime.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-8 rounded-2xl border flex flex-col justify-between ${
                plan.isPopular
                  ? 'bg-white border-indigo-600 shadow-xl ring-2 ring-indigo-600/10 relative'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3.5 end-8 px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-sm">
                  {isAr ? 'الأكثر طلباً للتوسع' : 'Most Popular'}
                </span>
              )}

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">
                  {isAr ? plan.nameAr : plan.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {isAr ? plan.descriptionAr : plan.description}
                </p>

                <div className="flex items-baseline gap-2 pt-2 font-mono">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {plan.id === 'free' ? (isAr ? '0 ر.س' : '$0') : (isAr ? '199 ر.س' : '$49')}
                  </span>
                  <span className="text-xs text-slate-500 font-sans">
                    {plan.id === 'free' ? (isAr ? 'مجاناً للأبد' : 'Free forever') : (isAr ? '/ شهرياً' : '/ month')}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                  {(isAr ? plan.featuresAr : plan.features).map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6">
                <a
                  href="#create-store"
                  className={`block w-full py-3.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                    plan.isPopular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                  }`}
                >
                  {isAr ? 'اختر هذه الخطة وابدأ' : 'Get Started'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isAr ? 'الأسئلة الشائعة' : 'FAQ'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isAr ? 'كل ما تود معرفته عن المنصة' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-start font-bold text-slate-900 text-xs sm:text-sm flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 sm:p-12 text-center text-white space-y-6 shadow-xl shadow-indigo-600/15">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {isAr ? 'جاهز لبدء رحلتك في التجارة الإلكترونية؟' : 'Ready to Start Selling Online Today?'}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl mx-auto leading-relaxed">
            {isAr
              ? 'انضم إلى آلاف التجار الذين يثقون بمنصة أفانتو لتوسيع مبيعاتهم والوصول إلى زبائن جدد كل يوم.'
              : 'Join thousands of digital merchants scaling their retail businesses with modern independence.'}
          </p>
          <div className="pt-2">
            <a
              href="#create-store"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <span>{isAr ? 'ابدأ متجرك مجاناً في دقيقة' : 'Start Your Free Store in 1 Minute'}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
