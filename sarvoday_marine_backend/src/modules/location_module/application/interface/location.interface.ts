import mongoose from 'mongoose';

interface CreateLocation {
  locationName: string;
  locationCode: string;
  address: string;
}

interface Location extends CreateLocation {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export { CreateLocation, Location };
