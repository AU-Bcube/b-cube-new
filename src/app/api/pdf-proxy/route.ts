import { NextRequest, NextResponse } from "next/server";
import {redirect} from "next/navigation";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url parameter is required" }, { status: 400 });
  }

  // Only allow Cloudinary / Cloudflare R2 URLs for security
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("cloudinary.com") && !parsed.hostname.endsWith("r2.dev")) {
      return NextResponse.json({ error: "Only allowed storage URLs are permitted" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
  
  return redirect(url);
}
