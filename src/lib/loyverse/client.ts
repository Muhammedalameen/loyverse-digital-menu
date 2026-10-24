/**
 * Loyverse API Client
 * Docs: https://developer.loyverse.com/docs/
 */

const LOYVERSE_API_BASE = "https://api.loyverse.com/v1.0";

export interface LoyverseStore {
  id: string;
  name: string;
  address?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country_code?: string;
  phone_number?: string;
  description?: string;
}

export interface LoyverseCategory {
  id: string;
  name: string;
  color?: string;
  created_at?: string;
  deleted_at?: string | null;
}

export interface LoyverseVariant {
  variant_id?: string;
  item_id?: string;
  sku?: string;
  barcode?: string;
  price?: number;
  cost?: number;
  default_pricing_type?: string;
  default_price?: number | null;
  stores?: Array<{ store_id: string; price?: number; available_for_sale?: boolean }>;
}

export interface LoyverseItem {
  id: string;
  handle?: string;
  item_name: string;
  description?: string;
  reference_id?: string;
  category_id?: string | null;
  track_stock?: boolean;
  sold_by_weight?: boolean;
  is_composite?: boolean;
  use_production?: boolean;
  primary_supplier_id?: string | null;
  tax_ids?: string[];
  modifiers_ids?: string[];
  modifier_ids?: string[];
  form?: string;
  color?: string;
  image_url?: string;
  option1_name?: string | null;
  option2_name?: string | null;
  option3_name?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  variants?: LoyverseVariant[];
}

export interface LoyverseModifierOption {
  id?: string;
  name: string;
  price?: number;
}

export interface LoyverseModifier {
  id: string;
  name: string;
  options?: LoyverseModifierOption[];
  created_at?: string;
  deleted_at?: string | null;
}

export class LoyverseClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken.trim();
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${LOYVERSE_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      let message = `Loyverse API Error (${res.status})`;
      try {
        const body = await res.json();
        if (body?.errors?.[0]?.details) message = body.errors[0].details;
        else if (body?.message) message = body.message;
      } catch {
        // ignore
      }
      throw new Error(message);
    }

    return res.json();
  }

  private async fetchAll<T>(endpoint: string, listKey: string, limit = 250): Promise<T[]> {
    const results: T[] = [];
    let cursor: string | undefined;

    do {
      const sep = endpoint.includes("?") ? "&" : "?";
      const url = `${endpoint}${sep}limit=${limit}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`;
      const data = (await this.request<Record<string, unknown>>(url)) as Record<string, unknown>;
      const page = (data[listKey] as T[]) || [];
      results.push(...page);
      cursor = (data.cursor as string) || undefined;
    } while (cursor);

    return results;
  }

  async testConnection(): Promise<{ ok: true; storesCount: number }> {
    const data = await this.getStores();
    return { ok: true, storesCount: data.stores?.length ?? 0 };
  }

  async getStores(): Promise<{ stores: LoyverseStore[] }> {
    return this.request<{ stores: LoyverseStore[] }>("/stores");
  }

  async getCategories(): Promise<LoyverseCategory[]> {
    return this.fetchAll<LoyverseCategory>("/categories", "categories");
  }

  async getItems(storeId?: string): Promise<LoyverseItem[]> {
    const base = storeId ? `/items?store_id=${encodeURIComponent(storeId)}` : "/items";
    return this.fetchAll<LoyverseItem>(base, "items");
  }

  async getModifiers(): Promise<LoyverseModifier[]> {
    return this.fetchAll<LoyverseModifier>("/modifiers", "modifiers");
  }

  async syncMenu(storeId?: string) {
    const [categories, items, modifiers] = await Promise.all([
      this.getCategories(),
      this.getItems(storeId),
      this.getModifiers(),
    ]);

    const activeCategories = categories.filter((c) => !c.deleted_at);
    const activeItems = items.filter((i) => !i.deleted_at);
    const activeModifiers = modifiers.filter((m) => !m.deleted_at);

    return {
      categories: activeCategories,
      items: activeItems,
      modifiers: activeModifiers,
      syncedAt: new Date().toISOString(),
      counts: {
        categories: activeCategories.length,
        items: activeItems.length,
        modifiers: activeModifiers.length,
      },
    };
  }
}

export function createLoyverseClient(token: string) {
  if (!token?.trim()) {
    throw new Error("Loyverse access token is required");
  }
  return new LoyverseClient(token);
}
