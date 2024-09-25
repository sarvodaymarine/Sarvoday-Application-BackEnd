import { NextFunction, Router, Response, Request } from 'express';
import { ClientRepositoryImpl } from '@src/modules/client_module/infrastructure/persistence/client.repository';
import { ClientServices } from '@src/modules/client_module/domain/services/client.services';
import { ClientController } from '@src/modules/client_module/application/controller/client.controller';
import { UserRepositoryImpl } from '@src/modules/authentication_module/infrastructure/persistence/user.repository';
import { UserService } from '@src/modules/authentication_module/domain/services/user.services';
import {
  authMiddleware,
  authorizeAdminOrSuperAdminRole,
  authorizeSuperAdminRole,
} from '@src/infrastructure/security/auth.middleware';

const clientRepositoryImpl = new ClientRepositoryImpl();
const clientModuleAPI = new ClientServices(clientRepositoryImpl);
const userRepositoryImpl = new UserRepositoryImpl();
const userService = new UserService(userRepositoryImpl);
const clientController = new ClientController(clientModuleAPI, userService);
const router = Router();

router.post(
  '/addClient',
  authMiddleware,
  authorizeAdminOrSuperAdminRole,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    clientController.addClient(req, res, next),
);

router.put(
  '/updateClient/:id',
  authMiddleware,
  authorizeAdminOrSuperAdminRole,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    clientController.updateClient(req, res, next),
);

router.delete(
  '/deleteClient/:id',
  authMiddleware,
  authorizeSuperAdminRole,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    clientController.deleteClient(req, res, next),
);

router.get(
  '/getAllClients',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    clientController.getAllClients(req, res, next),
);

router.get(
  '/getAllClientDetails',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    clientController.getAllClientDetails(req, res, next),
);

export default router;
