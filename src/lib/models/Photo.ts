import mongoose, { Schema, Document } from "mongoose";

export interface IPhoto extends Document {
  description: string;
  date: Date;
  imagePath: string;
}

const PhotoSchema = new Schema<IPhoto>({
  description: { type: String, required: true },
  date: { type: Date, required: true },
  imagePath: { type: String, required: true },
});

export default mongoose.models.Photo ||
  mongoose.model<IPhoto>("Photo", PhotoSchema);
