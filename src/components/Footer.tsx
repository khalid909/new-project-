import React from 'react';
import { Language } from '../types';
import { ShieldCheck, Database, GitBranch, ArrowRight, ArrowLeft } from 'lucide-react';

interface FooterProps {
  language: Language;
  onNavigateTab: (tab: 'landing' | 'dashboard' | 'register' | 'pricing') => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigateTab }) => {
  const isAr = language === 'ar';

  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-xs text-slate-600 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-xs">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-sm tracking-wider uppercase">
                  AVANTO
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold font-mono">
                  COMMERCE CLOUD
                </span>
              </div>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs">
              {isAr
                ? 'المنصة السحابية الاحترافية لتمكين التجار ورواد الأعمال من إطلاق متاجرهم المستقلة، إدارة المبيعات، ومزامنة قواعد البيانات بكل سهولة وأمان.'
                : 'The premier cloud e-commerce platform empowering independent merchants with dedicated storefronts, order fulfillment, and native Supabase / GitHub sync.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              {isAr ? 'روابط المنصة' : 'Platform Links'}
            </h4>
            <ul className="space-y-2 text-slate-500 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('landing')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {isAr ? 'الصفحة الرئيسية' : 'Homepage'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {isAr ? 'لوحة تحكم المتجر' : 'Store Dashboard'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('register')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {isAr ? 'إنشاء متجر جديد' : 'Create New Store'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('pricing')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {isAr ? 'الباقات والأسعار' : 'Pricing & Plans'}
                </button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              {isAr ? 'أدوات التاجر' : 'Merchant Tools'}
            </h4>
            <ul className="space-y-2 text-slate-500 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>{isAr ? 'إدارة المنتجات والمخزون' : 'Catalog & Stock'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{isAr ? 'تتبع الطلبات والفواتير' : 'Orders & Invoices'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>{isAr ? 'كوبونات الخصم والعروض' : 'Coupons & Promos'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>{isAr ? 'تكامل Supabase و GitHub' : 'Supabase & GitHub Sync'}</span>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              {isAr ? 'الأمان والموثوقية' : 'Security & Trust'}
            </h4>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? 'حماية مشفرة 256-bit SSL' : '256-bit SSL Encryption'}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {isAr
                  ? 'جميع البيانات والمعاملات المالية محمية وفق أعلى المعايير المصرفية العالمية.'
                  : 'All transactions and merchant data are protected by strict enterprise security standards.'}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} AVANTO Commerce Inc. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-indigo-600 cursor-pointer">
              {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </span>
            <span className="hover:text-indigo-600 cursor-pointer">
              {isAr ? 'شروط الخدمة' : 'Terms of Service'}
            </span>
            <span className="hover:text-indigo-600 cursor-pointer">
              {isAr ? 'الدعم الفني' : 'Support'}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
