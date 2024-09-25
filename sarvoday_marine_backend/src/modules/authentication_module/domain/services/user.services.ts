import { UserRepositoryImpl } from '../../infrastructure/persistence/user.repository';
import { UserRoles } from '@src/shared/enum/user_roles.enum';
import { LoginCredential, User } from '../../application/interface/user.interface';
import { BaseUser } from '@src/shared/interface/base_user.interface';
import mongoose from 'mongoose';
import { sendLoginCredentialEmail } from '@src/infrastructure/security/email_triggeration_function';
export class UserService {
  constructor(private userRepositoryImpl: UserRepositoryImpl) {}

  async provideAuthService(
    firstName: string,
    lastName: string,
    email: string,
    countryCode: string,
    mobile: string,
    userRole: UserRoles,
    isActive = true,
  ): Promise<User> {
    const user: BaseUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      countryCode: countryCode,
      mobile: mobile,
      userRole: userRole,
      isActive: isActive,
      isDeleted: false,
    };
    const existUser = await this.userRepositoryImpl.findUserByEmailAndMobile(email, mobile);
    if (!existUser) {
      const resultUser = await this.userRepositoryImpl.create(user);
      if (isActive) {
        sendLoginCredentialEmail(
          resultUser.email,
          `${resultUser.firstName} ${resultUser.lastName}`,
          resultUser.dummyText,
        );
      }
      return resultUser;
    } else {
      throw new Error('User is already Exist');
    }
  }

  async loginService(email: string, password: string): Promise<string> {
    const logincredential: LoginCredential = { email, password };
    return await this.userRepositoryImpl.login(logincredential);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepositoryImpl.findById(id);
  }

  async changePasswordService(id: string, newPassword: string): Promise<void | null> {
    const user = await this.userRepositoryImpl.findById(id);
    if (user && ((user.isFirstLogin ?? false) || (user.isPasswordReset ?? false))) {
      return this.userRepositoryImpl.changePassword(id, newPassword);
    } else {
      throw new Error('Bad Request!');
    }
  }

  async resetPasswordService(id: string): Promise<void | null> {
    const user = await this.userRepositoryImpl.findById(id);
    if (user) {
      return this.userRepositoryImpl.resetPassword(id);
    } else {
      throw new Error('Bad Request!');
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepositoryImpl.findByEmail(email);
  }

  async getUserByMobile(countryCode: string, mobile: string): Promise<User | null> {
    return this.userRepositoryImpl.findUserByMobile(countryCode, mobile);
  }

  async deleteUser(id: mongoose.Types.ObjectId): Promise<void> {
    return this.userRepositoryImpl.delete(id);
  }

  async updateUserDetail(id: mongoose.Types.ObjectId, updateDetails: Partial<User>): Promise<User | null> {
    return await this.userRepositoryImpl.update(id, updateDetails);
  }

  async EnableDisableUserAuth(id: string, updateDetails: Partial<User>): Promise<User | null> {
    const userId = new mongoose.Types.ObjectId(id);
    const existUser = await this.userRepositoryImpl.update(userId, updateDetails);
    if (existUser && existUser.isActive && existUser.isFirstLogin) {
      sendLoginCredentialEmail(existUser.email, `${existUser.firstName} ${existUser.lastName}`, existUser.dummyText);
    }
    return existUser;
  }

  async getAllUsers(): Promise<User[] | null> {
    return await this.userRepositoryImpl.getAllUsers();
  }
}
