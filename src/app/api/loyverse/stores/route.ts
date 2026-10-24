import { NextRequest, NextResponse } from "next/server";
import { createLoyverseClient } from "@/lib/loyverse";

export async function GET(req: NextRequest) {
  try {
    const token =
      req.headers.get("x-loyverse-token") ||
      req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
      req.nextUrl.searchParams.get("token");

    if (!token?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Access token is required" },
        { status: 400 }
      );
    }

    const client = createLoyverseClient(token);
    const data = await client.getStores();

    return NextResponse.json({
      ok: true,
      stores: data.stores ?? [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "فشل جلب المتاجر";
    return NextResponse.json({ ok: false, error: message }, { status: 401 });
  }
}
