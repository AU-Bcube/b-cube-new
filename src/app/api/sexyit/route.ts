import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SexyIt from "@/lib/models/SexyIt";
import { uploadImage } from "@/lib/storage";

export async function GET() {
  await dbConnect();
  const items = await SexyIt.find().sort({ date: -1 }).lean();
  return NextResponse.json(
    items.map((s) => ({
      id: (s._id as object).toString(),
      date: s.date.toISOString().split("T")[0],
      title: s.title,
      imagePath: s.imagePath,
      url: s.url,
    }))
  );
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const formData = await req.formData();
  const date = formData.get("date") as string;
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const imageFile = formData.get("imagePath") as File;

  const imageUrl = await uploadImage(imageFile, "bcube/sexyit");
  await SexyIt.create({
    date: new Date(date),
    title,
    imagePath: imageUrl,
    url,
  });

  return NextResponse.json({ message: "섹시한 IT 업로드 완료" });
}
