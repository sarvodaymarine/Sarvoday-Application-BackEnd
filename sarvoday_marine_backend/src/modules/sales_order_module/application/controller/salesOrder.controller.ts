import { NextFunction, Request, Response } from 'express';
import HttpException from '@src/shared/utils/exceptions/http.exception';
import { SalesOrderServices } from '../../domain/services/salesOrder.services';
import { CustomRequest } from '@src/infrastructure/security/auth.middleware';

export class SalesOrderController {
  constructor(private salesOrderServices: SalesOrderServices) {}

  async addSalesOrder(req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userRole = req.userRole!;
      const userId = req.userId!;
      console.log('data', req.body);
      const salesOrder = await this.salesOrderServices.createSalesOrder(userId, req.body, userRole);
      res.status(200).json(salesOrder);
    } catch (error) {
      console.log('error', error);
      next(new HttpException(400, (error as Error).message));
    }
  }

  async updateSalesOrder(req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;
    const updateDetails = req.body;
    try {
      const userRole = req.userRole!;
      const client = await this.salesOrderServices.updateSalesOrder(id, updateDetails, userRole);
      res.json(client);
    } catch (error) {
      console.log('error', error);
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getAllSalesOrders(req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const userRole = req.userRole!;
      const userId = req.userId!;
      const { startDateOfWeek, lastDateOfWeek } = req.params;
      const salesOrderList = await this.salesOrderServices.getAllSalesOrders(
        userRole,
        userId,
        startDateOfWeek,
        lastDateOfWeek,
      );
      res.json(salesOrderList);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getSalesOrderById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;
    try {
      const salesOrder = await this.salesOrderServices.getSalesOrderById(id);
      res.json(salesOrder);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }
}
