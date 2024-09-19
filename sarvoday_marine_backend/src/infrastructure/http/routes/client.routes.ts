import { NextFunction, Router, Response, Request } from 'express';
import { ClientRepositoryImpl } from '@src/modules/client_module/infrastructure/persistence/client.repository';
import { ClientServices } from '@src/modules/client_module/domain/services/client.services';
import { ClientController } from '@src/modules/client_module/application/controller/client.controller';
// import {
//   validateClientApiParams,
//   validateUpdatedClientReqData,
// } from '@src/modules/client_module/application/middleware/client.middleware';
import { UserRepositoryImpl } from '@src/modules/authentication_module/infrastructure/persistence/user.repository';
import { UserService } from '@src/modules/authentication_module/domain/services/user.services';
import { authMiddleware, authorizeAdminOrSuperAdminRole } from '@src/infrastructure/security/auth.middleware';

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
  // validateClientRequestBody,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    clientController.addClient(req, res, next),
);

router.put(
  '/updateClient/:id',
  // validateUpdatedClientReqData,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    clientController.updateClient(req, res, next),
);

router.delete(
  '/deleteClient/:id',
  // validateClientApiParams,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    clientController.deleteClient(req, res, next),
);

// router.get(
//   '/getClient/:id',
//   // validateClientApiParams,
//   (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
//     clientController.getClientById(req, res, next),
// );

// router.get(
//   '/getClientByMobile:countryCode/:mobile',
//   validateClientApiParams,
//   (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
//     clientController.getClientByMobile(req, res, next),
// );

router.get(
  '/getAllClients',
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    clientController.getAllClients(req, res, next),
);

router.get(
  '/getAllClientDetails',
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    clientController.getAllClientDetails(req, res, next),
);

export default router;
