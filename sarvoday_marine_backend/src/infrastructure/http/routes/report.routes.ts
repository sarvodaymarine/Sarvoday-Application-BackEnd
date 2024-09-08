import { authMiddleware } from '@src/infrastructure/security/auth.middleware';
import { ReportController } from '@src/modules/report_module/application/controller/report.controller';
import { ReportServices } from '@src/modules/report_module/domain/services/report.services';
import { ReportRepositoryImpl } from '@src/modules/report_module/infrastructure/persistence/report.repository';
import { Router, NextFunction, Request, Response } from 'express';

const reportRepository = new ReportRepositoryImpl();
const reportAPI = new ReportServices(reportRepository);
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
  '/updateReport/:reportId/serviceReport/:serviceId',
  authMiddleware,
  // validateSalesOrderRequestBody,

  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    reprotController.updateServiceReport(req, res, next),
);

router.get(
  '/getReport/:orderId',
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    reprotController.getReportById(req, res, next),
);

router.get(
  '/getServiceReport/:id',
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    reprotController.getServiceReportById(req, res, next),
);

router.get(
  '/images/signUrl/',
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    reprotController.imageManagment(req, res, next),
);

export default router;
