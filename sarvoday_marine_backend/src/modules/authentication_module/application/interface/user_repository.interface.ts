import { BaseUser } from '@src/shared/interface/base_user.interface';
import { LoginCredential, User } from './user.interface';
import mongoose, { ClientSession } from 'mongoose';

export interface UserRepository {
  create(user: BaseUser, options: { session?: ClientSession }): Promise<User>;
  login(loginCredential: LoginCredential): Promise<string>;
  update(id: mongoose.Types.ObjectId, updatedUserDetail: Partial<BaseUser>): Promise<User | null>;
  delete(id: mongoose.Types.ObjectId): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findUserByMobile(countryCode: string, mobile: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  changePassword(id: string, newPassword: string): Promise<void>;
}
