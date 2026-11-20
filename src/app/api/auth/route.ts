import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authErr = await requireAuth(req);
  if (authErr) {
    return NextResponse.json({ authed: false }, { status: 401 });
  }
  return NextResponse.json({ authed: true });
}
