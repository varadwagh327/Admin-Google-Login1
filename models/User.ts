import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  avatar: string;
  role: string;
  provider: string;
  providerId: string;
  birthday?: string;  // optional
  phone?: string;     // optional
  address?: string;   // optional
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    role: { type: String, default: "User" },
    provider: String,
    providerId: String,
    birthday: { type: String, default: "" }, // optional
    phone: { type: String, default: "" },    // optional
    address: { type: String, default: "" },  // optional
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", userSchema);
export default User;
