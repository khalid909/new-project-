export type Currency = 'SAR' | 'USD' | 'AED' | 'EUR';
export type Language = 'ar' | 'en';

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
  rating: number;
  totalSales: number;
  verified: boolean;
  accentColor: string;
  badge: string;
  badgeAr: string;
  inventoryCount: number;
  joinedYear: number;
  supabaseConnected: boolean;
}

export interface ProductVariant {
  name: string;
  nameAr: string;
  options: string[];
}

export interface Product {
  id: string;
  storeId: string;
  storeName: string;
  storeNameAr: string;
  name: string;
  nameAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  category: 'watches' | 'interiors' | 'fragrance' | 'leather' | 'audio' | 'lifestyle';
  categoryAr: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured: boolean;
  sku: string;
  tags: string[];
  specs: { label: string; labelAr: string; value: string; valueAr: string }[];
  variants?: ProductVariant[];
  visualGradient: string;
  accentBadge?: string;
  accentBadgeAr?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  currency: Currency;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: 'apple_pay' | 'credit_card' | 'mada' | 'cash_on_delivery';
  createdAt: string;
  storeId: string;
  trackingNumber: string;
  notes?: string;
}

export interface SupabaseConfig {
  projectUrl: string;
  anonKey: string;
  isConnected: boolean;
  lastSyncTime?: string;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  tablesSynced: {
    stores: number;
    products: number;
    orders: number;
    customers: number;
  };
}

export interface GitHubConfig {
  repoUrl: string;
  branch: string;
  lastCommitHash: string;
  lastCommitMessage: string;
  autoDeployEnabled: boolean;
  connected: boolean;
}
