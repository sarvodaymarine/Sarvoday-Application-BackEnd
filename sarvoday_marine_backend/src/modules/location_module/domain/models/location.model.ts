import { randomUUID } from 'crypto';
import mongoose, { Schema, Document, Types } from 'mongoose';

interface LocationDocument extends Location, Document {
  _id: Types.ObjectId;
}

const locationSchema: Schema = new Schema(
  {
    _id: { type: String, default: () => randomUUID(), unique: true },
    locationName: { type: String, required: true, unique: true },
    locationCode: { type: String, required: true, unique: true },
    address: { type: String, required: true },
  },
  { timestamps: true },
);

locationSchema.set('toJSON', { getters: true });
locationSchema.set('toObject', { getters: true });

const LocationModel = mongoose.model<LocationDocument>('Locations', locationSchema);
export { LocationModel, LocationDocument };
