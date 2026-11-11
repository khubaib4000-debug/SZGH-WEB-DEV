/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  TrendingUp,
  CornerDownRight,
  ChevronRight,
  Mail,
  Phone,
  Clock,
  QrCode,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  HERO_CATEGORIES,
  PRODUCTS_DATABASE,
  VIDEOS_DATABASE,
  SERVICES_DATABASE,
  OFFICIAL_SUBCATEGORY_GROUPS,
  ProductItem,
  ProductCategory,
  VideoPresentation,
  IOBoardOption,
  mergeProductsByModelAndAxes,
  isStandaloneIOBoardProduct,
  normalizeIOBoardModelNumber,
  resolveOfficialSubcategory,
  isSZGH880MCModel,
  SZGH_880MC_IMAGES,
  SZGH_880MC_IMAGE_LABELS,
  SZGH_880MC_DEFAULT_IMAGE_INDEX,
  isSZGH1080MCModel,
  SZGH_1080MC_IMAGES,
  SZGH_1080MC_IMAGE_LABELS,
  SZGH_1080MC_DEFAULT_IMAGE_INDEX,
  isSZGH880TCModel,
  SZGH_880TC_IMAGES,
  SZGH_880TC_IMAGE_LABELS,
  SZGH_880TC_DEFAULT_IMAGE_INDEX,
  isSZGH1080TCModel,
  SZGH_1080TC_IMAGES,
  SZGH_1080TC_IMAGE_LABELS,
  SZGH_1080TC_DEFAULT_IMAGE_INDEX,
  isSZGH1080MICModel,
  SZGH_1080MIC_IMAGES,
  SZGH_1080MIC_IMAGE_LABELS,
  SZGH_1080MIC_DEFAULT_IMAGE_INDEX,
  isSZGH880TICModel,
  SZGH_880TIC_IMAGES,
  SZGH_880TIC_IMAGE_LABELS,
  SZGH_880TIC_DEFAULT_IMAGE_INDEX,
  isSZGH1000MDBModel,
  SZGH_1000MDB_IMAGES,
  SZGH_1000MDB_IMAGE_LABELS,
  SZGH_1000MDB_DEFAULT_IMAGE_INDEX,
  isSZGH1500MDBModel,
  SZGH_1500MDB_IMAGES,
  SZGH_1500MDB_IMAGE_LABELS,
  SZGH_1500MDB_DEFAULT_IMAGE_INDEX,
  isSZGH990MDBModel,
  SZGH_990MDB_IMAGES,
  SZGH_990MDB_IMAGE_LABELS,
  SZGH_990MDB_DEFAULT_IMAGE_INDEX,
  isSZGH990MDCModel,
  SZGH_990MDC_IMAGES,
  SZGH_990MDC_IMAGE_LABELS,
  SZGH_990MDC_DEFAULT_IMAGE_INDEX,
  isSZGH990TDBModel,
  SZGH_990TDB_IMAGES,
  SZGH_990TDB_IMAGE_LABELS,
  SZGH_990TDB_DEFAULT_IMAGE_INDEX,
  isSZGH990TDCModel,
  SZGH_990TDC_IMAGES,
  SZGH_990TDC_IMAGE_LABELS,
  SZGH_990TDC_DEFAULT_IMAGE_INDEX,
  isSZGH1000MCModel,
  isSZGH1000MICModel,
  isSZGH1000TICModel,
  SZGH_1000MC_IMAGES,
  SZGH_1000MC_IMAGE_LABELS,
  SZGH_1000MC_DEFAULT_IMAGE_INDEX,
  isSZGH1000MDCModel,
  SZGH_1000MDC_IMAGES,
  SZGH_1000MDC_IMAGE_LABELS,
  SZGH_1000MDC_DEFAULT_IMAGE_INDEX,
  isSZGH1500MDCModel,
  SZGH_1500MDC_IMAGES,
  SZGH_1500MDC_IMAGE_LABELS,
  SZGH_1500MDC_DEFAULT_IMAGE_INDEX,
  isSZGH1000MDCBModel,
  SZGH_1000MDCB_IMAGES,
  SZGH_1000MDCB_IMAGE_LABELS,
  SZGH_1000MDCB_DEFAULT_IMAGE_INDEX,
  isSZGH1500MDCBModel,
  SZGH_1500MDCB_IMAGES,
  SZGH_1500MDCB_IMAGE_LABELS,
  SZGH_1500MDCB_DEFAULT_IMAGE_INDEX,
  isSZGH1000TDBModel,
  isSZGH1000TDCModel,
  isSZGH1000TCModel,
  isSZGH1080TICModel,
  isSZGH1080TDBModel,
  isSZGH1080MDBModel,
  isSZGH1080MDCModel,
  SZGH_1000TDB_IMAGES,
  SZGH_1000TDB_IMAGE_LABELS,
  SZGH_1000TDB_DEFAULT_IMAGE_INDEX,
  isSZGHCNCIO12Model,
  SZGH_CNC_IO12_IMAGES,
  SZGH_CNC_IO12_IMAGE_LABELS,
  SZGH_CNC_IO12_DEFAULT_IMAGE_INDEX,
  hasABPanelInProduct,
  hasCEPanelInProduct,
  detectRawPanelType,
  hasPanelOptionInProduct,
  normalizePanelStrings,
  applyPanelPicturesToGallery,
  buildPanelPricesFromBase,
  buildPanelPricesFromCE,
  resolveOfficialRateListPricing,
  PanelPriceBreakdown,
} from './data/products';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  ADMIN_EMAILS,
  OperationType,
  handleFirestoreError,
} from './lib/firebase';
import { Navbar, NavSection } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import {
  CartDrawer,
  CartEntry,
  SubmittedCustomerOrder,
} from './components/CartDrawer';
import { CategoryStoreSubpage } from './components/CategoryStoreSubpage';
import { WhatsAppFloatingChat } from './components/WhatsAppFloatingChat';
import { RetrofitBookingSection } from './components/RetrofitBookingSection';
import { AdminStockModal } from './components/AdminStockModal';

const THEME_STORAGE_KEY = 'sdgh_pakistan_theme_v1';
const CART_STORAGE_KEY = 'sdgh_pakistan_cart_v2';
const METRICS_STORAGE_KEY = 'sdgh_pakistan_metrics_v1';
const ORDERS_STORAGE_KEY = 'sdgh_pakistan_orders_v1';

interface ProductPerformanceMetrics {
  views: number;
  sold: number;
}

const DEFAULT_PERFORMANCE_METRICS: Record<string, ProductPerformanceMetrics> = {
  'SZGH-880TC': { views: 194, sold: 42 },
  'SZGH-CNC1000MDb': { views: 182, sold: 39 },
  'SZGH-CNC1000TDb': { views: 168, sold: 34 },
  'SZGH-130380D': { views: 145, sold: 29 },
  'SZGH-CNC990TDb': { views: 132, sold: 24 },
  'SZGH-09075DC': { views: 118, sold: 21 },
  'SZGH-T450': { views: 96, sold: 9 },
  'SZGH-H1500-B-6': { views: 88, sold: 7 },
};

export default function App() {
  // 1. Persistent Dark / Moderate (Light) Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // Ignore storage access errors in restricted frames
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. Persistent Shopping Cart State (Supports Controller I/O Board Options)
  const [cart, setCart] = useState<CartEntry[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore corrupt storage
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage errors
    }
  }, [cart]);

  // Automatic Product Performance Tracking (Views & Sold activity)
  const [performanceMetrics, setPerformanceMetrics] = useState<
    Record<string, ProductPerformanceMetrics>
  >(() => {
    try {
      const raw = localStorage.getItem(METRICS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_PERFORMANCE_METRICS, ...parsed };
        }
      }
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_PERFORMANCE_METRICS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        METRICS_STORAGE_KEY,
        JSON.stringify(performanceMetrics)
      );
    } catch {
      // Ignore storage errors
    }
  }, [performanceMetrics]);

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>('home');

  // 3. Dedicated Category & Subcategory Store Sub-Page State (Opened when clicking any category, subcategory, or Products nav, or via ?category= URL)
  const [activeSubpageCategory, setActiveSubpageCategory] = useState<
    ProductCategory | 'All' | null
  >(() => {
    try {
      const catParam = new URLSearchParams(window.location.search).get('category');
      if (
        catParam === 'Controllers' ||
        catParam === 'Motors' ||
        catParam === 'Machines' ||
        catParam === 'Robots' ||
        catParam === 'All'
      ) {
        return catParam;
      }
    } catch {
      // Ignore URL parsing errors
    }
    return null;
  });
  const [activeSubpageSubcategory, setActiveSubpageSubcategory] = useState<
    string | null
  >(null);

  const [selectedProductModal, setSelectedProductModal] =
    useState<ProductItem | null>(null);
  const [activeQrLightbox, setActiveQrLightbox] = useState<{
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    image: string;
    href?: string;
  } | null>(null);

  // 5. Interactive Video Modal / Active Video State
  const [activeVideo, setActiveVideo] = useState<VideoPresentation>(VIDEOS_DATABASE[0]);
  const [isPlayingSimulation, setIsPlayingSimulation] = useState(false);

  // 6. Live Firebase Inventory & Admin Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminStockModalOpen, setAdminStockModalOpen] = useState(false);
  const [customProductIds, setCustomProductIds] = useState<string[]>([]);
  const [cloudInventoryOverrides, setCloudInventoryOverrides] = useState<
    Record<
      string,
      {
        stockCount: number;
        stockStatus: 'In Stock' | 'Low Stock' | 'Pre-Order';
        price: number;
        defaultImageIndex?: number;
        images?: string[];
        modelNumber?: string;
        title?: string;
        category?: ProductCategory;
        subcategory?: string;
        description?: string;
        panelPrices?: PanelPriceBreakdown;
      }
    >
  >({});

  // Submitted Customer Orders State (Local + Live Firestore Sync)
  const [localOrders, setLocalOrders] = useState<SubmittedCustomerOrder[]>(() => {
    try {
      const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  });
  const [cloudOrderIds, setCloudOrderIds] = useState<string[]>([]);
  const [cloudOrdersMap, setCloudOrdersMap] = useState<
    Record<string, SubmittedCustomerOrder>
  >({});

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(localOrders));
    } catch {
      // Ignore storage errors
    }
  }, [localOrders]);

  const isAuthorizedAdmin = useMemo(() => {
    if (!currentUser || !currentUser.emailVerified || !currentUser.email) {
      return false;
    }
    const lowerEmail = currentUser.email.toLowerCase();
    return ADMIN_EMAILS.some((admin) => admin.toLowerCase() === lowerEmail);
  }, [currentUser]);

  const handleGoogleSignIn = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const email = cred.user.email?.toLowerCase() || '';
      const isAdminUser =
        cred.user.emailVerified &&
        ADMIN_EMAILS.some((admin) => admin.toLowerCase() === email);
      if (isAdminUser) {
        setAdminStockModalOpen(true);
      }
    } catch {
      // Popup closed or blocked
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOut(auth);
      setAdminStockModalOpen(false);
    } catch {
      // Ignore sign-out errors
    }
  };

  const handleSecretAdminAccess = async () => {
    if (isAuthorizedAdmin) {
      setAdminStockModalOpen(true);
      return;
    }
    await handleGoogleSignIn();
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Keep non-anonymous signed-in users (both customers and admins) active
      if (user && user.isAnonymous) {
        setCurrentUser(null);
        return;
      }
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  // Subscribe to Order Manifest (/order_index/active_orders) for Admin
  useEffect(() => {
    if (!isAuthorizedAdmin) return;
    const unsubscribeOrderManifest = onSnapshot(
      doc(db, 'order_index', 'active_orders'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.orderIds)) {
            setCloudOrderIds(
              data.orderIds.filter(
                (id: unknown): id is string =>
                  typeof id === 'string' && id.trim().length > 0
              )
            );
          }
        }
      },
      () => {
        // Ignore read error if manifest not created yet
      }
    );
    return () => unsubscribeOrderManifest();
  }, [isAuthorizedAdmin]);

  // Subscribe to individual order documents (/orders/{orderId}) for Admin
  useEffect(() => {
    if (!isAuthorizedAdmin || cloudOrderIds.length === 0) return;
    const unsubs = cloudOrderIds.map((orderId) =>
      onSnapshot(
        doc(db, 'orders', orderId),
        (snap) => {
          if (snap.exists()) {
            const d = snap.data();
            setCloudOrdersMap((prev) => ({
              ...prev,
              [orderId]: {
                orderId: d.orderId || orderId,
                customerUid: d.customerUid || '',
                timestamp:
                  d.createdAt && typeof d.createdAt.toDate === 'function'
                    ? d.createdAt.toDate().toLocaleString('en-PK', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : 'Recent Order',
                companyName: d.companyName || '',
                contactName: d.contactName || '',
                email: d.email || '',
                phone: d.phone || '',
                ntnNumber: d.ntnNumber || '',
                strnNumber: d.strnNumber || '',
                city: d.city || '',
                address: d.address || '',
                orderNotes: d.orderNotes || '',
                invoiceType: d.invoiceType || d.paymentMethod || '1- Cash (Cash on Pick Up)',
                paymentMethod:
                  d.paymentMethod === '2- Online (UBL Bank Transfer)' ||
                  d.paymentMethod === 'Online Bank Transfer (UBL)'
                    ? '2- Online (UBL Bank Transfer)'
                    : d.paymentMethod === '3- Sales Tax Invoice (18% GST)' ||
                        d.paymentMethod === 'Sales Tax Invoice (18% GST)'
                      ? '3- Sales Tax Invoice (18% GST)'
                      : '1- Cash (Cash on Pick Up)',
                transactionRef: d.transactionRef || '',
                itemsSummary: d.itemsSummary || '',
                items: [],
                subtotalPKR: typeof d.subtotalPKR === 'number' ? d.subtotalPKR : 0,
                salesTaxRate: d.salesTaxRate === 0 ? 0 : 18,
                salesTaxPKR: typeof d.salesTaxPKR === 'number' ? d.salesTaxPKR : 0,
                totalPKR: typeof d.totalPKR === 'number' ? d.totalPKR : 0,
                orderStatus: d.orderStatus || 'New Order',
                autoDispatchStatus: 'recorded',
              },
            }));
          }
        },
        () => {
          // Ignore individual doc error
        }
      )
    );
    return () => unsubs.forEach((u) => u());
  }, [isAuthorizedAdmin, cloudOrderIds]);

  const combinedOrders = useMemo(() => {
    const byId = new Map<string, SubmittedCustomerOrder>();
    for (const loc of localOrders) {
      byId.set(loc.orderId, loc);
    }
    for (const [id, cld] of Object.entries(cloudOrdersMap)) {
      byId.set(id, cld);
    }
    return Array.from(byId.values()).reverse();
  }, [localOrders, cloudOrdersMap]);

  const handleOrderSubmitted = (newOrder: SubmittedCustomerOrder) => {
    setLocalOrders((prev) => [...prev, newOrder]);
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: SubmittedCustomerOrder['orderStatus']
  ) => {
    setLocalOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId ? { ...o, orderStatus: newStatus } : o
      )
    );
    if (isAuthorizedAdmin) {
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          orderStatus: newStatus,
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Order may only exist locally
      }
    }
  };

  // Secret Admin Entry Triggers: Ctrl+Shift+A / Alt+Shift+A or URL ?admin=1 / #admin
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get('admin') === '1' ||
      window.location.hash.toLowerCase() === '#admin'
    ) {
      setAdminStockModalOpen(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.altKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setAdminStockModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Subscribe to custom product manifest (/catalog_index/active_manifest)
  useEffect(() => {
    const manifestPath = 'catalog_index/active_manifest';
    const unsubscribeManifest = onSnapshot(
      doc(db, 'catalog_index', 'active_manifest'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.customProductIds)) {
            const validIds = data.customProductIds.filter(
              (id: unknown): id is string =>
                typeof id === 'string' && id.trim().length > 0
            );
            setCustomProductIds(validIds);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, manifestPath);
      }
    );
    return () => unsubscribeManifest();
  }, []);

  // Subscribe to all built-in + custom product documents in /inventory/{productId}
  useEffect(() => {
    const allProductIds = Array.from(
      new Set([
        ...PRODUCTS_DATABASE.map((p) => p.id),
        ...customProductIds,
      ])
    );

    const unsubscribes = allProductIds.map((productId) => {
      const path = `inventory/${productId}`;
      return onSnapshot(
        doc(db, 'inventory', productId),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (
              typeof data.stockCount === 'number' &&
              typeof data.price === 'number' &&
              (data.stockStatus === 'In Stock' ||
                data.stockStatus === 'Low Stock' ||
                data.stockStatus === 'Pre-Order')
            ) {
              const rawImages = Array.isArray(data.images)
                ? data.images.map((img: unknown) =>
                    typeof img === 'string' ? img : ''
                  )
                : [];
              const normalizedTuple: string[] | undefined =
                rawImages.length > 6
                  ? [
                      rawImages[0] ?? '',
                      rawImages[1] ?? '',
                      rawImages[2] ?? '',
                      rawImages[3] ?? '',
                      rawImages[4] ?? '',
                      rawImages[5] ?? '',
                      rawImages[6] ?? '',
                      rawImages[7] ?? '',
                    ]
                  : rawImages.length > 4
                  ? [
                      rawImages[0] ?? '',
                      rawImages[1] ?? '',
                      rawImages[2] ?? '',
                      rawImages[3] ?? '',
                      rawImages[4] ?? '',
                      rawImages[5] ?? '',
                    ]
                  : rawImages.length > 0
                  ? [
                      rawImages[0] ?? '',
                      rawImages[1] ?? '',
                      rawImages[2] ?? '',
                      rawImages[3] ?? '',
                    ]
                  : undefined;

              setCloudInventoryOverrides((prev) => ({
                ...prev,
                [productId]: {
                  stockCount: data.stockCount,
                  stockStatus: data.stockStatus,
                  price: data.price,
                  defaultImageIndex:
                    typeof data.defaultImageIndex === 'number'
                      ? Math.max(0, Math.min(7, Math.round(data.defaultImageIndex)))
                      : undefined,
                  images: normalizedTuple,
                  modelNumber:
                    typeof data.modelNumber === 'string'
                      ? data.modelNumber
                      : undefined,
                  title: typeof data.title === 'string' ? data.title : undefined,
                  category:
                    data.category === 'Controllers' ||
                    data.category === 'Motors' ||
                    data.category === 'Machines' ||
                    data.category === 'Robots'
                      ? data.category
                      : undefined,
                  subcategory:
                    typeof data.subcategory === 'string'
                      ? data.subcategory
                      : undefined,
                  description:
                    typeof data.description === 'string'
                      ? data.description
                      : undefined,
                  panelPrices:
                    data.panelPrices &&
                    typeof data.panelPrices === 'object' &&
                    typeof data.panelPrices.A === 'number' &&
                    data.panelPrices.A > 0
                      ? buildPanelPricesFromBase(data.panelPrices.A)
                      : undefined,
                },
              }));
            }
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, path);
        }
      );
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [customProductIds]);

  const deriveTitleFromDescription = (
    desc?: string,
    fallbackTitle?: string
  ): string => {
    if (fallbackTitle && fallbackTitle.trim().length > 0) {
      return fallbackTitle.trim();
    }
    if (!desc || !desc.trim()) return '';
    const cleaned = desc.trim().replace(/\s+/g, ' ');
    // Take first line or sentence if multi-sentence, up to 140 chars
    const firstSegment = cleaned.split(/\r?\n|(?<=[.!?])\s+/)[0] || cleaned;
    return firstSegment.slice(0, 140).trim();
  };

  const liveProducts = useMemo(() => {
    const builtInIds = new Set(PRODUCTS_DATABASE.map((p) => p.id));

    const mergedBuiltIn = PRODUCTS_DATABASE.map((item) => {
      const override = cloudInventoryOverrides[item.id];
      if (!override) {
        const normPanel = normalizePanelStrings(item);
        const { images: panelImgs, imageLabels: panelLabels } =
          applyPanelPicturesToGallery(item.images, item.imageLabels, {
            ...normPanel,
            hasPanelOptions: item.hasPanelOptions,
          });
        return {
          ...item,
          modelNumber: normPanel.modelNumber,
          description: normPanel.description,
          title: deriveTitleFromDescription(normPanel.description, normPanel.title),
          images: panelImgs,
          imageLabels: panelLabels,
        };
      }
      const hasAnyCustomImage = override.images?.some((u) => u.trim().length > 0);
      const rawEffectiveDesc =
        override.description !== undefined && override.description.trim().length > 0
          ? override.description
          : item.description;
      const rawEffectiveTitle =
        override.title && override.title.trim().length > 0
          ? override.title.trim()
          : deriveTitleFromDescription(rawEffectiveDesc, item.title);

      const normPanel = normalizePanelStrings({
        modelNumber: override.modelNumber || item.modelNumber,
        title: rawEffectiveTitle,
        description: rawEffectiveDesc,
      });
      const effectiveDesc = normPanel.description;
      const effectiveTitle =
        deriveTitleFromDescription(effectiveDesc, normPanel.title) || normPanel.title;

      const resolvedModel = normalizeIOBoardModelNumber(
        normPanel.modelNumber,
        effectiveDesc,
        effectiveTitle
      );
      const isIOBoard = isStandaloneIOBoardProduct({
        modelNumber: resolvedModel,
        description: effectiveDesc,
        title: effectiveTitle,
      });

      const is880MC = isSZGH880MCModel({ modelNumber: resolvedModel });
      const is1080MC = isSZGH1080MCModel({ modelNumber: resolvedModel });
      const is1080MIC = isSZGH1080MICModel({ modelNumber: resolvedModel });
      const is880TC = isSZGH880TCModel({ modelNumber: resolvedModel });
      const is880TIC = isSZGH880TICModel({ modelNumber: resolvedModel });
      const is1080TC = isSZGH1080TCModel({ modelNumber: resolvedModel });
      const is1080TIC = isSZGH1080TICModel({ modelNumber: resolvedModel });
      const is1080TDB = isSZGH1080TDBModel({ modelNumber: resolvedModel });
      const is1080MDB = isSZGH1080MDBModel({ modelNumber: resolvedModel });
      const is1080MDC = isSZGH1080MDCModel({ modelNumber: resolvedModel });
      const is1000MDB = isSZGH1000MDBModel({ modelNumber: resolvedModel });
      const is1500MDB = isSZGH1500MDBModel({ modelNumber: resolvedModel });
      const is990MDB = isSZGH990MDBModel({ modelNumber: resolvedModel });
      const is990MDC = isSZGH990MDCModel({ modelNumber: resolvedModel });
      const is990TDB = isSZGH990TDBModel({ modelNumber: resolvedModel });
      const is990TDC = isSZGH990TDCModel({ modelNumber: resolvedModel });
      const is1000MC = isSZGH1000MCModel({ modelNumber: resolvedModel });
      const is1000MIC = isSZGH1000MICModel({ modelNumber: resolvedModel });
      const is1000TC = isSZGH1000TCModel({ modelNumber: resolvedModel });
      const is1000TIC = isSZGH1000TICModel({ modelNumber: resolvedModel });
      const is1000MDC = isSZGH1000MDCModel({ modelNumber: resolvedModel });
      const is1500MDC = isSZGH1500MDCModel({ modelNumber: resolvedModel });
      const is1000MDCB = isSZGH1000MDCBModel({ modelNumber: resolvedModel });
      const is1500MDCB = isSZGH1500MDCBModel({ modelNumber: resolvedModel });
      const is1000TDB = isSZGH1000TDBModel({ modelNumber: resolvedModel });
      const is1000TDC = isSZGH1000TDCModel({ modelNumber: resolvedModel });
      const isCNCIO12 = isSZGHCNCIO12Model({
        modelNumber: resolvedModel,
        title: effectiveTitle,
        description: effectiveDesc,
      });

      const hasCustomBaseFour = Boolean(
        override.images
          ?.slice(0, 4)
          .some(
            (u) =>
              u &&
              u.trim().length > 0 &&
              !u.startsWith('data:image/svg+xml')
          )
      );

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
        : is1080TC || is1080TIC || is1080TDB
        ? hasCustomBaseFour && override.images
          ? override.images.slice(0, 4)
          : SZGH_1080TC_IMAGES
        : is1080MDB || is1080MDC
        ? hasCustomBaseFour && override.images
          ? override.images.slice(0, 4)
          : SZGH_1080MC_IMAGES
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
        : is1000MC || is1000MIC
        ? SZGH_1000MC_IMAGES
        : is1000TC || is1000TIC || is1000TDB || is1000TDC
        ? SZGH_1000TDB_IMAGES
        : is1000MDC
        ? SZGH_1000MDC_IMAGES
        : is1500MDC
        ? SZGH_1500MDC_IMAGES
        : is1000MDCB
        ? SZGH_1000MDCB_IMAGES
        : is1500MDCB
        ? SZGH_1500MDCB_IMAGES
        : isCNCIO12
        ? SZGH_CNC_IO12_IMAGES
        : hasAnyCustomImage && override.images
        ? override.images
        : item.images;

      const baseFourLabels: string[] = is880MC
        ? SZGH_880MC_IMAGE_LABELS
        : is1080MC || is1080MDB || is1080MDC
        ? SZGH_1080MC_IMAGE_LABELS
        : is1080MIC
        ? SZGH_1080MIC_IMAGE_LABELS
        : is880TC
        ? SZGH_880TC_IMAGE_LABELS
        : is880TIC
        ? SZGH_880TIC_IMAGE_LABELS
        : is1080TC || is1080TIC || is1080TDB
        ? SZGH_1080TC_IMAGE_LABELS
        : is1000MDB
        ? SZGH_1000MDB_IMAGE_LABELS
        : is1500MDB
        ? SZGH_1500MDB_IMAGE_LABELS
        : is990MDB
        ? SZGH_990MDB_IMAGE_LABELS
        : is990MDC
        ? SZGH_990MDC_IMAGE_LABELS
        : is990TDB
        ? SZGH_990TDB_IMAGE_LABELS
        : is990TDC
        ? SZGH_990TDC_IMAGE_LABELS
        : is1000MC || is1000MIC
        ? SZGH_1000MC_IMAGE_LABELS
        : is1000MDC
        ? SZGH_1000MDC_IMAGE_LABELS
        : is1500MDC
        ? SZGH_1500MDC_IMAGE_LABELS
        : is1000MDCB
        ? SZGH_1000MDCB_IMAGE_LABELS
        : is1500MDCB
        ? SZGH_1500MDCB_IMAGE_LABELS
        : is1000TDB || is1000TDC || is1000TC || is1000TIC
        ? SZGH_1000TDB_IMAGE_LABELS
        : isCNCIO12
        ? SZGH_CNC_IO12_IMAGE_LABELS
        : item.imageLabels;

      const rawPanelType = detectRawPanelType({
        modelNumber: override.modelNumber || item.modelNumber,
        title: rawEffectiveTitle,
        description: rawEffectiveDesc,
        rawPanelType: item.rawPanelType,
      });

      const hasPanel = Boolean(
        item.hasPanelOptions ||
          hasPanelOptionInProduct({
            modelNumber: override.modelNumber || item.modelNumber,
            title: rawEffectiveTitle,
            description: rawEffectiveDesc,
          })
      );

      const { images: resolvedImages, imageLabels: resolvedLabels } =
        applyPanelPicturesToGallery(baseFourImages, baseFourLabels, {
          modelNumber: resolvedModel,
          title: effectiveTitle,
          description: effectiveDesc,
          hasPanelOptions: hasPanel,
        });

      const ratePricing = resolveOfficialRateListPricing({
        modelNumber: resolvedModel,
        title: effectiveTitle,
        description: effectiveDesc,
        price: override.price,
      });

      const finalDesc = ratePricing.description || effectiveDesc;
      const finalTitle = ratePricing.title || effectiveTitle;
      const finalSubcat =
        ratePricing.subcategory ||
        (override.subcategory !== undefined
          ? override.subcategory
          : item.subcategory);
      const rawPanelPrices =
        override.panelPrices || ratePricing.panelPrices || item.panelPrices;
      const fallbackPrice =
        override.price > 0
          ? override.price
          : ratePricing.price !== undefined
          ? ratePricing.price
          : override.price;
      const finalPanelPrices =
        rawPanelPrices ||
        (hasPanel
          ? rawPanelType === 'CE'
            ? buildPanelPricesFromCE(fallbackPrice)
            : buildPanelPricesFromBase(fallbackPrice)
          : undefined);
      const resolvedBasePrice =
        finalPanelPrices?.defaultDisplayPrice ??
        finalPanelPrices?.A ??
        fallbackPrice;

      return {
        ...item,
        modelNumber: resolvedModel,
        title: finalTitle,
        hasPanelOptions: hasPanel,
        rawPanelType,
        ...(finalPanelPrices ? { panelPrices: finalPanelPrices } : {}),
        category: override.category || item.category,
        subcategory: finalSubcat,
        description: finalDesc,
        features: ratePricing.features || item.features,
        stockCount: override.stockCount,
        stockStatus: override.stockStatus,
        inStock: override.stockCount > 0,
        price: resolvedBasePrice,
        servoConfigOptions:
          ratePricing.servoConfigOptions || item.servoConfigOptions,
        hasIOBoardOption: isIOBoard ? false : item.hasIOBoardOption,
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
          : is1000MC || is1000MIC
          ? SZGH_1000MC_DEFAULT_IMAGE_INDEX
          : is1000MDC
          ? SZGH_1000MDC_DEFAULT_IMAGE_INDEX
          : is1500MDC
          ? SZGH_1500MDC_DEFAULT_IMAGE_INDEX
          : is1000MDCB
          ? SZGH_1000MDCB_DEFAULT_IMAGE_INDEX
          : is1500MDCB
          ? SZGH_1500MDCB_DEFAULT_IMAGE_INDEX
          : is1000TDB || is1000TDC || is1000TC || is1000TIC
          ? SZGH_1000TDB_DEFAULT_IMAGE_INDEX
          : isCNCIO12
          ? SZGH_CNC_IO12_DEFAULT_IMAGE_INDEX
          : override.defaultImageIndex ?? item.defaultImageIndex ?? 0,
        images: resolvedImages,
        imageLabels: resolvedLabels,
      };
    });

    const customProducts: ProductItem[] = [];
    for (const customId of customProductIds) {
      if (builtInIds.has(customId)) continue;
      const override = cloudInventoryOverrides[customId];
      if (!override || !override.modelNumber) {
        continue;
      }
      const cat: ProductCategory = override.category || 'Controllers';
      const subcat = override.subcategory ?? '';
      const rawDesc = override.description ?? '';
      const rawTtl = deriveTitleFromDescription(rawDesc, override.title);
      const rawPanelType = detectRawPanelType({
        modelNumber: override.modelNumber,
        title: rawTtl,
        description: rawDesc,
      });
      const normPanel = normalizePanelStrings({
        modelNumber: override.modelNumber,
        title: rawTtl,
        description: rawDesc,
      });
      const desc = normPanel.description;
      const ttl = deriveTitleFromDescription(desc, normPanel.title) || normPanel.title;
      const normalizedModel = normalizeIOBoardModelNumber(
        normPanel.modelNumber,
        desc,
        ttl
      );
      const isIOBoard = isStandaloneIOBoardProduct({
        modelNumber: normalizedModel,
        description: desc,
        title: ttl,
        price: override.price,
      });
      const is880MC = isSZGH880MCModel({ modelNumber: normalizedModel });
      const is1080MC = isSZGH1080MCModel({ modelNumber: normalizedModel });
      const is1080MIC = isSZGH1080MICModel({ modelNumber: normalizedModel });
      const is880TC = isSZGH880TCModel({ modelNumber: normalizedModel });
      const is880TIC = isSZGH880TICModel({ modelNumber: normalizedModel });
      const is1080TC = isSZGH1080TCModel({ modelNumber: normalizedModel });
      const is1000MDB = isSZGH1000MDBModel({ modelNumber: normalizedModel });
      const is1500MDB = isSZGH1500MDBModel({ modelNumber: normalizedModel });
      const is990MDB = isSZGH990MDBModel({ modelNumber: normalizedModel });
      const is990MDC = isSZGH990MDCModel({ modelNumber: normalizedModel });
      const is990TDB = isSZGH990TDBModel({ modelNumber: normalizedModel });
      const is990TDC = isSZGH990TDCModel({ modelNumber: normalizedModel });
      const is1000MC = isSZGH1000MCModel({ modelNumber: normalizedModel });
      const is1000MIC = isSZGH1000MICModel({ modelNumber: normalizedModel });
      const is1000TIC = isSZGH1000TICModel({ modelNumber: normalizedModel });
      const is1000MDC = isSZGH1000MDCModel({ modelNumber: normalizedModel });
      const is1500MDC = isSZGH1500MDCModel({ modelNumber: normalizedModel });
      const is1000MDCB = isSZGH1000MDCBModel({ modelNumber: normalizedModel });
      const is1500MDCB = isSZGH1500MDCBModel({ modelNumber: normalizedModel });
      const is1000TDB = isSZGH1000TDBModel({ modelNumber: normalizedModel });
      const is1000TDC = isSZGH1000TDCModel({ modelNumber: normalizedModel });
      const isCNCIO12 = isSZGHCNCIO12Model({
        modelNumber: normalizedModel,
        title: ttl,
        description: desc,
      });

      const hasCustomBaseFour = Boolean(
        override.images
          ?.slice(0, 4)
          .some(
            (u) =>
              u &&
              u.trim().length > 0 &&
              !u.startsWith('data:image/svg+xml')
          )
      );

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
        : is1000MC || is1000MIC
        ? SZGH_1000MC_IMAGES
        : is1000TIC || is1000TDB || is1000TDC
        ? SZGH_1000TDB_IMAGES
        : is1000MDC
        ? SZGH_1000MDC_IMAGES
        : is1500MDC
        ? SZGH_1500MDC_IMAGES
        : is1000MDCB
        ? SZGH_1000MDCB_IMAGES
        : is1500MDCB
        ? SZGH_1500MDCB_IMAGES
        : isCNCIO12
        ? SZGH_CNC_IO12_IMAGES
        : override.images || ['', '', '', ''];

      const baseFourLabels: string[] = is880MC
        ? SZGH_880MC_IMAGE_LABELS
        : is1080MC
        ? SZGH_1080MC_IMAGE_LABELS
        : is1080MIC
        ? SZGH_1080MIC_IMAGE_LABELS
        : is880TC
        ? SZGH_880TC_IMAGE_LABELS
        : is880TIC
        ? SZGH_880TIC_IMAGE_LABELS
        : is1080TC
        ? SZGH_1080TC_IMAGE_LABELS
        : is1000MDB
        ? SZGH_1000MDB_IMAGE_LABELS
        : is1500MDB
        ? SZGH_1500MDB_IMAGE_LABELS
        : is990MDB
        ? SZGH_990MDB_IMAGE_LABELS
        : is990MDC
        ? SZGH_990MDC_IMAGE_LABELS
        : is990TDB
        ? SZGH_990TDB_IMAGE_LABELS
        : is990TDC
        ? SZGH_990TDC_IMAGE_LABELS
        : is1000MC || is1000MIC
        ? SZGH_1000MC_IMAGE_LABELS
        : is1000MDC
        ? SZGH_1000MDC_IMAGE_LABELS
        : is1500MDC
        ? SZGH_1500MDC_IMAGE_LABELS
        : is1000MDCB
        ? SZGH_1000MDCB_IMAGE_LABELS
        : is1500MDCB
        ? SZGH_1500MDCB_IMAGE_LABELS
        : is1000TDB || is1000TDC || is1000TIC
        ? SZGH_1000TDB_IMAGE_LABELS
        : isCNCIO12
        ? SZGH_CNC_IO12_IMAGE_LABELS
        : [
            'Picture #1 View',
            'Picture #2 View',
            'Picture #3 View',
            'Picture #4 View',
          ];

      const hasCustomPanel = hasPanelOptionInProduct({
        modelNumber: override.modelNumber,
        title: rawTtl,
        description: rawDesc,
      });

      const { images: resolvedImages, imageLabels: resolvedLabels } =
        applyPanelPicturesToGallery(baseFourImages, baseFourLabels, {
          modelNumber: normalizedModel,
          title: ttl,
          description: desc,
          hasPanelOptions: hasCustomPanel,
        });

      const ratePricing = resolveOfficialRateListPricing({
        modelNumber: normalizedModel,
        title: ttl,
        description: desc,
        price: override.price,
      });
      const fallbackCustomPrice =
        override.price > 0
          ? override.price
          : ratePricing.price !== undefined
          ? ratePricing.price
          : override.price;
      const finalCustomPanelPrices =
        override.panelPrices ||
        ratePricing.panelPrices ||
        (hasCustomPanel
          ? rawPanelType === 'CE'
            ? buildPanelPricesFromCE(fallbackCustomPrice)
            : buildPanelPricesFromBase(fallbackCustomPrice)
          : undefined);
      const finalCustomPrice =
        finalCustomPanelPrices?.defaultDisplayPrice ??
        finalCustomPanelPrices?.A ??
        fallbackCustomPrice;
      const finalCustomDesc = ratePricing.description || desc;
      const finalCustomTitle = ratePricing.title || ttl;
      const finalCustomSubcat = ratePricing.subcategory || subcat;

      customProducts.push({
        id: customId,
        modelNumber: normalizedModel,
        title: finalCustomTitle,
        hasPanelOptions: hasCustomPanel,
        rawPanelType,
        panelPrices: finalCustomPanelPrices,
        category: cat,
        subcategory: finalCustomSubcat,
        description: finalCustomDesc,
        features:
          ratePricing.features ||
          (finalCustomDesc
            ? [
                '1 Year Official SZGH Pakistan Replacement & Technical Support Warranty',
                'Ready Stock Dispatch from Lahore Warehouse Across Pakistan',
              ]
            : []),
        price: finalCustomPrice,
        servoConfigOptions: ratePricing.servoConfigOptions,
        usdEstimate:
          finalCustomPrice > 0
            ? Math.max(1, Math.round(finalCustomPrice / 278))
            : 0,
        inStock: override.stockCount > 0,
        stockCount: override.stockCount,
        stockStatus: override.stockStatus,
        defaultImageIndex: is880MC
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
          : is1000MC || is1000MIC
          ? SZGH_1000MC_DEFAULT_IMAGE_INDEX
          : is1000MDC
          ? SZGH_1000MDC_DEFAULT_IMAGE_INDEX
          : is1500MDC
          ? SZGH_1500MDC_DEFAULT_IMAGE_INDEX
          : is1000MDCB
          ? SZGH_1000MDCB_DEFAULT_IMAGE_INDEX
          : is1500MDCB
          ? SZGH_1500MDCB_DEFAULT_IMAGE_INDEX
          : is1000TDB || is1000TDC || is1000TIC
          ? SZGH_1000TDB_DEFAULT_IMAGE_INDEX
          : isCNCIO12
          ? SZGH_CNC_IO12_DEFAULT_IMAGE_INDEX
          : override.defaultImageIndex ?? 0,
        warranty: '1 Year Official SZGH Pakistan Warranty',
        hasIOBoardOption: cat === 'Controllers' && !isIOBoard,
        images: resolvedImages,
        imageLabels: resolvedLabels,
        specs: [
          { label: 'Model Number', value: normalizedModel },
          ...(ttl ? [{ label: 'Product Title', value: ttl }] : []),
          ...(subcat ? [{ label: 'Subcategory', value: subcat }] : []),
          { label: 'Category', value: cat },
          { label: 'Availability', value: `${override.stockStatus} (${override.stockCount} Units)` },
        ],
        compatibility: [],
      });
    }

    const hasCustom880MC = customProducts.some((p) =>
      isSZGH880MCModel({ modelNumber: p.modelNumber })
    );
    const hasCustom1080MC = customProducts.some((p) =>
      isSZGH1080MCModel({ modelNumber: p.modelNumber })
    );
    const hasCustom1080MIC = customProducts.some((p) =>
      isSZGH1080MICModel({ modelNumber: p.modelNumber })
    );
    const hasCustom880TC = customProducts.some((p) =>
      isSZGH880TCModel({ modelNumber: p.modelNumber })
    );
    const hasCustom880TIC = customProducts.some((p) =>
      isSZGH880TICModel({ modelNumber: p.modelNumber })
    );
    const hasCustom1080TC = customProducts.some((p) =>
      isSZGH1080TCModel({ modelNumber: p.modelNumber })
    );
    const hasCustom1000MDB = customProducts.some((p) =>
      isSZGH1000MDBModel({ modelNumber: p.modelNumber })
    );
    const hasCustom1500MDB = customProducts.some((p) =>
      isSZGH1500MDBModel({ modelNumber: p.modelNumber })
    );
    const hasCustom990MDB = customProducts.some((p) =>
      isSZGH990MDBModel({ modelNumber: p.modelNumber })
    );
    const hasCustom990MDC = customProducts.some((p) =>
      isSZGH990MDCModel({ modelNumber: p.modelNumber })
    );
    const hasCustom990TDB = customProducts.some((p) =>
      isSZGH990TDBModel({ modelNumber: p.modelNumber })
    );
    const hasCustom990TDC = customProducts.some((p) =>
      isSZGH990TDCModel({ modelNumber: p.modelNumber })
    );
    const hasCustom1000MC = customProducts.some((p) =>
      isSZGH1000MCModel({ modelNumber: p.modelNumber })
    );
    const hasCustom1000MIC = customProducts.some((p) =>
      isSZGH1000MICModel({ modelNumber: p.modelNumber })
    );
    const hasCustom1000TIC = customProducts.some((p) =>
      isSZGH1000TICModel({ modelNumber: p.modelNumber })
    );
    const hasCustom1000MDC = customProducts.some((p) =>
      isSZGH1000MDCModel({ modelNumber: p.modelNumber })
    );
    const hasCustom1500MDC = customProducts.some((p) =>
      isSZGH1500MDCModel({ modelNumber: p.modelNumber })
    );
    const hasCustom1000MDCB = customProducts.some((p) =>
      isSZGH1000MDCBModel({ modelNumber: p.modelNumber })
    );
    const hasCustom1500MDCB = customProducts.some((p) =>
      isSZGH1500MDCBModel({ modelNumber: p.modelNumber })
    );
    const hasCustom1000TDB = customProducts.some((p) =>
      isSZGH1000TDBModel({ modelNumber: p.modelNumber })
    );
    const hasCustom1000TDC = customProducts.some((p) =>
      isSZGH1000TDCModel({ modelNumber: p.modelNumber })
    );
    const hasCustomCNCIO12 = customProducts.some((p) =>
      isSZGHCNCIO12Model({
        modelNumber: p.modelNumber,
        title: p.title,
        description: p.description,
      })
    );
    const filteredBuiltIn = mergedBuiltIn.filter((p) => {
      if (hasCustom880MC && (p.id.startsWith('prod-cnc-880mc-') || isSZGH880MCModel(p))) return false;
      if (hasCustom1080MC && (p.id.startsWith('prod-cnc-1080mc-') || isSZGH1080MCModel(p))) return false;
      if (hasCustom1080MIC && (p.id.startsWith('prod-cnc-1080mic-') || isSZGH1080MICModel(p))) return false;
      if (hasCustom880TC && (p.id.startsWith('prod-cnc-880tc-') || isSZGH880TCModel(p))) return false;
      if (hasCustom880TIC && (p.id.startsWith('prod-cnc-880tic-') || isSZGH880TICModel(p))) return false;
      if (hasCustom1080TC && (p.id.startsWith('prod-cnc-1080tc-') || isSZGH1080TCModel(p))) return false;
      if (
        hasCustom1000MDB &&
        (p.id === 'prod-cnc-1000mdb' ||
          p.id.startsWith('prod-cnc-1000mdb-') ||
          p.id.startsWith('prod-cnc-szgh-cnc1000mdb-') ||
          isSZGH1000MDBModel(p))
      ) {
        return false;
      }
      if (
        hasCustom1500MDB &&
        (p.id === 'prod-cnc-1500mdb' ||
          p.id.startsWith('prod-cnc-1500mdb-') ||
          p.id.startsWith('prod-cnc-szgh-cnc1500mdb-') ||
          isSZGH1500MDBModel(p))
      ) {
        return false;
      }
      if (
        hasCustom990MDB &&
        (p.id === 'prod-cnc-990mdb' ||
          p.id.startsWith('prod-cnc-990mdb-') ||
          isSZGH990MDBModel(p))
      ) {
        return false;
      }
      if (
        hasCustom990MDC &&
        (p.id === 'prod-cnc-990mdc' ||
          p.id.startsWith('prod-cnc-990mdc-') ||
          isSZGH990MDCModel(p))
      ) {
        return false;
      }
      if (
        hasCustom990TDB &&
        (p.id === 'prod-cnc-990tdb' ||
          p.id.startsWith('prod-cnc-990tdb-') ||
          isSZGH990TDBModel(p))
      ) {
        return false;
      }
      if (
        hasCustom990TDC &&
        (p.id === 'prod-cnc-990tdc' ||
          p.id.startsWith('prod-cnc-990tdc-') ||
          isSZGH990TDCModel(p))
      ) {
        return false;
      }
      if (
        hasCustom1000MC &&
        (p.id === 'prod-cnc-1000mc' ||
          p.id.startsWith('prod-cnc-1000mc-') ||
          isSZGH1000MCModel(p))
      ) {
        return false;
      }
      if (hasCustom1000MIC && isSZGH1000MICModel(p)) return false;
      if (hasCustom1000TIC && isSZGH1000TICModel(p)) return false;
      if (
        hasCustom1000MDC &&
        (p.id === 'prod-cnc-1000mdc' ||
          p.id.startsWith('prod-cnc-1000mdc-') ||
          p.id.startsWith('prod-cnc-szgh-cnc1000mdc-') ||
          isSZGH1000MDCModel(p))
      ) {
        return false;
      }
      if (
        hasCustom1500MDC &&
        (p.id === 'prod-cnc-1500mdc' ||
          p.id.startsWith('prod-cnc-1500mdc-') ||
          p.id.startsWith('prod-cnc-szgh-cnc1500mdc-') ||
          isSZGH1500MDCModel(p))
      ) {
        return false;
      }
      if (
        hasCustom1000MDCB &&
        (p.id === 'prod-cnc-1000mdcb' ||
          p.id.startsWith('prod-cnc-1000mdcb-') ||
          p.id.startsWith('prod-cnc-szgh-cnc1000mdcb-') ||
          isSZGH1000MDCBModel(p))
      ) {
        return false;
      }
      if (
        hasCustom1500MDCB &&
        (p.id === 'prod-cnc-1500mdcb' ||
          p.id.startsWith('prod-cnc-1500mdcb-') ||
          p.id.startsWith('prod-cnc-szgh-cnc1500mdcb-') ||
          isSZGH1500MDCBModel(p))
      ) {
        return false;
      }
      if (
        hasCustom1000TDB &&
        (p.id === 'prod-cnc-1000tdb' ||
          p.id.startsWith('prod-cnc-1000tdb-') ||
          p.id.startsWith('prod-cnc-szgh-cnc1000tdb-') ||
          isSZGH1000TDBModel(p))
      ) {
        return false;
      }
      if (
        hasCustom1000TDC &&
        (p.id.startsWith('prod-cnc-1000tdc') ||
          p.id.startsWith('prod-cnc-szgh-cnc1000tdc-') ||
          isSZGH1000TDCModel(p))
      ) {
        return false;
      }
      if (hasCustomCNCIO12 && p.id === 'prod-cnc-io12') {
        return false;
      }
      return true;
    });

    return [...customProducts, ...filteredBuiltIn];
  }, [cloudInventoryOverrides, customProductIds]);

  // Automatically sync the official pictures into Firestore for any matching inventory docs when Admin is signed in
  useEffect(() => {
    if (!isAuthorizedAdmin || !currentUser) return;
    for (const [productId, override] of Object.entries(cloudInventoryOverrides)) {
      if (!override.modelNumber) continue;
      const normPanel = normalizePanelStrings({
        modelNumber: override.modelNumber,
        title: override.title,
        description: override.description,
      });
      const hasABPanel = hasABPanelInProduct(override);
      const hasCEPanel = hasCEPanelInProduct(override);
      const hasPanelOption = hasPanelOptionInProduct(override);

      const is880MC = isSZGH880MCModel({ modelNumber: override.modelNumber });
      const is1080MC = isSZGH1080MCModel({ modelNumber: override.modelNumber });
      const is1080MIC = isSZGH1080MICModel({ modelNumber: override.modelNumber });
      const is880TC = isSZGH880TCModel({ modelNumber: override.modelNumber });
      const is880TIC = isSZGH880TICModel({ modelNumber: override.modelNumber });
      const is1080TC = isSZGH1080TCModel({ modelNumber: override.modelNumber });
      const is1000MDB = isSZGH1000MDBModel({ modelNumber: override.modelNumber });
      const is1500MDB = isSZGH1500MDBModel({ modelNumber: override.modelNumber });
      const is990MDB = isSZGH990MDBModel({ modelNumber: override.modelNumber });
      const is990MDC = isSZGH990MDCModel({ modelNumber: override.modelNumber });
      const is990TDB = isSZGH990TDBModel({ modelNumber: override.modelNumber });
      const is990TDC = isSZGH990TDCModel({ modelNumber: override.modelNumber });
      const is1000MC = isSZGH1000MCModel({ modelNumber: override.modelNumber });
      const is1000MIC = isSZGH1000MICModel({ modelNumber: override.modelNumber });
      const is1000TIC = isSZGH1000TICModel({ modelNumber: override.modelNumber });
      const is1000MDC = isSZGH1000MDCModel({ modelNumber: override.modelNumber });
      const is1500MDC = isSZGH1500MDCModel({ modelNumber: override.modelNumber });
      const is1000MDCB = isSZGH1000MDCBModel({ modelNumber: override.modelNumber });
      const is1500MDCB = isSZGH1500MDCBModel({ modelNumber: override.modelNumber });
      const is1000TDB = isSZGH1000TDBModel({ modelNumber: override.modelNumber });
      const is1000TDC = isSZGH1000TDCModel({ modelNumber: override.modelNumber });
      const isCNCIO12 = isSZGHCNCIO12Model({
        modelNumber: override.modelNumber,
        title: override.title,
        description: override.description,
      });
      if (
        !is880MC &&
        !is1080MC &&
        !is1080MIC &&
        !is880TC &&
        !is880TIC &&
        !is1080TC &&
        !is1000MDB &&
        !is1500MDB &&
        !is990MDB &&
        !is990MDC &&
        !is990TDB &&
        !is990TDC &&
        !is1000MC &&
        !is1000MIC &&
        !is1000TIC &&
        !is1000MDC &&
        !is1500MDC &&
        !is1000MDCB &&
        !is1500MDCB &&
        !is1000TDB &&
        !is1000TDC &&
        !isCNCIO12 &&
        !hasABPanel &&
        !hasCEPanel &&
        !hasPanelOption
      ) {
        continue;
      }

      const hasOverrideCustomBaseFour = Boolean(
        override.images
          ?.slice(0, 4)
          .some(
            (u) =>
              u &&
              u.trim().length > 0 &&
              !u.startsWith('data:image/svg+xml')
          )
      );

      const baseTargetImages: string[] = is880MC
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
        : is1000MIC
        ? hasOverrideCustomBaseFour && override.images
          ? override.images.slice(0, 4)
          : SZGH_1000MC_IMAGES
        : is1000TIC
        ? hasOverrideCustomBaseFour && override.images
          ? override.images.slice(0, 4)
          : SZGH_1000TDB_IMAGES
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
        : is1000TDC
        ? hasOverrideCustomBaseFour && override.images
          ? override.images.slice(0, 4)
          : SZGH_1000TDB_IMAGES
        : isCNCIO12
        ? SZGH_CNC_IO12_IMAGES
        : override.images || ['', '', '', ''];

      const { images: targetImages } = applyPanelPicturesToGallery(
        baseTargetImages,
        [],
        {
          ...normPanel,
          hasPanelOptions: hasPanelOption,
        }
      );

      const targetDefaultIdx = is880MC
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
        : is1000MC || is1000MIC
        ? SZGH_1000MC_DEFAULT_IMAGE_INDEX
        : is1000MDC
        ? SZGH_1000MDC_DEFAULT_IMAGE_INDEX
        : is1500MDC
        ? SZGH_1500MDC_DEFAULT_IMAGE_INDEX
        : is1000MDCB
        ? SZGH_1000MDCB_DEFAULT_IMAGE_INDEX
        : is1500MDCB
        ? SZGH_1500MDCB_DEFAULT_IMAGE_INDEX
        : is1000TDB || is1000TDC || is1000TIC
        ? SZGH_1000TDB_DEFAULT_IMAGE_INDEX
        : isCNCIO12
        ? SZGH_CNC_IO12_DEFAULT_IMAGE_INDEX
        : override.defaultImageIndex ?? 0;

      const ratePricing = resolveOfficialRateListPricing({
        modelNumber: normPanel.modelNumber,
        title: normPanel.title,
        description: normPanel.description,
        price: override.price,
      });
      const targetDesc = ratePricing.description || normPanel.description;
      const targetTitle = ratePricing.title || normPanel.title;
      const targetSubcat = ratePricing.subcategory || override.subcategory;
      const priceMatches =
        ratePricing.price === undefined || override.price === ratePricing.price;
      const imagesMatch =
        override.images?.length === targetImages.length &&
        targetImages.every((img, idx) => override.images?.[idx] === img);
      const modelMatches = override.modelNumber === normPanel.modelNumber;
      const descMatches =
        (!hasABPanel && !hasCEPanel && !hasPanelOption && !ratePricing.description) ||
        override.description === targetDesc;
      const subcatMatches =
        !ratePricing.subcategory || override.subcategory === targetSubcat;
      const alreadySynced =
        override.defaultImageIndex === targetDefaultIdx &&
        imagesMatch &&
        modelMatches &&
        descMatches &&
        subcatMatches &&
        priceMatches;
      if (!alreadySynced) {
        updateDoc(doc(db, 'inventory', productId), {
          images: targetImages,
          defaultImageIndex: targetDefaultIdx,
          ...(ratePricing.price !== undefined
            ? { price: Math.round(ratePricing.price) }
            : {}),
          ...(ratePricing.subcategory
            ? { subcategory: ratePricing.subcategory.slice(0, 120) }
            : {}),
          ...(ratePricing.title
            ? { title: targetTitle.slice(0, 200) }
            : {}),
          ...(hasABPanel || hasCEPanel || hasPanelOption || ratePricing.description
            ? {
                modelNumber: normPanel.modelNumber.slice(0, 120),
                description: targetDesc.slice(0, 1500),
              }
            : {}),
          updatedBy: currentUser.uid,
          updatedAt: serverTimestamp(),
        }).catch(() => {
          // Ignore transient sync error
        });
      }
    }
  }, [isAuthorizedAdmin, currentUser, cloudInventoryOverrides]);

  // Merge same model & number of axes into 1 product listing with Axis Selection Tabs
  const mergedCatalogProducts = useMemo(
    () => mergeProductsByModelAndAxes(liveProducts),
    [liveProducts]
  );

  const syncedProductIds = useMemo(
    () => new Set(Object.keys(cloudInventoryOverrides)),
    [cloudInventoryOverrides]
  );

  // Open Dedicated Category Store Sub-Page (optionally pre-filtered to a Subcategory) AND move top section bar to "Products"
  const handleOpenCategorySubpage = (
    category: ProductCategory | 'All',
    subcategory: string | null = null
  ) => {
    setActiveSection('products');
    setActiveSubpageCategory(category);
    setActiveSubpageSubcategory(subcategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Track product view and open detail modal
  const handleSelectProduct = (item: ProductItem) => {
    const metricKey = item.baseModelNumber || item.modelNumber;
    setPerformanceMetrics((prev) => {
      const current = prev[metricKey] || { views: 25, sold: 5 };
      return {
        ...prev,
        [metricKey]: {
          ...current,
          views: current.views + 1,
        },
      };
    });
    setSelectedProductModal(item);
  };

  // Cart Handlers with I/O Board Support & Automatic Sold/Demand Tracking
  const handleAddToCart = (
    product: ProductItem,
    quantity = 1,
    selectedIOBoard?: IOBoardOption
  ) => {
    const metricKey = product.baseModelNumber || product.modelNumber.split('-').slice(0, 2).join('-');
    setPerformanceMetrics((prev) => {
      const current = prev[metricKey] || prev[product.modelNumber] || { views: 30, sold: 6 };
      return {
        ...prev,
        [metricKey]: {
          views: current.views + 1,
          sold: current.sold + quantity,
        },
      };
    });

    const cartKey = `${product.id}__${selectedIOBoard ? selectedIOBoard.id : 'base'}`;
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartKey === cartKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          cartKey,
          product,
          quantity,
          selectedIOBoard,
        },
      ];
    });
  };

  const handleUpdateCartQuantity = (cartKey: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(cartKey);
      return;
    }
    setCart((prev) =>
      prev.map((entry) =>
        entry.cartKey === cartKey ? { ...entry, quantity: newQuantity } : entry
      )
    );
  };

  const handleRemoveCartItem = (cartKey: string) => {
    setCart((prev) => prev.filter((entry) => entry.cartKey !== cartKey));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartItems = useMemo(
    () => cart.reduce((sum, entry) => sum + entry.quantity, 0),
    [cart]
  );

  // Automatically rank and pick ONLY the Top 3 Performing, Most Viewed & Most Sold Products for the Home Page
  const topThreePerformingProducts = useMemo(() => {
    const scored = mergedCatalogProducts.map((item) => {
      const key = item.baseModelNumber || item.modelNumber;
      const metrics = performanceMetrics[key] ||
        performanceMetrics[item.modelNumber] || {
          views: 40,
          sold: 8,
        };
      const score = metrics.sold * 5 + metrics.views * 2 + (item.inStock ? 20 : 0);
      return {
        product: item,
        views: metrics.views,
        sold: metrics.sold,
        score,
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3);
  }, [mergedCatalogProducts, performanceMetrics]);

  const handleTopNavNavigate = (sectionId: NavSection) => {
    setActiveSection(sectionId);
    if (sectionId === 'products') {
      // Open the full paginated catalog (6 products per page) when clicking Products in top bar
      setActiveSubpageCategory((prev) => (prev !== null ? prev : 'All'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (activeSubpageCategory !== null) {
      setActiveSubpageCategory(null);
      setActiveSubpageSubcategory(null);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 sm:pt-20 pb-16 md:pb-0 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Sticky Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleTopNavNavigate}
        onSelectCategorySubcategory={handleOpenCategorySubpage}
        theme={theme}
        onToggleTheme={toggleTheme}
        cartCount={totalCartItems}
        onOpenCart={() => setCartDrawerOpen(true)}
        currentUser={currentUser}
        isAdmin={isAuthorizedAdmin}
        onSignIn={handleGoogleSignIn}
        onSignOut={handleGoogleSignOut}
        onOpenAdminStock={() => setAdminStockModalOpen(true)}
        ordersCount={combinedOrders.length}
      />

      <main className="flex-1">
        {activeSubpageCategory !== null ? (
          /* ================================================================
             DEDICATED PAGINATED CATEGORY STORE SUB-PAGE (6 PRODUCTS PER PAGE)
             (Opened when clicking any Category/Subcategory on Home Page or Products tab)
             ================================================================ */
          <CategoryStoreSubpage
            category={activeSubpageCategory}
            selectedSubcategory={activeSubpageSubcategory}
            onChangeSubcategory={(subcat, targetCat) => {
              setActiveSection('products');
              setActiveSubpageSubcategory(subcat);
              if (targetCat) {
                setActiveSubpageCategory(targetCat);
              }
            }}
            products={mergedCatalogProducts}
            onChangeCategory={(cat) => {
              setActiveSection('products');
              setActiveSubpageCategory(cat);
              setActiveSubpageSubcategory(null);
            }}
            onBackToMain={() => {
              setActiveSubpageCategory(null);
              setActiveSubpageSubcategory(null);
              setActiveSection('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
          />
        ) : (
          /* ================================================================
             MAIN WEBSITE SECTIONS
             ================================================================ */
          <>
            {/* SECTION 1: HOME — RESPONSIVE MOBILE & DESKTOP COMPOSITE WITH 4 CLICKABLE PRODUCT FAMILIES */}
            <section
              id="home"
              className="relative w-full lg:min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden bg-[#eef2f6] dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 select-none"
            >
              {/* MOBILE & TABLET HERO (< lg): Clean High-Contrast Banner + Tactile 2×2 Hardware Cards */}
              <div className="lg:hidden flex flex-col w-full">
                {/* Top Mobile Hero Header */}
                <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-[#1E2985] px-4 py-6 sm:px-6 sm:py-8 text-center border-b border-white/10">
                  <p className="text-[11px] sm:text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                    SZGH Pakistan · KH Enterprises (Pvt) Ltd
                  </p>
                  <h1 className="mt-1.5 text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight text-balance">
                    Total Solution for CNC Systems &amp; Industrial Robots
                  </h1>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-200 font-medium max-w-xl mx-auto">
                    Tap any of the 4 product families below to open its dedicated store page
                  </p>
                </div>

                {/* 2×2 Touch-Friendly Hardware Category Grid on Mobile */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 p-3 sm:p-5 bg-gradient-to-b from-[#e5ebf1] via-[#f5f7fa] to-[#e2e8f0] dark:from-slate-900 dark:to-slate-950">
                  {HERO_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleOpenCategorySubpage(cat.id)}
                      title={`Open ${cat.title} Store Page`}
                      aria-label={`Open ${cat.title} Store Page`}
                      className="group flex flex-col justify-between rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden text-left transition-transform active:scale-[0.98] cursor-pointer"
                    >
                      <div className="w-full aspect-4/3 bg-gradient-to-b from-[#eef2f6] to-white dark:from-slate-800 dark:to-slate-900 p-2 sm:p-3 flex items-center justify-center overflow-hidden">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="w-full px-3 py-2.5 bg-slate-950 text-white flex items-center justify-between gap-1.5 border-t border-slate-800">
                        <div className="min-w-0">
                          <div className="text-[10px] font-mono-tabular text-emerald-400 font-bold truncate">
                            {cat.number}. {cat.title.toUpperCase()}
                          </div>
                          <div className="text-[11px] sm:text-xs font-bold text-white truncate">
                            {cat.shortSubtitle}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* DESKTOP FULL-WINDOW LANDSCAPE COMPOSITE (lg and up) */}
              <div className="hidden lg:flex lg:flex-col lg:justify-between lg:min-h-[calc(100vh-5rem)] relative w-full">
                {/* Unified Full-Window Landscape Picture Blending All 4 Clickable Product Photos */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#e5ebf1] via-[#f5f7fa] to-[#e2e8f0]">
                  <div className="w-full h-full grid grid-cols-4 items-center pt-40 pb-24 px-6">
                    {HERO_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleOpenCategorySubpage(cat.id)}
                        title={`Click to open ${cat.title} Store Page`}
                        aria-label={`Open ${cat.title} Store Page`}
                        className="group relative h-full w-full flex flex-col items-center justify-center overflow-hidden cursor-pointer focus:outline-none"
                      >
                        <img
                          src={cat.image}
                          alt={cat.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain scale-105 mix-blend-multiply transition-transform duration-300 group-hover:scale-112"
                        />
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute bottom-4 px-3 py-1.5 rounded bg-[#1E2985]/95 text-white text-xs font-bold shadow-md">
                          Shop {cat.title} →
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Subtle top and bottom architectural light gradients */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-slate-950/75 via-slate-950/35 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent" />
                </div>

                {/* Top Brief Writings Overlay */}
                <div className="relative z-10 max-w-[1360px] w-full mx-auto px-8 pt-10 text-center pointer-events-none">
                  <p className="text-sm font-semibold tracking-wider text-emerald-300 uppercase">
                    SZGH Pakistan · KH Enterprises (Pvt) Ltd
                  </p>
                  <h1 className="mt-1.5 text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm text-balance">
                    Total Solution for CNC Systems &amp; Industrial Robots
                  </h1>
                  <p className="mt-2 text-base text-slate-100 font-medium max-w-2xl mx-auto drop-shadow-xs">
                    Click any of the 4 product families below to open its dedicated store page
                  </p>
                </div>

                {/* Bottom Clickable Category Strip Aligned Over the 4 Hardware Zones */}
                <div className="relative z-10 w-full border-t border-white/15 bg-slate-950/75 backdrop-blur-xs">
                  <div className="max-w-[1360px] mx-auto px-8 py-3.5 grid grid-cols-4 gap-4 text-left">
                    {HERO_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleOpenCategorySubpage(cat.id)}
                        className="group flex items-center justify-between pr-3 border-r border-white/10 last:border-none text-left cursor-pointer"
                      >
                        <div>
                          <div className="text-[11px] font-mono-tabular text-emerald-400 font-semibold">
                            {cat.number}. {cat.title.toUpperCase()}
                          </div>
                          <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {cat.shortSubtitle}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ================================================================
                SECTION 2: HOME PAGE — TOP 3 PERFORMING, VIEWED & SOLD PRODUCTS
                ================================================================ */}
            <section
              id="products"
              className="py-10 sm:py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800"
            >
              <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D5C2B] dark:text-emerald-400 mb-1">
                      <TrendingUp className="w-4 h-4 shrink-0" />
                      <span>
                        Automatic Performance Ranking · Most Viewed &amp; Most Sold Hardware
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Top 3 Performing Industrial Products
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                      Automatically showcasing our top 3 best-performing, most viewed, and highest-selling systems. Multi-axis models are consolidated into single cards with Axes Selection Tabs.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenCategorySubpage('All')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[5px] bg-[#0068AD] hover:bg-[#00558F] text-white text-xs sm:text-sm font-normal transition-colors cursor-pointer shrink-0"
                  >
                    <span>
                      Browse Full Catalog ({mergedCatalogProducts.length} Models · 6 Per Page)
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>

                {/* Official SZGH Product Categories & Subcategories Directory */}
                <div className="mb-10 p-5 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-wider text-[#0D5C2B] dark:text-emerald-400">
                        Browse by Main Category &amp; Subcategory
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        Click any main product family or specific subcategory below to open its dedicated catalog view
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {HERO_CATEGORIES.map((cat, idx) => {
                        const count = mergedCatalogProducts.filter(
                          (p) => p.category === cat.id
                        ).length;
                        const isOrange = idx % 2 === 1;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleOpenCategorySubpage(cat.id, null)}
                            className={`px-3.5 py-2 rounded-[5px] text-xs font-normal text-white transition-colors cursor-pointer ${
                              isOrange
                                ? 'bg-[#E77817] hover:bg-[#d1680f]'
                                : 'bg-[#0068AD] hover:bg-[#00558F]'
                            }`}
                          >
                            {cat.title} ({count}) →
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {OFFICIAL_SUBCATEGORY_GROUPS.map((group) => {
                      const groupProducts = mergedCatalogProducts.filter((p) => {
                        if (p.category !== group.category) return false;
                        const resolvedSub = resolveOfficialSubcategory(p);
                        return group.subcategories.some(
                          (s) => s.toLowerCase() === resolvedSub.toLowerCase()
                        );
                      });

                      return (
                        <div
                          key={group.id}
                          className="p-4 rounded-lg bg-slate-50/90 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between"
                        >
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenCategorySubpage(group.category, null)
                              }
                              className="w-full flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-200 dark:border-slate-800 text-left group cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <CornerDownRight className="w-4 h-4 text-amber-500 shrink-0 stroke-[2.5]" />
                                <span className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#1E2985] dark:group-hover:text-emerald-400 transition-colors">
                                  {group.groupTitle}
                                </span>
                              </div>
                              <span className="text-[11px] font-mono-tabular font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                                {groupProducts.length}
                              </span>
                            </button>

                            <ul className="space-y-1.5 pl-1">
                              {group.subcategories.map((subcat) => {
                                const subCount = mergedCatalogProducts.filter(
                                  (p) =>
                                    resolveOfficialSubcategory(p).toLowerCase() ===
                                    subcat.toLowerCase()
                                ).length;
                                return (
                                  <li key={subcat}>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleOpenCategorySubpage(
                                          group.category,
                                          subcat
                                        )
                                      }
                                      className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-[#1E2985] hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-colors group cursor-pointer"
                                    >
                                      <div className="flex items-start gap-1.5 min-w-0">
                                        <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-slate-400 group-hover:text-white shrink-0" />
                                        <span className="leading-snug">
                                          {subcat}
                                        </span>
                                      </div>
                                      <span className="text-[10px] font-mono-tabular px-1.5 py-0.2 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-white/20 group-hover:text-white shrink-0">
                                        {subCount}
                                      </span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top 3 Performing Product Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {topThreePerformingProducts.map((entry, idx) => {
                    const rankLabels = [
                      `#1 Top Performing · ${entry.sold} Sold · ${entry.views} Views`,
                      `#2 Most Viewed & Sold · ${entry.sold} Sold · ${entry.views} Views`,
                      `#3 High-Demand Unit · ${entry.sold} Sold · ${entry.views} Views`,
                    ];
                    return (
                      <ProductCard
                        key={entry.product.id}
                        product={entry.product}
                        rankBadge={rankLabels[idx]}
                        onAddToCart={handleAddToCart}
                        onSelectProduct={handleSelectProduct}
                      />
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ================================================================
                SECTION 3: VIDEOS (TECHNICAL OPERATION & RETROFIT DEMOS)
                ================================================================ */}
            <section
              id="videos"
              className="py-16 lg:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"
            >
              <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                  <div className="text-xs font-semibold text-[#0D5C2B] dark:text-emerald-400 mb-1">
                    Shop-Floor Verification · Commissioning Walkthroughs
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Technical Operation &amp; Retrofitting Videos
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                    Inspect real machining cycles, PLC turret commissioning, and 6-axis robotic welding setups completed by KH Enterprises engineers across Pakistan.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shadow-lg text-white">
                    {activeVideo.youtubeId ? (
                      <div className="aspect-video w-full bg-black border-b border-slate-800">
                        <iframe
                          key={activeVideo.youtubeId}
                          src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?rel=0`}
                          title={activeVideo.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                    ) : activeVideo.videoUrl ? (
                      <div className="aspect-video w-full bg-black border-b border-slate-800">
                        <video
                          key={activeVideo.videoUrl}
                          src={activeVideo.videoUrl}
                          controls
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video relative bg-slate-950 flex flex-col justify-between p-6 border-b border-slate-800">
                        <div className="flex items-center justify-between text-xs font-mono-tabular text-slate-400">
                          <span>{activeVideo.category.toUpperCase()}</span>
                          <span className="text-emerald-400">DURATION: {activeVideo.duration}</span>
                        </div>

                        <div className="my-auto py-8 flex flex-col items-center text-center max-w-lg mx-auto">
                          <button
                            type="button"
                            onClick={() => setIsPlayingSimulation(!isPlayingSimulation)}
                            aria-label={
                              isPlayingSimulation
                                ? 'Pause technical walkthrough'
                                : 'Play technical walkthrough'
                            }
                            className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-transform duration-150 hover:scale-105 cursor-pointer shadow-lg mb-4"
                          >
                            <Play className="w-7 h-7 fill-current ml-0.5" />
                          </button>
                          <h3 className="text-lg sm:text-xl font-bold text-white">
                            {activeVideo.title}
                          </h3>
                          <p className="text-xs text-slate-300 mt-2">
                            {isPlayingSimulation
                              ? 'ACTIVE WALKTHROUGH: Displaying live closed-loop servo interpolation, spindle load curve, and PLC ladder execution...'
                              : 'Click Play to inspect the step-by-step commissioning sequence & machining telemetry.'}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/90 text-xs font-mono-tabular">
                          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                            <span className="text-slate-400 block text-[10px]">PRODUCTIVITY GAIN</span>
                            <span className="text-emerald-400 font-bold">
                              {activeVideo.telemetryPreview.cycleTimeReduction}
                            </span>
                          </div>
                          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                            <span className="text-slate-400 block text-[10px]">REPEATABILITY</span>
                            <span className="text-sky-400 font-bold">
                              {activeVideo.telemetryPreview.positioningAccuracy}
                            </span>
                          </div>
                          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                            <span className="text-slate-400 block text-[10px]">OPERATING LOAD</span>
                            <span className="text-amber-400 font-bold">
                              {activeVideo.telemetryPreview.spindleLoad}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-6 bg-slate-900 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                        <span>Model Shown: {activeVideo.machineModel}</span>
                        <span>Location: {activeVideo.location}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {activeVideo.title}
                      </h3>
                      <p className="text-sm text-slate-200 leading-relaxed">{activeVideo.summary}</p>
                      <div className="space-y-1.5 pt-2">
                        <div className="text-xs font-bold text-emerald-400">
                          Key Highlights:
                        </div>
                        {activeVideo.keyTakeaways.map((point, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Select Technical Walkthrough ({VIDEOS_DATABASE.length} Available)
                    </div>
                    {VIDEOS_DATABASE.map((vid, idx) => {
                      const isSelected = vid.id === activeVideo.id;
                      return (
                        <button
                          key={vid.id}
                          type="button"
                          onClick={() => {
                            setActiveVideo(vid);
                            setIsPlayingSimulation(true);
                          }}
                          className={`w-full text-left p-4 rounded-lg border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-slate-100 dark:bg-slate-800 border-[#1E2985] dark:border-emerald-400'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                            <span className="font-mono-tabular font-semibold text-[#1E2985] dark:text-emerald-400">
                              0{idx + 1} · {vid.category}
                            </span>
                            <span className="font-mono-tabular">{vid.duration}</span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {vid.title}
                          </h4>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                            {vid.location} · {vid.telemetryPreview.cycleTimeReduction}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* ================================================================
                SECTION 4: CNC RETROFIT & MAINTENANCE BOOKING
                ================================================================ */}
            <RetrofitBookingSection />

            {/* ================================================================
                SECTION 5: SERVICES (CNC RETROFITTING & MACHINE MAINTENANCE)
                ================================================================ */}
            <section
              id="services"
              className="py-16 lg:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"
            >
              <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div>
                  <div className="text-xs font-semibold text-[#0D5C2B] dark:text-emerald-400 mb-1">
                    Field Engineering Division · KH Enterprises (Pvt) Ltd
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Specialized CNC Retrofitting &amp; Industrial Maintenance
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                    Our mobile automation engineers restore legacy Japanese, European, and Taiwanese machine tools to sub-micron factory tolerances with complete mechanical, electrical, and PLC integration.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {SERVICES_DATABASE.map((service) => (
                    <div
                      key={service.id}
                      className="flex flex-col justify-between rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono-tabular">
                          <span className="font-bold text-[#1E2985] dark:text-emerald-400">
                            {service.indexNumber}.{' '}
                            {service.id === 'srv-retrofit'
                              ? 'RETROFITTING SERVICES'
                              : 'MAINTENANCE SERVICES'}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">
                            Turnaround: {service.turnaroundTime}
                          </span>
                        </div>

                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {service.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {service.subtitle}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {service.summary}
                        </p>

                        <div className="space-y-2 pt-2">
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Scope of Engineering Deliverables:
                          </div>
                          {service.deliverables.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#0D5C2B] dark:text-emerald-400 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-3.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Supported Legacy Controls &amp; Systems:
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">
                            {service.supportedBrands.join('  ·  ')}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <span className="text-[11px] text-slate-500 block">
                            {service.id === 'srv-maintenance'
                              ? 'Annual Contract Pricing'
                              : 'Service Package Pricing'}
                          </span>
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                            Call for Price
                          </span>
                        </div>
                        {service.id === 'srv-retrofit' ? (
                          <button
                            type="button"
                            onClick={() => handleTopNavNavigate('application')}
                            className="px-5 py-2.5 rounded-[5px] bg-[#0068AD] hover:bg-[#00558F] text-white text-xs sm:text-sm font-normal transition-colors cursor-pointer"
                          >
                            Book Now
                          </button>
                        ) : (
                          <a
                            href={`https://wa.me/923214800265?text=${encodeURIComponent(
                              `Assalam-o-Alaikum SZGH Pakistan,\n\nWe would like to *Apply for the Annual CNC Section Maintenance & Equipment Replacement Plan* for our factory.\n\nPlease share contract details and schedule an initial factory inspection.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-5 py-2.5 rounded-[5px] bg-[#E77817] hover:bg-[#d1680f] text-white text-xs sm:text-sm font-normal transition-colors cursor-pointer"
                          >
                            Apply for Annual Maintenance Plan
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ================================================================
                SECTION 5: OFFICIAL CONTACT US & SCAN-TO-CONNECT QR HUB
                ================================================================ */}
            <section
              id="contact"
              className="py-16 bg-slate-100/80 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800"
            >
              <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0068AD] dark:text-sky-400 mb-2">
                    OFFICIAL CORPORATE &amp; TECHNICAL CONTACT DESK
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Contact SZGH Pakistan
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                    Connect directly with our CNC automation engineers and B2B sales desk via phone, email, WhatsApp, WeChat, Instagram, or Facebook.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  {/* Left Column: Direct Contact Details & Business Hours */}
                  <div className="lg:col-span-5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col justify-between shadow-sm">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 pb-5 border-b border-slate-200 dark:border-slate-800">
                        <div className="h-14 w-auto px-2.5 py-1 rounded bg-white border border-slate-200 flex items-center justify-center">
                          <img
                            src="/assets/aistudio/szgh-pakistan-logo_baed6be7.png"
                            alt="SZGH Pakistan Logo"
                            className="h-12 w-auto object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                            SZGH PAKISTAN
                          </div>
                          <div className="text-xs font-semibold text-[#0068AD] dark:text-sky-400">
                            BY KH ENTERPRISES (PVT) LTD
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5">
                        {/* Email */}
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-[5px] bg-[#0068AD]/10 dark:bg-[#0068AD]/20 text-[#0068AD] dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              Official Email
                            </div>
                            <a
                              href="mailto:info@szghpakistan.com"
                              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-[#0068AD] dark:hover:text-sky-400 transition-colors break-all"
                            >
                              info@szghpakistan.com
                            </a>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              For B2B quotations, technical inquiries &amp; proforma invoices
                            </p>
                          </div>
                        </div>

                        {/* Telephone / Mobile Numbers */}
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-[5px] bg-[#E77817]/10 dark:bg-[#E77817]/20 text-[#E77817] flex items-center justify-center shrink-0 mt-0.5">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              Telephone &amp; Direct Helpline
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-0.5">
                              <a
                                href="tel:+923214800265"
                                className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-[#0068AD] dark:hover:text-sky-400 transition-colors"
                              >
                                +92 321 4800265
                              </a>
                              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
                              <a
                                href="tel:+923212741106"
                                className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-[#0068AD] dark:hover:text-sky-400 transition-colors"
                              >
                                +92 321 2741106
                              </a>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              Direct sales, CNC retrofit booking &amp; engineering support
                            </p>
                          </div>
                        </div>

                        {/* Business Hours */}
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-[5px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              Business Hours
                            </div>
                            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                              Mon–Sat: 9:00 AM – 8:00 PM
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              Pakistan Standard Time (PKT) · Sunday Closed
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href="https://wa.me/923214800265"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[5px] bg-[#0068AD] hover:bg-[#00558F] text-white text-xs sm:text-sm font-normal transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        WhatsApp (+92 321 4800265)
                      </a>
                      <a
                        href="mailto:info@szghpakistan.com"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[5px] bg-[#E77817] hover:bg-[#d1680f] text-white text-xs sm:text-sm font-normal transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Email Us Directly
                      </a>
                    </div>
                  </div>

                  {/* Right Column: 4 Readjusted Professional QR Code Graphics */}
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      {
                        id: 'whatsapp',
                        title: 'WhatsApp Official',
                        subtitle: '+92 321 4800265',
                        badge: 'Instant Engineering Chat',
                        image: '/assets/qr-whatsapp.png',
                        href: 'https://wa.me/qr/MFFMZ3VILZJKL1',
                      },
                      {
                        id: 'wechat',
                        title: 'WeChat Official',
                        subtitle: '+92 321 4800265',
                        badge: 'B2B Technical Representative',
                        image: '/assets/qr-wechat.png',
                      },
                      {
                        id: 'instagram',
                        title: 'Instagram Official',
                        subtitle: '@SZGHPAKISTAN',
                        badge: 'Follow Machine Demos & Reels',
                        image: '/assets/qr-instagram.png',
                        href: 'https://www.instagram.com/szghpakistan?exln=MWtkbGpyaWdqOHoweQ==',
                      },
                      {
                        id: 'facebook',
                        title: 'Facebook Official',
                        subtitle: 'SZGH Pakistan',
                        badge: 'Official Corporate Page',
                        image: '/assets/qr-facebook.png',
                        href: 'https://www.facebook.com/share/p/1CQH67EBnE/',
                      },
                    ].map((qr) => (
                      <div
                        key={qr.id}
                        className="rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between shadow-sm hover:border-[#0068AD] dark:hover:border-sky-500 transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => setActiveQrLightbox(qr)}
                          className="group relative w-full rounded bg-slate-50 dark:bg-slate-950 p-2 flex items-center justify-center overflow-hidden cursor-pointer border border-slate-100 dark:border-slate-800"
                          title={`Click to enlarge ${qr.title} QR Code`}
                        >
                          <img
                            src={qr.image}
                            alt={`${qr.title} - ${qr.subtitle} QR Code`}
                            className="w-full max-w-[230px] h-auto object-contain rounded transition-transform duration-200 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </button>

                        <div className="pt-3 mt-2 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                              {qr.title}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {qr.subtitle}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setActiveQrLightbox(qr)}
                              className="px-3 py-1.5 rounded-[5px] bg-[#0068AD] hover:bg-[#00558F] text-white text-xs font-normal transition-colors cursor-pointer"
                            >
                              Enlarge QR
                            </button>
                            {qr.href && (
                              <a
                                href={qr.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-[5px] bg-[#E77817] hover:bg-[#d1680f] text-white transition-colors"
                                title={`Open ${qr.title}`}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* ================================================================
          CORPORATE FOOTER WITH INTEGRATED COMPANY LOGO, CONTACT & QR CODES
          ================================================================ */}
      <footer id="footer-contact" className="bg-slate-950 text-slate-400 border-t border-slate-800">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
            {/* Column 1: Logo & Contact Information */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-16 w-auto px-2.5 py-1 rounded bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src="/assets/aistudio/szgh-pakistan-logo_baed6be7.png"
                    alt="SZGH Pakistan - KH Enterprises Pvt Ltd Logo"
                    className="h-14 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="text-base font-extrabold text-white tracking-tight">
                    SZGH PAKISTAN
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold">
                    BY KH ENTERPRISES (PVT) LTD
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Official Pakistan distributor and turnkey integration partner for SZGH CNC Controllers, AC Servo Motors &amp; Drives, CNC Machine Tools, and 6-Axis Industrial Robots. All products backed by a 1 Year Official Warranty.
              </p>

              {/* Footer Direct Contact Block */}
              <div className="pt-2 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#E77817] shrink-0" />
                  <span className="text-slate-400">Email:</span>
                  <a
                    href="mailto:info@szghpakistan.com"
                    className="font-semibold text-white hover:text-sky-400 transition-colors"
                  >
                    info@szghpakistan.com
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-[#0068AD] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400">Tel: </span>
                    <a
                      href="tel:+923214800265"
                      className="font-semibold text-white hover:text-sky-400 transition-colors"
                    >
                      +92 321 4800265
                    </a>
                    <span className="text-slate-600 mx-1.5">,</span>
                    <a
                      href="tel:+923212741106"
                      className="font-semibold text-white hover:text-sky-400 transition-colors"
                    >
                      +92 321 2741106
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-400">Business Hours:</span>
                  <span className="font-semibold text-white">
                    Mon–Sat: 9:00 AM – 8:00 PM
                  </span>
                </div>
              </div>
              {/* Official Social Media Clickable Icons in Lower Left Corner */}
              <div className="pt-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Follow &amp; Connect With Us
                </div>
                <div className="flex items-center gap-2.5">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/qr/MFFMZ3VILZJKL1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-[5px] bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 hover:border-[#25D366] flex items-center justify-center transition-all duration-150 cursor-pointer group shadow-sm"
                    title="Connect on WhatsApp (https://wa.me/qr/MFFMZ3VILZJKL1)"
                    aria-label="SZGH Pakistan WhatsApp"
                  >
                    <svg
                      className="w-5 h-5 fill-current transition-transform group-hover:scale-110"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.031 2C6.516 2 2.031 6.484 2.031 12c0 1.984.582 3.844 1.586 5.422L2 22l4.75-1.547A9.92 9.92 0 0 0 12.03 22c5.516 0 10-4.484 10-10s-4.484-10-10-10zm0 18.281a8.23 8.23 0 0 1-4.219-1.156l-.304-.18-2.82.918.941-2.75-.195-.312A8.257 8.257 0 0 1 3.75 12c0-4.57 3.71-8.281 8.281-8.281s8.281 3.711 8.281 8.281-3.71 8.281-8.281 8.281zm4.539-6.203c-.25-.125-1.469-.727-1.695-.812-.227-.086-.39-.125-.555.125-.164.25-.648.812-.797.984-.148.164-.297.188-.547.062s-1.055-.39-2.012-1.242c-.746-.664-1.25-1.484-1.398-1.734-.148-.25-.016-.387.109-.508.113-.113.25-.297.375-.445.125-.149.164-.25.25-.414.082-.164.043-.313-.02-.438s-.555-1.34-.762-1.832c-.203-.48-.41-.414-.555-.422h-.476c-.164 0-.438.062-.668.312s-.883.863-.883 2.102.902 2.438 1.027 2.605c.125.164 1.774 2.711 4.3 3.797.602.258 1.07.414 1.438.531.605.192 1.156.164 1.59.102.484-.07 1.469-.602 1.68-1.18.207-.578.207-1.078.144-1.18-.062-.101-.226-.164-.476-.289z" />
                    </svg>
                  </a>

                  {/* WeChat */}
                  <button
                    type="button"
                    onClick={() =>
                      setActiveQrLightbox({
                        id: 'wechat',
                        title: 'WeChat Official',
                        subtitle: '+92 321 4800265 (SZGH Pakistan)',
                        badge: 'B2B Technical Representative',
                        image: '/assets/qr-wechat.png',
                      })
                    }
                    className="w-9 h-9 rounded-[5px] bg-[#07C160]/15 hover:bg-[#07C160] text-[#07C160] hover:text-white border border-[#07C160]/30 hover:border-[#07C160] flex items-center justify-center transition-all duration-150 cursor-pointer group shadow-sm"
                    title="WeChat: +923214800265 (Click to scan QR code)"
                    aria-label="SZGH Pakistan WeChat"
                  >
                    <svg
                      className="w-5 h-5 fill-current transition-transform group-hover:scale-110"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.691 2.188C3.891 2.188 0 5.477 0 9.531c0 2.32 1.285 4.383 3.281 5.727-.145.746-.738 2.695-.762 2.789-.043.152.023.305.164.367.066.027.137.039.207.039.09 0 .18-.027.258-.082.027-.02 1.957-1.34 2.898-1.98.832.227 1.719.352 2.645.352.324 0 .64-.02.953-.055-.547-1.14-.852-2.422-.852-3.777 0-4.52 4.148-8.188 9.262-8.188.355 0 .703.023 1.05.066C17.652 4.215 13.504 2.188 8.691 2.188zm-2.437 4.27c.652 0 1.18.527 1.18 1.18 0 .648-.528 1.176-1.18 1.176-.648 0-1.176-.528-1.176-1.176 0-.653.528-1.18 1.176-1.18zm5.074 0c.648 0 1.18.527 1.18 1.18 0 .648-.532 1.176-1.18 1.176-.653 0-1.18-.528-1.18-1.176 0-.653.527-1.18 1.18-1.18zm4.777 3.328c-4.144 0-7.508 2.844-7.508 6.352 0 1.996 1.094 3.777 2.809 4.93-.125.645-.637 2.32-.656 2.402-.039.133.02.266.14.32.059.024.118.036.18.036.078 0 .156-.024.223-.071.023-.016 1.684-1.152 2.492-1.707.723.199 1.488.312 2.293.312 4.144 0 7.508-2.848 7.508-6.352s-3.364-6.352-7.508-6.352zm-2.187 3.684c.562 0 1.02.457 1.02 1.02 0 .562-.458 1.02-1.02 1.02-.563 0-1.02-.458-1.02-1.02 0-.563.457-1.02 1.02-1.02zm4.375 0c.562 0 1.02.457 1.02 1.02 0 .562-.458 1.02-1.02 1.02-.563 0-1.02-.458-1.02-1.02 0-.563.457-1.02 1.02-1.02z" />
                    </svg>
                  </button>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/szghpakistan?exln=MWtkbGpyaWdqOHoweQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-[5px] bg-[#E4405F]/15 hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-[#E4405F] hover:text-white border border-[#E4405F]/30 hover:border-transparent flex items-center justify-center transition-all duration-150 cursor-pointer group shadow-sm"
                    title="Follow on Instagram (@szghpakistan)"
                    aria-label="SZGH Pakistan Instagram"
                  >
                    <svg
                      className="w-5 h-5 fill-current transition-transform group-hover:scale-110"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/share/p/1CQH67EBnE/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-[5px] bg-[#1877F2]/15 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30 hover:border-[#1877F2] flex items-center justify-center transition-all duration-150 cursor-pointer group shadow-sm"
                    title="Visit Facebook Page (https://www.facebook.com/share/p/1CQH67EBnE/)"
                    aria-label="SZGH Pakistan Facebook"
                  >
                    <svg
                      className="w-5 h-5 fill-current transition-transform group-hover:scale-110"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Storefront & Sections */}
            <div className="lg:col-span-2 space-y-2.5 text-xs">
              <div className="font-bold text-white uppercase tracking-wider">
                Storefront &amp; Sections
              </div>
              <ul className="space-y-2">
                {(
                  [
                    { id: 'home', label: 'Home' },
                    { id: 'products', label: 'Products' },
                    { id: 'videos', label: 'Videos' },
                    { id: 'application', label: 'Retrofit Booking' },
                    { id: 'services', label: 'Services' },
                    { id: 'contact', label: 'Contact' },
                  ] as { id: NavSection; label: string }[]
                ).map((sec) => (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTopNavNavigate(sec.id);
                      }}
                      className="hover:text-white transition-colors"
                    >
                      {sec.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Direct Store Sub-Pages */}
            <div className="lg:col-span-3 space-y-2.5 text-xs">
              <div className="font-bold text-white uppercase tracking-wider">
                Direct Store Sub-Pages
              </div>
              <ul className="space-y-2">
                {HERO_CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => handleOpenCategorySubpage(cat.id)}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      {cat.number}. {cat.title} — {cat.shortSubtitle}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Official Social & Messaging QR Codes in Footer */}
            <div className="lg:col-span-3 space-y-3 text-xs">
              <div className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#E77817]" />
                Scan Official QR Codes
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'whatsapp',
                    title: 'WhatsApp',
                    subtitle: '+92 321 4800265',
                    badge: 'Instant Engineering Chat',
                    image: '/assets/qr-whatsapp.png',
                    href: 'https://wa.me/qr/MFFMZ3VILZJKL1',
                  },
                  {
                    id: 'wechat',
                    title: 'WeChat',
                    subtitle: 'SZGH Pakistan',
                    badge: 'B2B Technical Desk',
                    image: '/assets/qr-wechat.png',
                  },
                  {
                    id: 'instagram',
                    title: 'Instagram',
                    subtitle: '@SZGHPAKISTAN',
                    badge: 'Official Instagram',
                    image: '/assets/qr-instagram.png',
                    href: 'https://www.instagram.com/szghpakistan?exln=MWtkbGpyaWdqOHoweQ==',
                  },
                  {
                    id: 'facebook',
                    title: 'Facebook',
                    subtitle: 'SZGH Pakistan',
                    badge: 'Official Facebook Page',
                    image: '/assets/qr-facebook.png',
                    href: 'https://www.facebook.com/share/p/1CQH67EBnE/',
                  },
                ].map((qr) => (
                  <button
                    key={qr.id}
                    type="button"
                    onClick={() => setActiveQrLightbox(qr)}
                    className="group rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-[#0068AD] p-2 flex flex-col items-center text-center transition-colors cursor-pointer"
                    title={`Click to enlarge ${qr.title} QR Code`}
                  >
                    <img
                      src={qr.image}
                      alt={`${qr.title} QR Code`}
                      className="w-24 h-auto rounded bg-white p-0.5 object-contain"
                      loading="lazy"
                    />
                    <span className="text-[11px] font-bold text-white mt-1.5 group-hover:text-sky-400">
                      {qr.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div
              onDoubleClick={handleSecretAdminAccess}
              className="select-none"
            >
              © {new Date().getFullYear()} SZGH Pakistan — KH Enterprises (Pvt) Ltd. All rights reserved.
            </div>
            <div>Lahore · Sialkot · Gujranwala · Karachi · Faisalabad</div>
          </div>
        </div>
      </footer>

      {/* Enlarged QR Code Scanner Lightbox Modal */}
      {activeQrLightbox && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveQrLightbox(null)}
        >
          <div
            className="relative w-full max-w-md rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {activeQrLightbox.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeQrLightbox.subtitle} — {activeQrLightbox.badge}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveQrLightbox(null)}
                className="p-1.5 rounded-[5px] text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Close QR preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 rounded p-3 flex items-center justify-center border border-slate-200 dark:border-slate-800">
              <img
                src={activeQrLightbox.image}
                alt={`${activeQrLightbox.title} QR Code`}
                className="w-full max-h-[68vh] object-contain rounded"
              />
            </div>

            <div className="mt-4 flex items-center justify-end gap-2.5">
              {activeQrLightbox.href && (
                <a
                  href={activeQrLightbox.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[5px] bg-[#E77817] hover:bg-[#d1680f] text-white text-xs sm:text-sm font-normal transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Direct Link
                </a>
              )}
              <button
                type="button"
                onClick={() => setActiveQrLightbox(null)}
                className="px-4 py-2 rounded-[5px] bg-[#0068AD] hover:bg-[#00558F] text-white text-xs sm:text-sm font-normal transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Product Description & Features Modal */}
      <ProductDetailModal
        product={selectedProductModal}
        onClose={() => setSelectedProductModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-Over Shopping Cart & B2B Proforma Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        currentUser={currentUser}
        onSignIn={handleGoogleSignIn}
        onOrderSubmitted={handleOrderSubmitted}
      />

      {/* Live Firebase Inventory, Excel Tracker & Orders Manager Modal (Admin Only) */}
      <AdminStockModal
        isOpen={adminStockModalOpen && isAuthorizedAdmin}
        onClose={() => setAdminStockModalOpen(false)}
        products={liveProducts}
        currentUser={currentUser}
        syncedProductIds={syncedProductIds}
        customProductIds={customProductIds}
        orders={combinedOrders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      {/* Persistent WhatsApp Live Chat Icon Across All Pages */}
      <WhatsAppFloatingChat
        whatsappNumber="+923214800265"
        contextLabel={
          selectedProductModal
            ? `Model: ${selectedProductModal.modelNumber}`
            : activeSubpageCategory
            ? `Category: ${activeSubpageCategory}`
            : 'Main Storefront'
        }
      />
    </div>
  );
}
