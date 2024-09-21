import { Types } from 'mongoose';
import { Client, ClientResponse, ClientResponseBasedOnUser, CreateClient } from './client.interface';

export interface ClientRepository {
  create(client: CreateClient): Promise<void>;
  update(id: string, employee: Partial<Client>): Promise<Client | null>;
  delete(id: string): Promise<Client | null>;
  findById(id: Types.ObjectId): Promise<Client | null>;
  getAllClients(): Promise<Client[] | null>;
  getAllClientsDetails(): Promise<ClientResponse[] | null>;
  getAllClientsForEmployees(): Promise<ClientResponseBasedOnUser[] | null>;
  findByUserId(userId: Types.ObjectId): Promise<Client | null>;
}
