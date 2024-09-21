import mongoose, { Schema, Document, Types } from 'mongoose';
import { Client } from '../../application/interface/client.interface';

interface ClientDocument extends Client, Document {
  _id: Types.ObjectId;
}

const ClientServiceSchema: Schema = new Schema({
  serviceName: { type: String, required: true },
  serviceId: { type: String, ref: 'services', required: true },
  container1Price: { type: Number, required: true },
  container2Price: { type: Number, required: true },
  container3Price: { type: Number, required: true },
  container4Price: { type: Number, required: true },
});

const ClientSchema: Schema<ClientDocument> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    clientAddress: { type: String, required: true },
    isDeleted: { type: Boolean, required: true },
    services: { type: [ClientServiceSchema], required: false, default: [] },
  },
  { timestamps: true },
);

ClientSchema.set('toJSON', { getters: true });
ClientSchema.set('toObject', { getters: true });

const ClientModel = mongoose.model<ClientDocument>('Client', ClientSchema);
export { ClientModel, ClientServiceSchema };
