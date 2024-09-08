import { Types } from 'mongoose';
import { Service, CreateService, ServiceImageConfig } from '../../application/interface/services.interface';
import { ServiceRepository } from '../../application/interface/services_repository.interface';
import { ServiceModel } from '../../domain/models/services.model';

export class ServiceRepositoryImpl implements ServiceRepository {
  async create(service: CreateService): Promise<void> {
    const serviceModel = new ServiceModel(service);
    await serviceModel.save();
  }

  async update(id: string, updatedServiceDetail: Partial<Service>): Promise<Service | null> {
    return await ServiceModel.findOneAndUpdate({ _id: id }, { $set: updatedServiceDetail }, { new: true });
  }

  async delete(id: string): Promise<void> {
    await ServiceModel.findByIdAndDelete(id);
  }

  async findById(id: string): Promise<Service | null> {
    const service = await ServiceModel.findById(id);
    return service ? (service.toObject() as Service) : null;
  }

  async findByServiceName(serviceName: string): Promise<Service | null> {
    const service = await ServiceModel.findOne({ serviceName });
    return service ? (service.toObject() as Service) : null;
  }

  async getReportServicesImageconfig(servicesList: string[]): Promise<ServiceImageConfig[] | null> {
    const objectIdList = servicesList.map((id) => new Types.ObjectId(id));
    const services = await ServiceModel.find({ _id: { $in: objectIdList } }, 'serviceName serviceImage').exec();

    const serviceImageConfigs: ServiceImageConfig[] = services.map((service) => ({
      serviceName: service.serviceName,
      serviceImage: service.serviceImage,
    }));

    return serviceImageConfigs;
  }
  async getAllServices(): Promise<Service[] | null> {
    return await ServiceModel.find();
  }
}
