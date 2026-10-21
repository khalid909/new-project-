import React, { useState } from 'react';
import { Store, Language, Currency } from '../types';
import { DEFAULT_WILAYAS_69 } from '../data/wilayasData';
import { 
  Store as StoreIcon, Sparkles, ArrowLeft, 
  ShieldCheck, Globe, Zap, CheckCircle2,
  Truck, CreditCard, Layers, UserCheck
} from 'lucide-react';

interface PlatformPortalViewProps {
  language: Language;
  currency: Currency;
  onRegisterStore: (newStore: Store) => void;
}

export const PlatformPortalView: React.FC<PlatformPortalViewProps> = ({
  language,
  currency,
  onRegisterStore
}) => {
  const isAr = language === 'ar';

  // Form State
  const [storeName, setStoreName] = useState('');
  const [storeNameAr, setStoreNameAr] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [category, setCategory] = useState('Fashion & Apparel');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [wilayaCode, setWilayaCode] = useState('16');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedWilayaObj = DEFAULT_WILAYAS_69.find(w => w.code === wilayaCode) || DEFAULT_WILAYAS_69[15];

  // Auto-generate subdomain from store name
  const handleStoreNameChange = (val: string) => {
    setStoreName(val);
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setSubdomain(slug);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const cleanSlug = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '') || `store-${Date.now().toString().slice(-4)}`;
      const newStoreId = `str_${Date.now()}`;
      
      const newStore: Store = {
        id: newStoreId,
        name: storeName.trim() || 'My Algerian Store',
        nameAr: storeNameAr.trim() || storeName.trim() || 'متجري الإلكتروني',
        slug: cleanSlug,
        slogan: isAr ? 'المتجر الإلكتروني المعتمد' : 'Official Verified Store',
        sloganAr: storeNameAr.trim() ? `المتجر الرسمي لـ ${storeNameAr.trim()}` : 'المتجر الإلكتروني المعتمد',
        description: isAr 
          ? `مرحباً بك في متجر ${storeNameAr.trim() || storeName.trim()} المستقل.` 
          : `Welcome to the independent ${storeName.trim()} storefront.`,
        descriptionAr: `متجر إلكتروني مستقل متخصص في ${category}. نوفر أفضل المنتجات مع شحن سريع لـ 69 ولاية ودفع عند الاستلام.`,
        category,
        categoryAr: category,
        ownerName: ownerName.trim() || 'تاجر وصلة',
        ownerEmail: ownerEmail.trim().toLowerCase() || `merchant_${Date.now().toString().slice(-4)}@example.com`,
        ownerPhone: ownerPhone.trim() || '0550 00 00 00',
        wilaya: selectedWilayaObj.nameAr,
        wilayaCode: selectedWilayaObj.code,
        status: 'active',
        plan: 'free',
        accentColor: '#059669',
        totalSales: 0,
        ordersCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        supabaseConnected: true,
        githubConnected: true,
        settings: {
          subdomain: `${cleanSlug}.wasladz.app`,
          customDomain: undefined,
          themeColor: '#059669',
          shippingRate: 450,
          freeShippingThreshold: 8000,
          taxRate: 0,
          currency: 'DZD',
          isPublished: true,
          payoutBank: 'بريد الجزائر (BaridiMob / CCP)',
          payoutIban: '00799999000123456789 (RIP BaridiMob)',
          activeCarrier: 'yalidine',
          defaultDeliveryType: 'home',
          enableFakeOrderShield: true,
          enableLandingPageDirectBuy: true
        }
      };

      setIsSubmitting(false);
      onRegisterStore(newStore);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 font-sans" dir="rtl">
      
      {/* ─── PLATFORM TOP NAVBAR (CLEAN - NO FOUNDER LINK OR REGISTERED MERCHANTS) ─── */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Platform Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-white">وصلة ديزاد</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    WaslaDZ
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  منصة التجارة الإلكترونية السحابية للمتاجر المستقلة
                </span>
              </div>
            </div>

            {/* Platform CTA */}
            <div className="flex items-center gap-3">
              <a
                href="#register-section"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>سجل متجرك الجديد 🚀</span>
              </a>
            </div>

          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 shadow-inner">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>منصة جزائرية متطورة على غرار Shopify و YouCan العالمية</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            أنشئ متجرك الإلكتروني الجزائري <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              المستقل بالكامل في ثوانٍ
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            سجّل متجرك اليوم وادخل مباشرةً إلى لوحة تحكمك الخاصة. متجرك مستقل تماماً بدون أي علامة للمنصة، مع تحكم شامل في المنتجات، الطلبات، أسعار الشحن لـ 69 ولاية جزائرية، وتقارير مبيعات Recharts بيانية.
          </p>

          {/* Quick Value Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 text-xs font-bold">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <div className="text-emerald-400 font-black text-base font-mono">0% عمولة</div>
              <div className="text-slate-400 text-[11px]">أرباحك لك 100%</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <div className="text-emerald-400 font-black text-base font-mono">69 ولاية</div>
              <div className="text-slate-400 text-[11px]">مكتب ومنزل (Desk/Home)</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <div className="text-emerald-400 font-black text-base font-mono">COD متكامل</div>
              <div className="text-slate-400 text-[11px]">دفع عند الاستلام + BaridiMob</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <div className="text-emerald-400 font-black text-base font-mono">استقلالية 100%</div>
              <div className="text-slate-400 text-[11px]">متجرك الخاص برابطك</div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── REGISTRATION SECTION (ONLY REGISTRATION - ZERO MERCHANT LISTS) ─── */}
      <section id="register-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in duration-300">
          
          <div className="border-b border-slate-800 pb-5 text-center sm:text-start space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <span>نموذج تسجيل متجر جديد</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                فوري ومجاني
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              بمجرد إكمال النموذج، ستنتقل مباشرةً إلى لوحة تحكم متجرك المستقل لبدء إضافة المنتجات وضبط الشحن.
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-6 text-xs">
            
            {/* Section 1: Store Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <StoreIcon className="w-4 h-4" />
                <span>1. بيانات المتجر</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-bold">اسم المتجر بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={storeNameAr}
                    onChange={(e) => setStoreNameAr(e.target.value)}
                    placeholder="مثال: متجر إليغانس دزاير"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-bold">اسم المتجر باللاتينية (English) *</label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => handleStoreNameChange(e.target.value)}
                    placeholder="e.g. Elegance DZ"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-bold">رابط النطاق المخصص لمتجرك *</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      required
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="elegance-dz"
                      className="w-full bg-slate-950 border border-slate-800 rounded-s-xl p-3 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                      dir="ltr"
                    />
                    <span className="bg-slate-800 border border-slate-700 px-3 py-3 rounded-e-xl text-slate-300 font-mono text-[11px] font-bold">
                      .wasladz.app
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-bold">تصنيف ونشاط المتجر *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Fashion & Apparel">أزياء وملابس وأحذية</option>
                    <option value="Electronics & Tech">إلكترونيات وهواتف وإكسسوارات</option>
                    <option value="Perfumes & Cosmetics">عطور ومستحضرات تجميل</option>
                    <option value="Home & Kitchen">أثاث ومستلزمات منزلية</option>
                    <option value="Watches & Jewelry">ساعات ومجوهرات</option>
                    <option value="General Store">متجر شامل وتجارة عامة</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Merchant Contact & Wilaya */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <UserCheck className="w-4 h-4" />
                <span>2. بيانات التاجر ومقر النشاط</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-bold">الاسم الكامل للتاجر *</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="مثال: محمد العمري"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-bold">رقم الهاتف الجزائري *</label>
                  <input
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="0550 12 34 56"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-bold">الولاية (من بين 69 ولاية جزائرية) *</label>
                  <select
                    value={wilayaCode}
                    onChange={(e) => setWilayaCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {DEFAULT_WILAYAS_69.map(w => (
                      <option key={w.code} value={w.code}>
                        {w.code} - {w.nameAr} ({w.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-300 font-bold">البريد الإلكتروني للتاجر *</label>
                <input
                  type="email"
                  required
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="merchant@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Submit CTA Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>إنشاء المتجر والدخول المباشر إلى لوحة التحكم 🚀</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2.5">
                ✨ فور الضغط، ستدخل إلى لوحة تحكم متجرك الخاص بالكامل دون أن ترى أي رابط أو أزرار للمنصة.
              </p>
            </div>

          </form>

        </div>

      </section>

      {/* ─── PLATFORM FOOTER (CLEAN - NO FOUNDER LINK OR BUTTON) ─── */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span>منصة وصلة ديزاد (WaslaDZ) — جميع الحقوق محفوظة {new Date().getFullYear()}</span>
        </div>
        <p className="text-[11px] text-slate-500">
          تعتمد المنصة معايير المتاجر العالمية الكبرى لضمان استقلالية كل تاجر جزائري في متجره الخاص.
        </p>
      </footer>

    </div>
  );
};
