import mongoose, { Schema, Document } from "mongoose";

export interface IDesignton extends Document {
  title: string;
  year: string;
  participant: string;
  imagePath: string;
  pdfPath: string;
  award?: string;
  // 기존 문서에는 새 필드가 없어서 모델에서는 필수로 두지 않는다 (필수 검사는 API에서)
  summary?: string;
  period?: string;
  type?: string;
  members?: { name: string; role?: string }[];
  link?: string;
  description?: string;
}

const DesigntonSchema = new Schema<IDesignton>({
  title: { type: String, required: true },
  year: { type: String, required: true },
  participant: { type: String },
  imagePath: { type: String, required: true },
  pdfPath: { type: String, required: true },
  award: { type: String },
  summary: { type: String },
  period: { type: String },
  type: { type: String },
  members: [{ _id: false, name: { type: String, required: true }, role: { type: String } }],
  link: { type: String },
  description: { type: String },
});

export default mongoose.models.Designton ||
  mongoose.model<IDesignton>("Designton", DesigntonSchema);
