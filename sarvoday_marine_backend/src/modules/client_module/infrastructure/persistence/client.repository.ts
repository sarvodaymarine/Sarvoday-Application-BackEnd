import { Types } from 'mongoose';
import {
  Client,
  ClientResponse,
  ClientResponseBasedOnUser,
  CreateClient,
} from '../../application/interface/client.interface';
import { ClientRepository } from '../../application/interface/client_repository.interface';
import { ClientModel } from '../../domain/models/client.model';

export class ClientRepositoryImpl implements ClientRepository {
  async create(client: CreateClient): Promise<void> {
    const clientModel = new ClientModel(client);
    await clientModel.save();
  }

  async update(id: string, updatedClientDetail: Partial<Client>): Promise<Client | null> {
    return await ClientModel.findOneAndUpdate({ _id: id }, { $set: updatedClientDetail }, { new: true }).exec();
  }

  async delete(id: string): Promise<Client | null> {
    return await ClientModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } }).exec();
  }

  async findById(id: Types.ObjectId): Promise<Client | null> {
    const client = await ClientModel.findById(id);
    return client ? (client.toObject() as Client) : null;
  }

  async findByUserId(userId: Types.ObjectId): Promise<Client | null> {
    const client = await ClientModel.findOne({userId});
    return client ? (client.toObject() as Client) : null;
  }

  async getAllClients(): Promise<Client[] | null> {
    return await ClientModel.find();
  }

  async getAllClientsForEmployees(): Promise<ClientResponseBasedOnUser[] | null> {
    const clientList = await ClientModel.find();
    const clientResponseList: ClientResponseBasedOnUser[] = [];
    clientList.forEach((client) => {
      clientResponseList.push({
        ...client,
        services: client.services.map((service) => ({
          _id: service._id,
          serviceId: service.serviceId,
          serviceName: service.serviceName,
        })),
      });
    });

    return clientResponseList;
  }

  async getAllClientsDetails(): Promise<ClientResponse[] | null> {
    const clientList = await ClientModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetail',
        },
      },
      {
        $unwind: {
          path: '$userDetail',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          'userDetail.isDeleted': false,
        },
      },
      {
        $project: {
          userId: 1,
          firstName: 1,
          lastName: 1,
          isDeleted: 1,
          services: 1,
          clientAddress: 1,

          userDetail: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            isDeleted: 1,
            email: 1,
            isActive: 1,
            userRole: 1,
            countryCode: 1,
            mobile: 1,
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    if (clientList != null) return clientList as ClientResponse[];
    return clientList;
  }
}
