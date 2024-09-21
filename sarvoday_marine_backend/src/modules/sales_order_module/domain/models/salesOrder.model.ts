import mongoose, { Schema, Document, Types } from 'mongoose';
import { SalesOrder } from '../../application/interface/salesOrder.interface';
import { PriceType } from '@src/shared/enum/price_type.enum';
import { SoStatus } from '@src/shared/enum/so_status.enum';

interface SalesOrderDocument extends SalesOrder, Document {
  _id: Types.ObjectId;
}

const SoServiceSchema: Schema = new Schema({
  serviceId: { type: String, ref: 'services', required: true },
  serviceName: { type: String, required: true },
  priceType: { type: String, enum: Object.values(PriceType) },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const SoEmployeeSchema: Schema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'employees',
    required: true,
  },
  employeeName: { type: String, required: true },
  // email: { type: String, required: true },
  // mobile: { type: String, required: true },
  // countryCode: { type: String, required: true },
  isAssigned: { type: Boolean, required: false, default: false },
});

const ExpensesSchema: Schema = new Schema({
  expenseName: { type: String, required: true },
  price: { type: Number, required: true },
});

const TaxSchema: Schema = new Schema({
  taxName: { type: String },
  description: { type: String },
  cGST: { type: Number, required: true, min: [0, 'cGST must be at least 0'], max: [100, 'cGST must be at most 100'] },
  sGST: { type: Number, required: true, min: [0, 'sGST must be at least 0'], max: [100, 'sGST must be at most 100'] },
  taxPrice: { type: Number, required: true },
});

const salesOrderSchema: Schema<SalesOrderDocument> = new Schema(
  {
    orderDate: { type: Date, required: true },
    status: { type: String, enum: Object.values(SoStatus), required: true },
    products: { type: String, required: false },
    orderId: { type: String, required: true },
    noOfContainer: { type: Number, required: true },
    services: { type: [SoServiceSchema], required: true },
    locationName: { type: String, required: true },
    locationAddress: { type: String, required: true },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'clients',
      required: true,
    },
    clientName: { type: String, required: true },
    employees: { type: [SoEmployeeSchema], required: true },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'employees',
      required: true,
    },
    otherExpenses: { type: [ExpensesSchema], required: false },
    comments: { type: String, required: false },
    tax: { type: [TaxSchema], required: true },
    totalTax: { type: Number, required: true },
    totalInvoice: { type: Number, required: true },
  },
  { timestamps: true },
);

salesOrderSchema.set('toJSON', { getters: true });
salesOrderSchema.set('toObject', { getters: true });

const SalesOrderModel = mongoose.model<SalesOrderDocument>('SalesOrders', salesOrderSchema);
export { SalesOrderModel };
