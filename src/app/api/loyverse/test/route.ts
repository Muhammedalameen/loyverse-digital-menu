import { NextRequest, NextResponse } from "next/server";
import { createLoyverseClient } from "@/lib/loyverse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const token =
      body.token ||
      req.headers.get("x-loyverse-token") ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

    if (!token?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Access token is required" },
        { status: 400 }
      );
    }

    const client = createLoyverseClient(token);
    const result = await client.testConnection();

    return NextResponse.json({
      ok: true,
      storesCount: result.storesCount,
      message: `تم الاتصال بنجاح — وُجد ${result.storesCount} متجر`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "فشل الاتصال";
    return NextResponse.json({ ok: false, error: message }, { status: 401 });
  }
}
