/**
 * Cached menu data from Loyverse sync (localStorage).
 */

import type { LoyverseCategory, LoyverseItem, LoyverseModifier } from "@/lib/loyverse";

const MENU_CACHE_KEY = "ldm_menu_cache";

export interface MenuCache {
  categories: LoyverseCategory[];
  items: LoyverseItem[];
  modifiers: LoyverseModifier[];
  syncedAt: string;
  storeId?: string;
  counts: {
    categories: number;
    items: number;
    modifiers: number;
  };
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function getMenuCache(): MenuCache | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(MENU_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MenuCache;
  } catch {
    return null;
  }
}

export function saveMenuCache(cache: MenuCache) {
  if (!isBrowser()) return;
  localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(cache));
}

export function clearMenuCache() {
  if (!isBrowser()) return;
  localStorage.removeItem(MENU_CACHE_KEY);
}

export function groupItemsByCategory(
  categories: LoyverseCategory[],
  items: LoyverseItem[]
): Array<{ category: LoyverseCategory | null; items: LoyverseItem[] }> {
  const byCat = new Map<string | null, LoyverseItem[]>();

  for (const item of items) {
    const key = item.category_id || null;
    if (!byCat.has(key)) byCat.set(key, []);
    byCat.get(key)!.push(item);
  }

  const groups: Array<{ category: LoyverseCategory | null; items: LoyverseItem[] }> = [];

  for (const cat of categories) {
    const list = byCat.get(cat.id) || [];
    if (list.length > 0) {
      groups.push({ category: cat, items: list });
      byCat.delete(cat.id);
    }
  }

  const uncategorized = byCat.get(null) || [];
  for (const [key, list] of byCat) {
    if (key === null) continue;
    if (list.length > 0) {
      groups.push({
        category: { id: key, name: "قسم غير معروف" },
        items: list,
      });
    }
  }
  if (uncategorized.length > 0) {
    groups.push({ category: null, items: uncategorized });
  }

  return groups;
}

export function getItemPrice(item: LoyverseItem, storeId?: string): number | null {
  const variants = item.variants || [];
  if (variants.length === 0) return null;

  if (storeId) {
    for (const v of variants) {
      const storePrice = v.stores?.find((s) => s.store_id === storeId);
      if (storePrice?.price != null) return storePrice.price;
    }
  }

  const first = variants[0];
  if (first.price != null) return first.price;
  if (first.default_price != null) return first.default_price;
  return null;
}
