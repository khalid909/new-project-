import React, { useState } from 'react';
import { PlanType, Store, Language, Currency } from '../types';
import { PLANS } from '../data/initialData';
import { 
  Store as StoreIcon, Sparkles, Check, ArrowRight, ArrowLeft, 
  ShieldCheck, Globe, Zap, Database, GitBranch, Layers, CheckCircle2 
} from 'lucide-react';

interface RegisterStoreViewProps {
  language: Language;
  currency: Currency;
  onRegisterSuccess: (newStore: Store) => void;
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
  
  // Registration Form State
  const [storeName, setStoreName] = useState('');
  const [storeNameAr, setStoreNameAr] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [category, setCategory] = useState('Fashion & Apparel');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('free');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleStoreNameChange = (val: string) => {
    setStoreName(val);
    if (!subdomain) {
      setSubdomain(val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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
        slogan: isAr ? 'متجر إلكتروني مستقل رائد' : 'Independent premier e-commerce store',
        sloganAr: storeNameAr ? `المتجر الرسمي لـ ${storeNameAr}` : 'المتجر الإلكتروني المعتمد',
        description: 'Store created on AVANTO Merchant Operating System.',
        descriptionAr: 'متجر سحابي مستقل تم إنشاؤه عبر منصة أفانتو.',
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
          freeShippingThreshold: 350,
          taxRate: 15,
          currency,
          isPublished: true
        }
      };

      onRegisterSuccess(newStore);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      
      {/* Hero Welcome */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>{isAr ? 'إنشاء متجر إلكتروني جديد' : 'New Store Onboarding'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {isAr ? 'أطلق متجرك في دقيقة وابدأ البيع' : 'Launch Your Online Store in 60 Seconds'}
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          {isAr
            ? 'أدخل بيانات متجرك الأساسية، اختر خطتك (مجانية للبدء أو احترافية للنمو)، وسنقوم بتهيئة لوحة التحكم الخاصة بك فوراً.'
            : 'Fill in your store details, select a plan, and get immediate access to your merchant dashboard.'}
        </p>

        {/* Existing Store Shortcut */}
        <div className="pt-1">
          <button
            onClick={onGoToExistingStore}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <span>{isAr ? `لديك متجر مسجل مسبقاً (${existingStoreName})؟ التوجه للوحة التحكم مباشرة` : `Already have a store? Go to dashboard`}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Registration Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8">
        
        {/* Step 1: Store Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isAr ? 'بيانات المتجر الأساسية' : 'Store Basic Information'}
            </h3>
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
                placeholder="e.g. Modern Craft"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-colors"
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
                placeholder="مثال: متجر الحرف العصرية"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                {isAr ? 'رابط النطاق الفرعي المجاني' : 'Subdomain Slug'} *
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  required
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'))}
                  placeholder="modern-craft"
                  className="w-full bg-slate-50 border border-slate-200 rounded-s-xl p-3 text-slate-900 font-mono focus:bg-white focus:border-indigo-600 focus:outline-none transition-colors"
                />
                <span className="bg-slate-100 border border-slate-200 border-s-0 px-3 py-3 rounded-e-xl text-slate-500 font-mono text-[11px] whitespace-nowrap">
                  .avanto.store
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                {isAr ? 'نشاط وتصنيف المتجر' : 'Store Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-colors"
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
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isAr ? 'بيانات مالك المتجر (التاجر)' : 'Merchant Contact Info'}
            </h3>
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                {isAr ? 'البريد الإلكتروني للإشعارات وتسجيل الدخول' : 'Owner Email'} *
              </label>
              <input
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="merchant@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Choose Plan */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              3
            </div>
            <div className="flex items-center justify-between flex-1">
              <h3 className="text-base font-bold text-slate-900">
                {isAr ? 'اختر خطة الاشتراك المناسبة' : 'Select Initial Store Plan'}
              </h3>
              <span className="text-xs text-slate-500">
                {isAr ? 'يمكنك الترقية أو التبديل لاحقاً بنقرة واحدة' : 'You can change anytime'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const isPro = plan.id === 'pro';

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/50 border-indigo-600 ring-2 ring-indigo-600/15 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        {isAr ? plan.nameAr : plan.name}
                      </span>
                    </div>

                    <span className="font-extrabold text-slate-900 text-sm">
                      {plan.priceSar === 0 ? (isAr ? '0 ر.س (مجاناً)' : 'Free') : `${plan.priceSar} ${isAr ? 'ر.س/شهر' : 'SAR/mo'}`}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-3">
                    {isAr ? plan.descriptionAr : plan.description}
                  </p>

                  <ul className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    {(isAr ? plan.featuresAr : plan.features).slice(0, 3).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? 'إنشاء فوري بدون بطاقة ائتمانية' : 'Instant launch, no credit card required'}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 text-xs flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isAr ? 'إطلاق المتجر والدخول للوحة التحكم 🚀' : 'Launch Store & Open Dashboard 🚀'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
