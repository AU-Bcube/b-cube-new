import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Contact from "@/lib/models/Contact";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  const contact = await Contact.findOne().lean();
  if (!contact)
    return NextResponse.json(
      { email: "", kakaotalkLink: "", instagramLink: "", isRecruiting: false, recruitLink: "" },
      { status: 200 }
    );

  return NextResponse.json({
    id: (contact._id as object).toString(),
    email: contact.email,
    kakaotalkLink: contact.kakaotalkLink,
    instagramLink: contact.instagramLink,
    isRecruiting: contact.isRecruiting ?? false,
    recruitMessage: contact.recruitMessage,
    recruitLink: contact.recruitLink ?? "",
  });
}

export async function POST(req: NextRequest) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const body = await req.json();
  const existing = await Contact.findOne();
  if (existing)
    return NextResponse.json(
      { error: "이미 연락처가 존재합니다. PATCH를 사용하세요." },
      { status: 400 }
    );

  await Contact.create(body);
  revalidatePath("/", "layout");
  return NextResponse.json({ message: "연락처 등록 완료" });
}

export async function PATCH(req: NextRequest) {
  const authErr = requireAuth(req);
  if (authErr) {
    console.log("[PATCH /api/contact] AUTH FAILED");
    return authErr;
  }

  try {
    await dbConnect();
    const body = await req.json();
    console.log("[PATCH /api/contact] body:", JSON.stringify(body));

    let contact = await Contact.findOne();
    console.log("[PATCH /api/contact] existing contact:", contact ? "YES" : "NO");

    if (!contact) {
      contact = new Contact();
    }

    if (body.email !== undefined) contact.email = body.email;
    if (body.kakaotalkLink !== undefined) contact.kakaotalkLink = body.kakaotalkLink;
    if (body.instagramLink !== undefined) contact.instagramLink = body.instagramLink;
    if (typeof body.isRecruiting === "boolean") contact.isRecruiting = body.isRecruiting;
    if (body.recruitMessage !== undefined) contact.recruitMessage = body.recruitMessage;
    if (body.recruitLink !== undefined) contact.recruitLink = body.recruitLink;

    console.log("[PATCH /api/contact] before save:", JSON.stringify({
      isRecruiting: contact.isRecruiting,
      recruitMessage: contact.recruitMessage,
      recruitLink: contact.recruitLink,
    }));

    await contact.save();
    console.log("[PATCH /api/contact] SAVED OK, id:", contact._id.toString());

    revalidatePath("/", "layout");
    return NextResponse.json({
      id: contact._id.toString(),
      email: contact.email,
      kakaotalkLink: contact.kakaotalkLink,
      instagramLink: contact.instagramLink,
      isRecruiting: contact.isRecruiting,
      recruitMessage: contact.recruitMessage,
      recruitLink: contact.recruitLink,
    });
  } catch (err) {
    console.error("[PATCH /api/contact] ERROR:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
