import mongoose, { Schema, Document, Types } from 'mongoose';

interface BusinessConfigDocument extends Document {
  _id: Types.ObjectId;
  soId: number;
}

const BusinessConfigSchema: Schema<BusinessConfigDocument> = new Schema({
  soId: { type: Number, required: true },
});

BusinessConfigSchema.set('toJSON', { getters: true });
BusinessConfigSchema.set('toObject', { getters: true });

const BusinessConfigModel = mongoose.model<BusinessConfigDocument>('business_configs', BusinessConfigSchema);
export { BusinessConfigModel };
