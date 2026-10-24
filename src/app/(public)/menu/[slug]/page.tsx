interface MenuPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PublicMenuPage({ params }: MenuPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-bold text-white">
          {slug.charAt(0).toUpperCase()}
        </div>

        <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
          قائمة {slug}
        </h1>

        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          هذه صفحة القائمة العامة للعميل
          <br />
          سيتم بناء الواجهة الكاملة في المرحلة 5
        </p>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500">
            slug الحالي: <code className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">{slug}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
