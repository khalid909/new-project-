import React, { useState } from 'react';
import { StoreFeatureItem, Language } from '../types';
import { 
  Sliders, Check, X, Trash2, RotateCcw, Sparkles, 
  Search, ShieldCheck, Eye, CheckCircle2, AlertCircle, 
  ShoppingBag, CreditCard, Tag, Users, Package, Truck, 
  ExternalLink, ArrowRight, ArrowLeft, RefreshCw, Plus, 
  Percent, DollarSign, MessageCircle, AlertTriangle
} from 'lucide-react';

interface StoreFeaturesManagerProps {
  storeFeatures: StoreFeatureItem[];
  onToggleStoreFeature: (id: string) => void;
  onRemoveStoreFeature: (id: string) => void;
  onRestoreStoreFeature: (id: string) => void;
  onEnableAllStoreFeatures: () => void;
  onResetDefaultStoreFeatures: () => void;
  onAddStoreFeature?: (newFeature: StoreFeatureItem) => void;
  language: Language;
  onViewStore?: () => void;
}

export const StoreFeaturesManager: React.FC<StoreFeaturesManagerProps> = ({
  storeFeatures,
  onToggleStoreFeature,
  onRemoveStoreFeature,
  onRestoreStoreFeature,
  onEnableAllStoreFeatures,
  onResetDefaultStoreFeatures,
  onAddStoreFeature,
  language,
  onViewStore
}) => {
  const isAr = language === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'storefront' | 'checkout' | 'marketing' | 'customer' | 'removed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Custom Feature State
  const [newName, setNewName] = useState('');
  const [newNameAr, setNewNameAr] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDescAr, setNewDescAr] = useState('');
  const [newCategory, setNewCategory] = useState<'storefront' | 'checkout' | 'marketing' | 'customer'>('storefront');

  const activeCount = storeFeatures.filter((f) => f.isEnabled && !f.isRemoved).length;
  const removedCount = storeFeatures.filter((f) => f.isRemoved).length;
  const deactivatedCount = storeFeatures.filter((f) => !f.isEnabled && !f.isRemoved).length;

  // Filter logic
  const filteredFeatures = storeFeatures.filter((f) => {
    // Category match
    if (selectedCategory === 'removed') {
      if (!f.isRemoved) return false;
    } else if (selectedCategory !== 'all') {
      if (f.isRemoved || f.category !== selectedCategory) return false;
    } else {
      if (f.isRemoved) return false; // In 'all', don't clutter with trash unless 'removed' tab
    }

    // Search match
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.nameAr.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.descriptionAr.toLowerCase().includes(q)
    );
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'storefront':
        return { label: isAr ? 'واجهة المتجر' : 'Storefront', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'checkout':
        return { label: isAr ? 'الشراء والدفع والإعدادات' : 'Checkout & Pay', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'marketing':
        return { label: isAr ? 'التسويق والعروض' : 'Marketing', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'customer':
        return { label: isAr ? 'خدمة الزبائن والفواتير' : 'Customer & Invoices', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: isAr ? 'عام' : 'General', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const handleCreateCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const customFeat: StoreFeatureItem = {
      id: `custom_${Date.now()}`,
      name: newName.trim(),
      nameAr: newNameAr.trim() || newName.trim(),
      description: newDesc.trim() || 'Custom store feature enabled by merchant.',
      descriptionAr: newDescAr.trim() || 'خاصية مخصصة ومضافة من قبل التاجر.',
      category: newCategory,
      isEnabled: true,
      isRemoved: false
    };

    if (onAddStoreFeature) {
      onAddStoreFeature(customFeat);
    }
    setShowAddModal(false);
    setNewName('');
    setNewNameAr('');
    setNewDesc('');
    setNewDescAr('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
      
      {/* 1. Header & Live Indicator */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {isAr ? 'التحكم في خصائص وإعدادات المتجر (نظام الأزرار والحذف)' : 'Store Feature & Settings Manager'}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {activeCount} {isAr ? 'خاصية نشطة بالمتجر' : 'active features'}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            {isAr
              ? 'تحكّم كامل في كافة إعدادات وخصائص متجرك بنظام الزر: يمكنك تفعيل أي ميزة، أو إلغاء تنشيطها مؤقتاً، أو حذفها نهائياً من متجر الزبائن مع إمكانية استعادتها بأي وقت أو إضافة خاصية جديدة.'
              : 'Full toggle switch and delete control over all store features, payment methods, shipping, and storefront settings.'}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Custom Feature Button */}
          {onAddStoreFeature && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isAr ? 'إضافة خاصية/إعداد جديد' : 'Add New Feature'}</span>
            </button>
          )}

          {onViewStore && (
            <button
              onClick={onViewStore}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Eye className="w-4 h-4" />
              <span>{isAr ? 'معاينة المتجر المستقل' : 'Preview Store'}</span>
            </button>
          )}

          <button
            onClick={onEnableAllStoreFeatures}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'تفعيل الكل' : 'Enable All'}</span>
          </button>

          <button
            onClick={onResetDefaultStoreFeatures}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            title={isAr ? 'إعادة ضبط كافة الخصائص للوضع الافتراضي' : 'Reset to defaults'}
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>{isAr ? 'استعادة الافتراضي' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* 2. Notice Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-emerald-500/10 to-transparent border border-indigo-100 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <span className="font-bold text-slate-900">
              {isAr ? 'مزامنة حية وفورية مع متجرك المستقل:' : 'Instant live sync with your independent store:'}
            </span>{' '}
            <span>
              {isAr 
                ? 'أي خاصية أو إعداد تقوم بتعطيله أو حذفه هنا يختفي فوراً من متجر زبائنك وسلة الشراء، ولا يحتاج لأي حفظ يدوي.'
                : 'Any feature or setting you deactivate or delete here will instantly vanish from your storefront and checkout.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-600 text-[11px] font-mono shrink-0">
          <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{activeCount} {isAr ? 'نشطة' : 'active'}</span>
          </span>
          <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>{deactivatedCount} {isAr ? 'معطلة' : 'inactive'}</span>
          </span>
          <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>{removedCount} {isAr ? 'محذوفة' : 'removed'}</span>
          </span>
        </div>
      </div>

      {/* 3. Category Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs font-bold">
          {[
            { id: 'all', label: isAr ? 'جميع الخصائص والإعدادات' : 'All Features & Settings', count: storeFeatures.filter(f => !f.isRemoved).length },
            { id: 'storefront', label: isAr ? 'واجهة المتجر' : 'Storefront', count: storeFeatures.filter(f => f.category === 'storefront' && !f.isRemoved).length },
            { id: 'checkout', label: isAr ? 'الدفع والشحن والإعدادات' : 'Checkout & Settings', count: storeFeatures.filter(f => f.category === 'checkout' && !f.isRemoved).length },
            { id: 'marketing', label: isAr ? 'التسويق والكوبونات' : 'Marketing', count: storeFeatures.filter(f => f.category === 'marketing' && !f.isRemoved).length },
            { id: 'customer', label: isAr ? 'خدمة العملاء والفواتير' : 'Customer & Orders', count: storeFeatures.filter(f => f.category === 'customer' && !f.isRemoved).length },
            { id: 'removed', label: isAr ? 'سلة المحذوفات' : 'Trash / Removed', count: removedCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث في الخصائص والإعدادات...' : 'Search features & settings...'}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-9 pe-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 transition-colors"
          />
        </div>

      </div>

      {/* 4. Feature Cards Grid */}
      {filteredFeatures.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
          <Sliders className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-700">
            {isAr ? 'لا توجد خصائص مطابقة في هذا التصنيف' : 'No matching features in this category'}
          </p>
          <p className="text-[11px] text-slate-400">
            {isAr ? 'جرّب اختيار تصنيف آخر أو إعادة ضبط البحث.' : 'Try selecting another tab or reset filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFeatures.map((feat) => {
            const isEnabled = feat.isEnabled && !feat.isRemoved;
            const catBadge = getCategoryBadge(feat.category);

            return (
              <div
                key={feat.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                  feat.isRemoved
                    ? 'bg-rose-50/25 border-rose-200 opacity-80'
                    : isEnabled
                    ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs'
                    : 'bg-slate-50/80 border-slate-200 opacity-75'
                }`}
              >
                {/* Card Top: Category & Name */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${catBadge.color}`}>
                      {catBadge.label}
                    </span>

                    {/* Status Badge */}
                    {feat.isRemoved ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
                        <Trash2 className="w-3 h-3" />
                        <span>{isAr ? 'محذوفة من المتجر' : 'Removed'}</span>
                      </span>
                    ) : isEnabled ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{isAr ? 'نشطة في المتجر ✓' : 'Active'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>{isAr ? 'معطلة مؤقتاً' : 'Deactivated'}</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {isAr ? feat.nameAr : feat.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {isAr ? feat.descriptionAr : feat.description}
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Interactive Buttons (Active / Inactive Toggle & Delete / Restore) */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  
                  {feat.isRemoved ? (
                    /* Restore Button for removed feature */
                    <button
                      onClick={() => onRestoreStoreFeature(feat.id)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isAr ? 'استعادة هذه الخاصية للمتجر ↺' : 'Restore Feature ↺'}</span>
                    </button>
                  ) : (
                    /* Active/Deactivate Toggle Button & Delete Button */
                    <div className="flex items-center justify-between w-full gap-2">
                      
                      {/* 1. Toggle Button (Active / Inactive) */}
                      <button
                        onClick={() => onToggleStoreFeature(feat.id)}
                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                          feat.isEnabled
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        }`}
                        title={feat.isEnabled ? (isAr ? 'انقر لإلغاء تنشيط الخاصية' : 'Click to deactivate') : (isAr ? 'انقر لتفعيل الخاصية' : 'Click to activate')}
                      >
                        {feat.isEnabled ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>{isAr ? 'مفعلة (انقر للتعطيل)' : 'Enabled'}</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                            <span>{isAr ? 'معطلة (انقر للتفعيل)' : 'Disabled'}</span>
                          </>
                        )}
                      </button>

                      {/* 2. Delete / Remove Button */}
                      <button
                        onClick={() => onRemoveStoreFeature(feat.id)}
                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200/60"
                        title={isAr ? 'حذف هذه الخاصية واستبعادها من المتجر' : 'Delete feature from store'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isAr ? 'حذف' : 'Delete'}</span>
                      </button>

                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ─── MODAL: ADD CUSTOM FEATURE ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {isAr ? 'إضافة ميزة أو إعداد جديد لمتجرك' : 'Add Custom Store Feature'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomFeature} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'اسم الخاصية (بالإنجليزية)' : 'Feature Name (English)'} *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Gift Wrapping Option"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'اسم الخاصية (بالعربية)' : 'Feature Name (Arabic)'}
                </label>
                <input
                  type="text"
                  value={newNameAr}
                  onChange={(e) => setNewNameAr(e.target.value)}
                  placeholder="مثال: خيار تغليف الهدايا الفاخر"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'التصنيف' : 'Category'}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none cursor-pointer"
                >
                  <option value="storefront">{isAr ? 'واجهة المتجر' : 'Storefront'}</option>
                  <option value="checkout">{isAr ? 'الشراء والدفع والإعدادات' : 'Checkout & Settings'}</option>
                  <option value="marketing">{isAr ? 'التسويق والكوبونات' : 'Marketing'}</option>
                  <option value="customer">{isAr ? 'خدمة العملاء والفواتير' : 'Customer & Orders'}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'الوصف' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={newDescAr}
                  onChange={(e) => setNewDescAr(e.target.value)}
                  placeholder={isAr ? 'وصف مختصر لما تفعله هذه الخاصية في المتجر...' : 'Brief description...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  {isAr ? 'إضافة الخاصية للمتجر' : 'Add Feature'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
