"use client";

import { useEffect, useState } from "react";
import {
  getLoyverseToken,
  setLoyverseToken,
  clearLoyverseToken,
} from "@/lib/storage/settings";

type Status = "idle" | "testing" | "success" | "error";

export default function IntegrationsPage() {
  const [token, setToken] = useState("");
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [storesCount, setStoresCount] = useState<number | null>(null);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    const existing = getLoyverseToken();
    if (existing) {
      setToken(existing);
      setSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (!token.trim()) {
      setStatus("error");
      setMessage("أدخل Access Token أولاً");
      return;
    }
    setLoyverseToken(token);
    setSaved(true);
    setStatus("idle");
    setMessage("تم حفظ التوكن محلياً");
  };

  const handleClear = () => {
    clearLoyverseToken();
    setToken("");
    setSaved(false);
    setStatus("idle");
    setMessage("");
    setStoresCount(null);
  };

  const handleTest = async () => {
    const t = token.trim() || getLoyverseToken();
    if (!t) {
      setStatus("error");
      setMessage("أدخل Access Token أولاً");
      return;
    }

    setStatus("testing");
    setMessage("جاري اختبار الاتصال...");
    setStoresCount(null);

    try {
      const res = await fetch("/api/loyverse/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: t }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error || "فشل الاتصال");
        return;
      }

      setStatus("success");
      setMessage(data.message || "تم الاتصال بنجاح");
      setStoresCount(data.storesCount ?? 0);
      setLoyverseToken(t);
      setSaved(true);
    } catch {
      setStatus("error");
      setMessage("حدث خطأ في الشبكة");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">التكاملات</h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">ربط المنصة مع Loyverse POS لمزامنة القائمة</p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/50">
            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">LV</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Loyverse POS</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">مزامنة الأصناف والأقسام والأسعار تلقائياً</p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              status === "success" || (saved && status !== "error")
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            {status === "success" ? "متصل" : saved ? "توكن محفوظ" : "غير متصل"}
          </span>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Access Token</label>
          <div className="relative">
            <input
              type={showToken ? "text" : "password"}
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setStatus("idle");
                setMessage("");
              }}
              placeholder="الصق التوكن هنا..."
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 pe-20 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              {showToken ? "إخفاء" : "إظهار"}
            </button>
          </div>
          <p className="text-xs text-zinc-500">من لوحة Loyverse: Settings → Access Tokens → Add access token</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleTest}
            disabled={status === "testing"}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {status === "testing" ? "جاري الاختبار..." : "اختبار الاتصال"}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            حفظ التوكن
          </button>
          {saved && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              حذف التوكن
            </button>
          )}
        </div>

        {message && (
          <div
            className={`mt-4 rounded-xl px-4 py-3 text-sm ${
              status === "success"
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                : status === "error"
                  ? "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300"
                  : "bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {message}
            {storesCount !== null && status === "success" && (
              <span className="ms-1">({storesCount} متجر في الحساب)</span>
            )}
          </div>
        )}

        <div className="mt-6 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <strong className="text-zinc-800 dark:text-zinc-200">كيف تحصل على التوكن؟</strong>
            <br />
            1. سجّل الدخول إلى{" "}
            <a href="https://r.loyverse.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
              Loyverse Back Office
            </a>
            <br />
            2. Settings → Access Tokens → Add access token
            <br />
            3. انسخ التوكن والصقه هنا ثم اضغط «اختبار الاتصال»
          </p>
          <p className="mt-2 text-xs text-zinc-400">
            التوكن يُحفظ محلياً في المتصفح فقط (localStorage) ولا يُرسل لخادم آخر.
          </p>
        </div>
      </div>
    </div>
  );
}
