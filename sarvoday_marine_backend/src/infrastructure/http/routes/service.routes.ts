import { NextFunction, Router, Request, Response } from 'express';
import { ServiceRepositoryImpl } from '@src/modules/services_module/infrastructure/persistence/service.repository';
import { ServiceServices } from '@src/modules/services_module/domain/services/service.service';
import { ServiceController } from '@src/modules/services_module/application/controller/services.controller';
import { authMiddleware, authorizeAdminOrSuperAdminRole } from '@src/infrastructure/security/auth.middleware';

const serviceRepositoryImpl = new ServiceRepositoryImpl();
const servicesAPI = new ServiceServices(serviceRepositoryImpl);
const serviceController = new ServiceController(servicesAPI);
const router = Router();

router.post(
  '/addService',
  authMiddleware,
  authorizeAdminOrSuperAdminRole,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    serviceController.addService(req, res, next),
);

router.put(
  '/updateService/:id',
  authMiddleware,
  authorizeAdminOrSuperAdminRole,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    serviceController.updateService(req, res, next),
);

router.delete(
  '/deleteService/:id',
  authMiddleware,
  authorizeAdminOrSuperAdminRole,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    serviceController.deleteService(req, res, next),
);

router.get(
  '/getService/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    serviceController.getServiceById(req, res, next),
);

router.get(
  '/getServicebyName/:serviceName',
  authMiddleware,
  // validateServiceApiParams,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    serviceController.getServiceByName(req, res, next),
);

router.get(
  '/getAllService',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    serviceController.getAllServices(req, res, next),
);

router.get(
  '/getImageConfigForReport',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    serviceController.getReportServiceImageConfig(req, res, next),
);

export default router;
