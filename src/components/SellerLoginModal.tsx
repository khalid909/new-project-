import React, { useState } from 'react';
import { SellerUser, Store, Language } from '../types';
import { 
  Lock, Mail, ArrowRight, ArrowLeft, X, ShieldCheck, 
  Sparkles, Check, AlertCircle, Eye, EyeOff 
} from 'lucide-react';

interface SellerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  stores: Store[];
  onLoginSuccess: (user: SellerUser, storeId: string) => void;
  onSwitchToRegister: () => void;
}

export const SellerLoginModal: React.FC<SellerLoginModalProps> = ({
  isOpen,
  onClose,
  language,
  stores,
  onLoginSuccess,
  onSwitchToRegister
}) => {
  if (!isOpen) return null;

  const isAr = language === 'ar';
  const [email, setEmail] = useState('khalid@domain.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      // Find matching store by email or default to first store
      const matchingStore = stores.find(
        (s) => s.ownerEmail.toLowerCase() === email.trim().toLowerCase()
      ) || stores[0];

      if (!matchingStore) {
        setErrorMessage(isAr ? 'لم يتم العثور على متجر مسجل بهذا البريد.' : 'No store found with this email.');
        setIsLoading(false);
        return;
      }

      const seller: SellerUser = {
        id: `usr_${matchingStore.id}`,
        name: matchingStore.ownerName,
        email: matchingStore.ownerEmail,
        storeId: matchingStore.id
      };

      onLoginSuccess(seller, matchingStore.id);
      setIsLoading(false);
      onClose();
    }, 450);
  };

  const handleQuickDemoLogin = (storeToLogin: Store) => {
    setEmail(storeToLogin.ownerEmail);
    setPassword('demoPass2026');
    setIsLoading(true);

    setTimeout(() => {
      const seller: SellerUser = {
        id: `usr_${storeToLogin.id}`,
        name: storeToLogin.ownerName,
        email: storeToLogin.ownerEmail,
        storeId: storeToLogin.id
      };
      onLoginSuccess(seller, storeToLogin.id);
      setIsLoading(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Brand Lockup */}
        <div className="text-center space-y-2 pt-1">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto shadow-md shadow-indigo-600/20 text-white">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            {isAr ? 'تسجيل دخول التاجر' : 'Seller Portal Login'}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {isAr
              ? 'أدخل بيانات حسابك للوصول إلى لوحة تحكم متجرك وإدارته.'
              : 'Enter your credentials to access your store control dashboard.'}
          </p>
        </div>

        {/* Quick Demo Login Preset Button */}
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-900 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>{isAr ? 'حساب تجريبي فوري للتجربة' : 'Instant Demo Account'}</span>
            </span>
            <span className="text-[10px] bg-indigo-200/60 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
              1-Click
            </span>
          </div>

          <p className="text-[11px] text-slate-600">
            {isAr
              ? `المتجر النشط: ${stores[0]?.nameAr || stores[0]?.name} (خطة ${stores[0]?.plan === 'pro' ? 'احترافية' : 'مجانية'})`
              : `Active Store: ${stores[0]?.name} (${stores[0]?.plan.toUpperCase()} Plan)`}
          </p>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin(stores[0])}
            className="w-full py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm cursor-pointer"
          >
            <span>{isAr ? 'دخول فوري بحساب التاجر التجريبي ⚡' : 'Sign In as Demo Merchant ⚡'}</span>
          </button>
        </div>

        {/* Traditional Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              {isAr ? 'البريد الإلكتروني للتاجر' : 'Merchant Email'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="merchant@example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 px-3 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute end-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-700 font-bold">
                {isAr ? 'كلمة المرور' : 'Password'}
              </label>
              <button
                type="button"
                onClick={() => alert(isAr ? 'في النسخة التجريبية يمكنك استخدام كلمة المرور الحالية أو تسجيل الدخول السريع.' : 'In demo mode, you can use any password or quick login.')}
                className="text-[11px] text-indigo-600 hover:underline"
              >
                {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 px-3 text-slate-900 focus:bg-white focus:border-indigo-600 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>{isAr ? 'تذكر بيانات تسجيل الدخول' : 'Remember me'}</span>
            </label>

            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAr ? 'اتصال آمن ومحمي' : 'Secure SSL'}</span>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md text-xs flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isAr ? 'تسجيل الدخول إلى لوحة التحكم' : 'Sign In to Dashboard'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>

        </form>

        {/* Footer Link to Register */}
        <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>{isAr ? 'ليس لديك متجر إلكتروني بعد؟ ' : "Don't have a store yet? "}</span>
          <button
            onClick={onSwitchToRegister}
            className="font-bold text-indigo-600 hover:underline cursor-pointer"
          >
            {isAr ? 'أنشئ متجرك مجاناً الآن' : 'Create your free store now'}
          </button>
        </div>

      </div>
    </div>
  );
};
