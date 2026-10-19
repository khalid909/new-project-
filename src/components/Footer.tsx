import React from 'react';
import { Language } from '../types';
import { ShieldCheck, Database, GitBranch } from 'lucide-react';

interface FooterProps {
  language: Language;
  onNavigateTab: (tab: 'dashboard' | 'stores' | 'products' | 'orders' | 'plans' | 'settings') => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigateTab }) => {
  const isAr = language === 'ar';

  return (
    <footer className="border-t border-slate-900 bg-[#070A12] py-10 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-900">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                A
              </div>
              <span className="font-extrabold text-white text-sm tracking-wider uppercase">
                AVANTO
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              {isAr
                ? 'نظام التشغيل السحابي المستقل لتمكين التجار الإلكترونيين من بناء متاجرهم وإدارتها بأعلى كفاءة مع ربط كامل لقواعد بيانات Supabase و GitHub.'
                : 'The sovereign cloud operating system empowering digital merchants with independent storefronts, fulfillment dispatch, and native Supabase / GitHub sync.'}
            </p>
          </div>

          {/* Merchant Navigation */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider font-mono text-[11px]">
              {isAr ? 'إدارة التجارة' : 'Commerce Engine'}
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onNavigateTab('dashboard')} className="hover:text-indigo-400 transition-colors">
                  {isAr ? 'لوحة القيادة والمبيعات' : 'Command Center'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('stores')} className="hover:text-indigo-400 transition-colors">
                  {isAr ? 'المتاجر والنطاقات' : 'Stores & Domains'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('products')} className="hover:text-indigo-400 transition-colors">
                  {isAr ? 'الكتالوج والمخزون' : 'Catalog & Margins'}
                </button>
              </li>
            </ul>
          </div>

          {/* Operations Navigation */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider font-mono text-[11px]">
              {isAr ? 'العمليات والعملاء' : 'Operations & CRM'}
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onNavigateTab('orders')} className="hover:text-indigo-400 transition-colors">
                  {isAr ? 'بوليصات الشحن والطلبات' : 'Order Dispatching'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('plans')} className="hover:text-indigo-400 transition-colors">
                  {isAr ? 'خطط الاشتراك والترقية' : 'Pricing & Plans'}
                </button>
              </li>
            </ul>
          </div>

          {/* Cloud Infra */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider font-mono text-[11px]">
              {isAr ? 'البنية التحتية والمطور' : 'Cloud Architecture'}
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onNavigateTab('settings')} className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Supabase PostgreSQL</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('settings')} className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                  <span>GitHub Repository Sync</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} AVANTO Commerce Inc. {isAr ? 'جميع الحقوق محفوظة للتجار المستقلين.' : 'All rights reserved.'}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isAr ? 'أمان التشفير والبيانات 256-bit' : '256-Bit Encrypted Data'}</span>
            </div>
            <span>·</span>
            <span>{isAr ? 'شروط التاجر' : 'Merchant Terms'}</span>
            <span>·</span>
            <span>{isAr ? 'الخصوصية' : 'Privacy'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
