import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  ProductCategory,
  ProductItem,
  HERO_CATEGORIES,
  IOBoardOption,
} from '../data/products';
import { ProductCard } from './ProductCard';

const ITEMS_PER_PAGE = 6;

interface CategoryStoreSubpageProps {
  category: ProductCategory | 'All';
  products: ProductItem[];
  onChangeCategory: (category: ProductCategory | 'All') => void;
  onBackToMain: () => void;
  onAddToCart: (
    product: ProductItem,
    quantity?: number,
    selectedIOBoard?: IOBoardOption
  ) => void;
  onSelectProduct: (product: ProductItem) => void;
}

export const CategoryStoreSubpage: React.FC<CategoryStoreSubpageProps> = ({
  category,
  products,
  onChangeCategory,
  onBackToMain,
  onAddToCart,
  onSelectProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>(
    'default'
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset to Page 1 whenever category, search query, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category, searchQuery, sortBy]);

  const currentCategoryMeta =
    category === 'All'
      ? {
          id: 'All' as const,
          number: 'ALL',
          title: 'All Industrial Equipment',
          shortSubtitle: 'Controllers · Servo Motors · CNC Machines · Robots',
          bannerDescription:
            'Complete SZGH Pakistan B2B catalog with merged multi-axis selection tabs and 6 products per page.',
          image: HERO_CATEGORIES[0].image,
        }
      : HERO_CATEGORIES.find((c) => c.id === category) || HERO_CATEGORIES[0];

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products
      .filter((item) => {
        const matchesCat = category === 'All' || item.category === category;
        if (!matchesCat) return false;
        if (!q) return true;
        const axisMatches = item.axisVariants?.some(
          (v) =>
            v.modelNumber.toLowerCase().includes(q) ||
            v.axisLabel.toLowerCase().includes(q) ||
            v.title.toLowerCase().includes(q)
        );
        return (
          item.modelNumber.toLowerCase().includes(q) ||
          (item.baseModelNumber || '').toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.subcategory.toLowerCase().includes(q) ||
          Boolean(axisMatches)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [products, category, searchQuery, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, safeCurrentPage]);

  const handleGoToPage = (page: number) => {
    const target = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Sub-Page Top Bar & Direct Search Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Top Row: Back Button + Category Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBackToMain}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home Page</span>
            </button>

            {/* Quick Category Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  onChangeCategory('All');
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  category === 'All'
                    ? 'bg-[#1E2985] dark:bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                All Equipment ({products.length})
              </button>
              {HERO_CATEGORIES.map((cat) => {
                const isActive = cat.id === category;
                const catCount = products.filter(
                  (p) => p.category === cat.id
                ).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onChangeCategory(cat.id);
                      setSearchQuery('');
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#1E2985] dark:bg-emerald-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                    }`}
                  >
                    {cat.title} ({catCount})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Banner Title & Warranty Guarantee */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-4">
              <img
                src={currentCategoryMeta.image}
                alt={currentCategoryMeta.title}
                referrerPolicy="no-referrer"
                className="w-20 h-16 sm:w-24 sm:h-20 rounded-md object-contain bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1.5 shrink-0"
              />
              <div>
                <div className="text-xs font-mono-tabular font-bold text-[#0D5C2B] dark:text-emerald-400">
                  SZGH PAKISTAN · {currentCategoryMeta.number}.{' '}
                  {currentCategoryMeta.title.toUpperCase()} · PAGE{' '}
                  {safeCurrentPage} OF {totalPages}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {category === 'All'
                    ? 'Complete Industrial Catalog'
                    : `Select ${currentCategoryMeta.title}`}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 max-w-2xl">
                  {currentCategoryMeta.bannerDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#0D5C2B] dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
              <span>All Products Include 1 Year Official Warranty</span>
            </div>
          </div>

          {/* Prominent Top Search Bar for Model No. or Description */}
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${currentCategoryMeta.title} by Model No. (e.g., SZGH-880TC, SZGH-CNC1000MDb) or axis...`}
                aria-label="Search desired products by model number or description"
                className="w-full pl-11 pr-10 py-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-slate-500 hidden sm:inline" />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as 'default' | 'price-asc' | 'price-desc'
                  )
                }
                aria-label="Sort products by price"
                className="px-3.5 py-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="default">Sort: Default Order</option>
                <option value="price-asc">Price: Low to High (PKR)</option>
                <option value="price-desc">Price: High to Low (PKR)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Page Product Grid (6 Products Per Page) */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 mb-5">
          <span>
            Showing{' '}
            <strong className="font-mono-tabular text-slate-900 dark:text-white">
              {filteredProducts.length === 0
                ? 0
                : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}
              –
              {Math.min(
                safeCurrentPage * ITEMS_PER_PAGE,
                filteredProducts.length
              )}
            </strong>{' '}
            of{' '}
            <strong className="font-mono-tabular text-slate-900 dark:text-white">
              {filteredProducts.length}
            </strong>{' '}
            merged product listing(s) in {currentCategoryMeta.title} (6 per
            page)
          </span>
          <span className="font-mono-tabular font-semibold text-[#1E2985] dark:text-emerald-400">
            Page {safeCurrentPage} of {totalPages} · Select Axis &amp; I/O Tabs
            directly on any card
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No products matched "{searchQuery}" in {currentCategoryMeta.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Try clearing the search bar or switching to another category tab
              above.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-md bg-[#1E2985] dark:bg-emerald-600 text-white text-xs font-bold cursor-pointer"
            >
              Show All {currentCategoryMeta.title}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>

            {/* Automatic Multi-Page Pagination Bar (6 Products Per Page) */}
            {totalPages > 1 && (
              <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-600 dark:text-slate-400 font-mono-tabular">
                  Page{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {safeCurrentPage}
                  </strong>{' '}
                  of{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {totalPages}
                  </strong>{' '}
                  ({ITEMS_PER_PAGE} products per page)
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleGoToPage(safeCurrentPage - 1)}
                    disabled={safeCurrentPage <= 1}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => {
                      const isCurrent = pageNum === safeCurrentPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handleGoToPage(pageNum)}
                          className={`px-3.5 py-2 rounded-md text-xs font-mono-tabular font-bold transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-[#1E2985] dark:bg-emerald-600 text-white shadow-xs'
                              : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          Page {pageNum}
                        </button>
                      );
                    }
                  )}

                  <button
                    type="button"
                    onClick={() => handleGoToPage(safeCurrentPage + 1)}
                    disabled={safeCurrentPage >= totalPages}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
