/**
 * Loyverse API Client
 * Docs: https://developer.loyverse.com/docs/
 * Auth: Authorization: Bearer <personal_access_token>
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
        if (body?.errors?.[0]?.details) {
          message = body.errors[0].details;
        } else if (body?.message) {
          message = body.message;
        }
      } catch {
        // ignore
      }
      throw new Error(message);
    }

    return res.json();
  }

  async testConnection(): Promise<{ ok: true; storesCount: number }> {
    const data = await this.getStores();
    return { ok: true, storesCount: data.stores?.length ?? 0 };
  }

  async getStores(): Promise<{ stores: LoyverseStore[] }> {
    return this.request<{ stores: LoyverseStore[] }>("/stores");
  }

  async getCategories(storeId?: string) {
    const query = storeId ? `?store_ids=${storeId}` : "";
    return this.request<{ categories: any[] }>(`/categories${query}`);
  }

  async getItems(storeId?: string) {
    const query = storeId ? `?store_ids=${storeId}` : "";
    return this.request<{ items: any[] }>(`/items${query}`);
  }
}

export function createLoyverseClient(token: string) {
  if (!token?.trim()) {
    throw new Error("Loyverse access token is required");
  }
  return new LoyverseClient(token);
}
