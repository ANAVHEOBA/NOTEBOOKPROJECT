import mongoose from "mongoose";
import { IUser, IUserSecret } from "./user.interface";

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    bio: { type: String, required: false },
    contact: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    gender: {
      type: String,
      required: false,
      enum: { values: ["male", "female"] },
    },
    occupation: {
      type: String,
      required: false,
      enum: { values: ["employed", "self-employed", "unemployed", "student"] },
    },
    picture: { type: String, required: false },
    verified: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const secretSchema = new mongoose.Schema<IUserSecret>({
  password: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },
});

const UserModel = mongoose.model<IUser>("User", userSchema);
export const SecretModel = mongoose.model<IUserSecret>("Secret", secretSchema);

export default UserModel;
