import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/mongodb";
import SexyIt from "@/lib/models/SexyIt";
import { requireAuth } from "@/lib/auth";

// id는 ig_post_id. 삭제하면 다음 크롤러 실행에서 Instagram의 현재 내용으로 다시 저장된다.
// R2 이미지는 크롤러가 같은 경로에 덮어쓰므로 지우지 않는다.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = requireAuth(req);
  if (authErr) return authErr;

  await dbConnect();
  const { id } = await params;
  const result = await SexyIt.deleteOne({ ig_post_id: id });
  if (result.deletedCount === 0)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  revalidatePath("/", "layout");
  return NextResponse.json({ message: "삭제 완료" });
}
