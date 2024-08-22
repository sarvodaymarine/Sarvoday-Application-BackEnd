import { NextFunction, Router, Response, Request } from 'express';
import { EmployeeRepositoryImpl } from '@src/modules/employee_module/infrastructure/persistence/employee.repository';
import { EmployeeServices } from '@src/modules/employee_module/domain/services/employee.services';
import { EmployeeController } from '@src/modules/employee_module/application/controller/employee.controller';
// import {
//   validateEmployeeApiParams,
//   validateEmployeeRequestBody,
//   validateUpdatedEmployeeReqData,
// } from '@src/modules/employee_module/application/middleware/employee.middleware';
import { UserRepositoryImpl } from '@src/modules/authentication_module/infrastructure/persistence/user.repository';
import { UserService } from '@src/modules/authentication_module/domain/services/user.services';

const employeeRepositoryImpl = new EmployeeRepositoryImpl();
const userRepositoryImpl = new UserRepositoryImpl();
const userService = new UserService(userRepositoryImpl);
const employeeModuleAPI = new EmployeeServices(employeeRepositoryImpl);
const employeeController = new EmployeeController(employeeModuleAPI, userService);
const router = Router();

router.post(
  '/addEmployee',
  // validateEmployeeRequestBody,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    employeeController.addEmployeeAPI(req, res, next),
);

router.put(
  '/updateEmployee/:id',
  // validateUpdatedEmployeeReqData,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    employeeController.updateEmployee(req, res, next),
);

router.delete(
  '/deleteEmployee/:id',
  // validateEmployeeApiParams,
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    employeeController.deleteEmployee(req, res, next),
);

// router.get(
//   '/getEmployee/:id',
//   validateEmployeeApiParams,
//   (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
//     employeeController.getEmployeeById(req, res, next),
// );

// router.get(
//   '/getEmployeeByMobile',
//   validateEmployeeApiParams,
//   (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
//     employeeController.getEmployeeByMobile(req, res, next),
// );

router.get(
  '/getAllEmployee',
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    employeeController.getAllEmployees(req, res, next),
);

router.get(
  '/getAllEmployeeDetails',
  (req: Request, res: Response, next: NextFunction): Promise<Response | void> =>
    employeeController.getAllEmployeesDetails(req, res, next),
);
export default router;
