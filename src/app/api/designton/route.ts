import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Designton from "@/lib/models/Designton";
import { uploadImage, uploadPdf } from "@/lib/storage";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  const items = await Designton.find().sort({ year: -1 }).lean();
  return NextResponse.json(
    items.map((d) => ({
      id: (d._id as object).toString(),
      title: d.title,
      year: d.year,
      participant: d.participant,
      imagePath: d.imagePath,
      pdfPath: d.pdfPath,
      award: d.award,
    }))
  );
}

export async function POST(req: NextRequest) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const year = formData.get("year") as string;
  const participant = formData.get("participant") as string;
  const award = formData.get("award") as string | null;
  const imageFile = formData.get("imagePath") as File;
  const pdfFile = formData.get("pdfPath") as File;

  const imageUrl = await uploadImage(imageFile, "bcube/designton");
  const pdfUrl = await uploadPdf(pdfFile, "bcube/designton");
  await Designton.create({
    title,
    year,
    participant,
    imagePath: imageUrl,
    pdfPath: pdfUrl,
    ...(award && { award }),
  });

  revalidatePath("/", "layout");
  return NextResponse.json({ message: "디자인톤 업로드 완료" });
}
