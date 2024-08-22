import { UserDocument } from '@src/modules/authentication_module/domain/models/user.model';
import Token from '@src/shared/interface/token.interface';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const createToken = (user: UserDocument): string => {
  const secret = process.env.JWT_SECREAT;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign({ id: user._id, userRole: user.userRole }, secret as jwt.Secret, {
    expiresIn: '7d',
  });
};

export const verifyToken = async (token: string): Promise<jwt.VerifyErrors | Token> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECREAT as jwt.Secret, (err, payload) => {
      if (err) return reject(err);

      resolve(payload as Token);
    });
  });
};

export default { createToken, verifyToken };
