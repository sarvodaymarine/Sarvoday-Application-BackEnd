import { NextFunction, Router, Request, Response } from 'express';
import { UserController } from '@src/modules/authentication_module/application/controller/user.controller';
import { UserService } from '@src/modules/authentication_module/domain/services/user.services';
import { UserRepositoryImpl } from '@src/modules/authentication_module/infrastructure/persistence/user.repository';
import {
  validateUser,
  validateLoginCredentical,
} from '@src/modules/authentication_module/application/middleware/user.middleware';
import { authMiddleware } from '@src/infrastructure/security/auth.middleware';
import { checkFirstLogin } from '@src/modules/authentication_module/application/middleware/first_time_login_check.middleware';

const userRepository = new UserRepositoryImpl();
const createUser = new UserService(userRepository);
const userController = new UserController(createUser);
const router = Router();

router.post(
  '/provideAuthAccess',
  authMiddleware,
  validateUser,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    userController.provideAuthAcess(req, res, next),
);

router.post(
  '/:id/changePassword',
  // authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    userController.changePassword(req, res, next),
);

router.post(
  '/userLogin',
  // validateLoginCredentical,
  // checkFirstLogin,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    userController.userLogin(req, res, next),
);

// router.delete(
//   'deleteUser/:id',
//   (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
//     userController.deleteUser(req, res, next),
// );

router.get(
  '/:id/get',
  // authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    userController.getUserById(req, res, next),
);

export default router;
