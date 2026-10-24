"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getStores,
  addStore,
  updateStore,
  deleteStore,
  getLoyverseToken,
  slugify,
  type LocalStore,
} from "@/lib/storage/settings";
import type { LoyverseStore } from "@/lib/loyverse";

export default function StoresPage() {
  const [stores, setStores] = useState<LocalStore[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loyverseStores, setLoyverseStores] = useState<LoyverseStore[]>([]);
  const [selectedLoyverseId, setSelectedLoyverseId] = useState("");
  const [loadingLv, setLoadingLv] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [error, setError] = useState("");

  const refresh = () => setStores(getStores());

  useEffect(() => {
    refresh();
    setHasToken(!!getLoyverseToken());
  }, []);

  const loadLoyverseStores = async () => {
    const token = getLoyverseToken();
    if (!token) {
      setError("اربط حساب Loyverse أولاً من صفحة التكاملات");
      return;
    }
    setLoadingLv(true);
    setError("");
    try {
      const res = await fetch("/api/loyverse/stores", {
        headers: { "x-loyverse-token": token },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "فشل جلب متاجر Loyverse");
        return;
      }
      setLoyverseStores(data.stores || []);
    } catch {
      setError("حدث خطأ في الشبكة");
    } finally {
      setLoadingLv(false);
    }
  };

  const openForm = async () => {
    setShowForm(true);
    setName("");
    setSlug("");
    setSelectedLoyverseId("");
    setError("");
    if (getLoyverseToken()) await loadLoyverseStores();
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(slugify(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setError("الاسم والرابط مطلوبان");
      return;
    }
    if (stores.some((s) => s.slug === slug.trim())) {
      setError("هذا الرابط مستخدم مسبقاً");
      return;
    }
    const lv = loyverseStores.find((s) => s.id === selectedLoyverseId);
    addStore({
      name: name.trim(),
      slug: slug.trim(),
      loyverseStoreId: selectedLoyverseId || undefined,
      loyverseStoreName: lv?.name,
    });
    refresh();
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("هل تريد حذف هذا المتجر؟")) return;
    deleteStore(id);
    refresh();
  };

  const handleToggleActive = (store: LocalStore) => {
    updateStore(store.id, { isActive: !store.isActive });
    refresh();
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">المتاجر</h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">إدارة المتاجر وربطها مع Loyverse</p>
        </div>
        <button type="button" onClick={openForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          إضافة متجر
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-zinc-900">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">متجر جديد</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">اسم المتجر</label>
              <input type="text" value={name} onChange={(e) => handleNameChange(e.target.value)}
                placeholder="مثال: فرع المدينة" required
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">رابط القائمة (slug)</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">/menu/</span>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} dir="ltr" required
                  className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">ربط مع متجر Loyverse (اختياري)</label>
              {!hasToken ? (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  <Link href="/integrations" className="underline">اربط حساب Loyverse</Link> أولاً
                </p>
              ) : (
                <select value={selectedLoyverseId} onChange={(e) => setSelectedLoyverseId(e.target.value)} disabled={loadingLv}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white">
                  <option value="">{loadingLv ? "جاري التحميل..." : "— بدون ربط —"}</option>
                  {loyverseStores.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}{s.city ? ` (${s.city})` : ""}</option>
                  ))}
                </select>
              )}
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="submit" className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">حفظ المتجر</button>
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {stores.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">لا توجد متاجر بعد</h3>
          <p className="mt-2 text-sm text-zinc-500">أضف متجرك الأول ثم اربطه بـ Loyverse.</p>
          <button type="button" onClick={openForm}
            className="mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">إضافة متجر</button>
        </div>
      ) : (
        <div className="space-y-3">
          {stores.map((store) => (
            <div key={store.id}
              className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-zinc-900 dark:text-white">{store.name}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    store.isActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                  }`}>
                    {store.isActive ? "نشط" : "متوقف"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500" dir="ltr">/menu/{store.slug}</p>
                {store.loyverseStoreName && (
                  <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">مرتبط بـ: {store.loyverseStoreName}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/menu/${store.slug}`} target="_blank"
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">معاينة</Link>
                <button type="button" onClick={() => handleToggleActive(store)}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">
                  {store.isActive ? "إيقاف" : "تفعيل"}
                </button>
                <button type="button" onClick={() => handleDelete(store.id)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400">حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
