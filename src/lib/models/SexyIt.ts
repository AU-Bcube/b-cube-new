import mongoose, { Schema, Document } from "mongoose";

export interface ISexyIt extends Document {
  date: Date;
  title: string;
  imagePath: string;
  url: string;
}

const SexyItSchema = new Schema<ISexyIt>({
  date: { type: Date, required: true },
  title: { type: String, required: true },
  imagePath: { type: String, required: true },
  url: { type: String, required: true },
});

export default mongoose.models.SexyIt ||
  mongoose.model<ISexyIt>("SexyIt", SexyItSchema);
