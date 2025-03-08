import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
  lastLogin?: Date;
  multiverseId?: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  multiverseId: {
    type: String
  },
  lastLogin: { type: Date },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
