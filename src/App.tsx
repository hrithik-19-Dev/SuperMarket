import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingBag,
  MapPin,
  Check,
  Plus,
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2,
  PackageCheck,
  X,
} from 'lucide-react';
import {
  SUPERMARKET_PRODUCTS,
  STORE_HUBS,
  HERO_PRODUCE_IMAGE,
  SupermarketProduct,
  ProductVariant,
  StoreHub,
} from './data/supermarketData';
import { ResilientImage } from './components/ResilientImage';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer, CartItem, ConfirmedOrder } from './components/CartDrawer';

type CategoryFilter =
  | 'All'
  | 'Fresh Produce'
  | 'Staples & Grains'
  | 'Dairy & Ghee'
  | 'Artisan Bakery';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'savings-desc'>('featured');
  const [selectedHub, setSelectedHub] = useState<StoreHub>(STORE_HUBS[0]);
  const [showHubSelector, setShowHubSelector] = useState<boolean>(false);

  // Selected variant per product card in the grid
  const [cardVariants, setCardVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    SUPERMARKET_PRODUCTS.forEach((p) => {
      if (p.variants.length > 0) {
        initial[p.id] = p.variants[0].id;
      }
    });
    return initial;
  });

  // Cart state pre-populated with 2 flagship essentials for immediate utility
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: SUPERMARKET_PRODUCTS[0],
      variant: SUPERMARKET_PRODUCTS[0].variants[0],
      quantity: 1,
    },
    {
      product: SUPERMARKET_PRODUCTS[1],
      variant: SUPERMARKET_PRODUCTS[1].variants[0],
      quantity: 1,
    },
  ]);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeModalProduct, setActiveModalProduct] = useState<SupermarketProduct | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  const handleAddToCart = (
    product: SupermarketProduct,
    variant: ProductVariant,
    quantity: number = 1
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.variant.id === variant.id
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { product, variant, quantity }];
    });

    const key = `${product.id}-${variant.id}`;
    setRecentlyAddedId(key);
    setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === key ? null : prev));
    }, 1200);
  };

  const handleUpdateCartQuantity = (
    productId: string,
    variantId: string,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.variant.id === variantId) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.variant.id === variantId)
      )
    );
  };

  const handleOrderConfirmed = (order: ConfirmedOrder) => {
    setConfirmedOrder(order);
    setCart([]);
    setIsCartOpen(false);
  };

  const filteredProducts = useMemo(() => {
    return SUPERMARKET_PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.origin.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      const varA = a.variants.find((v) => v.id === cardVariants[a.id]) || a.variants[0];
      const varB = b.variants.find((v) => v.id === cardVariants[b.id]) || b.variants[0];
      if (sortBy === 'price-asc') {
        return varA.price - varB.price;
      }
      if (sortBy === 'savings-desc') {
        return varB.mrp - varB.price - (varA.mrp - varA.price);
      }
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy, cardVariants]);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cart.reduce(
    (acc, item) => acc + item.variant.price * item.quantity,
    0
  );

  const categories: CategoryFilter[] = [
    'All',
    'Fresh Produce',
    'Staples & Grains',
    'Dairy & Ghee',
    'Artisan Bakery',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F8] text-[#111827]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Single Text Element Wordmark */}
          <a
            href="#top"
            className="font-display text-xl font-bold tracking-tight text-[#111827] whitespace-nowrap shrink-0"
          >
            Reliance Smart Bazaar
          </a>

          {/* Zone 2: 5 Single-Line Navigation Links */}
          <nav
            aria-label="Primary Aisles"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4B5563]"
          >
            <a
              href="#catalog"
              onClick={() => setSelectedCategory('Fresh Produce')}
              className="hover:text-[#0D6832] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Fresh Produce
            </a>
            <a
              href="#catalog"
              onClick={() => setSelectedCategory('Staples & Grains')}
              className="hover:text-[#0D6832] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Staples
            </a>
            <a
              href="#catalog"
              onClick={() => setSelectedCategory('Dairy & Ghee')}
              className="hover:text-[#0D6832] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Dairy
            </a>
            <a
              href="#catalog"
              onClick={() => setSelectedCategory('Artisan Bakery')}
              className="hover:text-[#0D6832] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Bakery
            </a>
            <a
              href="#sourcing-standards"
              className="hover:text-[#0D6832] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Quality Standards
            </a>
          </nav>

          {/* Zone 3: 2 Primary Actions (Store Hub Selector + Basket Drawer Trigger) */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowHubSelector((prev) => !prev)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#111827] bg-[#F3F4F1] hover:bg-[#E5E7EB] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#0D6832]" />
                <span>{selectedHub.city} · {selectedHub.pincode}</span>
              </button>

              {showHubSelector && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E5E7EB] rounded-xl shadow-xl p-3 z-40 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                    <span className="text-xs font-semibold text-[#111827]">
                      Select Fulfilment Hypermarket
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowHubSelector(false)}
                      className="text-xs text-[#6B7280] hover:text-[#111827] cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  {STORE_HUBS.map((hub) => (
                    <button
                      key={hub.id}
                      type="button"
                      onClick={() => {
                        setSelectedHub(hub);
                        setShowHubSelector(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        selectedHub.id === hub.id
                          ? 'bg-[#0D6832]/10 text-[#111827] font-semibold'
                          : 'hover:bg-[#F3F4F1] text-[#4B5563]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{hub.city} ({hub.pincode})</span>
                        <span className="text-[#0D6832] font-mono-tabular">
                          {hub.deliverySlot.replace('Today, ', '')}
                        </span>
                      </div>
                      <p className="text-[#6B7280] text-[11px] mt-0.5 truncate">
                        {hub.neighborhood}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0D6832] hover:bg-[#094d24] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Basket ({totalCartItems})</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">₹{totalCartPrice}</span>
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Post-Order Confirmation Banner (Shown Immediately After Checkout) */}
        {confirmedOrder && (
          <section
            aria-label="Order Confirmation Receipt"
            className="bg-[#0D6832] text-white border-b border-[#094d24]"
          >
            <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#D1FAE5]">
                  <PackageCheck className="w-4 h-4" />
                  <span>Order #{confirmedOrder.orderId} Confirmed at {confirmedOrder.timestamp}</span>
                  <span aria-hidden="true">·</span>
                  <span>Payment: {confirmedOrder.paymentMethod}</span>
                </div>
                <h2 className="font-display text-xl md:text-2xl font-bold">
                  Preparing Cold-Chain Dispatch from {confirmedOrder.storeHub.neighborhood}
                </h2>
                <p className="text-xs text-[#E5E7EB]">
                  Delivering to {confirmedOrder.customerName} ({confirmedOrder.address}, PIN {confirmedOrder.pincode}) · Slot: {confirmedOrder.deliverySlot}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <div className="bg-white/10 px-4 py-2.5 rounded-lg text-xs font-mono-tabular">
                  <span>Total Payable: </span>
                  <strong className="text-sm">₹{confirmedOrder.grandTotal}</strong>
                  <span className="ml-2 text-[#A7F3D0]">
                    (Saved ₹{confirmedOrder.totalSavings} below MRP)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmedOrder(null)}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold bg-white text-[#111827] hover:bg-[#F3F4F1] rounded-lg transition-colors cursor-pointer"
                >
                  <span>Dismiss Receipt</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Section 1: Storefront Split-Screen Hero */}
        <section className="border-b border-[#E5E7EB] bg-white">
          <div className="max-w-[1280px] mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Campaign Focal Point & Direct Search */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-xs font-medium text-[#0D6832]">
                <span>Direct Orchard & Mill Supply</span>
                <span aria-hidden="true">·</span>
                <span>1,850+ Smart Bazaar Stores Nationwide</span>
                <span aria-hidden="true">·</span>
                <span>ISO 22000 Cold-Chain</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#111827] leading-[1.14]">
                Morning-Harvested Produce & Aged Indian Staples, Always Below MRP.
              </h1>

              <p className="text-base text-[#4B5563] leading-relaxed max-w-xl">
                From GI-tagged Ratnagiri Alphonso orchards and 24-month aged Dehradun basmati silos directly to your kitchen table within 45 minutes. Every item is graded across 42 food-safety checkpoints.
              </p>

              {/* Direct Search & Aisle Entry Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 max-w-xl">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Ratnagiri mangoes, A2 Gir ghee, basmati, sourdough..."
                    aria-label="Search supermarket catalog"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-[#F9F9F8] border border-[#D1D5DB] rounded-lg text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#0D6832] transition-colors"
                  />
                </div>
                <a
                  href="#catalog"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0D6832] hover:bg-[#094d24] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Shop Daily Harvest</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Claim-to-Proof Quantitative Metrics */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#E5E7EB]">
                <div>
                  <p className="font-mono-tabular text-xl sm:text-2xl font-bold text-[#111827]">
                    14 Hours
                  </p>
                  <p className="text-xs text-[#4B5563] mt-0.5">
                    Farm harvest to store cold-room arrival
                  </p>
                </div>
                <div>
                  <p className="font-mono-tabular text-xl sm:text-2xl font-bold text-[#0D6832]">
                    Min 5%–35%
                  </p>
                  <p className="text-xs text-[#4B5563] mt-0.5">
                    Guaranteed savings below printed MRP daily
                  </p>
                </div>
                <div>
                  <p className="font-mono-tabular text-xl sm:text-2xl font-bold text-[#111827]">
                    ₹499+ Free
                  </p>
                  <p className="text-xs text-[#4B5563] mt-0.5">
                    Zero delivery fee & doorstep COD support
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: High-Resolution 16:9 Harvest Crate Showcase */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#F3F4F1] aspect-video shadow-sm">
                <ResilientImage
                  src={HERO_PRODUCE_IMAGE}
                  alt="Artisanal wooden crate of fresh organic produce, heirloom tomatoes, mangoes, and sourdough bread"
                  title="Morning Harvest Crate"
                  subtitle="Direct from Konkan & Talegaon Partner Farms"
                  className="w-full h-full object-cover"
                />
                {/* Measured Contrast Scrim for Overlay Legibility */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                  <div className="space-y-1">
                    <p className="text-xs text-[#A7F3D0] font-mono-tabular">
                      Featured Seasonal Harvest · Batch #KON-2026
                    </p>
                    <h2 className="font-display text-xl font-bold">
                      Hydroponic Greens & Konkan Orchard Crate
                    </h2>
                    <p className="text-xs text-[#E5E7EB]">
                      Ozone-washed · Zero pesticide residue · Delivered at 4°C
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModalProduct(SUPERMARKET_PRODUCTS[4])}
                    className="px-4 py-2 bg-white text-[#111827] hover:bg-[#F3F4F1] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Inspect Harvest Specs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Featured Collection Grid */}
        <section id="catalog" className="max-w-[1280px] mx-auto px-6 py-14 space-y-8">
          {/* Section Header + Interactive Segmented Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E5E7EB]">
            <div className="space-y-1.5">
              <p className="text-xs text-[#4B5563]">
                <span>01. Daily Storefront Catalog</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>Live Inventory from {selectedHub.neighborhood}</span>
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111827]">
                Farm-Fresh Produce & Reserve Pantry Essentials
              </h2>
            </div>

            {/* Interactive Category Tabs & Sort Control */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                role="tablist"
                aria-label="Filter products by department"
                className="flex flex-wrap items-center gap-1 p-1 bg-[#EFEFE9] rounded-lg border border-[#E5E7EB]"
              >
                {categories.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-white text-[#111827] shadow-xs font-semibold'
                          : 'text-[#4B5563] hover:text-[#111827]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B7280]" />
                <label htmlFor="sort-select" className="sr-only">
                  Sort products
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as 'featured' | 'price-asc' | 'savings-desc')
                  }
                  className="text-xs font-medium text-[#111827] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="featured">Sort: Featured Harvest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="savings-desc">Savings: Highest ₹ Off MRP</option>
                </select>
              </div>
            </div>
          </div>

          {/* Empty Search State */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center space-y-3">
              <p className="font-display text-xl font-bold text-[#111827]">
                No matching groceries found for “{searchQuery}”
              </p>
              <p className="text-sm text-[#4B5563] max-w-md mx-auto">
                Try clearing your search filter or switching back to All Departments to view today’s fresh harvest.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 bg-[#0D6832] text-white text-xs font-semibold rounded-lg hover:bg-[#094d24] transition-colors cursor-pointer"
              >
                Reset Catalog Filters
              </button>
            </div>
          ) : (
            /* 3-Column Desktop / 2-Column Tablet Product Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredProducts.map((product) => {
                const selectedVarId =
                  cardVariants[product.id] || product.variants[0].id;
                const activeVariant =
                  product.variants.find((v) => v.id === selectedVarId) ||
                  product.variants[0];
                const savings = activeVariant.mrp - activeVariant.price;
                const addedKey = `${product.id}-${activeVariant.id}`;
                const isJustAdded = recentlyAddedId === addedKey;

                return (
                  <article
                    key={product.id}
                    className="group bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Product Image Container (4:3 Aspect Ratio) */}
                    <div
                      onClick={() => setActiveModalProduct(product)}
                      className="relative aspect-[4/3] bg-[#F3F4F1] overflow-hidden cursor-pointer border-b border-[#E5E7EB]"
                    >
                      <ResilientImage
                        src={product.image}
                        alt={product.name}
                        title={product.name}
                        subtitle={product.origin}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>

                    {/* Card Body — Identical Field Order Across All Cards */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                      <div className="space-y-2">
                        {/* Unboxed Metadata Line (No Pill Enclosures) */}
                        <div className="flex items-center justify-between text-xs text-[#6B7280]">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="uppercase tracking-wider font-medium text-[#4B5563]">
                              {product.brand}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#0D6832] font-medium">
                              {product.availability}
                            </span>
                          </div>
                          <span className="font-mono-tabular text-[#111827] shrink-0">
                            ★ {product.rating}
                          </span>
                        </div>

                        {/* Product Name (16px SemiBold) */}
                        <h3
                          onClick={() => setActiveModalProduct(product)}
                          className="text-base font-semibold text-[#111827] group-hover:text-[#0D6832] transition-colors cursor-pointer line-clamp-2 min-h-[3rem]"
                        >
                          {product.name}
                        </h3>

                        {/* Quiet Provenance Note */}
                        <p className="text-xs text-[#4B5563] line-clamp-2">
                          Origin: {product.origin} · {product.nutritionalHighlights}
                        </p>
                      </div>

                      <div className="space-y-4 pt-3 border-t border-[#F3F4F6]">
                        {/* Interactive Pack Size Segmented Selector */}
                        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F9F9F8] rounded-lg border border-[#E5E7EB]">
                          {product.variants.map((variant) => {
                            const active = variant.id === activeVariant.id;
                            return (
                              <button
                                key={variant.id}
                                type="button"
                                onClick={() =>
                                  setCardVariants((prev) => ({
                                    ...prev,
                                    [product.id]: variant.id,
                                  }))
                                }
                                className={`px-2.5 py-1.5 text-xs font-medium rounded-md truncate transition-colors cursor-pointer ${
                                  active
                                    ? 'bg-white text-[#111827] shadow-2xs font-semibold border border-[#E5E7EB]'
                                    : 'text-[#6B7280] hover:text-[#111827]'
                                }`}
                                title={variant.label}
                              >
                                {variant.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Price Baseline & Quick-Add Action */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-mono-tabular">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-[#111827]">
                                ₹{activeVariant.price}
                              </span>
                              <span className="text-xs text-[#6B7280] line-through">
                                ₹{activeVariant.mrp}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#0D6832] font-medium">
                              Save ₹{savings} · {activeVariant.unitPriceLabel}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveModalProduct(product)}
                              className="px-3 py-2 text-xs font-medium text-[#111827] bg-[#F3F4F1] hover:bg-[#E5E7EB] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddToCart(product, activeVariant, 1)}
                              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                                isJustAdded
                                  ? 'bg-[#111827] text-white'
                                  : 'bg-[#0D6832] hover:bg-[#094d24] text-white'
                              }`}
                            >
                              {isJustAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Added</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Section 3: Direct Farm-to-Store Provenance & Customer Proof */}
        <section
          id="sourcing-standards"
          className="bg-white border-y border-[#E5E7EB] py-16"
        >
          <div className="max-w-[1280px] mx-auto px-6 space-y-12">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs text-[#0D6832] font-medium">
                02. Supply Chain & Quality Architecture
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#111827]">
                How Reliance Smart Bazaar Delivers Below-MRP Pricing Without Compromising Grade
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2 pt-4 border-t border-[#E5E7EB]">
                <h3 className="text-base font-semibold text-[#111827]">
                  01. Direct Collection Centres
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  We procure fruits, vegetables, and pulses directly at 190+ rural farmer collection centres across Maharashtra, Uttarakhand, Gujarat, and Karnataka—eliminating three middleman markups.
                </p>
                <p className="text-xs text-[#0D6832] font-mono-tabular pt-1">
                  Result: 18%–35% lower retail price vs traditional mandis
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#E5E7EB]">
                <h3 className="text-base font-semibold text-[#111827]">
                  02. 4°C Reefer Cold-Chain & Batch Testing
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Every harvest crate is pre-cooled within two hours of picking and transported in GPS-monitored reefer trucks. Staples undergo moisture, aflatoxin, and pesticide-residue screening before packing.
                </p>
                <p className="text-xs text-[#0D6832] font-mono-tabular pt-1">
                  Result: 42 mandatory quality checkpoints per SKU
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#E5E7EB]">
                <h3 className="text-base font-semibold text-[#111827]">
                  03. Doorstep Verification & COD Trust
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Inspect your fresh produce, dairy dates, and sourdough loaves at your doorstep. Pay via Cash on Delivery, UPI QR scan, or meal cards only when completely satisfied with freshness.
                </p>
                <p className="text-xs text-[#0D6832] font-mono-tabular pt-1">
                  Result: 99.4% first-attempt doorstep acceptance rate
                </p>
              </div>
            </div>

            {/* Attributable Customer & Supplier Testimonials */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-[#E5E7EB]">
              <blockquote className="p-6 rounded-xl bg-[#F9F9F8] border border-[#E5E7EB] space-y-3">
                <p className="text-sm text-[#111827] leading-relaxed">
                  “Before switching our household pantry to Reliance Smart Bazaar’s Worli hub, we spent nearly ₹14,500 a month across three separate gourmet and local grocers. Consolidating our weekly hydroponic greens, A2 Gir ghee, and 5kg aged basmati cut our monthly grocery bill by ₹3,100 while arriving within 45 minutes.”
                </p>
                <footer className="text-xs text-[#4B5563]">
                  <strong className="text-[#111827]">Nandini Deshmukh</strong>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>Executive Chef & Culinary Consultant</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>Worli, Mumbai (Verified Smart Bazaar Member since 2023)</span>
                </footer>
              </blockquote>

              <blockquote className="p-6 rounded-xl bg-[#F9F9F8] border border-[#E5E7EB] space-y-3">
                <p className="text-sm text-[#111827] leading-relaxed">
                  “Partnering directly with Reliance Smart Bazaar’s Konkan collection centre eliminated auction delays in Vashi. Our carbide-free Ratnagiri Alphonso crates are weighed, graded, and settled via direct bank transfer within 24 hours, reaching Mumbai and Bengaluru families at peak natural ripeness.”
                </p>
                <footer className="text-xs text-[#4B5563]">
                  <strong className="text-[#111827]">Suresh Patwardhan</strong>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>Chairman, Ratnagiri Coastal Orchard Collective</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>Ratnagiri, Maharashtra</span>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>
      </main>

      {/* Section 4: Quiet Institutional Footer */}
      <footer className="bg-[#111827] text-[#D1D5DB] py-12 border-t border-[#1F2937]">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2">
            <p className="font-display text-lg font-bold text-white">
              Reliance Smart Bazaar
            </p>
            <p className="text-xs text-[#9CA3AF] max-w-md">
              Reliance Retail Limited · FSSAI License No. 10012022000148 · ISO 22000 Certified Cold-Chain Supermarkets across Mumbai, Bengaluru, New Delhi, and Hyderabad.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#9CA3AF]">
            <a
              href="#catalog"
              onClick={() => setSelectedCategory('Fresh Produce')}
              className="hover:text-white transition-colors"
            >
              Fresh Produce
            </a>
            <a
              href="#catalog"
              onClick={() => setSelectedCategory('Staples & Grains')}
              className="hover:text-white transition-colors"
            >
              Staples & Grains
            </a>
            <a
              href="#catalog"
              onClick={() => setSelectedCategory('Dairy & Ghee')}
              className="hover:text-white transition-colors"
            >
              Dairy & Ghee
            </a>
            <a
              href="#sourcing-standards"
              className="hover:text-white transition-colors"
            >
              Quality & Cold-Chain
            </a>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="text-white font-semibold hover:underline cursor-pointer"
            >
              View Basket ({totalCartItems})
            </button>
          </div>
        </div>
      </footer>

      {/* Product Detail Contiguous Purchase Modal */}
      <ProductDetailModal
        product={activeModalProduct}
        selectedHub={selectedHub}
        onClose={() => setActiveModalProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-Over Cart & COD Verification Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        selectedHub={selectedHub}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onOrderConfirmed={handleOrderConfirmed}
      />
    </div>
  );
}
