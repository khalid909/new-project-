import React from 'react';
import { Store, Language, Currency } from '../types';
import { CURRENCY_RATES } from '../data/initialData';
import { CheckCircle2, ArrowRight, ArrowLeft, Store as StoreIcon, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

interface BoutiquesShowcaseProps {
  stores: Store[];
  language: Language;
  currency: Currency;
  onSelectStore: (store: Store) => void;
  onManageStore: (store: Store) => void;
}

export const BoutiquesShowcase: React.FC<BoutiquesShowcaseProps> = ({
  stores,
  language,
  currency,
  onSelectStore,
  onManageStore
}) => {
  const isAr = language === 'ar';

  const formatSales = (usdSales: number) => {
    const rate = CURRENCY_RATES[currency].rate;
    const symbol = isAr ? CURRENCY_RATES[currency].symbolAr : CURRENCY_RATES[currency].symbol;
    const converted = Math.round((usdSales * rate) / 1000);
    return `${converted}K ${symbol}`;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-amber-500 font-mono">
          {isAr ? 'الدور المستقلة والعلامات التجارية' : 'FLAGSHIP ATELIERS & BRAND HOUSES'}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-100 mt-2">
          {isAr ? 'بنية تحتية لمتاجر شوبيفاي مع انتشار أمازون' : 'Independent Flagships, One Unified Checkout'}
        </h2>
        <p className="text-sm text-neutral-400 mt-3 leading-relaxed">
          {isAr
            ? 'كل بوتيك في منصتنا يمثل علامة تجارية مستقلة تمتلك إدارتها الخاصة وكتالوجها، مع سلة شراء موحدة ومزامنة متواصلة مع قواعد بيانات Supabase.'
            : 'Each boutique operates as an independent brand with its own inventory, payout rules, and verified craftsmanship—all unified in a single global marketplace.'}
        </p>
      </div>

      {/* Boutiques Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => {
          return (
            <div
              key={store.id}
              className="flex flex-col justify-between rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-black/40 group"
            >
              <div>
                {/* Store Top Bar */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: store.accentColor }}
                    />
                    <span className="text-xs font-mono text-neutral-400">
                      {isAr ? store.categoryAr : store.category}
                    </span>
                  </div>

                  {store.verified && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-400/90 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isAr ? store.badgeAr : store.badge}</span>
                    </div>
                  )}
                </div>

                {/* Store Name & Slogan */}
                <h3 className="text-lg font-bold text-neutral-100 group-hover:text-amber-300 transition-colors">
                  {isAr ? store.nameAr : store.name}
                </h3>
                <p className="text-xs text-amber-400/80 font-medium mt-1">
                  {isAr ? store.sloganAr : store.slogan}
                </p>

                {/* Description */}
                <p className="text-xs text-neutral-400 mt-3 line-clamp-3 leading-relaxed">
                  {isAr ? store.descriptionAr : store.description}
                </p>

                {/* Quantitative Rigor Stats Strip */}
                <div className="grid grid-cols-3 gap-2 my-5 p-3 rounded-lg bg-neutral-950/60 border border-neutral-850 text-center font-mono text-xs tabular-nums">
                  <div>
                    <span className="block text-neutral-500 text-[10px]">
                      {isAr ? 'التقييم' : 'Rating'}
                    </span>
                    <span className="font-bold text-amber-400">★ {store.rating}</span>
                  </div>
                  <div>
                    <span className="block text-neutral-500 text-[10px]">
                      {isAr ? 'المعروضات' : 'Inventory'}
                    </span>
                    <span className="font-bold text-neutral-200">{store.inventoryCount}</span>
                  </div>
                  <div>
                    <span className="block text-neutral-500 text-[10px]">
                      {isAr ? 'المبيعات' : 'Volume'}
                    </span>
                    <span className="font-bold text-neutral-200">{formatSales(store.totalSales)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-neutral-800/80 flex items-center gap-2">
                <button
                  onClick={() => onSelectStore(store)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors active:scale-95"
                >
                  <span>{isAr ? 'تصفح المنتجات' : 'Browse Catalog'}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => onManageStore(store)}
                  className="px-3 py-2 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-lg transition-colors flex items-center gap-1.5"
                  title={isAr ? 'إدارة هذا المتجر في استوديو التاجر' : 'Manage boutique in Merchant Studio'}
                >
                  <StoreIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{isAr ? 'إدارة' : 'Manage'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
