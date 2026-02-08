import { NextRequest, NextResponse } from "next/server";

export function requireAuth(req: NextRequest): NextResponse | null {
  const cookie = req.cookies.get("admin-auth");
  if (cookie?.value === "authenticated") return null;
  return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
}
