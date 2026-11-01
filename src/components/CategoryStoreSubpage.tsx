import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CornerDownRight,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
  FolderTree,
} from 'lucide-react';
import {
  ProductCategory,
  ProductItem,
  HERO_CATEGORIES,
  IOBoardOption,
  OFFICIAL_SUBCATEGORY_GROUPS,
  SubcategoryGroup,
  resolveOfficialSubcategory,
} from '../data/products';
import { ProductCard } from './ProductCard';

const ITEMS_PER_PAGE = 6;

interface CategoryStoreSubpageProps {
  category: ProductCategory | 'All';
  selectedSubcategory?: string | null;
  onChangeSubcategory?: (
    subcategory: string | null,
    targetCategory?: ProductCategory | 'All'
  ) => void;
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
  selectedSubcategory = null,
  onChangeSubcategory,
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
  const [localSubcategory, setLocalSubcategory] = useState<string | null>(
    selectedSubcategory
  );
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [mobileTreeOpen, setMobileTreeOpen] = useState<boolean>(false);

  useEffect(() => {
    setLocalSubcategory(selectedSubcategory);
    if (selectedSubcategory) {
      const parentGroup = OFFICIAL_SUBCATEGORY_GROUPS.find((g) =>
        g.subcategories.some(
          (s) => s.toLowerCase() === selectedSubcategory.toLowerCase()
        )
      );
      setSelectedGroupId(parentGroup ? parentGroup.id : null);
    } else {
      setSelectedGroupId(null);
    }
  }, [selectedSubcategory]);

  const activeSubcat =
    onChangeSubcategory !== undefined ? selectedSubcategory : localSubcategory;

  const handleSelectSubcategory = (
    subcat: string | null,
    targetCat?: ProductCategory | 'All',
    groupId?: string | null
  ) => {
    setSelectedGroupId(groupId ?? null);
    if (onChangeSubcategory) {
      onChangeSubcategory(subcat, targetCat);
    } else {
      setLocalSubcategory(subcat);
      if (targetCat && targetCat !== category) {
        onChangeCategory(targetCat);
      }
    }
    setCurrentPage(1);
    setMobileTreeOpen(false);
  };

  const handleSelectSubcategoryGroup = (group: SubcategoryGroup) => {
    // Clicking a group header (e.g. "Spindle Servo Motors and Drivers") filters to that group's category and all subcategories in that group
    if (selectedGroupId === group.id && !activeSubcat) {
      setSelectedGroupId(null);
      handleSelectSubcategory(null, 'All', null);
      return;
    }
    if (onChangeSubcategory) {
      onChangeSubcategory(null, group.category);
    } else {
      setLocalSubcategory(null);
      onChangeCategory(group.category);
    }
    setSelectedGroupId(group.id);
    setCurrentPage(1);
    setMobileTreeOpen(false);
  };

  // Reset to Page 1 whenever category, subcategory, group, search query, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category, activeSubcat, selectedGroupId, searchQuery, sortBy]);

  const currentCategoryMeta =
    category === 'All'
      ? {
          id: 'All' as const,
          number: 'ALL',
          title: 'All Industrial Equipment',
          shortSubtitle: 'CNC System · Servo & Stepper Motors · CNC Machine · Robots',
          bannerDescription:
            'Browse by official SZGH main categories and subcategories with multi-axis selection tabs and 6 products per page.',
          image: HERO_CATEGORIES[0].image,
        }
      : HERO_CATEGORIES.find((c) => c.id === category) || HERO_CATEGORIES[0];

  // Groups visible in the top quick-filter bar for the active category
  const visibleGroupsForActiveCategory = useMemo(() => {
    if (category === 'All') return OFFICIAL_SUBCATEGORY_GROUPS;
    return OFFICIAL_SUBCATEGORY_GROUPS.filter((g) => g.category === category);
  }, [category]);

  // Count how many merged products belong to each subcategory
  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of products) {
      const resolved = resolveOfficialSubcategory(item);
      counts[resolved] = (counts[resolved] || 0) + 1;
    }
    return counts;
  }, [products]);

  const activeGroupObj = useMemo(
    () =>
      selectedGroupId
        ? OFFICIAL_SUBCATEGORY_GROUPS.find((g) => g.id === selectedGroupId) || null
        : null,
    [selectedGroupId]
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products
      .filter((item) => {
        const matchesCat = category === 'All' || item.category === category;
        if (!matchesCat) return false;

        const itemSubcat = resolveOfficialSubcategory(item);

        // If a specific subcategory is selected, match it
        if (activeSubcat) {
          if (itemSubcat.toLowerCase() !== activeSubcat.toLowerCase()) {
            return false;
          }
        } else if (activeGroupObj) {
          // If a parent group (like "Spindle Servo Motors and Drivers" or "Stepper Motors and Drivers") is selected
          const inGroup = activeGroupObj.subcategories.some(
            (s) => s.toLowerCase() === itemSubcat.toLowerCase()
          );
          if (!inGroup) return false;
        }

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
          itemSubcat.toLowerCase().includes(q) ||
          Boolean(axisMatches)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [products, category, activeSubcat, activeGroupObj, searchQuery, sortBy]);

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
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-5">
          {/* Top Row: Back Button + Category Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBackToMain}
              className="self-start inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Back to Home Page</span>
            </button>

            {/* Quick Category Switcher (Touch-Scrollable on Mobile) */}
            <div className="w-full sm:w-auto flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => {
                  handleSelectSubcategory(null, 'All', null);
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  category === 'All' && !activeSubcat && !selectedGroupId
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
                      handleSelectSubcategory(null, cat.id, null);
                      setSearchQuery('');
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <img
                src={currentCategoryMeta.image}
                alt={currentCategoryMeta.title}
                referrerPolicy="no-referrer"
                className="w-16 h-14 sm:w-24 sm:h-20 rounded-md object-contain bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1.5 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs font-mono-tabular font-bold text-[#0D5C2B] dark:text-emerald-400">
                  SZGH PAKISTAN · {currentCategoryMeta.number}.{' '}
                  {currentCategoryMeta.title.toUpperCase()}
                  {activeGroupObj ? ` · ${activeGroupObj.groupTitle.toUpperCase()}` : ''}
                  {activeSubcat ? ` · ${activeSubcat.toUpperCase()}` : ''} · PAGE{' '}
                  {safeCurrentPage} OF {totalPages}
                </div>
                <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {activeSubcat
                    ? activeSubcat
                    : activeGroupObj
                      ? activeGroupObj.groupTitle
                      : category === 'All'
                        ? 'Complete Industrial Catalog'
                        : currentCategoryMeta.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 max-w-2xl">
                  {currentCategoryMeta.bannerDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#0D5C2B] dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>All Products Include 1 Year Official Warranty</span>
            </div>
          </div>

          {/* Prominent Top Search Bar for Model No. or Subcategory */}
          <div className="p-3 sm:p-4 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${
                  activeSubcat || currentCategoryMeta.title
                } by Model No. (e.g., SZGH-880TC, SZGH-CNC1000MDb, SD2026)...`}
                aria-label="Search desired products by model number or description"
                className="w-full pl-10 sm:pl-11 pr-10 py-2.5 sm:py-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400 shadow-2xs"
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
                className="w-full sm:w-auto px-3.5 py-2.5 sm:py-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="default">Sort: Default Order</option>
                <option value="price-asc">Price: Low to High (PKR)</option>
                <option value="price-desc">Price: High to Low (PKR)</option>
              </select>
            </div>
          </div>

          {/* User-Friendly Subcategory Pills Bar for Active Category (Touch-Scrollable on Mobile) */}
          <div className="pt-1 flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1 shrink-0">
              <FolderTree className="w-3.5 h-3.5 text-amber-500" />
              <span>Subcategories:</span>
            </span>
            <button
              type="button"
              onClick={() => handleSelectSubcategory(null, category, null)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                !activeSubcat && !selectedGroupId
                  ? 'bg-[#0D5C2B] border-[#0D5C2B] text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              All in {category === 'All' ? 'Catalog' : currentCategoryMeta.title}
            </button>

            {visibleGroupsForActiveCategory.map((group) =>
              group.subcategories.map((subcat) => {
                const isSelected =
                  activeSubcat?.toLowerCase() === subcat.toLowerCase();
                const count = subcategoryCounts[subcat] || 0;
                return (
                  <button
                    key={subcat}
                    type="button"
                    onClick={() =>
                      handleSelectSubcategory(
                        isSelected ? null : subcat,
                        group.category,
                        group.id
                      )
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-[#1E2985] dark:bg-emerald-600 border-[#1E2985] dark:border-emerald-500 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#1E2985] dark:hover:border-emerald-500 hover:text-[#1E2985] dark:hover:text-emerald-400'
                    }`}
                  >
                    <span>{subcat}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono-tabular font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area: Left Official Subcategory Directory Tree + Right Product Grid */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8">
        {/* Mobile Collapsible Directory Toggle Button (< lg) */}
        <div className="lg:hidden mb-4">
          <button
            type="button"
            onClick={() => setMobileTreeOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-slate-900 text-white text-xs font-extrabold uppercase tracking-wider shadow-xs cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-amber-400" />
              <span>
                {mobileTreeOpen
                  ? 'Hide Category & Subcategory Directory'
                  : 'Browse All Categories & Subcategories'}
              </span>
            </span>
            <span className="px-2 py-0.5 rounded bg-white/15 text-[11px] font-mono-tabular">
              {mobileTreeOpen ? 'Close ▲' : 'Open ▼'}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* LEFT SIDEBAR: Official SZGH Category & Subcategory Tree */}
          <aside
            className={`${
              mobileTreeOpen ? 'block' : 'hidden'
            } lg:block lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden lg:sticky lg:top-24`}
          >
            <div className="px-4 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  Product Categories
                </span>
              </div>
              {(activeSubcat || selectedGroupId || category !== 'All') && (
                <button
                  type="button"
                  onClick={() => handleSelectSubcategory(null, 'All', null)}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 p-3 space-y-3">
              {OFFICIAL_SUBCATEGORY_GROUPS.map((group) => {
                const isGroupSelected =
                  selectedGroupId === group.id ||
                  (category === group.category &&
                    OFFICIAL_SUBCATEGORY_GROUPS.filter(
                      (g) => g.category === group.category
                    ).length === 1);
                const groupTotal = group.subcategories.reduce(
                  (sum, s) => sum + (subcategoryCounts[s] || 0),
                  0
                );

                return (
                  <div key={group.id} className="pt-2 first:pt-0">
                    {/* Parent Category Header with Orange Corner Icon (↳) from Screenshots */}
                    <button
                      type="button"
                      onClick={() => handleSelectSubcategoryGroup(group)}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                        isGroupSelected && !activeSubcat
                          ? 'bg-amber-500/10 text-slate-950 dark:text-white font-extrabold'
                          : 'text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <CornerDownRight className="w-4 h-4 text-amber-500 shrink-0 stroke-[2.5]" />
                        <span className="text-xs sm:text-[13px] leading-snug">
                          {group.groupTitle}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono-tabular px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold shrink-0">
                        {groupTotal}
                      </span>
                    </button>

                    {/* Subcategory List with > Chevron matching Screenshots */}
                    <div className="mt-1 ml-3 pl-2.5 border-l border-slate-200 dark:border-slate-800 space-y-1">
                      {group.subcategories.map((subcat) => {
                        const isSubActive =
                          activeSubcat?.toLowerCase() === subcat.toLowerCase();
                        const subCount = subcategoryCounts[subcat] || 0;

                        return (
                          <button
                            key={subcat}
                            type="button"
                            onClick={() =>
                              handleSelectSubcategory(
                                isSubActive ? null : subcat,
                                group.category,
                                group.id
                              )
                            }
                            className={`w-full group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-left text-xs transition-colors cursor-pointer ${
                              isSubActive
                                ? 'bg-[#1E2985] dark:bg-emerald-600 text-white font-bold shadow-2xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-start gap-1.5 min-w-0">
                              <ChevronRight
                                className={`w-3.5 h-3.5 mt-0.5 shrink-0 transition-transform ${
                                  isSubActive
                                    ? 'text-white translate-x-0.5'
                                    : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                                }`}
                              />
                              <span className="leading-snug">{subcat}</span>
                            </div>
                            <span
                              className={`text-[10px] font-mono-tabular px-1.5 py-0.2 rounded shrink-0 ${
                                isSubActive
                                  ? 'bg-white/20 text-white font-bold'
                                  : 'text-slate-400 dark:text-slate-500'
                              }`}
                            >
                              {subCount}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* RIGHT MAIN PRODUCT GRID (9 Columns) */}
          <div className="lg:col-span-9">
            {/* Active Filter Breadcrumb & Count Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 mb-5 bg-white dark:bg-slate-900 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
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
                  product(s)
                </span>

                {(activeSubcat || activeGroupObj) && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1E2985]/10 dark:bg-emerald-500/15 text-[#1E2985] dark:text-emerald-300 font-bold text-xs">
                    <span>
                      {activeSubcat || activeGroupObj?.groupTitle}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSelectSubcategory(null, category, null)}
                      title="Clear subcategory filter"
                      className="hover:text-red-500 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
              </div>

              <span className="font-mono-tabular font-semibold text-[#1E2985] dark:text-emerald-400">
                Page {safeCurrentPage} of {totalPages}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No products matched your current filter
                  {activeSubcat ? ` in "${activeSubcat}"` : ''}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                  Try clearing the subcategory filter or search query to view all equipment.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    handleSelectSubcategory(null, 'All', null);
                  }}
                  className="px-4 py-2 rounded-md bg-[#1E2985] dark:bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                >
                  Show All Equipment
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};
