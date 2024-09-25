import { NextFunction, Router, Response, Request } from 'express';
import { EmployeeRepositoryImpl } from '@src/modules/employee_module/infrastructure/persistence/employee.repository';
import { EmployeeServices } from '@src/modules/employee_module/domain/services/employee.services';
import { EmployeeController } from '@src/modules/employee_module/application/controller/employee.controller';
import { UserRepositoryImpl } from '@src/modules/authentication_module/infrastructure/persistence/user.repository';
import { UserService } from '@src/modules/authentication_module/domain/services/user.services';
import {
  authMiddleware,
  authorizeAdminOrSuperAdminRole,
  authorizeSuperAdminRole,
} from '@src/infrastructure/security/auth.middleware';

const employeeRepositoryImpl = new EmployeeRepositoryImpl();
const userRepositoryImpl = new UserRepositoryImpl();
const userService = new UserService(userRepositoryImpl);
const employeeModuleAPI = new EmployeeServices(employeeRepositoryImpl);
const employeeController = new EmployeeController(employeeModuleAPI, userService);
const router = Router();

router.post(
  '/addEmployee',
  authMiddleware,
  authorizeAdminOrSuperAdminRole,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    employeeController.addEmployeeAPI(req, res, next),
);

router.put(
  '/updateEmployee/:id',
  authMiddleware,
  authorizeAdminOrSuperAdminRole,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    employeeController.updateEmployee(req, res, next),
);

router.delete(
  '/deleteEmployee/:id',
  authMiddleware,
  authorizeSuperAdminRole,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    employeeController.deleteEmployee(req, res, next),
);

router.get(
  '/getAllEmployee',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    employeeController.getAllEmployees(req, res, next),
);

router.get(
  '/getAllEmployeeDetails',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    employeeController.getAllEmployeesDetails(req, res, next),
);
export default router;
