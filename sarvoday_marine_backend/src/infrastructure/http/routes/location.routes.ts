import { LocationRepositoryImpl } from '@src/modules/location_module/infrastructure/persistence/location.repository';
import { LocationServices } from '@src/modules/location_module/domain/services/location.service';
import { LocationController } from '@src/modules/location_module/application/controller/location.controller';
import {
  validateLocationApiParams,
  validateLocationData,
  validateUpdatedLocationData,
} from '@src/modules/location_module/application/middleware/location.middleware';
import { NextFunction, Router, Response, Request } from 'express';
import { authMiddleware, authorizeAdminOrSuperAdminRole } from '@src/infrastructure/security/auth.middleware';

const locationRepositoryImpl = new LocationRepositoryImpl();
const locationsAPI = new LocationServices(locationRepositoryImpl);
const locationController = new LocationController(locationsAPI);
const router = Router();

router.post(
  '/addLocation',
  authMiddleware,
  authorizeAdminOrSuperAdminRole,
  validateLocationData,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    locationController.addLocation(req, res, next),
);

router.put(
  '/updateLocation/:id',
  authMiddleware,
  authorizeAdminOrSuperAdminRole,
  validateUpdatedLocationData,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    locationController.updateLocation(req, res, next),
);

router.delete(
  '/deleteLocation/:id',
  authMiddleware,
  authorizeAdminOrSuperAdminRole,
  validateLocationApiParams,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    locationController.deleteLocation(req, res, next),
);

router.get(
  '/getLocation/:id',
  authMiddleware,
  validateLocationApiParams,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    locationController.getLocationById(req, res, next),
);

router.get(
  '/getAllLocations',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    locationController.getAllLocations(req, res, next),
);

export default router;
