import { RequestHandler } from 'express';
import { RequestSchema } from '../schema/common';
import noteRepository from './note.crud';
import { createNoteInput, getNoteInput, updateNoteInput, shareNoteInput, searchNotesInput } from './note.schema';
import { JWTUser } from '../services/jwt';
import { ICreateNote, IShareNote } from './note.interface';

class NoteController {
  createNote: RequestSchema<typeof createNoteInput, JWTUser> = async (req, res) => {
    const { id: userId } = res.locals.user;
    const { title, content } = req.body as ICreateNote;

    try {
      const note = await noteRepository.createNote(userId, { title, content });
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  getNotes: RequestHandler<{}, any, any, any, JWTUser> = async (req, res) => {
    const { id: userId } = res.locals.user;
    try {
      const notes = await noteRepository.getNotes(userId);
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve notes' });
    }
  };

  getNote: RequestSchema<typeof getNoteInput, JWTUser> = async (req, res) => {
    const { id: userId } = res.locals.user;
    const { id: noteId } = req.params;
    try {
      const note = await noteRepository.getNoteById(userId, noteId);
      res.status(200).json(note);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  updateNote: RequestSchema<typeof updateNoteInput, JWTUser> = async (req, res) => {
    const { id: userId } = res.locals.user;
    const { id: noteId } = req.params;
    try {
      const note = await noteRepository.updateNote(userId, noteId, req.body);
      res.status(200).json(note);
    } catch (error) {
      if (error instanceof Error) {
        res.status(error.message.includes('not found') ? 404 : 400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  deleteNote: RequestSchema<typeof getNoteInput, JWTUser> = async (req, res) => {
    const { id: userId } = res.locals.user;
    const { id: noteId } = req.params;
    try {
      await noteRepository.deleteNote(userId, noteId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(error.message.includes('not found') ? 404 : 400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  shareNote: RequestSchema<typeof shareNoteInput, JWTUser> = async (req, res) => {
    const { id: userId } = res.locals.user;
    const { id: noteId } = req.params;
    const shareData: IShareNote = { ...req.body, userId: req.body.userId };

    try {
      const note = await noteRepository.shareNote(userId, noteId, shareData);
      res.status(200).json(note);
    } catch (error) {
      if (error instanceof Error) {
        res.status(error.message.includes('not found') ? 404 : 400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  };

  getSharedNotes: RequestHandler<{}, any, any, any, JWTUser> = async (req, res) => {
    const { id: userId } = res.locals.user;
    try {
      const notes = await noteRepository.getSharedNotes(userId);
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve shared notes' });
    }
  };

  searchNotes: RequestSchema<typeof searchNotesInput, JWTUser> = async (req, res) => {
    const { id: userId } = res.locals.user;
    const { q: query } = req.query;
    try {
      const notes = await noteRepository.searchNotes(userId, query as string);
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ message: 'Failed to search notes' });
    }
  };
}

const noteController = new NoteController();
export default noteController;
