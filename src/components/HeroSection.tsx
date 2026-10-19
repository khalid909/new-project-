import React from 'react';
import { Search, Sparkles, ShieldCheck, Database, GitBranch, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language, Currency } from '../types';

interface HeroSectionProps {
  language: Language;
  currency: Currency;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onExploreBoutiques: () => void;
  onOpenSync: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  currency,
  searchQuery,
  setSearchQuery,
  onExploreBoutiques,
  onOpenSync
}) => {
  const isAr = language === 'ar';

  return (
    <div className="relative overflow-hidden border-b border-neutral-800/80 bg-gradient-to-b from-neutral-950 via-neutral-900/60 to-neutral-950 py-16 lg:py-24">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Subtle Lead Kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isAr
                ? 'الجيل الجديد من منصات التجارة السحابية المتعددة'
                : 'Next-Gen Multi-Vendor Cloud Commerce'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-100 leading-[1.15] text-balance">
            {isAr ? (
              <>
                منصة المتاجر الفاخرة الموحدة{' '}
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  بذكاء شوبيفاي وتنوع أمازون
                </span>
              </>
            ) : (
              <>
                Curated Luxury Marketplace{' '}
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  with Shopify Depth & Amazon Reach
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed text-balance">
            {isAr
              ? 'تسوّق من كبرى الدور المستقلة للساعات الفاخرة، العطور النادرة، والأثاث الإسكندنافي المعماري — أو أطلق متجرك الخاص بدقائق مع مزامنة متكاملة لـ Supabase و GitHub.'
              : 'Discover independent ateliers in haute horlogerie, rare perfumery, bespoke leather, and Nordic design — or power your own flagship boutique backed by native Supabase and GitHub sync.'}
          </p>

          {/* Search Input Bar */}
          <div className="pt-2 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute start-4 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isAr
                    ? 'ابحث بالاسم، الماركة، الرقم التعريفي SKU أو التصنيف...'
                    : 'Search collections, boutiques, SKU or materials...'
                }
                className="w-full bg-neutral-900/90 border border-neutral-800 focus:border-amber-500 text-neutral-100 placeholder-neutral-500 text-sm rounded-xl py-3.5 ps-12 pe-28 shadow-xl focus:outline-none transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute end-16 text-xs text-neutral-400 hover:text-neutral-200"
                >
                  {isAr ? 'مسح' : 'Clear'}
                </button>
              )}
              <button
                onClick={onExploreBoutiques}
                className="absolute end-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition-colors"
              >
                {isAr ? 'المتاجر' : 'Stores'}
              </button>
            </div>

            {/* Quick search suggestions */}
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-neutral-500 flex-wrap">
              <span>{isAr ? 'شائع:' : 'Trending:'}</span>
              {['Titanium', 'Extrait Oud', 'Bouclé', 'Firenze Leather', 'Planar 98mm'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="hover:text-amber-400 text-neutral-400 transition-colors"
                >
                  {tag} ·
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExploreBoutiques}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-500/10 transition-all duration-200 active:scale-95"
            >
              <span>{isAr ? 'استكشف الماركات والبوتيكات' : 'Explore Flagship Boutiques'}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenSync}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-neutral-100 rounded-xl transition-all duration-200"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'ربط Supabase & GitHub' : 'Supabase & GitHub Sync'}</span>
            </button>
          </div>

        </div>

        {/* Full-width 4-Metric Strip below hero */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-t border-neutral-850 pt-10">
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-100 font-mono tabular-nums">
              $3,840,000+
            </span>
            <span className="text-xs text-neutral-400 mt-1">
              {isAr ? 'إجمالي حجم المبيعات (GMV)' : 'Gross Merchandise Volume'}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
              5
            </span>
            <span className="text-xs text-neutral-400 mt-1">
              {isAr ? 'دور مستقلة مسجلة' : 'Curated Independent Ateliers'}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 text-center">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-2xl sm:text-3xl font-extrabold text-neutral-100 font-mono tabular-nums">
                100%
              </span>
            </div>
            <span className="text-xs text-neutral-400 mt-1">
              {isAr ? 'تزامن Postgres/Supabase' : 'PostgreSQL Schema Sync'}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 text-center">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="text-2xl sm:text-3xl font-extrabold text-neutral-100 font-mono tabular-nums">
                24/7
              </span>
            </div>
            <span className="text-xs text-neutral-400 mt-1">
              {isAr ? 'حماية وضمان أصالة المنتجات' : 'Escrow & Authenticity Guaranteed'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
