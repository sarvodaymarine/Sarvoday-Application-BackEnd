import { authMiddleware } from '@src/infrastructure/security/auth.middleware';
import { ClientRepositoryImpl } from '@src/modules/client_module/infrastructure/persistence/client.repository';
import { ReportRepositoryImpl } from '@src/modules/report_module/infrastructure/persistence/report.repository';
import { SalesOrderController } from '@src/modules/sales_order_module/application/controller/salesOrder.controller';
// import { validateSalesOrderRequestBody } from '@src/modules/sales_order_module/application/middleware/salesOrder.middleware';
import { SalesOrderServices } from '@src/modules/sales_order_module/domain/services/salesOrder.services';
import { BusinessConfigRepositoryImpl } from '@src/modules/sales_order_module/infrastructure/persistence/business_config.repository';
import { SalesOrderRepositoryImpl } from '@src/modules/sales_order_module/infrastructure/persistence/salesOrder.repository';
import { ServiceRepositoryImpl } from '@src/modules/services_module/infrastructure/persistence/service.repository';
import { Router, NextFunction, Request, Response } from 'express';

const salesOrderRepositoryImpl = new SalesOrderRepositoryImpl();
const clientRepository = new ClientRepositoryImpl();
const businessConfig = new BusinessConfigRepositoryImpl();
const reportRepository = new ReportRepositoryImpl();
const serviceRepository = new ServiceRepositoryImpl();
const salesOrdersAPI = new SalesOrderServices(
  salesOrderRepositoryImpl,
  clientRepository,
  businessConfig,
  reportRepository,
  serviceRepository,
);
const salesOrderController = new SalesOrderController(salesOrdersAPI);
const router = Router();

router.post(
  '/addSalesOrder',
  authMiddleware,
  // validateSalesOrderRequestBody,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    salesOrderController.addSalesOrder(req, res, next),
);

router.put(
  '/updateSalesOrder/:id',
  authMiddleware,
  // validateSalesOrderRequestBody,

  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    salesOrderController.updateSalesOrder(req, res, next),
);

router.get(
  '/getAllSalesOrders/:startDateOfWeek/:lastDateOfWeek',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    salesOrderController.getAllSalesOrders(req, res, next),
);

router.get(
  '/getOrder/:id',
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    salesOrderController.getSalesOrderById(req, res, next),
);

export default router;
