import { CreateLocation, Location } from '../../application/interface/location.interface';
import { LocationRepository } from '../../application/interface/location_repository.interface';

export class LocationServices {
  constructor(private locationRepository: LocationRepository) {}

  async createLocation(locationName: string, address: string, locationCode: string): Promise<void> {
    const location: CreateLocation = {
      locationName: locationName,
      locationCode: locationCode,
      address: address,
    };
    return await this.locationRepository.create(location);
  }

  async updateLocation(id: string, updateDetails: Partial<Location>): Promise<Location | null> {
    return await this.locationRepository.update(id, updateDetails);
  }

  async deleteLocation(id: string): Promise<void> {
    return await this.locationRepository.delete(id);
  }

  async getLocationById(id: string): Promise<Location | null> {
    return this.locationRepository.findById(id);
  }

  async getLocationByName(locationName: string): Promise<Location | null> {
    return this.locationRepository.findByLocationName(locationName);
  }

  async getAllLocations(): Promise<Location[] | null> {
    return await this.locationRepository.getAllLocations();
  }
}
