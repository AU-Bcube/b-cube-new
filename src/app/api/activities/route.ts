import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activities from "@/lib/models/Activities";
import { uploadImage, uploadPdf } from "@/lib/storage";

export async function GET() {
  await dbConnect();
  const activities = await Activities.find().lean();
  return NextResponse.json(
    activities.map((a) => ({
      id: (a._id as object).toString(),
      title: a.title,
      description: a.description,
      imagePath: a.imagePath,
      pdfPath: a.pdfPath,
    }))
  );
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const imageFile = formData.get("imagePath") as File;
  const pdfFile = formData.get("pdfPath") as File;

  const imageUrl = await uploadImage(imageFile, "bcube/activities");
  const pdfUrl = await uploadPdf(pdfFile, "bcube/activities");
  await Activities.create({
    title,
    description,
    imagePath: imageUrl,
    pdfPath: pdfUrl,
  });

  return NextResponse.json({ message: "활동 업로드 완료" });
}
