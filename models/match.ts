import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMatch extends Document {
  users: Types.ObjectId[];
  matchedAt: Date;
}

const MatchSchema: Schema<IMatch> = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  matchedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Match || mongoose.model<IMatch>("Match", MatchSchema);
