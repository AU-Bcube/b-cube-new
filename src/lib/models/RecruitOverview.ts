import mongoose, {Schema, Document} from "mongoose";

export interface IRecruitOverview extends Document {
    title: string;
    description: string;
}

const RecruitOverviewSchema = new Schema<IRecruitOverview>({
    title: {type: String, required: true},
    description: {type: String, required: true},
});

export default mongoose.models.RecruitOverview ||
mongoose.model<IRecruitOverview>("RecruitOverview", RecruitOverviewSchema);
