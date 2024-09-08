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
    const { serviceId, reportId } = req.params;

    const userRole = req.userRole;
    const updateDetails = req.body;
    try {
      if (userRole === undefined) {
        next(new HttpException(401, 'Unauthorised'));
      } else {
        const client = await this.reportServices.updateServiceReport(
          reportId,
          serviceId,
          userRole,
          updateDetails,
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

  async imageManagment(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // const signedUtls = await this.reportServices.getReportById(req.body);
      // res.json(signedUtls);
    } catch (error) {
      console.log('error', error);
      next(new HttpException(400, (error as Error).message));
    }
  }
}
