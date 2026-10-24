import { NextRequest, NextResponse } from "next/server";
import { createLoyverseClient } from "@/lib/loyverse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const token =
      body.token ||
      req.headers.get("x-loyverse-token") ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

    const storeId = body.storeId || undefined;

    if (!token?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Access token is required" },
        { status: 400 }
      );
    }

    const client = createLoyverseClient(token);
    const result = await client.syncMenu(storeId);

    return NextResponse.json({
      ok: true,
      ...result,
      message: `تمت المزامنة: ${result.counts.categories} قسم، ${result.counts.items} صنف، ${result.counts.modifiers} مجموعة تعديلات`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "فشلت المزامنة";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
