import mongoose, { Schema, Document } from "mongoose";

export interface IStudy extends Document {
  year: string;
  title: string;
  imagePath: string;
  // 상세 페이지 항목. 모두 선택이고, 한 줄 소개(summary)가 있어야 상세 페이지가 생긴다
  summary?: string;
  period?: string;
  schedule?: string;
  level?: string;
  members?: string[];
  tools?: string;
  outcomes?: string[];
  curriculum?: string[];
  notionUrl?: string;
}

const StudySchema = new Schema<IStudy>({
  year: { type: String, required: true },
  title: { type: String, required: true },
  imagePath: { type: String, required: true },
  summary: { type: String },
  period: { type: String },
  schedule: { type: String },
  level: { type: String },
  members: [String],
  tools: { type: String },
  outcomes: [String],
  curriculum: [String],
  notionUrl: { type: String },
});

export default mongoose.models.Study ||
  mongoose.model<IStudy>("Study", StudySchema);
