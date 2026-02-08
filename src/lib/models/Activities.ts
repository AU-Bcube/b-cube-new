import mongoose, { Schema, Document } from "mongoose";

export interface IActivities extends Document {
  title: string;
  description: string;
  imagePath: string;
  pdfPath: string;
}

const ActivitiesSchema = new Schema<IActivities>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imagePath: { type: String, required: true },
  pdfPath: { type: String, required: true },
});

export default mongoose.models.Activities ||
  mongoose.model<IActivities>("Activities", ActivitiesSchema);
