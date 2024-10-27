import { Document, Types } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  user: Types.ObjectId;
  sharedWith: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateNote {
  title: string;
  content: string;
}

export interface IUpdateNote {
  title?: string;
  content?: string;
}

export interface IShareNote {
  userId: string;
}