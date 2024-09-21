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
    return next(new HttpException(401, 'Unauthorised'));
  }

  const accessToken = bearer.split('Bearer ')[1].trim();
  try {
    const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(accessToken);

    if (payload instanceof jwt.JsonWebTokenError) {
      return next(new HttpException(401, 'Unauthorised'));
    }
    const user = await UserModel.findById(payload.id)
      .where('isDeleted')
      .equals(false)
      .where('isActive')
      .equals(true)
      .select('-password')
      .exec();
    if (!user) {
      return next(new HttpException(401, 'Unauthorised'));
    }

    req.userId = user._id;
    req.userRole = user.userRole;
    req.user = user;
    return next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return next(new HttpException(401, 'Unauthorised'));
  }
}

export const authorizeAdminOrSuperAdminRole = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.userRole != null && (req.userRole == UserRoles.ADMIN || req.userRole == UserRoles.SUPERADMIN)) {
    next();
  } else {
    next(new HttpException(403, "Permission Denied! You don't have access"));
  }
};

export const authorizeSuperAdminRole = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.userRole != null && req.userRole == UserRoles.SUPERADMIN) {
    next();
  } else {
    next(new HttpException(403, "Permission Denied! You don't have access"));
  }
};
