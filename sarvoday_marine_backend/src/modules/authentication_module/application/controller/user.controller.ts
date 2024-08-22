import { NextFunction, Request, Response } from 'express';
import HttpException from '@src/shared/utils/exceptions/http.exception';
import { UserService } from '../../domain/services/user.services';

export class UserController {
  constructor(private userService: UserService) {}

  async provideAuthAcess(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { firstName, lastName, email, countryCode, mobile, userRole } = req.body;
    try {
      const user = await this.userService.provideAuthService(firstName, lastName, email, countryCode, mobile, userRole);
      res.json(user);
    } catch (error) {
      console.log('Error', error);
      next(new HttpException(400, (error as Error).message));
    }
  }

  async userLogin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { email, password } = req.body;
    try {
      const user = await this.userService.loginService(email, password);
      res.json(user);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  // async deleteUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  //   const id = req.params.id;
  //   try {
  //     const user = await this.userService.deleteUser(id);
  //     res.json(user);
  //   } catch (error) {
  //     next(new HttpException(400, (error as Error).message));
  //   }
  // }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;
    const { password } = req.body;
    try {
      await this.userService.changePasswordService(id, password);
      res.json(true);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  // async updateUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  //   const id = req.params.id;
  //   const updateDetails = req.body;
  //   try {
  //     const employee = await this.userService.updateUserDetail(id, updateDetails);
  //     res.json(employee);
  //   } catch (error) {
  //     next(new HttpException(400, (error as Error).message));
  //   }
  // }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const employeeList = await this.userService.getAllUsers();
      res.json(employeeList);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;
    try {
      const employee = await this.userService.getUserById(id);
      res.json(employee);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getUserByMobile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { countryCode, mobile } = req.params;
    try {
      const employee = await this.userService.getUserByMobile(countryCode, mobile);
      res.json(employee);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {}

  async ActiveDeActiveUserAuth(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const { isActive } = req.body;
    try {
      await this.userService.EnableDisableUserAuth(id, { isActive: isActive });
      res.json(true);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }
}
