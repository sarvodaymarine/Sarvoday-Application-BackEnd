import { BusinessConfig } from './business_config.interface';

export interface BusinessConfigRepository {
  update(id: string, order: Partial<BusinessConfig>): Promise<void>;
  getBusinessConfig(): Promise<BusinessConfig[] | null>;
}
