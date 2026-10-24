export default function DashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
          لوحة التحكم
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          سيتم بناء تصميم مشابه لـ MenuTiger في المرحلة 2
        </p>
        <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500">
            المرحلة الحالية: <strong>1 - إعداد المشروع</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
