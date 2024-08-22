import mongoose from 'mongoose';
import { CreateService } from '@src/modules/services_module/application/interface/services.interface';
import { CreateUser } from '@src/modules/authentication_module/application/interface/user.interface';

type CreateServiceWithoutImage = Omit<CreateService, 'serviceImage'>

interface ClientService extends CreateServiceWithoutImage {
  _id: mongoose.Types.ObjectId;
  serviceId: string;
}

interface CreateClient {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  clientAddress: string;
  isDeleted: boolean;
  services: ClientService[];
}

interface Client extends CreateClient {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface ClientResponse extends Client {
  userDetail: CreateUser;
}

interface ClientResponseBasedOnUser extends Omit<Client, 'services'> {
  services: Omit<ClientService, 'container1Price' | 'container2Price' | 'container3Price' | 'container4Price'>[];
}

export { CreateClient, Client, ClientResponse, ClientService, ClientResponseBasedOnUser };
