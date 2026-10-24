export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          الإعدادات
        </h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          إعدادات الحساب والمظهر العام
        </p>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          المظهر
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          يمكنك تبديل الوضع الداكن من زر القمر في الشريط العلوي
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          اللغة
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          الواجهة حالياً بالعربية (RTL). دعم الإنجليزية سيُضاف لاحقاً.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          الحساب
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          نظام تسجيل الدخول سيُضاف في مرحلة لاحقة.
        </p>
      </section>
    </div>
  );
}
