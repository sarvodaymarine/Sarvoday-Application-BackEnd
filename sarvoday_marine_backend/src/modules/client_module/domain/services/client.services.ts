import { ClientRepository } from '../../application/interface/client_repository.interface';
import {
  Client,
  ClientResponse,
  ClientService,
  CreateClient,
  ClientResponseBasedOnUser,
} from '../../application/interface/client.interface';
import mongoose, { Types } from 'mongoose';

export class ClientServices {
  constructor(private clientRepository: ClientRepository) {}

  async createClient(
    userRef: mongoose.Types.ObjectId,
    firstName: string,
    lastName: string,
    clientAddress: string,
    services: ClientService[],
  ): Promise<void> {
    const client: CreateClient = {
      userId: userRef._id,
      firstName: firstName,
      lastName: lastName,
      clientAddress: clientAddress,
      isDeleted: false,
      services: services,
    };
    return await this.clientRepository.create(client);
  }

  async updateClient(id: string, updateDetails: Partial<Client>): Promise<Client | null> {
    const clientUpdateResponse = await this.clientRepository.update(id, updateDetails);
    if (!clientUpdateResponse) {
      throw new Error('client update failed');
    }
    return clientUpdateResponse;
  }

  async deleteClient(id: string): Promise<Client | null> {
    const clientUpdateResponse = await this.clientRepository.delete(id);
    if (!clientUpdateResponse) {
      throw new Error('client delete failed');
    }
    return clientUpdateResponse;
  }

  async getClientById(id: Types.ObjectId): Promise<Client | null> {
    return this.clientRepository.findById(id);
  }

  async getAllClients(): Promise<Client[] | null> {
    return await this.clientRepository.getAllClients();
  }

  async getAllClientsDetails(): Promise<ClientResponse[] | null> {
    return await this.clientRepository.getAllClientsDetails();
  }

  async getAllClientsBasedOnClient(): Promise<ClientResponseBasedOnUser[] | null> {
    return await this.clientRepository.getAllClientsForEmployees();
  }
}
