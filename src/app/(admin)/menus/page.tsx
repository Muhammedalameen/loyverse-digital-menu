export default function MenusPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          القوائم
        </h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          عرض وإدارة الأقسام والأصناف المزامنة من Loyverse
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <svg className="h-7 w-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          لا توجد قوائم بعد
        </h3>
        <p className="mt-2 max-w-sm mx-auto text-sm text-zinc-500 dark:text-zinc-400">
          بعد ربط Loyverse ومزامنة البيانات ستظهر الأقسام والأصناف هنا.
        </p>
        <p className="mt-6 text-xs text-zinc-400">
          سيتم تفعيل المزامنة في المرحلة 4
        </p>
      </div>
    </div>
  );
}
