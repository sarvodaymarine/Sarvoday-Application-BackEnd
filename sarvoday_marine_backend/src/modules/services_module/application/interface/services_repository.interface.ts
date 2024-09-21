import { CreateService, Service, ServiceImageConfig } from './services.interface';

export interface ServiceRepository {
  create(service: CreateService): Promise<void>;
  update(id: string, service: Partial<Service>): Promise<Service | null>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Service | null>;
  findByServiceName(serviceName: string): Promise<Service | null>;
  getAllServices(): Promise<Service[] | null>;
  getReportServicesImageconfig(servicesList: string[]): Promise<ServiceImageConfig[] | null>;
}
