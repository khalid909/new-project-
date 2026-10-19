import React, { useState } from 'react';
import { PlanType, Language, Currency } from '../types';
import { PLANS } from '../data/initialData';
import { Check, Zap, Sparkles, ShieldCheck } from 'lucide-react';

interface PlansPricingViewProps {
  currentPlan: PlanType;
  onChangePlan: (newPlan: PlanType) => void;
  language: Language;
}

export const PlansPricingView: React.FC<PlansPricingViewProps> = ({
  currentPlan,
  onChangePlan,
  language
}) => {
  const isAr = language === 'ar';
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSelect = (planId: PlanType) => {
    onChangePlan(planId);
    setSuccessToast(
      isAr
        ? `تم تحديث خطة المتجر إلى ${planId === 'pro' ? 'الخطة الاحترافية (Pro)' : 'الخطة المجانية (Starter)'} بنجاح!`
        : `Successfully updated store plan to ${planId.toUpperCase()}!`
    );
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
          {isAr ? 'خطط وباقات البائعين' : 'SELLER SUBSCRIPTION TIERS'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {isAr ? 'اختر الخطة المناسبة لنمو متجرك' : 'Transparent Pricing for Digital Merchants'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          {isAr
            ? 'ابدأ مجاناً بدون مخاطرة، ورقّ متجرك للخطة الاحترافية للحصول على عدد غير محدود من المنتجات، 0% عمولة، وربط دومينك الخاص.'
            : 'Start free and upgrade when you are ready to scale with 0% transaction fee and custom domain.'}
        </p>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Plans Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between relative transition-all ${
                isCurrent
                  ? 'bg-slate-900 border-indigo-500/80 shadow-2xl shadow-indigo-500/15'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 end-6 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider font-mono uppercase bg-indigo-500 text-white shadow-md">
                  {isAr ? 'الأكثر شعبية' : 'Recommended'}
                </span>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    {isAr ? plan.nameAr : plan.name}
                  </h3>
                  {isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {isAr ? 'خطتك الحالية' : 'Current Plan'}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400">
                  {isAr ? plan.descriptionAr : plan.description}
                </p>

                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
                    {plan.id === 'free' ? (isAr ? '0 ر.س' : '$0') : (isAr ? '99 ر.س' : '$29')}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {plan.id === 'free' ? '' : isAr ? '/ شهرياً' : '/ month'}
                  </span>
                </div>

                {/* Features List */}
                <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs">
                  {(isAr ? plan.featuresAr : plan.features).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-slate-300">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-slate-800 mt-6">
                <button
                  onClick={() => handleSelect(plan.id)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-400 cursor-default'
                      : plan.id === 'pro'
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
                      : 'bg-slate-800 hover:bg-slate-700 text-white active:scale-95'
                  }`}
                >
                  {isCurrent
                    ? isAr
                      ? 'أنت مشترك في هذه الخطة حالياً'
                      : 'Active Subscription'
                    : plan.id === 'pro'
                    ? isAr
                      ? 'الترقية للخطة الاحترافية (99 ر.س/شهر)'
                      : 'Upgrade to Pro'
                    : isAr
                    ? 'التحويل للخطة المجانية'
                    : 'Downgrade to Starter'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-4">
        <ShieldCheck className="w-4 h-4 text-indigo-400" />
        <span>{isAr ? 'إمكانية الإلغاء أو الترقية في أي وقت وبدون التزامات طويلة الأمد' : 'Cancel or change plans anytime with zero lock-in'}</span>
      </div>
    </div>
  );
};
