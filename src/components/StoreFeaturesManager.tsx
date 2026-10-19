import React, { useState } from 'react';
import { StoreFeatureItem, Language } from '../types';
import { 
  Sliders, Check, X, Trash2, RotateCcw, Sparkles, 
  Search, ShieldCheck, Eye, CheckCircle2, AlertCircle, 
  ShoppingBag, CreditCard, Tag, Users, Package, Truck, 
  ExternalLink, ArrowRight, ArrowLeft, RefreshCw, Plus, 
  Percent, DollarSign, MessageCircle, AlertTriangle, Edit3,
  Home, Bell, Clock, Phone, HelpCircle
} from 'lucide-react';

interface StoreFeaturesManagerProps {
  storeFeatures: StoreFeatureItem[];
  onToggleStoreFeature: (id: string) => void;
  onRemoveStoreFeature: (id: string) => void;
  onRestoreStoreFeature: (id: string) => void;
  onEnableAllStoreFeatures: () => void;
  onResetDefaultStoreFeatures: () => void;
  onAddStoreFeature?: (newFeature: StoreFeatureItem) => void;
  onUpdateStoreFeature?: (updatedFeature: StoreFeatureItem) => void;
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
  onUpdateStoreFeature,
  language,
  onViewStore
}) => {
  const isAr = language === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'storefront' | 'checkout' | 'marketing' | 'customer' | 'removed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState<StoreFeatureItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Feature Form State
  const [editNameAr, setEditNameAr] = useState('');
  const [editDescAr, setEditDescAr] = useState('');
  const [editCustomValue, setEditCustomValue] = useState('');
  const [editIsEnabled, setEditIsEnabled] = useState(true);

  // New Custom Feature State
  const [newName, setNewName] = useState('');
  const [newNameAr, setNewNameAr] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDescAr, setNewDescAr] = useState('');
  const [newCategory, setNewCategory] = useState<'storefront' | 'checkout' | 'marketing' | 'customer'>('storefront');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const activeCount = storeFeatures.filter((f) => f.isEnabled && !f.isRemoved).length;
  const removedCount = storeFeatures.filter((f) => f.isRemoved).length;
  const deactivatedCount = storeFeatures.filter((f) => !f.isEnabled && !f.isRemoved).length;

  // Filter logic
  const filteredFeatures = storeFeatures.filter((f) => {
    if (selectedCategory === 'removed') {
      if (!f.isRemoved) return false;
    } else if (selectedCategory !== 'all') {
      if (f.isRemoved || f.category !== selectedCategory) return false;
    } else {
      if (f.isRemoved) return false;
    }

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
        return { label: isAr ? 'الصفحة الرئيسية والواجهة' : 'Homepage & Storefront', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'checkout':
        return { label: isAr ? 'الشراء والدفع عند الاستلام' : 'Checkout & COD', color: 'bg-teal-50 text-teal-800 border-teal-200' };
      case 'marketing':
        return { label: isAr ? 'التسويق والعروض الترويجية' : 'Marketing & Deals', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'customer':
        return { label: isAr ? 'خدمة الزبائن والتتبع' : 'Support & Tracking', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      default:
        return { label: isAr ? 'عام' : 'General', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (feat: StoreFeatureItem) => {
    setEditingFeature(feat);
    setEditNameAr(feat.nameAr);
    setEditDescAr(feat.descriptionAr);
    setEditCustomValue(feat.customValue || '');
    setEditIsEnabled(feat.isEnabled);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature) return;

    const updated: StoreFeatureItem = {
      ...editingFeature,
      nameAr: editNameAr.trim() || editingFeature.nameAr,
      descriptionAr: editDescAr.trim() || editingFeature.descriptionAr,
      customValue: editCustomValue.trim(),
      isEnabled: editIsEnabled
    };

    if (onUpdateStoreFeature) {
      onUpdateStoreFeature(updated);
    }
    setEditingFeature(null);
    showToast(isAr ? `تم تعديل خاصية "${updated.nameAr}" بنجاح ✓` : 'Feature updated successfully ✓');
  };

  const handleCreateCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() && !newNameAr.trim()) return;

    const customFeat: StoreFeatureItem = {
      id: `custom_${Date.now()}`,
      name: newName.trim() || newNameAr.trim(),
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
    showToast(isAr ? 'تمت إضافة الخاصية الجديدة لمتجرك بنجاح!' : 'New feature added!');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6 text-start">
      
      {/* 1. Header & Live Indicator */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <span>{isAr ? 'التحكم في واجهة وخصائص متجرك' : 'Storefront & Feature Control Center'}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {activeCount} {isAr ? 'خاصية نشطة بالواجهة' : 'active features'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                {isAr
                  ? 'تحكّم كامل في جميع عناصر متجرك ابتداءً من الصفحة الرئيسية (البانر، البحث، التوصيل، الخصومات، والواتساب) بنظام الأزرار الثلاثة: [زر التفعيل/التعطيل] + [زر التعديل ✏️] + [زر الحذف 🗑️].'
                  : 'Full control over all store elements starting from the homepage via 3 unified buttons: [Toggle Switch] + [Edit Button ✏️] + [Delete Button 🗑️].'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onAddStoreFeature && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isAr ? 'إضافة خاصية جديدة' : 'Add New Feature'}</span>
            </button>
          )}

          {onViewStore && (
            <button
              onClick={onViewStore}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Eye className="w-4 h-4" />
              <span>{isAr ? 'معاينة المتجر الحي' : 'Preview Store'}</span>
            </button>
          )}

          <button
            onClick={() => {
              onEnableAllStoreFeatures();
              showToast(isAr ? 'تم تفعيل جميع خصائص المتجر!' : 'All features activated!');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'تفعيل الكل' : 'Enable All'}</span>
          </button>

          <button
            onClick={() => {
              onResetDefaultStoreFeatures();
              showToast(isAr ? 'تمت استعادة الإعدادات الافتراضية بنجاح!' : 'Reset to defaults!');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            title={isAr ? 'إعادة ضبط كافة الخصائص للوضع الافتراضي' : 'Reset to defaults'}
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>{isAr ? 'استعادة الافتراضي' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Toast Notice */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-2 animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Notice Banner Explaining the 3-Button System */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
            3x
          </div>
          <div className="space-y-0.5">
            <span className="font-extrabold text-slate-900 block">
              {isAr ? 'نظام التحكم الثلاثي لكل خاصية في متجرك:' : 'Triple Control System for Every Feature:'}
            </span>
            <span className="text-[11px] text-slate-600">
              {isAr
                ? '1. زر التفعيل/التعطيل الفوري  •  2. زر التعديل (لتخصيص النصوص والقيم)  •  3. زر الحذف (للإخفاء أو الإرسال للمحذوفات).'
                : '1. Instant Toggle Switch  •  2. Edit Button (Customize text & value)  •  3. Delete Button (Remove or Trash).'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 shrink-0">
          <span className="px-2 py-0.5 rounded bg-emerald-100">نشط: {activeCount}</span>
          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">معطل: {deactivatedCount}</span>
          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800">محذوف: {removedCount}</span>
        </div>
      </div>

      {/* 3. Category Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isAr ? 'جميع الخصائص' : 'All'} ({storeFeatures.length - removedCount})
          </button>

          <button
            onClick={() => setSelectedCategory('storefront')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
              selectedCategory === 'storefront'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{isAr ? 'الصفحة الرئيسية والواجهة' : 'Homepage & Front'}</span>
          </button>

          <button
            onClick={() => setSelectedCategory('checkout')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
              selectedCategory === 'checkout'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{isAr ? 'الشراء والدفع عند الاستلام' : 'Checkout & COD'}</span>
          </button>

          <button
            onClick={() => setSelectedCategory('customer')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
              selectedCategory === 'customer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{isAr ? 'خدمة الزبائن والتتبع' : 'Support & Tracking'}</span>
          </button>

          <button
            onClick={() => setSelectedCategory('removed')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1 ${
              selectedCategory === 'removed'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'سلة المحذوفات' : 'Trash'} ({removedCount})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث في الخصائص...' : 'Search features...'}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-9 pe-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 transition-colors"
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
                    ? 'bg-white border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-xs'
                    : 'bg-slate-50/80 border-slate-200 opacity-75'
                }`}
              >
                {/* Card Top: Category & Status */}
                <div className="space-y-2.5">
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
                        <span>{isAr ? 'مفعلة بالمتجر ✓' : 'Active'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>{isAr ? 'معطلة' : 'Disabled'}</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm flex items-center justify-between">
                      <span>{isAr ? feat.nameAr : feat.name}</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {isAr ? feat.descriptionAr : feat.description}
                    </p>

                    {/* Display custom value if set */}
                    {feat.customValue && (
                      <div className="mt-2 p-2 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-950 flex items-start gap-1.5">
                        <span className="font-bold text-emerald-800 shrink-0">{isAr ? 'النص المخصص:' : 'Custom Value:'}</span>
                        <span className="font-mono text-emerald-900 truncate">{feat.customValue}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom: The 3 Core Control Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  
                  {feat.isRemoved ? (
                    /* Restore Button for removed feature */
                    <button
                      onClick={() => {
                        onRestoreStoreFeature(feat.id);
                        showToast(isAr ? `تمت استعادة خاصية "${feat.nameAr}" للمتجر بنجاح!` : 'Feature restored!');
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isAr ? 'استعادة هذه الخاصية للمتجر ↺' : 'Restore Feature ↺'}</span>
                    </button>
                  ) : (
                    /* THE 3 BUTTONS: TOGGLE | EDIT | DELETE */
                    <div className="grid grid-cols-12 gap-1.5 w-full items-center">
                      
                      {/* Button 1: Toggle Switch (Active / Inactive) */}
                      <button
                        onClick={() => {
                          onToggleStoreFeature(feat.id);
                          showToast(
                            feat.isEnabled 
                              ? (isAr ? `تم تعطيل "${feat.nameAr}" مؤقتاً` : 'Feature deactivated')
                              : (isAr ? `تم تفعيل "${feat.nameAr}" بنجاح!` : 'Feature activated!')
                          );
                        }}
                        className={`col-span-5 py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs ${
                          feat.isEnabled
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        }`}
                        title={feat.isEnabled ? (isAr ? 'انقر لإلغاء تنشيط الخاصية' : 'Click to deactivate') : (isAr ? 'انقر لتفعيل الخاصية' : 'Click to activate')}
                      >
                        {feat.isEnabled ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />
                            <span className="truncate">{isAr ? 'مفعلة' : 'Enabled'}</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5 stroke-[3] shrink-0" />
                            <span className="truncate">{isAr ? 'معطلة' : 'Disabled'}</span>
                          </>
                        )}
                      </button>

                      {/* Button 2: Edit Button (✏️) */}
                      <button
                        onClick={() => handleOpenEditModal(feat)}
                        className="col-span-4 py-2 px-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer border border-slate-200/80"
                        title={isAr ? 'تعديل نصوص وتخصيص هذه الخاصية' : 'Edit feature settings'}
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{isAr ? 'تعديل' : 'Edit'}</span>
                      </button>

                      {/* Button 3: Delete Button (🗑️) */}
                      <button
                        onClick={() => {
                          onRemoveStoreFeature(feat.id);
                          showToast(isAr ? `تم حذف خاصية "${feat.nameAr}" من المتجر` : 'Feature removed from store');
                        }}
                        className="col-span-3 py-2 px-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer border border-slate-200/80"
                        title={isAr ? 'حذف هذه الخاصية ونقلها للمحذوفات' : 'Delete feature from store'}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{isAr ? 'حذف' : 'Delete'}</span>
                      </button>

                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ─── MODAL 1: EDIT FEATURE MODAL (تعديل الخاصية) ─── */}
      {editingFeature && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 text-start">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isAr ? `تعديل خاصية: ${editingFeature.nameAr}` : `Edit Feature: ${editingFeature.name}`}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isAr ? 'تخصيص الاسم، الوصف، والقيمة الترويجية التي تظهر للزبائن' : 'Customize customer-facing labels and promotional values'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingFeature(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'عنوان الخاصية المعروض للزبائن' : 'Feature Title (Arabic)'} *
                </label>
                <input
                  type="text"
                  required
                  value={editNameAr}
                  onChange={(e) => setEditNameAr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'وصف الخاصية التوضيحي' : 'Feature Description'}
                </label>
                <textarea
                  rows={2}
                  value={editDescAr}
                  onChange={(e) => setEditDescAr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'النص أو القيمة المخصصة (Custom Value)' : 'Custom Value / Text'}
                </label>
                <input
                  type="text"
                  value={editCustomValue}
                  onChange={(e) => setEditCustomValue(e.target.value)}
                  placeholder={isAr ? 'مثال: تخفيض خاص 30% بمناسبة الافتتاح، أو رقم واتساب 0555...' : 'e.g. Special 30% discount text or WhatsApp phone'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  {isAr ? '💡 يمكنك كتابة نص البانر، أو رقم الهاتف، أو نص الضمان المخصص ليظهر فوراً في واجهة المتجر.' : 'Custom text displayed dynamically on your storefront.'}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">
                  {isAr ? 'حالة التفعيل:' : 'Active Status:'}
                </span>
                <button
                  type="button"
                  onClick={() => setEditIsEnabled(!editIsEnabled)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                    editIsEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {editIsEnabled ? (isAr ? 'مفعلة ✓' : 'Enabled') : (isAr ? 'معطلة ✕' : 'Disabled')}
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingFeature(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs transition-colors"
                >
                  {isAr ? 'حفظ التعديلات الآن ✓' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: ADD CUSTOM FEATURE ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 text-start">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isAr ? 'إضافة خاصية أو قسم جديد لمتجرك' : 'Add New Custom Store Feature'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isAr ? 'أضف خاصية جديدة تظهر فوراً بنظام الأزرار الثلاثة' : 'Add a new feature with the 3-button system'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomFeature} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'اسم الخاصية بالعربية' : 'Feature Name (Arabic)'} *
                </label>
                <input
                  type="text"
                  required
                  value={newNameAr}
                  onChange={(e) => setNewNameAr(e.target.value)}
                  placeholder={isAr ? 'مثال: قسم العروض الخاصة بالأعياد' : 'e.g. Holiday Special Section'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'تصنيف الخاصية' : 'Category'}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="storefront">{isAr ? 'الصفحة الرئيسية والواجهة' : 'Homepage & Front'}</option>
                  <option value="checkout">{isAr ? 'الشراء والدفع عند الاستلام' : 'Checkout & COD'}</option>
                  <option value="marketing">{isAr ? 'التسويق والعروض' : 'Marketing'}</option>
                  <option value="customer">{isAr ? 'خدمة الزبائن والتتبع' : 'Customer Support'}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {isAr ? 'الوصف والتفاصيل' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={newDescAr}
                  onChange={(e) => setNewDescAr(e.target.value)}
                  placeholder={isAr ? 'شرح موجز لوظيفة الخاصية في متجرك...' : 'Brief explanation...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs transition-colors"
                >
                  {isAr ? 'إضافة وتفعيل الخاصية الآن 🚀' : 'Add Feature'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
