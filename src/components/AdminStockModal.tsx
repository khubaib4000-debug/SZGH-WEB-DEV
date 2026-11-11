import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  X,
  Plus,
  Minus,
  LogIn,
  LogOut,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Package,
  RefreshCw,
  Image as ImageIcon,
  Star,
  Upload,
  PlusCircle,
  Layers,
  FileSpreadsheet,
  Download,
  ArrowRight,
  Edit3,
  ClipboardList,
  Printer,
} from 'lucide-react';
import {
  User,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  ADMIN_EMAILS,
  OperationType,
  handleFirestoreError,
} from '../lib/firebase';
import {
  ProductItem,
  ProductCategory,
  OFFICIAL_SUBCATEGORY_GROUPS,
  resolveOfficialSubcategory,
  stripAxisCountFromText,
  isSZGH880MCModel,
  SZGH_880MC_IMAGES,
  SZGH_880MC_DEFAULT_IMAGE_INDEX,
  isSZGH1080MCModel,
  SZGH_1080MC_IMAGES,
  SZGH_1080MC_DEFAULT_IMAGE_INDEX,
  isSZGH880TCModel,
  SZGH_880TC_IMAGES,
  SZGH_880TC_DEFAULT_IMAGE_INDEX,
  isSZGH1080TCModel,
  SZGH_1080TC_IMAGES,
  SZGH_1080TC_DEFAULT_IMAGE_INDEX,
  isSZGH1080MICModel,
  SZGH_1080MIC_IMAGES,
  SZGH_1080MIC_DEFAULT_IMAGE_INDEX,
  isSZGH880TICModel,
  SZGH_880TIC_IMAGES,
  SZGH_880TIC_DEFAULT_IMAGE_INDEX,
  isSZGH1000MDBModel,
  SZGH_1000MDB_IMAGES,
  SZGH_1000MDB_DEFAULT_IMAGE_INDEX,
  isSZGH1500MDBModel,
  SZGH_1500MDB_IMAGES,
  SZGH_1500MDB_DEFAULT_IMAGE_INDEX,
  isSZGH990MDBModel,
  SZGH_990MDB_IMAGES,
  SZGH_990MDB_DEFAULT_IMAGE_INDEX,
  isSZGH990MDCModel,
  SZGH_990MDC_IMAGES,
  SZGH_990MDC_DEFAULT_IMAGE_INDEX,
  isSZGH990TDBModel,
  SZGH_990TDB_IMAGES,
  SZGH_990TDB_DEFAULT_IMAGE_INDEX,
  isSZGH990TDCModel,
  SZGH_990TDC_IMAGES,
  SZGH_990TDC_DEFAULT_IMAGE_INDEX,
  isSZGH1000MCModel,
  SZGH_1000MC_IMAGES,
  SZGH_1000MC_DEFAULT_IMAGE_INDEX,
  isSZGH1000MDCModel,
  SZGH_1000MDC_IMAGES,
  SZGH_1000MDC_DEFAULT_IMAGE_INDEX,
  isSZGH1500MDCModel,
  SZGH_1500MDC_IMAGES,
  SZGH_1500MDC_DEFAULT_IMAGE_INDEX,
  isSZGH1000MDCBModel,
  SZGH_1000MDCB_IMAGES,
  SZGH_1000MDCB_DEFAULT_IMAGE_INDEX,
  isSZGH1500MDCBModel,
  SZGH_1500MDCB_IMAGES,
  SZGH_1500MDCB_DEFAULT_IMAGE_INDEX,
  isSZGH1000TDBModel,
  SZGH_1000TDB_IMAGES,
  SZGH_1000TDB_DEFAULT_IMAGE_INDEX,
  isSZGH1000TCModel,
  isSZGH1080TICModel,
  isSZGH1080TDBModel,
  isSZGH1080MDBModel,
  isSZGH1080MDCModel,
  isSZGHCNCIO12Model,
  SZGH_CNC_IO12_IMAGES,
  SZGH_CNC_IO12_DEFAULT_IMAGE_INDEX,
  hasABPanelInProduct,
  hasCEPanelInProduct,
  hasPanelOptionInProduct,
  is1500SeriesController,
  normalizePanelStrings,
  applyPanelPicturesToGallery,
  PanelPriceBreakdown,
  buildPanelPricesFromBase,
  buildPanelPricesFromCE,
  detectControllerSeriesClub,
  extractBaseModelAndAxis,
  resolveOfficialRateListPricing,
} from '../data/products';
import { SubmittedCustomerOrder } from './CartDrawer';

interface AdminStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  currentUser: User | null;
  syncedProductIds: Set<string>;
  customProductIds: string[];
  orders?: SubmittedCustomerOrder[];
  onUpdateOrderStatus?: (
    orderId: string,
    newStatus: SubmittedCustomerOrder['orderStatus']
  ) => void;
}

export interface TrackedExcelStockItem {
  rowNumber: number;
  matchedProductId: string | null;
  modelNumber: string;
  title: string; // Left '' if not available in Excel
  category: ProductCategory | ''; // Left '' if not available in Excel
  subcategory: string; // Left '' if not available in Excel
  description: string; // Left '' if not available in Excel
  price: string; // String so empty '' is preserved when not in Excel
  stockCount: string; // String so empty '' is preserved if not in Excel
  images: string[]; // Left ['', '', '', ''] if not available in Excel (or 8 slots for A/B/C/E Panel items)
  defaultImageIndex: number;
  panelPrices?: PanelPriceBreakdown;
  extraColumns: Record<string, string>;
}

/**
 * Compresses an uploaded image file via HTML5 Canvas into a compact JPEG Data URL (<80KB)
 * so up to 4 product photos fit effortlessly inside a single Firestore document.
 */
async function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file format.'));
      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable.'));
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.75;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length > 180000 && quality > 0.35) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function normalizeCategoryValue(raw: string): ProductCategory | '' {
  const lower = raw.trim().toLowerCase();
  if (!lower) return '';
  if (
    lower.includes('controller') ||
    lower.includes('cnc system') ||
    lower.includes('lathe system') ||
    lower.includes('milling system')
  ) {
    return 'Controllers';
  }
  if (
    lower.includes('motor') ||
    lower.includes('servo') ||
    lower.includes('drive') ||
    lower.includes('spindle')
  ) {
    return 'Motors';
  }
  if (
    lower.includes('machine') ||
    lower.includes('vmc') ||
    lower.includes('turning center') ||
    lower.includes('machining center')
  ) {
    return 'Machines';
  }
  if (lower.includes('robot') || lower.includes('arm') || lower.includes('welding')) {
    return 'Robots';
  }
  return '';
}

function extractTitleFromDescription(
  description?: string,
  existingTitle?: string
): string {
  if (existingTitle && existingTitle.trim().length > 0) {
    return stripAxisCountFromText(existingTitle.trim()).slice(0, 200);
  }
  if (!description || !description.trim()) {
    return '';
  }
  const cleaned = stripAxisCountFromText(description).replace(/\s+/g, ' ');
  const firstSegment = cleaned.split(/\r?\n|(?<=[.!?])\s+/)[0] || cleaned;
  return firstSegment.slice(0, 140).trim();
}

export const AdminStockModal: React.FC<AdminStockModalProps> = ({
  isOpen,
  onClose,
  products,
  currentUser,
  syncedProductIds,
  customProductIds,
  orders = [],
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'manage' | 'create' | 'excel' | 'orders'>('manage');
  const [searchQuery, setSearchQuery] = useState('');
  const [stepAmount, setStepAmount] = useState<number>(1);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [bulkSyncing, setBulkSyncing] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Local draft edits for existing products in Manage tab
  const [draftEdits, setDraftEdits] = useState<
    Record<
      string,
      {
        stockCount: number;
        price: number;
        stockStatus: 'In Stock' | 'Low Stock' | 'Pre-Order';
        title: string;
        subcategory: string;
        description: string;
      }
    >
  >({});

  // Inline Photo & Default Picture Editor state for existing products
  const [expandedPhotoProductId, setExpandedPhotoProductId] = useState<string | null>(null);
  const [photoDrafts, setPhotoDrafts] = useState<
    Record<
      string,
      {
        images: string[];
        defaultImageIndex: number;
      }
    >
  >({});

  // New / Loaded Product Listing Form State (All optional tabs left empty by default)
  const [editingCustomProductId, setEditingCustomProductId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<ProductCategory | ''>('');
  const [newSubcategory, setNewSubcategory] = useState<string>('');
  const [newModelNumber, setNewModelNumber] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newPrice, setNewPrice] = useState<string>('');
  const [newStockCount, setNewStockCount] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newImages, setNewImages] = useState<string[]>([
    '',
    '',
    '',
    '',
  ]);
  const [newDefaultImageIndex, setNewDefaultImageIndex] = useState<number>(0);
  const [creatingProduct, setCreatingProduct] = useState<boolean>(false);

  // Excel (.xlsx) "stock list" Sheet Tracker State
  const [excelFileName, setExcelFileName] = useState<string>('');
  const [excelSheetNames, setExcelSheetNames] = useState<string[]>([]);
  const [selectedSheetName, setSelectedSheetName] = useState<string>('');
  const [workbookCache, setWorkbookCache] = useState<XLSX.WorkBook | null>(null);
  const [trackedExcelItems, setTrackedExcelItems] = useState<TrackedExcelStockItem[]>([]);
  const [syncingExcelItems, setSyncingExcelItems] = useState<boolean>(false);

  if (!isOpen) return null;

  const isAuthorizedAdmin =
    Boolean(currentUser) &&
    currentUser?.emailVerified === true &&
    Boolean(
      currentUser?.email &&
        ADMIN_EMAILS.some(
          (adminEmail) =>
            adminEmail.toLowerCase() === currentUser.email?.toLowerCase()
        )
    );

  const deriveStatusFromCount = (
    qty: number
  ): 'In Stock' | 'Low Stock' | 'Pre-Order' => {
    if (qty <= 0) return 'Pre-Order';
    if (qty <= 3) return 'Low Stock';
    return 'In Stock';
  };

  const handleGoogleLogin = async () => {
    setStatusBanner(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setStatusBanner({
        type: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'Google Sign-In was cancelled or blocked.',
      });
    }
  };

  const handleLogout = async () => {
    setStatusBanner(null);
    await signOut(auth);
  };

  /**
   * Preserves empty image tabs ('') if no image was provided for that slot.
   * Supports 4 slots by default (and for 1500 series), and 8 slots (4 base + 4 A/B/C/E panel images) for non-1500 panel controllers.
   */
  const buildPreservedImages = (
    rawImages: string[],
    itemContext?: {
      modelNumber?: string;
      baseModelNumber?: string;
      title?: string;
      description?: string;
      hasPanelOptions?: boolean;
    }
  ): string[] => {
    const baseFour = [
      (rawImages[0]?.trim() || '').slice(0, 215000),
      (rawImages[1]?.trim() || '').slice(0, 215000),
      (rawImages[2]?.trim() || '').slice(0, 215000),
      (rawImages[3]?.trim() || '').slice(0, 215000),
    ];
    if (itemContext && is1500SeriesController(itemContext)) {
      return baseFour;
    }
    if (itemContext && hasPanelOptionInProduct(itemContext)) {
      const { images: withPanels } = applyPanelPicturesToGallery(
        baseFour,
        [],
        itemContext
      );
      return [
        withPanels[0],
        withPanels[1],
        withPanels[2],
        withPanels[3],
        (rawImages[4]?.trim() || withPanels[4] || '').slice(0, 215000),
        (rawImages[5]?.trim() || withPanels[5] || '').slice(0, 215000),
        (rawImages[6]?.trim() || withPanels[6] || '').slice(0, 215000),
        (rawImages[7]?.trim() || withPanels[7] || '').slice(0, 215000),
      ];
    }
    return baseFour;
  };

  const saveProductInventoryToCloud = async (
    product: ProductItem,
    newStockCountVal: number,
    newPriceVal: number,
    explicitStatus?: 'In Stock' | 'Low Stock' | 'Pre-Order',
    customImages?: string[],
    customDefaultIdx?: number,
    customTitle?: string,
    customSubcategory?: string,
    customDescription?: string
  ) => {
    if (!currentUser || !isAuthorizedAdmin) return;

    const clampedStock = Math.max(0, Math.min(100000, Math.round(newStockCountVal)));
    const clampedPrice = Math.max(0, Math.min(1000000000, Math.round(newPriceVal)));
    const computedStatus = explicitStatus || deriveStatusFromCount(clampedStock);
    const imagesToSave = buildPreservedImages(customImages || product.images, product);
    const maxSlotIdx = imagesToSave.length - 1;
    const defaultIdxToSave = Math.max(
      0,
      Math.min(
        maxSlotIdx,
        typeof customDefaultIdx === 'number'
          ? Math.round(customDefaultIdx)
          : typeof product.defaultImageIndex === 'number'
          ? Math.round(product.defaultImageIndex)
          : 0
      )
    );

    const descToSave =
      customDescription !== undefined
        ? customDescription.trim()
        : (product.description || '').trim();
    const rawTitleCandidate =
      customTitle !== undefined ? customTitle.trim() : (product.title || '').trim();
    const titleToSave = extractTitleFromDescription(descToSave, rawTitleCandidate);
    const subcatToSave =
      customSubcategory !== undefined
        ? customSubcategory.trim()
        : (product.subcategory || '').trim();

    setSavingId(product.id);
    setStatusBanner(null);

    const path = `inventory/${product.id}`;
    try {
      await setDoc(doc(db, 'inventory', product.id), {
        productId: product.id.slice(0, 128),
        modelNumber: product.modelNumber.slice(0, 120),
        title: titleToSave.slice(0, 200),
        category: product.category,
        subcategory: subcatToSave.slice(0, 120),
        description: descToSave.slice(0, 1500),
        price: clampedPrice,
        stockCount: clampedStock,
        stockStatus: computedStatus,
        defaultImageIndex: defaultIdxToSave,
        images: imagesToSave,
        updatedBy: currentUser.uid,
        updatedAt: serverTimestamp(),
      });

      setDraftEdits((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });

      setStatusBanner({
        type: 'success',
        message: `Saved ${product.modelNumber} (${titleToSave || 'No Title'}): Stock = ${clampedStock} (${computedStatus}), Price = ${
          clampedPrice > 0 ? `PKR ${clampedPrice.toLocaleString()}` : 'Empty / Call for Price'
        }`,
      });
    } catch (error) {
      setStatusBanner({
        type: 'error',
        message:
          'Failed to update live product in Firebase. Ensure you are signed in with an authorized admin email.',
      });
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setSavingId(null);
    }
  };

  const handleSyncAllCatalogToCloud = async (forceTitleFromDesc = false) => {
    if (!currentUser || !isAuthorizedAdmin) return;
    setBulkSyncing(true);
    setStatusBanner(null);
    try {
      for (const product of products) {
        const path = `inventory/${product.id}`;
        const computedStatus =
          product.stockStatus || deriveStatusFromCount(product.stockCount);
        const imagesToSave = buildPreservedImages(product.images, product);
        const defaultIdx = Math.max(
          0,
          Math.min(imagesToSave.length - 1, Math.round(product.defaultImageIndex ?? 0))
        );
        const descText = (product.description || '').trim();
        const derivedTitle = forceTitleFromDesc
          ? extractTitleFromDescription(descText) || (product.title || '').trim()
          : extractTitleFromDescription(descText, product.title);

        try {
          await setDoc(doc(db, 'inventory', product.id), {
            productId: product.id.slice(0, 128),
            modelNumber: product.modelNumber.slice(0, 120),
            title: derivedTitle.slice(0, 200),
            category: product.category,
            subcategory: (product.subcategory || '').slice(0, 120),
            description: descText.slice(0, 1500),
            price: Math.max(0, Math.min(1000000000, Math.round(product.price))),
            stockCount: Math.max(0, Math.min(100000, Math.round(product.stockCount))),
            stockStatus: computedStatus,
            defaultImageIndex: defaultIdx,
            images: imagesToSave,
            updatedBy: currentUser.uid,
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, path);
        }
      }

      // Also update any tracked Excel rows in memory so their Title column is populated from Description
      setTrackedExcelItems((prev) =>
        prev.map((row) => ({
          ...row,
          title: forceTitleFromDesc
            ? extractTitleFromDescription(row.description) || row.title
            : extractTitleFromDescription(row.description, row.title),
        }))
      );

      setStatusBanner({
        type: 'success',
        message: forceTitleFromDesc
          ? `Fetched Title from Description and updated all ${products.length} products in Stock Admin & Firebase!`
          : `All ${products.length} catalog products are now synced to Firebase.`,
      });
    } finally {
      setBulkSyncing(false);
    }
  };

  const handleTogglePhotoManager = (product: ProductItem) => {
    if (expandedPhotoProductId === product.id) {
      setExpandedPhotoProductId(null);
      return;
    }
    setExpandedPhotoProductId(product.id);
    if (!photoDrafts[product.id]) {
      setPhotoDrafts((prev) => ({
        ...prev,
        [product.id]: {
          images: [...product.images],
          defaultImageIndex: product.defaultImageIndex ?? 0,
        },
      }));
    }
  };

  const handleExistingProductFileUpload = async (
    product: ProductItem,
    slotIndex: number,
    file: File | undefined
  ) => {
    if (!file) return;
    try {
      const compressedDataUrl = await compressImageFile(file);
      setPhotoDrafts((prev) => {
        const current = prev[product.id] || {
          images: [...product.images],
          defaultImageIndex: product.defaultImageIndex ?? 0,
        };
        const updatedImages = [...current.images];
        updatedImages[slotIndex] = compressedDataUrl;
        return {
          ...prev,
          [product.id]: {
            ...current,
            images: updatedImages,
          },
        };
      });
    } catch (err) {
      setStatusBanner({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to process image file.',
      });
    }
  };

  const handleNewProductFileUpload = async (
    slotIndex: number,
    file: File | undefined
  ) => {
    if (!file) return;
    try {
      const compressedDataUrl = await compressImageFile(file);
      setNewImages((prev) => {
        const next = [...prev];
        next[slotIndex] = compressedDataUrl;
        return next;
      });
    } catch (err) {
      setStatusBanner({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to process uploaded image.',
      });
    }
  };

  const handleCreateNewProductListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !isAuthorizedAdmin) return;

    const trimmedModel = newModelNumber.trim();
    const trimmedDesc = newDescription.trim(); // Left '' if empty
    const trimmedTitle = extractTitleFromDescription(trimmedDesc, newTitle); // Auto-fetched from description if title is empty
    const resolvedCategory: ProductCategory = newCategory || 'Controllers';
    const trimmedSubcat = resolveOfficialSubcategory({
      category: resolvedCategory,
      subcategory: newSubcategory.trim(),
      modelNumber: trimmedModel,
      title: trimmedTitle,
      description: trimmedDesc,
    });

    if (!trimmedModel) {
      setStatusBanner({
        type: 'error',
        message: 'Please provide at least the Model Number.',
      });
      return;
    }

    const sanitizedModelSlug = trimmedModel
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);

    const targetProductId =
      editingCustomProductId ||
      `szgh-item-${sanitizedModelSlug || 'item'}-${Date.now().toString(36).slice(-5)}`;

    const is880MC = isSZGH880MCModel({ modelNumber: trimmedModel });
    const is1080MC = isSZGH1080MCModel({ modelNumber: trimmedModel });
    const is1080MIC = isSZGH1080MICModel({ modelNumber: trimmedModel });
    const is880TC = isSZGH880TCModel({ modelNumber: trimmedModel });
    const is880TIC = isSZGH880TICModel({ modelNumber: trimmedModel });
    const is1080TC = isSZGH1080TCModel({ modelNumber: trimmedModel });
    const is1000MDB = isSZGH1000MDBModel({ modelNumber: trimmedModel });
    const is1500MDB = isSZGH1500MDBModel({ modelNumber: trimmedModel });
    const is990MDB = isSZGH990MDBModel({ modelNumber: trimmedModel });
    const is990MDC = isSZGH990MDCModel({ modelNumber: trimmedModel });
    const is990TDB = isSZGH990TDBModel({ modelNumber: trimmedModel });
    const is990TDC = isSZGH990TDCModel({ modelNumber: trimmedModel });
    const is1000MC = isSZGH1000MCModel({ modelNumber: trimmedModel });
    const is1000MDC = isSZGH1000MDCModel({ modelNumber: trimmedModel });
    const is1500MDC = isSZGH1500MDCModel({ modelNumber: trimmedModel });
    const is1000MDCB = isSZGH1000MDCBModel({ modelNumber: trimmedModel });
    const is1500MDCB = isSZGH1500MDCBModel({ modelNumber: trimmedModel });
    const is1000TDB = isSZGH1000TDBModel({ modelNumber: trimmedModel });
    const isCNCIO12 = isSZGHCNCIO12Model({
      modelNumber: trimmedModel,
      title: trimmedTitle,
      description: trimmedDesc,
    });
    const normPanel = normalizePanelStrings({
      modelNumber: trimmedModel,
      title: trimmedTitle,
      description: trimmedDesc,
    });
    const baseFourImages: string[] = is880MC
      ? SZGH_880MC_IMAGES
      : is1080MC
      ? SZGH_1080MC_IMAGES
      : is1080MIC
      ? SZGH_1080MIC_IMAGES
      : is880TC
      ? SZGH_880TC_IMAGES
      : is880TIC
      ? SZGH_880TIC_IMAGES
      : is1080TC
      ? SZGH_1080TC_IMAGES
      : is1000MDB
      ? SZGH_1000MDB_IMAGES
      : is1500MDB
      ? SZGH_1500MDB_IMAGES
      : is990MDB
      ? SZGH_990MDB_IMAGES
      : is990MDC
      ? SZGH_990MDC_IMAGES
      : is990TDB
      ? SZGH_990TDB_IMAGES
      : is990TDC
      ? SZGH_990TDC_IMAGES
      : is1000MC
      ? SZGH_1000MC_IMAGES
      : is1000MDC
      ? SZGH_1000MDC_IMAGES
      : is1500MDC
      ? SZGH_1500MDC_IMAGES
      : is1000MDCB
      ? SZGH_1000MDCB_IMAGES
      : is1500MDCB
      ? SZGH_1500MDCB_IMAGES
      : is1000TDB
      ? SZGH_1000TDB_IMAGES
      : isCNCIO12
      ? SZGH_CNC_IO12_IMAGES
      : buildPreservedImages(newImages, normPanel);
    const normalizedImages = buildPreservedImages(baseFourImages, normPanel);
    const parsedStock =
      newStockCount.trim() === '' ? 0 : Math.max(0, Math.min(100000, Math.round(Number(newStockCount) || 0)));
    const parsedPrice =
      newPrice.trim() === '' ? 0 : Math.max(0, Math.min(1000000000, Math.round(Number(newPrice) || 0)));
    const computedStatus = deriveStatusFromCount(parsedStock);
    const defaultIdx = is880MC
      ? SZGH_880MC_DEFAULT_IMAGE_INDEX
      : is1080MC
      ? SZGH_1080MC_DEFAULT_IMAGE_INDEX
      : is1080MIC
      ? SZGH_1080MIC_DEFAULT_IMAGE_INDEX
      : is880TC
      ? SZGH_880TC_DEFAULT_IMAGE_INDEX
      : is880TIC
      ? SZGH_880TIC_DEFAULT_IMAGE_INDEX
      : is1080TC
      ? SZGH_1080TC_DEFAULT_IMAGE_INDEX
      : is1000MDB
      ? SZGH_1000MDB_DEFAULT_IMAGE_INDEX
      : is1500MDB
      ? SZGH_1500MDB_DEFAULT_IMAGE_INDEX
      : is990MDB
      ? SZGH_990MDB_DEFAULT_IMAGE_INDEX
      : is990MDC
      ? SZGH_990MDC_DEFAULT_IMAGE_INDEX
      : is990TDB
      ? SZGH_990TDB_DEFAULT_IMAGE_INDEX
      : is990TDC
      ? SZGH_990TDC_DEFAULT_IMAGE_INDEX
      : is1000MC
      ? SZGH_1000MC_DEFAULT_IMAGE_INDEX
      : is1000MDC
      ? SZGH_1000MDC_DEFAULT_IMAGE_INDEX
      : is1500MDC
      ? SZGH_1500MDC_DEFAULT_IMAGE_INDEX
      : is1000MDCB
      ? SZGH_1000MDCB_DEFAULT_IMAGE_INDEX
      : is1500MDCB
      ? SZGH_1500MDCB_DEFAULT_IMAGE_INDEX
      : is1000TDB
      ? SZGH_1000TDB_DEFAULT_IMAGE_INDEX
      : isCNCIO12
      ? SZGH_CNC_IO12_DEFAULT_IMAGE_INDEX
      : Math.max(0, Math.min(normalizedImages.length - 1, Math.round(newDefaultImageIndex)));

    setCreatingProduct(true);
    setStatusBanner(null);

    const inventoryPath = `inventory/${targetProductId}`;
    const manifestPath = `catalog_index/active_manifest`;

    try {
      await setDoc(doc(db, 'inventory', targetProductId), {
        productId: targetProductId,
        modelNumber: trimmedModel.slice(0, 120),
        title: trimmedTitle.slice(0, 200),
        category: resolvedCategory,
        subcategory: trimmedSubcat.slice(0, 120),
        description: trimmedDesc.slice(0, 1500),
        price: parsedPrice,
        stockCount: parsedStock,
        stockStatus: computedStatus,
        defaultImageIndex: defaultIdx,
        images: normalizedImages,
        updatedBy: currentUser.uid,
        updatedAt: serverTimestamp(),
      });

      const isBuiltIn = products.some(
        (p) => p.id === targetProductId && !customProductIds.includes(targetProductId)
      );
      if (!isBuiltIn) {
        const updatedCustomIds = Array.from(
          new Set([...customProductIds, targetProductId])
        ).slice(0, 500);

        await setDoc(doc(db, 'catalog_index', 'active_manifest'), {
          manifestId: 'active_manifest',
          customProductIds: updatedCustomIds,
          updatedBy: currentUser.uid,
          updatedAt: serverTimestamp(),
        });
      }

      // Reset form & switch to Manage tab
      setEditingCustomProductId(null);
      setNewCategory('');
      setNewSubcategory('');
      setNewModelNumber('');
      setNewTitle('');
      setNewPrice('');
      setNewStockCount('');
      setNewDescription('');
      setNewImages(['', '', '', '']);
      setNewDefaultImageIndex(0);
      setActiveTab('manage');
      setStatusBanner({
        type: 'success',
        message: `Saved item "${trimmedModel}" to Stock Admin (empty tabs preserved where information was not provided).`,
      });
    } catch (err) {
      setStatusBanner({
        type: 'error',
        message:
          'Failed to save product listing. Please check your admin sign-in status.',
      });
      handleFirestoreError(err, OperationType.WRITE, `${inventoryPath} | ${manifestPath}`);
    } finally {
      setCreatingProduct(false);
    }
  };

  /**
   * Parses a single worksheet into TrackedExcelStockItem[] rows,
   * leaving any missing fields/tabs strictly empty ('').
   */
  const extractTrackedItemsFromSingleSheet = (
    workbook: XLSX.WorkBook,
    sheetName: string
  ): TrackedExcelStockItem[] => {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      return [];
    }

    const rows2D = XLSX.utils.sheet_to_json< unknown[] >(worksheet, {
      header: 1,
      defval: '',
      blankrows: false,
    });

    if (!rows2D || rows2D.length === 0) {
      return [];
    }

    // Find the header row (scans first 15 rows for column names like Model, Item, Code, Stock, Qty, Price, Description, etc.)
    let headerRowIndex = 0;
    let bestScore = -1;
    const headerKeywords = [
      'model',
      'item',
      'part',
      'code',
      'product',
      'name',
      'title',
      'description',
      'spec',
      'stock',
      'qty',
      'quantity',
      'balance',
      'price',
      'rate',
      'pkr',
      'category',
      'type',
    ];

    for (let r = 0; r < Math.min(15, rows2D.length); r++) {
      const rowCells = (rows2D[r] || []).map((c) => String(c ?? '').trim().toLowerCase());
      let score = 0;
      for (const cell of rowCells) {
        if (!cell) continue;
        if (headerKeywords.some((kw) => cell.includes(kw))) {
          score += 1;
        }
      }
      if (score > bestScore && score >= 1) {
        bestScore = score;
        headerRowIndex = r;
      }
    }

    const rawHeaders = (rows2D[headerRowIndex] || []).map((h, idx) => {
      const cleaned = String(h ?? '').trim();
      return cleaned || `Column_${idx + 1}`;
    });

    // Identify column indices for known fields
    const findColIdx = (predicates: ((h: string) => boolean)[]): number => {
      for (const pred of predicates) {
        const found = rawHeaders.findIndex((h) => pred(h.toLowerCase()));
        if (found !== -1) return found;
      }
      return -1;
    };

    const modelIdx = findColIdx([
      (h) => h === 'model' || h === 'model no' || h === 'model number' || h === 'model#',
      (h) => h.includes('model'),
      (h) => h.includes('part no') || h.includes('part number') || h.includes('item code') || h === 'code' || h === 'sku',
      (h) => h === 'item' || h === 'items' || h === 'product',
    ]);

    const titleIdx = findColIdx([
      (h) => h === 'title' || h === 'product title' || h === 'item name' || h === 'product name' || h === 'name',
      (h) => (h.includes('title') || h.includes('name')) && h.indexOf('model') === -1,
    ]);

    const categoryIdx = findColIdx([
      (h) => h === 'category' || h === 'main category' || h === 'department',
      (h) => h.includes('category') && !h.includes('sub'),
      (h) => h === 'type' || h === 'group',
    ]);

    const subcategoryIdx = findColIdx([
      (h) => h.includes('sub') && h.includes('category'),
      (h) => h === 'subcategory' || h === 'series' || h === 'sub-type' || h === 'subtype',
    ]);

    const descIdx = findColIdx([
      (h) => h === 'description' || h === 'specifications' || h === 'specs' || h === 'details',
      (h) => h.includes('desc') || h.includes('spec') || h.includes('remark') || h.includes('detail'),
    ]);

    const stockIdx = findColIdx([
      (h) => h === 'stock' || h === 'qty' || h === 'quantity' || h === 'in stock' || h === 'balance' || h === 'stock qty',
      (h) => h.includes('stock') || h.includes('qty') || h.includes('quantity') || h.includes('avail') || h.includes('balance') || h.includes('pcs') || h.includes('unit'),
    ]);

    const panelAIdx = findColIdx([
      (h) => h === 'a panel price pkr' || h === 'a+b panel price pkr' || h === 'panel a price' || h === 'a panel price',
      (h) => (h.includes('a panel') || h.includes('a+b panel') || h.includes('panel a')) && (h.includes('price') || h.includes('pkr')),
    ]);
    const panelBIdx = findColIdx([
      (h) => h === 'b panel price pkr' || h === 'panel b price' || h === 'b panel price',
      (h) => (h.includes('b panel') || h.includes('panel b')) && !h.includes('a+b') && (h.includes('price') || h.includes('pkr')),
    ]);
    const panelCIdx = findColIdx([
      (h) => h === 'c panel price pkr' || h === 'c+e panel price pkr' || h === 'panel c price' || h === 'c panel price',
      (h) => (h.includes('c panel') || h.includes('c+e panel') || h.includes('panel c')) && (h.includes('price') || h.includes('pkr')),
    ]);
    const panelEIdx = findColIdx([
      (h) => h === 'e panel price pkr' || h === 'panel e price' || h === 'e panel price',
      (h) => (h.includes('e panel') || h.includes('panel e')) && !h.includes('c+e') && (h.includes('price') || h.includes('pkr')),
    ]);

    const priceIdx = findColIdx([
      (h) => h === 'price' || h === 'price pkr' || h === 'unit price' || h === 'pkr' || h === 'rate' || h === 'base price pkr',
      (h) =>
        (h.includes('price') || h.includes('rate') || h.includes('pkr') || h.includes('cost') || h.includes('amount')) &&
        !h.includes('panel') &&
        !h.includes('i/o') &&
        !h.includes('status'),
    ]);

    const img1Idx = findColIdx([
      (h) => h === 'image' || h === 'image 1' || h === 'picture' || h === 'picture 1' || h === 'photo' || h === 'photo 1' || h === 'image url',
      (h) => h.includes('image') || h.includes('photo') || h.includes('pic'),
    ]);
    const img2Idx = findColIdx([(h) => h === 'image 2' || h === 'picture 2' || h === 'photo 2']);
    const img3Idx = findColIdx([(h) => h === 'image 3' || h === 'picture 3' || h === 'photo 3']);
    const img4Idx = findColIdx([(h) => h === 'image 4' || h === 'picture 4' || h === 'photo 4']);

    const usedIndices = new Set(
      [
        modelIdx,
        titleIdx,
        categoryIdx,
        subcategoryIdx,
        descIdx,
        stockIdx,
        panelAIdx,
        panelBIdx,
        panelCIdx,
        panelEIdx,
        priceIdx,
        img1Idx,
        img2Idx,
        img3Idx,
        img4Idx,
      ].filter((idx) => idx !== -1)
    );

    let runningSectionCategory: ProductCategory | '' = '';
    const extracted: TrackedExcelStockItem[] = [];

    for (let r = headerRowIndex + 1; r < rows2D.length; r++) {
      const row = rows2D[r] || [];
      const nonEmptyCells = row
        .map((c) => String(c ?? '').trim())
        .filter((c) => c.length > 0);

      if (nonEmptyCells.length === 0) continue;

      // Detect if this row is a single-cell section header (e.g., "CNC CONTROLLERS", "SERVO MOTORS", "ROBOTS")
      if (nonEmptyCells.length === 1) {
        const maybeCat = normalizeCategoryValue(nonEmptyCells[0]);
        if (maybeCat) {
          runningSectionCategory = maybeCat;
          continue;
        }
      }

      const rawModel =
        modelIdx !== -1
          ? String(row[modelIdx] ?? '').trim()
          : String(row[0] ?? '').trim();

      const rawTitle =
        titleIdx !== -1 && titleIdx !== modelIdx
          ? String(row[titleIdx] ?? '').trim()
          : '';

      // Skip repeated header rows or total rows
      const lowerModel = rawModel.toLowerCase();
      if (
        (!rawModel && !rawTitle) ||
        lowerModel === 'model' ||
        lowerModel === 'model no' ||
        lowerModel === 'model number' ||
        lowerModel === 'total' ||
        lowerModel === 'grand total' ||
        lowerModel === 'sr' ||
        lowerModel === 'sr.' ||
        lowerModel === 's.no'
      ) {
        continue;
      }

      const effectiveModel = rawModel || rawTitle;

      const rawCatStr =
        categoryIdx !== -1 ? String(row[categoryIdx] ?? '').trim() : '';
      const mappedCategory =
        normalizeCategoryValue(rawCatStr) || runningSectionCategory || '';

      const rawSubcat =
        subcategoryIdx !== -1 ? String(row[subcategoryIdx] ?? '').trim() : '';

      const rawDesc =
        descIdx !== -1 && descIdx !== modelIdx && descIdx !== titleIdx
          ? String(row[descIdx] ?? '').trim()
          : '';

      // Automatically fetch Title from Description whenever Title is empty
      const derivedTitle = extractTitleFromDescription(rawDesc, rawTitle);

      const parseNumericString = (val: unknown): string => {
        if (val === null || val === undefined || String(val).trim() === '') {
          return '';
        }
        const cleaned = String(val).replace(/[^0-9.-]+/g, '');
        if (!cleaned || isNaN(Number(cleaned))) return '';
        return String(Math.max(0, Math.round(Number(cleaned))));
      };

      const parsedStockStr =
        stockIdx !== -1 ? parseNumericString(row[stockIdx]) : '';
      const rawPriceStr =
        priceIdx !== -1 ? parseNumericString(row[priceIdx]) : '';
      const rawPanelAStr =
        panelAIdx !== -1 ? parseNumericString(row[panelAIdx]) : '';
      const rawPanelBStr =
        panelBIdx !== -1 ? parseNumericString(row[panelBIdx]) : '';
      const rawPanelCStr =
        panelCIdx !== -1 ? parseNumericString(row[panelCIdx]) : '';
      const rawPanelEStr =
        panelEIdx !== -1 ? parseNumericString(row[panelEIdx]) : '';

      const numA = rawPanelAStr ? Number(rawPanelAStr) : 0;
      const numB = rawPanelBStr ? Number(rawPanelBStr) : 0;
      const numC = rawPanelCStr ? Number(rawPanelCStr) : 0;
      const numE = rawPanelEStr ? Number(rawPanelEStr) : 0;
      const numBase = rawPriceStr ? Number(rawPriceStr) : 0;

      const hasRowPanelOption = hasPanelOptionInProduct({
        modelNumber: effectiveModel,
        title: derivedTitle,
        description: rawDesc,
      });

      let computedPanelPrices: PanelPriceBreakdown | undefined;
      const abCandidate = numA > 0 ? numA : numB > 0 ? numB : 0;
      const ceCandidate = numC > 0 ? numC : numE > 0 ? numE : 0;

      if (abCandidate > 0 && ceCandidate > 0) {
        computedPanelPrices = {
          A: numA > 0 ? numA : abCandidate,
          B: numB > 0 ? numB : abCandidate,
          C: numC > 0 ? numC : ceCandidate,
          E: numE > 0 ? numE : ceCandidate,
          defaultDisplayPrice: numA > 0 ? numA : abCandidate,
        };
      } else if (abCandidate > 0) {
        computedPanelPrices = buildPanelPricesFromBase(abCandidate);
      } else if (ceCandidate > 0) {
        computedPanelPrices = buildPanelPricesFromCE(ceCandidate);
      } else if (hasRowPanelOption && numBase > 0) {
        computedPanelPrices = buildPanelPricesFromBase(numBase);
      }

      const parsedPriceStr = computedPanelPrices
        ? String(computedPanelPrices.defaultDisplayPrice)
        : rawPriceStr;

      const img1 = img1Idx !== -1 ? String(row[img1Idx] ?? '').trim() : '';
      const img2 = img2Idx !== -1 ? String(row[img2Idx] ?? '').trim() : '';
      const img3 = img3Idx !== -1 ? String(row[img3Idx] ?? '').trim() : '';
      const img4 = img4Idx !== -1 ? String(row[img4Idx] ?? '').trim() : '';

      const extraCols: Record<string, string> = {};
      rawHeaders.forEach((headerName, colIndex) => {
        if (usedIndices.has(colIndex)) return;
        if (modelIdx === -1 && colIndex === 0) return;
        const cellVal = String(row[colIndex] ?? '').trim();
        if (cellVal) {
          extraCols[headerName] = cellVal;
        }
      });

      // Match against existing products in Stock Admin by modelNumber (case-insensitive)
      const matchedExisting = products.find(
        (p) =>
          p.modelNumber.trim().toLowerCase() ===
            effectiveModel.trim().toLowerCase() ||
          (derivedTitle &&
            p.title.trim().toLowerCase() === derivedTitle.trim().toLowerCase())
      );

      const is880MC = isSZGH880MCModel({ modelNumber: effectiveModel });
      const is1080MC = isSZGH1080MCModel({ modelNumber: effectiveModel });
      const is1080MIC = isSZGH1080MICModel({ modelNumber: effectiveModel });
      const is880TC = isSZGH880TCModel({ modelNumber: effectiveModel });
      const is880TIC = isSZGH880TICModel({ modelNumber: effectiveModel });
      const is1080TC = isSZGH1080TCModel({ modelNumber: effectiveModel });
      const is1080TIC = isSZGH1080TICModel({ modelNumber: effectiveModel });
      const is1080TDB = isSZGH1080TDBModel({ modelNumber: effectiveModel });
      const is1080MDB = isSZGH1080MDBModel({ modelNumber: effectiveModel });
      const is1080MDC = isSZGH1080MDCModel({ modelNumber: effectiveModel });
      const is1000MDB = isSZGH1000MDBModel({ modelNumber: effectiveModel });
      const is1500MDB = isSZGH1500MDBModel({ modelNumber: effectiveModel });
      const is990MDB = isSZGH990MDBModel({ modelNumber: effectiveModel });
      const is990MDC = isSZGH990MDCModel({ modelNumber: effectiveModel });
      const is990TDB = isSZGH990TDBModel({ modelNumber: effectiveModel });
      const is990TDC = isSZGH990TDCModel({ modelNumber: effectiveModel });
      const is1000MC = isSZGH1000MCModel({ modelNumber: effectiveModel });
      const is1000MDC = isSZGH1000MDCModel({ modelNumber: effectiveModel });
      const is1500MDC = isSZGH1500MDCModel({ modelNumber: effectiveModel });
      const is1000MDCB = isSZGH1000MDCBModel({ modelNumber: effectiveModel });
      const is1500MDCB = isSZGH1500MDCBModel({ modelNumber: effectiveModel });
      const is1000TDB = isSZGH1000TDBModel({ modelNumber: effectiveModel });
      const is1000TC = isSZGH1000TCModel({ modelNumber: effectiveModel });
      const isCNCIO12 = isSZGHCNCIO12Model({
        modelNumber: effectiveModel,
        title: derivedTitle,
        description: rawDesc,
      });

      const normRowPanel = normalizePanelStrings({
        modelNumber: effectiveModel,
        title: derivedTitle,
        description: rawDesc,
      });
      const rowBaseImages: string[] = is880MC
        ? SZGH_880MC_IMAGES
        : is1080MC || is1080MDB || is1080MDC
        ? SZGH_1080MC_IMAGES
        : is1080MIC
        ? SZGH_1080MIC_IMAGES
        : is880TC
        ? SZGH_880TC_IMAGES
        : is880TIC
        ? SZGH_880TIC_IMAGES
        : is1080TC || is1080TIC || is1080TDB
        ? SZGH_1080TC_IMAGES
        : is1000MDB
        ? SZGH_1000MDB_IMAGES
        : is1500MDB
        ? SZGH_1500MDB_IMAGES
        : is990MDB
        ? SZGH_990MDB_IMAGES
        : is990MDC
        ? SZGH_990MDC_IMAGES
        : is990TDB
        ? SZGH_990TDB_IMAGES
        : is990TDC
        ? SZGH_990TDC_IMAGES
        : is1000MC
        ? SZGH_1000MC_IMAGES
        : is1000MDC
        ? SZGH_1000MDC_IMAGES
        : is1500MDC
        ? SZGH_1500MDC_IMAGES
        : is1000MDCB
        ? SZGH_1000MDCB_IMAGES
        : is1500MDCB
        ? SZGH_1500MDCB_IMAGES
        : is1000TDB || is1000TC
        ? SZGH_1000TDB_IMAGES
        : isCNCIO12
        ? SZGH_CNC_IO12_IMAGES
        : [img1, img2, img3, img4];
      const { images: rowResolvedImages } = applyPanelPicturesToGallery(
        rowBaseImages,
        [],
        {
          ...normRowPanel,
          hasPanelOptions: hasRowPanelOption,
        }
      );

      extracted.push({
        rowNumber: r + 1,
        matchedProductId: matchedExisting ? matchedExisting.id : null,
        modelNumber: normRowPanel.modelNumber,
        title: extractTitleFromDescription(normRowPanel.description, normRowPanel.title), // Auto-fetched from Description when Title column is empty
        category: mappedCategory, // Strictly '' if not present in Excel
        subcategory: rawSubcat, // Strictly '' if not present in Excel
        description: normRowPanel.description, // Strictly '' if not present in Excel
        price: parsedPriceStr, // Strictly '' if not present in Excel
        stockCount: parsedStockStr, // Strictly '' if not present in Excel
        images: rowResolvedImages,
        defaultImageIndex: is880MC
          ? SZGH_880MC_DEFAULT_IMAGE_INDEX
          : is1080MC || is1080MDB || is1080MDC
          ? SZGH_1080MC_DEFAULT_IMAGE_INDEX
          : is1080MIC
          ? SZGH_1080MIC_DEFAULT_IMAGE_INDEX
          : is880TC
          ? SZGH_880TC_DEFAULT_IMAGE_INDEX
          : is880TIC
          ? SZGH_880TIC_DEFAULT_IMAGE_INDEX
          : is1080TC || is1080TIC || is1080TDB
          ? SZGH_1080TC_DEFAULT_IMAGE_INDEX
          : is1000MDB
          ? SZGH_1000MDB_DEFAULT_IMAGE_INDEX
          : is1500MDB
          ? SZGH_1500MDB_DEFAULT_IMAGE_INDEX
          : is990MDB
          ? SZGH_990MDB_DEFAULT_IMAGE_INDEX
          : is990MDC
          ? SZGH_990MDC_DEFAULT_IMAGE_INDEX
          : is990TDB
          ? SZGH_990TDB_DEFAULT_IMAGE_INDEX
          : is990TDC
          ? SZGH_990TDC_DEFAULT_IMAGE_INDEX
          : is1000MC
          ? SZGH_1000MC_DEFAULT_IMAGE_INDEX
          : is1000MDC
          ? SZGH_1000MDC_DEFAULT_IMAGE_INDEX
          : is1500MDC
          ? SZGH_1500MDC_DEFAULT_IMAGE_INDEX
          : is1000MDCB
          ? SZGH_1000MDCB_DEFAULT_IMAGE_INDEX
          : is1500MDCB
          ? SZGH_1500MDCB_DEFAULT_IMAGE_INDEX
          : is1000TDB || is1000TC
          ? SZGH_1000TDB_DEFAULT_IMAGE_INDEX
          : isCNCIO12
          ? SZGH_CNC_IO12_DEFAULT_IMAGE_INDEX
          : 0,
        ...(computedPanelPrices ? { panelPrices: computedPanelPrices } : {}),
        extraColumns: extraCols,
      });
    }

    return extracted;
  };

  /**
   * Parses either a single worksheet or ALL category sheets ('__ALL_SHEETS__')
   * and updates trackedExcelItems.
   */
  const parseSheetIntoTrackedItems = (
    workbook: XLSX.WorkBook,
    sheetName: string
  ) => {
    if (sheetName === '__ALL_SHEETS__') {
      const sheetsToParse = workbook.SheetNames.filter(
        (name) => !name.toLowerCase().includes('missing from 2026')
      );
      const combined: TrackedExcelStockItem[] = [];
      const seenKeys = new Set<string>();

      for (const sName of sheetsToParse) {
        const sheetItems = extractTrackedItemsFromSingleSheet(workbook, sName);
        for (const item of sheetItems) {
          const key = `${item.modelNumber.trim().toUpperCase()}__${item.category}`;
          if (seenKeys.has(key)) continue;
          seenKeys.add(key);
          combined.push({
            ...item,
            rowNumber: combined.length + 1,
          });
        }
      }

      setTrackedExcelItems(combined);
      const matchedCount = combined.filter((i) => i.matchedProductId !== null).length;
      const newCount = combined.length - matchedCount;
      setStatusBanner({
        type: 'success',
        message: `Fetched ${combined.length} total item(s) across ${sheetsToParse.length} sheet(s) (${matchedCount} matched existing catalog items, ${newCount} new items).`,
      });
      return;
    }

    if (!workbook.Sheets[sheetName]) {
      setStatusBanner({
        type: 'error',
        message: `Sheet "${sheetName}" could not be found in the uploaded file.`,
      });
      return;
    }

    const extracted = extractTrackedItemsFromSingleSheet(workbook, sheetName);
    if (extracted.length === 0) {
      setTrackedExcelItems([]);
      setStatusBanner({
        type: 'error',
        message: `Sheet "${sheetName}" is empty.`,
      });
      return;
    }

    setTrackedExcelItems(extracted);

    const matchedCount = extracted.filter((i) => i.matchedProductId !== null).length;
    const newCount = extracted.length - matchedCount;

    setStatusBanner({
      type: 'success',
      message: `Fetched ${extracted.length} item(s) from sheet "${sheetName}" (${matchedCount} matched existing catalog items, ${newCount} new items). Missing fields/tabs are left empty.`,
    });
  };

  const handleExcelFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusBanner(null);
    setExcelFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      setWorkbookCache(workbook);
      setExcelSheetNames(workbook.SheetNames);

      // If the workbook has multiple category sheets (e.g., Controllers, Servo Motors & Drives, CNC Machines, Industrial Robots),
      // default to '__ALL_SHEETS__' so all categories are loaded in one go!
      const hasCategorySheets = workbook.SheetNames.some((n) =>
        /controllers|servo|motors|machines|robots/i.test(n)
      );
      const exactStockListSheet = workbook.SheetNames.find(
        (name) => name.trim().toLowerCase() === 'stock list'
      );
      const partialStockListSheet = workbook.SheetNames.find(
        (name) =>
          name.trim().toLowerCase().includes('stock list') ||
          name.trim().toLowerCase().includes('stock')
      );
      const chosenSheet =
        hasCategorySheets && workbook.SheetNames.length > 1
          ? '__ALL_SHEETS__'
          : exactStockListSheet || partialStockListSheet || workbook.SheetNames[0];

      setSelectedSheetName(chosenSheet);
      parseSheetIntoTrackedItems(workbook, chosenSheet);
    } catch (err) {
      setStatusBanner({
        type: 'error',
        message:
          err instanceof Error
            ? `Failed to read .xlsx file: ${err.message}`
            : 'Failed to parse the uploaded .xlsx file.',
      });
    } finally {
      e.target.value = '';
    }
  };

  const handleDownloadSampleStockListXlsx = () => {
    const sampleRows = [
      [
        'Model Number',
        'Title',
        'Category',
        'Subcategory',
        'Stock Qty',
        'Price PKR',
        'Description',
        'Image 1',
      ],
      [
        'SZGH-CNC1000MDb-3',
        '3-Axis CNC Milling Controller',
        'Controllers',
        'CNC Milling Controllers',
        12,
        142000,
        '800x600 8.4-inch LCD 3-Axis Milling Controller with PLC & Macro support',
        '',
      ],
      [
        'SZGH-CNC1000TDb-2',
        '', // Left empty to demonstrate empty Title tab
        'Controllers',
        '', // Left empty to demonstrate empty Subcategory tab
        8,
        '', // Left empty to demonstrate empty Price tab
        '', // Left empty to demonstrate empty Description tab
        '',
      ],
      [
        'SZGH-130M-07525',
        '1.8kW AC Servo Motor + Driver Kit',
        'Motors',
        '',
        15,
        96000,
        '',
        '',
      ],
      [
        'SZGH-T1500-B-6',
        '',
        'Robots',
        '',
        2,
        '',
        '',
        '',
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(sampleRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'stock list');
    XLSX.writeFile(wb, 'SZGH_Pakistan_stock_list.xlsx');
  };

  /**
   * Generates & downloads the Complete Detailed Catalog & Pricing Excel Workbook (.xlsx)
   * with separate sheets for each category so the admin can download all items in one go:
   * 1. "Controllers" — All CNC Controllers clubbed in a single sheet (1000, 1080, 1500, 990, 880 Series + I/O Boards) with A/B/C/E Panel Prices
   * 2. "Servo Motors & Drives" — All AC Servo Motors (Base / Brake / Absolute prices), Digital Servo Drivers, Spindle Motors/Drivers, and Stepper Kits
   * 3. "CNC Machines" — All CNC Turning Centers, CNC Milling Machines & Vertical Machining Centers (VMCs)
   * 4. "Industrial Robots" — All 6-Axis Welding, Pick-and-Place / Machine Tending & Spraying/Grinding Robots
   * 5. "Missing from 2026 PDF" — Quick-filter sheet for any controller options needing pricing review
   */
  const handleDownloadControllerSeriesPricingSheet = () => {
    const wb = XLSX.utils.book_new();

    // =========================================================================
    // SHEET 1: CONTROLLERS (All Controller Series Clubbed in Single Sheet)
    // =========================================================================
    const controllerHeaderRow = [
      'Series Club',
      'Base Model',
      'Model Number',
      'Axis Option',
      'Category',
      'Subcategory',
      'Panel Options',
      'A Panel Price PKR',
      'B Panel Price PKR',
      'C Panel Price PKR',
      'E Panel Price PKR',
      'Price PKR',
      'With I/O Board (+22000) PKR',
      'Stock Qty',
      'Pricing Status',
      'Title',
      'Description',
    ];

    const controllerItems = products.filter((p) => p.category === 'Controllers');
    const controllerRows: (string | number)[][] = [controllerHeaderRow];
    const missingRows: (string | number)[][] = [controllerHeaderRow];

    const seriesOrder: Record<string, number> = {
      'SZGH-1000 Series': 1,
      'SZGH-1080 Series': 2,
      'SZGH-1500 Series': 3,
      'SZGH-990 Series': 4,
      'SZGH-880 Series': 5,
    };

    const sortedControllers = [...controllerItems].sort((a, b) => {
      const clubA = detectControllerSeriesClub(a)?.seriesDisplayModel || 'Other Controllers';
      const clubB = detectControllerSeriesClub(b)?.seriesDisplayModel || 'Other Controllers';
      const rankA = seriesOrder[clubA] || 99;
      const rankB = seriesOrder[clubB] || 99;
      if (rankA !== rankB) return rankA - rankB;
      return a.modelNumber.localeCompare(b.modelNumber);
    });

    for (const item of sortedControllers) {
      const clubInfo = detectControllerSeriesClub(item);
      const parsedAxis = extractBaseModelAndAxis(item);
      const baseModel = item.baseModelNumber || parsedAxis?.baseModelDisplay || item.modelNumber;
      const axisLabel = parsedAxis?.axisLabel || 'Standard';
      const hasPanels = Boolean(item.hasPanelOptions || hasPanelOptionInProduct(item));
      const panelPrices = item.panelPrices;
      const basePrice = item.price > 0 ? item.price : 0;

      const aPrice = hasPanels
        ? panelPrices && panelPrices.A > 0
          ? panelPrices.A
          : basePrice > 0
          ? basePrice
          : ''
        : '';
      const bPrice = hasPanels
        ? panelPrices && panelPrices.B > 0
          ? panelPrices.B
          : basePrice > 0
          ? basePrice
          : ''
        : '';
      const cPrice = hasPanels
        ? panelPrices && panelPrices.C > 0
          ? panelPrices.C
          : basePrice > 0
          ? basePrice + 20000
          : ''
        : '';
      const ePrice = hasPanels
        ? panelPrices && panelPrices.E > 0
          ? panelPrices.E
          : basePrice > 0
          ? basePrice + 20000
          : ''
        : '';

      const effectiveBasePrice =
        typeof aPrice === 'number' && aPrice > 0
          ? aPrice
          : basePrice > 0
          ? basePrice
          : '';
      const ioPrice =
        typeof effectiveBasePrice === 'number' && effectiveBasePrice > 0
          ? effectiveBasePrice + 22000
          : '';
      const inOfficial2026Pdf =
        resolveOfficialRateListPricing({ modelNumber: item.modelNumber }).price !==
        undefined;
      const needsPricingReview = effectiveBasePrice === '' || !inOfficial2026Pdf;

      const rowData: (string | number)[] = [
        clubInfo ? clubInfo.seriesDisplayModel : 'Standalone Controller / I/O',
        baseModel,
        item.modelNumber,
        axisLabel,
        item.category,
        item.subcategory || '',
        hasPanels
          ? 'A / B / C / E Panels (Mandatory Selection)'
          : 'Fixed Standard Panel (No A/B/C/E)',
        aPrice,
        bPrice,
        cPrice,
        ePrice,
        effectiveBasePrice,
        ioPrice,
        item.stockCount ?? 0,
        needsPricingReview
          ? 'NOT IN 2026 PDF — PLEASE FILL / CONFIRM OFFICIAL PRICE'
          : 'OFFICIAL 2026 PDF RATE LIST',
        item.title || '',
        item.description || '',
      ];

      controllerRows.push(rowData);
      if (needsPricingReview) {
        missingRows.push(rowData);
      }
    }

    const wsControllers = XLSX.utils.aoa_to_sheet(controllerRows);
    wsControllers['!cols'] = [
      { wch: 20 },
      { wch: 18 },
      { wch: 22 },
      { wch: 12 },
      { wch: 14 },
      { wch: 28 },
      { wch: 36 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 16 },
      { wch: 24 },
      { wch: 12 },
      { wch: 48 },
      { wch: 38 },
      { wch: 60 },
    ];
    XLSX.utils.book_append_sheet(wb, wsControllers, 'Controllers');

    // =========================================================================
    // SHEET 2: SERVO MOTORS & DRIVES (All Motors, Drivers, Spindle & Stepper)
    // =========================================================================
    const motorHeaderRow = [
      'Subcategory Group',
      'Model Number',
      'Category',
      'Subcategory',
      'Price PKR',
      'With Brake Price PKR',
      'Absolute Encoder Price PKR',
      'Stock Qty',
      'Pricing Status',
      'Title',
      'Description',
    ];
    const motorItems = products.filter((p) => p.category === 'Motors');
    const motorSubcatOrder: Record<string, number> = {
      'Servo motor': 1,
      'Servo Driver': 2,
      'Spindle servo motor': 3,
      'Spindle servo driver': 4,
      'Closed Loop Stepper Motors and Drivers': 5,
      'Two-phase stepper motor and driver': 6,
      'Three-phase stepper motors and drivers': 7,
    };
    const sortedMotors = [...motorItems].sort((a, b) => {
      const rankA = motorSubcatOrder[a.subcategory || ''] || 99;
      const rankB = motorSubcatOrder[b.subcategory || ''] || 99;
      if (rankA !== rankB) return rankA - rankB;
      return a.modelNumber.localeCompare(b.modelNumber);
    });

    const motorRows: (string | number)[][] = [motorHeaderRow];
    for (const item of sortedMotors) {
      const servoOpts = item.servoConfigOptions || [];
      const baseOpt = servoOpts.find((o) => o.id === 'base');
      const brakeOpt = servoOpts.find((o) => o.id === 'brake');
      const absOpt = servoOpts.find((o) => o.id === 'absolute');
      const basePrice = baseOpt ? baseOpt.price : item.price > 0 ? item.price : '';
      const brakePrice = brakeOpt ? brakeOpt.price : '';
      const absPrice = absOpt ? absOpt.price : '';
      const subcatGroup =
        item.subcategory === 'Servo motor' || item.subcategory === 'Servo Driver'
          ? 'Servo Motors and Drives'
          : item.subcategory?.toLowerCase().includes('spindle')
          ? 'Spindle Servo Motors and Drivers'
          : 'Stepper Motors and Drivers';
      const in2026RateList =
        resolveOfficialRateListPricing({ modelNumber: item.modelNumber }).price !==
        undefined;

      motorRows.push([
        subcatGroup,
        item.modelNumber,
        item.category,
        item.subcategory || '',
        basePrice,
        brakePrice,
        absPrice,
        item.stockCount ?? 0,
        in2026RateList ? 'OFFICIAL 2026 PDF RATE LIST' : 'CATALOG STANDARD PRICE',
        item.title || '',
        item.description || '',
      ]);
    }

    const wsMotors = XLSX.utils.aoa_to_sheet(motorRows);
    wsMotors['!cols'] = [
      { wch: 30 },
      { wch: 24 },
      { wch: 14 },
      { wch: 34 },
      { wch: 16 },
      { wch: 22 },
      { wch: 26 },
      { wch: 12 },
      { wch: 30 },
      { wch: 42 },
      { wch: 65 },
    ];
    XLSX.utils.book_append_sheet(wb, wsMotors, 'Servo Motors & Drives');

    // =========================================================================
    // SHEET 3: CNC MACHINES (Lathes, Milling Machines & VMCs)
    // =========================================================================
    const machineHeaderRow = [
      'Subcategory Group',
      'Model Number',
      'Category',
      'Subcategory',
      'Price PKR',
      'USD Estimate',
      'Stock Qty',
      'Warranty',
      'Title',
      'Description',
    ];
    const machineItems = products.filter((p) => p.category === 'Machines');
    const machineRows: (string | number)[][] = [machineHeaderRow];
    for (const item of machineItems) {
      machineRows.push([
        'CNC Machine',
        item.modelNumber,
        item.category,
        item.subcategory || '',
        item.price > 0 ? item.price : '',
        item.usdEstimate ?? '',
        item.stockCount ?? 0,
        item.warranty || '1 Year Official Warranty',
        item.title || '',
        item.description || '',
      ]);
    }
    const wsMachines = XLSX.utils.aoa_to_sheet(machineRows);
    wsMachines['!cols'] = [
      { wch: 20 },
      { wch: 24 },
      { wch: 14 },
      { wch: 26 },
      { wch: 18 },
      { wch: 14 },
      { wch: 12 },
      { wch: 24 },
      { wch: 45 },
      { wch: 65 },
    ];
    XLSX.utils.book_append_sheet(wb, wsMachines, 'CNC Machines');

    // =========================================================================
    // SHEET 4: INDUSTRIAL ROBOTS (Welding, Handling & Spraying/Grinding Robots)
    // =========================================================================
    const robotHeaderRow = [
      'Subcategory Group',
      'Model Number',
      'Category',
      'Subcategory',
      'Price PKR',
      'USD Estimate',
      'Stock Qty',
      'Warranty',
      'Title',
      'Description',
    ];
    const robotItems = products.filter((p) => p.category === 'Robots');
    const robotRows: (string | number)[][] = [robotHeaderRow];
    for (const item of robotItems) {
      robotRows.push([
        'Industrial Robots',
        item.modelNumber,
        item.category,
        item.subcategory || '',
        item.price > 0 ? item.price : '',
        item.usdEstimate ?? '',
        item.stockCount ?? 0,
        item.warranty || '1 Year Official Warranty',
        item.title || '',
        item.description || '',
      ]);
    }
    const wsRobots = XLSX.utils.aoa_to_sheet(robotRows);
    wsRobots['!cols'] = wsMachines['!cols'];
    XLSX.utils.book_append_sheet(wb, wsRobots, 'Industrial Robots');

    // =========================================================================
    // SHEET 5: MISSING FROM 2026 PDF (Controllers Needing Price Confirmation)
    // =========================================================================
    const wsMissing = XLSX.utils.aoa_to_sheet(missingRows);
    wsMissing['!cols'] = wsControllers['!cols'];
    XLSX.utils.book_append_sheet(wb, wsMissing, 'Missing from 2026 PDF');

    XLSX.writeFile(wb, 'SZGH-Pakistan-Controller-Series-Panel-Pricing-Sheet.xlsx');
  };

  /**
   * Loads a single tracked Excel item into the "+ Add / Edit Item Listing" tab,
   * leaving any tabs empty if the corresponding information was not in the Excel sheet.
   */
  const handleLoadExcelRowIntoForm = (item: TrackedExcelStockItem) => {
    setEditingCustomProductId(item.matchedProductId);
    setNewModelNumber(item.modelNumber);
    setNewTitle(item.title); // '' if not in Excel
    setNewCategory(item.category); // '' if not in Excel
    setNewSubcategory(item.subcategory); // '' if not in Excel
    setNewPrice(item.price); // '' if not in Excel
    setNewStockCount(item.stockCount); // '' if not in Excel
    setNewDescription(item.description); // '' if not in Excel
    setNewImages([...item.images]); // ['', '', '', ''] if not in Excel
    setNewDefaultImageIndex(item.defaultImageIndex || 0);
    setActiveTab('create');
    setStatusBanner({
      type: 'success',
      message: `Loaded "${item.modelNumber}" from Excel "stock list" into the form. Tabs without Excel data are left empty.`,
    });
  };

  /**
   * Loads an existing product from the Manage tab into the "+ Add / Edit Item Listing" form
   * so the admin can edit or clear any of its tabs.
   */
  const handleLoadExistingProductIntoForm = (product: ProductItem) => {
    setEditingCustomProductId(product.id);
    setNewModelNumber(product.modelNumber || '');
    setNewTitle(product.title || '');
    setNewCategory(product.category || '');
    setNewSubcategory(product.subcategory || '');
    setNewPrice(product.price > 0 ? String(product.price) : '');
    setNewStockCount(String(product.stockCount ?? ''));
    setNewDescription(product.description || '');
    setNewImages(
      product.images.length > 4
        ? [
            product.images[0] || '',
            product.images[1] || '',
            product.images[2] || '',
            product.images[3] || '',
            product.images[4] || '',
            product.images[5] || '',
          ]
        : [
            product.images[0] || '',
            product.images[1] || '',
            product.images[2] || '',
            product.images[3] || '',
          ]
    );
    setNewDefaultImageIndex(product.defaultImageIndex ?? 0);
    setActiveTab('create');
  };

  /**
   * Syncs a single tracked Excel item or all tracked Excel items directly into Stock Admin & Firebase Firestore.
   * Any field not present in the Excel sheet is saved as empty ('') or 0 without inventing placeholder text.
   */
  const handleSyncTrackedExcelItemsToCloud = async (
    itemsToSync: TrackedExcelStockItem[]
  ) => {
    if (!currentUser || !isAuthorizedAdmin || itemsToSync.length === 0) return;

    setSyncingExcelItems(true);
    setStatusBanner(null);

    const newCustomIdsToRegister: string[] = [];
    let syncedCount = 0;

    try {
      for (const item of itemsToSync) {
        const trimmedModel = item.modelNumber.trim();
        if (!trimmedModel) continue;

        const existingProduct = item.matchedProductId
          ? products.find((p) => p.id === item.matchedProductId)
          : products.find(
              (p) =>
                p.modelNumber.trim().toLowerCase() ===
                trimmedModel.toLowerCase()
            );

        const sanitizedSlug = trimmedModel
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 60);

        const productId = existingProduct
          ? existingProduct.id
          : `szgh-xlsx-${sanitizedSlug || 'item'}-${item.rowNumber}`;

        // Only use information present in the Excel sheet (or keep existing category if updating an existing product and Excel category is blank)
        const categoryToSave: ProductCategory =
          item.category || existingProduct?.category || 'Controllers';

        const descToSave = item.description.trim(); // Left '' if not in Excel
        const titleToSave = extractTitleFromDescription(descToSave, item.title); // Auto-fetched from Description
        const subcatToSave = item.subcategory.trim(); // Left '' if not in Excel

        const stockNum =
          item.stockCount.trim() !== ''
            ? Math.max(0, Math.min(100000, Math.round(Number(item.stockCount) || 0)))
            : existingProduct
            ? existingProduct.stockCount
            : 0;

        const priceNum =
          item.price.trim() !== ''
            ? Math.max(0, Math.min(1000000000, Math.round(Number(item.price) || 0)))
            : 0;

        const statusToSave = deriveStatusFromCount(stockNum);
        const imagesToSave = buildPreservedImages(item.images, item);

        const path = `inventory/${productId}`;
        await setDoc(doc(db, 'inventory', productId), {
          productId: productId.slice(0, 128),
          modelNumber: trimmedModel.slice(0, 120),
          title: titleToSave.slice(0, 200),
          category: categoryToSave,
          subcategory: subcatToSave.slice(0, 120),
          description: descToSave.slice(0, 1500),
          price: priceNum,
          ...(item.panelPrices ? { panelPrices: item.panelPrices } : {}),
          stockCount: stockNum,
          stockStatus: statusToSave,
          defaultImageIndex: item.defaultImageIndex || 0,
          images: imagesToSave,
          updatedBy: currentUser.uid,
          updatedAt: serverTimestamp(),
        });

        if (!existingProduct) {
          newCustomIdsToRegister.push(productId);
        }
        syncedCount += 1;
      }

      if (newCustomIdsToRegister.length > 0) {
        const mergedCustomIds = Array.from(
          new Set([...customProductIds, ...newCustomIdsToRegister])
        ).slice(0, 500);

        await setDoc(doc(db, 'catalog_index', 'active_manifest'), {
          manifestId: 'active_manifest',
          customProductIds: mergedCustomIds,
          updatedBy: currentUser.uid,
          updatedAt: serverTimestamp(),
        });
      }

      setStatusBanner({
        type: 'success',
        message: `Successfully tracked and synced ${syncedCount} item(s) from Excel sheet "${selectedSheetName}" into Stock Admin! Missing tabs were left empty.`,
      });
    } catch (err) {
      setStatusBanner({
        type: 'error',
        message:
          'Failed to sync Excel items to Firebase. Verify you are signed in with an authorized admin account.',
      });
      handleFirestoreError(err, OperationType.WRITE, 'inventory / catalog_index');
    } finally {
      setSyncingExcelItems(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      p.modelNumber.toLowerCase().includes(q) ||
      (p.title || '').toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Live Firebase Inventory, Excel Stock List & Photo Manager"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                SZGH Pakistan — Stock Admin, Excel (.xlsx) Tracker &amp; Photo Manager
              </h2>
              <p className="text-xs text-slate-400">
                Upload .xlsx (&quot;stock list&quot; sheet), manage stock in/out, highlight ★ Default pictures, or add listings
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadControllerSeriesPricingSheet}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer"
              title="Download Complete Detailed Excel Sheet (.xlsx) of all CNC Controller Series, Axes, and A/B/C/E Panel Pricings (including missing pricings to fill and re-upload)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download Series &amp; Panel Pricing Sheet (.xlsx)</span>
            </button>
            <a
              href="/SZGH-Pakistan-Full-Code-Backup.txt"
              download="SZGH-Pakistan-Full-Code-Backup.txt"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
              title="Download the complete website source code and configuration in a single .txt contingency file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Full Code (.txt)</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Authentication Bar */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {!currentUser ? (
              <>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    Administrator Sign-In Required to Edit Live Stock &amp; Upload Excel Sheets
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Sign in with an authorized Google account (
                    <span className="font-mono-tabular font-semibold text-slate-900 dark:text-white">
                      {ADMIN_EMAILS.join(' / ')}
                    </span>
                    ) to import .xlsx stock lists, manage stock, and upload product photos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#1E2985] hover:bg-[#16206B] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In with Google</span>
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isAuthorizedAdmin
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Signed in as {currentUser.email}</span>
                      {isAuthorizedAdmin ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                          Authorized Admin
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-600 dark:text-red-400 text-[10px] font-bold">
                          Read-Only (Not Admin Email)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isAuthorizedAdmin
                        ? 'All changes to stock, Excel imports, product photos, and ★ Default pictures update live across the website.'
                        : `Only ${ADMIN_EMAILS.join(' or ')} has permission to write to the live inventory database.`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {isAuthorizedAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSyncAllCatalogToCloud(true)}
                        disabled={bulkSyncing}
                        title="Fetch Title from Description and save across all products"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#1E2985] hover:bg-[#16206B] disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Fetch Titles from Description (All)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSyncAllCatalogToCloud(false)}
                        disabled={bulkSyncing}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${bulkSyncing ? 'animate-spin' : ''}`}
                        />
                        <span>
                          {bulkSyncing ? 'Syncing Catalog...' : 'Sync All to Cloud'}
                        </span>
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* 4-Tab Mode Selector */}
          {isAuthorizedAdmin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'manage'
                    ? 'bg-[#1E2985] dark:bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span>1. Manage Stock ({products.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingCustomProductId(null);
                  setActiveTab('create');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'create'
                    ? 'bg-[#0D5C2B] dark:bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span>2. + Add / Edit Item</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('excel')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'excel'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 shrink-0" />
                <span>
                  3. Upload .xlsx
                  {trackedExcelItems.length > 0 ? ` (${trackedExcelItems.length})` : ''}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-md text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#0D5C2B] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ClipboardList className="w-4 h-4 shrink-0" />
                <span>4. Customer Orders ({orders.length})</span>
              </button>
            </div>
          )}

          {/* Status Feedback Banner */}
          {statusBanner && (
            <div
              className={`p-3.5 rounded-lg border flex items-center gap-2.5 text-xs font-semibold ${
                statusBanner.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300'
              }`}
            >
              {statusBanner.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
              )}
              <span>{statusBanner.message}</span>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: LIVE CUSTOMER ORDERS & OFFICIAL TAX INVOICE LOGS           */}
          {/* ================================================================= */}
          {isAuthorizedAdmin && activeTab === 'orders' && (
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-[#0D5C2B] dark:text-emerald-400" />
                    <span>
                      Direct Customer Orders &amp; Official Tax Invoices ({orders.length})
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Orders placed at checkout are automatically sent to your email and recorded here in real time with customer NTN No., 18% Sales Tax breakdown, and Pick-Up / Bank Transfer details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 cursor-pointer shrink-0"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Orders Report</span>
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl space-y-2">
                  <ClipboardList className="w-10 h-10 text-slate-400 mx-auto" />
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    No Customer Orders Submitted Yet
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Whenever a customer completes checkout on the website, their complete order details, NTN No., and 18% Sales Tax invoice appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.orderId}
                      className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono-tabular text-xs font-extrabold px-2.5 py-1 rounded bg-[#1E2985] text-white">
                            {order.orderId}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {order.companyName}
                          </span>
                          {order.ntnNumber && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 font-mono-tabular text-xs font-extrabold">
                              NTN: {order.ntnNumber}
                            </span>
                          )}
                          {order.strnNumber && (
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono-tabular text-[11px] font-semibold">
                              STRN: {order.strnNumber}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-500">
                            {order.timestamp}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={
                              order.whatsappRedirectUrl ||
                              `https://wa.me/923214800265?text=${encodeURIComponent(
                                `*SZGH PAKISTAN ORDER #${order.orderId}*\nCompany: ${order.companyName}\nCustomer: ${order.contactName} (${order.phone})\nEmail: ${order.email}\nPayment: ${order.paymentMethod}\nItems:\n${order.itemsSummary}\n*Total: PKR ${order.totalPKR.toLocaleString()}*`
                              )}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0D5C2B] hover:bg-[#094720] text-white text-[11px] font-bold transition-colors"
                          >
                            <span>WhatsApp Order</span>
                          </a>
                          <a
                            href={
                              order.gmailComposeUrl ||
                              `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                                'khubaib4000@gmail.com'
                              )}&cc=${encodeURIComponent(
                                `grnoman786@gmail.com,${order.email}`
                              )}&su=${encodeURIComponent(
                                `SZGH PAKISTAN ORDER #${order.orderId} — ${order.companyName}`
                              )}&body=${encodeURIComponent(
                                `Order ID: ${order.orderId}\nCompany: ${order.companyName}\nContact: ${order.contactName} (${order.phone})\nEmail: ${order.email}\nPayment: ${order.paymentMethod}\nAddress: ${order.address}, ${order.city}\n\nItems:\n${order.itemsSummary}\n\nTotal Payable: PKR ${order.totalPKR.toLocaleString()}`
                              )}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1E2985] hover:bg-[#161f69] text-white text-[11px] font-bold transition-colors"
                          >
                            <span>Email (Gmail)</span>
                          </a>
                          <label className="text-[11px] font-bold text-slate-500">
                            Status:
                          </label>
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              onUpdateOrderStatus &&
                              onUpdateOrderStatus(
                                order.orderId,
                                e.target.value as SubmittedCustomerOrder['orderStatus']
                              )
                            }
                            className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                          >
                            <option value="New Order">New Order</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Ready for Pick Up">Ready for Pick Up</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Customer &amp; Tax Details
                          </div>
                          <div>
                            <strong>Contact:</strong> {order.contactName}
                          </div>
                          <div>
                            <strong>Phone:</strong>{' '}
                            <span className="font-mono-tabular font-bold">
                              {order.phone}
                            </span>
                          </div>
                          <div>
                            <strong>Email:</strong> {order.email}
                          </div>
                          {order.ntnNumber && (
                            <div>
                              <strong>NTN No.:</strong>{' '}
                              <span className="font-mono-tabular font-bold text-[#1E2985] dark:text-emerald-400">
                                {order.ntnNumber}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Address &amp; Payment Mode
                          </div>
                          <div>
                            <strong>City:</strong> {order.city}
                          </div>
                          <div>
                            <strong>Address:</strong> {order.address}
                          </div>
                          <div>
                            <strong>Payment:</strong>{' '}
                            <span className="font-bold text-[#0D5C2B] dark:text-emerald-400">
                              {order.paymentMethod}
                            </span>
                          </div>
                          {order.transactionRef && (
                            <div>
                              <strong>TID / Ref:</strong>{' '}
                              <span className="font-mono-tabular">
                                {order.transactionRef}
                              </span>
                            </div>
                          )}
                          {order.orderNotes && (
                            <div>
                              <strong>Notes:</strong> {order.orderNotes}
                            </div>
                          )}
                        </div>

                        <div className="p-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1 font-mono-tabular">
                          <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
                            Invoice &amp; Payment Breakdown
                          </div>
                          <div className="font-sans text-[11px] font-bold text-slate-800 dark:text-slate-200">
                            {order.paymentMethod}
                          </div>
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>PKR {order.subtotalPKR.toLocaleString()}</span>
                          </div>
                          {order.salesTaxRate === 18 && (
                            <div className="flex justify-between text-amber-700 dark:text-amber-400 font-bold">
                              <span>Sales Tax (18% GST):</span>
                              <span>+ PKR {order.salesTaxPKR.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800 text-sm font-extrabold text-slate-900 dark:text-white">
                            <span>Total:</span>
                            <span>PKR {order.totalPKR.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs font-mono-tabular whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                        <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Ordered Equipment Line Items
                        </div>
                        {order.itemsSummary}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: UPLOAD .XLSX ("stock list" SHEET) & TRACK ITEMS            */}
          {/* ================================================================= */}
          {isAuthorizedAdmin && activeTab === 'excel' && (
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-amber-500" />
                    <span>
                      Import Product Data from Excel (.xlsx) — Sheet: &quot;stock list&quot;
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Upload your <code className="font-mono font-bold text-slate-800 dark:text-slate-200">.xlsx</code> file to automatically fetch items from the <strong className="text-slate-800 dark:text-slate-200">stock list</strong> sheet. Any tabs/fields not present in the sheet (such as Title, Subcategory, Price, Description, or Pictures) are left completely empty.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleDownloadControllerSeriesPricingSheet}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#0068AD] hover:bg-[#00558F] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Complete Catalog Pricing Sheet — All Categories (.xlsx)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadSampleStockListXlsx}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-500" />
                    <span>Sample &quot;stock list.xlsx&quot;</span>
                  </button>

                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>Upload Filled .xlsx File</span>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleExcelFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Sheet Selector & Bulk Sync Controls when an Excel file is loaded */}
              {excelSheetNames.length > 0 && (
                <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      File: <span className="text-[#1E2985] dark:text-emerald-400">{excelFileName}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-slate-500">
                        Active Sheet:
                      </label>
                      <select
                        value={selectedSheetName}
                        onChange={(e) => {
                          const nextSheet = e.target.value;
                          setSelectedSheetName(nextSheet);
                          if (workbookCache) {
                            parseSheetIntoTrackedItems(workbookCache, nextSheet);
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                      >
                        {excelSheetNames.length > 1 && (
                          <option value="__ALL_SHEETS__">
                            ★ ALL CATEGORY SHEETS (Controllers + Motors + Machines + Robots)
                          </option>
                        )}
                        {excelSheetNames.map((sName) => (
                          <option key={sName} value={sName}>
                            {sName}
                            {sName.trim().toLowerCase() === 'stock list'
                              ? ' (Target "stock list")'
                              : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {trackedExcelItems.length > 0 && (
                    <button
                      type="button"
                      disabled={syncingExcelItems}
                      onClick={() => handleSyncTrackedExcelItemsToCloud(trackedExcelItems)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#0D5C2B] hover:bg-[#094720] disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {syncingExcelItems
                          ? 'Syncing Items to Stock Admin...'
                          : `Add / Sync All ${trackedExcelItems.length} Tracked Items to Stock Admin`}
                      </span>
                    </button>
                  )}
                </div>
              )}

              {/* Tracked Excel Items Table */}
              {trackedExcelItems.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl space-y-3">
                  <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto" />
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    No .xlsx Stock List Uploaded Yet
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Click <strong>Upload .xlsx File</strong> above to select your Excel file containing the <strong>stock list</strong> sheet. All rows will be tracked here and any unavailable tabs will remain empty.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                        <th className="py-2.5 px-3">Row</th>
                        <th className="py-2.5 px-3">Track Status</th>
                        <th className="py-2.5 px-3">Model Number *</th>
                        <th className="py-2.5 px-3">Title Tab</th>
                        <th className="py-2.5 px-3">Category Tab</th>
                        <th className="py-2.5 px-3">Subcategory Tab</th>
                        <th className="py-2.5 px-3">Stock Qty Tab</th>
                        <th className="py-2.5 px-3">Price (PKR) Tab</th>
                        <th className="py-2.5 px-3">Description Tab</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {trackedExcelItems.map((item, idx) => (
                        <tr
                          key={`${item.rowNumber}-${idx}`}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-950/50"
                        >
                          <td className="py-2.5 px-3 font-mono-tabular text-slate-400">
                            #{item.rowNumber}
                          </td>
                          <td className="py-2.5 px-3">
                            {item.matchedProductId ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-sky-500/15 text-sky-700 dark:text-sky-300 text-[10px] font-bold">
                                Matched Existing
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                                New Item
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={item.modelNumber}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTrackedExcelItems((prev) =>
                                  prev.map((row, i) =>
                                    i === idx ? { ...row, modelNumber: val } : row
                                  )
                                );
                              }}
                              className="w-36 px-2 py-1 rounded bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 font-mono-tabular font-bold text-slate-900 dark:text-white"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={item.title}
                              placeholder="— (Empty)"
                              onChange={(e) => {
                                const val = e.target.value;
                                setTrackedExcelItems((prev) =>
                                  prev.map((row, i) =>
                                    i === idx ? { ...row, title: val } : row
                                  )
                                );
                              }}
                              className="w-40 px-2 py-1 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <select
                              value={item.category}
                              onChange={(e) => {
                                const val = e.target.value as ProductCategory | '';
                                setTrackedExcelItems((prev) =>
                                  prev.map((row, i) =>
                                    i === idx ? { ...row, category: val } : row
                                  )
                                );
                              }}
                              className="w-28 px-2 py-1 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                            >
                              <option value="">— (Empty)</option>
                              <option value="Controllers">Controllers</option>
                              <option value="Motors">Motors</option>
                              <option value="Machines">Machines</option>
                              <option value="Robots">Robots</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={item.subcategory}
                              placeholder="— (Empty)"
                              onChange={(e) => {
                                const val = e.target.value;
                                setTrackedExcelItems((prev) =>
                                  prev.map((row, i) =>
                                    i === idx ? { ...row, subcategory: val } : row
                                  )
                                );
                              }}
                              className="w-32 px-2 py-1 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              min={0}
                              value={item.stockCount}
                              placeholder="— (Empty)"
                              onChange={(e) => {
                                const val = e.target.value;
                                setTrackedExcelItems((prev) =>
                                  prev.map((row, i) =>
                                    i === idx ? { ...row, stockCount: val } : row
                                  )
                                );
                              }}
                              className="w-20 px-2 py-1 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono-tabular font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              min={0}
                              value={item.price}
                              placeholder="— (Empty)"
                              onChange={(e) => {
                                const val = e.target.value;
                                setTrackedExcelItems((prev) =>
                                  prev.map((row, i) =>
                                    i === idx ? { ...row, price: val } : row
                                  )
                                );
                              }}
                              className="w-24 px-2 py-1 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono-tabular font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={item.description}
                              placeholder="— (Empty)"
                              onChange={(e) => {
                                const val = e.target.value;
                                setTrackedExcelItems((prev) =>
                                  prev.map((row, i) =>
                                    i === idx ? { ...row, description: val } : row
                                  )
                                );
                              }}
                              className="w-40 px-2 py-1 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleLoadExcelRowIntoForm(item)}
                              title="Open in Add/Edit Form with empty tabs left blank"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold cursor-pointer"
                            >
                              <span>Load Tabs</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={syncingExcelItems}
                              onClick={() => handleSyncTrackedExcelItemsToCloud([item])}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1E2985] dark:bg-emerald-600 text-white text-[11px] font-bold hover:opacity-95 cursor-pointer"
                            >
                              <span>Sync</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: ADD / EDIT ITEM LISTING (LEAVES MISSING TABS EMPTY)        */}
          {/* ================================================================= */}
          {isAuthorizedAdmin && activeTab === 'create' && (
            <form
              onSubmit={handleCreateNewProductListing}
              className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-6"
            >
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {editingCustomProductId
                      ? `Edit Item Tabs — ${newModelNumber}`
                      : 'Add New Product Listing (Leave Unavailable Tabs Empty)'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Only <strong>Model Number</strong> is required. Any tab where corresponding information is not available can be left completely empty.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCustomProductId(null);
                    setNewCategory('');
                    setNewSubcategory('');
                    setNewModelNumber('');
                    setNewTitle('');
                    setNewPrice('');
                    setNewStockCount('');
                    setNewDescription('');
                    setNewImages(['', '', '', '']);
                    setNewDefaultImageIndex(0);
                  }}
                  className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 self-start cursor-pointer"
                >
                  Clear All Tabs
                </button>
              </div>

              {/* Row 1: Category, Subcategory, Model Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    1. Equipment Category Tab
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory | '')}
                    className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="">— Leave Empty (Defaults to Controllers) —</option>
                    <option value="Controllers">Controllers (Includes I/O Tabs)</option>
                    <option value="Motors">Motors (Servo Motors &amp; Drives)</option>
                    <option value="Machines">Machines (Complete CNC Machines)</option>
                    <option value="Robots">Robots (6-Axis Industrial Robots)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    2. Subcategory Tab (Auto-Distributed if Empty)
                  </label>
                  <select
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="">
                      — Auto-Distribute from Model / Description —
                    </option>
                    {OFFICIAL_SUBCATEGORY_GROUPS.filter(
                      (g) => !newCategory || g.category === newCategory
                    ).map((group) => (
                      <optgroup key={group.id} label={group.groupTitle}>
                        {group.subcategories.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    3. Model Number Tab *
                  </label>
                  <input
                    type="text"
                    required
                    value={newModelNumber}
                    onChange={(e) => setNewModelNumber(e.target.value)}
                    placeholder="e.g., SZGH-CNC1000MDb-3"
                    className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono-tabular font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Row 2: Product Title, Price (PKR), Initial Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-6">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    4. Product Title Tab (Leave empty if N/A)
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Empty if not available"
                    className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    5. Base Price PKR Tab (Leave empty if N/A)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Empty if N/A"
                    className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono-tabular font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    6. Stock Qty Tab (Leave empty if N/A)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newStockCount}
                    onChange={(e) => setNewStockCount(e.target.value)}
                    placeholder="Empty if N/A"
                    className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono-tabular font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Row 3: Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  7. Technical Summary / Description Tab (Leave empty if N/A)
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Leave empty if corresponding description is not available..."
                  className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              {/* Row 4: 4-Slot Product Pictures Uploader + Default Picture Highlighter */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#1E2985] dark:text-emerald-400" />
                    <span>
                      8. Product Picture Tabs (Leave empty if N/A, or Upload &amp; Highlight ★ Default)
                    </span>
                  </label>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                    Highlighted Default Tab: Picture #{newDefaultImageIndex + 1}
                  </span>
                </div>

                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 ${
                    newImages.length > 4 ? 'lg:grid-cols-6' : 'lg:grid-cols-4'
                  } gap-3`}
                >
                  {Array.from({ length: Math.max(4, newImages.length) }, (_, i) => i).map((slotIdx) => {
                    const isDefault = newDefaultImageIndex === slotIdx;
                    const hasCustomImage = Boolean(newImages[slotIdx]?.trim());

                    return (
                      <div
                        key={slotIdx}
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col justify-between gap-2.5 bg-white dark:bg-slate-900 ${
                          isDefault
                            ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-md'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                              Picture Tab #{slotIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => setNewDefaultImageIndex(slotIdx)}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                                isDefault
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-500/20 hover:text-amber-600'
                              }`}
                            >
                              <Star
                                className={`w-3 h-3 ${isDefault ? 'fill-current' : ''}`}
                              />
                              <span>{isDefault ? '★ DEFAULT' : 'Set Default'}</span>
                            </button>
                          </div>

                          <div
                            onClick={() => setNewDefaultImageIndex(slotIdx)}
                            title="Click to highlight as Default Display Picture"
                            className="relative aspect-4/3 w-full rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer flex items-center justify-center"
                          >
                            {hasCustomImage ? (
                              <img
                                src={newImages[slotIdx]}
                                alt={`New product slot ${slotIdx + 1}`}
                                className="w-full h-full object-contain p-1.5"
                              />
                            ) : (
                              <span className="text-[11px] text-slate-400 dark:text-slate-600 font-medium">
                                Empty Photo Tab
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded bg-[#1E2985]/10 dark:bg-emerald-500/15 text-[#1E2985] dark:text-emerald-300 hover:bg-[#1E2985]/20 dark:hover:bg-emerald-500/25 text-[11px] font-bold transition-colors cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photo #{slotIdx + 1}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleNewProductFileUpload(
                                  slotIdx,
                                  e.target.files?.[0]
                                )
                              }
                            />
                          </label>

                          <input
                            type="text"
                            value={
                              newImages[slotIdx]?.startsWith('data:')
                                ? ''
                                : newImages[slotIdx] || ''
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewImages((prev) => {
                                const next = [...prev];
                                next[slotIdx] = val;
                                return next;
                              });
                            }}
                            placeholder={
                              newImages[slotIdx]?.startsWith('data:')
                                ? 'Uploaded photo ready ✓'
                                : 'Or paste URL (leave empty if N/A)'
                            }
                            className="w-full px-2 py-1 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('manage')}
                  className="px-4 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingProduct}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#0D5C2B] hover:bg-[#094720] disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>
                    {creatingProduct
                      ? 'Saving to Stock Admin...'
                      : 'Save Item Listing to Stock Admin'}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* ================================================================= */}
          {/* TAB 1: MANAGE STOCK, PRICES & PHOTOS                              */}
          {/* ================================================================= */}
          {(!isAuthorizedAdmin || activeTab === 'manage') && (
            <>
              {/* Search & Step Increment Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter by Model Number (e.g., SZGH-CNC1000MDb), title, or category..."
                    className="w-full pl-9 pr-4 py-2 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1E2985] dark:focus:border-emerald-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Quick +/- Step:
                  </span>
                  {[1, 2, 5, 10].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => setStepAmount(step)}
                      className={`px-2.5 py-1 rounded text-xs font-mono-tabular font-bold border transition-colors cursor-pointer ${
                        stepAmount === step
                          ? 'bg-[#1E2985] dark:bg-emerald-600 text-white border-[#1E2985] dark:border-emerald-500'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      ±{step}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inventory Product Rows */}
              <div className="space-y-3">
                {filteredProducts.map((product) => {
                  const draft = draftEdits[product.id];
                  const displayStock = draft ? draft.stockCount : product.stockCount;
                  const displayPrice = draft ? draft.price : product.price;
                  const displayStatus = draft
                    ? draft.stockStatus
                    : product.stockStatus || deriveStatusFromCount(product.stockCount);
                  const isSynced = syncedProductIds.has(product.id);
                  const isSaving = savingId === product.id;
                  const isPhotoExpanded = expandedPhotoProductId === product.id;

                  const currentDefaultIdx =
                    typeof product.defaultImageIndex === 'number' &&
                    product.defaultImageIndex >= 0 &&
                    product.defaultImageIndex < product.images.length
                      ? product.defaultImageIndex
                      : 0;
                  const currentDefaultThumb =
                    product.images[currentDefaultIdx] ||
                    product.images.find((u) => Boolean(u?.trim())) ||
                    '';

                  const photoDraft = photoDrafts[product.id] || {
                    images: [...product.images],
                    defaultImageIndex: currentDefaultIdx,
                  };

                  return (
                    <div
                      key={product.id}
                      className="p-4 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Left: Default Thumbnail + Model Info */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="relative w-16 h-14 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                            {currentDefaultThumb ? (
                              <img
                                src={currentDefaultThumb}
                                alt={product.modelNumber}
                                className="w-full h-full object-contain p-1"
                              />
                            ) : (
                              <span className="text-[9px] text-slate-400 font-mono-tabular">
                                Empty Pic
                              </span>
                            )}
                            <span
                              title={`Default Image: Slot #${currentDefaultIdx + 1}`}
                              className="absolute top-0.5 right-0.5 px-1 py-0.2 rounded bg-amber-500 text-white text-[9px] font-bold flex items-center gap-0.5"
                            >
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>#{currentDefaultIdx + 1}</span>
                            </span>
                          </div>

                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center flex-wrap gap-2">
                              <span className="font-mono-tabular text-xs font-extrabold text-[#1E2985] dark:text-emerald-400">
                                {product.modelNumber}
                              </span>
                              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold">
                                {product.category}
                                {product.subcategory?.trim()
                                  ? ` · ${product.subcategory}`
                                  : ''}
                              </span>
                              <span
                                className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                                  displayStatus === 'In Stock'
                                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                    : displayStatus === 'Low Stock'
                                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                                    : 'bg-red-500/15 text-red-700 dark:text-red-300'
                                }`}
                              >
                                {displayStatus} ({displayStock} units)
                              </span>
                              {isSynced && (
                                <span className="text-[10px] font-mono-tabular text-emerald-600 dark:text-emerald-400">
                                  ● Cloud Live
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {product.title?.trim() ? (
                                product.title
                              ) : (
                                <span className="text-slate-400 font-normal italic">
                                  — Title tab left empty —
                                </span>
                              )}
                            </div>
                            {product.description?.trim() && (
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {product.description}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Stock In / Stock Out + Price + Edit Tabs + Photo Manager Button */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {/* Deduct Stock (- Sold) */}
                          <button
                            type="button"
                            disabled={!isAuthorizedAdmin || isSaving}
                            onClick={() =>
                              saveProductInventoryToCloud(
                                product,
                                Math.max(0, product.stockCount - stepAmount),
                                product.price
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-2 rounded-md bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-700 dark:text-red-300 text-xs font-bold disabled:opacity-40 transition-colors cursor-pointer"
                            title="Deduct sold units from live inventory"
                          >
                            <Minus className="w-3.5 h-3.5" />
                            <span>Sold (-{stepAmount})</span>
                          </button>

                          {/* Add Stock (+ Stock In) */}
                          <button
                            type="button"
                            disabled={!isAuthorizedAdmin || isSaving}
                            onClick={() =>
                              saveProductInventoryToCloud(
                                product,
                                product.stockCount + stepAmount,
                                product.price
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-2 rounded-md bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold disabled:opacity-40 transition-colors cursor-pointer"
                            title="Add newly arrived shipment units to live inventory"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Stock In (+{stepAmount})</span>
                          </button>

                          {/* Direct Quantity Input */}
                          <div className="flex items-center gap-1">
                            <label className="text-[11px] font-semibold text-slate-500">
                              Qty:
                            </label>
                            <input
                              type="number"
                              min={0}
                              disabled={!isAuthorizedAdmin || isSaving}
                              value={displayStock}
                              onChange={(e) => {
                                const val = Math.max(0, Number(e.target.value));
                                setDraftEdits((prev) => ({
                                  ...prev,
                                  [product.id]: {
                                    stockCount: val,
                                    price: displayPrice,
                                    stockStatus: deriveStatusFromCount(val),
                                    title: product.title || '',
                                    subcategory: product.subcategory || '',
                                    description: product.description || '',
                                  },
                                }));
                              }}
                              className="w-16 px-2 py-1.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono-tabular font-bold text-slate-900 dark:text-white"
                            />
                          </div>

                          {/* Direct PKR Price Input */}
                          <div className="flex items-center gap-1">
                            <label className="text-[11px] font-semibold text-slate-500">
                              PKR:
                            </label>
                            <input
                              type="number"
                              min={0}
                              step={1000}
                              disabled={!isAuthorizedAdmin || isSaving}
                              value={displayPrice}
                              onChange={(e) => {
                                const val = Math.max(0, Number(e.target.value));
                                setDraftEdits((prev) => ({
                                  ...prev,
                                  [product.id]: {
                                    stockCount: displayStock,
                                    price: val,
                                    stockStatus: displayStatus,
                                    title: product.title || '',
                                    subcategory: product.subcategory || '',
                                    description: product.description || '',
                                  },
                                }));
                              }}
                              className="w-24 px-2 py-1.5 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono-tabular font-bold text-slate-900 dark:text-white"
                            />
                          </div>

                          {/* Save Custom Draft Button */}
                          {draft && (
                            <button
                              type="button"
                              disabled={!isAuthorizedAdmin || isSaving}
                              onClick={() =>
                                saveProductInventoryToCloud(
                                  product,
                                  draft.stockCount,
                                  draft.price,
                                  draft.stockStatus
                                )
                              }
                              className="px-3 py-1.5 rounded-md bg-[#1E2985] dark:bg-emerald-600 text-white text-xs font-bold hover:opacity-95 cursor-pointer"
                            >
                              {isSaving ? 'Saving...' : 'Save'}
                            </button>
                          )}

                          {/* Edit All Tabs Button */}
                          {isAuthorizedAdmin && (
                            <button
                              type="button"
                              onClick={() => handleLoadExistingProductIntoForm(product)}
                              title="Edit all item tabs (Title, Subcategory, Description, Photos)"
                              className="inline-flex items-center gap-1 px-2.5 py-2 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-[#1E2985] text-xs font-bold cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Tabs</span>
                            </button>
                          )}

                          {/* Toggle 4-Picture & Default Photo Manager */}
                          <button
                            type="button"
                            onClick={() => handleTogglePhotoManager(product)}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-bold border transition-colors cursor-pointer ${
                              isPhotoExpanded
                                ? 'bg-amber-500 text-white border-amber-500'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-amber-500'
                            }`}
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Photos &amp; Default ★</span>
                          </button>
                        </div>
                      </div>

                      {/* Expandable Picture Upload & Default Highlighter Drawer (4 or 6 slots) */}
                      {isPhotoExpanded && (
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              Manage {photoDraft.images.length} Product Picture Tabs for{' '}
                              <span className="text-[#1E2985] dark:text-emerald-400">
                                {product.modelNumber}
                              </span>{' '}
                              — Click <span className="text-amber-600 dark:text-amber-400">★ Set Default</span> on the photo to display first in all listings:
                            </div>
                            <button
                              type="button"
                              disabled={!isAuthorizedAdmin || isSaving}
                              onClick={() =>
                                saveProductInventoryToCloud(
                                  product,
                                  displayStock,
                                  displayPrice,
                                  displayStatus,
                                  photoDraft.images,
                                  photoDraft.defaultImageIndex
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#0D5C2B] hover:bg-[#094720] disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer self-start"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>
                                {isSaving
                                  ? 'Saving Photos...'
                                  : 'Save Photos & Default ★'}
                              </span>
                            </button>
                          </div>

                          <div
                            className={`grid grid-cols-1 sm:grid-cols-2 ${
                              photoDraft.images.length > 4
                                ? 'lg:grid-cols-6'
                                : 'lg:grid-cols-4'
                            } gap-3`}
                          >
                            {Array.from(
                              { length: Math.max(4, photoDraft.images.length) },
                              (_, i) => i
                            ).map((slotIdx) => {
                              const isDefault =
                                photoDraft.defaultImageIndex === slotIdx;
                              const imgSrc = photoDraft.images[slotIdx]?.trim() || '';
                              const slotLabel = product.imageLabels?.[slotIdx] || '';

                              return (
                                <div
                                  key={slotIdx}
                                  className={`p-3 rounded-lg border-2 transition-all flex flex-col justify-between gap-2 bg-slate-50 dark:bg-slate-900 ${
                                    isDefault
                                      ? 'border-amber-500 ring-2 ring-amber-500/30'
                                      : 'border-slate-200 dark:border-slate-800'
                                  }`}
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                                        #{slotIdx + 1}{' '}
                                        {slotLabel ? `(${slotLabel})` : `Picture Tab`}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setPhotoDrafts((prev) => ({
                                            ...prev,
                                            [product.id]: {
                                              ...photoDraft,
                                              defaultImageIndex: slotIdx,
                                            },
                                          }))
                                        }
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer shrink-0 ${
                                          isDefault
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-500/20 hover:text-amber-500'
                                        }`}
                                      >
                                        <Star
                                          className={`w-3 h-3 ${
                                            isDefault ? 'fill-current' : ''
                                          }`}
                                        />
                                        <span>
                                          {isDefault ? '★ DEFAULT' : 'Set Default'}
                                        </span>
                                      </button>
                                    </div>

                                    <div
                                      onClick={() =>
                                        setPhotoDrafts((prev) => ({
                                          ...prev,
                                          [product.id]: {
                                            ...photoDraft,
                                            defaultImageIndex: slotIdx,
                                          },
                                        }))
                                      }
                                      title="Click to highlight as Default Display Image"
                                      className="aspect-4/3 w-full rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer flex items-center justify-center"
                                    >
                                      {imgSrc ? (
                                        <img
                                          src={imgSrc}
                                          alt={`${product.modelNumber} slot ${slotIdx + 1}`}
                                          className="w-full h-full object-contain p-1.5"
                                        />
                                      ) : (
                                        <span className="text-[11px] text-slate-400">
                                          Empty Photo Tab
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded bg-[#1E2985]/10 dark:bg-emerald-500/15 text-[#1E2985] dark:text-emerald-300 hover:bg-[#1E2985]/20 dark:hover:bg-emerald-500/25 text-[11px] font-bold transition-colors cursor-pointer">
                                      <Upload className="w-3.5 h-3.5" />
                                      <span>Upload Photo</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                          handleExistingProductFileUpload(
                                            product,
                                            slotIdx,
                                            e.target.files?.[0]
                                          )
                                        }
                                      />
                                    </label>

                                    <input
                                      type="text"
                                      value={
                                        photoDraft.images[slotIdx]?.startsWith('data:')
                                          ? ''
                                          : photoDraft.images[slotIdx] || ''
                                      }
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setPhotoDrafts((prev) => {
                                          const nextImages = [
                                            ...photoDraft.images,
                                          ];
                                          nextImages[slotIdx] = val;
                                          return {
                                            ...prev,
                                            [product.id]: {
                                              ...photoDraft,
                                              images: nextImages,
                                            },
                                          };
                                        });
                                      }}
                                      placeholder={
                                        photoDraft.images[slotIdx]?.startsWith('data:')
                                          ? 'Uploaded photo ready ✓'
                                          : 'Or paste URL (empty if N/A)'
                                      }
                                      className="w-full px-2 py-1 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
