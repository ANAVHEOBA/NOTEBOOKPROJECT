import { RequestHandler } from 'express';
import { NoInput, RequestSchema } from "../schema/common";
import { BadRequest } from "../services/custom-errors";
import jwtService, { JWTUser } from "../services/jwt";
import userRepository from "./user.crud";
import { emailService } from '../services/email.service';
import appConfig from '../config/app-config';
import { generateVerificationToken, verifyToken } from '../utils/token';
import {
  authenticateUserInput,
  createUserInput,
  updateUserInput,
  userVerificationInput,
} from "./user.schema";

class UserController {
  createUser: RequestSchema<typeof createUserInput> = async (req, res) => {
    const { email, firstName, lastName, password } = req.body;

    await userRepository.confirmEmailDoesNotExists(email);

    const user = await userRepository.createUser({
      email,
      firstName,
      lastName,
      password,
    });

    const accessToken = jwtService.createAccessToken({
      email,
      id: user.id,
      verified: user.verified,
    });

    const verificationToken = generateVerificationToken(user.id);
    const verificationLink = `http://localhost:${appConfig.PORT}/api/users/verify/${verificationToken}`;

    await emailService.sendWelcomeEmail(firstName, email, verificationLink);

    res
      .status(201)
      .json({ message: "User created successfully. Please check your email to verify your account.", accessToken });
  };

  verifyEmail: RequestHandler = async (req, res) => {
    const { token } = req.params;
  
    const userId = await verifyToken(token);
  
    if (!userId) {
      res.status(400).json({ message: 'Invalid or expired verification token' });
      return; 
    }
  
    await userRepository.verifyUser(userId);
  
    res.status(200).json({ message: 'Email verified successfully' });
    return; 
  };

  verifyUser: RequestSchema<typeof userVerificationInput, JWTUser> = async (
    req,
    res
  ) => {
    const { id } = res.locals.user;
    const { otp } = req.body;

    
    if (otp !== "0000") {
      throw new BadRequest("Invalid OTP");
    }

    await userRepository.verifyUser(id);

    res.status(200).json({ message: "User has been verified" });
  };

  authenticateUser: RequestSchema<typeof authenticateUserInput> = async (
    req,
    res
  ) => {
    const { email, password } = req.body;

    const user = await userRepository.findUserIfCredentialsAreValid(
      email,
      password
    );

    const accessToken = jwtService.createAccessToken({
      email: user.email,
      id: user.id,
      verified: user.verified,
    });

    res.status(200).json({ accessToken });
  };

  getCurrentUser: RequestSchema<typeof NoInput, JWTUser> = async (req, res) => {
    const { id } = res.locals.user;

    const user = await userRepository.findUserById(id);

    res.status(200).json(user);
  };

  updateUser: RequestSchema<typeof updateUserInput, JWTUser> = async (
    req,
    res
  ) => {
    const { id } = res.locals.user;
    const {
      contact,
      dateOfBirth,
      firstName,
      gender,
      lastName,
      occupation,
      picture,
      bio,
    } = req.body;

    await userRepository.updateUser(id, {
      contact,
      dateOfBirth,
      firstName,
      gender,
      lastName,
      occupation,
      bio,
      picture,
    });

    res.status(200).json({ message: "User updated successfully." });
  };
}

const userController = new UserController();

export default userController;