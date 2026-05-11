import mongoose, {Schema, Document} from "mongoose";

export interface IRecruitActivity extends Document {
    title: string;
    description: string;
    category: string;
}

const RecruitActivitySchema = new Schema<IRecruitActivity>({
    title: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true}
});

export default mongoose.models.RecruitActivity ||
mongoose.model<IRecruitActivity>("RecruitActivity", RecruitActivitySchema);
