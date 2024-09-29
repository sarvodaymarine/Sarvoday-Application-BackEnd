import { authMiddleware, authorizeSuperAdminRole } from '@src/infrastructure/security/auth.middleware';
import { ReportController } from '@src/modules/report_module/application/controller/report.controller';
import { ReportServices } from '@src/modules/report_module/domain/services/report.services';
import { ReportRepositoryImpl } from '@src/modules/report_module/infrastructure/persistence/report.repository';
import { SalesOrderRepositoryImpl } from '@src/modules/sales_order_module/infrastructure/persistence/salesOrder.repository';
import { Router, NextFunction, Request, Response } from 'express';

const reportRepository = new ReportRepositoryImpl();
const salesOrderRepository = new SalesOrderRepositoryImpl();
const reportAPI = new ReportServices(reportRepository, salesOrderRepository);
const reprotController = new ReportController(reportAPI);
const router = Router();

router.post(
  '/addReport',
  authMiddleware,
  // validateSalesOrderRequestBody,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    reprotController.addReport(req, res, next),
);

router.put(
  '/updateReport/:reportId/serviceReport/:serviceId/:isReviewed',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    reprotController.updateServiceReport(req, res, next),
);

router.post(
  '/:reportId/serviceReport/:serviceId/generateReport',
  authMiddleware,
  authorizeSuperAdminRole,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    reprotController.generateReport(req, res, next),
);

router.post(
  '/:reportId/sendReport',
  authMiddleware,
  authorizeSuperAdminRole,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    reprotController.sendReport(req, res, next),
);

router.get(
  '/getReport/:orderId',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    reprotController.getReportById(req, res, next),
);

router.get(
  '/getServiceReport/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    reprotController.getServiceReportById(req, res, next),
);

router.post(
  '/:reportId/serviceReportImage/:serviceReportId/containerReport/:containerId/uploadImages',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    reprotController.getImageUploadUrl(req, res, next),
);

export default router;
