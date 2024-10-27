import { RequestHandler } from "express";
import jwtService, { JWTPayload, JWTUser } from "../services/jwt";
import userRepository from "../users/user.crud";
import {
  CustomHttpError,
  Forbidden,
  Unauthenticated,
} from "../services/custom-errors";
import { NoInput, RequestSchema } from "../schema/common";

export const checkIfAuthenticated: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new Error("Bearer token not provided.");
    }
    const authToken = authorization.split(" ")[1];
    const { id } = jwtService.decodeAccessToken(authToken);

    const user = await userRepository.findUserById(id);

    const userData: JWTPayload = {
      email: user.email,
      id: user.id,
      verified: user.verified,
    };

    res.locals.user = userData;

    next();
  } catch (error) {
    // If the error is a custom error, throw the custom error
    if (error instanceof CustomHttpError) {
      throw error;
    }
    // for all other errors, Unauthenticated error will be thrown
    throw new Unauthenticated("Cannot authenticate user");
  }
};

export const checkIfVerified: RequestSchema<typeof NoInput, JWTUser> = async (
  req,
  res,
  next
) => {
  await checkIfAuthenticated(req, res, () => {
    if (!res.locals.user.verified) {
      throw new Forbidden("Email has not been verified");
    }
    next();
  });
};
