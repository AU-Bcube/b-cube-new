import mongoose, { Schema, Document } from "mongoose";

export interface IInterview extends Document {
  name: string;
  studentId: number;
  introduction: string;
  imagePath: string;
}

const InterviewSchema = new Schema<IInterview>({
  name: { type: String, required: true },
  studentId: { type: Number, required: true },
  introduction: { type: String, required: true },
  imagePath: { type: String, required: true },
});

export default mongoose.models.Interview ||
  mongoose.model<IInterview>("Interview", InterviewSchema);
