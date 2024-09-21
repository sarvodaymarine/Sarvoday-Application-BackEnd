import mongoose, { Schema, Document, Types } from 'mongoose';
import { Employee } from '../../application/interface/employee.interface';
import { UserRoles } from '@src/shared/enum/user_roles.enum';

interface EmployeeDocument extends Employee, Document {
  _id: Types.ObjectId;
}

const EmployeeSchema: Schema<EmployeeDocument> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userRole: { type: String, enum: Object.values(UserRoles) },
    isDeleted: { type: Boolean, required: true },
    // assignLocations: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Locations',
    //     required: true,
    //   },
    // ],
  },
  { timestamps: true },
);

EmployeeSchema.set('toJSON', { getters: true });
EmployeeSchema.set('toObject', { getters: true });

const EmployeeModel = mongoose.model<EmployeeDocument>('Employee', EmployeeSchema);
export { EmployeeModel };
