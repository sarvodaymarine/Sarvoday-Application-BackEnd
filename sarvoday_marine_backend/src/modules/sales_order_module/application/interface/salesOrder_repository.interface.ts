import { CreateSalesOrder, SalesOrder } from './salesOrder.interface';

export interface SalesOrderRepository {
  create(order: CreateSalesOrder): Promise<void>;
  update(id: string, order: Partial<SalesOrder>): Promise<SalesOrder | null>;
  findById(id: string): Promise<SalesOrder | null>;
  getAllSalesOrders(filter: any): Promise<SalesOrder[] | null>;
}
