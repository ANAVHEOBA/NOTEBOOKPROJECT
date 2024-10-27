import mongoose from "mongoose";
import { IUserCreate, IUserUpdate, UserDocument } from "./user.interface";
import UserModel, { SecretModel } from "./user.model";
import { escapeRegExp } from '../utils/stringUtils';
import bcrypt from 'bcrypt';

import {
  BadRequest,
  NotFound,
  Unauthenticated,
} from "../services/custom-errors";

class UserRepository {
  createUser = async (data: IUserCreate): Promise<UserDocument> => {
    const { email, firstName, lastName, password } = data;

    let user = null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      const result = await UserModel.create([{ email, firstName, lastName }]);
      user = result[0];
      await SecretModel.create([{ password: hashedPassword, user: user._id }], {
        session,
      });

      return result;
    });
    session.endSession();

    if (!user) {
      throw new Error("Failed to create user");
    }

    return user;
  };

  verifyUser = async (userId: string): Promise<void> => {
    await UserModel.updateOne({ _id: userId }, { verified: true });
  };

  updateUser = async (
    userId: string,
    data: IUserUpdate
  ): Promise<UserDocument> => {
    const user = await UserModel.findOneAndUpdate({ _id: userId }, data);

    if (!user) {
      throw new NotFound("User does not exist");
    }

    return user;
  };

  async findUserById(userId: string): Promise<UserDocument> {
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      throw new NotFound("User does not exist");
    }

    return user;
  }

  findUserByEmail = async (email: string): Promise<UserDocument> => {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new NotFound("User does not exist");
    }

    return user;
  };

  confirmEmailDoesNotExists = async (email: string): Promise<void> => {
    const user = await UserModel.findOne({ email });

    if (user) {
      throw new BadRequest("Email is already registered.");
    }
  };

  findUserIfCredentialsAreValid = async (
    email: string,
    password: string
  ): Promise<UserDocument> => {
    try {
      const user = await this.findUserByEmail(email);

      const userSecret = await SecretModel.findOne({ user: user._id });

      const isPasswordCorrect = await bcrypt.compare(password, userSecret!.password);

      if (!isPasswordCorrect) {
        throw new Unauthenticated("Invalid email or password");
      }

      return user;
    } catch (error) {
      console.error(error);
      throw new Unauthenticated("Invalid email or password.");
    }
  };
}

const userRepository = new UserRepository();

export default userRepository;