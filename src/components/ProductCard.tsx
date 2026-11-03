import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Check,
  ShieldCheck,
  ArrowUpRight,
  Cpu,
  Star,
  Layers,
  Flame,
} from 'lucide-react';
import {
  ProductItem,
  CONTROLLER_IO_BOARD_OPTIONS,
  IOBoardOption,
  AxisVariantOption,
  stripAxisCountFromText,
  isStandaloneIOBoardProduct,
} from '../data/products';

interface ProductCardProps {
  product: ProductItem;
  onAddToCart: (
    product: ProductItem,
    quantity?: number,
    selectedIOBoard?: IOBoardOption
  ) => void;
  onSelectProduct: (product: ProductItem) => void;
  rankBadge?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onSelectProduct,
  rankBadge,
}) => {
  const axisVariants: AxisVariantOption[] = product.axisVariants || [];
  const [selectedAxisId, setSelectedAxisId] = useState<string>(
    axisVariants[0]?.id || product.id
  );

  useEffect(() => {
    setSelectedAxisId(product.axisVariants?.[0]?.id || product.id);
  }, [product.id, product.axisVariants]);

  const activeAxis: AxisVariantOption | undefined =
    axisVariants.find((v) => v.id === selectedAxisId) || axisVariants[0];

  // Active images: prefer the active axis variant's custom image if uploaded, else fallback to merged product images
  const activeAxisHasCustomImg = activeAxis?.images?.some(
    (img) =>
      img &&
      img.trim().length > 0 &&
      !img.startsWith('data:image/svg+xml')
  );
  const displayImages: string[] =
    activeAxisHasCustomImg && activeAxis?.images
      ? activeAxis.images
      : product.images;

  const displayImageLabels: string[] =
    activeAxisHasCustomImg && activeAxis?.imageLabels?.length
      ? activeAxis.imageLabels
      : product.imageLabels;

  const rawDefaultIdx =
    activeAxisHasCustomImg && typeof activeAxis?.defaultImageIndex === 'number'
      ? activeAxis.defaultImageIndex
      : product.defaultImageIndex;

  const candidateDefaultIdx =
    typeof rawDefaultIdx === 'number' &&
    rawDefaultIdx >= 0 &&
    rawDefaultIdx < displayImages.length
      ? rawDefaultIdx
      : 0;

  const firstNonEmptyIdx = displayImages.findIndex((u) => Boolean(u?.trim()));
  const defaultIdx =
    displayImages[candidateDefaultIdx]?.trim()
      ? candidateDefaultIdx
      : firstNonEmptyIdx !== -1
      ? firstNonEmptyIdx
      : 0;

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(defaultIdx);
  const [selectedIOBoardId, setSelectedIOBoardId] = useState<string>(
    CONTROLLER_IO_BOARD_OPTIONS[0].id
  );
  const [justAdded, setJustAdded] = useState<boolean>(false);

  useEffect(() => {
    setSelectedImageIndex(defaultIdx);
  }, [product.id, selectedAxisId, defaultIdx]);

  const isController =
    (product.category === 'Controllers' || Boolean(product.hasIOBoardOption)) &&
    !isStandaloneIOBoardProduct(product);

  const activeIOBoard: IOBoardOption | undefined = isController
    ? CONTROLLER_IO_BOARD_OPTIONS.find((opt) => opt.id === selectedIOBoardId) ||
      CONTROLLER_IO_BOARD_OPTIONS[0]
    : undefined;

  const basePricePKR = activeAxis ? activeAxis.price : product.price;
  const effectivePricePKR =
    basePricePKR + (activeIOBoard ? activeIOBoard.priceDelta : 0);

  const displayStockCount = activeAxis
    ? activeAxis.stockCount
    : product.stockCount;
  const displayStockStatus =
    (activeAxis ? activeAxis.stockStatus : product.stockStatus) ||
    (displayStockCount > 0 ? 'In Stock' : 'Pre-Order');
  const displayTitle = stripAxisCountFromText(
    activeAxis?.title || product.title || ''
  );
  const displayDescription = stripAxisCountFromText(
    activeAxis?.description || product.description || ''
  );
  const displayModelHeader =
    product.baseModelNumber || product.modelNumber;

  const buildSelectedProductPayload = (): ProductItem => {
    if (!activeAxis) return product;
    return {
      ...product,
      id: activeAxis.id,
      modelNumber: `${displayModelHeader} (${activeAxis.axisLabel})`,
      title: displayTitle || displayModelHeader,
      description: displayDescription,
      price: activeAxis.price,
      stockCount: activeAxis.stockCount,
      stockStatus: activeAxis.stockStatus,
      images: displayImages,
      defaultImageIndex: defaultIdx,
    };
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(buildSelectedProductPayload(), 1, activeIOBoard);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article
      onClick={() => onSelectProduct(product)}
      className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:border-[#1E2985] dark:hover:border-emerald-500 cursor-pointer"
    >
      {/* Main Display Image Area */}
      <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden border-b border-slate-200 dark:border-slate-800 flex items-center justify-center">
        {displayImages[selectedImageIndex] ||
        displayImages[defaultIdx] ||
        displayImages.find((u) => Boolean(u?.trim())) ? (
          <img
            src={
              displayImages[selectedImageIndex] ||
              displayImages[defaultIdx] ||
              displayImages.find((u) => Boolean(u?.trim()))
            }
            alt={`${displayTitle || displayModelHeader} - ${
              displayImageLabels[selectedImageIndex] || 'Product View'
            }`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain p-2 transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="text-xs font-mono-tabular text-slate-400 dark:text-slate-600 select-none">
            {displayModelHeader}
          </div>
        )}

        {/* Optional Top Performance / Rank Badge */}
        {rankBadge && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500 text-white text-[11px] font-extrabold shadow-sm">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{rankBadge}</span>
          </span>
        )}

        {/* Click for Details Prompt */}
        <span className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950/85 text-white text-[11px] font-semibold border border-slate-700 backdrop-blur-xs">
          <span>Details &amp; Features</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
        </span>
      </div>

      {/* Interactive Thumbnail Gallery Strip (4 slots standard, 6 slots for A+B / C+E Panel items) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`grid ${
          displayImages.length > 4 ? 'grid-cols-6' : 'grid-cols-4'
        } gap-1.5 p-2 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800`}
      >
        {displayImages.map((imgUrl, idx) => {
          const hasImage = Boolean(imgUrl && imgUrl.trim().length > 0);
          const isSelected = idx === selectedImageIndex;
          const isDefault = idx === defaultIdx && hasImage;
          const slotLabel = displayImageLabels[idx] || `View ${idx + 1}`;
          const isPanelTag = /^(A|B|C|E)-Panel$/i.test(slotLabel);
          return (
            <button
              key={idx}
              type="button"
              disabled={!hasImage}
              onClick={() => hasImage && setSelectedImageIndex(idx)}
              title={
                !hasImage
                  ? 'Empty image slot'
                  : isDefault
                  ? `${slotLabel} (Default Display)`
                  : slotLabel
              }
              aria-label={`View ${slotLabel}`}
              className={`relative aspect-4/3 rounded overflow-hidden border transition-all bg-white dark:bg-slate-900 ${
                !hasImage
                  ? 'border-dashed border-slate-200 dark:border-slate-800 opacity-40 cursor-default'
                  : isSelected
                  ? 'border-[#1E2985] dark:border-emerald-400 ring-1 ring-[#1E2985] dark:ring-emerald-400 opacity-100 cursor-pointer'
                  : 'border-slate-300 dark:border-slate-800 opacity-65 hover:opacity-100 cursor-pointer'
              }`}
            >
              {hasImage && (
                <img
                  src={imgUrl}
                  alt={`${displayModelHeader} ${slotLabel}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              )}
              {hasImage && isPanelTag && (
                <span className="absolute bottom-0 inset-x-0 bg-[#1E2985]/90 text-white text-[8px] font-extrabold leading-tight py-0.5 text-center truncate">
                  {slotLabel}
                </span>
              )}
              {isDefault && (
                <span
                  title="Default Display Image"
                  className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs"
                >
                  <Star className="w-2.5 h-2.5 fill-current" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 justify-between gap-4">
        <div className="space-y-2.5">
          {/* Category & Stock Line */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
              {product.category}
              {product.subcategory?.trim() ? ` · ${product.subcategory}` : ''}
            </span>
            <span className="font-mono-tabular text-emerald-700 dark:text-emerald-400 font-semibold shrink-0">
              {displayStockStatus} ({displayStockCount})
            </span>
          </div>

          {/* Model Number */}
          <div className="flex items-center justify-between gap-2">
            <div className="font-mono-tabular text-xs font-bold text-[#1E2985] dark:text-sky-400 tracking-wide">
              MODEL: {displayModelHeader}
            </div>
            {activeAxis && (
              <span className="font-mono-tabular text-[11px] font-semibold text-[#1E2985] dark:text-emerald-400">
                {activeAxis.axisLabel}
              </span>
            )}
          </div>

          {/* Product Title */}
          {displayTitle && (
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#1E2985] dark:group-hover:text-emerald-400 transition-colors">
              {displayTitle}
            </h3>
          )}

          {/* Brief Description */}
          {displayDescription && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {displayDescription}
            </p>
          )}

          {/* 1 Year Official Warranty Note */}
          <div className="flex items-center gap-1.5 pt-1 text-xs font-semibold text-[#0D5C2B] dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Warranty: 1 Year Official SZGH Pakistan Warranty</span>
          </div>

          {/* AXES SELECTION TABS — 3D Button Style with Clear Outline */}
          {axisVariants.length > 0 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-2.5 p-2.5 rounded-lg bg-slate-100/90 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 space-y-2 shadow-inner"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#1E2985] dark:text-emerald-400" />
                  <span>Select Axes:</span>
                </span>
                {activeAxis && (
                  <span className="font-mono-tabular text-[#1E2985] dark:text-emerald-400">
                    {activeAxis.axisLabel}
                  </span>
                )}
              </div>
              <div
                role="tablist"
                aria-label="Select number of axes"
                className="flex flex-wrap gap-2 pt-0.5"
              >
                {axisVariants.map((variant) => {
                  const isActiveAxis =
                    (activeAxis?.id || '') === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      role="tab"
                      aria-selected={isActiveAxis}
                      onClick={() => setSelectedAxisId(variant.id)}
                      className={`flex-1 min-w-[72px] py-1.5 px-2.5 rounded-md text-xs font-extrabold tracking-wide transition-all duration-150 cursor-pointer select-none ${
                        isActiveAxis
                          ? 'bg-gradient-to-b from-[#2b3ab8] to-[#1E2985] dark:from-emerald-500 dark:to-emerald-700 text-white border-2 border-[#0c1248] dark:border-emerald-200 border-b-4 border-b-[#070b2e] dark:border-b-emerald-950 shadow-[0_3px_6px_rgba(30,41,133,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] -translate-y-[1px]'
                          : 'bg-gradient-to-b from-white to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-800 dark:text-slate-200 border-2 border-slate-400 dark:border-slate-600 border-b-4 border-b-slate-500 dark:border-b-slate-950 shadow-[0_2px_4px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] hover:-translate-y-[1px] hover:border-[#1E2985] dark:hover:border-emerald-400 active:translate-y-[1px]'
                      }`}
                    >
                      {variant.axisLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* I/O Board 2-Tab Selector — 3D Button Style with Clear Outline */}
          {isController && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-2.5 p-2.5 rounded-lg bg-slate-100/90 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 space-y-2 shadow-inner"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#1E2985] dark:text-emerald-400" />
                  <span>I/O Board Option:</span>
                </span>
                {activeIOBoard && activeIOBoard.priceDelta > 0 && (
                  <span className="font-mono-tabular text-[#0D5C2B] dark:text-emerald-400">
                    +PKR {activeIOBoard.priceDelta.toLocaleString()}
                  </span>
                )}
              </div>
              <div
                role="tablist"
                aria-label="Select I/O Board configuration"
                className="grid grid-cols-2 gap-2 pt-0.5"
              >
                {CONTROLLER_IO_BOARD_OPTIONS.map((opt) => {
                  const isActiveTab = selectedIOBoardId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="tab"
                      aria-selected={isActiveTab}
                      onClick={() => setSelectedIOBoardId(opt.id)}
                      className={`py-1.5 px-2.5 rounded-md text-xs font-extrabold tracking-wide transition-all duration-150 cursor-pointer select-none ${
                        isActiveTab
                          ? 'bg-gradient-to-b from-[#2b3ab8] to-[#1E2985] dark:from-emerald-500 dark:to-emerald-700 text-white border-2 border-[#0c1248] dark:border-emerald-200 border-b-4 border-b-[#070b2e] dark:border-b-emerald-950 shadow-[0_3px_6px_rgba(30,41,133,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] -translate-y-[1px]'
                          : 'bg-gradient-to-b from-white to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-800 dark:text-slate-200 border-2 border-slate-400 dark:border-slate-600 border-b-4 border-b-slate-500 dark:border-b-slate-950 shadow-[0_2px_4px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] hover:-translate-y-[1px] hover:border-[#1E2985] dark:hover:border-emerald-400 active:translate-y-[1px]'
                      }`}
                    >
                      {opt.shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Price & 3D Add to Cart Footer */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
        >
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {basePricePKR <= 0
                ? 'Pricing'
                : activeIOBoard && activeIOBoard.priceDelta > 0
                ? 'Price (incl. I/O Board)'
                : 'Unit Price'}
            </div>
            <div className="text-lg font-extrabold font-mono-tabular text-slate-900 dark:text-white">
              {basePricePKR > 0
                ? `PKR ${effectivePricePKR.toLocaleString()}`
                : 'Call for Price'}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-xs font-extrabold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer select-none ${
              justAdded
                ? 'bg-gradient-to-b from-emerald-600 to-[#0D5C2B] text-white border-2 border-emerald-950 border-b-4 border-b-emerald-950 shadow-[0_3px_6px_rgba(13,92,43,0.35),inset_0_1px_0_rgba(255,255,255,0.35)]'
                : 'bg-gradient-to-b from-[#2b3ab8] to-[#1E2985] hover:from-[#3344cc] hover:to-[#161f69] dark:from-emerald-500 dark:to-emerald-700 text-white border-2 border-[#0c1248] dark:border-emerald-200 border-b-4 border-b-[#070b2e] dark:border-b-emerald-950 shadow-[0_3px_6px_rgba(30,41,133,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] hover:-translate-y-[1px] active:translate-y-[1px]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
