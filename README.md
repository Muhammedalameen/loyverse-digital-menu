# Loyverse Digital Menu

منصة قائمة رقمية متصلة مع **Loyverse POS** — عرض القائمة للعميل فقط + لوحة تحكم قوية مستوحاة من MenuTiger.

## المميزات (المستهدفة)

### للعميل (Public Menu)
- قائمة رقمية جميلة ومتجاوبة
- دعم اللغة العربية والإنجليزية
- عرض الأقسام والأصناف والصور والوصف والـ Modifiers
- رابط أو QR Code لكل متجر / طاولة
- بدون طلب أونلاين (عرض فقط)

### لوحة التحكم (Admin Dashboard)
- تصميم مشابه لـ MenuTiger
- إدارة المتاجر (Stores)
- ربط حساب Loyverse
- مزامنة تلقائية للقائمة (Categories + Items + Modifiers)
- تخصيص المظهر والألوان
- دعم متعدد اللغات

## التقنيات المستخدمة

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Loyverse API**
- جاهز للنشر على Vercel

## هيكل المشروع

```
src/
├── app/
│   ├── (public)/          # الصفحات العامة (القائمة للعميل)
│   │   └── menu/[slug]/  # صفحة القائمة حسب المتجر
│   ├── (admin)/
│   │   ├── dashboard/
│   │   ├── stores/
│   │   ├── menus/
│   │   ├── integrations/
│   │   └── settings/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/            # Sidebar, Header, AdminShell
│   └── ui/
├── lib/
│   └── loyverse/
├── types/
└── hooks/
```

## خطة التطوير (مراحل)

| المرحلة | الوصف | الحالة |
|--------|------|--------|
| 1 | إعداد المشروع + الهيكل الأساسي | ✅ |
| 2 | لوحة التحكم (Dashboard Layout) | ✅ |
| 3 | إدارة المتاجر + ربط Loyverse | ⏳ |
| 4 | مزامنة القائمة من Loyverse | ⏳ |
| 5 | واجهة القائمة للعميل | ⏳ |
| 6 | تحسينات وتخصيصات | ⏳ |

## التشغيل المحلي

```bash
# تثبيت الحزم
npm install

# تشغيل بيئة التطوير
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

ثم انتقل إلى `/dashboard` لرؤية لوحة التحكم.

## متغيرات البيئة

انسخ `.env.example` إلى `.env.local` وأكمل القيم:

```env
# Loyverse
LOYVERSE_ACCESS_TOKEN=
LOYVERSE_STORE_ID=

# Database (لاحقاً)
DATABASE_URL=

# Auth (لاحقاً)
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

## المساهمة

المشروع قيد التطوير النشط. سيتم إضافة المزيد من التفاصيل مع كل مرحلة.
