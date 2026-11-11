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
  LayoutGrid,
  AlertCircle,
  Box,
} from 'lucide-react';
import {
  ProductItem,
  SeriesModelVariant,
  CONTROLLER_IO_BOARD_OPTIONS,
  CONTROLLER_PANEL_OPTIONS,
  PanelOptionId,
  IOBoardOption,
  AxisVariantOption,
  applyPanelPicturesToGallery,
  buildPanelPricesFromBase,
  buildPanelPricesFromCE,
  stripAxisCountFromText,
  stripPanelInfoFromText,
  hasPanelOptionInProduct,
  is1500SeriesController,
  isStandaloneIOBoardProduct,
} from '../data/products';

interface ProductCardProps {
  product: ProductItem;
  activeSubcategory?: string | null;
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
  activeSubcategory = null,
  onAddToCart,
  onSelectProduct,
  rankBadge,
}) => {
  const seriesVariants: SeriesModelVariant[] = product.seriesVariants || [];
  const [selectedSeriesVariantId, setSelectedSeriesVariantId] =
    useState<string>(() => {
      if (seriesVariants.length > 0 && activeSubcategory) {
        const matched = seriesVariants.find(
          (v) =>
            v.subcategory.toLowerCase() === activeSubcategory.toLowerCase()
        );
        if (matched) return matched.id;
      }
      return seriesVariants[0]?.id || product.id;
    });

  useEffect(() => {
    if (seriesVariants.length > 0 && activeSubcategory) {
      const matched = seriesVariants.find(
        (v) => v.subcategory.toLowerCase() === activeSubcategory.toLowerCase()
      );
      if (matched) {
        setSelectedSeriesVariantId(matched.id);
      }
    }
  }, [activeSubcategory, product.id]);

  const activeSeriesVariant: SeriesModelVariant | undefined =
    seriesVariants.length > 0
      ? seriesVariants.find((v) => v.id === selectedSeriesVariantId) ||
        seriesVariants[0]
      : undefined;

  const effectiveProduct: ProductItem = activeSeriesVariant
    ? {
        ...product,
        modelNumber: activeSeriesVariant.modelNumber,
        baseModelNumber: activeSeriesVariant.modelNumber,
        title: activeSeriesVariant.title,
        description: activeSeriesVariant.description,
        subcategory: activeSeriesVariant.subcategory,
        features: activeSeriesVariant.features,
        specs: activeSeriesVariant.specs,
        compatibility: activeSeriesVariant.compatibility,
        price: activeSeriesVariant.price,
        hasPanelOptions: activeSeriesVariant.hasPanelOptions,
        rawPanelType: activeSeriesVariant.rawPanelType,
        panelPrices: activeSeriesVariant.panelPrices,
        hasIOBoardOption: activeSeriesVariant.hasIOBoardOption,
        axisVariants: activeSeriesVariant.axisVariants,
        servoConfigOptions: activeSeriesVariant.servoConfigOptions,
        images: activeSeriesVariant.images,
        imageLabels: activeSeriesVariant.imageLabels,
        defaultImageIndex: activeSeriesVariant.defaultImageIndex,
        stockCount: activeSeriesVariant.stockCount,
        inStock: activeSeriesVariant.inStock,
      }
    : product;

  const axisVariants: AxisVariantOption[] = effectiveProduct.axisVariants || [];
  const [selectedAxisId, setSelectedAxisId] = useState<string>(
    axisVariants[0]?.id || effectiveProduct.id
  );
  const [selectedPanelId, setSelectedPanelId] = useState<PanelOptionId | null>(
    null
  );
  const [panelSelectionError, setPanelSelectionError] =
    useState<boolean>(false);

  useEffect(() => {
    setSelectedAxisId(
      effectiveProduct.axisVariants?.[0]?.id || effectiveProduct.id
    );
    setSelectedPanelId(null);
    setPanelSelectionError(false);
  }, [product.id, selectedSeriesVariantId]);

  const activeAxis: AxisVariantOption | undefined =
    axisVariants.find((v) => v.id === selectedAxisId) || axisVariants[0];

  const hasPanelOptions = Boolean(
    effectiveProduct.hasPanelOptions ||
      hasPanelOptionInProduct(effectiveProduct)
  );
  const is1500Series = is1500SeriesController(effectiveProduct);
  const activePanelOption = selectedPanelId
    ? CONTROLLER_PANEL_OPTIONS.find((p) => p.id === selectedPanelId)
    : undefined;

  // Active images: prefer the active axis variant's custom base image if uploaded, else fallback to merged product images
  const activeAxisHasCustomImg = Boolean(
    activeAxis?.images
      ?.slice(0, 4)
      .some(
        (img) =>
          img &&
          img.trim().length > 0 &&
          !img.startsWith('data:image/svg+xml')
      )
  );
  const rawDisplayImages: string[] =
    activeAxisHasCustomImg && activeAxis?.images
      ? activeAxis.images
      : effectiveProduct.images;

  const rawDisplayImageLabels: string[] =
    activeAxisHasCustomImg && activeAxis?.imageLabels?.length
      ? activeAxis.imageLabels
      : effectiveProduct.imageLabels;

  const { images: displayImages, imageLabels: displayImageLabels } =
    hasPanelOptions
      ? applyPanelPicturesToGallery(rawDisplayImages, rawDisplayImageLabels, {
          modelNumber:
            effectiveProduct.baseModelNumber || effectiveProduct.modelNumber,
          baseModelNumber: effectiveProduct.baseModelNumber,
          title: effectiveProduct.title,
          description: effectiveProduct.description,
          hasPanelOptions: true,
        })
      : { images: rawDisplayImages, imageLabels: rawDisplayImageLabels };

  const rawDefaultIdx =
    activeAxisHasCustomImg && typeof activeAxis?.defaultImageIndex === 'number'
      ? activeAxis.defaultImageIndex
      : effectiveProduct.defaultImageIndex;

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

  const [selectedImageIndex, setSelectedImageIndex] =
    useState<number>(defaultIdx);
  const [selectedIOBoardId, setSelectedIOBoardId] = useState<string>(
    CONTROLLER_IO_BOARD_OPTIONS[0].id
  );
  const servoConfigOptions = effectiveProduct.servoConfigOptions || [];
  const [selectedServoConfigId, setSelectedServoConfigId] = useState<
    'base' | 'brake' | 'absolute'
  >(servoConfigOptions[0]?.id || 'base');
  const [justAdded, setJustAdded] = useState<boolean>(false);

  useEffect(() => {
    setSelectedImageIndex(defaultIdx);
    setSelectedServoConfigId(
      effectiveProduct.servoConfigOptions?.[0]?.id || 'base'
    );
  }, [
    product.id,
    selectedSeriesVariantId,
    selectedAxisId,
    defaultIdx,
    effectiveProduct.servoConfigOptions,
  ]);

  const handleSelectPanel = (
    panelOpt: (typeof CONTROLLER_PANEL_OPTIONS)[number]
  ) => {
    setSelectedPanelId(panelOpt.id);
    setPanelSelectionError(false);
    if (!is1500Series) {
      const panelImgIdx = displayImageLabels.findIndex(
        (lbl) => lbl?.toUpperCase() === panelOpt.tagLabel.toUpperCase()
      );
      if (panelImgIdx !== -1 && displayImages[panelImgIdx]?.trim()) {
        setSelectedImageIndex(panelImgIdx);
      }
    }
  };

  const handleThumbnailClick = (idx: number, slotLabel: string) => {
    setSelectedImageIndex(idx);
    const panelMatch = slotLabel.match(/^(A|B|C|E)-Panel$/i);
    if (panelMatch) {
      setSelectedPanelId(panelMatch[1].toUpperCase() as PanelOptionId);
      setPanelSelectionError(false);
    }
  };

  const activeServoConfig =
    servoConfigOptions.length > 0
      ? servoConfigOptions.find((opt) => opt.id === selectedServoConfigId) ||
        servoConfigOptions[0]
      : undefined;

  const isController =
    (effectiveProduct.category === 'Controllers' ||
      Boolean(effectiveProduct.hasIOBoardOption)) &&
    !isStandaloneIOBoardProduct(effectiveProduct);

  const activeIOBoard: IOBoardOption | undefined = isController
    ? CONTROLLER_IO_BOARD_OPTIONS.find((opt) => opt.id === selectedIOBoardId) ||
      CONTROLLER_IO_BOARD_OPTIONS[0]
    : undefined;

  const fallbackAxisOrBasePrice =
    activeAxis && activeAxis.price > 0
      ? activeAxis.price
      : effectiveProduct.price;

  const rawActivePanelPrices =
    activeAxis?.panelPrices ||
    effectiveProduct.panelPrices ||
    (hasPanelOptions
      ? effectiveProduct.rawPanelType === 'CE'
        ? buildPanelPricesFromCE(fallbackAxisOrBasePrice)
        : buildPanelPricesFromBase(fallbackAxisOrBasePrice)
      : undefined);

  const activePanelPrices =
    rawActivePanelPrices && rawActivePanelPrices.A > 0
      ? buildPanelPricesFromBase(rawActivePanelPrices.A)
      : rawActivePanelPrices;

  const defaultPanelDisplayPrice =
    activePanelPrices?.A ??
    activePanelPrices?.defaultDisplayPrice ??
    fallbackAxisOrBasePrice;

  const panelSpecificPrice = hasPanelOptions
    ? selectedPanelId && activePanelPrices
      ? activePanelPrices[selectedPanelId]
      : defaultPanelDisplayPrice
    : undefined;

  const panelPriceDelta =
    hasPanelOptions &&
    selectedPanelId &&
    panelSpecificPrice !== undefined &&
    defaultPanelDisplayPrice > 0
      ? panelSpecificPrice - defaultPanelDisplayPrice
      : 0;

  const basePricePKR = activeServoConfig
    ? activeServoConfig.price
    : panelSpecificPrice !== undefined
    ? panelSpecificPrice
    : activeAxis
    ? activeAxis.price
    : effectiveProduct.price;
  const effectivePricePKR =
    basePricePKR + (activeIOBoard ? activeIOBoard.priceDelta : 0);

  const displayStockCount = activeAxis
    ? activeAxis.stockCount
    : effectiveProduct.stockCount;
  const displayStockStatus =
    (activeAxis ? activeAxis.stockStatus : effectiveProduct.stockStatus) ||
    (displayStockCount > 0 ? 'In Stock' : 'Pre-Order');
  const displayTitle = stripPanelInfoFromText(
    stripAxisCountFromText(activeAxis?.title || effectiveProduct.title || '')
  );
  const displayDescription = stripPanelInfoFromText(
    stripAxisCountFromText(
      activeAxis?.description || effectiveProduct.description || ''
    )
  );
  const displayModelHeader = stripPanelInfoFromText(
    effectiveProduct.baseModelNumber || effectiveProduct.modelNumber
  );

  const buildSelectedProductPayload = (): ProductItem => {
    if (activeServoConfig) {
      return {
        ...effectiveProduct,
        id: `${effectiveProduct.id}-${activeServoConfig.id}`,
        modelNumber: `${displayModelHeader} (${activeServoConfig.shortLabel})`,
        title: `${displayTitle || displayModelHeader} — ${activeServoConfig.shortLabel}`,
        description: displayDescription,
        price: activeServoConfig.price,
        images: displayImages,
        defaultImageIndex: defaultIdx,
      };
    }
    const chosenPanelLabel = activePanelOption?.label || 'A Panel';
    const panelSuffix = hasPanelOptions ? `, ${chosenPanelLabel}` : '';
    const panelIdSuffix = hasPanelOptions
      ? `-panel-${selectedPanelId || 'A'}`
      : '';
    if (!activeAxis) {
      return {
        ...effectiveProduct,
        id: `${effectiveProduct.id}${panelIdSuffix}`,
        modelNumber: hasPanelOptions
          ? `${displayModelHeader} (${chosenPanelLabel})`
          : displayModelHeader,
        title: displayTitle || displayModelHeader,
        description: displayDescription,
        price: basePricePKR,
        images: displayImages,
        defaultImageIndex: defaultIdx,
      };
    }
    return {
      ...effectiveProduct,
      id: `${activeAxis.id}${panelIdSuffix}`,
      modelNumber: `${displayModelHeader} (${activeAxis.axisLabel}${panelSuffix})`,
      title: displayTitle || displayModelHeader,
      description: displayDescription,
      price: basePricePKR,
      stockCount: activeAxis.stockCount,
      stockStatus: activeAxis.stockStatus,
      images: displayImages,
      defaultImageIndex: defaultIdx,
    };
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasPanelOptions && !selectedPanelId) {
      setPanelSelectionError(true);
      return;
    }
    onAddToCart(buildSelectedProductPayload(), 1, activeIOBoard);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article
      onClick={() => onSelectProduct(effectiveProduct)}
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

      {/* Interactive Thumbnail Gallery Strip (4 slots standard, 8 slots in 2x4 grid when A/B/C/E Panel photos are included) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`grid ${
          displayImages.length === 6 ? 'grid-cols-6' : 'grid-cols-4'
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
              onClick={() => hasImage && handleThumbnailClick(idx, slotLabel)}
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
              {effectiveProduct.category}
              {effectiveProduct.subcategory?.trim() ? ` · ${effectiveProduct.subcategory}` : ''}
            </span>
            <span className="font-mono-tabular text-emerald-700 dark:text-emerald-400 font-semibold shrink-0">
              {displayStockStatus} ({displayStockCount})
            </span>
          </div>

          {/* Series Club Header & Model Number */}
          <div className="flex items-center justify-between gap-2">
            <div className="font-mono-tabular text-xs font-bold text-[#1E2985] dark:text-sky-400 tracking-wide truncate">
              {product.seriesClubName ? (
                <span>
                  {product.seriesClubName} · <span className="text-[#0068AD] dark:text-emerald-400">{displayModelHeader}</span>
                </span>
              ) : (
                <span>MODEL: {displayModelHeader}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {activeAxis && (
                <span className="font-mono-tabular text-[11px] font-semibold text-[#1E2985] dark:text-emerald-400">
                  {activeAxis.axisLabel}
                </span>
              )}
              {hasPanelOptions && activePanelOption && (
                <span className="font-mono-tabular text-[11px] font-semibold text-[#0068AD] dark:text-sky-400">
                  · {activePanelOption.label}
                </span>
              )}
            </div>
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

          {/* SERIES MODEL SELECTION TABS — Clean Flat Screenshot Button Style (Clubbed Controller Series) */}
          {seriesVariants.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-2.5 p-2.5 rounded-[5px] bg-slate-100/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-medium text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#0068AD] dark:text-sky-400" />
                  <span>Select Model ({seriesVariants.length} in Series):</span>
                </span>
                {activeSeriesVariant && (
                  <span className="font-mono-tabular text-[#0068AD] dark:text-sky-400 font-semibold">
                    {activeSeriesVariant.modelNumber}
                  </span>
                )}
              </div>
              <div
                role="tablist"
                aria-label="Select controller model in series"
                className="flex flex-wrap gap-1.5 pt-0.5"
              >
                {seriesVariants.map((sv) => {
                  const isActiveModel =
                    (activeSeriesVariant?.id || '') === sv.id;
                  return (
                    <button
                      key={sv.id}
                      type="button"
                      role="tab"
                      aria-selected={isActiveModel}
                      onClick={() => setSelectedSeriesVariantId(sv.id)}
                      className={`py-1.5 px-2.5 rounded-[5px] text-[11px] font-mono-tabular font-semibold transition-colors duration-150 cursor-pointer select-none ${
                        isActiveModel
                          ? 'bg-[#0068AD] text-white border border-[#0068AD]'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-[#0068AD] hover:text-[#0068AD] dark:hover:border-sky-400 dark:hover:text-sky-400'
                      }`}
                    >
                      {sv.modelButtonLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* AXES SELECTION TABS — Clean Flat Screenshot Button Style */}
          {axisVariants.length > 0 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-2.5 p-2.5 rounded-[5px] bg-slate-100/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-medium text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0068AD] dark:text-sky-400" />
                  <span>Select Axes:</span>
                </span>
                {activeAxis && (
                  <span className="font-mono-tabular text-[#0068AD] dark:text-sky-400 font-semibold">
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
                      className={`flex-1 min-w-[72px] py-2 px-3 rounded-[5px] text-xs font-medium transition-colors duration-150 cursor-pointer select-none ${
                        isActiveAxis
                          ? 'bg-[#0068AD] text-white border border-[#0068AD]'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-[#0068AD] hover:text-[#0068AD] dark:hover:border-sky-400 dark:hover:text-sky-400'
                      }`}
                    >
                      {variant.axisLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PANEL SELECTION TABS (A Panel, B Panel, C Panel, E Panel) — Styled Identically to Axis Selection Buttons */}
          {hasPanelOptions && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={`mt-2.5 p-2.5 rounded-[5px] border space-y-2 transition-colors ${
                panelSelectionError
                  ? 'bg-red-50/90 dark:bg-red-950/30 border-red-500 dark:border-red-500 ring-1 ring-red-500/40'
                  : 'bg-slate-100/90 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-medium text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5 text-[#0068AD] dark:text-sky-400" />
                  <span>Select Panel: <span className="text-red-500">*</span></span>
                </span>
                <span
                  className={`font-mono-tabular font-semibold ${
                    activePanelOption
                      ? 'text-[#0068AD] dark:text-sky-400'
                      : panelSelectionError
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {activePanelOption
                    ? `${activePanelOption.label}${
                        panelPriceDelta > 0
                          ? ` (+PKR ${panelPriceDelta.toLocaleString()})`
                          : ''
                      }`
                    : 'Required'}
                </span>
              </div>
              <div
                role="tablist"
                aria-label="Select controller panel type"
                className="grid grid-cols-4 gap-1.5 pt-0.5"
              >
                {CONTROLLER_PANEL_OPTIONS.map((panelOpt) => {
                  const isActivePanel = selectedPanelId === panelOpt.id;
                  return (
                    <button
                      key={panelOpt.id}
                      type="button"
                      role="tab"
                      aria-selected={isActivePanel}
                      onClick={() => handleSelectPanel(panelOpt)}
                      className={`py-2 px-2 rounded-[5px] text-xs font-medium transition-colors duration-150 cursor-pointer select-none truncate ${
                        isActivePanel
                          ? 'bg-[#0068AD] text-white border border-[#0068AD]'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-[#0068AD] hover:text-[#0068AD] dark:hover:border-sky-400 dark:hover:text-sky-400'
                      }`}
                    >
                      {panelOpt.shortLabel}
                    </button>
                  );
                })}
              </div>
              {panelSelectionError && (
                <div className="flex items-center gap-1.5 pt-0.5 text-[11px] font-semibold text-red-600 dark:text-red-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Please select a Panel (A, B, C, or E) before adding to cart</span>
                </div>
              )}
            </div>
          )}

          {/* I/O Board 2-Tab Selector — Clean Flat Screenshot Button Style */}
          {isController && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-2.5 p-2.5 rounded-[5px] bg-slate-100/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-medium text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#0068AD] dark:text-sky-400" />
                  <span>I/O Board Option:</span>
                </span>
                {activeIOBoard && activeIOBoard.priceDelta > 0 && (
                  <span className="font-mono-tabular text-[#E77817] font-semibold">
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
                      className={`py-2 px-3 rounded-[5px] text-xs font-medium transition-colors duration-150 cursor-pointer select-none ${
                        isActiveTab
                          ? 'bg-[#0068AD] text-white border border-[#0068AD]'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-[#0068AD] hover:text-[#0068AD] dark:hover:border-sky-400 dark:hover:text-sky-400'
                      }`}
                    >
                      {opt.shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Servo Motor 3-Tab Configuration Selector (Base / With Brake / Absolute) */}
          {servoConfigOptions.length > 0 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-2.5 p-2.5 rounded-[5px] bg-slate-100/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-medium text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#0068AD] dark:text-sky-400" />
                  <span>Motor Configuration:</span>
                </span>
                {activeServoConfig && (
                  <span className="font-mono-tabular text-[#0068AD] dark:text-sky-400 font-semibold">
                    {activeServoConfig.shortLabel}
                  </span>
                )}
              </div>
              <div
                role="tablist"
                aria-label="Select Servo Motor configuration"
                className="grid grid-cols-3 gap-1.5 pt-0.5"
              >
                {servoConfigOptions.map((opt) => {
                  const isActiveTab =
                    (activeServoConfig?.id || 'base') === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="tab"
                      aria-selected={isActiveTab}
                      onClick={() => setSelectedServoConfigId(opt.id)}
                      className={`py-2 px-2 rounded-[5px] text-[11px] font-medium transition-colors duration-150 cursor-pointer select-none truncate ${
                        isActiveTab
                          ? 'bg-[#0068AD] text-white border border-[#0068AD]'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-[#0068AD] hover:text-[#0068AD] dark:hover:border-sky-400 dark:hover:text-sky-400'
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

        {/* Price & Dual Action Buttons (Screenshot Blue #0068AD & Orange #E77817 Style) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3"
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {basePricePKR <= 0
                ? 'Pricing'
                : activeIOBoard && activeIOBoard.priceDelta > 0
                ? `Price (${hasPanelOptions && activePanelOption ? `${activePanelOption.label}, ` : ''}incl. I/O)`
                : activeServoConfig
                ? `Price (${activeServoConfig.shortLabel})`
                : hasPanelOptions && activePanelOption
                ? `Unit Price (${activePanelOption.label})`
                : 'Unit Price'}
            </span>
            <span className="text-lg font-bold font-mono-tabular text-slate-900 dark:text-white">
              {basePricePKR > 0
                ? `PKR ${effectivePricePKR.toLocaleString()}`
                : 'Call for Price'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onSelectProduct(effectiveProduct)}
              className="flex items-center justify-center h-10 px-4 rounded-[5px] bg-[#0068AD] hover:bg-[#00558F] text-white text-sm font-normal tracking-normal transition-colors duration-150 cursor-pointer select-none"
            >
              Details
            </button>

            <button
              type="button"
              onClick={handleAdd}
              className={`flex items-center justify-center gap-1.5 h-10 px-4 rounded-[5px] text-white text-sm font-normal tracking-normal transition-colors duration-150 whitespace-nowrap cursor-pointer select-none ${
                justAdded
                  ? 'bg-[#0D5C2B]'
                  : 'bg-[#E77817] hover:bg-[#d1680f]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

