import React, { useState, useMemo } from 'react';
import { Product, Store, Currency, Language } from '../types';
import { ProductVisual } from './ProductVisual';
import { CURRENCY_RATES } from '../data/initialData';
import { Star, ShoppingBag, Eye, Check, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface MarketplaceViewProps {
  products: Product[];
  stores: Store[];
  currency: Currency;
  language: Language;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectStore: (store: Store) => void;
  searchQuery: string;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  products,
  stores,
  currency,
  language,
  onSelectProduct,
  onAddToCart,
  onSelectStore,
  searchQuery
}) => {
  const isAr = language === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: isAr ? 'جميع المعروضات' : 'All Collections' },
    { id: 'watches', label: isAr ? 'ساعات فاخرة' : 'Haute Horlogerie' },
    { id: 'interiors', label: isAr ? 'ديكور وأثاث' : 'Interiors & Decor' },
    { id: 'fragrance', label: isAr ? 'عطور نادرة' : 'Fragrance Extraits' },
    { id: 'leather', label: isAr ? 'مصنوعات جلدية' : 'Fine Leather' },
    { id: 'audio', label: isAr ? 'صوتيات وتقنيات' : 'Audiophile Studio' },
  ];

  const formatPrice = (usdAmount: number) => {
    const rateInfo = CURRENCY_RATES[currency];
    const converted = Math.round(usdAmount * rateInfo.rate);
    return `${converted.toLocaleString()} ${isAr ? rateInfo.symbolAr : rateInfo.symbol}`;
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1500);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      // Store filter
      if (selectedStoreId !== 'all' && p.storeId !== selectedStoreId) return false;
      // In stock filter
      if (onlyInStock && p.stock <= 0) return false;
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query) || p.nameAr.includes(query);
        const matchStore = p.storeName.toLowerCase().includes(query) || p.storeNameAr.includes(query);
        const matchSku = p.sku.toLowerCase().includes(query);
        const matchTag = p.tags.some(t => t.toLowerCase().includes(query));
        if (!matchName && !matchStore && !matchSku && !matchTag) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedStoreId, onlyInStock, searchQuery, sortBy]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-500/90 font-mono">
            {isAr ? 'كتالوج المنتجات الحصري' : 'CURATED MARKETPLACE'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100 mt-1">
            {isAr ? 'معروضات المتاجر المستقلة' : 'Independent Atelier Masterpieces'}
          </h2>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-2 font-mono tabular-nums">
            <span>{filteredProducts.length} {isAr ? 'قطعة معروضة' : 'items available'}</span>
            <span aria-hidden="true">·</span>
            <span>{stores.length} {isAr ? 'متاجر معتمدة' : 'verified boutiques'}</span>
            <span aria-hidden="true">·</span>
            <span>{isAr ? 'شحن دولي مباشر' : 'Worldwide Escrow Delivery'}</span>
          </div>
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Store Selector */}
          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-amber-500 transition-colors"
            aria-label="Filter by boutique"
          >
            <option value="all">{isAr ? 'جميع المتاجر' : 'All Boutiques'}</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {isAr ? s.nameAr : s.name}
              </option>
            ))}
          </select>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-neutral-300 focus:outline-none cursor-pointer"
              aria-label="Sort products"
            >
              <option value="featured" className="bg-neutral-900">{isAr ? 'الأكثر تميزاً' : 'Curated / Featured'}</option>
              <option value="price_asc" className="bg-neutral-900">{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              <option value="price_desc" className="bg-neutral-900">{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              <option value="rating" className="bg-neutral-900">{isAr ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
            </select>
          </div>

          {/* In-Stock Toggle */}
          <button
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`px-3 py-2 text-xs rounded-lg border transition-colors flex items-center gap-1.5 ${
              onlyInStock
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyInStock ? 'bg-amber-400' : 'bg-neutral-600'}`} />
            <span>{isAr ? 'المتوفر في المخزون فقط' : 'In Stock Only'}</span>
          </button>
        </div>
      </div>

      {/* Category Segmented Tabs (Interactive Filter Controls) */}
      <div className="flex items-center gap-2 overflow-x-auto py-6 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all duration-200 ${
                isActive
                  ? 'bg-neutral-100 text-neutral-950 font-bold shadow-md shadow-white/5'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850 border border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Active Search / Filters indicator */}
      {(searchQuery || selectedCategory !== 'all' || selectedStoreId !== 'all') && (
        <div className="flex items-center justify-between pb-6 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span>{isAr ? 'تصفية مفعلة:' : 'Active filters:'}</span>
            {searchQuery && (
              <span className="text-amber-400">"{searchQuery}"</span>
            )}
            {selectedCategory !== 'all' && (
              <span className="text-neutral-300">· {categories.find(c => c.id === selectedCategory)?.label}</span>
            )}
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedStoreId('all');
            }}
            className="text-amber-400 hover:underline"
          >
            {isAr ? 'إعادة ضبط الفلاتر' : 'Reset all'}
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 rounded-2xl bg-neutral-900/30 border border-neutral-850">
          <SlidersHorizontal className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-neutral-200">
            {isAr ? 'لم نجد قطعاً مطابقة لبحثك' : 'No items match your criteria'}
          </h3>
          <p className="text-sm text-neutral-500 max-w-md mx-auto mt-2">
            {isAr
              ? 'جرّب البحث بكلمات مختلفة أو إزالة الفلاتر الحالية لعرض جميع المنتجات.'
              : 'Try clearing the search query or adjusting your filters to see more results.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedStoreId('all');
            }}
            className="mt-6 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors"
          >
            {isAr ? 'عرض جميع المعروضات' : 'View All Products'}
          </button>
        </div>
      ) : (
        /* 3-Column Product Grid Desktop / 2-Column Tablet / 1-Column Mobile */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const store = stores.find((s) => s.id === product.storeId);
            const isAdded = addedProductId === product.id;

            return (
              <article
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group relative flex flex-col rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Visual Area (65-75% height ratio) */}
                <ProductVisual product={product} />

                {/* Card Body */}
                <div className="flex flex-col flex-1 p-5 justify-between">
                  <div>
                    {/* Brand / Boutique Attribution link & Category */}
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (store) onSelectStore(store);
                        }}
                        className="hover:text-amber-400 font-medium transition-colors truncate max-w-[180px]"
                        title={isAr ? product.storeNameAr : product.storeName}
                      >
                        {isAr ? product.storeNameAr : product.storeName}
                      </button>

                      <div className="flex items-center gap-1 text-amber-400 font-mono text-[11px] tabular-nums shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-neutral-500">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Product Title */}
                    <h3 className="text-base font-semibold text-neutral-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                      {isAr ? product.nameAr : product.name}
                    </h3>

                    {/* Subtitle / Key spec */}
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {isAr ? product.subtitleAr : product.subtitle}
                    </p>
                  </div>

                  {/* Price & Buy Action Row */}
                  <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-neutral-100 font-mono tabular-nums">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs line-through text-neutral-500 font-mono tabular-nums">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        {isAr ? 'شامل الضريبة والشحن الفاخر' : 'Incl. taxes & insured shipping'}
                      </span>
                    </div>

                    {/* Quick Add CTA */}
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      disabled={product.stock <= 0}
                      className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 shrink-0 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : product.stock <= 0
                          ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                          : 'bg-neutral-800 hover:bg-amber-400 hover:text-neutral-950 text-neutral-200'
                      }`}
                      aria-label="Add to cart"
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>{isAr ? 'أُضيفت' : 'Added'}</span>
                        </>
                      ) : product.stock <= 0 ? (
                        <span>{isAr ? 'نفد' : 'Sold Out'}</span>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{isAr ? 'إضافة' : 'Add'}</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </article>
            );
          })}
        </div>
      )}

    </section>
  );
};
