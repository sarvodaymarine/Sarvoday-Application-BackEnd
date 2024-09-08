import { NextFunction, Request, Response } from 'express';
import HttpException from '@src/shared/utils/exceptions/http.exception';
import { ServiceServices } from '../../domain/services/service.service';

export class ServiceController {
  constructor(private services: ServiceServices) {}

  async addService(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { serviceName, container1Price, container2Price, container3Price, container4Price, serviceImage } = req.body;
    try {
      const service = await this.services.createService(
        serviceName,
        container1Price,
        container2Price,
        container3Price,
        container4Price,
        serviceImage,
      );
      res.json(service);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async deleteService(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;
    try {
      const service = await this.services.deleteService(id);
      res.json(service);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async updateService(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;
    const updateDetails = req.body;
    try {
      const service = await this.services.updateService(id, updateDetails);
      res.json(service);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getAllServices(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const service = await this.services.getAllServices();
      res.json(service);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getServiceById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;
    try {
      const service = await this.services.getServiceById(id);
      res.json(service);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getServiceByName(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const serviceName = req.params.serviceName;
    try {
      const service = await this.services.getServiceByName(serviceName);
      res.json(service);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getReportServiceImageConfig(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const serviceListParam = req.params.serviceList;
    try {
      const serviceList: string[] = JSON.parse(serviceListParam);
      const service = await this.services.getReportServicesImageconfig(serviceList);
      res.json(service);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }
}
