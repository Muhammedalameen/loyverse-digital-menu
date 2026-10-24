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
│   ├── (public)/menu/[slug]/
│   ├── (admin)/ ... dashboard, stores, menus, integrations, settings
│   └── api/loyverse/
│       ├── test/
│       ├── stores/
│       └── sync/
├── components/layout/
├── lib/
│   ├── loyverse/
│   └── storage/   # settings + menu cache
└── types/
```

## خطة التطوير (مراحل)

| المرحلة | الوصف | الحالة |
|--------|------|--------|
| 1 | إعداد المشروع + الهيكل الأساسي | ✅ |
| 2 | لوحة التحكم (Dashboard Layout) | ✅ |
| 3 | إدارة المتاجر + ربط Loyverse | ✅ |
| 4 | مزامنة القائمة من Loyverse | ✅ |
| 5 | واجهة القائمة للعميل | ⏳ |
| 6 | تحسينات وتخصيصات | ⏳ |

## التشغيل المحلي

```bash
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) ثم `/dashboard`.

### تدفق العمل
1. `/integrations` — الصق Access Token واختبر الاتصال
2. `/stores` — أضف متجراً واربطه بمتجر Loyverse
3. `/menus` — اضغط **مزامنة الآن** لجلب الأقسام والأصناف والتعديلات

> البيانات تُحفظ حالياً في localStorage (سيتم نقلها لقاعدة بيانات لاحقاً).

## المساهمة

المشروع قيد التطوير النشط.
