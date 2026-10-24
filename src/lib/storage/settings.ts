/**
 * Client-side storage for settings and stores.
 * Stage 3: localStorage. Later stages can migrate to a database.
 */

export const STORAGE_KEYS = {
  LOYVERSE_TOKEN: "ldm_loyverse_token",
  STORES: "ldm_stores",
} as const;

export interface LocalStore {
  id: string;
  name: string;
  slug: string;
  loyverseStoreId?: string;
  loyverseStoreName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function getLoyverseToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(STORAGE_KEYS.LOYVERSE_TOKEN);
}

export function setLoyverseToken(token: string) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.LOYVERSE_TOKEN, token.trim());
}

export function clearLoyverseToken() {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.LOYVERSE_TOKEN);
}

export function getStores(): LocalStore[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STORES);
    if (!raw) return [];
    return JSON.parse(raw) as LocalStore[];
  } catch {
    return [];
  }
}

export function saveStores(stores: LocalStore[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
}

export function addStore(
  data: Omit<LocalStore, "id" | "createdAt" | "updatedAt" | "isActive">
): LocalStore {
  const stores = getStores();
  const now = new Date().toISOString();
  const store: LocalStore = {
    ...data,
    id: crypto.randomUUID(),
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  stores.push(store);
  saveStores(stores);
  return store;
}

export function updateStore(id: string, patch: Partial<LocalStore>): LocalStore | null {
  const stores = getStores();
  const idx = stores.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  stores[idx] = {
    ...stores[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  saveStores(stores);
  return stores[idx];
}

export function deleteStore(id: string) {
  const stores = getStores().filter((s) => s.id !== id);
  saveStores(stores);
}

export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "store";
}
