import { NextFunction, Request, Response } from 'express';
import HttpException from '@src/shared/utils/exceptions/http.exception';
import { ClientServices } from '../../domain/services/client.services';
import { UserService } from '@src/modules/authentication_module/domain/services/user.services';
import { User } from '@src/modules/authentication_module/application/interface/user.interface';
import { UserRoles } from '@src/shared/enum/user_roles.enum';
import { ClientService } from '../interface/client.interface';

export class ClientController {
  constructor(
    private clientServices: ClientServices,
    private userService: UserService,
  ) {}

  async addClient(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { firstName, lastName, email, countryCode, mobile, clientAddress, services } = req.body;
    try {
      const createdUser: User = await this.userService.provideAuthService(
        firstName,
        lastName,
        email,
        countryCode,
        mobile,
        UserRoles.CLIENT,
        false,
      );
      const clientServiceList = services.map((service: Record<string, any>) => {
        const { id, ...rest } = service;
        return { serviceId: id, ...rest };
      });

      const client = await this.clientServices.createClient(
        createdUser._id,
        firstName,
        lastName,
        clientAddress,
        clientServiceList,
      );
      res.json(client);
    } catch (error) {
      console.log('error', error);
      next(new HttpException(400, (error as Error).message));
    }
  }

  async deleteClient(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;
    try {
      const client = await this.clientServices.deleteClient(id);
      if (client != null) {
        const userId = client!.userId._id;
        await this.userService.deleteUser(userId);
      }
      res.json(client);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async updateClient(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const id = req.params.id;
    const updateDetails = req.body;
    try {
      const client = await this.clientServices.updateClient(id, updateDetails);
      res.json(client);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getAllClients(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const clientList = await this.clientServices.getAllClients();
      res.json(clientList);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  async getAllClientDetails(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const clientList = await this.clientServices.getAllClientsDetails();
      res.json(clientList);
    } catch (error) {
      next(new HttpException(400, (error as Error).message));
    }
  }

  //   async getClientById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  //     const id = req.params.id;
  //     try {
  //       const client = await this.clientServices.getClientById(id);
  //       res.json(client);
  //     } catch (error) {
  //       next(new HttpException(400, (error as Error).message));
  //     }
  //   }

  //   async getClientByMobile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  //     const { countryCode, mobile } = req.params;
  //     try {
  //       const client = await this.clientServices.getClientByMobile(countryCode, mobile);
  //       res.json(client);
  //     } catch (error) {
  //       next(new HttpException(400, (error as Error).message));
  //     }
  //   }
}
