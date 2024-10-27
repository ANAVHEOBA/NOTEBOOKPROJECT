import { RequestHandler } from "express";
import { z, ZodObject } from "zod";

export const requiredStringSchema = (field: string) => {
  return z.string({ required_error: `${field} is required` });
};

export const convertRequiredStringToNumberSchema = (field: string) => {
  return requiredStringSchema(field)
    .regex(/^\d+$/, "Only digits are allowed.")
    .transform((val) => Number(val));
};

export const passwordSchema = (field: string = "Password") => {
  return requiredStringSchema(field)
    .min(8, "Password cannot be less than 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/,
      "Password must contain lowercase, uppercase, number and special character"
    );
};

export const dateSchema = (field: string) => {
  return z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date({ required_error: `${field} is required` }));
};

export const NoInput = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({}),
});

export type ControllerZodSchemaType = ZodObject<{
  body: ZodObject<any>;
  query: ZodObject<any>;
  params: ZodObject<any>;
}>;

export type RequestSchema<
  T extends ControllerZodSchemaType,
  R extends Record<string, any> = {}
> = RequestHandler<
  z.infer<T>["params"],
  any,
  z.infer<T>["body"],
  z.infer<T>["query"],
  R
>;
