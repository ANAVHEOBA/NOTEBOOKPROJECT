import express, { NextFunction, Request, Response } from "express";
import { ControllerZodSchemaType } from "../schema/common";

const bodyParserMiddleware = express.json();

export const validateInput = (schema: ControllerZodSchemaType) => {
  const validatorMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { body, params, query } = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.body = body;
    req.params = params;
    req.query = query;

    return next();
  };

  return [bodyParserMiddleware, validatorMiddleware];
};
