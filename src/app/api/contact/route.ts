import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Contact from "@/lib/models/Contact";

export async function GET() {
  await dbConnect();
  const contact = await Contact.findOne().lean();
  if (!contact)
    return NextResponse.json(
      { email: "", kakaotalkLink: "", instagramLink: "" },
      { status: 200 }
    );

  return NextResponse.json({
    id: (contact._id as object).toString(),
    email: contact.email,
    kakaotalkLink: contact.kakaotalkLink,
    instagramLink: contact.instagramLink,
  });
}

export async function POST(req: NextRequest) {
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
  await dbConnect();
  const body = await req.json();
  const contact = await Contact.findOne();
  if (!contact)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.email) contact.email = body.email;
  if (body.kakaotalkLink) contact.kakaotalkLink = body.kakaotalkLink;
  if (body.instagramLink) contact.instagramLink = body.instagramLink;

  await contact.save();
  revalidatePath("/", "layout");
  return NextResponse.json({
    id: contact._id.toString(),
    email: contact.email,
    kakaotalkLink: contact.kakaotalkLink,
    instagramLink: contact.instagramLink,
  });
}
