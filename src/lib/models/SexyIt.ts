import mongoose, { Schema, Document } from "mongoose";

// b-cube-sexyit-crawl 크롤러가 채우는 컬렉션 (docs/SEXYITS2_CRAWL_HANDOFF.md)
export interface ISexyIt extends Document {
  ig_post_id: string;
  date: Date;
  title: string;
  imagePath: string;
  url: string;
}

const SexyItSchema = new Schema<ISexyIt>(
  {
    ig_post_id: { type: String, required: true },
    date: { type: Date, required: true },
    title: { type: String, required: true },
    imagePath: { type: String, required: true },
    url: { type: String, required: true },
  },
  { versionKey: false, autoIndex: false }
);

export default mongoose.models.Sexyit2 ||
  mongoose.model<ISexyIt>("Sexyit2", SexyItSchema, "sexyits2");

// date는 UTC로 저장되므로 KST(UTC+9) 기준 날짜로 변환
export function toKstDateString(date: Date): string {
  return new Date(date.getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
}
