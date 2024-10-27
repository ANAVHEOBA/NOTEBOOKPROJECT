import { BadRequest, NotFound } from '../services/custom-errors';
import NoteModel from './note.model';
import { ICreateNote, INote, IUpdateNote, IShareNote } from './note.interface';
import { Types } from 'mongoose';
import { escapeRegExp } from '../utils/stringUtils';
import { sanitizeContent } from '../utils/stringUtils';

class NoteRepository {
  async createNote(userId: string, data: ICreateNote): Promise<INote> {
    const sanitizedData = {
      ...data,
      content: sanitizeContent(data.content)
    };
    const note = new NoteModel({
      ...sanitizedData,
      user: userId,
    });
    return note.save();
  }


  async getNotes(userId: string): Promise<INote[]> {
    return NoteModel.find({ user: userId });
  }

  async getNoteById(userId: string, noteId: string): Promise<INote> {
    const note = await NoteModel.findOne({ _id: noteId, $or: [{ user: userId }, { sharedWith: userId }] });
    if (!note) {
      throw new NotFound('Note not found or you do not have permission to access it');
    }
    return note;
  }

  async updateNote(userId: string, noteId: string, data: IUpdateNote): Promise<INote> {
    const sanitizedData = {
      ...data,
      content: data.content ? sanitizeContent(data.content) : undefined
    };
    const note = await NoteModel.findOneAndUpdate(
      { _id: noteId, user: userId },
      sanitizedData,
      { new: true }
    );
    if (!note) {
      throw new NotFound('Note not found');
    }
    return note;
  }

  async deleteNote(userId: string, noteId: string): Promise<void> {
    const result = await NoteModel.deleteOne({ _id: noteId, user: userId });
    if (result.deletedCount === 0) {
      throw new NotFound('Note not found');
    }
  }

  async shareNote(userId: string, noteId: string, shareData: IShareNote): Promise<INote> {
    const note = await NoteModel.findOne({ _id: noteId, user: userId });
    if (!note) {
      throw new NotFound('Note not found');
    }
    if (note.sharedWith.includes(new Types.ObjectId(shareData.userId))) {
      throw new BadRequest('Note already shared with this user');
    }
    note.sharedWith.push(new Types.ObjectId(shareData.userId));
    return note.save();
  }

  async getSharedNotes(userId: string): Promise<INote[]> {
    return NoteModel.find({ sharedWith: userId });
  }

  async searchNotes(userId: string, query: string): Promise<INote[]> {
    // Sanitize the input
    const sanitizedQuery = escapeRegExp(query);

    return NoteModel.find({
      $and: [
        { $text: { $search: sanitizedQuery } },
        { $or: [{ user: userId }, { sharedWith: userId }] }
      ]
    }).sort({ score: { $meta: 'textScore' } });
  }
}

const noteRepository = new NoteRepository();
export default noteRepository;