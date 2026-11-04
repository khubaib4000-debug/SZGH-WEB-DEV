import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShoppingCart,
  Check,
  ShieldCheck,
  Cpu,
  Layers,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ZoomIn,
} from 'lucide-react';
import {
  ProductItem,
  CONTROLLER_IO_BOARD_OPTIONS,
  IOBoardOption,
  AxisVariantOption,
  stripAxisCountFromText,
  isStandaloneIOBoardProduct,
} from '../data/products';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (
    product: ProductItem,
    quantity: number,
    selectedIOBoard?: IOBoardOption
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [selectedAxisId, setSelectedAxisId] = useState<string>(
    product?.axisVariants && product.axisVariants.length > 0
      ? product.axisVariants[0].id
      : product?.id || ''
  );

  const activeAxisVariant: AxisVariantOption | undefined =
    product?.axisVariants && product.axisVariants.length > 0
      ? product.axisVariants.find((v) => v.id === selectedAxisId) ||
        product.axisVariants[0]
      : undefined;

  const effectiveImages =
    activeAxisVariant &&
    activeAxisVariant.images &&
    activeAxisVariant.images.some((u) => u && u.trim().length > 0)
      ? activeAxisVariant.images
      : product?.images || ['', '', '', ''];

  const effectiveImageLabels =
    activeAxisVariant &&
    activeAxisVariant.imageLabels &&
    activeAxisVariant.imageLabels.length > 0
      ? activeAxisVariant.imageLabels
      : product?.imageLabels || [];

  const candidateDefaultIdx =
    typeof activeAxisVariant?.defaultImageIndex === 'number' &&
    activeAxisVariant.defaultImageIndex >= 0 &&
    activeAxisVariant.defaultImageIndex < effectiveImages.length
      ? activeAxisVariant.defaultImageIndex
      : product &&
        typeof product.defaultImageIndex === 'number' &&
        product.defaultImageIndex >= 0 &&
        product.defaultImageIndex < effectiveImages.length
      ? product.defaultImageIndex
      : 0;

  const firstNonEmptyIdx = effectiveImages.findIndex((u) => Boolean(u?.trim()));
  const defaultIdx =
    effectiveImages[candidateDefaultIdx]?.trim()
      ? candidateDefaultIdx
      : firstNonEmptyIdx !== -1
      ? firstNonEmptyIdx
      : 0;

  const [activeImageIdx, setActiveImageIdx] = useState<number>(defaultIdx);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedIOBoardId, setSelectedIOBoardId] = useState<string>(
    CONTROLLER_IO_BOARD_OPTIONS[0].id
  );
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);
  const [isZooming, setIsZooming] = useState<boolean>(false);

  const imageStageRef = useRef<HTMLDivElement | null>(null);
  const lensRef = useRef<HTMLDivElement | null>(null);
  const zoomInnerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initialAxis =
      product?.axisVariants && product.axisVariants.length > 0
        ? product.axisVariants[0]
        : undefined;
    setSelectedAxisId(initialAxis ? initialAxis.id : product?.id || '');

    const imgs =
      initialAxis?.images &&
      initialAxis.images.some((u) => u && u.trim().length > 0)
        ? initialAxis.images
        : product?.images || [];
    const rawNext =
      initialAxis &&
      typeof initialAxis.defaultImageIndex === 'number' &&
      initialAxis.defaultImageIndex >= 0 &&
      initialAxis.defaultImageIndex < imgs.length
        ? initialAxis.defaultImageIndex
        : product &&
          typeof product.defaultImageIndex === 'number' &&
          product.defaultImageIndex >= 0 &&
          product.defaultImageIndex < imgs.length
        ? product.defaultImageIndex
        : 0;
    const nonEmptyIdx = imgs.findIndex((u) => Boolean(u?.trim()));
    const nextDefault = imgs[rawNext]?.trim()
      ? rawNext
      : nonEmptyIdx !== -1
      ? nonEmptyIdx
      : 0;
    setActiveImageIdx(nextDefault);
    setQuantity(1);
    setSelectedIOBoardId(CONTROLLER_IO_BOARD_OPTIONS[0].id);
    setAddedFeedback(false);
    setIsZooming(false);
  }, [product]);

  if (!product) return null;

  const hasAxisTabs =
    Boolean(product.axisVariants) && (product.axisVariants?.length ?? 0) > 0;

  const effectiveModelNumber =
    product.baseModelNumber || product.modelNumber;
  const effectiveTitle = stripAxisCountFromText(
    activeAxisVariant && activeAxisVariant.title.trim().length > 0
      ? activeAxisVariant.title
      : product.title
  );
  const effectiveDescription = stripAxisCountFromText(
    activeAxisVariant && activeAxisVariant.description.trim().length > 0
      ? activeAxisVariant.description
      : product.description
  );
  const effectivePrice = activeAxisVariant
    ? activeAxisVariant.price
    : product.price;
  const effectiveStockCount = activeAxisVariant
    ? activeAxisVariant.stockCount
    : product.stockCount;
  const effectiveStockStatus = activeAxisVariant
    ? activeAxisVariant.stockStatus
    : product.stockStatus;

  const isController =
    (product.category === 'Controllers' || Boolean(product.hasIOBoardOption)) &&
    !isStandaloneIOBoardProduct(product);

  const activeIOBoard: IOBoardOption | undefined = isController
    ? CONTROLLER_IO_BOARD_OPTIONS.find((opt) => opt.id === selectedIOBoardId) ||
      CONTROLLER_IO_BOARD_OPTIONS[0]
    : undefined;

  const unitPricePKR =
    effectivePrice + (activeIOBoard ? activeIOBoard.priceDelta : 0);

  const handleAdd = () => {
    const resolvedProductForCart: ProductItem = activeAxisVariant
      ? {
          ...product,
          id: activeAxisVariant.id,
          modelNumber: `${effectiveModelNumber} (${activeAxisVariant.axisLabel})`,
          title: effectiveTitle || effectiveModelNumber,
          description: effectiveDescription,
          price: activeAxisVariant.price,
          stockCount: activeAxisVariant.stockCount,
          stockStatus: activeAxisVariant.stockStatus,
          images: effectiveImages,
        }
      : product;

    onAddToCart(resolvedProductForCart, quantity, activeIOBoard);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const validIndices = effectiveImages
    .map((u, idx) => (u && u.trim().length > 0 ? idx : -1))
    .filter((idx) => idx !== -1);

  const handlePrevImage = () => {
    if (validIndices.length <= 1) return;
    const pos = validIndices.indexOf(activeImageIdx);
    const prevPos = pos <= 0 ? validIndices.length - 1 : pos - 1;
    setActiveImageIdx(validIndices[prevPos]);
  };

  const handleNextImage = () => {
    if (validIndices.length <= 1) return;
    const pos = validIndices.indexOf(activeImageIdx);
    const nextPos = pos === -1 || pos === validIndices.length - 1 ? 0 : pos + 1;
    setActiveImageIdx(validIndices[nextPos]);
  };

  const activeImageSrc = effectiveImages[activeImageIdx] || '';
  const hasActiveImage = Boolean(activeImageSrc && activeImageSrc.trim().length > 0);

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasActiveImage || !imageStageRef.current) return;
    const rect = imageStageRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const relX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const relY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    const uPct = (relX / rect.width) * 100;
    const vPct = (relY / rect.height) * 100;

    // 2.5x zoom -> lens covers 40% width x 40% height, so top-left clamps to [0%, 60%]
    const lensLeftPct = Math.max(0, Math.min(60, uPct - 20));
    const lensTopPct = Math.max(0, Math.min(60, vPct - 20));

    if (!isZooming) {
      setIsZooming(true);
    }

    if (lensRef.current) {
      lensRef.current.style.transform = `translate3d(${lensLeftPct * 2.5}%, ${
        lensTopPct * 2.5
      }%, 0)`;
    }
    if (zoomInnerRef.current) {
      zoomInnerRef.current.style.transform = `translate3d(-${lensLeftPct}%, -${lensTopPct}%, 0)`;
    }
  };

  const handleImageMouseLeave = () => {
    setIsZooming(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-2xl sm:rounded-lg shadow-2xl overflow-hidden sm:my-8 max-h-[92dvh] sm:max-h-none flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-600 dark:text-slate-400 min-w-0 truncate pr-2">
            <span className="font-semibold text-slate-900 dark:text-white shrink-0">
              {product.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate hidden sm:inline">{product.subcategory}</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="font-mono-tabular text-[#1E2985] dark:text-emerald-400 font-semibold truncate">
              {effectiveModelNumber}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product detail view"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contiguous 2-Column Purchase & Detailed Features Module */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 p-4 sm:p-8 overflow-y-auto flex-1">
          {/* Left Column: Main Image + Right-Side Cursor Zoom Flyout + Thumbnail Switcher + Features (6 cols) */}
          <div className="md:col-span-6 flex flex-col gap-4 sm:gap-5">
            <div className="relative">
              {/* Main Picture Stage with Cursor-Tracking Magnifier Lens */}
              <div
                ref={imageStageRef}
                onMouseEnter={handleImageMouseMove}
                onMouseMove={handleImageMouseMove}
                onMouseLeave={handleImageMouseLeave}
                className={`relative aspect-4/3 w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 select-none ${
                  hasActiveImage ? 'cursor-crosshair' : ''
                }`}
              >
                {hasActiveImage ? (
                  <img
                    src={activeImageSrc}
                    alt={`${effectiveTitle} - ${
                      effectiveImageLabels[activeImageIdx] || `View ${activeImageIdx + 1}`
                    }`}
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className="w-full h-full object-contain p-3 pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-mono-tabular">
                    {effectiveModelNumber}
                  </div>
                )}

                {/* Cursor-Following Magnifier Lens Box */}
                {hasActiveImage && (
                  <div
                    ref={lensRef}
                    className={`absolute top-0 left-0 w-[40%] h-[40%] rounded border-2 border-[#1E2985] dark:border-emerald-400 bg-[#1E2985]/15 dark:bg-emerald-400/15 shadow-sm pointer-events-none will-change-transform ${
                      isZooming ? 'opacity-100' : 'opacity-0 hidden'
                    }`}
                  />
                )}

                {/* Prev / Next Navigation Arrows */}
                <button
                  type="button"
                  onClick={handlePrevImage}
                  onMouseEnter={() => setIsZooming(false)}
                  onMouseMove={(e) => e.stopPropagation()}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  onMouseEnter={() => setIsZooming(false)}
                  onMouseMove={(e) => e.stopPropagation()}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Current View Caption & Hover Zoom Hint */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                  <div className="px-3 py-1 rounded bg-slate-950/90 border border-slate-700 text-xs font-mono-tabular text-slate-200 truncate">
                    View {activeImageIdx + 1}/{effectiveImages.length || 4}:{' '}
                    {effectiveImageLabels[activeImageIdx] || `View ${activeImageIdx + 1}`}
                  </div>
                  {hasActiveImage && !isZooming && (
                    <div className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950/85 border border-slate-700 text-[11px] font-medium text-slate-200 shrink-0">
                      <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Hover to Zoom</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right-Side Synchronized High-Resolution Zoom View Panel (SZGH Auto Style) */}
              {hasActiveImage && (
                <div
                  aria-hidden={!isZooming}
                  className={`hidden md:block absolute top-0 left-[calc(100%+1.5rem)] lg:left-[calc(100%+2rem)] w-full aspect-4/3 z-40 rounded-lg overflow-hidden bg-white dark:bg-slate-950 border-2 border-[#1E2985] dark:border-emerald-500 shadow-2xl pointer-events-none transition-opacity duration-100 ${
                    isZooming ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}
                >
                  <div
                    ref={zoomInnerRef}
                    className="absolute top-0 left-0 w-[250%] h-[250%] max-w-none will-change-transform"
                  >
                    <img
                      src={activeImageSrc}
                      alt={`${effectiveTitle} zoomed view`}
                      referrerPolicy="no-referrer"
                      draggable={false}
                      className="w-full h-full object-contain p-3"
                    />
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-slate-950/85 border border-slate-700 text-[11px] font-mono-tabular text-white flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{effectiveImageLabels[activeImageIdx] || `View ${activeImageIdx + 1}`} (2.5× Zoom)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery Selector (4 slots standard, 6 slots for A+B / C+E Panel items) */}
            <div
              className={`grid ${
                effectiveImages.length > 4
                  ? 'grid-cols-3 sm:grid-cols-6'
                  : 'grid-cols-4'
              } gap-2`}
            >
              {effectiveImages.map((imgUrl, index) => {
                const hasImg = Boolean(imgUrl && imgUrl.trim().length > 0);
                const isActive = index === activeImageIdx && hasImg;
                const slotLabel = effectiveImageLabels[index] || `View ${index + 1}`;
                return (
                  <button
                    key={index}
                    type="button"
                    disabled={!hasImg}
                    onClick={() => hasImg && setActiveImageIdx(index)}
                    className={`flex flex-col rounded-md overflow-hidden border text-left transition-all ${
                      !hasImg
                        ? 'border-dashed border-slate-200 dark:border-slate-800 opacity-40 cursor-default bg-white dark:bg-slate-950'
                        : isActive
                        ? 'border-[#1E2985] dark:border-emerald-400 ring-2 ring-[#1E2985]/30 dark:ring-emerald-400/30 bg-slate-50 dark:bg-slate-800 cursor-pointer'
                        : 'border-slate-200 dark:border-slate-800 opacity-75 hover:opacity-100 bg-white dark:bg-slate-950 cursor-pointer'
                    }`}
                  >
                    <div className="aspect-4/3 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-center justify-center">
                      {hasImg ? (
                        <img
                          src={imgUrl}
                          alt={slotLabel}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400">#{index + 1}</span>
                      )}
                    </div>
                    <span className="px-1.5 py-1 text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate w-full">
                      {hasImg ? `${index + 1}. ${slotLabel}` : `${index + 1}. Empty`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detailed Product Features Section */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Key Product Features &amp; Capabilities
              </h3>
              <ul className="space-y-2">
                {product.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0D5C2B] dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Detailed Description, Axes Tabs, I/O Board Selector, Specs & Purchase Module (6 cols) */}
          <div className="md:col-span-6 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div>
                <div className="font-mono-tabular text-xs font-bold text-[#1E2985] dark:text-sky-400 flex items-center gap-2">
                  <span>MODEL NO: {effectiveModelNumber}</span>
                  {activeAxisVariant && (
                    <span className="px-2 py-0.5 rounded bg-[#1E2985]/10 dark:bg-emerald-500/15 text-[#1E2985] dark:text-emerald-300 text-[10px]">
                      {activeAxisVariant.axisLabel}
                    </span>
                  )}
                </div>
                <h2
                  id="modal-product-title"
                  className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 leading-tight"
                >
                  {effectiveTitle}
                </h2>
              </div>

              {/* Price & 1 Year Warranty Block */}
              <div className="p-4 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">
                    Unit Price (PKR)
                  </span>
                  <span className="text-2xl font-extrabold font-mono-tabular text-slate-900 dark:text-white">
                    {unitPricePKR > 0
                      ? `PKR ${unitPricePKR.toLocaleString()}`
                      : 'Call for Price'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D5C2B] dark:text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>1 Year Official Warranty</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mt-0.5">
                    {effectiveStockStatus} ({effectiveStockCount} available)
                  </span>
                </div>
              </div>

              {/* Detailed Product Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Detailed Product Description
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {effectiveDescription}
                </p>
              </div>

              {/* Axes Selection Tabs — 3D Button Style with Clear Outline */}
              {hasAxisTabs && product.axisVariants && (
                <div className="p-4 rounded-lg bg-slate-100/90 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#1E2985] dark:text-emerald-400" />
                      <span>Select Axes:</span>
                    </span>
                    <span className="font-mono-tabular text-[#1E2985] dark:text-emerald-400">
                      {activeAxisVariant?.axisLabel}
                    </span>
                  </div>
                  <div
                    role="tablist"
                    aria-label="Select controller axes configuration"
                    className="grid grid-cols-3 sm:grid-cols-4 gap-2.5"
                  >
                    {product.axisVariants.map((variant) => {
                      const isSelected = activeAxisVariant?.id === variant.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          role="tab"
                          aria-selected={isSelected}
                          onClick={() => setSelectedAxisId(variant.id)}
                          className={`py-2 px-3 rounded-md text-xs font-extrabold tracking-wide transition-all duration-150 cursor-pointer select-none ${
                            isSelected
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
                <div className="p-4 rounded-lg bg-slate-100/90 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#1E2985] dark:text-emerald-400" />
                      <span>I/O Board Configuration:</span>
                    </span>
                    <span className="font-mono-tabular text-[#0D5C2B] dark:text-emerald-400">
                      {activeIOBoard && activeIOBoard.priceDelta > 0
                        ? `+PKR ${activeIOBoard.priceDelta.toLocaleString()}`
                        : 'Standard Included'}
                    </span>
                  </div>
                  <div
                    role="tablist"
                    aria-label="Select I/O Board configuration"
                    className="grid grid-cols-2 gap-2.5"
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
                          className={`py-2 px-3 rounded-md text-xs font-extrabold tracking-wide transition-all duration-150 cursor-pointer select-none ${
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

              {/* Technical Specifications Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Technical Specifications
                </h3>
                <div className="border border-slate-200 dark:border-slate-800 rounded-md divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  {product.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 px-3 py-2 bg-white dark:bg-slate-900/60"
                    >
                      <span className="col-span-5 text-slate-500 dark:text-slate-400 font-medium">
                        {spec.label}
                      </span>
                      <span className="col-span-7 font-mono-tabular text-slate-900 dark:text-slate-100 font-semibold text-right">
                        {spec.label === 'Model Number'
                          ? effectiveModelNumber
                          : spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity Stepper & Primary 3D Add to Cart CTA */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-slate-400 dark:border-slate-600 border-b-4 border-b-slate-500 dark:border-b-slate-950 rounded-md bg-gradient-to-b from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="p-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-mono-tabular text-sm font-extrabold text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="p-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-md text-sm font-extrabold text-white transition-all duration-150 cursor-pointer select-none ${
                    addedFeedback
                      ? 'bg-gradient-to-b from-emerald-600 to-[#0D5C2B] border-2 border-emerald-950 border-b-4 border-b-emerald-950 shadow-[0_3px_6px_rgba(13,92,43,0.35),inset_0_1px_0_rgba(255,255,255,0.35)]'
                      : 'bg-gradient-to-b from-[#2b3ab8] to-[#1E2985] hover:from-[#3344cc] hover:to-[#161f69] dark:from-emerald-500 dark:to-emerald-700 border-2 border-[#0c1248] dark:border-emerald-200 border-b-4 border-b-[#070b2e] dark:border-b-emerald-950 shadow-[0_3px_6px_rgba(30,41,133,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] hover:-translate-y-[1px] active:translate-y-[1px]'
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added {quantity} to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        Add to Cart —{' '}
                        {unitPricePKR > 0
                          ? `PKR ${(unitPricePKR * quantity).toLocaleString()}`
                          : 'Request Quote'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
