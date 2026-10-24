import Link from "next/link";

const stats = [
  {
    label: "المتاجر",
    value: "0",
    sub: "متجر نشط",
    color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
  },
  {
    label: "الأصناف",
    value: "0",
    sub: "صنف في القائمة",
    color: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
  },
  {
    label: "الأقسام",
    value: "0",
    sub: "قسم نشط",
    color: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-900/50",
  },
  {
    label: "حالة Loyverse",
    value: "غير متصل",
    sub: "يحتاج ربط",
    color: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
  },
];

const quickActions = [
  {
    href: "/stores",
    title: "إضافة متجر",
    description: "أنشئ متجراً جديداً واربطه بـ Loyverse",
  },
  {
    href: "/integrations",
    title: "ربط Loyverse",
    description: "اربط حسابك لمزامنة القائمة تلقائياً",
  },
  {
    href: "/menus",
    title: "عرض القوائم",
    description: "راجع الأصناف والأقسام بعد المزامنة",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          مرحباً بك 👋
        </h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          هذه لوحة التحكم الرئيسية لمنصة القائمة الرقمية
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{stat.sub}</p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}
              >
                <span className={`text-sm font-bold ${stat.color.split(" ")[1]}`}>
                  {stat.label.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
          إجراءات سريعة
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
            >
              <h4 className="font-semibold text-zinc-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                {action.title}
              </h4>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          ابدأ الآن
        </h3>
        <ol className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
              1
            </span>
            <span>
              اذهب إلى{" "}
              <Link href="/integrations" className="font-medium text-emerald-600 hover:underline">
                التكاملات
              </Link>{" "}
              واربط حساب Loyverse
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
              2
            </span>
            <span>
              أنشئ متجراً من{" "}
              <Link href="/stores" className="font-medium text-emerald-600 hover:underline">
                المتاجر
              </Link>{" "}
              واربطه بمخزن Loyverse
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
              3
            </span>
            <span>
              زامن القائمة وشاهدها في{" "}
              <Link href="/menus" className="font-medium text-emerald-600 hover:underline">
                القوائم
              </Link>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
              4
            </span>
            <span>شارك رابط القائمة أو QR Code مع العملاء</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
