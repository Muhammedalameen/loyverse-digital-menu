/**
 * Loyverse API Client
 * Documentation: https://developer.loyverse.com/
 *
 * سيتم تطويره بشكل كامل في المرحلة 3 و 4
 */

const LOYVERSE_API_BASE = "https://api.loyverse.com/v1.0";

export class LoyverseClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${LOYVERSE_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Loyverse API Error (${res.status}): ${error}`);
    }

    return res.json();
  }

  // Basic methods (سيتم توسيعها لاحقاً)
  async getStores() {
    return this.request<{ stores: any[] }>("/stores");
  }

  async getCategories(storeId?: string) {
    const query = storeId ? `?store_id=${storeId}` : "";
    return this.request<{ categories: any[] }>(`/categories${query}`);
  }

  async getItems(storeId?: string) {
    const query = storeId ? `?store_id=${storeId}` : "";
    return this.request<{ items: any[] }>(`/items${query}`);
  }
}

export function createLoyverseClient() {
  const token = process.env.LOYVERSE_ACCESS_TOKEN;
  if (!token) {
    throw new Error("LOYVERSE_ACCESS_TOKEN is not set");
  }
  return new LoyverseClient(token);
}
