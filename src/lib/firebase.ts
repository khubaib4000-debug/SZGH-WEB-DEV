import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  Firestore,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
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

