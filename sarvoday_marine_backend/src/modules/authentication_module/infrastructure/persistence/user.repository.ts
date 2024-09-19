import mongoose from 'mongoose';
import { LoginCredential, User } from '../../application/interface/user.interface';
import { UserRepository } from '../../application/interface/user_repository.interface';
import { UserModel } from '../../domain/models/user.model';
import { createToken } from '@src/infrastructure/security/token';
import { BaseUser } from '@src/shared/interface/base_user.interface';
export class UserRepositoryImpl implements UserRepository {
  async create(user: BaseUser /*options: { session?: ClientSession }*/): Promise<User> {
    const userModel = new UserModel(user);
    return await userModel.save(/*options*/);
  }

  async findUserByEmailAndMobile(email: string, mobile: string): Promise<User | null> {
    const query = {
      $or: [{ email: email }, { mobile: mobile }],
    };
    const user = await UserModel.findOne(query);
    return user ? user.toJSON() : null;
  }

  async login(loginCredential: LoginCredential): Promise<string> {
    const email: string = loginCredential.email;
    const user = await UserModel.findOne({ email })
      .where('isActive')
      .equals(true)
      .where('isDeleted')
      .equals(false)
      .exec();

    if (user == null) {
      throw new Error("User doesn't exist with this email, deactivated or deleted.");
    }
    const isPasswordMatched = await user.isValidPassword(loginCredential.password);
    if (isPasswordMatched instanceof Error) {
      throw new Error('Invalid login credential');
    }
    return createToken(user);
  }

  async changePassword(id: string, newPassword: string): Promise<void> {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error('User Not Found');
    }
    await user.setPassword(newPassword);
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id).where('isDeleted').equals(false).exec();
    return user ? user.toJSON() : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).where('isDeleted').equals(false).exec();
    return user ? user.toJSON() : null;
  }

  async findUserByMobile(countryCode: string, mobile: string): Promise<User | null> {
    const user = await UserModel.findOne({ countryCode, mobile }).where('isDeleted').equals(false).exec();
    return user ? user.toJSON() : null;
  }

  async update(id: mongoose.Types.ObjectId, updatedUserDetail: Partial<User>): Promise<User | null> {
    return await UserModel.findOneAndUpdate({ _id: id }, { $set: updatedUserDetail }, { new: true }).exec();
  }

  async delete(id: mongoose.Types.ObjectId): Promise<void> {
    await UserModel.findByIdAndUpdate(
      { _id: id },
      { $set: { isDeleted: true, isActive: false } },
      { new: true },
    ).exec();
  }

  async getAllUsers(): Promise<User[]> {
    return await UserModel.find().where('isDeleted').equals(false);
  }
}
