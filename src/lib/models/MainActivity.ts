import mongoose, {Schema, Document} from "mongoose";

export interface IMainActivity extends Document {
    title: string;
    description: string;
}

const MainActivitySchema = new Schema<IMainActivity>({
    title: {type: String, required: true},
    description: {type: String, required: true},
});

export default mongoose.models.MainActivity ||
mongoose.model<IMainActivity>("MainActivity", MainActivitySchema);
