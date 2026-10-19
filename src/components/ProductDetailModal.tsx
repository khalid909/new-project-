import React, { useState } from 'react';
import { Product, Store, Currency, Language } from '../types';
import { ProductVisual } from './ProductVisual';
import { CURRENCY_RATES } from '../data/initialData';
import { X, Star, ShieldCheck, Truck, RotateCcw, Check, ShoppingBag, Zap, Heart } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  store?: Store;
  currency: Currency;
  language: Language;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedVariants?: Record<string, string>) => void;
  onInstantCheckout: (product: Product, quantity: number, selectedVariants?: Record<string, string>) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  store,
  currency,
  language,
  onClose,
  onAddToCart,
  onInstantCheckout
}) => {
  if (!product) return null;

  const isAr = language === 'ar';
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.variants) {
      product.variants.forEach((v) => {
        initial[v.name] = v.options[0];
      });
    }
    return initial;
  });
  const [isAddedFeedback, setIsAddedFeedback] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  const formatPrice = (usdAmount: number) => {
    const rateInfo = CURRENCY_RATES[currency];
    const converted = Math.round(usdAmount * rateInfo.rate);
    return `${converted.toLocaleString()} ${isAr ? rateInfo.symbolAr : rateInfo.symbol}`;
  };

  const handleSelectOption = (variantName: string, option: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: option
    }));
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedVariants);
    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    onInstantCheckout(product, quantity, selectedVariants);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 z-10 p-2 rounded-full bg-neutral-950/80 text-neutral-400 hover:text-white border border-neutral-800 hover:bg-neutral-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 2-Column Split: Visual Left / Contiguous Purchase Module Right */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Visual Showcase Column */}
          <div className="relative bg-neutral-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-e border-neutral-800">
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-sm aspect-square flex items-center justify-center">
                <ProductVisual product={product} isDetailed={true} className="rounded-xl border border-neutral-800" />
              </div>
            </div>

            {/* Micro badges below image */}
            <div className="pt-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>SKU: {product.sku}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {product.stock > 0 ? (isAr ? `متوفر (${product.stock} قطعة)` : `In Stock (${product.stock} left)`) : (isAr ? 'نفد المخزون' : 'Sold Out')}
                </span>
              </div>

              {/* Guarantees strip */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-900 text-[11px] text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isAr ? 'أصالة 100%' : '100% Authentic'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isAr ? 'شحن مؤمّن' : 'Insured Delivery'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{isAr ? 'إرجاع مجاني' : '14-Day Return'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contiguous Purchase Module Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 max-h-[85vh] overflow-y-auto">
            
            <div className="space-y-4">
              {/* Store Attribution & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold font-mono">
                  {isAr ? product.storeNameAr : product.storeName}
                </span>

                <div className="flex items-center gap-1 text-xs text-amber-400 font-mono tabular-nums">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-neutral-500">({product.reviewsCount} {isAr ? 'تقييم' : 'reviews'})</span>
                </div>
              </div>

              {/* Product Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 leading-snug">
                {isAr ? product.nameAr : product.name}
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {isAr ? product.descriptionAr : product.description}
              </p>

              {/* Price Banner */}
              <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-neutral-500 block mb-0.5">
                    {isAr ? 'السعر الشامل' : 'Total Price'}
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-extrabold text-neutral-100 font-mono tabular-nums">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm line-through text-neutral-500 font-mono tabular-nums">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-2.5 rounded-lg border transition-colors ${
                    isWishlisted
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                  aria-label="Save to wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400' : ''}`} />
                </button>
              </div>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 pt-2">
                  {product.variants.map((variant) => (
                    <div key={variant.name} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-400">
                          {isAr ? variant.nameAr : variant.name}:
                        </span>
                        <span className="font-mono text-neutral-200">
                          {selectedVariants[variant.name]}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((opt) => {
                          const isSelected = selectedVariants[variant.name] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleSelectOption(variant.name, opt)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                                isSelected
                                  ? 'bg-amber-400 text-neutral-950 border-amber-400 font-bold shadow-sm'
                                  : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-neutral-400">
                  {isAr ? 'الكمية المطلوبة:' : 'Quantity:'}
                </span>

                <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-lg p-1 font-mono text-xs tabular-nums">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-7 h-7 rounded flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-neutral-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-7 h-7 rounded flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Technical Specifications Table */}
              <div className="pt-4 border-t border-neutral-800/80 space-y-2">
                <span className="text-xs uppercase font-mono tracking-wider text-neutral-400 block mb-2">
                  {isAr ? 'المواصفات الفنية المعتمدة' : 'Verified Technical Specs'}
                </span>
                <div className="divide-y divide-neutral-850 rounded-lg border border-neutral-800 bg-neutral-950/40 text-xs">
                  {product.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between py-2 px-3">
                      <span className="text-neutral-500">{isAr ? spec.labelAr : spec.label}</span>
                      <span className="font-mono text-neutral-300 tabular-nums text-end">
                        {isAr ? spec.valueAr : spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Sticky Action Footer */}
            <div className="pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                disabled={product.stock <= 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isAddedFeedback
                    ? 'bg-emerald-600 text-white'
                    : product.stock <= 0
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 active:scale-95'
                }`}
              >
                {isAddedFeedback ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>{isAr ? 'تمت الإضافة للسلة' : 'Added to Bag'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isAr ? 'إضافة إلى السلة' : 'Add to Bag'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 shadow-lg shadow-amber-500/10 transition-all duration-200 active:scale-95 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-neutral-950" />
                <span>{isAr ? 'شراء فوري مباشر' : 'Instant Checkout'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
