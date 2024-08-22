import { NextFunction, Router, Request, Response } from 'express';
import { ServiceRepositoryImpl } from '@src/modules/services_module/infrastructure/persistence/service.repository';
import { ServiceServices } from '@src/modules/services_module/domain/services/service.service';
import { ServiceController } from '@src/modules/services_module/application/controller/services.controller';
// import {
//   validateServiceData,
//   validateServiceUpdatedData,
//   validateServiceApiParams,
// } from '@src/modules/services_module/application/middleware/services.middleware';

const serviceRepositoryImpl = new ServiceRepositoryImpl();
const servicesAPI = new ServiceServices(serviceRepositoryImpl);
const serviceController = new ServiceController(servicesAPI);
const router = Router();

router.post(
  '/addService',
  // validateServiceData,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    serviceController.addService(req, res, next),
);

router.put(
  '/updateService/:id',
  // validateServiceUpdatedData,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    serviceController.updateService(req, res, next),
);

router.delete(
  '/deleteService/:id',
  // validateServiceApiParams,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    serviceController.deleteService(req, res, next),
);

router.get(
  '/getService/:id',
  // validateServiceApiParams,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    serviceController.getServiceById(req, res, next),
);

router.get(
  '/getServicebyName/:serviceName',
  // validateServiceApiParams,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    serviceController.getServiceByName(req, res, next),
);

router.get(
  '/getAllService',
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    serviceController.getAllServices(req, res, next),
);

export default router;
