export type Currency = 'SAR' | 'USD' | 'AED' | 'EUR';
export type Language = 'ar' | 'en';
export type PlanType = 'free' | 'pro';

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
  price: number;
  priceSar: number;
  description: string;
  descriptionAr: string;
  features: string[];
  featuresAr: string[];
  maxProducts: number;
  transactionFee: string;
  isPopular?: boolean;
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

export interface Product {
  id: string;
  storeId: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  costPrice?: number;
  category: string;
  stock: number;
  sku: string;
  isPublished: boolean;
  imageUrl?: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
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
  items: OrderItem[];
  total: number;
  currency: Currency;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: string;
  createdAt: string;
  trackingNumber: string;
  notes?: string;
}

export interface Customer {
  id: string;
  storeId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
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
