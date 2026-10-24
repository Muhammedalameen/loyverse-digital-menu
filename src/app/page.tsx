import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        {/* Logo / Brand */}
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-600/20">
          <span className="text-3xl font-bold text-white">LM</span>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          Loyverse Digital Menu
        </h1>

        <p className="mb-10 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          منصة قائمة رقمية متصلة مع Loyverse POS
          <br />
          عرض القائمة للعميل + لوحة تحكم قوية مستوحاة من MenuTiger
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            لوحة التحكم
          </Link>

          <Link
            href="/menu/demo"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-8 py-3.5 text-base font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            معاينة القائمة (Demo)
          </Link>
        </div>

        {/* Status badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            المرحلة 1: إعداد المشروع ✅
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            Next.js 16 + TypeScript + Tailwind
          </span>
        </div>
      </div>
    </div>
  );
}
