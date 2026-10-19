import React, { useState, useEffect } from 'react';
import { 
  Currency, Language, Store, Product, Order, CartItem, 
  SupabaseConfig, GitHubConfig 
} from './types';
import { 
  INITIAL_STORES, INITIAL_PRODUCTS, INITIAL_ORDERS, 
  INITIAL_SUPABASE_CONFIG, INITIAL_GITHUB_CONFIG 
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MarketplaceView } from './components/MarketplaceView';
import { BoutiquesShowcase } from './components/BoutiquesShowcase';
import { MerchantStudio } from './components/MerchantStudio';
import { SupabaseGitHubSync } from './components/SupabaseGitHubSyncModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [currentTab, setCurrentTab] = useState<'marketplace' | 'boutiques' | 'merchant' | 'sync'>('marketplace');
  
  // Data State
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Search & Navigation State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMerchantStoreId, setActiveMerchantStoreId] = useState<string>(INITIAL_STORES[0].id);
  
  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [activeDiscountPercent, setActiveDiscountPercent] = useState<number>(0);

  // Supabase & GitHub Sync State
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(INITIAL_SUPABASE_CONFIG);
  const [gitHubConfig, setGitHubConfig] = useState<GitHubConfig>(INITIAL_GITHUB_CONFIG);

  // Sync HTML dir and lang
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, selectedVariants?: Record<string, string>) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
      );

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }

      return [
        ...prev,
        {
          id: `cart_${Date.now()}_${Math.random()}`,
          product,
          quantity,
          selectedVariants
        }
      ];
    });
  };

  const handleUpdateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleInstantCheckout = (product: Product, quantity = 1, selectedVariants?: Record<string, string>) => {
    setSelectedProduct(null);
    setCartItems([
      {
        id: `cart_instant_${Date.now()}`,
        product,
        quantity,
        selectedVariants
      }
    ]);
    setIsCheckoutOpen(true);
  };

  const handleProceedToCheckout = (discountPercent: number) => {
    setActiveDiscountPercent(discountPercent);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    
    // Update Supabase tables synced count
    setSupabaseConfig((prev) => ({
      ...prev,
      lastSyncTime: new Date().toISOString(),
      tablesSynced: {
        ...prev.tablesSynced,
        orders: prev.tablesSynced.orders + 1
      }
    }));
  };

  // Merchant operations
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    // update store inventory count
    setStores((prev) =>
      prev.map((s) =>
        s.id === newProduct.storeId ? { ...s, inventoryCount: s.inventoryCount + 1 } : s
      )
    );
    // update Supabase tables count
    setSupabaseConfig((prev) => ({
      ...prev,
      lastSyncTime: new Date().toISOString(),
      tablesSynced: {
        ...prev.tablesSynced,
        products: prev.tablesSynced.products + 1
      }
    }));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleCreateStore = (newStore: Store) => {
    setStores((prev) => [...prev, newStore]);
    setSupabaseConfig((prev) => ({
      ...prev,
      lastSyncTime: new Date().toISOString(),
      tablesSynced: {
        ...prev.tablesSynced,
        stores: prev.tablesSynced.stores + 1
      }
    }));
  };

  const handleSelectStoreFromShowcase = (store: Store) => {
    setSearchQuery(language === 'ar' ? store.nameAr : store.name);
    setCurrentTab('marketplace');
  };

  const handleManageStoreFromShowcase = (store: Store) => {
    setActiveMerchantStoreId(store.id);
    setCurrentTab('merchant');
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-amber-500/20 selection:text-amber-300">
      
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currency={currency}
        setCurrency={setCurrency}
        language={language}
        setLanguage={setLanguage}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeStoreName={stores.find((s) => s.id === activeMerchantStoreId)?.name}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'marketplace' && (
          <>
            <HeroSection
              language={language}
              currency={currency}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onExploreBoutiques={() => setCurrentTab('boutiques')}
              onOpenSync={() => setCurrentTab('sync')}
            />
            <MarketplaceView
              products={products}
              stores={stores}
              currency={currency}
              language={language}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToCart={handleAddToCart}
              onSelectStore={handleSelectStoreFromShowcase}
              searchQuery={searchQuery}
            />
          </>
        )}

        {currentTab === 'boutiques' && (
          <BoutiquesShowcase
            stores={stores}
            language={language}
            currency={currency}
            onSelectStore={handleSelectStoreFromShowcase}
            onManageStore={handleManageStoreFromShowcase}
          />
        )}

        {currentTab === 'merchant' && (
          <MerchantStudio
            stores={stores}
            products={products}
            orders={orders}
            activeStoreId={activeMerchantStoreId}
            setActiveStoreId={setActiveMerchantStoreId}
            currency={currency}
            language={language}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onCreateStore={handleCreateStore}
          />
        )}

        {currentTab === 'sync' && (
          <SupabaseGitHubSync
            supabaseConfig={supabaseConfig}
            setSupabaseConfig={setSupabaseConfig}
            gitHubConfig={gitHubConfig}
            setGitHubConfig={setGitHubConfig}
            language={language}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onNavigateTab={setCurrentTab}
      />

      {/* Product Detail Modal (PDP) */}
      <ProductDetailModal
        product={selectedProduct}
        store={stores.find((s) => s.id === selectedProduct?.storeId)}
        currency={currency}
        language={language}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty, variants) => {
          handleAddToCart(p, qty, variants);
        }}
        onInstantCheckout={handleInstantCheckout}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        language={language}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currency={currency}
        language={language}
        discountPercent={activeDiscountPercent}
        onOrderCompleted={handleOrderCompleted}
      />

    </div>
  );
}
