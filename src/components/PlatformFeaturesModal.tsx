import React, { useState } from 'react';
import { PlatformFeatureItem, Language } from '../types';
import { 
  Sliders, X, Check, ShieldCheck, Power, Trash2, RotateCcw, 
  Sparkles, Tag, Users, CreditCard, Printer, Database, 
  DollarSign, Truck, LogIn, SlidersHorizontal, CheckCircle2, AlertCircle
} from 'lucide-react';

interface PlatformFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  features: PlatformFeatureItem[];
  onToggleFeature: (featureId: string) => void;
  onRemoveFeature: (featureId: string) => void;
  onRestoreFeature: (featureId: string) => void;
  onEnableAll: () => void;
  onResetDefaults: () => void;
  language: Language;
}

export const PlatformFeaturesModal: React.FC<PlatformFeaturesModalProps> = ({
  isOpen,
  onClose,
  features,
  onToggleFeature,
  onRemoveFeature,
  onRestoreFeature,
  onEnableAll,
  onResetDefaults,
  language
}) => {
  if (!isOpen) return null;

  const isAr = language === 'ar';
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'removed'>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 2500);
  };

  const activeCount = features.filter((f) => f.isEnabled && !f.isRemoved).length;
  const inactiveCount = features.filter((f) => !f.isEnabled && !f.isRemoved).length;
  const removedCount = features.filter((f) => f.isRemoved).length;

  const filteredFeatures = features.filter((f) => {
    if (filter === 'active') return f.isEnabled && !f.isRemoved;
    if (filter === 'inactive') return !f.isEnabled && !f.isRemoved;
    if (filter === 'removed') return f.isRemoved;
    return !f.isRemoved; // 'all' displays all non-removed
  });

  const getFeatureIcon = (id: string) => {
    switch (id) {
      case 'abandonedCartRecovery': return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'smartCatalogImport': return <Database className="w-4 h-4 text-teal-600" />;
      case 'ecotrackNetwork': return <Truck className="w-4 h-4 text-emerald-700" />;
      case 'coupons': return <Tag className="w-4 h-4 text-amber-600" />;
      case 'customersCRM': return <Users className="w-4 h-4 text-violet-600" />;
      case 'onlinePayments': return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'invoicing': return <Printer className="w-4 h-4 text-emerald-600" />;
      case 'developerIntegrations': return <Database className="w-4 h-4 text-cyan-600" />;
      case 'plansAndUpgrades': return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'multiCurrency': return <DollarSign className="w-4 h-4 text-blue-600" />;
      case 'shippingSettings': return <Truck className="w-4 h-4 text-emerald-600" />;
      case 'demoLogin': return <LogIn className="w-4 h-4 text-amber-600" />;
      case 'stockAdjuster': return <SlidersHorizontal className="w-4 h-4 text-slate-600" />;
      default: return <Sliders className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-50/80 px-6 py-5 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900">
                  {isAr ? 'مدير خصائص منصة وصلة ديزاد (تفعيل / إلغاء / حذف)' : 'WaslaDZ Platform Features Manager'}
                </h2>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Live Control
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAr
                  ? 'يمكنك بنقرة زر واحدة تفعيل، إلغاء تنشيط، أو حذف أي خاصية في المنصة وتطبيقها فوراً.'
                  : 'Toggle, deactivate, or remove any platform feature with instant live updates.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Notice Toast */}
        {actionNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Controls & Filter Bar */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isAr ? 'جميع الخصائص' : 'All'} ({features.length - removedCount})
            </button>

            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filter === 'active'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {isAr ? 'النشطة' : 'Active'} ({activeCount})
            </button>

            <button
              onClick={() => setFilter('inactive')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filter === 'inactive'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              {isAr ? 'المعطلة' : 'Disabled'} ({inactiveCount})
            </button>

            <button
              onClick={() => setFilter('removed')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filter === 'removed'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              {isAr ? 'المحذوفة / المستبعدة' : 'Removed'} ({removedCount})
            </button>
          </div>

          {/* Bulk Controls */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                onEnableAll();
                showNotification(isAr ? 'تم تفعيل جميع الخصائص بنجاح!' : 'All features activated!');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
            >
              {isAr ? 'تفعيل الكل' : 'Enable All'}
            </button>

            <button
              onClick={() => {
                onResetDefaults();
                showNotification(isAr ? 'تمت استعادة الإعدادات الافتراضية.' : 'Reset to default settings.');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
              title={isAr ? 'استعادة الافتراضي' : 'Reset'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'استعادة الافتراضي' : 'Reset'}</span>
            </button>
          </div>

        </div>

        {/* Features List Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {filteredFeatures.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-slate-400">
              <AlertCircle className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs">
                {filter === 'removed'
                  ? (isAr ? 'لا توجد أي خصائص محذوفة حالياً.' : 'No removed features.')
                  : (isAr ? 'لا توجد خصائص تطابق هذا التصفية.' : 'No features found.')}
              </p>
            </div>
          ) : (
            filteredFeatures.map((feat) => {
              const isEnabled = feat.isEnabled && !feat.isRemoved;

              return (
                <div
                  key={feat.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    feat.isRemoved
                      ? 'bg-rose-50/40 border-rose-200 opacity-75'
                      : isEnabled
                      ? 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                      : 'bg-slate-50/70 border-slate-200 opacity-80'
                  }`}
                >
                  {/* Left: Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      {getFeatureIcon(feat.id)}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">
                          {isAr ? feat.nameAr : feat.name}
                        </h4>

                        {/* Status Chip */}
                        {feat.isRemoved ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            {isAr ? 'محذوفة من العرض' : 'Removed'}
                          </span>
                        ) : isEnabled ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {isAr ? 'نشطة ومفعلة ✓' : 'Active'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            {isAr ? 'معطلة' : 'Disabled'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                        {isAr ? feat.descriptionAr : feat.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions (Toggle, Delete, Restore) */}
                  <div className="flex items-center gap-2.5 sm:self-center shrink-0">
                    
                    {feat.isRemoved ? (
                      /* Restore Button */
                      <button
                        onClick={() => {
                          onRestoreFeature(feat.id);
                          showNotification(isAr ? `تمت استعادة خاصية "${feat.nameAr}"` : `Restored ${feat.name}`);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isAr ? 'استعادة الخاصية' : 'Restore'}</span>
                      </button>
                    ) : (
                      <>
                        {/* Toggle On/Off Switch Button */}
                        <button
                          onClick={() => {
                            onToggleFeature(feat.id);
                            showNotification(
                              feat.isEnabled
                                ? (isAr ? `تم إلغاء تنشيط "${feat.nameAr}"` : `Deactivated ${feat.name}`)
                                : (isAr ? `تم تفعيل "${feat.nameAr}"` : `Activated ${feat.name}`)
                            );
                          }}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            feat.isEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                          }`}
                          role="switch"
                          aria-checked={feat.isEnabled}
                          title={feat.isEnabled ? (isAr ? 'إلغاء التنشيط' : 'Disable') : (isAr ? 'تفعيل' : 'Enable')}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              feat.isEnabled
                                ? (isAr ? '-translate-x-5' : 'translate-x-5')
                                : 'translate-x-0'
                            }`}
                          />
                        </button>

                        {/* Text Status Button */}
                        <button
                          onClick={() => {
                            onToggleFeature(feat.id);
                            showNotification(
                              feat.isEnabled
                                ? (isAr ? `تم إلغاء تنشيط "${feat.nameAr}"` : `Deactivated ${feat.name}`)
                                : (isAr ? `تم تفعيل "${feat.nameAr}"` : `Activated ${feat.name}`)
                            );
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            feat.isEnabled
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {feat.isEnabled ? (isAr ? 'مفعل' : 'Enabled') : (isAr ? 'معطل' : 'Disabled')}
                        </button>

                        {/* Remove / Delete Button */}
                        <button
                          onClick={() => {
                            onRemoveFeature(feat.id);
                            showNotification(isAr ? `تم حذف / استبعاد "${feat.nameAr}"` : `Removed ${feat.name}`);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title={isAr ? 'حذف / استبعاد هذه الخاصية' : 'Remove feature'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {isAr
                ? 'جميع التغييرات تُطبق فوراً ومباشرة على لوحة التحكم والمتجر الحي والواجهات.'
                : 'All toggles and removals reflect instantly across the dashboard and live store.'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
          >
            {isAr ? 'تم وحفظ الإعدادات' : 'Done & Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
