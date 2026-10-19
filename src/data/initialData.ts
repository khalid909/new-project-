import { 
  PlanDetails, Store, Product, Order, Customer, Coupon, 
  SellerUser, SupabaseConfig, GitHubConfig, Currency, PlatformFeatureItem, StoreFeatureItem 
} from '../types';

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
      'Coupons & promotional marketing engine',
      'Native Supabase & PostgreSQL sync',
      'GitHub repository & automated CI/CD deploy',
      'Priority 24/7 seller support',
      'Advanced conversion & analytics reports'
    ],
    featuresAr: [
      'عدد غير محدود من المنتجات والتصنيفات',
      '0% عمولة مبيعات للمنصة',
      'ربط دومين مخصص بك (مثال: mystore.com)',
      'محرك الكوبونات والعروض التسويقية المتقدمة',
      'مزامنة سحابية مباشرة مع Supabase و PostgreSQL',
      'ربط مستودع GitHub والنشر التلقائي',
      'دعم فني مخصص للتجار على مدار الساعة',
      'تقارير متقدمة للمبيعات وسلوك العملاء'
    ]
  }
];

export const INITIAL_SELLER_USER: SellerUser = {
  id: 'usr_seller_1',
  name: 'خالد المنصور',
  email: 'khalid@domain.com',
  storeId: 'store_demo_1'
};

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
  totalSales: 12450,
  ordersCount: 16,
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
    isPublished: true,
    payoutBank: 'مصرف الراجحي (Al Rajhi Bank)',
    payoutIban: 'SA4480000456608010123456'
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
    costPrice: 750,
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
    costPrice: 280,
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
    costPrice: 110,
    category: 'Fragrance',
    stock: 22,
    sku: 'LXC-OUD-03',
    isPublished: true
  },
  {
    id: 'prod_4',
    storeId: 'store_demo_1',
    name: 'Minimalist Italian Calfskin Wallet',
    nameAr: 'محفظة جيب من جلد العجل الإيطالي الفاخر',
    description: 'Ultra-slim RFID protected minimalist bi-fold leather wallet.',
    descriptionAr: 'محفظة جلدية نحيفة للغاية بحماية RFID تتسع لـ 8 بطاقات مع جيب نقود.',
    price: 240,
    costPrice: 75,
    category: 'Accessories',
    stock: 35,
    sku: 'LXC-WLT-04',
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
    trackingNumber: 'AVT-EXP-99201',
    notes: 'توصيل مسائي مع فحص الشحنة'
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
  },
  {
    id: 'ord_103',
    orderNumber: 'AVT-2026-9039',
    storeId: 'store_demo_1',
    customerName: 'سلطان بن فهد',
    customerEmail: 'sultan.f@domain.sa',
    customerPhone: '+966 54 333 4455',
    customerCity: 'جدة',
    customerAddress: 'طريق الملك عبد العزيز، أبراج الشاطئ',
    items: [
      { id: 'item_3', product: INITIAL_PRODUCTS[1], quantity: 1 }
    ],
    total: 705,
    currency: 'SAR',
    status: 'shipped',
    paymentMethod: 'بطاقة ائتمان / Credit Card',
    createdAt: '2026-10-16T11:00:00Z',
    trackingNumber: 'AVT-EXP-99160'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    storeId: 'store_demo_1',
    name: 'فيصل العتيبي',
    email: 'faisal@domain.sa',
    phone: '+966 50 111 2233',
    city: 'الرياض',
    totalOrders: 4,
    totalSpent: 4250,
    lastOrderDate: '2026-10-18'
  },
  {
    id: 'cust_2',
    storeId: 'store_demo_1',
    name: 'نورة الشمري',
    email: 'noura@domain.sa',
    phone: '+966 55 999 8877',
    city: 'الدمام',
    totalOrders: 3,
    totalSpent: 2100,
    lastOrderDate: '2026-10-17'
  },
  {
    id: 'cust_3',
    storeId: 'store_demo_1',
    name: 'سلطان بن فهد',
    email: 'sultan.f@domain.sa',
    phone: '+966 54 333 4455',
    city: 'جدة',
    totalOrders: 2,
    totalSpent: 1385,
    lastOrderDate: '2026-10-16'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn_1',
    storeId: 'store_demo_1',
    code: 'WELCOME15',
    discountType: 'percentage',
    value: 15,
    minOrder: 300,
    usageCount: 28,
    isActive: true
  },
  {
    id: 'cpn_2',
    storeId: 'store_demo_1',
    code: 'VIP50',
    discountType: 'fixed',
    value: 50,
    minOrder: 500,
    usageCount: 14,
    isActive: true
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

export const INITIAL_PLATFORM_FEATURES: PlatformFeatureItem[] = [
  {
    id: 'coupons',
    name: 'Coupons & Promo Codes',
    nameAr: 'نظام الكوبونات والخصومات',
    description: 'Allow merchants to create, activate, and manage percentage and fixed discount codes.',
    descriptionAr: 'تمكين التجار من إنشاء وإدارة أكواد التخفيض والعروض الترويجية لزيادة المبيعات.',
    category: 'marketing',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'customersCRM',
    name: 'Customer Directory CRM',
    nameAr: 'إدارة وسجل العملاء',
    description: 'Track customer profiles, contact numbers, order counts, and lifetime purchase values.',
    descriptionAr: 'عرض وتتبع بيانات الزبائن ومشترياتهم السابقة وتكرار الطلب في المتجر.',
    category: 'store',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'onlinePayments',
    name: 'Online Payment Gateways (Mada & Apple Pay)',
    nameAr: 'بوابات الدفع الإلكتروني (مدى و Apple Pay)',
    description: 'Enable digital payments via Mada, Apple Pay, and credit cards during checkout.',
    descriptionAr: 'تفعيل الدفع الإلكتروني المباشر بمدى و Apple Pay والبطاقات البنكية عند الشراء.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'invoicing',
    name: 'Official Tax Invoicing',
    nameAr: 'طباعة الفواتير الضريبية',
    description: 'Generate and print detailed PDF/paper commercial invoices for fulfilled orders.',
    descriptionAr: 'إصدار وطباعة الفواتير الرسمية وبوالص الطلبات لزبائن المتجر بضغطة زر.',
    category: 'store',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'developerIntegrations',
    name: 'Supabase & GitHub Developer Hub',
    nameAr: 'تكامل Supabase و GitHub للمطورين',
    description: 'Direct SQL schema export, live database sync, and repository branch management.',
    descriptionAr: 'الربط المباشر لقواعد البيانات وتصدير كود SQL ومزامنة مستودع GitHub.',
    category: 'tech',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'plansAndUpgrades',
    name: 'Pro Subscription & Upgrades',
    nameAr: 'ترقية الباقات والاشتراكات',
    description: 'Allow merchants to switch between the Free Starter tier and the Pro Growth tier.',
    descriptionAr: 'إتاحة التبديل والترقية بين الخطة المجانية والخطة الاحترافية للتجار.',
    category: 'marketing',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'multiCurrency',
    name: 'Multi-Currency Selector (SAR, USD, AED, EUR)',
    nameAr: 'محدد وتعدد العملات',
    description: 'Provide live conversion between Saudi Riyal, US Dollar, UAE Dirham, and Euro.',
    descriptionAr: 'إتاحة التسعير والتحويل بين الريال السعودي والدولار والدرهم الإماراتي واليورو.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'shippingSettings',
    name: 'Automated Shipping Engine',
    nameAr: 'إعدادات الشحن والتوصيل التلقائي',
    description: 'Customize flat shipping rates and automated free delivery thresholds.',
    descriptionAr: 'التحكم بتكلفة الشحن الثابتة وسياسات الشحن المجاني التلقائي للطلبات.',
    category: 'store',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'demoLogin',
    name: '1-Click Quick Demo Login',
    nameAr: 'زر الدخول التجريبي السريع',
    description: 'Instant one-tap login for testing merchant dashboard without typing credentials.',
    descriptionAr: 'إتاحة تسجيل الدخول الفوري للتاجر التجريبي بنقرة واحدة لتجربة المنصة فوراً.',
    category: 'tech',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'stockAdjuster',
    name: 'Quick Stock Stepper (+ / -)',
    nameAr: 'التعديل السريع لكميات المخزون (+ / -)',
    description: 'Instant plus/minus buttons to adjust available inventory units directly from tables.',
    descriptionAr: 'أزرار الزيادة والنقصان الفورية لكميات المنتجات مباشرة من جدول المخزون.',
    category: 'store',
    isEnabled: true,
    isRemoved: false
  }
];

export const INITIAL_STORE_FEATURES: StoreFeatureItem[] = [
  {
    id: 'storeSearch',
    name: 'Live Product Search Bar',
    nameAr: 'شريط البحث المباشر في منتجات المتجر',
    description: 'Enables instant live filtering of products by keyword in the storefront.',
    descriptionAr: 'يتيح للزبائن البحث الفوري والفلترة بالاسم والتفاصيل داخل المتجر.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'cartAndCheckout',
    name: 'Customer Cart & Instant Checkout Drawer',
    nameAr: 'سلة المشتريات وإتمام الطلب للزبائن',
    description: 'Floating cart button, item counters, address collection, and checkout workflow.',
    descriptionAr: 'زر السلة العائم، عداد المنتجات، وتجميع عنوان الشحن وإتمام الشراء.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'discountCoupons',
    name: 'Discount Coupon Applicator',
    nameAr: 'كوبونات وقسائم الخصم في السلة',
    description: 'Input box in checkout allowing customers to apply promotional codes.',
    descriptionAr: 'حقل إدخال أكواد الخصم الترويجية لحساب التخفيضات بالسلة.',
    category: 'marketing',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'customerReviews',
    name: 'Customer Reviews & Star Ratings',
    nameAr: 'تقييمات ومراجعات الزبائن (النجوم)',
    description: 'Display 4.9-star ratings and customer trust reviews on product cards.',
    descriptionAr: 'إظهار النجوم الذهبية وتجارب الزبائن الموثوقة على بطاقات المنتجات.',
    category: 'customer',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'topAnnouncement',
    name: 'Top Store Promotional Announcement Bar',
    nameAr: 'شريط الإعلانات الترويجي العلوي في المتجر',
    description: 'Sticky announcement banner highlighting discounts, store guarantees, and updates.',
    descriptionAr: 'شريط ملون بأعلى المتجر يبرز العروض الحصرية وضمانات المتجر.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'orderTracking',
    name: 'Customer Order Tracking System',
    nameAr: 'نظام تتبع حالة الطلبات والشحنات',
    description: 'Interactive tracking modal for customers to query live fulfillment status.',
    descriptionAr: 'نافذة تتبع فورية للزبائن للتحقق من خط سير وتجهيز شحناتهم.',
    category: 'customer',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'shippingThreshold',
    name: 'Free Shipping Incentive Indicator',
    nameAr: 'حافز الشحن المجاني التلقائي',
    description: 'Automatic free shipping calculation when cart reaches the threshold.',
    descriptionAr: 'حساب وتطبيق الشحن المجاني التلقائي عندما يتجاوز الطلب الحد الأدنى.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'onlinePayments',
    name: 'Digital Payment Gateways (Mada & Apple Pay)',
    nameAr: 'بوابات الدفع الإلكتروني (مدى و Apple Pay)',
    description: 'Accept instant payments via Apple Pay, Mada, and bank cards.',
    descriptionAr: 'قبول الدفع الرقمي الفوري عبر بطاقات مدى و Apple Pay والفيزا.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'cashOnDelivery',
    name: 'Cash on Delivery (COD)',
    nameAr: 'خيار الدفع عند الاستلام',
    description: 'Allow customers to pay cash directly upon receiving the package.',
    descriptionAr: 'إتاحة خيار دفع المبلغ نقداً لشركة الشحن عند تسليم الطرد للزبون.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'stockIndicator',
    name: 'Remaining Stock Counter Badge',
    nameAr: 'عرض كمية المخزون المتبقية على المنتجات',
    description: 'Displays remaining stock badge (e.g. 5 in stock) to drive urgency.',
    descriptionAr: 'إظهار عدد القطع المتبقية بالمنتج لخلق دافع الشراء السريع.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'quickView',
    name: 'Product Quick View Modal',
    nameAr: 'المعاينة السريعة للمنتج (Quick View)',
    description: 'Popup preview modal allowing customers to inspect product details without leaving.',
    descriptionAr: 'نافذة عرض تفاصيل المنتج السريعة والصور بضغطة زر دون مغادرة الصفحة.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'returnGuarantee',
    name: '14-Day Return Guarantee Badge',
    nameAr: 'شارة ضمان الاسترجاع والاستبدال 14 يوماً',
    description: 'Displays easy return & buyer protection guarantees on the storefront.',
    descriptionAr: 'إبراز شارة سياسة الاسترجاع السهلة لتعزيز ثقة المشتري.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'invoicePrinting',
    name: 'Commercial Invoice Printing',
    nameAr: 'إصدار وطباعة الفاتورة التجارية للزبائن',
    description: 'Printable receipt and order confirmation slip upon placing the order.',
    descriptionAr: 'إصدار وطباعة فاتورة الشراء التفصيلية بعد إتمام الطلب مباشرة.',
    category: 'customer',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'buyerCurrency',
    name: 'Buyer Currency Selector',
    nameAr: 'مبدّل عملة الشراء للزبائن (SAR, USD, AED, EUR)',
    description: 'Allows international customers to view prices in their preferred currency.',
    descriptionAr: 'تمكين الزبائن من تحويل أسعار المتجر لعملتهم المفضلة.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'storeFooterLinks',
    name: 'Store Legal & Policy Footer',
    nameAr: 'روابط السياسات والرقم الضريبي بأسفل المتجر',
    description: 'Displays return policy, terms, privacy, tax registration, and support contact.',
    descriptionAr: 'عرض الرقم الضريبي، سياسة الخصوصية، وشروط الاسترجاع بأسفل صفحة المتجر.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'shippingFlat',
    name: 'Flat Rate Delivery Calculation',
    nameAr: 'تكلفة الشحن الثابتة للطلبات',
    description: 'Applies standard flat shipping fee at checkout when free shipping threshold is not met.',
    descriptionAr: 'حساب وإضافة تكلفة التوصيل الثابتة عند إتمام الطلب في حال لم يبلغ الحد الأدنى.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'taxCalculation',
    name: 'VAT / Tax Calculation (15%)',
    nameAr: 'حساب ضريبة القيمة المضافة (15%)',
    description: 'Calculates and displays official VAT breakdown on the shopping cart and checkout invoice.',
    descriptionAr: 'حساب وتفصيل نسبة ضريبة القيمة المضافة في ملخص سلة الشراء والفاتورة.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'bankPayouts',
    name: 'Bank IBAN Account Payouts',
    nameAr: 'الحساب البنكي ورقم الآيبان (IBAN)',
    description: 'Direct IBAN account configuration for merchant revenue payouts and bank deposits.',
    descriptionAr: 'تفعيل إعدادات الحساب البنكي والآيبان لإيداع إيرادات مبيعات المتجر.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'whatsappChat',
    name: 'WhatsApp Direct Customer Support Button',
    nameAr: 'زر محادثة الواتساب المباشرة للزبائن',
    description: 'Floating WhatsApp quick action button enabling shoppers to chat directly with store support.',
    descriptionAr: 'زر واتساب عائم يتيح لزبائن المتجر بدء محادثة فورية مع خدمة العملاء.',
    category: 'customer',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'maintenanceMode',
    name: 'Store Maintenance Mode',
    nameAr: 'وضع الصيانة المؤقت للمتجر',
    description: 'Temporarily pauses storefront sales with a friendly maintenance banner while updating inventory.',
    descriptionAr: 'إيقاف استقبال طلبات الشراء مؤقتاً وعرض لافتة تحديث المخزون للزبائن.',
    category: 'storefront',
    isEnabled: false, // Default disabled (store is active)
    isRemoved: false
  },
  {
    id: 'welcomeDiscount',
    name: 'New Shopper Welcome Discount Card',
    nameAr: 'بطاقة الخصم الترحيبي للزبائن الجدد',
    description: 'Displays a prominent promo box in the store hero offering coupon code WELCOME10.',
    descriptionAr: 'إظهار بطاقة كود الخصم الترحيبي (WELCOME10) ببانر المتجر لجذب الزوار.',
    category: 'marketing',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'instantOrderSms',
    name: 'Instant Order Confirmation & Receipt',
    nameAr: 'إشعار تأكيد الطلب الفوري وتفاصيل الشحنة',
    description: 'Instant on-screen invoice summary and SMS receipt alert after completing payment.',
    descriptionAr: 'إظهار شاشة تأكيد فورية للطلب مع رقم التتبع وتفاصيل الشحن والفاتورة.',
    category: 'customer',
    isEnabled: true,
    isRemoved: false
  }
];


