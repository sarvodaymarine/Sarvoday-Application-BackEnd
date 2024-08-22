import Token from '@src/shared/interface/token.interface';
import HttpException from '@src/shared/utils/exceptions/http.exception';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import token from './token';
import { UserModel } from '@src/modules/authentication_module/domain/models/user.model';
import mongoose from 'mongoose';
import { UserRoles } from '@src/shared/enum/user_roles.enum';

export interface CustomRequest extends Request {
  userRole?: UserRoles;
  userId?: mongoose.Types.ObjectId;
}

export async function authMiddleware(req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> {
  const bearer = req.headers.authorization;
  console.log('bearer', bearer);

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return next(new HttpException(401, 'Unauthorised 1'));
  }

  const accessToken = bearer.split('Bearer ')[1].trim();
  try {
    const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(accessToken);

    if (payload instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, 'Unauthorised 2'));
    }
    const user = await UserModel.findById(payload.id).select('-password').exec();
    if (!user) {
      return next(new HttpException(401, 'Unauthorised 3'));
    }

    req.userId = user._id;
    req.userRole = user.userRole;
    req.user = user;

    return next();
  } catch (error) {
    return next(new HttpException(401, 'Unauthorised 4'));
  }
}

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return res.status(403).json({ error: 'Access denied.' });
    next();
  };
};
