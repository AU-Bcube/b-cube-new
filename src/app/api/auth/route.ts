import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Admin from "@/lib/models/Admin";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("admin-auth");
  if (cookie?.value === "authenticated") {
    return NextResponse.json({ authed: true });
  }
  return NextResponse.json({ authed: false }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const { id, password } = await req.json();

  await dbConnect();
  const admin = await Admin.findOne({ username: id });
  if (!admin) {
    return NextResponse.json({ error: "인증 실패" }, { status: 401 });
  }

  const valid = await compare(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "인증 실패" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin-auth", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin-auth");
  return response;
}
