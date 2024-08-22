import { LocationRepositoryImpl } from '@src/modules/location_module/infrastructure/persistence/location.repository';
import { LocationServices } from '@src/modules/location_module/domain/services/location.service';
import { LocationController } from '@src/modules/location_module/application/controller/location.controller';
import {
  validateLocationApiParams,
  validateLocationData,
  validateUpdatedLocationData,
} from '@src/modules/location_module/application/middleware/location.middleware';
import { NextFunction, Router, Response, Request } from 'express';

const locationRepositoryImpl = new LocationRepositoryImpl();
const locationsAPI = new LocationServices(locationRepositoryImpl);
const locationController = new LocationController(locationsAPI);
const router = Router();

router.post(
  '/addLocation',
  validateLocationData,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    locationController.addLocation(req, res, next),
);

router.put(
  '/updateLocation/:id',
  validateUpdatedLocationData,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    locationController.updateLocation(req, res, next),
);

router.delete(
  '/deleteLocation/:id',
  validateLocationApiParams,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    locationController.deleteLocation(req, res, next),
);

router.get(
  '/getLocation/:id',
  validateLocationApiParams,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    locationController.getLocationById(req, res, next),
);

router.get(
  '/getLocationbyName/:locationName',
  validateLocationApiParams,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    locationController.getLocationByName(req, res, next),
);

router.get(
  '/getAllLocations',
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    locationController.getAllLocations(req, res, next),
);

export default router;
