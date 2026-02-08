import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  email: string;
  kakaotalkLink: string;
  instagramLink: string;
}

const ContactSchema = new Schema<IContact>({
  email: { type: String, required: true },
  kakaotalkLink: { type: String, required: true },
  instagramLink: { type: String, required: true },
});

export default mongoose.models.Contact ||
  mongoose.model<IContact>("Contact", ContactSchema);
