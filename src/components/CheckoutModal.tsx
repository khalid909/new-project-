import React, { useState } from 'react';
import { CartItem, Currency, Language, Order, OrderCustomer } from '../types';
import { CURRENCY_RATES } from '../data/initialData';
import { X, CheckCircle, CreditCard, ShieldCheck, Truck, Printer, ArrowRight, ArrowLeft, Lock } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  language: Language;
  discountPercent: number;
  onOrderCompleted: (newOrder: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  language,
  discountPercent,
  onOrderCompleted
}) => {
  if (!isOpen) return null;

  const isAr = language === 'ar';
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form State
  const [customer, setCustomer] = useState<OrderCustomer>({
    fullName: isAr ? 'خالد المنصور' : 'Khalid Al-Mansour',
    email: 'khalid.mansour@domain.sa',
    phone: '+966 50 123 4567',
    address: isAr ? 'حي النخيل، طريق الملك فهد، برج رقم 4' : 'Al-Nakheel, King Fahd Road, Tower 4',
    city: isAr ? 'الرياض' : 'Riyadh',
    postalCode: '11564'
  });

  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'credit_card' | 'mada' | 'cash_on_delivery'>('apple_pay');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formatPrice = (usdAmount: number) => {
    const rateInfo = CURRENCY_RATES[currency];
    const converted = Math.round(usdAmount * rateInfo.rate);
    return `${converted.toLocaleString()} ${isAr ? rateInfo.symbolAr : rateInfo.symbol}`;
  };

  const rawSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(rawSubtotal * (discountPercent / 100));
  const shippingAmount = rawSubtotal > 2000 || rawSubtotal === 0 ? 0 : 50;
  const grandTotal = rawSubtotal - discountAmount + shippingAmount;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = `SQF-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const trackingNumber = `EXP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNumber,
        customer,
        items,
        subtotal: rawSubtotal,
        discount: discountAmount,
        shipping: shippingAmount,
        total: grandTotal,
        currency,
        status: 'processing',
        paymentMethod,
        createdAt: new Date().toISOString(),
        storeId: items[0]?.product.storeId || 'store_all',
        trackingNumber,
        notes: isAr ? 'طلب موحد مؤكد عبر منصة سُوقِفاي السحابية' : 'Verified order on SOUQIFY Cloud Platform'
      };

      setCreatedOrder(newOrder);
      onOrderCompleted(newOrder);
      setIsSubmitting(false);
      setStep('success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-neutral-100">
              {step === 'details'
                ? isAr
                  ? 'إتمام عملية الشراء الموحدة'
                  : 'Unified Marketplace Checkout'
                : isAr
                ? 'تم تأكيد طلبك بنجاح'
                : 'Order Successfully Placed'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
            
            {/* Customer & Shipping Section */}
            <div>
              <h4 className="text-xs uppercase font-mono text-neutral-400 tracking-wider mb-3">
                {isAr ? '1. بيانات المستلم وعنوان التوصيل' : '1. Recipient & Shipping Address'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">
                    {isAr ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">
                    {isAr ? 'رقم الهاتف / الجوال' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">
                    {isAr ? 'المدينة' : 'City'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 mb-1">
                    {isAr ? 'العنوان التفصيلي والشارع' : 'Street Address'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <h4 className="text-xs uppercase font-mono text-neutral-400 tracking-wider mb-3">
                {isAr ? '2. وسيلة الدفع المؤمنة' : '2. Secure Payment Method'}
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'apple_pay', label: 'Apple Pay' },
                  { id: 'mada', label: isAr ? 'مدى / البطاقات المحلية' : 'Mada / Debit' },
                  { id: 'credit_card', label: isAr ? 'بطاقة ائتمانية' : 'Credit Card' },
                  { id: 'cash_on_delivery', label: isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery' },
                ].map((method) => {
                  const isSelected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-bold shadow-sm'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {method.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order Summary Strip */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs font-mono tabular-nums">
              <div className="flex justify-between text-neutral-400">
                <span>{isAr ? 'عدد القطع:' : 'Items count:'}</span>
                <span>{items.reduce((s, i) => s + i.quantity, 0)} {isAr ? 'قطع' : 'units'}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>{isAr ? `الخصم المطبق (${discountPercent}%):` : `Discount (${discountPercent}%):`}</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-400">
                <span>{isAr ? 'الشحن والتأمين:' : 'Insured Shipping:'}</span>
                <span>{shippingAmount === 0 ? (isAr ? 'مجاني' : 'Free') : formatPrice(shippingAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-100 pt-2 border-t border-neutral-800">
                <span>{isAr ? 'الإجمالي المطلوب دفعه:' : 'Total Payable:'}</span>
                <span className="text-amber-400">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/10 transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{isAr ? 'جارٍ معالجة الدفع والطلب...' : 'Processing Payment & Order...'}</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-neutral-950" />
                  <span>{isAr ? `تأكيد الطلب ودفع ${formatPrice(grandTotal)}` : `Confirm Order & Pay ${formatPrice(grandTotal)}`}</span>
                </>
              )}
            </button>

          </form>
        ) : (
          /* Order Confirmation View */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-neutral-100">
                {isAr ? 'تهانينا! تم تأكيد طلبك بنجاح' : 'Congratulations! Your Order is Confirmed'}
              </h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                {isAr
                  ? 'تم إرسال إشعار فوري إلى نظام التاجر وقاعدة بيانات Supabase، وجارٍ تجهيز الشحنة عبر الشحن السريع المؤمن.'
                  : 'A dispatch order has been sent to the atelier inventory and registered in your Supabase database.'}
              </p>
            </div>

            {/* Order Receipt Box */}
            {createdOrder && (
              <div className="max-w-md mx-auto p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-start space-y-3 font-mono text-xs tabular-nums">
                <div className="flex justify-between border-b border-neutral-850 pb-2">
                  <span className="text-neutral-500">{isAr ? 'رقم الطلب' : 'Order Number'}</span>
                  <span className="font-bold text-amber-400">{createdOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">{isAr ? 'كود التتبع' : 'Tracking Code'}</span>
                  <span className="text-neutral-200">{createdOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">{isAr ? 'المستلم' : 'Recipient'}</span>
                  <span className="text-neutral-200">{createdOrder.customer.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">{isAr ? 'العنوان' : 'Destination'}</span>
                  <span className="text-neutral-200">{createdOrder.customer.city}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-850 pt-2 font-bold text-neutral-100">
                  <span>{isAr ? 'الإجمالي المدفوع' : 'Total Amount'}</span>
                  <span className="text-emerald-400">{formatPrice(createdOrder.total)}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isAr ? 'طباعة الفاتورة' : 'Print Invoice'}</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-colors"
              >
                {isAr ? 'العودة للتسوق' : 'Continue Shopping'}
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
