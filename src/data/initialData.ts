import { PlanDetails, Store, Product, Order, SupabaseConfig, GitHubConfig, Currency } from '../types';

export const PLANS: PlanDetails[] = [
  {
    id: 'free',
    name: 'Starter Plan',
    nameAr: 'الخطة المجانية',
    price: 0,
    priceSar: 0,
    description: 'Perfect for launching your first online store with zero upfront cost.',
    descriptionAr: 'مثالية لإطلاق متجرك الإلكتروني الأول بدون أي تكاليف مسبقة.',
    maxProducts: 10,
    transactionFee: '2%',
    features: [
      'Up to 10 active products',
      'Free .avanto.store subdomain',
      'Full Merchant Dashboard',
      'Orders and inventory manager',
      'Standard SSL security',
      'Basic sales analytics'
    ],
    featuresAr: [
      'حتى 10 منتجات نشطة في المتجر',
      'نطاق فرعي مجاني yourstore.avanto.store',
      'لوحة تحكم كاملة لإدارة المتجر',
      'إدارة الطلبات والشحن والمخزون',
      'شهادة أمان وتشفير SSL مجانية',
      'تقارير المبيعات الأساسية'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Merchant Plan',
    nameAr: 'الخطة الاحترافية (المدفوعة)',
    price: 29,
    priceSar: 99,
    description: 'Advanced e-commerce infrastructure for scaling businesses.',
    descriptionAr: 'بنية تحتية متطورة للتجار الراغبين في التوسع بدون حدود.',
    maxProducts: -1, // Unlimited
    transactionFee: '0%',
    isPopular: true,
    features: [
      'Unlimited products & categories',
      '0% platform transaction fees',
      'Custom domain connection (e.g. mystore.com)',
      'Native Supabase & PostgreSQL sync',
      'GitHub repository & automated CI/CD deploy',
      'Priority 24/7 seller support',
      'Advanced conversion & analytics reports'
    ],
    featuresAr: [
      'عدد غير محدود من المنتجات والتصنيفات',
      '0% عمولة مبيعات للمنصة',
      'ربط دومين مخصص بك (مثال: mystore.com)',
      'مزامنة سحابية مباشرة مع Supabase و PostgreSQL',
      'ربط مستودع GitHub والنشر التلقائي',
      'دعم فني مخصص للتجار على مدار الساعة',
      'تقارير متقدمة للمبيعات وسلوك العملاء'
    ]
  }
];

export const INITIAL_STORE: Store = {
  id: 'store_demo_1',
  name: 'Luxe Craft Store',
  nameAr: 'متجر الحِرف الراقية',
  slug: 'luxe-craft',
  slogan: 'Curated artisanal watches and leather goods',
  sloganAr: 'ساعات فاخرة ومصنوعات جلدية مختارة بعناية',
  description: 'Online store built on AVANTO cloud commerce engine.',
  descriptionAr: 'متجر تجارة إلكترونية سحابي مدعوم بمنصة أفانتو.',
  category: 'Fashion & Luxury',
  categoryAr: 'أزياء وإكسسوارات فاخرة',
  ownerName: 'خالد المنصور',
  ownerEmail: 'khalid@domain.com',
  plan: 'pro',
  accentColor: '#6366F1',
  totalSales: 8450,
  ordersCount: 12,
  createdAt: '2026-10-18',
  supabaseConnected: true,
  githubConnected: true,
  settings: {
    subdomain: 'luxecraft.avanto.store',
    customDomain: 'www.luxecraft.sa',
    themeColor: '#6366F1',
    shippingRate: 25,
    freeShippingThreshold: 500,
    taxRate: 15,
    currency: 'SAR',
    isPublished: true
  }
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    storeId: 'store_demo_1',
    name: 'Titanium Automatic Chronometer Watch',
    nameAr: 'ساعة كرونوميتر أوتوماتيكية من التيتانيوم',
    description: 'Handcrafted titanium case with 72-hour power reserve and sapphire glass.',
    descriptionAr: 'هيكل تيتانيوم مصقول يدوياً مع احتياطي طاقة 72 ساعة وزجاج سفير مقاوم للخدش.',
    price: 1850,
    category: 'Watches',
    stock: 8,
    sku: 'LXC-WTCH-01',
    isPublished: true
  },
  {
    id: 'prod_2',
    storeId: 'store_demo_1',
    name: 'Cognac Full-Grain Leather Travel Bag',
    nameAr: 'حقيبة سفر من الجلد الطبيعي بلون الكونياك',
    description: 'Full-grain vegetable-tanned leather handcrafted with solid brass hardware.',
    descriptionAr: 'جلد طبيعي مدبوغ نباتياً ومصنوع يدوياً مع إكسسوارات من النحاس الصلب.',
    price: 680,
    category: 'Leather Goods',
    stock: 14,
    sku: 'LXC-BAG-02',
    isPublished: true
  },
  {
    id: 'prod_3',
    storeId: 'store_demo_1',
    name: 'Royal Amber & Rare Cambodian Oud Extrait',
    nameAr: 'عطر العنبر الملكي وخلاصة العود الكمبودي',
    description: 'Pure 35% extrait concentration with wild resins and aged woods.',
    descriptionAr: 'تركيز نقي 35% بخلاصة الراتنجات الطبيعية وخشب العود المعتق.',
    price: 420,
    category: 'Fragrance',
    stock: 22,
    sku: 'LXC-OUD-03',
    isPublished: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_101',
    orderNumber: 'AVT-2026-9041',
    storeId: 'store_demo_1',
    customerName: 'فيصل العتيبي',
    customerEmail: 'faisal@domain.sa',
    customerPhone: '+966 50 111 2233',
    customerCity: 'الرياض',
    customerAddress: 'حي الياسمين، شارع أنس بن مالك',
    items: [
      { id: 'item_1', product: INITIAL_PRODUCTS[0], quantity: 1 }
    ],
    total: 1850,
    currency: 'SAR',
    status: 'processing',
    paymentMethod: 'مدى / Mada',
    createdAt: '2026-10-18T14:30:00Z',
    trackingNumber: 'AVT-EXP-99201'
  },
  {
    id: 'ord_102',
    orderNumber: 'AVT-2026-9040',
    storeId: 'store_demo_1',
    customerName: 'نورة الشمري',
    customerEmail: 'noura@domain.sa',
    customerPhone: '+966 55 999 8877',
    customerCity: 'الدمام',
    customerAddress: 'حي الشاطئ، برج البحر',
    items: [
      { id: 'item_2', product: INITIAL_PRODUCTS[2], quantity: 2 }
    ],
    total: 840,
    currency: 'SAR',
    status: 'delivered',
    paymentMethod: 'Apple Pay',
    createdAt: '2026-10-17T09:15:00Z',
    trackingNumber: 'AVT-EXP-99184'
  }
];

export const INITIAL_SUPABASE_CONFIG: SupabaseConfig = {
  projectUrl: 'https://avanto-stores.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2YW50by1zdG9yZXMiLCJyb2xlIjoiYW5vbiJ9.token_sample',
  isConnected: true,
  lastSyncTime: '2026-10-18T21:00:00Z'
};

export const INITIAL_GITHUB_CONFIG: GitHubConfig = {
  repoUrl: 'https://github.com/avanto-commerce/avanto-store-template',
  branch: 'main',
  connected: true
};

export const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; symbolAr: string }> = {
  SAR: { rate: 1, symbol: 'SAR', symbolAr: 'ر.س' },
  USD: { rate: 0.27, symbol: '$', symbolAr: '$' },
  AED: { rate: 0.98, symbol: 'AED', symbolAr: 'د.إ' },
  EUR: { rate: 0.25, symbol: '€', symbolAr: '€' }
};
