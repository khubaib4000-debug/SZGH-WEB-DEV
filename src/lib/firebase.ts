import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  Firestore,
  doc,
  getDoc,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let dbInstance: Firestore;
try {
  dbInstance = initializeFirestore(
    app,
    {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    },
    firebaseConfig.firestoreDatabaseId
  );
} catch {
  // Fallback when Firestore was already initialized on the existing app instance (e.g. HMR)
  dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db = dbInstance;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const ADMIN_EMAILS = ['khubaib4000@gmail.com', 'grnoman786@gmail.com'];

export const FIRESTORE_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

const IDB_NAME = 'sdgh_firestore_cache_v1';
const IDB_STORE_NAME = 'cache_entries';
const IDB_VERSION = 1;

interface CacheEnvelope<T> {
  key: string;
  cachedAt: number;
  data: T;
}

const memoryCache = new Map<string, CacheEnvelope<unknown>>();
const inFlightFirestoreReads = new Map<string, Promise<unknown>>();
let idbOpenPromise: Promise<IDBDatabase | null> | null = null;

// Clean up any legacy oversized sessionStorage cache entries from earlier versions
try {
  sessionStorage.removeItem('sdgh_firestore_active_manifest_v1');
  sessionStorage.removeItem('sdgh_firestore_inventory_docs_v1');
} catch {
  // Ignore restricted storage access
}

function openCacheDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') {
    return Promise.resolve(null);
  }
  if (idbOpenPromise) {
    return idbOpenPromise;
  }

  idbOpenPromise = new Promise<IDBDatabase | null>((resolve) => {
    try {
      const request = indexedDB.open(IDB_NAME, IDB_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(IDB_STORE_NAME)) {
          database.createObjectStore(IDB_STORE_NAME, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => {
        const database = request.result;
        database.onversionchange = () => {
          database.close();
          idbOpenPromise = null;
        };
        resolve(database);
      };
      request.onerror = () => {
        idbOpenPromise = null;
        resolve(null);
      };
      request.onblocked = () => {
        resolve(null);
      };
    } catch {
      idbOpenPromise = null;
      resolve(null);
    }
  });

  return idbOpenPromise;
}

export async function readIdbCache<T>(
  key: string,
  ttlMs: number = FIRESTORE_CACHE_TTL_MS
): Promise<T | null> {
  const now = Date.now();
  const memEntry = memoryCache.get(key);
  if (memEntry) {
    if (now - memEntry.cachedAt < ttlMs) {
      return memEntry.data as T;
    }
    memoryCache.delete(key);
  }

  const database = await openCacheDb();
  if (!database) return null;

  return new Promise<T | null>((resolve) => {
    try {
      const tx = database.transaction(IDB_STORE_NAME, 'readonly');
      const store = tx.objectStore(IDB_STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        const record = req.result as CacheEnvelope<T> | undefined;
        if (
          record &&
          typeof record.cachedAt === 'number' &&
          now - record.cachedAt < ttlMs
        ) {
          memoryCache.set(key, record as CacheEnvelope<unknown>);
          resolve(record.data);
          return;
        }
        resolve(null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function writeIdbCache<T>(key: string, data: T): Promise<void> {
  const envelope: CacheEnvelope<T> = {
    key,
    cachedAt: Date.now(),
    data,
  };
  memoryCache.set(key, envelope as CacheEnvelope<unknown>);

  const database = await openCacheDb();
  if (!database) return;

  await new Promise<void>((resolve) => {
    try {
      const tx = database.transaction(IDB_STORE_NAME, 'readwrite');
      const store = tx.objectStore(IDB_STORE_NAME);
      store.put(envelope);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function readManyIdbCache<T>(
  keys: string[],
  ttlMs: number = FIRESTORE_CACHE_TTL_MS
): Promise<Map<string, T>> {
  const results = new Map<string, T>();
  if (keys.length === 0) return results;

  const now = Date.now();
  const missingKeys: string[] = [];

  for (const key of keys) {
    const memEntry = memoryCache.get(key);
    if (memEntry) {
      if (now - memEntry.cachedAt < ttlMs) {
        results.set(key, memEntry.data as T);
        continue;
      }
      memoryCache.delete(key);
    }
    missingKeys.push(key);
  }

  if (missingKeys.length === 0) return results;

  const database = await openCacheDb();
  if (!database) return results;

  await new Promise<void>((resolve) => {
    try {
      const tx = database.transaction(IDB_STORE_NAME, 'readonly');
      const store = tx.objectStore(IDB_STORE_NAME);
      let remaining = missingKeys.length;

      for (const key of missingKeys) {
        const req = store.get(key);
        req.onsuccess = () => {
          const record = req.result as CacheEnvelope<T> | undefined;
          if (
            record &&
            typeof record.cachedAt === 'number' &&
            now - record.cachedAt < ttlMs
          ) {
            memoryCache.set(key, record as CacheEnvelope<unknown>);
            results.set(key, record.data);
          }
          remaining -= 1;
          if (remaining === 0) resolve();
        };
        req.onerror = () => {
          remaining -= 1;
          if (remaining === 0) resolve();
        };
      }
    } catch {
      resolve();
    }
  });

  return results;
}

export function isBase64ImageDataUrl(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    value.trim().toLowerCase().startsWith('data:image/')
  );
}

export function filterNonBase64Images(images: unknown): string[] | undefined {
  if (!Array.isArray(images)) return undefined;
  const cleaned = images
    .map((img) => (typeof img === 'string' ? img.trim() : ''))
    .filter((img) => img.length > 0 && !isBase64ImageDataUrl(img))
    .slice(0, 8);
  return cleaned.length > 0 ? cleaned : undefined;
}

export const STOCK_SUMMARY_DOC_ID = 'stock_summary';
export const STOCK_SUMMARY_DOC_PATH = 'catalog_index/stock_summary';
export const STOCK_SUMMARY_IDB_CACHE_KEY = 'catalog_index:stock_summary_v1';

const STOCK_SUMMARY_VERSION_HEADER = 'v1:stock_summary';
const STOCK_SUMMARY_CHUNK_SIZE = 8;

export interface StockSummaryEntry {
  qty: number;
  price: number;
  stockStatus?: 'In Stock' | 'Low Stock' | 'Pre-Order';
  updatedAt: number;
  images?: string[];
  defaultImageIndex?: number;
}

export type StockSummaryMap = Record<string, StockSummaryEntry>;

function sanitizeStockSummaryEntry(raw: unknown): StockSummaryEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  const qtyNum = typeof obj.qty === 'number' ? obj.qty : Number(obj.qty);
  const priceNum =
    typeof obj.price === 'number' ? obj.price : Number(obj.price);
  if (!Number.isFinite(qtyNum) || !Number.isFinite(priceNum)) return null;

  const qty = Math.max(0, Math.min(100000, Math.round(qtyNum)));
  const price = Math.max(0, Math.min(1000000000, Math.round(priceNum)));
  const stockStatus: 'In Stock' | 'Low Stock' | 'Pre-Order' =
    obj.stockStatus === 'In Stock' ||
    obj.stockStatus === 'Low Stock' ||
    obj.stockStatus === 'Pre-Order'
      ? obj.stockStatus
      : qty <= 0
      ? 'Pre-Order'
      : qty <= 3
      ? 'Low Stock'
      : 'In Stock';

  const updatedAt =
    typeof obj.updatedAt === 'number' && Number.isFinite(obj.updatedAt)
      ? obj.updatedAt
      : Date.now();
  const images = filterNonBase64Images(obj.images);
  const defaultImageIndex =
    typeof obj.defaultImageIndex === 'number' &&
    Number.isFinite(obj.defaultImageIndex)
      ? Math.max(0, Math.min(7, Math.round(obj.defaultImageIndex)))
      : undefined;

  const entry: StockSummaryEntry = {
    qty,
    price,
    stockStatus,
    updatedAt,
  };
  if (images) entry.images = images;
  if (defaultImageIndex !== undefined) {
    entry.defaultImageIndex = defaultImageIndex;
  }
  return entry;
}

export function sanitizeStockSummaryMap(map: StockSummaryMap): StockSummaryMap {
  const cleaned: StockSummaryMap = {};
  for (const [productId, rawEntry] of Object.entries(map)) {
    if (!productId || !productId.trim()) continue;
    const entry = sanitizeStockSummaryEntry(rawEntry);
    if (entry) {
      cleaned[productId] = entry;
    }
  }
  return cleaned;
}

/**
 * Encodes StockSummaryMap into the catalog_index/{manifestId} `customProductIds` string[] schema
 * validated by firestore.rules (index 0 <= 128 chars, total list <= 1000 items, zero Base64 blobs).
 */
function encodeStockSummaryEntries(summaryMap: StockSummaryMap): string[] {
  const sanitized = sanitizeStockSummaryMap(summaryMap);
  const pairs = Object.entries(sanitized);
  if (pairs.length === 0) {
    return [STOCK_SUMMARY_VERSION_HEADER];
  }

  const chunks: string[] = [STOCK_SUMMARY_VERSION_HEADER];
  for (let i = 0; i < pairs.length; i += STOCK_SUMMARY_CHUNK_SIZE) {
    const slice = pairs.slice(i, i + STOCK_SUMMARY_CHUNK_SIZE);
    chunks.push(JSON.stringify(slice));
  }
  return chunks.slice(0, 1000);
}

export function parseStockSummaryDoc(
  data: Record<string, unknown>
): StockSummaryMap {
  const result: StockSummaryMap = {};

  // Format A: Rules-compliant customProductIds array starting with 'v1:stock_summary'
  if (Array.isArray(data.customProductIds)) {
    const items = data.customProductIds;
    const startIdx = items[0] === STOCK_SUMMARY_VERSION_HEADER ? 1 : 0;
    for (let i = startIdx; i < items.length; i++) {
      const rawItem = items[i];
      if (typeof rawItem !== 'string' || !rawItem.trim().startsWith('[') && !rawItem.trim().startsWith('{')) {
        continue;
      }
      try {
        const parsed = JSON.parse(rawItem);
        if (Array.isArray(parsed)) {
          for (const pair of parsed) {
            if (Array.isArray(pair) && typeof pair[0] === 'string') {
              const entry = sanitizeStockSummaryEntry(pair[1]);
              if (entry) result[pair[0]] = entry;
            }
          }
        } else if (parsed && typeof parsed === 'object' && typeof (parsed as { id?: unknown }).id === 'string') {
          const entry = sanitizeStockSummaryEntry(parsed);
          if (entry) result[(parsed as { id: string }).id] = entry;
        }
      } catch {
        // Skip malformed chunk
      }
    }
  }

  // Format B: Direct items/entries map fallback
  const directMap =
    (data.items && typeof data.items === 'object'
      ? (data.items as Record<string, unknown>)
      : null) ||
    (data.entries && typeof data.entries === 'object'
      ? (data.entries as Record<string, unknown>)
      : null);

  if (directMap) {
    for (const [productId, rawEntry] of Object.entries(directMap)) {
      const entry = sanitizeStockSummaryEntry(rawEntry);
      if (entry) result[productId] = entry;
    }
  }

  return result;
}

export async function readStockSummaryCached(
  forceNetwork = false
): Promise<StockSummaryMap> {
  if (!forceNetwork) {
    const cached = await readIdbCache<StockSummaryMap>(
      STOCK_SUMMARY_IDB_CACHE_KEY,
      FIRESTORE_CACHE_TTL_MS
    );
    if (cached !== null) {
      return cached;
    }
  }

  if (isFirestoreQuotaExceeded) {
    return {};
  }

  const snapshot = await dedupeFirestoreRead(STOCK_SUMMARY_DOC_PATH, () =>
    getDoc(doc(db, 'catalog_index', STOCK_SUMMARY_DOC_ID))
  );
  const parsed = snapshot.exists()
    ? parseStockSummaryDoc(snapshot.data() as Record<string, unknown>)
    : {};
  await writeIdbCache(STOCK_SUMMARY_IDB_CACHE_KEY, parsed);
  return parsed;
}

export async function writeStockSummaryToCloud(
  summaryMap: StockSummaryMap,
  adminUid: string
): Promise<StockSummaryMap> {
  if (isFirestoreQuotaExceeded) {
    throw new Error('resource-exhausted: Firestore daily quota exceeded.');
  }
  const sanitized = sanitizeStockSummaryMap(summaryMap);
  const encodedChunks = encodeStockSummaryEntries(sanitized);

  try {
    await setDoc(doc(db, 'catalog_index', STOCK_SUMMARY_DOC_ID), {
      manifestId: STOCK_SUMMARY_DOC_ID,
      customProductIds: encodedChunks,
      updatedBy: adminUid,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    if (isQuotaExceededFirestoreError(error)) {
      isFirestoreQuotaExceeded = true;
    }
    throw error;
  }

  await writeIdbCache(STOCK_SUMMARY_IDB_CACHE_KEY, sanitized);
  return sanitized;
}

export async function upsertStockSummaryEntries(
  partial: StockSummaryMap,
  adminUid: string
): Promise<StockSummaryMap> {
  if (isFirestoreQuotaExceeded) {
    throw new Error('resource-exhausted: Firestore daily quota exceeded.');
  }
  let existing: StockSummaryMap = {};
  try {
    existing = await readStockSummaryCached(false);
  } catch (error) {
    if (isQuotaExceededFirestoreError(error)) {
      isFirestoreQuotaExceeded = true;
      throw error;
    }
    existing = {};
  }
  const merged: StockSummaryMap = {
    ...existing,
    ...sanitizeStockSummaryMap(partial),
  };
  return writeStockSummaryToCloud(merged, adminUid);
}

export function dedupeFirestoreRead<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const existing = inFlightFirestoreReads.get(key);
  if (existing) {
    return existing as Promise<T>;
  }
  const promise = fetcher().finally(() => {
    inFlightFirestoreReads.delete(key);
  });
  inFlightFirestoreReads.set(key, promise);
  return promise;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let quotaWarningLogged = false;
export let isFirestoreQuotaExceeded = false;

export function isQuotaExceededFirestoreError(error: unknown): boolean {
  const msg =
    error instanceof Error ? error.message : String(error ?? '');
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code ?? '')
      : '';
  return (
    code === 'resource-exhausted' ||
    /quota limit exceeded|quota exceeded|resource-exhausted/i.test(msg)
  );
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): void {
  if (isQuotaExceededFirestoreError(error)) {
    isFirestoreQuotaExceeded = true;
    if (!quotaWarningLogged) {
      quotaWarningLogged = true;
      console.warn(
        'Firestore daily free read quota reached; using built-in catalog and local state until quota resets.'
      );
    }
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  if (operationType !== OperationType.GET) {
    throw new Error(JSON.stringify(errInfo));
  }
}

