import React, { useState } from 'react';
import { Store, Currency, Language } from '../types';
import { CURRENCY_RATES } from '../data/initialData';
import { 
  Store as StoreIcon, Users, DollarSign, ShoppingCart, 
  Trash2, ExternalLink, Globe, Search, ShieldCheck, BarChart3, LogOut 
} from 'lucide-react';

interface PlatformAdminViewProps {
  stores: Store[];
  currency: Currency;
  language: Language;
  onSelectStore: (storeId: string) => void;
  onDeleteStore: (storeId: string) => void;
  onBackToPlatform?: () => void;
}

export const PlatformAdminView: React.FC<PlatformAdminViewProps> = ({
  stores,
  currency,
  language,
  onSelectStore,
  onDeleteStore,
  onBackToPlatform
}) => {
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');

  const formatPrice = (amount: number) => {
    const rateInfo = CURRENCY_RATES[currency] || { rate: 1, symbol: 'DZD', symbolAr: 'د.ج' };
    const converted = Math.round(amount * rateInfo.rate);
    return `${converted.toLocaleString()} ${isAr ? rateInfo.symbolAr : rateInfo.symbol}`;
  };

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // حساب إحصائيات المنصة الكلية
  const totalPlatformSales = stores.reduce((acc, s) => acc + (s.totalSales || 0), 0);
  const totalPlatformOrders = stores.reduce((acc, s) => acc + (s.ordersCount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl border border-slate-700/80 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">
                  {isAr ? 'لوحة تحكم الإدارة المركزية للمنصة' : 'Platform Super Admin Dashboard'}
                </h1>
                <p className="text-xs text-slate-400">
                  {isAr ? 'متابعة شاملة لجميع التجار والمتاجر المسجلة وحجم المبيعات الكلية' : 'Monitor all registered merchants and platform stats'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onBackToPlatform && (
              <button
                onClick={onBackToPlatform}
                className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{isAr ? 'العودة للمنصة الأم' : 'Back to Platform'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Platform Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">{isAr ? 'إجمالي المتاجر المسجلة' : 'Total Stores'}</span>
              <StoreIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono">{stores.length}</div>
            <div className="text-[11px] text-emerald-400 font-semibold">
              {isAr ? 'متجر نشط أونلاين' : 'Active Online Stores'}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">{isAr ? 'إجمالي مبيعات التجار' : 'Total Merchants Sales'}</span>
              <DollarSign className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono">{formatPrice(totalPlatformSales)}</div>
            <div className="text-[11px] text-indigo-400 font-semibold">
              {isAr ? 'عبر جميع المتاجر' : 'Across all stores'}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">{isAr ? 'إجمالي طلبات الزبائن' : 'Total Platform Orders'}</span>
              <ShoppingCart className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white font-mono">{totalPlatformOrders}</div>
            <div className="text-[11px] text-blue-400 font-semibold">
              {isAr ? 'طلب مؤكد ومُعالج' : 'Confirmed & processed'}
            </div>
          </div>
        </div>

        {/* Merchants Table Section */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-white">
                {isAr ? 'قائمة التجار والمتاجر النشطة' : 'Registered Merchants & Stores Directory'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr ? 'إدارة المتاجر والوصول السريع إلى لوحة تحكم أي تاجر' : 'Manage stores and access any merchant dashboard'}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute top-3 start-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'بحث باسم المتجر أو التاجر...' : 'Search store or merchant name...'}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl ps-9 pe-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {filteredStores.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              {isAr ? 'لا توجد متاجر تطابق بحثك.' : 'No stores found.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400">
                    <th className="py-3 px-4 font-semibold">{isAr ? 'المتجر التجاري' : 'Store Name'}</th>
                    <th className="py-3 px-4 font-semibold">{isAr ? 'التاجر المسؤول' : 'Merchant Owner'}</th>
                    <th className="py-3 px-4 font-semibold">{isAr ? 'النطاق الفرعي' : 'Subdomain'}</th>
                    <th className="py-3 px-4 font-semibold">{isAr ? 'الخطة' : 'Plan'}</th>
                    <th className="py-3 px-4 font-semibold">{isAr ? 'الطلبات' : 'Orders'}</th>
                    <th className="py-3 px-4 font-semibold">{isAr ? 'إجمالي المبيعات' : 'Total Sales'}</th>
                    <th className="py-3 px-4 font-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredStores.map((store) => (
                    <tr key={store.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs shrink-0"
                            style={{ backgroundColor: store.accentColor || '#059669' }}
                          >
                            {(store.nameAr || store.name).charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{isAr ? store.nameAr : store.name}</div>
                            <div className="text-[11px] text-slate-400">{store.category}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-200">{store.ownerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{store.ownerEmail || 'admin@wasladz.app'}</div>
                      </td>

                      <td className="py-4 px-4 font-mono text-emerald-400">
                        {store.settings.subdomain}
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {store.plan.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-slate-200">
                        {store.ordersCount || 0}
                      </td>

                      <td className="py-4 px-4 font-mono font-extrabold text-emerald-400">
                        {formatPrice(store.totalSales || 0)}
                      </td>

                      <td className="py-4 px-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          {/* زر الدخول للوحة تحكم التاجر */}
                          <button
                            onClick={() => onSelectStore(store.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs transition-all"
                            title={isAr ? 'إدارة المتجر كتاجر' : 'Manage store'}
                          >
                            <span>{isAr ? 'لوحة التحكم ⚙️' : 'Admin ⚙️'}</span>
                          </button>

                          {/* زر زيارة المتجر */}
                          <a
                            href={`?mode=store&store=${store.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                            title={isAr ? 'زيارة المتجر' : 'Visit store'}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* زر حذف المتجر */}
                          <button
                            onClick={() => onDeleteStore(store.id)}
                            className="p-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors cursor-pointer"
                            title={isAr ? 'حذف المتجر' : 'Delete store'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};