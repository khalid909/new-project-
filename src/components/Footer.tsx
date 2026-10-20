import React from 'react';
import { Language } from '../types';
import { ShieldCheck, Database, GitBranch, ArrowRight, ArrowLeft } from 'lucide-react';

interface FooterProps {
  language: Language;
  onNavigateTab: (tab: 'landing' | 'dashboard' | 'register' | 'store') => void;
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
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm shadow-xs">
                W
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-sm tracking-wider uppercase">
                  WASLA<span className="text-emerald-600">DZ</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold font-mono">
                  ALGERIAN COD PLATFORM
                </span>
              </div>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs">
              {isAr
                ? 'المنصة الجزائرية المتكاملة لإنشاء المتاجر الإلكترونية وصفحات الهبوط بالذكاء الاصطناعي مع 0% عمولة، شحن 58 ولاية، وربط أكثر من 102 شركة توصيل.'
                : 'The premier Algerian COD e-commerce platform empowering merchants with 58 wilayas delivery, 102+ courier integrations, and 0% sales commission.'}
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
                  className="hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  {isAr ? 'الصفحة الرئيسية' : 'Homepage'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  {isAr ? 'لوحة تحكم المتجر' : 'Store Dashboard'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('register')}
                  className="hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  {isAr ? 'إنشاء متجر جديد' : 'Create New Store'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('store')}
                  className="hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  {isAr ? 'معاينة المتجر المستقل' : 'Independent Storefront'}
                </button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              {isAr ? 'خصائص التجارة في الجزائر' : 'Algerian COD Ecosystem'}
            </h4>
            <ul className="space-y-2 text-slate-500 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{isAr ? 'تغطية 58 ولاية و 1,541 بلدية' : '58 Wilayas & 1541 Communes'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{isAr ? 'ربط ياليدين، زد آر، وشبكة Ecotrack' : 'Yalidine, ZR & Ecotrack Hub'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>{isAr ? 'فحص وحماية أرقام الهواتف من الاحتيال' : 'Anti-Fraud Phone Shield'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>{isAr ? 'صفحات هبوط بالدارجة بالذكاء الاصطناعي' : 'AI Landing Page Funnels'}</span>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              {isAr ? 'الأمان ومكافحة الاحتيال' : 'Security & Trust'}
            </h4>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? 'حماية التاجر الجزائري 100%' : '100% Merchant Protection'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isAr
                  ? 'حماية متطورة من الطلبات الوهمية، ربط بوالص الشحن بالباركود، وخفض معدل الرجوع لأكثر من 40%.'
                  : 'Advanced fake-order filtering, instant thermal waybill barcodes, and 40% reduction in return rates.'}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} WaslaDZ Platform. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-emerald-600 cursor-pointer">
              {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </span>
            <span className="hover:text-emerald-600 cursor-pointer">
              {isAr ? 'شروط الخدمة' : 'Terms of Service'}
            </span>
            <span className="hover:text-emerald-600 cursor-pointer">
              {isAr ? 'دعم واتساب وتلغرام' : 'WhatsApp Support'}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
