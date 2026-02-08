import mongoose, { Schema, Document } from "mongoose";

export interface IStudy extends Document {
  year: string;
  title: string;
  imagePath: string;
}

const StudySchema = new Schema<IStudy>({
  year: { type: String, required: true },
  title: { type: String, required: true },
  imagePath: { type: String, required: true },
});

export default mongoose.models.Study ||
  mongoose.model<IStudy>("Study", StudySchema);
