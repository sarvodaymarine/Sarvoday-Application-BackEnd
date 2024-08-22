import { PasswordHasher } from '@src/infrastructure/security/password.hasher';
import { UserRoles } from '@src/shared/enum/user_roles.enum';
import mongoose, { Schema, Document, Types } from 'mongoose';
import { CreateUser } from '../../application/interface/user.interface';

interface UserDocument extends CreateUser, Document {
  _id: Types.ObjectId;
  isValidPassword(password: string): Promise<Error | boolean>;
  setPassword(newPassword: string): Promise<void>;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    countryCode: { type: String, required: true },
    mobile: { type: String, required: true },
    userRole: { type: String, enum: Object.values(UserRoles), required: true },
    password: { type: String },

    dummyPassword: { type: String },
    isFirstLogin: { type: Boolean, default: true },
    isActive: { type: Boolean, required: true },
    isDeleted: { type: Boolean, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.dummyPassword;
        return ret;
      },
      virtuals: true,
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.dummyPassword;
        return ret;
      },
      virtuals: true,
    },
  },
);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isFirstLogin) {
    const dummyPassword = Math.random().toString(36).slice(-8);
    this.dummyPassword = await new PasswordHasher().hashPassword(dummyPassword);
  }
  next();
});

UserSchema.methods.setPassword = async function (newPassword: string): Promise<void> {
  this.password = await new PasswordHasher().hashPassword(newPassword);
  this.dummyPassword = '';
  this.isFirstLogin = false;
  await this.save();
};

UserSchema.methods.isValidPassword = async function (password: string): Promise<Error | boolean> {
  if (this.isFirstLogin) {
    return true /*await new PasswordHasher().comparePassword(password, this.dummyPassword)*/;
  } else {
    return await new PasswordHasher().comparePassword(password, this.password);
  }
};

UserSchema.set('toJSON', { getters: true });
UserSchema.set('toObject', { getters: true });

const UserModel = mongoose.model<UserDocument>('User', UserSchema);
export { UserModel, UserDocument };
