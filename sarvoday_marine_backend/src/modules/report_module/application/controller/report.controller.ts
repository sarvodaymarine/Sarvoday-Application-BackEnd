import { NextFunction, Request, Response } from 'express';
import HttpException from '@src/shared/utils/exceptions/http.exception';
import { CustomRequest } from '@src/infrastructure/security/auth.middleware';
import { ReportServices } from '../../domain/services/report.services';

export class ReportController {
  constructor(private reportServices: ReportServices) {}

  async addReport(req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const report = await this.reportServices.createReport(req.body);
      res.status(200).json(report);
    } catch (error) {
      console.log('error', error);
      next(new HttpException(400, (error as Error).message));
    }
  }

  async updateServiceReport(req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> {
    const { serviceId, reportId, isReviewed } = req.params;

    const userRole = req.userRole;
    const updateDetails = req.body;
    try {
      if (userRole === undefined) {
        next(new HttpException(401, 'Unauthorised'));
      } else {
        console.log('updateDetails', updateDetails);
        const client = await this.reportServices.updateServiceReport(
          reportId,
          serviceId,
          userRole,
          updateDetails,
          isReviewed,
          next,
        );
        res.json(client);
      }
    } catch (error) {
      console.log('error', error);
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getReportById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.orderId;
    try {
      const salesOrder = await this.reportServices.getReportById(id);
      res.json(salesOrder);
    } catch (error) {
      console.log('error', error);
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getServiceReportById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;
    try {
      const salesOrder = await this.reportServices.getServiceReportById(id);
      res.json(salesOrder);
    } catch (error) {
      console.log('error', error);
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getImageUploadUrl(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { reportId, serviceReportId, containerId } = req.params;
      const images = req.body;
      const signedUtls = await this.reportServices.getSignedUrlForImageUploadService(
        reportId,
        serviceReportId,
        containerId,
        images,
      );
      res.json(signedUtls);
    } catch (error) {
      console.log('error', error);
      next(new HttpException(400, (error as Error).message));
    }
  }
}
