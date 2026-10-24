"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getStores,
  type LocalStore,
} from "@/lib/storage/settings";
import {
  getMenuCache,
  groupItemsByCategory,
  getItemPrice,
  type MenuCache,
} from "@/lib/storage/menu";
import type { LoyverseItem } from "@/lib/loyverse";

interface PublicMenuProps {
  slug: string;
}

export default function PublicMenu({ slug }: PublicMenuProps) {
  const [store, setStore] = useState<LocalStore | null | undefined>(undefined);
  const [cache, setCache] = useState<MenuCache | null>(null);
  const [activeCat, setActiveCat] = useState<string>("");
  const [search, setSearch] = useState("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const stores = getStores();
    const found = stores.find((s) => s.slug === slug) || null;
    setStore(found);
    setCache(getMenuCache());
  }, [slug]);

  const filteredItems = useMemo(() => {
    if (!cache) return [];
    const q = search.trim().toLowerCase();
    if (!q) return cache.items;
    return cache.items.filter(
      (i) =>
        i.item_name?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q)
    );
  }, [cache, search]);

  const groups = useMemo(() => {
    if (!cache) return [];
    return groupItemsByCategory(cache.categories, filteredItems);
  }, [cache, filteredItems]);

  useEffect(() => {
    if (groups.length > 0 && !activeCat) {
      setActiveCat(groups[0].category?.id || "uncategorized");
    }
  }, [groups, activeCat]);

  const scrollToCategory = (id: string) => {
    setActiveCat(id);
    const el = sectionRefs.current[id];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const formatPrice = (item: LoyverseItem) => {
    const price = getItemPrice(item, store?.loyverseStoreId || cache?.storeId);
    if (price == null) return null;
    return price.toFixed(2);
  };

  if (store === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-200 text-2xl font-bold text-zinc-500">?</div>
        <h1 className="text-xl font-bold text-zinc-900">المتجر غير موجود</h1>
        <p className="mt-2 max-w-sm text-sm text-zinc-500">
          لم يتم العثور على قائمة بالرابط <code className="rounded bg-zinc-100 px-1">{slug}</code>
        </p>
      </div>
    );
  }

  if (!store.isActive) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 text-center">
        <h1 className="text-xl font-bold text-zinc-900">{store.name}</h1>
        <p className="mt-2 text-sm text-zinc-500">هذه القائمة غير متاحة حالياً</p>
      </div>
    );
  }

  if (!cache || cache.items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-bold text-white">
          {store.name.charAt(0)}
        </div>
        <h1 className="text-xl font-bold text-zinc-900">{store.name}</h1>
        <p className="mt-2 max-w-sm text-sm text-zinc-500">القائمة قيد التحديث. يرجى المحاولة لاحقاً.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900">
      <header className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-10 left-10 h-32 w-32 rounded-full bg-teal-300/30 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-lg px-4 pb-8 pt-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold backdrop-blur">
              {store.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{store.name}</h1>
              {store.loyverseStoreName && (
                <p className="text-sm text-emerald-100/80">{store.loyverseStoreName}</p>
              )}
            </div>
          </div>
          <p className="text-sm text-emerald-100/90">قائمة الطعام الرقمية</p>
        </div>
      </header>

      <div className="sticky top-0 z-20 border-b border-stone-200/80 bg-stone-50/95 backdrop-blur-md">
        <div className="mx-auto max-w-lg px-4 py-3">
          <div className="relative mb-3">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في القائمة..."
              className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pe-4 ps-10 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <svg className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {!search && (
            <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {groups.map((g) => {
                const id = g.category?.id || "uncategorized";
                const name = g.category?.name || "أخرى";
                const isActive = activeCat === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollToCategory(id)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-white text-zinc-600 ring-1 ring-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-lg px-4 py-6 pb-20">
        {groups.length === 0 && (
          <p className="py-12 text-center text-sm text-zinc-500">لا توجد نتائج</p>
        )}

        {groups.map((group) => {
          const id = group.category?.id || "uncategorized";
          return (
            <section
              key={id}
              ref={(el) => {
                sectionRefs.current[id] = el;
              }}
              className="mb-8 scroll-mt-28"
            >
              <h2 className="mb-3 text-lg font-bold text-zinc-900">
                {group.category?.name || "أخرى"}
              </h2>
              <div className="space-y-3">
                {group.items.map((item) => {
                  const price = formatPrice(item);
                  return (
                    <article
                      key={item.id}
                      className="flex gap-3 overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-3 shadow-sm"
                    >
                      <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-stone-100">
                        {item.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image_url}
                            alt={item.item_name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-stone-300">
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v3.75m0 0V16.5m0-4.5h3.75m-3.75 0H8.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 py-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold leading-snug text-zinc-900">{item.item_name}</h3>
                          {price != null && (
                            <span className="shrink-0 text-sm font-bold text-emerald-700">
                              {price} <span className="text-xs font-medium text-emerald-600/80">ر.س</span>
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">{item.description}</p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      <footer className="border-t border-stone-200 bg-white py-6 text-center">
        <p className="text-xs text-zinc-400">قائمة رقمية · مدعومة من Loyverse</p>
      </footer>
    </div>
  );
}
