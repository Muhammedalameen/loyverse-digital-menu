"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getLoyverseToken, getStores, type LocalStore } from "@/lib/storage/settings";
import {
  getMenuCache,
  saveMenuCache,
  groupItemsByCategory,
  getItemPrice,
  type MenuCache,
} from "@/lib/storage/menu";
import type { LoyverseItem } from "@/lib/loyverse";

export default function MenusPage() {
  const [cache, setCache] = useState<MenuCache | null>(null);
  const [stores, setStores] = useState<LocalStore[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setCache(getMenuCache());
    setStores(getStores());
    setHasToken(!!getLoyverseToken());
    const linked = getStores().find((s) => s.loyverseStoreId);
    if (linked?.loyverseStoreId) setSelectedStoreId(linked.loyverseStoreId);
  }, []);

  const handleSync = async () => {
    const token = getLoyverseToken();
    if (!token) {
      setError("اربط حساب Loyverse أولاً من صفحة التكاملات");
      return;
    }
    setSyncing(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/loyverse/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, storeId: selectedStoreId || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "فشلت المزامنة");
        return;
      }
      const next: MenuCache = {
        categories: data.categories || [],
        items: data.items || [],
        modifiers: data.modifiers || [],
        syncedAt: data.syncedAt,
        storeId: selectedStoreId || undefined,
        counts: data.counts,
      };
      saveMenuCache(next);
      setCache(next);
      setMessage(data.message || "تمت المزامنة بنجاح");
    } catch {
      setError("حدث خطأ في الشبكة");
    } finally {
      setSyncing(false);
    }
  };

  const filteredItems = useMemo(() => {
    if (!cache) return [];
    const q = search.trim().toLowerCase();
    if (!q) return cache.items;
    return cache.items.filter(
      (i) => i.item_name?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q)
    );
  }, [cache, search]);

  const groups = useMemo(() => {
    if (!cache) return [];
    return groupItemsByCategory(cache.categories, filteredItems);
  }, [cache, filteredItems]);

  const formatPrice = (item: LoyverseItem) => {
    const price = getItemPrice(item, selectedStoreId || cache?.storeId);
    if (price == null) return "—";
    return `${price.toFixed(2)} ر.س`;
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return iso;
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">القوائم</h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">الأصناف والأقسام المزامنة من Loyverse</p>
        </div>
        <button type="button" onClick={handleSync} disabled={syncing || !hasToken}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60">
          {syncing ? "جاري المزامنة..." : "مزامنة الآن"}
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-zinc-500">متجر Loyverse (اختياري)</label>
          <select value={selectedStoreId} onChange={(e) => setSelectedStoreId(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white">
            <option value="">كل المتاجر / بدون فلتر</option>
            {stores.filter((s) => s.loyverseStoreId).map((s) => (
              <option key={s.id} value={s.loyverseStoreId!}>{s.name} ({s.loyverseStoreName || s.loyverseStoreId})</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-zinc-500">بحث</label>
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن صنف..."
            className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white" />
        </div>
      </div>

      {!hasToken && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          لم يتم ربط Loyverse بعد. <Link href="/integrations" className="font-medium underline">اذهب للتكاملات</Link>
        </div>
      )}
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-300">{error}</div>}
      {message && <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">{message}</div>}

      {cache && (
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500">الأقسام</p>
            <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">{cache.counts.categories}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500">الأصناف</p>
            <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">{cache.counts.items}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500">التعديلات</p>
            <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">{cache.counts.modifiers}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs text-zinc-500">آخر مزامنة</p>
            <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">{formatDate(cache.syncedAt)}</p>
          </div>
        </div>
      )}

      {!cache && (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">لا توجد قائمة بعد</h3>
          <p className="mt-2 text-sm text-zinc-500">اضغط «مزامنة الآن» لجلب الأصناف من Loyverse</p>
          {hasToken && (
            <button type="button" onClick={handleSync} disabled={syncing}
              className="mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">مزامنة الآن</button>
          )}
        </div>
      )}

      {cache && groups.length === 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">لا توجد نتائج للبحث</div>
      )}

      {groups.map((group) => (
        <section key={group.category?.id || "uncategorized"} className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {group.category?.name || "بدون قسم"}
            <span className="ms-2 text-sm font-normal text-zinc-400">({group.items.length})</span>
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => (
              <article key={item.id} className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_url} alt={item.item_name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">لا صورة</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-medium text-zinc-900 dark:text-white">{item.item_name}</h4>
                  {item.description && <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">{item.description}</p>}
                  <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatPrice(item)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      {cache && cache.modifiers.length > 0 && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-3 text-base font-semibold text-zinc-900 dark:text-white">مجموعات التعديلات ({cache.modifiers.length})</h3>
          <div className="flex flex-wrap gap-2">
            {cache.modifiers.map((m) => (
              <span key={m.id} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                title={m.options?.map((o) => o.name).join(", ")}>
                {m.name}{m.options?.length ? ` (${m.options.length})` : ""}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
