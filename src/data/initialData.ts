import { Store, Product, Order, SupabaseConfig, GitHubConfig, Currency } from '../types';

export const INITIAL_STORES: Store[] = [
  {
    id: 'store_horlogerie',
    name: 'Maison Horlogère Geneve',
    nameAr: 'ميزون أورلوجيري جنيف',
    slug: 'maison-horlogere',
    slogan: 'Precision chronometry & hand-finished titanium timepieces.',
    sloganAr: 'دقة الكرونومتر السويسري وساعات التيتانيوم المصقولة يدوياً.',
    description: 'Independent atelier crafting limited-run mechanical watches with titanium Grade 5 cases and skeletonized complications.',
    descriptionAr: 'أتيليه مستقل لصناعة الساعات الميكانيكية محدودة الإصدار بهياكل تيتانيوم من الدرجة الخامسة وآليات مفرغة فائقة التعقيد.',
    category: 'Haute Horlogerie',
    categoryAr: 'ساعات فاخرة',
    rating: 4.98,
    totalSales: 1420000,
    verified: true,
    accentColor: '#E6B980',
    badge: 'Geneva Hallmark',
    badgeAr: 'ختم جنيف المعتمد',
    inventoryCount: 14,
    joinedYear: 2023,
    supabaseConnected: true,
  },
  {
    id: 'store_nordic',
    name: 'Nordic Living Atelier',
    nameAr: 'أتيليه نوررديك ليفينج',
    slug: 'nordic-living',
    slogan: 'Sculptural furniture rooted in architectural Scandinavian simplicity.',
    sloganAr: 'أثاث نحتي يستند إلى البساطة المعمارية الإسكندنافية الخالصة.',
    description: 'Curated architectural furnishings, boucle lounge chairs, and solid smoked oak fixtures crafted for serene living spaces.',
    descriptionAr: 'مفروشات معمارية منتقاة وكراسي بوكليه استرخائية وخشب بلوط مدخن مصمم خصيصاً للمساحات الراقية.',
    category: 'Architectural Interiors',
    categoryAr: 'ديكور وأثاث معماري',
    rating: 4.94,
    totalSales: 890000,
    verified: true,
    accentColor: '#D1B490',
    badge: 'Sustainable FSC',
    badgeAr: 'معتمد بيئياً FSC',
    inventoryCount: 28,
    joinedYear: 2024,
    supabaseConnected: true,
  },
  {
    id: 'store_khamrah',
    name: 'Khamrah Botanical Parfums',
    nameAr: 'خمرة للعطور النباتية النادرة',
    slug: 'khamrah-botanicals',
    slogan: 'Pure amber nectar, royal taif rose, and wild aged cambodian oud.',
    sloganAr: 'رحيق العنبر النقي والورد الطائفي الملكي ودهن العود الكمبودي المعتق.',
    description: 'Master perfumery utilizing cold-pressed botanicals, wild-harvested resins, and hand-blown crystalline flacons.',
    descriptionAr: 'دار عطور استثنائية تعتمد على تقطير المستخلصات الطبيعية على البارد والراتنجات البرية في قوارير بلورية منفوخة يدوياً.',
    category: 'Haute Parfumerie',
    categoryAr: 'عطور نادرة وفاخرة',
    rating: 4.97,
    totalSales: 630000,
    verified: true,
    accentColor: '#C89666',
    badge: 'Artisanal Batch',
    badgeAr: 'إنتاج حرفي محدود',
    inventoryCount: 19,
    joinedYear: 2023,
    supabaseConnected: true,
  },
  {
    id: 'store_valenti',
    name: 'Valenti Pelletteria Toscana',
    nameAr: 'فالينتي للجلود التوسكانية',
    slug: 'valenti-pelletteria',
    slogan: 'Full-grain vegetable-tanned leather handcrafted in Florence.',
    sloganAr: 'جلد طبيعي نباتي الدباغة ومصنوع يدوياً في فلورنسا الإيطالية.',
    description: 'Bespoke luggage, travel duffels, and minimalist portfolio folios built to acquire a rich patina over decades.',
    descriptionAr: 'حقائب سفر استثنائية ومحافظ جلدية مصممة لتدوم عقوداً وتكتسب بريقاً وتعتيقاً طبيعياً أصيلاً مع مرور الزمن.',
    category: 'Leather Goods',
    categoryAr: 'مصنوعات جلدية فاخرة',
    rating: 4.92,
    totalSales: 510000,
    verified: true,
    accentColor: '#A06D3B',
    badge: 'Consorzio Vera Pelle',
    badgeAr: 'ختم الجلد الطبيعي الإيطالي',
    inventoryCount: 22,
    joinedYear: 2024,
    supabaseConnected: true,
  },
  {
    id: 'store_aerotech',
    name: 'AeroAcoustics Soundworks',
    nameAr: 'إيروأكوستيكس للصوتيات النقية',
    slug: 'aeroacoustics',
    slogan: 'Planar magnetic studio drivers and aerospace-grade beryllium cones.',
    sloganAr: 'مكبرات ومحركات مغناطيسية مسطحة ومخاريط البريليوم الفضائية.',
    description: 'Acoustic laboratory engineering ultra-high fidelity open-back reference monitors and minimalist desktop DAC amplifiers.',
    descriptionAr: 'مختبر هندسي لتصميم سماعات المراقبة المرجعية المفتوحة ومضخمات الصوت التناظرية لعشاق النقاء الصوتي المطلق.',
    category: 'Audiophile Tech',
    categoryAr: 'صوتيات وتقنيات استوديو',
    rating: 4.95,
    totalSales: 740000,
    verified: true,
    accentColor: '#60A5FA',
    badge: 'Hi-Res Certified',
    badgeAr: 'اعتماد الدقة الصوتية الفائقة',
    inventoryCount: 16,
    joinedYear: 2024,
    supabaseConnected: true,
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_chronograph_v1',
    storeId: 'store_horlogerie',
    storeName: 'Maison Horlogère Geneve',
    storeNameAr: 'ميزون أورلوجيري جنيف',
    name: 'Aethelgard Chronometre Titanium Edition',
    nameAr: 'كرونوميتر إيثلغارد إصدار التيتانيوم',
    subtitle: 'Skeleton Calibre 702 with 72-hour power reserve',
    subtitleAr: 'عيار 702 هيكلي مفرغ مع احتياطي طاقة 72 ساعة',
    description: 'Sculpted from Grade 5 titanium with hand-beveled bridges, double anti-reflective sapphire crystals, and integrated quick-release fluororubber strap.',
    descriptionAr: 'منحوتة بدقة متناهية من تيتانيوم الدرجة 5 مع حواف مشطوفة يدوياً، زجاج سفير مزدوج مانع للانعكاس، وحزام مطاطي فلورو مدمج وسريع التبديل.',
    price: 3450,
    originalPrice: 3800,
    category: 'watches',
    categoryAr: 'ساعات فاخرة',
    rating: 4.99,
    reviewsCount: 38,
    stock: 7,
    isFeatured: true,
    sku: 'MHG-AETHEL-TI-01',
    tags: ['Limited Run', 'Grade 5 Titanium', 'Swiss Made', 'Water Resistant 100m'],
    accentBadge: 'Numbered 07/50',
    accentBadgeAr: 'إصدار مرقم 07/50',
    visualGradient: 'from-zinc-900 via-neutral-900 to-amber-950/40',
    specs: [
      { label: 'Movement', labelAr: 'الحركة', value: 'Manual-wind Calibre MH-702 (28,800 vph)', valueAr: 'يدوية التعبئة عيار MH-702 (28,800 ذبذبة/ساعة)' },
      { label: 'Case Diameter', labelAr: 'قطر الهيكل', value: '40.5 mm × 9.8 mm thickness', valueAr: '40.5 مم × سماكة 9.8 مم' },
      { label: 'Material', labelAr: 'المادة', value: 'Aerospace Grade 5 Titanium', valueAr: 'تيتانيوم فضائي درجة 5' },
      { label: 'Crystal', labelAr: 'الزجاج', value: 'Box Sapphire with AR Coating', valueAr: 'سفير كريستال صندوقي مع طلاء مضاد للانعكاس' },
      { label: 'Power Reserve', labelAr: 'احتياطي الطاقة', value: '72 Hours Chronometer', valueAr: '72 ساعة بدقة كرونوميتر' }
    ],
    variants: [
      { name: 'Dial Finish', nameAr: 'لون الميناء', options: ['Anthracite Grey', 'Royal Cobalt', 'Obsidian Black'] },
      { name: 'Strap', nameAr: 'نوع الحزام', options: ['Textured FKM Rubber', 'Hand-Stitched Alligator'] }
    ]
  },
  {
    id: 'prod_boucle_chair_v1',
    storeId: 'store_nordic',
    storeName: 'Nordic Living Atelier',
    storeNameAr: 'أتيليه نوررديك ليفينج',
    name: 'Kobenhavn Sculptural Bouclé Armchair',
    nameAr: 'كرسي كوبنهاغن النحتي من نسيج البوكليه',
    subtitle: 'Heavy Italian wool boucle with FSC-certified smoked oak base',
    subtitleAr: 'صوف بوكليه إيطالي فاخر مع قاعدة من خشب البلوط المدخن المعتمد',
    description: 'An architectural lounge chair designed to provide ergonomic cradle comfort while existing as a sculptural monolithic statement piece in any room.',
    descriptionAr: 'كرسي استرخاء معماري مصمم ليمنح راحة استثنائية مع الاحتفاظ بحضور نحتي متفرد كتحفة فنية في الصالات الحديثة.',
    price: 1890,
    originalPrice: 2200,
    category: 'interiors',
    categoryAr: 'ديكور وأثاث معماري',
    rating: 4.95,
    reviewsCount: 52,
    stock: 12,
    isFeatured: true,
    sku: 'NLA-KBN-CHR-08',
    tags: ['Handcrafted', 'Italian Bouclé', 'Smoked Oak', 'Ergonomic'],
    accentBadge: 'Atelier Signature',
    accentBadgeAr: 'توقيع الأتيليه الخاص',
    visualGradient: 'from-stone-900 via-neutral-900 to-amber-950/30',
    specs: [
      { label: 'Upholstery', labelAr: 'القماش', value: '92% Italian Wool, 8% Polyamide Bouclé', valueAr: '92% صوف إيطالي، 8% بولياميد بوكليه' },
      { label: 'Dimensions', labelAr: 'الأبعاد', value: '88 cm W × 82 cm D × 74 cm H', valueAr: '88 سم عرض × 82 سم عمق × 74 سم ارتفاع' },
      { label: 'Frame', labelAr: 'الهيكل', value: 'Kiln-Dried European Smoked Oak', valueAr: 'خشب بلوط أوروبي مجفف بالفرن' },
      { label: 'Weight', labelAr: 'الوزن', value: '26 kg Solid Construction', valueAr: '26 كغم هيكل متين صلب' }
    ],
    variants: [
      { name: 'Color', nameAr: 'اللون', options: ['Oatmeal Ivory', 'Charcoal Heather', 'Warm Camel'] },
      { name: 'Wood Finish', nameAr: 'تشطيب الخشب', options: ['Smoked Oak', 'Natural White Oak'] }
    ]
  },
  {
    id: 'prod_amber_oud_perfume',
    storeId: 'store_khamrah',
    storeName: 'Khamrah Botanical Parfums',
    storeNameAr: 'خمرة للعطور النباتية النادرة',
    name: 'Ambre Imperial & Royal Oud Extraits',
    nameAr: 'عطر عنبر إمبريال وخلاصة العود الملكي',
    subtitle: '35% Extrait concentration with 12-year wild cambodian agarwood',
    subtitleAr: 'تركيز خالص 35% بخلاصة خشب العود الكمبودي المعتق 12 عاماً',
    description: 'An opulent opening of honeyed dates, toasted cardamom, and cinnamon quill slowly resolving into resinous benzoin, sweet myrrh, and aged cambodian oud.',
    descriptionAr: 'افتتاحية غنية من التمور المعسلة، الهيل المحمص، ولمسات القرفة التي تنصهر تدريجياً في دفء البنزوين، المر العطري، والعود الكمبودي النادر.',
    price: 480,
    originalPrice: 560,
    category: 'fragrance',
    categoryAr: 'عطور نادرة وفاخرة',
    rating: 4.98,
    reviewsCount: 114,
    stock: 24,
    isFeatured: true,
    sku: 'KHM-AMB-EXT-100',
    tags: ['Extrait de Parfum', 'Natural Resins', 'Cruelty Free', 'High Sillage'],
    accentBadge: 'Reserve Flacon',
    accentBadgeAr: 'زجاجة الاحتياط الخاص',
    visualGradient: 'from-amber-950 via-stone-900 to-neutral-900',
    specs: [
      { label: 'Volume', labelAr: 'الحجم', value: '100 ml / 3.4 fl. oz.', valueAr: '100 مل / 3.4 أونصة' },
      { label: 'Concentration', labelAr: 'التركيز', value: 'Pure Extrait de Parfum (35%)', valueAr: 'خلاصة عطرية نقية (35%)' },
      { label: 'Longevity', labelAr: 'الثبات', value: '18+ Hours on Skin / 48h on Fabrics', valueAr: 'أكثر من 18 ساعة على البشرة و48 ساعة على الأقمشة' },
      { label: 'Flacon', labelAr: 'القارورة', value: 'Heavy French Crystal with Solid Brass Cap', valueAr: 'كريستال فرنسي فاخر مع غطاء نحاسي مصبوب' }
    ],
    variants: [
      { name: 'Edition', nameAr: 'الإصدار', options: ['Signature 100ml', 'Travel Set (3 × 15ml)'] }
    ]
  },
  {
    id: 'prod_leather_duffle_bag',
    storeId: 'store_valenti',
    storeName: 'Valenti Pelletteria Toscana',
    storeNameAr: 'فالينتي للجلود التوسكانية',
    name: 'Firenze Weekender Cognac Leather Duffle',
    nameAr: 'حقيبة سفر فيرينزي من الجلد التوسكاني الفاخر',
    subtitle: 'Full-grain vegetable-tanned Tuscan calfskin with solid brass fittings',
    subtitleAr: 'جلد عجل توسكاني كامل الحبيبات مدبوغ نباتياً مع سحابات نحاسية صلبة',
    description: 'Masterfully stitched in Florence, this heirloom duffle features a dedicated padded laptop compartment, ventilated shoe sleeve, and detachable shoulder sling.',
    descriptionAr: 'حياكة يدوية متقنة في فلورنسا، تتميز الحقيبة بجيب مبطن للأجهزة المحمولة، مقصورة أحذية جيدة التهوية، وحزام كتف جلدي مريح وقابل للفصل.',
    price: 890,
    originalPrice: 1050,
    category: 'leather',
    categoryAr: 'مصنوعات جلدية فاخرة',
    rating: 4.93,
    reviewsCount: 47,
    stock: 9,
    isFeatured: true,
    sku: 'VPL-FRZ-WKN-CGN',
    tags: ['Tuscan Leather', 'Lifetime Stitch Warranty', 'Solid Brass', 'YKK Excella'],
    accentBadge: 'Handcrafted in Italy',
    accentBadgeAr: 'صناعة يدوية في إيطاليا',
    visualGradient: 'from-amber-950/70 via-stone-900 to-zinc-950',
    specs: [
      { label: 'Leather Origin', labelAr: 'مصدر الجلد', value: 'Ponte a Egola, Tuscany, Italy', valueAr: 'بونتي أ إيغولا، توسكانا، إيطاليا' },
      { label: 'Dimensions', labelAr: 'المقاسات', value: '52 cm L × 28 cm W × 30 cm H (42 Liters)', valueAr: '52 سم طول × 28 سم عرض × 30 سم ارتفاع (42 لتر)' },
      { label: 'Hardware', labelAr: 'الملحقات المعدنية', value: 'Antiqued Cast Brass Zippers & Buckles', valueAr: 'سحابات ومشابك نحاس أثري معتق' },
      { label: 'Lining', labelAr: 'البطانة', value: 'Water-Repellent Herringbone Heavy Canvas', valueAr: 'قماش كانفاس هيرينغبون المقاوم للماء' }
    ],
    variants: [
      { name: 'Leather Tone', nameAr: 'درجة اللون', options: ['Vintage Cognac', 'Espresso Dark Brown', 'Nocturne Black'] }
    ]
  },
  {
    id: 'prod_audiophile_monitors',
    storeId: 'store_aerotech',
    storeName: 'AeroAcoustics Soundworks',
    storeNameAr: 'إيروأكوستيكس للصوتيات النقية',
    name: 'Aero-Monolith Planar Open-Back Headphones',
    nameAr: 'سماعات إيرو-مونوليث المرجعية ذات الغشاء المغناطيسي المسطح',
    subtitle: '98mm Planar Magnetic Diaphragm with carbon fiber damping',
    subtitleAr: 'غشاء مغناطيسي مسطح 98 مم مع مخمدات من ألياف الكربون',
    description: 'Designed for mastering engineers and discerning listeners. Offers sub-bass extension down to 8Hz, vanishingly low THD (0.03%), and supreme spatial imaging.',
    descriptionAr: 'مصممة لمهندسي الصوت والمستمعين النخبويين. تقدم استجابة ترددية عميقة تصل إلى 8 هرتز، وتشوهاً توافقياً شبه معدوم (0.03%)، ومسرحاً صوتياً ثلاثي الأبعاد.',
    price: 1450,
    originalPrice: 1650,
    category: 'audio',
    categoryAr: 'صوتيات وتقنيات استوديو',
    rating: 4.96,
    reviewsCount: 63,
    stock: 15,
    isFeatured: true,
    sku: 'AAT-MONO-PLN-01',
    tags: ['Planar Magnetic', 'Beryllium Drivers', 'Carbon Fiber', 'Balanced 4.4mm'],
    accentBadge: 'Audiophile Grade',
    accentBadgeAr: 'درجة صوتيات مرجعية',
    visualGradient: 'from-slate-900 via-neutral-900 to-blue-950/40',
    specs: [
      { label: 'Transducer Type', labelAr: 'نوع المشغل', value: '98mm Ultra-Thin Planar Magnetic', valueAr: 'مغناطيسي مسطح فائق الرقة 98 مم' },
      { label: 'Frequency Response', labelAr: 'الاستجابة الترددية', value: '8 Hz – 55,000 Hz', valueAr: '8 هرتز – 55,000 هرتز' },
      { label: 'Impedance', labelAr: 'المقاومة', value: '32 Ohms (Easy to Drive)', valueAr: '32 أوم (سهلة التشغيل والمواءمة)' },
      { label: 'Cable', labelAr: 'الكابل', value: '8-Core Monocrystalline Silver-Plated Copper', valueAr: 'نحاس أحادي التبلور مطلي بالفضة بـ 8 أنوية' }
    ],
    variants: [
      { name: 'Chassis Finish', nameAr: 'الهيكل', options: ['Brushed Matte Gunmetal', 'Anodized Silver'] },
      { name: 'Pads', nameAr: 'وسادات الأذن', options: ['Lambskin Leather', 'Hybrid Perforated Velour'] }
    ]
  },
  {
    id: 'prod_chronograph_v2_monochrome',
    storeId: 'store_horlogerie',
    storeName: 'Maison Horlogère Geneve',
    storeNameAr: 'ميزون أورلوجيري جنيف',
    name: 'Vanguard GMT Dual-Timepiece Rose Gold',
    nameAr: 'ساعة فانجارد جي إم تي التوقيت المزدوج من الذهب الوردي',
    subtitle: 'Calibre MH-880 with 24-city rotating world-time bezel',
    subtitleAr: 'عيار MH-880 مع إطار دوار للتوقيت العالمي لـ 24 عاصمة',
    description: 'Handcrafted 18k Rose Gold case enclosing a guilloché enamel world dial, displaying dual time zones with effortless crown adjustment.',
    descriptionAr: 'هيكل مصقول يدوياً من الذهب الوردي عيار 18 قيراطاً يحتضن ميناء مينا مزخرف بنقوش غيوشيه، يعرض توقيتين مختلفين بضغطة زر واحدة.',
    price: 4950,
    originalPrice: 5400,
    category: 'watches',
    categoryAr: 'ساعات فاخرة',
    rating: 4.97,
    reviewsCount: 22,
    stock: 4,
    isFeatured: false,
    sku: 'MHG-VNG-GMT-RG',
    tags: ['18k Rose Gold', 'Dual-Time GMT', 'Guilloché Dial', 'Swiss Certified'],
    accentBadge: 'Collector Edition',
    accentBadgeAr: 'إصدار هواة الجمع',
    visualGradient: 'from-amber-950/80 via-neutral-900 to-stone-900',
    specs: [
      { label: 'Movement', labelAr: 'الحركة', value: 'Automatic Calibre MH-880 GMT', valueAr: 'أوتوماتيكية عيار MH-880 GMT' },
      { label: 'Case Material', labelAr: 'مادة الهيكل', value: '18k 4N Solid Rose Gold', valueAr: 'ذهب وردي خالص عيار 18 قيراط' },
      { label: 'Diameter', labelAr: 'القطر', value: '41 mm × 11.2 mm', valueAr: '41 مم × 11.2 مم' },
      { label: 'Strap', labelAr: 'السوار', value: 'Louisiana Mississippiensis Alligator', valueAr: 'جلد تمساح لويزيانا المعتمد' }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_10842',
    orderNumber: 'SQF-2026-10842',
    customer: {
      fullName: 'خالد عبد الله المنصور',
      email: 'khalid.mansour@domain.sa',
      phone: '+966 50 123 4567',
      address: 'طريق الملك فهد، حي النخيل، برج 4، شقة 1802',
      city: 'الرياض',
      postalCode: '11564'
    },
    items: [
      {
        id: 'item_1',
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedVariants: { 'Dial Finish': 'Anthracite Grey', 'Strap': 'Textured FKM Rubber' }
      }
    ],
    subtotal: 3450,
    discount: 0,
    shipping: 0,
    total: 3450,
    currency: 'USD',
    status: 'processing',
    paymentMethod: 'apple_pay',
    createdAt: '2026-10-18T16:32:00Z',
    storeId: 'store_horlogerie',
    trackingNumber: 'DHL-EX-849201948',
    notes: 'توصيل سريع خاص مع تأمين كامل على الشحنة'
  },
  {
    id: 'ord_10841',
    orderNumber: 'SQF-2026-10841',
    customer: {
      fullName: 'سارة عبد العزيز الشامسي',
      email: 'sara.alshamsi@domain.ae',
      phone: '+971 52 987 6543',
      address: 'جزيرة السعديات، فيلا 42، مجمع اللوتس',
      city: 'أبوظبي',
      postalCode: '20491'
    },
    items: [
      {
        id: 'item_2',
        product: INITIAL_PRODUCTS[2],
        quantity: 2,
        selectedVariants: { 'Edition': 'Signature 100ml' }
      },
      {
        id: 'item_3',
        product: INITIAL_PRODUCTS[3],
        quantity: 1,
        selectedVariants: { 'Leather Tone': 'Vintage Cognac' }
      }
    ],
    subtotal: 1850,
    discount: 100,
    shipping: 0,
    total: 1750,
    currency: 'USD',
    status: 'shipped',
    paymentMethod: 'credit_card',
    createdAt: '2026-10-17T11:20:00Z',
    storeId: 'store_khamrah',
    trackingNumber: 'FEDEX-PRIO-33920188',
    notes: 'مغلفة كهدية فاخرة مع رسالة إهداء خاصة'
  },
  {
    id: 'ord_10840',
    orderNumber: 'SQF-2026-10840',
    customer: {
      fullName: 'Mohammed Al-Ghamdi',
      email: 'm.alghamdi@domain.com',
      phone: '+966 55 443 2211',
      address: 'Corniche Road, Al-Shati District',
      city: 'Jeddah',
      postalCode: '21453'
    },
    items: [
      {
        id: 'item_4',
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        selectedVariants: { 'Color': 'Oatmeal Ivory', 'Wood Finish': 'Smoked Oak' }
      }
    ],
    subtotal: 1890,
    discount: 0,
    shipping: 80,
    total: 1970,
    currency: 'USD',
    status: 'delivered',
    paymentMethod: 'mada',
    createdAt: '2026-10-15T09:15:00Z',
    storeId: 'store_nordic',
    trackingNumber: 'ARAMEX-EXP-99201411'
  }
];

export const INITIAL_SUPABASE_CONFIG: SupabaseConfig = {
  projectUrl: 'https://xyzcompany.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc0OTIwMCwiZXhwIjoyMDE0MzI1MjAwfQ.example_signature_token',
  isConnected: true,
  lastSyncTime: '2026-10-18T20:30:00Z',
  syncStatus: 'success',
  tablesSynced: {
    stores: 5,
    products: 6,
    orders: 3,
    customers: 3
  }
};

export const INITIAL_GITHUB_CONFIG: GitHubConfig = {
  repoUrl: 'https://github.com/souqify-org/souqify-marketplace-engine',
  branch: 'main',
  lastCommitHash: '7f9a2e4',
  lastCommitMessage: 'feat(core): luxury multi-vendor marketplace + supabase schema sync v2.4',
  autoDeployEnabled: true,
  connected: true
};

export const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string; symbolAr: string }> = {
  USD: { rate: 1, symbol: '$', symbolAr: '$' },
  SAR: { rate: 3.75, symbol: 'SAR', symbolAr: 'ر.س' },
  AED: { rate: 3.67, symbol: 'AED', symbolAr: 'د.إ' },
  EUR: { rate: 0.92, symbol: '€', symbolAr: '€' }
};
