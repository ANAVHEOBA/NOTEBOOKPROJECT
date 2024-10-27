import mongoose, { Schema } from 'mongoose';
import { INote } from './note.interface';

const noteSchema = new Schema<INote>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

noteSchema.index({ title: 'text', content: 'text' });

const NoteModel = mongoose.model<INote>('Note', noteSchema);

export default NoteModel;