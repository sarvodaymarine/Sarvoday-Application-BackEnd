import mongoose from 'mongoose';

interface ImageConfig {
  imageName: string;
  imageCount: number;
}

interface ServiceImageConfig {
  serviceName: string;
  serviceImage: ImageConfig[];
}

interface CreateService extends ServiceImageConfig {
  container1Price: number;
  container2Price: number;
  container3Price: number;
  container4Price: number;
}

interface Service extends CreateService {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export { CreateService, Service, ImageConfig, ServiceImageConfig };
