import express from 'express';
import { validateInput } from '../middleware/input-validator';
import {
  authenticateUserInput,
  createUserInput,
  updateUserInput,
  userVerificationInput,
} from './user.schema';
import userController from './user.controller';
import { checkIfAuthenticated } from '../middleware/auth';

const userRouter = express.Router();

userRouter
  .route('/')
  .post(validateInput(createUserInput), userController.createUser)
  .patch(
    validateInput(updateUserInput),
    checkIfAuthenticated,
    userController.updateUser
  );

userRouter
  .route('/auth')
  .post(validateInput(authenticateUserInput), userController.authenticateUser);

userRouter
  .route('/verify/:token')
  .get(userController.verifyEmail);

userRouter
  .route('/current-user')
  .get(checkIfAuthenticated, userController.getCurrentUser);

export default userRouter;