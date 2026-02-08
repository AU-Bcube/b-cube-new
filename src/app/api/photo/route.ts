import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import Photo from "@/lib/models/Photo";
import { uploadImage } from "@/lib/storage";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  const photos = await Photo.find().sort({ date: -1 }).lean();
  return NextResponse.json(
    photos.map((p) => ({
      id: (p._id as object).toString(),
      description: p.description,
      date: p.date.toISOString().split("T")[0],
      imagePath: p.imagePath,
    }))
  );
}

export async function POST(req: NextRequest) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const formData = await req.formData();
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const imageFile = formData.get("imagePath") as File;

  const imageUrl = await uploadImage(imageFile, "bcube/photo");
  await Photo.create({ description, date: new Date(date), imagePath: imageUrl });

  revalidatePath("/", "layout");
  return NextResponse.json({ message: "사진 업로드 완료" });
}
