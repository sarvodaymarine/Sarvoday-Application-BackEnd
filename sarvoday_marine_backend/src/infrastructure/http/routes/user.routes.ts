import { NextFunction, Router, Request, Response } from 'express';
import { UserController } from '@src/modules/authentication_module/application/controller/user.controller';
import { UserService } from '@src/modules/authentication_module/domain/services/user.services';
import { UserRepositoryImpl } from '@src/modules/authentication_module/infrastructure/persistence/user.repository';
import {
  validateUser,
  validateLoginCredentical,
} from '@src/modules/authentication_module/application/middleware/user.middleware';
import { authMiddleware, authorizeAdminOrSuperAdminRole } from '@src/infrastructure/security/auth.middleware';

const userRepository = new UserRepositoryImpl();
const createUser = new UserService(userRepository);
const userController = new UserController(createUser);
const router = Router();

router.post(
  '/provideAuthAccess',
  authMiddleware,
  authorizeAdminOrSuperAdminRole,
  validateUser,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    userController.provideAuthAcess(req, res, next),
);

router.post(
  '/validateUserToken',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    userController.validateUserToken(req, res, next),
);

router.post(
  '/:id/changePassword',
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    userController.changePassword(req, res, next),
);

router.post(
  '/userLogin',
  validateLoginCredentical,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    userController.userLogin(req, res, next),
);

router.put(
  '/enableDisable/:id',
  authMiddleware,
  authorizeAdminOrSuperAdminRole,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    userController.activeDeActiveUserAuth(req, res, next),
);

router.get(
  '/:id/get',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    userController.getUserById(req, res, next),
);

export default router;
