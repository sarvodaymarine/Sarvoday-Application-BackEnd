import { CreateLocation, Location } from './location.interface';

export interface LocationRepository {
  create(location: CreateLocation): Promise<void>;
  update(id: string, location: Partial<Location>): Promise<Location | null>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Location | null>;
  // findByLocationName(serviceName: string): Promise<Location | null>;
  getAllLocations(): Promise<Location[] | null>;
}
