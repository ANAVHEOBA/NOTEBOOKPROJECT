import express from 'express';
import { validateInput } from '../middleware/input-validator';
import { checkIfAuthenticated } from '../middleware/auth';
import noteController from './note.controller';
import rateLimit from 'express-rate-limit';
import { createNoteInput, getNoteInput, updateNoteInput, shareNoteInput, searchNotesInput } from './note.schema';

const noteRouter = express.Router();

const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // just 15 minutes e get why
  max: 100 // the Ip is just 100 requests
});

noteRouter.use(checkIfAuthenticated);

noteRouter.route('/')
  .post(validateInput(createNoteInput), noteController.createNote)
  .get(noteController.getNotes);

noteRouter.route('/shared')
  .get(noteController.getSharedNotes);

noteRouter.route('/search')
  .get(validateInput(searchNotesInput), noteController.searchNotes);

noteRouter.route('/:id')
  .get(validateInput(getNoteInput), noteController.getNote)
  .put(validateInput(updateNoteInput), noteController.updateNote)
  .delete(validateInput(getNoteInput), noteController.deleteNote);

noteRouter.route('/:id/share')
  .post(validateInput(shareNoteInput), noteController.shareNote);

noteRouter.route('/search')
  .get(searchLimiter, validateInput(searchNotesInput), noteController.searchNotes);

export default noteRouter;