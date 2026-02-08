import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  email: string;
  kakaotalkLink: string;
  instagramLink: string;
  isRecruiting: boolean;
  recruitMessage?: string;
  recruitLink: string;
}

const ContactSchema = new Schema<IContact>({
  email: { type: String, default: "" },
  kakaotalkLink: { type: String, default: "" },
  instagramLink: { type: String, default: "" },
  isRecruiting: { type: Boolean, default: false },
  recruitMessage: { type: String },
  recruitLink: { type: String, default: "" },
});

// Delete cached model to pick up schema changes during HMR
if (mongoose.modelNames().includes("Contact")) {
  mongoose.deleteModel("Contact");
}
export default mongoose.model<IContact>("Contact", ContactSchema);
