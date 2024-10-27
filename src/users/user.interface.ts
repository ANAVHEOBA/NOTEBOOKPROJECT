import mongoose, { HydratedDocument } from "mongoose";

interface UserBase {
  firstName: string;
  lastName: string;
}

export interface IUserCreate extends UserBase {
  email: string;
  password: string;
}

export interface IUserUpdate extends UserBase {
  bio?: string;
  dateOfBirth: Date;
  contact: string;
  gender: "male" | "female";
  occupation: "employed" | "self-employed" | "unemployed" | "student";
  picture: string;
}

export interface IUser extends IUserUpdate, Omit<IUserCreate, "password"> {
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserSecret {
  password: string;
  user: mongoose.Types.ObjectId;
}

export type UserDocument = HydratedDocument<IUser>;
