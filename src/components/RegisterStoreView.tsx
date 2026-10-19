import React, { useState } from 'react';
import { PlanType, Store, Language, Currency } from '../types';
import { PLANS } from '../data/initialData';
import { 
  Store as StoreIcon, Sparkles, Check, ArrowRight, ArrowLeft, 
  ShieldCheck, Globe, Zap, Database, GitBranch, Layers 
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
        ownerEmail: ownerEmail || 'seller@mybrand.com',
        plan: selectedPlan,
        accentColor: selectedPlan === 'pro' ? '#6366F1' : '#10B981',
        totalSales: 0,
        ordersCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        supabaseConnected: true,
        githubConnected: true,
        settings: {
          subdomain: `${cleanSlug}.avanto.store`,
          customDomain: selectedPlan === 'pro' ? `www.${cleanSlug}.com` : undefined,
          themeColor: selectedPlan === 'pro' ? '#6366F1' : '#10B981',
          shippingRate: 20,
          freeShippingThreshold: 350,
          taxRate: 15,
          currency,
          isPublished: true
        }
      };

      onRegisterSuccess(newStore);
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      
      {/* Hero Welcome */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAr ? 'منصة التجار الإلكترونيين المستقلين' : 'Sovereign Merchant Cloud OS'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {isAr ? (
            <>
              أنشئ متجرك الإلكتروني في دقيقة{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                وابدأ البيع فوراً
              </span>
            </>
          ) : (
            <>
              Launch Your Online Store in 1 Minute{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                and Start Selling Today
              </span>
            </>
          )}
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {isAr
            ? 'سجّل متجرك الجديد، اختر الخطة المناسبة لك (مجانية للبداية أو احترافية للنمو)، وادخل مباشرة للوحة التحكم الخاصة بك لإضافة المنتجات واستقبال طلبات الزبائن.'
            : 'Register your store, choose a plan (Free Starter or Pro Growth), and jump straight into your dedicated merchant dashboard.'}
        </p>

        {/* Existing Store Shortcut */}
        <div className="pt-2">
          <button
            onClick={onGoToExistingStore}
            className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <span>{isAr ? `لديك متجر مسجل مسبقاً (${existingStoreName})؟ الدخول للوحة التحكم مباشرة` : `Already have a store? Enter dashboard`}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Registration Box */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl space-y-8">
        
        {/* Step 1: Store Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h3 className="text-base font-bold text-white">
              {isAr ? 'بيانات المتجر والمالك' : 'Store & Owner Details'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                {isAr ? 'اسم المتجر (English)' : 'Store Name (English)'} *
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => handleStoreNameChange(e.target.value)}
                placeholder="e.g. Amber Glow Boutique"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                {isAr ? 'اسم المتجر (بالعربية)' : 'Store Name (Arabic)'}
              </label>
              <input
                type="text"
                value={storeNameAr}
                onChange={(e) => setStoreNameAr(e.target.value)}
                placeholder="مثال: بوتيك وميض العنبر"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                {isAr ? 'رابط النطاق الفرعي المجاني' : 'Free Subdomain URL'} *
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  required
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                  placeholder="amberglow"
                  className="w-full bg-slate-950 border border-slate-800 rounded-s-xl p-3 text-white font-mono focus:border-indigo-500 focus:outline-none"
                />
                <span className="bg-slate-800 border border-slate-700 border-s-0 px-3.5 py-3 rounded-e-xl text-slate-400 font-mono text-xs whitespace-nowrap">
                  .avanto.store
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                {isAr ? 'تصنيف ونشاط المتجر' : 'Store Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="Fashion & Apparel">{isAr ? 'الأزياء والملابس' : 'Fashion & Apparel'}</option>
                <option value="Watches & Jewelry">{isAr ? 'الساعات والمجوهرات' : 'Watches & Jewelry'}</option>
                <option value="Perfumes & Beauty">{isAr ? 'العطور ومنتجات العناية' : 'Perfumes & Beauty'}</option>
                <option value="Electronics & Tech">{isAr ? 'الإلكترونيات والتقنية' : 'Electronics & Tech'}</option>
                <option value="Home & Living">{isAr ? 'الأثاث والديكور المنزلي' : 'Home & Living'}</option>
                <option value="Food & Coffee">{isAr ? 'القهوة والأغذية المتخصصة' : 'Food & Coffee'}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                {isAr ? 'اسم مالك المتجر / التاجر' : 'Owner Full Name'} *
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder={isAr ? 'مثال: محمد الغامدي' : 'e.g. Alex Morgan'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                {isAr ? 'البريد الإلكتروني للتاجر' : 'Owner Email Address'} *
              </label>
              <input
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="merchant@mybrand.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Choose Plan (Free vs Paid Pro) */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h3 className="text-base font-bold text-white">
                {isAr ? 'اختر خطة الاشتراك لمتجرك' : 'Select Seller Subscription Plan'}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {isAr ? 'يمكنك الترقية أو التبديل في أي وقت' : 'Switch anytime from dashboard'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-950/30 border-indigo-500 shadow-xl shadow-indigo-500/10'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {plan.isPopular && (
                    <span className="absolute -top-3 end-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider font-mono uppercase bg-indigo-500 text-white shadow-md">
                      {isAr ? 'الأكثر اختياراً للتوسع' : 'Most Popular'}
                    </span>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-white">
                        {isAr ? plan.nameAr : plan.name}
                      </h4>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-700'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400">
                      {isAr ? plan.descriptionAr : plan.description}
                    </p>

                    <div className="flex items-baseline gap-2 pt-2">
                      <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                        {plan.id === 'free' ? (isAr ? 'مجاناً' : 'Free') : `99 ر.س`}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {plan.id === 'free' ? '' : isAr ? '/ شهرياً ($29/mo)' : '/ month'}
                      </span>
                    </div>

                    {/* Features checklist */}
                    <div className="pt-4 border-t border-slate-850 space-y-2 text-xs">
                      {(isAr ? plan.featuresAr : plan.features).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-300">
                          <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{isAr ? 'عمولة المنصة:' : 'Transaction Fee:'}</span>
                    <span className={plan.id === 'free' ? 'text-amber-400' : 'text-emerald-400 font-bold'}>
                      {plan.transactionFee}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {isAr
                ? 'تفعيل فوري لمتجرك مع دعم مزامنة Supabase و GitHub'
                : 'Instant setup with native Supabase & GitHub sync'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-xl shadow-indigo-500/25 transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>{isAr ? 'جارٍ تهيئة المتجر ولوحة التحكم...' : 'Provisioning Store & Dashboard...'}</span>
            ) : (
              <>
                <span>{isAr ? 'إنشاء المتجر والدخول للوحة التحكم' : 'Launch Store & Enter Dashboard'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
