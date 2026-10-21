import { 
  PlanDetails, Store, Product, Order, Customer, Coupon, 
  SellerUser, SupabaseConfig, GitHubConfig, Currency, 
  PlatformFeatureItem, StoreFeatureItem, WilayaDeliveryRate, CarrierConfig,
  AbandonedCart, LandingPageFunnel
} from '../types';

export const ALGERIA_58_WILAYAS: WilayaDeliveryRate[] = [
  { code: '01', name: 'Adrar', nameAr: 'أدرار', homePrice: 900, deskPrice: 600, isAvailable: true },
  { code: '02', name: 'Chlef', nameAr: 'الشلف', homePrice: 600, deskPrice: 400, isAvailable: true },
  { code: '03', name: 'Laghouat', nameAr: 'الأغواط', homePrice: 750, deskPrice: 500, isAvailable: true },
  { code: '04', name: 'Oum El Bouaghi', nameAr: 'أم البواقي', homePrice: 650, deskPrice: 450, isAvailable: true },
  { code: '05', name: 'Batna', nameAr: 'باتنة', homePrice: 650, deskPrice: 400, isAvailable: true },
  { code: '06', name: 'Béjaïa', nameAr: 'بجاية', homePrice: 650, deskPrice: 450, isAvailable: true },
  { code: '07', name: 'Biskra', nameAr: 'بسكرة', homePrice: 700, deskPrice: 450, isAvailable: true },
  { code: '08', name: 'Béchar', nameAr: 'بشار', homePrice: 900, deskPrice: 600, isAvailable: true },
  { code: '09', name: 'Blida', nameAr: 'البليدة', homePrice: 500, deskPrice: 350, isAvailable: true },
  { code: '10', name: 'Bouira', nameAr: 'البويرة', homePrice: 600, deskPrice: 400, isAvailable: true },
  { code: '11', name: 'Tamanrasset', nameAr: 'تمنراست', homePrice: 1200, deskPrice: 850, isAvailable: true },
  { code: '12', name: 'Tébessa', nameAr: 'تبسة', homePrice: 700, deskPrice: 450, isAvailable: true },
  { code: '13', name: 'Tlemcen', nameAr: 'تلمسان', homePrice: 650, deskPrice: 450, isAvailable: true },
  { code: '14', name: 'Tiaret', nameAr: 'تيارت', homePrice: 700, deskPrice: 450, isAvailable: true },
  { code: '15', name: 'Tizi Ouzou', nameAr: 'تيزي وزو', homePrice: 600, deskPrice: 400, isAvailable: true },
  { code: '16', name: 'Alger', nameAr: 'الجزائر العاصمة', homePrice: 450, deskPrice: 300, isAvailable: true },
  { code: '17', name: 'Djelfa', nameAr: 'الجلفة', homePrice: 750, deskPrice: 500, isAvailable: true },
  { code: '18', name: 'Jijel', nameAr: 'جيجل', homePrice: 650, deskPrice: 450, isAvailable: true },
  { code: '19', name: 'Sétif', nameAr: 'سطيف', homePrice: 600, deskPrice: 400, isAvailable: true },
  { code: '20', name: 'Saïda', nameAr: 'سعيدة', homePrice: 750, deskPrice: 500, isAvailable: true },
  { code: '21', name: 'Skikda', nameAr: 'سكيكدة', homePrice: 650, deskPrice: 450, isAvailable: true },
  { code: '22', name: 'Sidi Bel Abbès', nameAr: 'سيدي بلعباس', homePrice: 650, deskPrice: 450, isAvailable: true },
  { code: '23', name: 'Annaba', nameAr: 'عنابة', homePrice: 650, deskPrice: 450, isAvailable: true },
  { code: '24', name: 'Guelma', nameAr: 'قالمة', homePrice: 700, deskPrice: 450, isAvailable: true },
  { code: '25', name: 'Constantine', nameAr: 'قسنطينة', homePrice: 600, deskPrice: 400, isAvailable: true },
  { code: '26', name: 'Médéa', nameAr: 'المدية', homePrice: 600, deskPrice: 400, isAvailable: true },
  { code: '27', name: 'Mostaganem', nameAr: 'مستغانم', homePrice: 650, deskPrice: 450, isAvailable: true },
  { code: '28', name: "M'Sila", nameAr: 'المسيلة', homePrice: 700, deskPrice: 450, isAvailable: true },
  { code: '29', name: 'Mascara', nameAr: 'معسكر', homePrice: 650, deskPrice: 450, isAvailable: true },
  { code: '30', name: 'Ouargla', nameAr: 'ورقلة', homePrice: 850, deskPrice: 600, isAvailable: true },
  { code: '31', name: 'Oran', nameAr: 'وهران', homePrice: 550, deskPrice: 350, isAvailable: true },
  { code: '32', name: 'El Bayadh', nameAr: 'البيض', homePrice: 850, deskPrice: 600, isAvailable: true },
  { code: '33', name: 'Illizi', nameAr: 'إليزي', homePrice: 1200, deskPrice: 850, isAvailable: true },
  { code: '34', name: 'Bordj Bou Arréridj', nameAr: 'برج بوعريريج', homePrice: 600, deskPrice: 400, isAvailable: true },
  { code: '35', name: 'Boumerdès', nameAr: 'بومرداس', homePrice: 500, deskPrice: 350, isAvailable: true },
  { code: '36', name: 'El Tarf', nameAr: 'الطارف', homePrice: 750, deskPrice: 500, isAvailable: true },
  { code: '37', name: 'Tindouf', nameAr: 'تندوف', homePrice: 1300, deskPrice: 900, isAvailable: true },
  { code: '38', name: 'Tissemsilt', nameAr: 'تيسمسيلت', homePrice: 750, deskPrice: 500, isAvailable: true },
  { code: '39', name: 'El Oued', nameAr: 'الوادي', homePrice: 800, deskPrice: 550, isAvailable: true },
  { code: '40', name: 'Khenchela', nameAr: 'خنشلة', homePrice: 750, deskPrice: 500, isAvailable: true },
  { code: '41', name: 'Souk Ahras', nameAr: 'سوق أهراس', homePrice: 750, deskPrice: 500, isAvailable: true },
  { code: '42', name: 'Tipaza', nameAr: 'تيبازة', homePrice: 500, deskPrice: 350, isAvailable: true },
  { code: '43', name: 'Mila', nameAr: 'ميلة', homePrice: 650, deskPrice: 450, isAvailable: true },
  { code: '44', name: 'Aïn Defla', nameAr: 'عين الدفلى', homePrice: 600, deskPrice: 400, isAvailable: true },
  { code: '45', name: 'Naâma', nameAr: 'النعامة', homePrice: 850, deskPrice: 600, isAvailable: true },
  { code: '46', name: 'Aïn Témouchent', nameAr: 'عين تموشنت', homePrice: 650, deskPrice: 450, isAvailable: true },
  { code: '47', name: 'Ghardaïa', nameAr: 'غرداية', homePrice: 800, deskPrice: 550, isAvailable: true },
  { code: '48', name: 'Relizane', nameAr: 'غليزان', homePrice: 650, deskPrice: 450, isAvailable: true },
  { code: '49', name: 'Timimoun', nameAr: 'تيميمون', homePrice: 950, deskPrice: 650, isAvailable: true },
  { code: '50', name: 'Bordj Badji Mokhtar', nameAr: 'برج باجي مختار', homePrice: 1400, deskPrice: 950, isAvailable: true },
  { code: '51', name: 'Ouled Djellal', nameAr: 'أولاد جلال', homePrice: 750, deskPrice: 500, isAvailable: true },
  { code: '52', name: 'Béni Abbès', nameAr: 'بني عباس', homePrice: 950, deskPrice: 650, isAvailable: true },
  { code: '53', name: 'In Salah', nameAr: 'عين صالح', homePrice: 1100, deskPrice: 800, isAvailable: true },
  { code: '54', name: 'In Guezzam', nameAr: 'عين قزام', homePrice: 1400, deskPrice: 950, isAvailable: true },
  { code: '55', name: 'Touggourt', nameAr: 'توقرت', homePrice: 800, deskPrice: 550, isAvailable: true },
  { code: '56', name: 'Djanet', nameAr: 'جانت', homePrice: 1400, deskPrice: 950, isAvailable: true },
  { code: '57', name: "El M'Ghair", nameAr: 'المغير', homePrice: 800, deskPrice: 550, isAvailable: true },
  { code: '58', name: 'El Meniaa', nameAr: 'المنيعة', homePrice: 850, deskPrice: 600, isAvailable: true }
];

export const ALGERIA_CARRIERS: CarrierConfig[] = [
  { id: 'yalidine', name: 'Yalidine Delivery', nameAr: 'ياليدين للتوصيل السريع (Yalidine)', isEnabled: true, defaultDeliveryType: 'home' },
  { id: 'zrexpress', name: 'ZR Express', nameAr: 'زد آر إكسبريس (ZR Express)', isEnabled: true, defaultDeliveryType: 'home' },
  { id: 'noest', name: 'NOEST Delivery', nameAr: 'نوست دليفري (NOEST)', isEnabled: true, defaultDeliveryType: 'desk' },
  { id: 'maystro', name: 'Maystro Delivery', nameAr: 'مايسترو دليفري (Maystro)', isEnabled: true, defaultDeliveryType: 'home' },
  { id: 'procolis', name: 'Procolis Express', nameAr: 'بروكولي إكسبريس (Procolis)', isEnabled: true, defaultDeliveryType: 'home' }
];

export const PLANS: PlanDetails[] = [
  {
    id: 'free',
    name: 'Free Forever Plan',
    nameAr: 'الخطة المجانية الشاملة (0 د.ج مدى الحياة)',
    price: 0,
    priceSar: 0,
    description: '100% Free forever with no subscriptions, no credit card, and 0% commission.',
    descriptionAr: 'مجانية 100% مدى الحياة بدون أي اشتراكات شهرية، بدون بطاقة بنكية، وبـ 0% عمولة على المبيعات.',
    maxProducts: -1,
    transactionFee: '0%',
    isPopular: true,
    features: [
      '100% Free Forever - No subscriptions needed',
      'Unlimited products & unlimited orders',
      '0% sales commission',
      'Free yourstore.wasladz.app subdomain + custom domain support',
      'All 58 Algerian Wilayas delivery engine with Yalidine & ZR Express',
      'Instant Cash on Delivery (COD) 1-click checkout',
      '3-in-1 Homepage Control: Toggle, Edit & Delete all sections live',
      'WhatsApp direct support and order notifications'
    ],
    featuresAr: [
      'مجانية 100% مدى الحياة بدون أي اشتراكات أو رسوم',
      'عدد منتجات غير محدود وطلبات غير محدودة',
      '0% عمولة على كافة المبيعات والأرباح لك بالكامل',
      'نطاق فرعي مجاني مع دعم ربط النطاقات الخاصة',
      'نظام شحن الـ 58 ولاية كامل مع ياليدين وزد آر إكسبريس',
      'نموذج الدفع عند الاستلام (COD) بنقرة واحدة سريعة',
      'نظام التحكم الثلاثي بالصفحة الرئيسية: زر تفعيل، زر تعديل، وزر حذف',
      'زر دعم ومحادثة واتساب مدمج مع تتبع الطلبات'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Unlocked (Free)',
    nameAr: 'الباقة المتقدمة غير المحدودة (مجاناً 0 د.ج)',
    price: 0,
    priceSar: 0,
    description: 'All advanced features unlocked for all merchants at 0 DZD cost.',
    descriptionAr: 'جميع الخصائص المتقدمة مفتوحة مجاناً لكافة التجار بدون أي رسوم اشتراك.',
    maxProducts: -1,
    transactionFee: '0%',
    isPopular: false,
    features: [
      'All Pro features included at 0 DZD',
      'Unlimited orders & unlimited stores',
      'AI-Powered Landing Page builder',
      'Smart Anti-Fraud & Phone Verification Shield',
      'Multi-Pixel Engine (Meta, TikTok, Snapchat, Google)',
      'Automated thermal waybill printing'
    ],
    featuresAr: [
      'جميع ميزات Pro مشمولة مجاناً بـ 0 د.ج',
      'طلبات غير محدودة ومتاجر متعددة',
      'منشئ صفحات الهبوط السريعة بالذكاء الاصطناعي',
      'نظام فحص وتصفية الطلبات الوهمية وأرقام الهواتف',
      'ربط بكسلات التتبع (Facebook, TikTok, Snapchat, Google)',
      'طباعة بوالص الشحن الحرارية (Bordereau) بالباركود'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Unlocked (Free)',
    nameAr: 'باقة الشركات والفرق (مجاناً 0 د.ج)',
    price: 0,
    priceSar: 0,
    description: 'Call centers, staff accounts and API integrations at 0 DZD.',
    descriptionAr: 'حسابات موظفي الكول سنتر وواجهات API مفتوحة مجاناً لجميع المستخدمين.',
    maxProducts: -1,
    transactionFee: '0%',
    features: [
      'Multi-staff & call-center team accounts included free',
      'Multi-carrier automated routing & bulk waybills',
      'Unlimited landing pages & custom stores',
      'Developer REST API & Webhooks'
    ],
    featuresAr: [
      'حسابات موظفي الكول سنتر وفريق العمل مجانية',
      'توجيه الشحنات الذكي وطباعة البوالص بالجملة',
      'عدد غير محدود من صفحات الهبوط والمتاجر',
      'بوابة المطورين وواجهة API متقدمة مع Webhooks'
    ]
  }
];

export const INITIAL_SELLER_USER: SellerUser = {
  id: 'usr_seller_1',
  name: 'كريم بلحاج',
  email: 'karim.belhadj@wasladz.com',
  storeId: 'store_demo_1'
};

export const INITIAL_STORE: Store = {
  id: 'store_demo_1',
  name: 'Elegance DZ Store',
  nameAr: 'متجر إليغانس ديزاد',
  slug: 'elegance-dz',
  slogan: 'Leading Algerian COD store with 69 wilayas fast delivery',
  sloganAr: 'المتجر الإلكتروني الرائد في الجزائر - توصيل سريع ودفع عند الاستلام لكافة الـ 69 ولاية',
  description: 'Online store built on WASLADZ commerce engine.',
  descriptionAr: 'متجر سحابي مستقل مدعوم بمنصة وصلة ديزاد (WaslaDZ).',
  category: 'Fashion & Tech',
  categoryAr: 'أزياء وإلكترونيات وساعات',
  ownerName: 'كريم بلحاج',
  ownerEmail: 'karim.belhadj@wasladz.com',
  ownerPhone: '0550 12 34 56',
  wilaya: 'الجزائر العاصمة',
  wilayaCode: '16',
  status: 'active',
  plan: 'pro',
  accentColor: '#059669',
  totalSales: 485000,
  ordersCount: 94,
  productsCount: 18,
  createdAt: '2026-10-18',
  supabaseConnected: true,
  githubConnected: true,
  settings: {
    subdomain: 'elegance-dz.wasladz.app',
    customDomain: 'www.elegance-dz.store',
    themeColor: '#059669',
    shippingRate: 450,
    freeShippingThreshold: 8000,
    taxRate: 0,
    currency: 'DZD',
    isPublished: true,
    payoutBank: 'بريد الجزائر (BaridiMob / CCP) / بنك BNA',
    payoutIban: '00799999000123456789 (RIP BaridiMob)',
    activeCarrier: 'yalidine',
    defaultDeliveryType: 'home',
    enableFakeOrderShield: true,
    enableLandingPageDirectBuy: true,
    yalidineApiKey: 'YAL_API_KEY_LIVE_9921',
    yalidineApiToken: 'YAL_TOKEN_SEC_7718',
    facebookPixel: 'PIXEL_FB_99182374',
    tiktokPixel: 'PIXEL_TT_88129033'
  }
};

export const INITIAL_STORES: Store[] = [
  INITIAL_STORE,
  {
    id: 'store_oran_tech',
    name: 'TechnoClick DZ',
    nameAr: 'تكنو كليك وهران للتقنية',
    slug: 'technoclick-dz',
    slogan: 'Best smartphones & gaming gear in Oran',
    sloganAr: 'أفضل الهواتف وملحقات الجيمنج بأسعار منافسة مع ضمان سنة',
    description: 'Premier tech and gaming store in western Algeria.',
    descriptionAr: 'متجر متخصص في أحدث الهواتف الذكية، ملحقات الحاسوب وأجهزة الألعاب مع التوصيل السريع لكافة الولايات.',
    category: 'Electronics & Phones',
    categoryAr: 'هواتف وإلكترونيات ذكية',
    ownerName: 'أمين رحماني',
    ownerEmail: 'amine.tech.dz@gmail.com',
    ownerPhone: '0770 98 41 23',
    wilaya: 'وهران',
    wilayaCode: '31',
    status: 'active',
    plan: 'pro',
    accentColor: '#2563EB',
    totalSales: 720000,
    ordersCount: 138,
    productsCount: 32,
    createdAt: '2026-10-12',
    supabaseConnected: true,
    githubConnected: false,
    settings: {
      subdomain: 'technoclick-dz.wasladz.app',
      customDomain: 'www.technoclick-oran.com',
      themeColor: '#2563EB',
      shippingRate: 550,
      freeShippingThreshold: 15000,
      taxRate: 0,
      currency: 'DZD',
      isPublished: true,
      payoutBank: 'بريد الجزائر (BaridiMob)',
      payoutIban: '00799999000987654321',
      activeCarrier: 'zrexpress',
      defaultDeliveryType: 'home',
      enableFakeOrderShield: true,
      enableLandingPageDirectBuy: true
    }
  },
  {
    id: 'store_setif_cosmetics',
    name: 'Orient Natural Beauty',
    nameAr: 'جمال الشرق الطبيعي - سطيف',
    slug: 'orient-beauty',
    slogan: 'Organic Algerian skincare & pure Argan oils',
    sloganAr: 'عناية طبيعية 100% بالبشرة والشعر مستخلصة من زيوت وأعشاب نقية',
    description: 'Certified organic beauty and wellness brand based in Setif.',
    descriptionAr: 'علامة جزائرية متخصصة في مستحضرات التجميل العضوية والعناية الطبيعية بالبشرة مع الشحن السريع.',
    category: 'Beauty & Cosmetics',
    categoryAr: 'مستحضرات تجميل وعناية',
    ownerName: 'مريم بوعلام',
    ownerEmail: 'myriam.beauty.setif@outlook.com',
    ownerPhone: '0661 45 88 12',
    wilaya: 'سطيف',
    wilayaCode: '19',
    status: 'active',
    plan: 'free',
    accentColor: '#EC4899',
    totalSales: 310000,
    ordersCount: 82,
    productsCount: 24,
    createdAt: '2026-10-15',
    supabaseConnected: true,
    githubConnected: false,
    settings: {
      subdomain: 'orient-beauty.wasladz.app',
      themeColor: '#EC4899',
      shippingRate: 600,
      freeShippingThreshold: 6000,
      taxRate: 0,
      currency: 'DZD',
      isPublished: true,
      payoutBank: 'بنك الخليج الجزائر (AGB)',
      payoutIban: '00200001000554433221',
      activeCarrier: 'yalidine',
      defaultDeliveryType: 'home',
      enableFakeOrderShield: true,
      enableLandingPageDirectBuy: true
    }
  },
  {
    id: 'store_constantine_craft',
    name: 'Constantine Heritage & Craft',
    nameAr: 'دار الحرفة القسنطينية الأصيلة',
    slug: 'dar-el-herfa',
    slogan: 'Traditional Gandoura, Kaftan and artisanal copper',
    sloganAr: 'قندورة قسنطينية ومجبود تقليدي وأواني نحاسية يدوية الصنع',
    description: 'Authentic Constantine artisanal fashion and heritage items.',
    descriptionAr: 'متجر سحابي للأزياء التقليدية القسنطينية والمصنوعات اليدوية التراثية الأصيلة.',
    category: 'Traditional Fashion & Crafts',
    categoryAr: 'أزياء تقليدية وتراثية',
    ownerName: 'فؤاد بوكعباش',
    ownerEmail: 'contact@craft-constantine.dz',
    ownerPhone: '0560 33 22 11',
    wilaya: 'قسنطينة',
    wilayaCode: '25',
    status: 'active',
    plan: 'pro',
    accentColor: '#D97706',
    totalSales: 590000,
    ordersCount: 67,
    productsCount: 15,
    createdAt: '2026-10-09',
    supabaseConnected: true,
    githubConnected: true,
    settings: {
      subdomain: 'dar-el-herfa.wasladz.app',
      customDomain: 'www.herfa-constantine.dz',
      themeColor: '#D97706',
      shippingRate: 600,
      freeShippingThreshold: 12000,
      taxRate: 0,
      currency: 'DZD',
      isPublished: true,
      payoutBank: 'بريد الجزائر (BaridiMob)',
      payoutIban: '00799999000445566778',
      activeCarrier: 'yalidine',
      defaultDeliveryType: 'desk',
      enableFakeOrderShield: true,
      enableLandingPageDirectBuy: true
    }
  },
  {
    id: 'store_annaba_watches',
    name: 'Bouna Jewels & Watches',
    nameAr: 'جوهرة بونة للساعات والإكسسوارات',
    slug: 'bouna-watches',
    slogan: 'Luxury watches and premium accessories in Annaba',
    sloganAr: 'تشكيلة راقية من الساعات الرجالية والنسائية مع علبة فاخرة وضمان',
    description: 'High-end watches boutique in Annaba shipping all across 69 wilayas.',
    descriptionAr: 'متجر بوتيك متخصص في الساعات الكلاسيكية والرياضية الفاخرة والنظارات الشمسية المعتمدة.',
    category: 'Watches & Jewelry',
    categoryAr: 'ساعات ومجوهرات وإكسسوارات',
    ownerName: 'ياسمين لعريبي',
    ownerEmail: 'yasmine.watches@annaba.dz',
    ownerPhone: '0670 44 99 22',
    wilaya: 'عنابة',
    wilayaCode: '23',
    status: 'active',
    plan: 'enterprise',
    accentColor: '#7C3AED',
    totalSales: 880000,
    ordersCount: 115,
    productsCount: 45,
    createdAt: '2026-10-05',
    supabaseConnected: true,
    githubConnected: true,
    settings: {
      subdomain: 'bouna-watches.wasladz.app',
      customDomain: 'www.bouna-watches.store',
      themeColor: '#7C3AED',
      shippingRate: 650,
      freeShippingThreshold: 10000,
      taxRate: 0,
      currency: 'DZD',
      isPublished: true,
      payoutBank: 'بنك التنمية المحلية (BDL)',
      payoutIban: '00500123000998877665',
      activeCarrier: 'yalidine',
      defaultDeliveryType: 'home',
      enableFakeOrderShield: true,
      enableLandingPageDirectBuy: true
    }
  },
  {
    id: 'store_batna_sports',
    name: 'Aures Sport DZ',
    nameAr: 'أوراس سبور باتنة (Aures Sport)',
    slug: 'aures-sport',
    slogan: 'Original sport shoes, training kits and activewear',
    sloganAr: 'أحذية رياضية أصلية وألبسة تدريب احترافية مع ضمان الجودة والقياس',
    description: 'Sports equipment and sportswear powerhouse in Batna.',
    descriptionAr: 'متجر رياضي شامل في عاصمة الأوراس، نوفر أحذية جري وكرات وملابس رياضية بجودة ممتازة.',
    category: 'Sports & Fitness',
    categoryAr: 'رياضة ولياقة بدنية',
    ownerName: 'كمال عزوز',
    ownerEmail: 'kamel.sport@aures.dz',
    ownerPhone: '0792 11 00 99',
    wilaya: 'باتنة',
    wilayaCode: '05',
    status: 'active',
    plan: 'pro',
    accentColor: '#10B981',
    totalSales: 425000,
    ordersCount: 76,
    productsCount: 28,
    createdAt: '2026-10-11',
    supabaseConnected: true,
    githubConnected: false,
    settings: {
      subdomain: 'aures-sport.wasladz.app',
      themeColor: '#10B981',
      shippingRate: 650,
      freeShippingThreshold: 9000,
      taxRate: 0,
      currency: 'DZD',
      isPublished: true,
      payoutBank: 'بريد الجزائر (BaridiMob)',
      payoutIban: '00799999000112233445',
      activeCarrier: 'maystro',
      defaultDeliveryType: 'home',
      enableFakeOrderShield: true,
      enableLandingPageDirectBuy: true
    }
  },
  {
    id: 'store_blida_home',
    name: 'Darek Home Blida',
    nameAr: 'دارك ستور البليدة - ديكور وأواني',
    slug: 'darek-home',
    slogan: 'Smart kitchen accessories and modern home decor',
    sloganAr: 'أواني ذكية ومنظمات مطبخ وديكورات عصرية تحوّل منزلك للأجمل',
    description: 'Blida home decor and modern kitchen tools retailer.',
    descriptionAr: 'متجر متخصص في مستلزمات البيت العصري، أدوات المطبخ المبتكرة وديكورات الصالون.',
    category: 'Home & Kitchen',
    categoryAr: 'أدوات منزلية ومطبخ',
    ownerName: 'سمير مداحي',
    ownerEmail: 'samir.darek.blida@gmail.com',
    ownerPhone: '0541 77 66 55',
    wilaya: 'البليدة',
    wilayaCode: '09',
    status: 'active',
    plan: 'free',
    accentColor: '#F59E0B',
    totalSales: 195000,
    ordersCount: 49,
    productsCount: 19,
    createdAt: '2026-10-17',
    supabaseConnected: true,
    githubConnected: false,
    settings: {
      subdomain: 'darek-home.wasladz.app',
      themeColor: '#F59E0B',
      shippingRate: 500,
      freeShippingThreshold: 7500,
      taxRate: 0,
      currency: 'DZD',
      isPublished: true,
      payoutBank: 'بريد الجزائر (BaridiMob)',
      payoutIban: '00799999000332211998',
      activeCarrier: 'zrexpress',
      defaultDeliveryType: 'home',
      enableFakeOrderShield: true,
      enableLandingPageDirectBuy: true
    }
  },
  {
    id: 'store_tlemcen_fashion',
    name: 'Asala Tlemcen Couture',
    nameAr: 'أصالة تلمسان للأزياء والمجوهرات',
    slug: 'asala-tlemcen',
    slogan: 'Bridal accessories, traditional Chedda and jewelry',
    sloganAr: 'إكسسوارات الشدة التلمسانية ومجوهرات بديلة راقية للمناسبات',
    description: 'Tlemcen bridal jewelry and classic fashion atelier.',
    descriptionAr: 'متجر متخصص في إكسسوارات العرائس وبدائل الذهب الفاخرة للشدة التلمسانية والأعراس.',
    category: 'Bridal & Jewelry',
    categoryAr: 'عرائس ومجوهرات بديلة',
    ownerName: 'فاطمة الزهراء شريف',
    ownerEmail: 'contact@asala-tlemcen.com',
    ownerPhone: '0555 88 11 44',
    wilaya: 'تلمسان',
    wilayaCode: '13',
    status: 'pending',
    plan: 'free',
    accentColor: '#8B5CF6',
    totalSales: 84000,
    ordersCount: 16,
    productsCount: 12,
    createdAt: '2026-10-19',
    supabaseConnected: false,
    githubConnected: false,
    settings: {
      subdomain: 'asala-tlemcen.wasladz.app',
      themeColor: '#8B5CF6',
      shippingRate: 650,
      freeShippingThreshold: 8000,
      taxRate: 0,
      currency: 'DZD',
      isPublished: true,
      payoutBank: 'بريد الجزائر (BaridiMob)',
      payoutIban: '00799999000776655443',
      activeCarrier: 'yalidine',
      defaultDeliveryType: 'desk',
      enableFakeOrderShield: true,
      enableLandingPageDirectBuy: true
    }
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    storeId: 'store_demo_1',
    name: 'Smart Titanium Ultra Watch Pro',
    nameAr: 'ساعة ذكية تيتانيوم ألترا برو مقاومة للماء مع شاشة AMOLED',
    description: 'High-precision titanium sports smartwatch with heart rate, calls, Arabic UI, and 10-day battery.',
    descriptionAr: 'ساعة رياضية ذكية فاخرة من التيتانيوم، تدعم المكالمات باللغة العربية، قياس دقات القلب والضغط، وبطارية تدوم 10 أيام مع شاحن لاسلكي سريع.',
    price: 4900,
    costPrice: 2200,
    compareAtPrice: 6500,
    category: 'Electronics',
    stock: 24,
    sku: 'WATCH-ULTRA-DZ',
    isPublished: true,
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Titanium Black', nameAr: 'تيتانيوم أسود', hex: '#111827' },
      { name: 'Silver Gray', nameAr: 'فضي معدني', hex: '#9CA3AF' },
      { name: 'Sport Orange', nameAr: 'برتقالي رياضي', hex: '#EA580C' }
    ]
  },
  {
    id: 'prod_2',
    storeId: 'store_demo_1',
    name: 'Ergonomic Waterproof Leather Backpack',
    nameAr: 'حقيبة ظهر جلدية مضادة للماء مع منفذ شحن USB للعمل والسفر',
    description: 'Premium waterproof synthetic leather laptop backpack with multi-compartments and anti-theft zipper.',
    descriptionAr: 'حقيبة ظهر أنيقة من الجلد الفاخر المقاوم للماء والخدش، مخصصة للحاسوب المحمول والأغراض الشخصية مع سحاب أمان ومنفذ شحن مدمج.',
    price: 3600,
    costPrice: 1500,
    compareAtPrice: 4800,
    category: 'Bags & Accessories',
    stock: 35,
    sku: 'BAG-LEATH-02',
    isPublished: true,
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Dark Brown', nameAr: 'بني شوكولاته', hex: '#451A03' },
      { name: 'Matte Black', nameAr: 'أسود مطفي', hex: '#1F2937' },
      { name: 'Camel Tan', nameAr: 'جملي كلاسيك', hex: '#B45309' }
    ]
  },
  {
    id: 'prod_3',
    storeId: 'store_demo_1',
    name: 'Professional Ceramic Hair Styler & Beard Trimmer',
    nameAr: 'ماكينة الحلاقة والتحديد الاحترافية اللاسلكية المقاومة للماء',
    description: 'Rechargeable cordless hair and beard precision trimmer with titanium-ceramic blades and LED display.',
    descriptionAr: 'ماكينة حلاقة وتحديد عالية الدقة بشفرات تيتانيوم سيراميك، شاشة رقمية لعرض نسبة البطارية، وهيكل معدني مقاوم للماء مع 4 أمشاط مدرجة.',
    price: 2900,
    costPrice: 1100,
    compareAtPrice: 3900,
    category: 'Personal Care',
    stock: 42,
    sku: 'TRIM-PRO-DZ',
    isPublished: true,
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Vintage Gold', nameAr: 'ذهبي نحاسي عتيق', hex: '#D97706' },
      { name: 'Silver Chrome', nameAr: 'فضي كروم', hex: '#64748B' }
    ]
  },
  {
    id: 'prod_4',
    storeId: 'store_demo_1',
    name: 'Wireless Noise-Cancelling ANC Earbuds',
    nameAr: 'سماعات بلوتوث لاسلكية مع عزل الضوضاء النشط وصوت محيطي 3D',
    description: 'Hi-Fi stereo bluetooth 5.3 earbuds with active noise cancellation, deep bass, and touch controls.',
    descriptionAr: 'سماعات أذن لاسلكية فائقة النقاء مع ميزة عزل الضوضاء الذكي، ميكروفون مزدوج للمكالمات الواضحة، وعلبة شحن ذكية تدوم 36 ساعة.',
    price: 2500,
    costPrice: 950,
    compareAtPrice: 3500,
    category: 'Electronics',
    stock: 50,
    sku: 'EAR-ANC-04',
    isPublished: true,
    isFeatured: false,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Pure White', nameAr: 'أبيض لؤلؤي', hex: '#F9FAFB' },
      { name: 'Midnight Black', nameAr: 'أسود ليلي', hex: '#111827' },
      { name: 'Navy Blue', nameAr: 'أزرق كحلي', hex: '#1E3A8A' }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_101',
    orderNumber: 'SQB-2026-1082',
    storeId: 'store_demo_1',
    customerName: 'أمين بلقاسم',
    customerEmail: 'amine.belkacem@gmail.com',
    customerPhone: '0550123456',
    customerCity: 'الجزائر العاصمة (حي باب الزوار)',
    customerAddress: 'حي 1200 مسكن عمارة 14، باب الزوار',
    wilayaCode: '16',
    wilayaName: 'الجزائر العاصمة (Alger)',
    deliveryType: 'home',
    items: [
      { id: 'item_1', product: INITIAL_PRODUCTS[0], quantity: 1 }
    ],
    total: 5350, // 4900 + 450 delivery
    currency: 'DZD',
    status: 'delivered',
    callStatus: 'confirmed',
    carrier: 'Yalidine Delivery',
    paymentMethod: 'الدفع عند الاستلام (COD)',
    createdAt: '2026-10-18T14:20:00Z',
    trackingNumber: 'YAL-DZ-16990234',
    fraudRisk: 'low'
  },
  {
    id: 'ord_102',
    orderNumber: 'SQB-2026-1083',
    storeId: 'store_demo_1',
    customerName: 'ياسين منصوري',
    customerEmail: 'yacine.mansouri@yahoo.com',
    customerPhone: '0661234567',
    customerCity: 'وهران (حي إيسطو)',
    customerAddress: 'مكتب ياليدين للتوصيل - وهران إيسطو',
    wilayaCode: '31',
    wilayaName: 'وهران (Oran)',
    deliveryType: 'desk',
    items: [
      { id: 'item_2', product: INITIAL_PRODUCTS[1], quantity: 1 }
    ],
    total: 3950, // 3600 + 350 stop-desk
    currency: 'DZD',
    status: 'shipped',
    callStatus: 'confirmed',
    carrier: 'Yalidine Delivery',
    paymentMethod: 'الدفع عند الاستلام (COD)',
    createdAt: '2026-10-18T16:15:00Z',
    trackingNumber: 'YAL-DZ-31889012',
    fraudRisk: 'low'
  },
  {
    id: 'ord_103',
    orderNumber: 'SQB-2026-1084',
    storeId: 'store_demo_1',
    customerName: 'مريم بن علي',
    customerEmail: 'meriem.benali@outlook.com',
    customerPhone: '0770987654',
    customerCity: 'قسنطينة (المدينة الجديدة علي منجلي)',
    customerAddress: 'الوحدة الجوارية 07، عمارة 03، علي منجلي',
    wilayaCode: '25',
    wilayaName: 'قسنطينة (Constantine)',
    deliveryType: 'home',
    items: [
      { id: 'item_3', product: INITIAL_PRODUCTS[2], quantity: 1 }
    ],
    total: 3500, // 2900 + 600 delivery
    currency: 'DZD',
    status: 'processing',
    callStatus: 'pending_call',
    carrier: 'ZR Express',
    paymentMethod: 'الدفع عند الاستلام (COD)',
    createdAt: '2026-10-19T07:45:00Z',
    trackingNumber: 'ZR-EXP-25109823',
    fraudRisk: 'low'
  },
  {
    id: 'ord_104',
    orderNumber: 'SQB-2026-1085',
    storeId: 'store_demo_1',
    customerName: 'طارق زواوي',
    customerEmail: 'tarek.zouaoui@gmail.com',
    customerPhone: '0555998877',
    customerCity: 'سطيف (حي الهضاب)',
    customerAddress: 'شارع 8 ماي 1945، سطيف',
    wilayaCode: '19',
    wilayaName: 'سطيف (Sétif)',
    deliveryType: 'home',
    items: [
      { id: 'item_4', product: INITIAL_PRODUCTS[0], quantity: 2 }
    ],
    total: 8930, // 4900*2 with 15% discount + 600 shipping
    currency: 'DZD',
    status: 'pending',
    callStatus: 'no_answer_1',
    carrier: 'Yalidine Delivery',
    paymentMethod: 'الدفع عند الاستلام (COD)',
    createdAt: '2026-10-19T08:10:00Z',
    trackingNumber: 'YAL-DZ-19003412',
    fraudRisk: 'medium'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    storeId: 'store_demo_1',
    name: 'أمين بلقاسم',
    email: 'amine.belkacem@gmail.com',
    phone: '0550123456',
    city: 'الجزائر العاصمة',
    wilayaName: 'الجزائر (16)',
    totalOrders: 3,
    totalSpent: 14500,
    lastOrderDate: '2026-10-18',
    isVerified: true
  },
  {
    id: 'cust_2',
    storeId: 'store_demo_1',
    name: 'ياسين منصوري',
    email: 'yacine.mansouri@yahoo.com',
    phone: '0661234567',
    city: 'وهران',
    wilayaName: 'وهران (31)',
    totalOrders: 2,
    totalSpent: 8200,
    lastOrderDate: '2026-10-18',
    isVerified: true
  },
  {
    id: 'cust_3',
    storeId: 'store_demo_1',
    name: 'مريم بن علي',
    email: 'meriem.benali@outlook.com',
    phone: '0770987654',
    city: 'قسنطينة',
    wilayaName: 'قسنطينة (25)',
    totalOrders: 1,
    totalSpent: 3500,
    lastOrderDate: '2026-10-19',
    isVerified: true
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn_1',
    storeId: 'store_demo_1',
    code: 'WELCOME10',
    discountType: 'percentage',
    value: 10,
    minOrder: 4000,
    usageCount: 42,
    isActive: true
  },
  {
    id: 'cpn_2',
    storeId: 'store_demo_1',
    code: 'PROMO500',
    discountType: 'fixed',
    value: 500,
    minOrder: 6000,
    usageCount: 19,
    isActive: true
  }
];

export const INITIAL_ABANDONED_CARTS: AbandonedCart[] = [
  {
    id: 'cart_1',
    storeId: 'store_demo_1',
    customerName: 'أمين بن صالح',
    customerPhone: '0555123490',
    wilayaName: 'الجزائر العاصمة',
    productName: 'ساعة ذكية تيتانيوم ألترا برو',
    total: 4900,
    createdAt: 'منذ 25 دقيقة',
    isRecovered: false,
    recoveryAttempts: 1
  },
  {
    id: 'cart_2',
    storeId: 'store_demo_1',
    customerName: 'فاطمة الزهراء قاسمي',
    customerPhone: '0661984210',
    wilayaName: 'وهران',
    productName: 'حقيبة ظهر جلدية مضادة للماء',
    total: 3600,
    createdAt: 'منذ ساعة',
    isRecovered: true,
    recoveryAttempts: 1
  },
  {
    id: 'cart_3',
    storeId: 'store_demo_1',
    customerName: 'ياسين بوعبدالله',
    customerPhone: '0770341892',
    wilayaName: 'سطيف',
    productName: 'ماكينة حلاقة وتشذيب فينتيج احترافية',
    total: 2900,
    createdAt: 'منذ 3 ساعات',
    isRecovered: false,
    recoveryAttempts: 2
  }
];

export const INITIAL_LANDING_PAGES: LandingPageFunnel[] = [
  {
    id: 'lp_1',
    storeId: 'store_demo_1',
    productId: 'prod_1',
    title: 'Titanium Ultra Watch Pro High-Converting Funnel',
    titleAr: 'صفحة هبوط الساعة الذكية تيتانيوم ألترا برو (بالدارجة)',
    language: 'darija',
    urgencyHeadline: 'عرض خاص وحصري: تخفيض 30% مع التوصيل السريع لكامل 58 ولاية والدفع حتى يلحقك وتشوف السلعة!',
    bulletPoints: [
      'بطارية تدوم حتى 10 أيام كاملة بدون انقطاع مع شاحن لاسلكي',
      'مقاومة للماء بنسبة 100% مع هيكل تيتانيوم فائق الصلابة',
      'تدعم إجراء واستقبال المكالمات وإشعارات فيسبوك وواتساب بالعربية',
      'شاشة AMOLED عملاقة وفائقة الوضوح تحت أشعة الشمس',
      'ضمان لمدة 12 شهر مع إمكانية التبديل الفوري'
    ],
    dealOffers: [
      { quantity: 1, price: 4900, discountLabel: 'قطعة واحدة - 4,900 د.ج' },
      { quantity: 2, price: 8900, discountLabel: 'قطعتين - 8,900 د.ج (وفر 900 د.ج)', isBestValue: true },
      { quantity: 3, price: 12500, discountLabel: '3 قطع - 12,500 د.ج + توصيل مجاني للمنزل' }
    ],
    reviewsCount: 38,
    averageRating: 4.9,
    visitorCountLive: 14,
    isPublished: true
  }
];

export const INITIAL_SUPABASE_CONFIG: SupabaseConfig = {
  projectUrl: 'https://wasladz-stores.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhc2xhZHotZGF0YWJhc2UiLCJyb2xlIjoic2VsbGVyIn0.token_live_sample',
  isConnected: true,
  lastSyncTime: '2026-10-19T08:00:00Z'
};

export const INITIAL_GITHUB_CONFIG: GitHubConfig = {
  repoUrl: 'https://github.com/wasladz/wasladz-storefront-starter',
  branch: 'main',
  connected: true
};

export const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; symbolAr: string }> = {
  DZD: { rate: 1, symbol: 'DZD', symbolAr: 'د.ج' },
  SAR: { rate: 0.028, symbol: 'SAR', symbolAr: 'ر.س' },
  USD: { rate: 0.0074, symbol: '$', symbolAr: '$' },
  EUR: { rate: 0.0069, symbol: '€', symbolAr: '€' }
};

export const INITIAL_PLATFORM_FEATURES: PlatformFeatureItem[] = [
  {
    id: 'dz58Wilayas',
    name: '58 Algerian Wilayas Delivery Matrix',
    nameAr: 'نظام توصيل وتسعير الـ 58 ولاية جزائرية',
    description: 'Dynamic automated shipping fees for home delivery (Domicile) and pickup desk (Stop-Desk) across all 58 Wilayas.',
    descriptionAr: 'حساب تلقائي دقيق لأسعار الشحن لكافة الـ 58 ولاية للتوصيل للمنزل أو الاستلام من المكتب.',
    category: 'store',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'yalidineCarrier',
    name: 'Yalidine & ZR Express Native Integrations',
    nameAr: 'الربط المباشر مع شركات التوصيل (Yalidine و ZR Express)',
    description: 'Automated order dispatching, waybill generation, and synchronized parcel live tracking status.',
    descriptionAr: 'توليد بوالص الشحن التلقائية وتتبع حالة الطرود مباشرة عبر API ياليدين وزد آر إكسبريس.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'fakeOrderShield',
    name: 'Smart Anti-Fraud & Fake Order Shield',
    nameAr: 'نظام كشف وتصفية الطلبات الوهمية والمكررة',
    description: 'Algerian phone number regex validation (05/06/07), anti-duplicate submission block, and risk scoring.',
    descriptionAr: 'التحقق التلقائي من أرقام الهواتف الجزائرية ومنع تكرار الطلبات وتنبيه التاجر من الزبائن غير الجادين.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'landingPageMode',
    name: '1-Minute High-Converting Landing Page Builder',
    nameAr: 'منشئ صفحات الهبوط السريعة للشراء المباشر',
    description: 'Ultra-fast single-page checkout optimized for COD conversions with quantity discount bundles.',
    descriptionAr: 'صفحات هبوط مخصصة لكل منتج مع نموذج طلب فوري مدمج وعروض كميات ترفع المبيعات بنسبة 35%.',
    category: 'marketing',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'orderConfirmationStatus',
    name: 'Call Center Order Confirmation Tracker',
    nameAr: 'نظام تسجيل محاولات الاتصال والتأكيد الهاتفي',
    description: 'Track confirmation call attempts: No Answer 1, No Answer 2, Switched Off, Confirmed, Cancelled.',
    descriptionAr: 'إدارة وتتبع دقيق لمحاولات الاتصال بالزبون لتأكيد الطلب قبل الشحن وتفادي المرتجعات.',
    category: 'store',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'thermalWaybills',
    name: 'Thermal Waybill Printing (Bordereau avec Code-Barres)',
    nameAr: 'طباعة بوالص الشحن الحرارية مع الباركود',
    description: '1-click thermal printing for shipping labels and order delivery slips matching carrier standards.',
    descriptionAr: 'طباعة فورية لبوالص الشحن الحرارية مع الباركود لتسليم الطرود لموزعي ياليدين وزد آر إكسبريس.',
    category: 'store',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'pixelTracking',
    name: 'Multi-Pixel Advertising Engine (Meta, TikTok, Snapchat)',
    nameAr: 'ربط بكسلات التتبع الإعلاني (فيسبوك، تيك توك، سناب شات)',
    description: 'Accurate event tracking for PageView, AddToCart, and Purchase across major ad networks.',
    descriptionAr: 'إرسال أحداث الشراء الدقيقة لبكسل فيسبوك وتيك توك وسناب شات لتحسين نتائج الحملات الإعلانية.',
    category: 'marketing',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'coupons',
    name: 'Promotional Coupons & Discount Engine',
    nameAr: 'نظام الكوبونات والخصومات الترويجية',
    description: 'Create percentage and fixed DZD promo codes to boost conversion rates.',
    descriptionAr: 'إنشاء وتفعيل أكواد الخصم والعروض الترويجية لزيادة حجم السلة الشرائية.',
    category: 'marketing',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'customersCRM',
    name: 'Customer CRM & Verified Buyer Directory',
    nameAr: 'إدارة وسجل العملاء الموثوقين',
    description: 'Complete purchase history, phone numbers, delivery locations, and order reliability scores.',
    descriptionAr: 'سجل كامل لبيانات الزبائن وأماكن استلامهم ونسبة استلامهم للشحنات السابقة.',
    category: 'store',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'developerIntegrations',
    name: 'Supabase & GitHub Developer Hub',
    nameAr: 'تكامل قواعد بيانات Supabase و GitHub للمطورين',
    description: 'Direct SQL schema export, real-time database sync, and repository branch management.',
    descriptionAr: 'الربط المباشر لقواعد البيانات وتصدير كود SQL ومزامنة مستودع GitHub.',
    category: 'tech',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'plansAndUpgrades',
    name: '0% Commission Subscription Tiers (DZD)',
    nameAr: 'باقات الاشتراك الشهرية بالدينار الجزائري (0% عمولة)',
    description: 'Switch between Free Starter, Pro Merchant (1,000 DZD), and Enterprise Scale (5,500 DZD).',
    descriptionAr: 'الترقية بين الباقات بدون أي اقتطاع أو نسبة من مبيعاتك وأرباحك.',
    category: 'marketing',
    isEnabled: false,
    isRemoved: true
  },
  {
    id: 'abandonedCartRecovery',
    name: 'Abandoned Cart Recovery (WhatsApp & SMS)',
    nameAr: 'استرجاع السلات المتروكة عبر واتساب ورسائل SMS',
    description: 'Send automated customized recovery reminders in Algerian Darija to boost conversion by 25%.',
    descriptionAr: 'إرسال تذكيرات تلقائية بالدارجة الجزائرية للزبائن الذين ملأوا بياناتهم ولم يؤكدوا طلباتهم.',
    category: 'marketing',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'smartCatalogImport',
    name: '1-Click Catalog Importer (Shopify / YouCan / Excel)',
    nameAr: 'استيراد المنتجات بضغطة زر (Shopify، YouCan، Excel)',
    description: 'Instant CSV & Excel product catalogue migration with images, variants, and pricing.',
    descriptionAr: 'استيراد فوري لكافة منتجاتك وصورها وأسعارها بملف إكسل أو رابط شوبيفاي ويوكان.',
    category: 'store',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'ecotrackNetwork',
    name: '102+ Couriers & Ecotrack Hub Integration',
    nameAr: 'الربط مع شبكة إيكوتراك الموحدة وأكثر من 102 شركة شحن',
    description: 'Connect with Ecotrack, Yalidine, ZR Express, Procolis, and regional Algerian couriers.',
    descriptionAr: 'الربط الموحد مع كبرى شبكات التوصيل الجزائرية لتغطية كل شبر في الـ 58 ولاية.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'demoLogin',
    name: '1-Click Quick Demo Login',
    nameAr: 'زر الدخول التجريبي السريع للوحة التحكم',
    description: 'Instant one-tap login for testing merchant dashboard without typing credentials.',
    descriptionAr: 'إتاحة تسجيل الدخول الفوري للتاجر التجريبي بنقرة واحدة لتجربة المنصة فوراً.',
    category: 'tech',
    isEnabled: true,
    isRemoved: false
  }
];

export const INITIAL_STORE_FEATURES: StoreFeatureItem[] = [
  {
    id: 'storeAppearance',
    name: 'Store Appearance, Colors & Theme',
    nameAr: 'مظهر وهوية المتجر والألوان الرئيسية',
    description: 'Customize brand accent color, header style, and storefront layout.',
    descriptionAr: 'التحكم في لون الهوية الرئيسي للمتجر، نمط الترويسة، ومظهر بطاقات المنتجات.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false,
    customValue: '#059669'
  },
  {
    id: 'topAnnouncement',
    name: 'Top Flash Promo Announcement Bar',
    nameAr: 'شريط الإعلانات الترويجي العلوي للمتجر',
    description: 'Customizable top banner highlighting promotions, return guarantees, or free delivery across Algeria.',
    descriptionAr: 'شريط علوي بارز للإعلان عن العروض الحصرية، التوصيل السريع لـ 58 ولاية، والدفع عند الاستلام.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false,
    customValue: '🚚 توصيل سريع لـ 58 ولاية جزائرية + الدفع عند الاستلام بعد معاينة وفحص المنتج!'
  },
  {
    id: 'storeHeader',
    name: 'Store Header & Brand Identity',
    nameAr: 'رأس الصفحة وشعار واسم المتجر',
    description: 'Store logo, brand name, verified badge, and navigation elements.',
    descriptionAr: 'شعار المتجر، الاسم التجاري، شارة المتجر المعتمد، وأزرار التنقل.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false,
    customValue: 'متجر مستقل معتمد - تشغيل مباشر'
  },
  {
    id: 'storeSearch',
    name: 'Live Product Search Bar',
    nameAr: 'شريط البحث المباشر في منتجات المتجر',
    description: 'Enables instant live filtering of products by keyword in the storefront.',
    descriptionAr: 'يتيح للزبائن البحث الفوري والفلترة بالاسم والتفاصيل داخل المتجر.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false,
    customValue: 'ابحث عن منتجك المفضل...'
  },
  {
    id: 'heroBanner',
    name: 'Hero Welcome Banner & Store Intro',
    nameAr: 'البانر الرئيسي وقسم الترحيب والتعريف بالمتجر',
    description: 'Main promotional headline, description, and visual call-to-action on the homepage.',
    descriptionAr: 'البانر الترحيبي العريض في أعلى الصفحة الرئيسية لتقديم عروض المتجر وأقوى التخفيضات.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false,
    customValue: 'أفضل المنتجات الأصلية بأفضل الأسعار مع ضمان الاستبدال السريع'
  },
  {
    id: 'trustBadges',
    name: 'Trust Badges & COD Guarantees Bar',
    nameAr: 'شريط مزايا وضمانات التوصيل والدفع عند الاستلام',
    description: 'Guarantees bar highlighting doorstep delivery, pay-after-inspection, and local courier speed.',
    descriptionAr: 'شريط المزايا الأربعة: شحن لـ 58 ولاية، فحص قبل الدفع، استرجاع مجاني، ودعم مستمر.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false,
    customValue: 'شحن فوري لباب البيت • فحص المنتج قبل الدفع • استبدال خلال 48 ساعة'
  },
  {
    id: 'categoriesBar',
    name: 'Product Categories Filter Bar',
    nameAr: 'شريط تصنيفات وفلترة المنتجات',
    description: 'Horizontal pill buttons allowing shoppers to browse by category.',
    descriptionAr: 'أزرار التصنيفات الأفقية لتسهيل تصفح المنتجات والتنقل بين الأقسام.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false,
    customValue: 'جميع الأقسام'
  },
  {
    id: 'featuredProducts',
    name: 'Featured Products Grid & Catalog',
    nameAr: 'شبكة عرض منتجات المتجر والكتالوج',
    description: 'Interactive grid displaying products with pricing in DZD, discounts, and order buttons.',
    descriptionAr: 'شبكة المنتجات المعروضة للبيع مع الأسعار بالدينار الجزائري، بطاقات العروض، وزر الشراء.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false,
    customValue: 'منتجاتنا المميزة'
  },
  {
    id: 'quantityBundles',
    name: 'Quantity Discount Bundles (1, 2, or 3 Items)',
    nameAr: 'عروض الكميات التوفيرية (عرض 2 بخصم وعرض 3 مع توصيل مجاني)',
    description: 'Display attractive discount tiers to increase average order value (AOV).',
    descriptionAr: 'عرض حزم توفيرية تشجع الزبون على طلب قطعتين أو ثلاث قطع بخصم مغري.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false,
    customValue: 'اشترِ قطعتين واحصل على خصم 15% أو 3 قطع مع توصيل مجاني!'
  },
  {
    id: 'shippingThreshold',
    name: 'Free Delivery Progress Bar',
    nameAr: 'شريط تقدم الشحن المجاني للطلبات',
    description: 'Shows dynamic progress indicator towards free shipping threshold in DZD.',
    descriptionAr: 'عرض شريط تفاعلي يحفز الزبون على إضافة المزيد من المنتجات للحصول على توصيل مجاني.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false,
    customValue: 'أضف منتجات بقيمة 5,000 د.ج للحصول على شحن مجاني!'
  },
  {
    id: 'instantCart',
    name: 'Instant COD Checkout Drawer',
    nameAr: 'نموذج الطلب السريع والدفع عند الاستلام (COD)',
    description: 'High-converting drawer for frictionless cash on delivery submissions.',
    descriptionAr: 'نافذة سريعة تتيح ملء الاسم ورقم الهاتف والولاية وإتمام الطلب في ثوانٍ معدودة.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false,
    customValue: 'الدفع نقداً عند استلام طلبيتك وفحصها'
  },
  {
    id: 'reviewsSection',
    name: 'Verified Customer Reviews & Testimonials',
    nameAr: 'قسم تقييمات وآراء وتجارب الزبائن الموثقة',
    description: 'Social proof section displaying 5-star customer feedback and delivery satisfaction.',
    descriptionAr: 'عرض تجارب الزبائن وآرائهم وتقييمات التوصيل بالنجوم لبناء الثقة ومضاعفة المبيعات.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false,
    customValue: 'أكثر من 2,400+ زبون سعيد في كافة ولايات الجزائر'
  },
  {
    id: 'whatsappChat',
    name: 'WhatsApp Instant Customer Support Button',
    nameAr: 'زر التواصل السريع عبر واتساب مع التاجر',
    description: 'Floating button connecting shoppers directly to merchant via WhatsApp.',
    descriptionAr: 'زر عائم في أسفل المتجر يتيح للزبون الاستفسار أو تأكيد طلبه مباشرة مع التاجر.',
    category: 'customer',
    isEnabled: true,
    isRemoved: false,
    customValue: '+213555000000'
  },
  {
    id: 'orderTracking',
    name: 'Customer Live Order & Waybill Tracking',
    nameAr: 'تتبع الطلبية ورقم بوليصة الشحن للزبون',
    description: 'Modal allowing buyers to enter tracking code and view fulfillment progress.',
    descriptionAr: 'نافذة تمكّن الزبائن من كتابة رقم طلبهم لمعرفة حالة الشحن والتوصيل مع شركة التوصيل.',
    category: 'customer',
    isEnabled: true,
    isRemoved: false,
    customValue: 'أدخل رقم هاتفك أو رقم التتبع لمتابعة شحنتك فوراً'
  },
  {
    id: 'urgencyTimer',
    name: 'Stock Counter & Urgency Countdown Timer',
    nameAr: 'عداد التنازل ومؤشر نفاذ المخزون (تحفيز الشراء)',
    description: 'Displays limited stock alert and countdown timer to accelerate purchasing decision.',
    descriptionAr: 'عرض مؤشر القطع المتبقية ومؤقت تنازلي للعرض لرفع سرعة اتخاذ قرار الشراء.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false,
    customValue: 'بقي 7 قطع فقط بالمخزن بهذا السعر المخفض!'
  },
  {
    id: 'storeFooterLinks',
    name: 'Store Legal & Policy Footer',
    nameAr: 'روابط السياسات وضمان الاسترجاع بأسفل المتجر',
    description: 'Displays return policy, terms, privacy, and support contact details.',
    descriptionAr: 'عرض سياسة الاسترجاع والضمان وشروط الشحن والدعم الفني في تذييل المتجر.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false,
    customValue: 'جميع الحقوق محفوظة. ضمان استرجاع حقيقي خلال 48 ساعة.'
  },
  {
    id: 'dzWilayasDelivery',
    name: 'Algerian 58 Wilayas Selector',
    nameAr: 'اختيار وتحديد الولاية من الـ 58 ولاية جزائرية',
    description: 'Allows buyers to pick their Wilaya with automated calculated delivery fee.',
    descriptionAr: 'عرض قائمة الـ 58 ولاية جزائرية مع حساب تكلفة التوصيل المناسبة فورياً.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'deliveryTypeChoice',
    name: 'Home Delivery vs Stop-Desk Option',
    nameAr: 'خيار التوصيل للمنزل أو الاستلام من مكتب الشحن (Stop-Desk)',
    description: 'Gives buyers the choice between home delivery and cheaper pickup from courier desk.',
    descriptionAr: 'منح المشتري خيار استلام الطرد من مكتب التوصيل بسعر مخفض أو التوصيل لباب منزله.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'phoneValidation',
    name: 'Algerian Mobile Validation (05/06/07)',
    nameAr: 'التحقق من صحة رقم الهاتف الجزائري',
    description: 'Ensures customer inputs a genuine 10-digit mobile number before checkout submission.',
    descriptionAr: 'منع كتابة أرقام خاطئة لضمان إمكانية الاتصال بالزبون وتأكيد الطلبية.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'productQuickView',
    name: '1-Click Product Quick View Modal',
    nameAr: 'المعاينة السريعة للمنتج بدون مغادرة الصفحة',
    description: 'Interactive popup with product gallery, specifications, and fast buy button.',
    descriptionAr: 'نافذة تفاعلية تفتح تفاصيل المنتج وصوره وزر الشراء فوراً لتجربة تسوق سلسة.',
    category: 'storefront',
    isEnabled: true,
    isRemoved: false
  },
  {
    id: 'discountCoupons',
    name: 'Store Promotional Coupon Application',
    nameAr: 'حقل تطبيق كوبون الخصم عند الدفع',
    description: 'Permits buyers to apply promotional codes like WELCOME10 for instant savings.',
    descriptionAr: 'إتاحة إدخال أكواد الخصم الترويجية للحصول على تخفيض مباشر من الفاتورة.',
    category: 'checkout',
    isEnabled: true,
    isRemoved: false
  }
];
