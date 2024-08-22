import mongoose from 'mongoose';

interface ImageConfig {
  imageName: string;
  imagecount: number;
}

interface CreateService {
  serviceName: string;
  container1Price: number;
  container2Price: number;
  container3Price: number;
  container4Price: number;
  serviceImage: ImageConfig[];
}

interface Service extends CreateService {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export { CreateService, Service, ImageConfig };
