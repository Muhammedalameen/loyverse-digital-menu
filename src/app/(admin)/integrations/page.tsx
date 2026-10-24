export default function IntegrationsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          التكاملات
        </h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          ربط المنصة مع أنظمة خارجية مثل Loyverse
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/50">
              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                LV
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Loyverse POS
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                مزامنة الأصناف والأقسام والأسعار تلقائياً
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              غير متصل
            </span>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              ربط الحساب
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-950">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <strong className="text-zinc-800 dark:text-zinc-200">كيف يعمل الربط؟</strong>
            <br />
            ستحتاج إلى Access Token من لوحة تحكم Loyverse (Settings → Access Tokens).
            بعد الربط، يمكن مزامنة المتاجر والأصناف بنقرة واحدة.
          </p>
          <p className="mt-3 text-xs text-zinc-400">
            سيتم تفعيل الربط الكامل في المرحلة 3
          </p>
        </div>
      </div>
    </div>
  );
}
