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
    }, 600);
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
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-2 rounded-full bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Brand Lockup */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
            <Lock className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-xl font-extrabold text-white">
            {isAr ? 'تسجيل دخول التاجر' : 'Seller Merchant Portal'}
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {isAr
              ? 'أدخل بريدك الإلكتروني للوصول إلى لوحة تحكم متجرك وإدارته.'
              : 'Enter your merchant credentials to access your store dashboard.'}
          </p>
        </div>

        {/* Quick Demo Login Preset Button */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isAr ? 'حساب تجريبي جاهز (Demo Seller)' : 'Demo Merchant Account'}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">1-Click</span>
          </div>

          <p className="text-[11px] text-slate-300">
            {isAr
              ? `المتجر: ${stores[0]?.nameAr || stores[0]?.name} (${stores[0]?.plan.toUpperCase()})`
              : `Store: ${stores[0]?.name} (${stores[0]?.plan.toUpperCase()})`}
          </p>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin(stores[0])}
            className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <span>{isAr ? 'دخول فوري بحساب التاجر التجريبي ⚡' : 'Sign in as Demo Merchant ⚡'}</span>
          </button>
        </div>

        {/* Traditional Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {isAr ? 'البريد الإلكتروني للتاجر' : 'Merchant Email'}
            </label>
            <div className="relative">
              <Mail className="absolute start-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="merchant@domain.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 ps-9 pe-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute start-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 ps-9 pe-10 text-white focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
              />
              <span>{isAr ? 'تذكرني على هذا الجهاز' : 'Remember me'}</span>
            </label>

            <button type="button" className="text-indigo-400 hover:underline">
              {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/20 transition-all duration-200 active:scale-95 disabled:opacity-50 text-xs flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>{isAr ? 'جارٍ التحقق...' : 'Signing in...'}</span>
            ) : (
              <>
                <span>{isAr ? 'تسجيل الدخول للوحة التحكم' : 'Sign In to Dashboard'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>

        </form>

        {/* Footer: Register New Store Switcher */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          <span>{isAr ? 'لا تملك متجراً بعد؟' : "Don't have a store yet?"}{' '}</span>
          <button
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
            className="text-indigo-400 font-bold hover:underline"
          >
            {isAr ? 'أنشئ متجرك الجديد الآن مجاناً' : 'Create your store now'}
          </button>
        </div>

      </div>

    </div>
  );
};
