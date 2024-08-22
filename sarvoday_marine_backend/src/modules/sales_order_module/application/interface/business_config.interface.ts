import mongoose from 'mongoose';

export interface BusinessConfig {
  _id: mongoose.Types.ObjectId;
  soId: number;
}
