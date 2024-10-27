import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from "express";
import helmet from 'helmet';
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./config/db";
import appConfig from "./config/app-config";
import userRouter from "./users/user.router";
import noteRouter from './notes/note.router';
import { errorHandler, wrongPathHandler } from "./middleware/error-handler";
import rateLimit from 'express-rate-limit';
import csurf from 'csurf';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeAppLevelMiddlewares();
    this.initializeRoutes();
    this.initializeAppDependables();
  }

  private async initializeAppDependables() {
    await connectDB();
  }

  private initializeAppLevelMiddlewares() {
    this.app.use(morgan("dev"));
    this.app.use(cors({ origin: "*" }));
    this.app.use(express.json());

    // Add helmet middleware for security headers
    this.app.use(helmet());

    // Add rate limiting
    const loginLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5 // limit each IP to 5 login requests per windowMs
    });
    this.app.use('/api/users/login', loginLimiter);

    // Add additional security measures only in production
    if (process.env.NODE_ENV === 'production') {
      // Add CSRF protection
      this.app.use(csurf());

      // Add Content Security Policy
      this.app.use(
        helmet.contentSecurityPolicy({
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
          },
        })
      );
    }
  }

  private initializeRoutes() {
    this.app.get("/", (req, res) => {
      res.status(200).json("App is live!");
    });
    this.app.use("/api/users", userRouter);
    this.app.use('/api/notes', noteRouter);

    // last middlewares
    this.app.use(wrongPathHandler);
    this.app.use(errorHandler);
  }
}

const app = new App().app;

export default app;
