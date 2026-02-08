import mongoose, { Schema, Document } from "mongoose";

export interface IDesignton extends Document {
  title: string;
  year: string;
  participant: string;
  imagePath: string;
  pdfPath: string;
  award?: string;
}

const DesigntonSchema = new Schema<IDesignton>({
  title: { type: String, required: true },
  year: { type: String, required: true },
  participant: { type: String, required: true },
  imagePath: { type: String, required: true },
  pdfPath: { type: String, required: true },
  award: { type: String },
});

export default mongoose.models.Designton ||
  mongoose.model<IDesignton>("Designton", DesigntonSchema);
