import { ErrorRequestHandler, RequestHandler } from "express";
import { CustomHttpError } from "../services/custom-errors";
import { z } from "zod";
import logger from '../utils/logger';

export const wrongPathHandler: RequestHandler = (req, res) => {
  res.status(404).json({ message: "Route does not exist" });
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  logger.error('Error occurred:', { error });

  let statusCode = 500;
  let message = 'Something went wrong';
  let additionalInfo = {};

  if (error instanceof CustomHttpError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof z.ZodError) {
    statusCode = 422;
    message = 'Validation error';
    additionalInfo = {
      errors: error.issues.map((err) => ({
        path: err.path.slice(1).join("."),
        message: err.message
      }))
    };
  }

  if (process.env.NODE_ENV === 'production') {
    res.status(statusCode).json({ message, ...additionalInfo });
  } else {
    res.status(statusCode).json({
      message,
      ...additionalInfo,
      stack: error.stack,
      error: error.toString()
    });
  }
};