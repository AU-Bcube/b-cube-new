import mongoose, { Schema, Document } from "mongoose";

export interface IEtc extends Document {
  title: string;
  year: string;
  participant: string;
  imagePath: string;
  pdfPath: string;
  award?: string;
}

const EtcSchema = new Schema<IEtc>({
  title: { type: String, required: true },
  year: { type: String, required: true },
  participant: { type: String, required: true },
  imagePath: { type: String, required: true },
  pdfPath: { type: String, required: true },
  award: { type: String },
});

export default mongoose.models.Etc ||
  mongoose.model<IEtc>("Etc", EtcSchema);
