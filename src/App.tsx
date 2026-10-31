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
} from 'lucide-react';
import {
  HERO_CATEGORIES,
  PRODUCTS_DATABASE,
  VIDEOS_DATABASE,
  SERVICES_DATABASE,
  ProductItem,
  ProductCategory,
  VideoPresentation,
  IOBoardOption,
  mergeProductsByModelAndAxes,
  isStandaloneIOBoardProduct,
  normalizeIOBoardModelNumber,
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

  // 3. Dedicated Category Store Sub-Page State (Opened when clicking any category or Products nav)
  const [activeSubpageCategory, setActiveSubpageCategory] = useState<
    ProductCategory | 'All' | null
  >(null);

  const [selectedProductModal, setSelectedProductModal] =
    useState<ProductItem | null>(null);

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
        images?: [string, string, string, string];
        modelNumber?: string;
        title?: string;
        category?: ProductCategory;
        subcategory?: string;
        description?: string;
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
                invoiceType:
                  d.invoiceType === 'Standard Commercial Receipt'
                    ? 'Standard Commercial Receipt'
                    : 'Official Tax Invoice (18% GST)',
                paymentMethod:
                  d.paymentMethod === 'Online Bank Transfer (UBL)'
                    ? 'Online Bank Transfer (UBL)'
                    : 'Cash on Pick Up (Lahore Facility)',
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
              const normalizedTuple: [string, string, string, string] | undefined =
                rawImages.length > 0
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
                      ? Math.max(0, Math.min(3, Math.round(data.defaultImageIndex)))
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
        return {
          ...item,
          title: deriveTitleFromDescription(item.description, item.title),
        };
      }
      const hasAnyCustomImage = override.images?.some((u) => u.trim().length > 0);
      const effectiveDesc =
        override.description !== undefined && override.description.trim().length > 0
          ? override.description
          : item.description;
      const effectiveTitle =
        override.title && override.title.trim().length > 0
          ? override.title.trim()
          : deriveTitleFromDescription(effectiveDesc, item.title);

      const resolvedModel = normalizeIOBoardModelNumber(
        override.modelNumber || item.modelNumber,
        effectiveDesc,
        effectiveTitle
      );
      const isIOBoard = isStandaloneIOBoardProduct({
        modelNumber: resolvedModel,
        description: effectiveDesc,
        title: effectiveTitle,
      });

      return {
        ...item,
        modelNumber: resolvedModel,
        title: effectiveTitle,
        category: override.category || item.category,
        subcategory:
          override.subcategory !== undefined
            ? override.subcategory
            : item.subcategory,
        description: effectiveDesc,
        stockCount: override.stockCount,
        stockStatus: override.stockStatus,
        inStock: override.stockCount > 0,
        price: override.price,
        hasIOBoardOption: isIOBoard ? false : item.hasIOBoardOption,
        defaultImageIndex:
          override.defaultImageIndex ?? item.defaultImageIndex ?? 0,
        images: hasAnyCustomImage && override.images ? override.images : item.images,
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
      const desc = override.description ?? '';
      const ttl = deriveTitleFromDescription(desc, override.title);
      const normalizedModel = normalizeIOBoardModelNumber(
        override.modelNumber,
        desc,
        ttl
      );
      const isIOBoard = isStandaloneIOBoardProduct({
        modelNumber: normalizedModel,
        description: desc,
        title: ttl,
        price: override.price,
      });

      customProducts.push({
        id: customId,
        modelNumber: normalizedModel,
        title: ttl,
        category: cat,
        subcategory: subcat,
        description: desc,
        features: desc
          ? [
              '1 Year Official SZGH Pakistan Replacement & Technical Support Warranty',
              'Ready Stock Dispatch from Lahore Warehouse Across Pakistan',
            ]
          : [],
        price: override.price,
        usdEstimate: override.price > 0 ? Math.max(1, Math.round(override.price / 278)) : 0,
        inStock: override.stockCount > 0,
        stockCount: override.stockCount,
        stockStatus: override.stockStatus,
        defaultImageIndex: override.defaultImageIndex ?? 0,
        warranty: '1 Year Official SZGH Pakistan Warranty',
        hasIOBoardOption: cat === 'Controllers' && !isIOBoard,
        images: override.images || ['', '', '', ''],
        imageLabels: [
          'Picture #1 View',
          'Picture #2 View',
          'Picture #3 View',
          'Picture #4 View',
        ],
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

    return [...customProducts, ...mergedBuiltIn];
  }, [cloudInventoryOverrides, customProductIds]);

  // Merge same model & number of axes into 1 product listing with Axis Selection Tabs
  const mergedCatalogProducts = useMemo(
    () => mergeProductsByModelAndAxes(liveProducts),
    [liveProducts]
  );

  const syncedProductIds = useMemo(
    () => new Set(Object.keys(cloudInventoryOverrides)),
    [cloudInventoryOverrides]
  );

  // Open Dedicated Category Store Sub-Page AND move top section bar to "Products"
  const handleOpenCategorySubpage = (category: ProductCategory | 'All') => {
    setActiveSection('products');
    setActiveSubpageCategory(category);
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Sticky Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleTopNavNavigate}
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
             (Opened when clicking any Category on Home Page or Products tab)
             ================================================================ */
          <CategoryStoreSubpage
            category={activeSubpageCategory}
            products={mergedCatalogProducts}
            onChangeCategory={(cat) => {
              setActiveSection('products');
              setActiveSubpageCategory(cat);
            }}
            onBackToMain={() => {
              setActiveSubpageCategory(null);
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
            {/* SECTION 1: HOME — SINGLE FULL-WINDOW LANDSCAPE COMPOSITE WITH 4 CLICKABLE PICTURES */}
            <section
              id="home"
              className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden bg-[#eef2f6] border-b border-slate-200 dark:border-slate-800 select-none"
            >
              {/* Unified Full-Window Landscape Picture Blending All 4 Clickable Product Photos */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#e5ebf1] via-[#f5f7fa] to-[#e2e8f0]">
                <div className="w-full h-full grid grid-cols-2 lg:grid-cols-4 items-center pt-36 pb-20 sm:pt-40 sm:pb-24 px-2 sm:px-6">
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
              <div className="relative z-10 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-7 sm:pt-10 text-center pointer-events-none">
                <p className="text-xs sm:text-sm font-semibold tracking-wider text-emerald-300 uppercase">
                  SZGH Pakistan · KH Enterprises (Pvt) Ltd
                </p>
                <h1 className="mt-1.5 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm text-balance">
                  Total Solution for CNC Systems &amp; Industrial Robots
                </h1>
                <p className="mt-2 text-xs sm:text-base text-slate-100 font-medium max-w-2xl mx-auto drop-shadow-xs">
                  Click any of the 4 product families below to open its dedicated store page
                </p>
              </div>

              {/* Bottom Clickable Category Strip Aligned Over the 4 Hardware Zones */}
              <div className="relative z-10 w-full border-t border-white/15 bg-slate-950/75 backdrop-blur-xs">
                <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
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
                        <div className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {cat.shortSubtitle}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* ================================================================
                SECTION 2: HOME PAGE — TOP 3 PERFORMING, VIEWED & SOLD PRODUCTS
                ================================================================ */}
            <section
              id="products"
              className="py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800"
            >
              <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D5C2B] dark:text-emerald-400 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>
                        Automatic Performance Ranking · Most Viewed &amp; Most Sold Hardware
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Top 3 Performing Industrial Products
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                      Automatically showcasing our top 3 best-performing, most viewed, and highest-selling systems. Multi-axis models are consolidated into single cards with Axes Selection Tabs.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenCategorySubpage('All')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#1E2985] hover:bg-[#161f69] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs cursor-pointer shrink-0"
                  >
                    <span>
                      Browse Full Catalog ({mergedCatalogProducts.length} Models · 6 Per Page)
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Category Navigation Bar (Moves Top Bar to Products & Opens Paginated Store) */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg bg-slate-200/75 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800">
                    <span className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      Open Category Pages (6 Products / Page):
                    </span>
                    {HERO_CATEGORIES.map((cat) => {
                      const count = mergedCatalogProducts.filter(
                        (p) => p.category === cat.id
                      ).length;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleOpenCategorySubpage(cat.id)}
                          className="px-3.5 py-2 rounded-md text-xs font-bold bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:bg-[#1E2985] hover:text-white dark:hover:bg-emerald-600 transition-colors border border-slate-300/80 dark:border-slate-800 cursor-pointer"
                        >
                          {cat.title} ({count}) →
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono-tabular">
                    Showing Top 3 of {mergedCatalogProducts.length} merged catalog listings
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
                            className="px-5 py-2.5 rounded-md bg-[#1E2985] hover:bg-[#151d63] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
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
                            className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
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
          </>
        )}
      </main>

      {/* ================================================================
          CORPORATE FOOTER WITH INTEGRATED COMPANY LOGO
          ================================================================ */}
      <footer id="contact" className="bg-slate-950 text-slate-400 border-t border-slate-800">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-auto px-2 py-1 rounded bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src="/assets/aistudio/szgh-pakistan-logo_baed6be7.png"
                    alt="SZGH Pakistan - KH Enterprises Pvt Ltd Logo"
                    className="h-10 w-auto object-contain"
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
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Official Pakistan distributor and turnkey integration partner for SZGH CNC Controllers, AC Servo Motors &amp; Drives, CNC Machine Tools, and 6-Axis Industrial Robots. All products backed by a 1 Year Official Warranty.
              </p>
            </div>

            <div className="lg:col-span-3 space-y-2.5 text-xs">
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

            <div className="lg:col-span-4 space-y-2.5 text-xs">
              <div className="font-bold text-white uppercase tracking-wider">
                Direct Store Sub-Pages
              </div>
              <ul className="space-y-2">
                {HERO_CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => handleOpenCategorySubpage(cat.id)}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {cat.number}. {cat.title} — {cat.shortSubtitle}
                    </button>
                  </li>
                ))}
              </ul>
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

      {/* Live Firebase Inventory, Excel Tracker & Orders Manager Modal */}
      <AdminStockModal
        isOpen={adminStockModalOpen}
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
