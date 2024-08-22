import { BusinessConfigRepository } from '../../application/interface/business_cofig_repository.interface';
import { BusinessConfig } from '../../application/interface/business_config.interface';
import { BusinessConfigModel } from '../../domain/models/business_config.model';

export class BusinessConfigRepositoryImpl implements BusinessConfigRepository {
  async update(id: string, updatedBusinessconfig: Partial<BusinessConfig>): Promise<void> {
    await BusinessConfigModel.updateOne(
      { _id: id },
      { ...updatedBusinessconfig, updatedAt: new Date() },
      { new: true },
    );
  }

  async getBusinessConfig(): Promise<BusinessConfig[] | null> {
    return await BusinessConfigModel.find();
  }
}
