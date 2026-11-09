import mongoose, { Schema, Document } from "mongoose";

export interface IActivityReview extends Document {
  category: string;
  name: string;
  studentId: number;
  content: string;
}

const ActivityReviewSchema = new Schema<IActivityReview>({
  category: { type: String, required: true },
  name: { type: String, required: true },
  studentId: { type: Number, required: true },
  content: { type: String, required: true },
});

export default mongoose.models.ActivityReview ||
  mongoose.model<IActivityReview>("ActivityReview", ActivityReviewSchema);
