import mongoose from 'mongoose';
import { PriceType } from '@src/shared/enum/price_type.enum';
import { SoStatus } from '@src/shared/enum/so_status.enum';

interface AddSoService {
  serviceId: mongoose.Types.ObjectId;
  serviceName: string;
  priceType: PriceType;
}

interface SoService extends AddSoService {
  price?: number | undefined;
  totalPrice?: number | undefined;
}

interface Expenses {
  expenseName: string;
  price: number;
}

interface SoEmployee {
  employeeId: mongoose.Types.ObjectId;
  employeeName: string;
  isAssigned: boolean;
}

interface AddSoTax {
  taxName: string;
  description: string;
  cGST: number;
  sGST: number;
}
interface Tax extends AddSoTax {
  taxPrice?: number | undefined;
}

interface CreateSalesOrder {
  orderDate: Date;
  status: SoStatus;
  products: string;
  orderId: string;
  noOfContainer: number;
  services: SoService[];
  locationName: string;
  locationAddress: string;
  clientId: mongoose.Types.ObjectId;
  clientName: string;
  employees: SoEmployee[];
  adminId: mongoose.Types.ObjectId;
  otherExpenses: Expenses[];
  comments: string;
  tax: Tax[];
  totalTax?: number | undefined;
  totalInvoice?: number | undefined;
}

interface SalesOrder extends CreateSalesOrder {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export { CreateSalesOrder, SalesOrder, SoService };
