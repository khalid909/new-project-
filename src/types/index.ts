export type Currency = 'DZD' | 'SAR' | 'USD' | 'EUR';
export type Language = 'ar' | 'en' | 'fr';
export type PlanType = 'free' | 'pro' | 'enterprise';

export interface SellerUser {
  id: string;
  name: string;
  email: string;
  storeId: string;
  avatarUrl?: string;
}

export interface PlanDetails {
  id: PlanType;
  name: string;
  nameAr: string;
  price: number; // in DZD
  priceSar?: number;
  description: string;
  descriptionAr: string;
  features: string[];
  featuresAr: string[];
  maxProducts: number;
  transactionFee: string;
  isPopular?: boolean;
}

export interface WilayaDeliveryRate {
  code: string;
  name: string;
  nameAr: string;
  homePrice: number; // سعر التوصيل للمنزل (Domicile)
  deskPrice: number; // سعر التوصيل للمكتب (Stop-Desk)
  isAvailable: boolean;
}

export interface CarrierConfig {
  id: 'yalidine' | 'zrexpress' | 'noest' | 'maystro' | 'procolis';
  name: string;
  nameAr: string;
  isEnabled: boolean;
  apiKey?: string;
  apiToken?: string;
  defaultDeliveryType: 'home' | 'desk';
}

export interface PixelConfig {
  facebookPixelId?: string;
  tiktokPixelId?: string;
  snapchatPixelId?: string;
  googleTagId?: string;
  isEnabled: boolean;
}

export interface StoreSettings {
  subdomain: string;
  customDomain?: string;
  themeColor: string;
  shippingRate: number;
  freeShippingThreshold: number;
  taxRate: number;
  currency: Currency;
  isPublished: boolean;
  payoutBank?: string;
  payoutIban?: string;
  // Algerian & North African COD Ecosystem (dzbuild specs)
  activeCarrier?: 'yalidine' | 'zrexpress' | 'noest' | 'procolis';
  defaultDeliveryType?: 'home' | 'desk';
  enableFakeOrderShield?: boolean;
  enableLandingPageDirectBuy?: boolean;
  yalidineApiKey?: string;
  yalidineApiToken?: string;
  zrExpressKey?: string;
  facebookPixel?: string;
  tiktokPixel?: string;
}

export interface Store {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  slogan: string;
  sloganAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  categoryAr: string;
  ownerName: string;
  ownerEmail: string;
  plan: PlanType;
  accentColor: string;
  totalSales: number;
  ordersCount: number;
  settings: StoreSettings;
  createdAt: string;
  supabaseConnected: boolean;
  githubConnected: boolean;
}

export interface ProductColor {
  name: string;
  nameAr?: string;
  hex: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  costPrice?: number;
  compareAtPrice?: number;
  category: string;
  stock: number;
  sku: string;
  isPublished: boolean;
  imageUrl?: string;
  images?: string[]; // Up to 10 product images
  colors?: (string | ProductColor)[]; // Available color options
  isFeatured?: boolean;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  storeId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  wilayaCode?: string;
  wilayaName?: string;
  deliveryType?: 'home' | 'desk';
  items: OrderItem[];
  total: number;
  currency: Currency;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  callStatus?: 'pending_call' | 'confirmed' | 'no_answer_1' | 'no_answer_2' | 'switched_off' | 'cancelled';
  carrier?: string;
  paymentMethod: string;
  createdAt: string;
  trackingNumber: string;
  notes?: string;
  fraudRisk?: 'low' | 'medium' | 'high';
}

export interface Customer {
  id: string;
  storeId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  wilayaName?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  isVerified?: boolean;
}

export interface Coupon {
  id: string;
  storeId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  usageCount: number;
  isActive: boolean;
}

export interface SupabaseConfig {
  projectUrl: string;
  anonKey: string;
  isConnected: boolean;
  lastSyncTime?: string;
}

export interface GitHubConfig {
  repoUrl: string;
  branch: string;
  connected: boolean;
}

export interface PlatformFeatureItem {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: 'store' | 'marketing' | 'tech' | 'checkout';
  isEnabled: boolean; // Active vs Deactivated (مفعل أو معطل)
  isRemoved: boolean; // Deleted / Removed from UI (محذوف أو مستبعد)
}

export interface StoreFeatureItem {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: 'storefront' | 'checkout' | 'marketing' | 'customer';
  isEnabled: boolean; // مفعل أو معطل بنظام الزر
  isRemoved: boolean; // محذوف بنظام زر الحذف والاستعادة
  customValue?: string; // قيمة أو نص مخصص للخاصية (زر التعديل)
}

export type PlatformFeaturesMap = Record<string, boolean>;

// DZBuild Advanced Algerian COD Specs
export interface AbandonedCart {
  id: string;
  storeId: string;
  customerName: string;
  customerPhone: string;
  wilayaName: string;
  productName: string;
  total: number;
  createdAt: string;
  isRecovered: boolean;
  recoveryAttempts: number;
}

export interface LandingPageFunnel {
  id: string;
  storeId: string;
  productId: string;
  title: string;
  titleAr: string;
  language: 'darija' | 'ar' | 'fr';
  urgencyHeadline: string;
  bulletPoints: string[];
  dealOffers: {
    quantity: number;
    price: number;
    discountLabel: string;
    isBestValue?: boolean;
  }[];
  reviewsCount: number;
  averageRating: number;
  visitorCountLive: number;
  isPublished: boolean;
}
