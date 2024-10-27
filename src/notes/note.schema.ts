import { z } from 'zod';
import { ControllerZodSchemaType, requiredStringSchema } from '../schema/common';

const noteSchema = z.object({
  title: requiredStringSchema('Title'),
  content: requiredStringSchema('Content'),
});

export const createNoteInput: ControllerZodSchemaType = z.object({
  body: noteSchema,
  query: z.object({}),
  params: z.object({}),
});

export const updateNoteInput: ControllerZodSchemaType = z.object({
  body: noteSchema.partial(),
  query: z.object({}),
  params: z.object({ id: z.string() }),
});

export const getNoteInput: ControllerZodSchemaType = z.object({
  body: z.object({}),
  query: z.object({}),
  params: z.object({ id: z.string() }),
});

export const shareNoteInput: ControllerZodSchemaType = z.object({
  body: z.object({ userId: z.string() }),
  query: z.object({}),
  params: z.object({ id: z.string() }),
});

export const searchNotesInput: ControllerZodSchemaType = z.object({
  body: z.object({}),
  query: z.object({ q: z.string() }),
  params: z.object({}),
});