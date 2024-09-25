import { NextFunction, Request, Response } from 'express';
import HttpException from '@src/shared/utils/exceptions/http.exception';
import { EmployeeServices } from '../../domain/services/employee.services';
import { UserService } from '@src/modules/authentication_module/domain/services/user.services';
import { User } from '@src/modules/authentication_module/application/interface/user.interface';
import mongoose from 'mongoose';

export class EmployeeController {
  constructor(
    private employeeServices: EmployeeServices,
    private userService: UserService,
  ) {}

  async addEmployeeAPI(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { firstName, lastName, email, countryCode, mobile, userRole } = req.body;
    try {
      const createdUser: User = await this.userService.provideAuthService(
        firstName,
        lastName,
        email,
        countryCode,
        mobile,
        userRole,
      );

      const employeeResponse = await this.employeeServices.createEmployeeService(
        createdUser._id,
        firstName,
        lastName,
        userRole,
      );
      res.json(employeeResponse);
    } catch (error) {
      console.log('Error', error);
      next(new HttpException(400, (error as Error).message));
    }
  }

  async deleteEmployee(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;
    try {
      const employee = await this.employeeServices.deleteEmployee(id);
      if (employee != null) {
        await this.userService.deleteUser(employee.userId);
      }
      res.json(employee);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async updateEmployee(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;
    const updateDetails = req.body;
    try {
      const employee = await this.employeeServices.updateEmployee(id, updateDetails);
      if (employee) {
        await this.userService.updateUserDetail(employee.userId, updateDetails);
      }
      res.json(employee);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getAllEmployeesDetails(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const employeeList = await this.employeeServices.getAllEmployeesDetails();
      res.json(employeeList);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getAllEmployees(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const employeeList = await this.employeeServices.getAllEmployees();
      res.json(employeeList);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  // async getEmployeeById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  //   const id = req.params.id;
  //   try {
  //     const employee = await this.employeeServices.getEmployeeById(id);
  //     res.json(employee);
  //   } catch (error) {
  //     next(new HttpException(400, (error as Error).message));
  //   }
  // }

  // async getEmployeeByMobile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  //   const { countryCode, mobile } = req.params;
  //   try {
  //     const employee = await this.employeeServices.getEmployeeByMobile(countryCode, mobile);
  //     res.json(employee);
  //   } catch (error) {
  //     next(new HttpException(400, (error as Error).message));
  //   }
  // }

  // async disableAndEnableEmployee(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  //   const { id, isActive } = req.params;
  //   try {
  //     const employee = await this.employeeServices.getEmployeeByMobile(countryCode, mobile);
  //     res.json(employee);
  //   } catch (error) {
  //     next(new HttpException(400, (error as Error).message));
  //   }
  // }
}
