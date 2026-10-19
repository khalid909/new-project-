import React, { useState } from 'react';
import { CartItem, Currency, Language } from '../types';
import { CURRENCY_RATES } from '../data/initialData';
import { X, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Tag, ShieldCheck, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  language: Language;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: (discountPercent: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  language,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const isAr = language === 'ar';
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>('');

  const formatPrice = (usdAmount: number) => {
    const rateInfo = CURRENCY_RATES[currency];
    const converted = Math.round(usdAmount * rateInfo.rate);
    return `${converted.toLocaleString()} ${isAr ? rateInfo.symbolAr : rateInfo.symbol}`;
  };

  const rawSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(rawSubtotal * (appliedDiscount / 100));
  const shippingAmount = rawSubtotal > 2000 || rawSubtotal === 0 ? 0 : 50;
  const grandTotal = rawSubtotal - discountAmount + shippingAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'LUXURY15' || code === 'VIP15') {
      setAppliedDiscount(15);
    } else if (code === 'WELCOME') {
      setAppliedDiscount(10);
    } else {
      setPromoError(isAr ? 'رمز ترويجي غير صالح. جرّب: LUXURY15' : 'Invalid promo code. Try: LUXURY15');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className={`absolute inset-y-0 ${
          isAr ? 'left-0' : 'right-0'
        } max-w-full flex pl-10`}
      >
        <div className="w-screen max-w-md bg-neutral-900 border-s border-neutral-800 shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-neutral-100">
                {isAr ? 'حقيبة المقتنيات' : 'Shopping Bag'}
              </h2>
              <span className="text-xs font-mono text-neutral-400 tabular-nums">
                ({items.reduce((s, i) => s + i.quantity, 0)})
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body: Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20 text-neutral-500 space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-neutral-600" />
                <p className="text-sm font-medium text-neutral-400">
                  {isAr ? 'حقيبتك فارغة حالياً' : 'Your bag is empty'}
                </p>
                <p className="text-xs text-neutral-500">
                  {isAr ? 'استكشف معروضات كبرى الدور المستقلة وأضف قطعك المفضلة.' : 'Browse our independent boutiques to add luxury items.'}
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 overflow-hidden text-xs font-mono text-neutral-400">
                    <span className="uppercase text-[10px] text-amber-400">
                      {item.product.category}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] text-amber-400 font-mono">
                          {isAr ? item.product.storeNameAr : item.product.storeName}
                        </span>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="text-xs font-semibold text-neutral-100 line-clamp-1">
                        {isAr ? item.product.nameAr : item.product.name}
                      </h4>

                      {/* Selected Variants */}
                      {item.selectedVariants && (
                        <div className="flex flex-wrap gap-1 mt-1 text-[10px] text-neutral-400">
                          {Object.entries(item.selectedVariants).map(([k, v]) => (
                            <span key={k} className="bg-neutral-900 px-1.5 py-0.5 rounded">
                              {v}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quantity Stepper & Item Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded px-1.5 py-0.5 text-xs font-mono tabular-nums">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="hover:text-amber-400"
                        >
                          -
                        </button>
                        <span className="w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="hover:text-amber-400"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold font-mono tabular-nums text-neutral-200">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer: Pricing & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-neutral-950/80 space-y-4">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute start-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder={isAr ? 'رمز قسيمة الخصم (جرّب LUXURY15)' : 'Promo code (try LUXURY15)'}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 rounded-lg py-2 ps-9 pe-3 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium transition-colors"
                >
                  {isAr ? 'تطبيق' : 'Apply'}
                </button>
              </form>

              {appliedDiscount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-400">
                  <div className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{isAr ? `تم خصم ${appliedDiscount}% بنجاح` : `Saved ${appliedDiscount}%`}</span>
                  </div>
                  <span className="font-mono tabular-nums">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              {promoError && (
                <p className="text-[11px] text-rose-400">{promoError}</p>
              )}

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-400 font-mono tabular-nums pt-2 border-t border-neutral-850">
                <div className="flex justify-between">
                  <span>{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span>{formatPrice(rawSubtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>{isAr ? 'الشحن والتأمين المباشر' : 'Insured Shipping'}</span>
                  <span>{shippingAmount === 0 ? (isAr ? 'مجاني' : 'Free') : formatPrice(shippingAmount)}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-neutral-100 pt-2 border-t border-neutral-800">
                  <span>{isAr ? 'الإجمالي النهائي' : 'Total Amount'}</span>
                  <span className="text-amber-400">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Trust banner */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'دفع إلكتروني مشفر ومحمي بضمان الاسترداد' : 'Encrypted 256-bit checkout & buyer escrow'}</span>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={() => {
                  onProceedToCheckout(appliedDiscount);
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/10 transition-all duration-200 active:scale-95"
              >
                <span>{isAr ? 'متابعة لإتمام الطلب الموحد' : 'Proceed to Checkout'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
