import React, { useState } from 'react';
import { PlanType, Language, Currency } from '../types';
import { PLANS, CURRENCY_RATES } from '../data/initialData';
import { Check, Zap, Sparkles, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface PlansPricingViewProps {
  currentPlan: PlanType;
  onChangePlan: (newPlan: PlanType) => void;
  language: Language;
  currency?: Currency;
  onSelectRegisterPlan?: (planId: PlanType) => void;
}

export const PlansPricingView: React.FC<PlansPricingViewProps> = ({
  currentPlan,
  onChangePlan,
  language,
  currency = 'SAR',
  onSelectRegisterPlan
}) => {
  const isAr = language === 'ar';
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSelect = (planId: PlanType) => {
    if (onSelectRegisterPlan) {
      onSelectRegisterPlan(planId);
      return;
    }
    onChangePlan(planId);
    setSuccessToast(
      isAr
        ? `تم تحديث خطة المتجر إلى ${planId === 'pro' ? 'الخطة الاحترافية (Pro)' : 'الخطة المجانية (Starter)'} بنجاح!`
        : `Successfully updated store plan to ${planId.toUpperCase()}!`
    );
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>{isAr ? 'خطط وباقات البائعين' : 'SELLER SUBSCRIPTION TIERS'}</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {isAr ? 'باقات واضحة وشفافة لنمو تجارتك' : 'Transparent Pricing for Growing Merchants'}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {isAr
            ? 'ابدأ مجاناً تماماً بدون أي رسوم، وترقية متجرك للخطة الاحترافية في أي وقت للحصول على منتجات غير محدودة ودومينك الخاص مع صفر عمولة على المبيعات.'
            : 'Start free with no upfront cost, and scale with our Pro plan for unlimited products, custom domains, and 0% sales commission.'}
        </p>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-center gap-2 shadow-xs">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Plans Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isPro = plan.id === 'pro';

          return (
            <div
              key={plan.id}
              className={`p-8 rounded-2xl border flex flex-col justify-between relative transition-all duration-200 ${
                isPro
                  ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100 ring-2 ring-indigo-600/10'
                  : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3.5 end-8 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-indigo-600 text-white shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{isAr ? 'الأكثر اختياراً للتجار' : 'Most Popular'}</span>
                </span>
              )}

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {isAr ? plan.nameAr : plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {isAr ? plan.descriptionAr : plan.description}
                    </p>
                  </div>
                  {isCurrent && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {isAr ? 'خطتك الحالية' : 'Current Plan'}
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {plan.priceSar === 0 ? (
                      isAr ? 'مجاناً' : 'Free'
                    ) : (
                      `${plan.priceSar} ${isAr ? 'ر.س' : 'SAR'}`
                    )}
                  </span>
                  {plan.priceSar > 0 && (
                    <span className="text-xs text-slate-500 font-medium">
                      {isAr ? '/ شهرياً' : '/ month'}
                    </span>
                  )}
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 py-3 px-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">{isAr ? 'سعة المنتجات' : 'Products Limit'}</span>
                    <span className="font-bold text-slate-800">
                      {plan.maxProducts === 9999 ? (isAr ? 'غير محدود' : 'Unlimited') : `${plan.maxProducts} ${isAr ? 'منتجات' : 'products'}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">{isAr ? 'عمولة المبيعات' : 'Sales Fee'}</span>
                    <span className="font-bold text-emerald-600">
                      0% {isAr ? 'بدون عمولة' : 'No fee'}
                    </span>
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-900 block">
                    {isAr ? 'ما تشمله هذه الخطة:' : "What's included:"}
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    {(isAr ? plan.featuresAr : plan.features).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => handleSelect(plan.id)}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-default border border-slate-200'
                      : isPro
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 active:scale-98'
                      : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-98 shadow-sm'
                  }`}
                >
                  {isCurrent ? (
                    <span>{isAr ? 'الخطة النشطة حالياً' : 'Current Active Plan'}</span>
                  ) : (
                    <>
                      <span>
                        {isPro
                          ? isAr ? 'الترقية إلى الخطة الاحترافية' : 'Upgrade to Pro'
                          : isAr ? 'اختيار الخطة المجانية' : 'Choose Free Plan'}
                      </span>
                      {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Box */}
      <div className="max-w-4xl mx-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>
            {isAr
              ? 'ضمان كامل لاسترجاع الأموال خلال 14 يوماً مع إمكانية إلغاء الاشتراك في أي وقت بنقرة واحدة.'
              : '14-day money-back guarantee with 1-click subscription cancellation anytime.'}
          </span>
        </div>
        <span className="font-bold text-slate-800 whitespace-nowrap">
          {isAr ? 'دعم فني على مدار الساعة' : '24/7 Dedicated Support'}
        </span>
      </div>

    </div>
  );
};
