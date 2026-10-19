import React, { useState } from 'react';
import { Store, Product, Order, Language, Currency } from '../types';
import { CURRENCY_RATES } from '../data/initialData';
import { 
  ShoppingBag, CheckCircle2, ArrowRight, ArrowLeft, 
  Lock, X, ShieldCheck, Truck, Star, Check, Plus, Minus, Printer, CreditCard
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

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: Product; quantity: number }[];
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
      createdAt: new Date().toISOString().split('T')[0],
      trackingNumber: `AVT-TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    onNewCustomerOrder(newOrder);
    setOrderConfirmed(newOrder);
    setCart([]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      
      {/* Browser Viewport Simulation */}
      <div className="relative w-full max-w-5xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Top Browser URL Bar */}
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
          </div>

          <div className="flex-1 max-w-md mx-auto bg-white border border-slate-300 rounded-lg px-3 py-1 flex items-center justify-center gap-2 text-xs font-mono text-slate-700 shadow-2xs truncate">
            <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-slate-400">https://</span>
            <span className="text-slate-900 font-bold">{store.settings.subdomain}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
            title={isAr ? 'إغلاق المتجر' : 'Close store'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Public Store Content */}
        <div className="flex-1 overflow-y-auto bg-[#FAFAFA] text-slate-800">
          
          {/* Store Brand Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-20 shadow-2xs">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-xs"
                  style={{ backgroundColor: store.accentColor || '#4F46E5' }}
                >
                  {store.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900">
                    {isAr ? store.nameAr : store.name}
                  </h1>
                  <p className="text-xs text-slate-500">
                    {isAr ? store.sloganAr : store.slogan}
                  </p>
                </div>
              </div>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAr ? 'سلة المشتريات' : 'Cart'}</span>
                {totalItemsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>
          </header>

          {/* Store Products Grid */}
          <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
            
            {/* Store Announcement */}
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  {isAr
                    ? `شحن مجاني لجميع الطلبات بقيمة أكثر من ${store.settings.freeShippingThreshold} ر.س!`
                    : `Free shipping on orders above ${store.settings.freeShippingThreshold} SAR!`}
                </span>
              </div>
              <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                {isAr ? 'متجر معتمد وموثق ✓' : 'Verified Store ✓'}
              </span>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {storeProducts.map((product) => {
                const inCart = cart.find((c) => c.product.id === product.id);

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Product Visual Box */}
                      <div className="w-full h-40 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-4 border border-slate-200/60 relative overflow-hidden group">
                        <ShoppingBag className="w-10 h-10 text-slate-300 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-mono text-slate-500 mt-2 font-medium">
                          {product.category}
                        </span>
                        <span className="absolute top-2.5 end-2.5 text-[10px] bg-white/90 backdrop-blur-xs font-mono font-bold text-slate-700 px-2 py-0.5 rounded shadow-2xs">
                          {product.stock} {isAr ? 'قطعة' : 'left'}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {isAr ? product.nameAr : product.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {isAr ? product.descriptionAr : product.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="font-extrabold text-base text-slate-900 font-mono">
                        {formatPrice(product.price)}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          inCart
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                        }`}
                      >
                        {inCart ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{inCart.quantity} {isAr ? 'بالسلة' : 'in cart'}</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>{isAr ? 'إضافة للسلة' : 'Add'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </main>

        </div>

      </div>

      {/* ─── CHECKOUT / CART DRAWER MODAL ─── */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    {isAr ? 'سلة مشتريات الزبون' : 'Customer Shopping Cart'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  {isAr ? 'السلة فارغة حالياً. أضف منتجات من المتجر.' : 'Cart is currently empty.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Itemized List */}
                  <div className="divide-y divide-slate-100">
                    {cart.map((item) => (
                      <div key={item.product.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="font-bold text-slate-900">
                            {isAr ? item.product.nameAr : item.product.name}
                          </div>
                          <div className="text-slate-500 font-mono">
                            {formatPrice(item.product.price)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, -1)}
                            className="w-6 h-6 rounded bg-slate-100 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-slate-900 font-mono w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, 1)}
                            className="w-6 h-6 rounded bg-slate-100 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Info Form */}
                  <form onSubmit={handleConfirmOrder} className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                    <span className="font-bold text-slate-900 block">
                      {isAr ? 'بيانات الشحن والاستلام:' : 'Shipping Address:'}
                    </span>

                    <div>
                      <label className="text-slate-600 block mb-1 font-medium">{isAr ? 'اسم المستلم' : 'Full Name'}</label>
                      <input
                        type="text"
                        required
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-600 block mb-1 font-medium">{isAr ? 'رقم الجوال' : 'Phone'}</label>
                        <input
                          type="text"
                          required
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 block mb-1 font-medium">{isAr ? 'المدينة' : 'City'}</label>
                        <input
                          type="text"
                          required
                          value={custCity}
                          onChange={(e) => setCustCity(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-600 block mb-1 font-medium">{isAr ? 'العنوان التفصيلي' : 'Address'}</label>
                      <input
                        type="text"
                        required
                        value={custAddress}
                        onChange={(e) => setCustAddress(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    {/* Cost Breakdown */}
                    <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 font-mono">
                      <div className="flex justify-between">
                        <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                        <span>{formatPrice(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{isAr ? 'الشحن والتوصيل:' : 'Shipping:'}</span>
                        <span>{formatPrice(store.settings.shippingRate)}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
                        <span>{isAr ? 'الإجمالي النهائي:' : 'Total:'}</span>
                        <span className="text-indigo-600">{formatPrice(cartTotal + store.settings.shippingRate)}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 transition-all active:scale-98"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{isAr ? 'إتمام الطلب وتأكيد الدفع (مدى / Apple Pay)' : 'Confirm & Complete Order'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
              {isAr ? 'معاملة آمنة ومحمية بتشفير 256-bit' : '256-bit encrypted secure checkout'}
            </div>

          </div>
        </div>
      )}

      {/* ─── ORDER CONFIRMATION MODAL ─── */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-70 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {isAr ? 'تم استلام طلبك بنجاح!' : 'Order Placed Successfully!'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isAr ? `رقم الطلب: ${orderConfirmed.orderNumber}` : `Order ID: ${orderConfirmed.orderNumber}`}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-start space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">{isAr ? 'المستلم:' : 'Customer:'}</span>
                <span className="font-bold text-slate-900">{orderConfirmed.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isAr ? 'المبلغ الإجمالي:' : 'Amount:'}</span>
                <span className="font-mono font-bold text-indigo-600">{formatPrice(orderConfirmed.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isAr ? 'طريقة الدفع:' : 'Payment:'}</span>
                <span className="text-slate-800 font-semibold">{orderConfirmed.paymentMethod}</span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-700">
              {isAr ? '✓ تم إرسال إشعار فوري للتاجر وتحديث لوحة تحكم المتجر.' : '✓ Notification sent to merchant and logged in dashboard.'}
            </p>

            <button
              onClick={() => {
                setOrderConfirmed(null);
                setIsCheckoutOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              {isAr ? 'العودة للمتجر' : 'Back to Store'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
