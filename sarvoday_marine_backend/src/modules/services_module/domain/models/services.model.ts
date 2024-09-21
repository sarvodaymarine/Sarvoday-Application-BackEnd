import { randomUUID } from 'crypto';
import mongoose, { Schema, Document, Types } from 'mongoose';
import { Service } from '../../application/interface/services.interface';

interface ServiceDocument extends Service, Document {
  _id: Types.ObjectId;
}

const ServiceImageSchema: Schema = new Schema({
  imageName: { type: String, required: true },
  imageCount: { type: Number, required: true },
});

const ServiceSchema: Schema = new Schema(
  {
    _id: { type: String, default: () => randomUUID(), unique: true },
    serviceName: { type: String, required: true, unique: true },
    container1Price: { type: Number, required: true },
    container2Price: { type: Number, required: true },
    container3Price: { type: Number, required: true },
    container4Price: { type: Number, required: true },
    serviceImage: { type: [ServiceImageSchema] },
  },
  { timestamps: true },
);

ServiceSchema.set('toJSON', { getters: true });
ServiceSchema.set('toObject', { getters: true });

const ServiceModel = mongoose.model<ServiceDocument>('Service', ServiceSchema);
export { ServiceModel };
