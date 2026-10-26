import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, OrderModel, FilterState } from './types';
import { fetchProducts, fetchCategories, clearApiCache } from './services/api';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { FilterDrawer } from './components/FilterDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { FlutterCodeViewer } from './components/FlutterCodeViewer';
import { MobileFrame } from './components/MobileFrame';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  ShoppingBag,
  Heart,
  ShoppingCart,
  User,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  RefreshCw,
  Sun,
  Moon,
  ExternalLink,
  Code2,
  Package,
} from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('shopora_theme') as 'light' | 'dark') || 'light';
  });

  // Mobile simulator frame toggle
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'wishlist' | 'cart' | 'profile'>('home');

  // Product API data state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cart & Wishlist persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('shopora_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders history
  const [orders, setOrders] = useState<OrderModel[]>(() => {
    try {
      const saved = localStorage.getItem('shopora_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filters state
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    selectedCategory: null,
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'featured',
  });

  // Modals & Panels
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isCodeViewerOpen, setIsCodeViewerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme synchronization
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('shopora_theme', theme);
  }, [theme]);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('shopora_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem('shopora_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Persist orders
  useEffect(() => {
    localStorage.setItem('shopora_orders', JSON.stringify(orders));
  }, [orders]);

  // Fetch initial API data
  const loadData = async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([
        fetchProducts(forceRefresh),
        fetchCategories(forceRefresh),
      ]);
      setProducts(prods);
      setCategories(cats);

      // Determine catalog max price
      if (prods.length > 0) {
        const highestPrice = Math.max(...prods.map((p) => p.price));
        setFilterState((prev) => ({
          ...prev,
          maxPrice: Math.ceil(highestPrice),
        }));
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Failed to connect to FakeStore API.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.title.slice(0, 24)}..." to bag`);
  };

  const handleUpdateQuantity = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const handleClearCart = () => {
    if (window.confirm('Clear all items from your shopping bag?')) {
      setCart([]);
      showToast('Shopping bag cleared');
    }
  };

  // Wishlist operations
  const handleToggleFavorite = (product: Product) => {
    const isFav = wishlistIds.includes(product.id);
    if (isFav) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast('Removed from wishlist');
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      showToast('Added to wishlist');
    }
  };

  // Filtered and sorted products
  const maxCatalogPrice = useMemo(() => {
    if (products.length === 0) return 1000;
    return Math.ceil(Math.max(...products.map((p) => p.price)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (filterState.selectedCategory) {
      result = result.filter(
        (p) => p.category.toLowerCase() === filterState.selectedCategory?.toLowerCase()
      );
    }

    // 3. Price Filter
    result = result.filter((p) => p.price <= filterState.maxPrice);

    // 4. Sorting
    switch (filterState.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating-desc':
        result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      case 'featured':
      default:
        break;
    }

    return result;
  }, [products, filterState]);

  // Cart financial totals
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const cartTax = cartSubtotal * 0.08;
  const cartShipping = cartSubtotal > 75 || cart.length === 0 ? 0 : 9.99;
  const cartTotal = cart.length === 0 ? 0 : cartSubtotal + cartTax + cartShipping;

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  // Reset filters
  const handleResetFilters = () => {
    setFilterState({
      searchQuery: '',
      selectedCategory: null,
      minPrice: 0,
      maxPrice: maxCatalogPrice,
      sortBy: 'featured',
    });
  };

  const hasActiveFilters =
    Boolean(filterState.searchQuery) ||
    Boolean(filterState.selectedCategory) ||
    filterState.maxPrice < maxCatalogPrice ||
    filterState.sortBy !== 'featured';

  return (
    <MobileFrame
      isMobileFrame={isMobileFrame}
      onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
    >
      <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
        {/* Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={(tab: any) => setActiveTab(tab)}
          cartCount={totalCartCount}
          wishlistCount={wishlistIds.length}
          isDark={theme === 'dark'}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
          onOpenCodeViewer={() => setIsCodeViewerOpen(true)}
        />

        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-xl text-xs font-semibold shadow-xl border border-slate-700/50 flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {isLoading ? (
            /* Skeleton Loading Grid */
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <div className="h-64 sm:h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse mb-8" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 animate-pulse space-y-3"
                  >
                    <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl" />
                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            /* Error State with Retry */
            <div className="max-w-md mx-auto px-4 py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-4">
                <RefreshCw className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Unable to Connect to FakeStore API
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{error}</p>
              <button
                onClick={() => loadData(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Connection
              </button>
            </div>
          ) : (
            <>
              {/* TAB 1: HOME */}
              {activeTab === 'home' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
                  {/* Hero Banner */}
                  <HeroBanner onExplore={() => setActiveTab('catalog')} />

                  {/* Search Bar Prompt */}
                  <div className="relative">
                    <div
                      onClick={() => setActiveTab('catalog')}
                      className="cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between gap-3 text-slate-400 hover:border-indigo-500/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Search className="w-5 h-5 text-indigo-500" />
                        <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                          Search 20+ live curated products, jackets, gold, SSDs...
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Filter</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Category Chips */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                        Browse by Category
                      </h2>
                      <button
                        onClick={() => {
                          setFilterState((prev) => ({ ...prev, selectedCategory: null }));
                          setActiveTab('catalog');
                        }}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                      <button
                        onClick={() =>
                          setFilterState((prev) => ({ ...prev, selectedCategory: null }))
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                          filterState.selectedCategory === null
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => {
                        const isSelected = filterState.selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() =>
                              setFilterState((prev) => ({
                                ...prev,
                                selectedCategory: isSelected ? null : cat,
                              }))
                            }
                            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-colors shrink-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Featured Collection Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                          {filterState.selectedCategory
                            ? `Collection: ${filterState.selectedCategory.toUpperCase()}`
                            : 'Curated Essentials'}
                        </h2>
                        <span className="text-xs text-slate-500">
                          {filteredProducts.length} authentic products available
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveTab('catalog')}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Explore Catalog →
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                      {filteredProducts.slice(0, 8).map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isFavorite={wishlistIds.includes(product.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onAddToCart={handleAddToCart}
                          onClick={(p) => setSelectedProduct(p)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CATALOG & SEARCH */}
              {activeTab === 'catalog' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                  {/* Search Bar & Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={filterState.searchQuery}
                        onChange={(e) =>
                          setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))
                        }
                        placeholder="Search products by title or description..."
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                      />
                      {filterState.searchQuery && (
                        <button
                          onClick={() => setFilterState((prev) => ({ ...prev, searchQuery: '' }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsFilterOpen(true)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                          hasActiveFilters
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Filter & Sort</span>
                        {hasActiveFilters && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </button>

                      {hasActiveFilters && (
                        <button
                          onClick={handleResetFilters}
                          title="Reset All Filters"
                          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Horizontal Category Chips */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <button
                      onClick={() =>
                        setFilterState((prev) => ({ ...prev, selectedCategory: null }))
                      }
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                        filterState.selectedCategory === null
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      All Items
                    </button>
                    {categories.map((cat) => {
                      const isSelected = filterState.selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() =>
                            setFilterState((prev) => ({
                              ...prev,
                              selectedCategory: isSelected ? null : cat,
                            }))
                          }
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Result Header */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{filteredProducts.length} items found</span>
                    <button
                      onClick={() => setIsFilterOpen(true)}
                      className="font-medium text-indigo-600 dark:text-indigo-400 capitalize"
                    >
                      Sort: {filterState.sortBy.replace('-', ' ')}
                    </button>
                  </div>

                  {/* Product Grid or Empty State */}
                  {filteredProducts.length === 0 ? (
                    <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8">
                      <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
                        <Search className="w-6 h-6" />
                      </div>
                      <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mb-1">
                        No Products Match Your Criteria
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
                        Try clearing your search terms, expanding your price range, or selecting a different category.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isFavorite={wishlistIds.includes(product.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onAddToCart={handleAddToCart}
                          onClick={(p) => setSelectedProduct(p)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: WISHLIST */}
              {activeTab === 'wishlist' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                        My Saved Wishlist
                      </h2>
                      <span className="text-xs text-slate-500">
                        {wishlistProducts.length} items saved
                      </span>
                    </div>
                    {wishlistProducts.length > 0 && (
                      <button
                        onClick={() => {
                          if (window.confirm('Clear all items from your wishlist?')) {
                            setWishlistIds([]);
                            showToast('Wishlist cleared');
                          }
                        }}
                        className="text-xs font-semibold text-rose-500 hover:underline"
                      >
                        Clear Wishlist
                      </button>
                    )}
                  </div>

                  {wishlistProducts.length === 0 ? (
                    <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8">
                      <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-500 mx-auto flex items-center justify-center mb-4">
                        <Heart className="w-8 h-8" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                        Your Wishlist is Empty
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                        Explore our curated catalog and tap the heart icon on items you love to save them for later.
                      </p>
                      <button
                        onClick={() => setActiveTab('catalog')}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20"
                      >
                        Discover Products
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                      {wishlistProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isFavorite={true}
                          onToggleFavorite={handleToggleFavorite}
                          onAddToCart={handleAddToCart}
                          onClick={(p) => setSelectedProduct(p)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SHOPPING CART */}
              {activeTab === 'cart' && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                      Shopping Bag ({totalCartCount} items)
                    </h2>
                    {cart.length > 0 && (
                      <button
                        onClick={handleClearCart}
                        className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear Bag
                      </button>
                    )}
                  </div>

                  {cart.length === 0 ? (
                    <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8">
                      <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 mx-auto flex items-center justify-center mb-4">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                        Your Shopping Bag is Empty
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                        Explore our curated selection and add items to your cart to test the full checkout flow.
                      </p>
                      <button
                        onClick={() => setActiveTab('catalog')}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                      {/* Items List */}
                      <div className="md:col-span-2 space-y-3">
                        {cart.map((item) => (
                          <div
                            key={item.product.id}
                            className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex gap-4 items-center"
                          >
                            <div className="w-20 h-20 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-center shrink-0">
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 truncate">
                                {item.product.category}
                              </div>
                              <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1 mb-1">
                                {item.product.title}
                              </h4>
                              <div className="text-xs text-slate-500 tabular-nums">
                                ${item.product.price.toFixed(2)} each
                              </div>

                              {/* Stepper & Line subtotal */}
                              <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(item.product.id, item.quantity - 1)
                                    }
                                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="px-3 text-xs font-bold tabular-nums">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleUpdateQuantity(item.product.id, item.quantity + 1)
                                    }
                                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                                  ${(item.product.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            </div>

                            {/* Remove single button */}
                            <button
                              onClick={() => handleRemoveFromCart(item.product.id)}
                              title="Remove item"
                              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary Module */}
                      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-4">
                        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                          Order Summary
                        </h3>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Subtotal ({totalCartCount} items)</span>
                            <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                              ${cartSubtotal.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Estimated Sales Tax (8%)</span>
                            <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                              ${cartTax.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex justify-between text-slate-600 dark:text-slate-400">
                            <span>Shipping</span>
                            <span
                              className={`font-semibold tabular-nums ${
                                cartShipping === 0
                                  ? 'text-emerald-500'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {cartShipping === 0 ? 'FREE' : `$${cartShipping.toFixed(2)}`}
                            </span>
                          </div>
                        </div>

                        {cartSubtotal < 75 && (
                          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800">
                            Add ${(75 - cartSubtotal).toFixed(2)} more for <strong>FREE shipping</strong>!
                          </div>
                        )}

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            Total
                          </span>
                          <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                            ${cartTotal.toFixed(2)}
                          </span>
                        </div>

                        <button
                          onClick={() => setIsCheckoutOpen(true)}
                          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                        >
                          <span>Proceed to Checkout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: PROFILE & SETTINGS */}
              {activeTab === 'profile' && (
                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                  {/* User Profile Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 flex items-center gap-4 shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-lg flex items-center justify-center shadow-md">
                      AM
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                        Alex Morgan
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        alex.morgan@example.com
                      </p>
                      <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
                        Internship Candidate Demo Profile
                      </div>
                    </div>
                  </div>

                  {/* Theme Mode Control */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {theme === 'dark' ? (
                          <Moon className="w-5 h-5 text-indigo-400" />
                        ) : (
                          <Sun className="w-5 h-5 text-amber-500" />
                        )}
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            Appearance Theme
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Currently set to {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        <button
                          onClick={() => setTheme('light')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            theme === 'light'
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                          <span>Light</span>
                        </button>
                        <button
                          onClick={() => setTheme('dark')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            theme === 'dark'
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Moon className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Dark</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Data & Cache controls */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          FakeStore API Status
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {products.length} products loaded into memory
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          clearApiCache();
                          loadData(true);
                          showToast('Refreshing catalog from FakeStore API...');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Force Refresh</span>
                      </button>
                    </div>
                  </div>

                  {/* Flutter Codebase Shortcut */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Code2 className="w-4 h-4 text-indigo-500" />
                        <span>Flutter / Dart Project Suite</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        View and copy all production Flutter files and unit tests
                      </div>
                    </div>
                    <button
                      onClick={() => setIsCodeViewerOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
                    >
                      Open Explorer
                    </button>
                  </div>

                  {/* Simulated Past Orders */}
                  <div>
                    <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white mb-3">
                      Recorded Demo Orders ({orders.length})
                    </h3>
                    {orders.length === 0 ? (
                      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                        No orders recorded yet. Try placing an order in the Cart tab!
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {orders.map((ord) => (
                          <div
                            key={ord.orderId}
                            className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                                {ord.orderId}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {new Date(ord.orderDate).toLocaleDateString()} · {ord.items.length} items
                              </div>
                            </div>
                            <div className="font-bold text-slate-900 dark:text-white tabular-nums">
                              ${ord.totalAmount.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Bottom Mobile Tab Bar (Active when mobile frame is ON or on mobile screen) */}
        <div className="sticky bottom-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 md:hidden">
          <div className="flex items-center justify-around py-2 px-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                activeTab === 'home'
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                activeTab === 'catalog'
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Search className="w-5 h-5" />
              <span>Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                activeTab === 'wishlist'
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>Wishlist</span>
              {wishlistIds.length > 0 && (
                <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('cart')}
              className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                activeTab === 'cart'
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span className="absolute top-0 right-1 min-w-[16px] h-4 px-1 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Account</span>
            </button>
          </div>
        </div>

        {/* Product Details Modal */}
        <ProductDetailsModal
          product={selectedProduct}
          allProducts={products}
          isFavorite={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onClose={() => setSelectedProduct(null)}
        />

        {/* Filter & Sort Drawer */}
        <FilterDrawer
          isOpen={isFilterOpen}
          categories={categories}
          filterState={filterState}
          maxCatalogPrice={maxCatalogPrice}
          onUpdateFilter={(updates) => setFilterState((prev) => ({ ...prev, ...updates }))}
          onReset={handleResetFilters}
          onClose={() => setIsFilterOpen(false)}
        />

        {/* Simulated Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          cartItems={cart}
          subtotal={cartSubtotal}
          tax={cartTax}
          shipping={cartShipping}
          total={cartTotal}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={(order) => {
            setOrders((prev) => [order, ...prev]);
            setCart([]);
            showToast(`Order ${order.orderId} registered!`);
          }}
        />

        {/* Flutter Source Code Viewer */}
        <FlutterCodeViewer
          isOpen={isCodeViewerOpen}
          onClose={() => setIsCodeViewerOpen(false)}
        />
      </div>
    </MobileFrame>
  );
}
