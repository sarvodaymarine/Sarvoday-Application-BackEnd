import { CreateLocation, Location } from '../../application/interface/location.interface';
import { LocationRepository } from '../../application/interface/location_repository.interface';
import { LocationModel } from '../../domain/models/location.model';

export class LocationRepositoryImpl implements LocationRepository {
  async create(location: CreateLocation): Promise<void> {
    const locationModel = new LocationModel(location);
    await locationModel.save();
  }

  async update(id: string, updatedLocationDetail: Partial<Location>): Promise<Location | null> {
    return await LocationModel.findOneAndUpdate({ _id: id }, { $set: updatedLocationDetail }, { new: true });
  }

  async delete(id: string): Promise<void> {
    await LocationModel.findByIdAndDelete(id);
  }

  async findById(id: string): Promise<Location | null> {
    const location = await LocationModel.findById(id);
    return location ? (location.toObject() as Location) : null;
  }

  async findByLocationName(locationName: string): Promise<Location | null> {
    const location = await LocationModel.findOne({ locationName });
    return location ? (location.toObject() as Location) : null;
  }

  async getAllLocations(): Promise<Location[] | null> {
    return await LocationModel.find();
  }
}
