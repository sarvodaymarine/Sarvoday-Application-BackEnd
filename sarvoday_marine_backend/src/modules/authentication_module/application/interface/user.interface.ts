import { BaseUser } from '@src/shared/interface/base_user.interface';
import mongoose from 'mongoose';

interface CreateUser extends BaseUser {
  password: string;
  dummyPassword: string;
  dummyText: string;
  isFirstLogin: boolean;
  isPasswordReset: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface User extends CreateUser {
  _id: mongoose.Types.ObjectId;
}

interface LoginCredential {
  email: string;
  password: string;
}

export { CreateUser, User, LoginCredential };
