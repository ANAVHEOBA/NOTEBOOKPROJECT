import jwt from "jsonwebtoken";
import appConfig from "../config/app-config";

export interface JWTPayload {
  id: string;
  email: string;
  verified: boolean;
}

export interface JWTUser {
  user: JWTPayload;
}

class JWTService {
  createAccessToken = (payload: JWTPayload): string => {
    const token: string = jwt.sign(payload, appConfig.JWT_SECRET, {
      expiresIn: "2d",
    });
    return token;
  };

  decodeAccessToken = (token: string): JWTPayload => {
    const { id, email, verified } = jwt.verify(
      token,
      appConfig.JWT_SECRET
    ) as jwt.JwtPayload & JWTPayload;
    return { id, email, verified };
  };
}

const jwtService = new JWTService();

export default jwtService;
