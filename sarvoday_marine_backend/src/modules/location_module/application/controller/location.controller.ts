import { NextFunction, Request, Response } from 'express';
import HttpException from '@src/shared/utils/exceptions/http.exception';
import { LocationServices } from '../../domain/services/location.service';

export class LocationController {
  constructor(private locationServices: LocationServices) {}

  async addLocation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { locationName, address, locationCode } = req.body;
    try {
      const location = await this.locationServices.createLocation(locationName, address, locationCode);
      res.json(location);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async deleteLocation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;
    try {
      const location = await this.locationServices.deleteLocation(id);
      res.json(location);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async updateLocation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;
    const updateDetails = req.body;
    try {
      const location = await this.locationServices.updateLocation(id, updateDetails);
      res.json(location);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getAllLocations(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const location = await this.locationServices.getAllLocations();
      res.json(location);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getLocationById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;
    try {
      const location = await this.locationServices.getLocationById(id);
      res.json(location);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

//   async getLocationByName(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
//     const locationName = req.params.locationName;
//     try {
//       const location = await this.locationServices.getLocationByName(locationName);
//       res.json(location);
//     } catch (error) {
//       next(new HttpException(400, (error as Error).message));
//     }
//   }
}
