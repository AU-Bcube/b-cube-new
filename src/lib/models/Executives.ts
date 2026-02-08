import mongoose, { Schema, Document } from "mongoose";

export interface IExecutives extends Document {
  name: string;
  role: string;
  studentId: number;
  imagePath: string;
}

const ExecutivesSchema = new Schema<IExecutives>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  studentId: { type: Number, required: true },
  imagePath: { type: String, required: true },
});

export default mongoose.models.Executives ||
  mongoose.model<IExecutives>("Executives", ExecutivesSchema);
