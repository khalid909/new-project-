import React from 'react';
import { Language, Currency } from '../types';
import { ShieldCheck, Database, GitBranch } from 'lucide-react';

interface FooterProps {
  language: Language;
  onNavigateTab: (tab: 'marketplace' | 'boutiques' | 'merchant' | 'sync') => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigateTab }) => {
  const isAr = language === 'ar';

  return (
    <footer className="border-t border-neutral-900 bg-neutral-950 py-12 text-xs text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-900">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-400 flex items-center justify-center font-bold text-neutral-950 text-xs">
                S
              </div>
              <span className="font-extrabold text-neutral-100 text-sm tracking-wider uppercase">
                {isAr ? 'سُوقِفاي' : 'SOUQIFY'}
              </span>
            </div>
            <p className="text-neutral-500 leading-relaxed text-[11px]">
              {isAr
                ? 'المنصة السحابية الموحدة لجمع المتاجر المستقلة الفاخرة، تجمع بين عمق إدارة شوبيفاي وانتشار أسواق أمازون مع دعم Supabase و GitHub.'
                : 'The unified multi-store cloud architecture uniting independent luxury maisons with native Supabase and GitHub sync.'}
            </p>
          </div>

          {/* Nav links 1 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-200 uppercase tracking-wider font-mono text-[11px]">
              {isAr ? 'منصة السوق' : 'Marketplace'}
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li>
                <button onClick={() => onNavigateTab('marketplace')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'جميع المعروضات' : 'Curated Catalog'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('boutiques')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'الدور والبوتيكات المعتمدة' : 'Verified Boutiques'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('marketplace')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'الساعات والكرونومتر' : 'Haute Horlogerie'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('marketplace')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'العطور النباتية النادرة' : 'Rare Fragrances'}
                </button>
              </li>
            </ul>
          </div>

          {/* Nav links 2 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-200 uppercase tracking-wider font-mono text-[11px]">
              {isAr ? 'حلول التجار' : 'Merchant Solutions'}
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li>
                <button onClick={() => onNavigateTab('merchant')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'استوديو التاجر (Shopify)' : 'Merchant Studio'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('merchant')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'إدارة المخزون والتسعير' : 'Inventory Management'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('merchant')} className="hover:text-amber-400 transition-colors">
                  {isAr ? 'بوليصات الشحن والتسليم' : 'Order Dispatching'}
                </button>
              </li>
            </ul>
          </div>

          {/* Nav links 3 (Infrastructure) */}
          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-200 uppercase tracking-wider font-mono text-[11px]">
              {isAr ? 'المطور وقواعد البيانات' : 'Developers'}
            </h4>
            <ul className="space-y-1.5 text-neutral-400">
              <li>
                <button onClick={() => onNavigateTab('sync')} className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Supabase PostgreSQL</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('sync')} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                  <span>GitHub Repository</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('sync')} className="hover:text-neutral-200 transition-colors">
                  {isAr ? 'مخطط SQL وسياسات RLS' : 'SQL Schema & RLS'}
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Quiet copyright & security guarantee */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} SOUQIFY Inc. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'ضمان الأصالة والتأمين الشامل' : 'Escrow Verified & Insured'}</span>
            </div>
            <span>·</span>
            <span>{isAr ? 'شروط الخدمة' : 'Terms'}</span>
            <span>·</span>
            <span>{isAr ? 'الخصوصية' : 'Privacy'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
