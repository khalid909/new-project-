import React, { useState } from 'react';
import { Store, Product, Order, Language, Currency } from '../types';
import { CURRENCY_RATES } from '../data/initialData';
import { 
  ShoppingBag, CheckCircle2, ArrowRight, ArrowLeft, 
  Lock, X, ShieldCheck, Truck, Star, Check 
} from 'lucide-react';

interface PublicStoreViewProps {
  store: Store;
  products: Product[];
  language: Language;
  currency: Currency;
  onClose: () => void;
  onNewCustomerOrder: (order: Order) => void;
}

export const PublicStoreView: React.FC<PublicStoreViewProps> = ({
  store,
  products,
  language,
  currency,
  onClose,
  onNewCustomerOrder
}) => {
  const isAr = language === 'ar';
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = useState<Order | null>(null);

  // Customer Checkout Form
  const [custName, setCustName] = useState(isAr ? 'فيصل العتيبي' : 'Faisal Al-Otaibi');
  const [custEmail, setCustEmail] = useState('faisal@example.com');
  const [custPhone, setCustPhone] = useState('+966 50 123 4567');
  const [custCity, setCustCity] = useState(isAr ? 'الرياض' : 'Riyadh');
  const [custAddress, setCustAddress] = useState(isAr ? 'حي النخيل، شارع الأمير تركي' : 'Al-Nakheel, Prince Turki St');

  const storeProducts = products.filter((p) => p.storeId === store.id && p.isPublished);

  const formatPrice = (amount: number) => {
    const rateInfo = CURRENCY_RATES[currency];
    const converted = Math.round(amount * rateInfo.rate);
    return `${converted.toLocaleString()} ${isAr ? rateInfo.symbolAr : rateInfo.symbol}`;
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNum = `AVT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      storeId: store.id,
      customerName: custName,
      customerEmail: custEmail,
      customerPhone: custPhone,
      customerCity: custCity,
      customerAddress: custAddress,
      items: cart.map((c) => ({
        id: `item_${c.product.id}`,
        product: c.product,
        quantity: c.quantity
      })),
      total: cartTotal + store.settings.shippingRate,
      currency,
      status: 'processing',
      paymentMethod: 'مدى / Apple Pay',
      createdAt: new Date().toISOString(),
      trackingNumber: `AVT-TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    onNewCustomerOrder(newOrder);
    setOrderConfirmed(newOrder);
    setCart([]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      
      {/* Browser Viewport Simulation */}
      <div className="relative w-full max-w-5xl bg-[#090D16] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Top Browser URL Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          <div className="flex-1 max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 flex items-center justify-center gap-2 text-xs font-mono text-slate-300 truncate">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-slate-500">https://</span>
            <span className="text-white font-bold">{store.settings.subdomain}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Public Store Content */}
        <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100">
          
          {/* Store Banner */}
          <div className="border-b border-slate-850 px-6 py-8 bg-gradient-to-b from-slate-900/60 to-slate-950">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg"
                  style={{ backgroundColor: store.accentColor || '#6366F1' }}
                >
                  {store.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">
                    {isAr ? store.nameAr : store.name}
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isAr ? store.sloganAr : store.slogan}
                  </p>
                </div>
              </div>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs text-white"
              >
                <ShoppingBag className="w-4 h-4 text-indigo-400" />
                <span>{isAr ? 'سلة المشتريات' : 'Bag'}</span>
                <span className="font-mono bg-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
                {cartTotal > 0 && (
                  <span className="font-mono font-bold text-indigo-300 ms-1">
                    ({formatPrice(cartTotal)})
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Store Body */}
          <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
            
            {orderConfirmed ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">
                  {isAr ? 'تم استلام طلب الشراء بنجاح!' : 'Order Placed Successfully!'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {isAr
                    ? `رقم الطلب الخاص بك هو: ${orderConfirmed.orderNumber} — وصل إشعار الطلب للتاجر في لوحة التحكم الخاصة به فوراً.`
                    : `Order ${orderConfirmed.orderNumber} has been received and notified to the merchant dashboard in real-time.`}
                </p>
                <button
                  onClick={() => {
                    setOrderConfirmed(null);
                    setIsCheckoutOpen(false);
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
                >
                  {isAr ? 'العودة لتصفح منتجات المتجر' : 'Continue Shopping'}
                </button>
              </div>
            ) : isCheckoutOpen ? (
              /* Customer Checkout */
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">
                    {isAr ? 'إتمام طلب الشراء للزبون' : 'Customer Express Checkout'}
                  </h3>
                  <button onClick={() => setIsCheckoutOpen(false)} className="text-xs text-slate-400 hover:underline">
                    {isAr ? 'الرجوع للمنتجات' : 'Back to Store'}
                  </button>
                </div>

                {cart.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    {isAr ? 'سلة المشتريات فارغة.' : 'Your bag is empty.'}
                  </p>
                ) : (
                  <form onSubmit={handleConfirmOrder} className="space-y-6 text-xs">
                    {/* Items review */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 divide-y divide-slate-850">
                      {cart.map((item) => (
                        <div key={item.product.id} className="py-2 flex justify-between items-center">
                          <span className="text-white font-medium">
                            {item.quantity}x {isAr ? item.product.nameAr : item.product.name}
                          </span>
                          <span className="font-mono text-indigo-400 font-bold">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 flex justify-between font-bold text-white text-sm">
                        <span>{isAr ? 'الإجمالي المطلوب' : 'Total Payable'}</span>
                        <span className="text-emerald-400">{formatPrice(cartTotal + store.settings.shippingRate)}</span>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                        <input
                          type="text"
                          required
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">{isAr ? 'رقم الهاتف' : 'Phone'}</label>
                        <input
                          type="tel"
                          required
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">{isAr ? 'المدينة' : 'City'}</label>
                        <input
                          type="text"
                          required
                          value={custCity}
                          onChange={(e) => setCustCity(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">{isAr ? 'العنوان والحي' : 'Street Address'}</label>
                        <input
                          type="text"
                          required
                          value={custAddress}
                          onChange={(e) => setCustAddress(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl font-bold text-white text-xs shadow-lg transition-all active:scale-95"
                      style={{ backgroundColor: store.accentColor || '#6366F1' }}
                    >
                      {isAr ? `تأكيد ودفع الطلب (${formatPrice(cartTotal + store.settings.shippingRate)})` : `Place Order (${formatPrice(cartTotal + store.settings.shippingRate)})`}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* Products Grid */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">
                    {isAr ? 'جميع معروضات المتجر' : 'Store Catalog'}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {storeProducts.length} {isAr ? 'منتج متاح' : 'items'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {storeProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
                    >
                      {/* Product Visual Card */}
                      <div className="w-full aspect-video rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-xs font-mono text-indigo-400 font-bold uppercase">
                        {p.category}
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-500 block">
                          SKU: {p.sku}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">
                          {isAr ? p.nameAr : p.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {isAr ? p.descriptionAr : p.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-850">
                        <span className="text-base font-extrabold font-mono text-white tabular-nums">
                          {formatPrice(p.price)}
                        </span>

                        <button
                          onClick={() => handleAddToCart(p)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all shadow-sm active:scale-95"
                          style={{ backgroundColor: store.accentColor || '#6366F1' }}
                        >
                          {isAr ? 'إضافة للسلة' : 'Add to Bag'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
