import {
  CreateService,
  ImageConfig,
  Service,
  ServiceImageConfig,
} from '../../application/interface/services.interface';
import { ServiceRepositoryImpl } from '../../infrastructure/persistence/service.repository';
export class ServiceServices {
  constructor(private serviceRepository: ServiceRepositoryImpl) {}

  async createService(
    serviceName: string,
    container1Price: number,
    container2Price: number,
    container3Price: number,
    container4Price: number,
    serviceImage: ImageConfig[],
  ): Promise<void> {
    const service: CreateService = {
      serviceName: serviceName,
      container1Price: container1Price,
      container2Price: container2Price,
      container3Price: container3Price,
      container4Price: container4Price,
      serviceImage: serviceImage,
    };
    return await this.serviceRepository.create(service);
  }

  async updateService(id: string, updateDetails: Partial<Service>): Promise<Service | null> {
    return await this.serviceRepository.update(id, updateDetails);
  }

  async deleteService(id: string): Promise<void> {
    return await this.serviceRepository.delete(id);
  }

  async getServiceById(id: string): Promise<Service | null> {
    return this.serviceRepository.findById(id);
  }

  async getServiceByName(serviceName: string): Promise<Service | null> {
    return this.serviceRepository.findByServiceName(serviceName);
  }

  async getAllServices(): Promise<Service[] | null> {
    return await this.serviceRepository.getAllServices();
  }

  async getReportServicesImageconfig(serviceList: string[]): Promise<ServiceImageConfig[] | null> {
    return this.serviceRepository.getReportServicesImageconfig(serviceList);
  }
}
