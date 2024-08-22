import { SalesOrder } from '../../application/interface/salesOrder.interface';
import { SalesOrderRepository } from '../../application/interface/salesOrder_repository.interface';
import { SalesOrderModel } from '../../domain/models/salesOrder.model';

export class SalesOrderRepositoryImpl implements SalesOrderRepository {
  async create(order: SalesOrder): Promise<void> {
    const salesOrder = new SalesOrderModel(order);
    await salesOrder.save();
  }

  async update(id: string, updatedOrderDetail: Partial<SalesOrder>): Promise<SalesOrder | null> {
    return await SalesOrderModel.findOneAndUpdate(
      { _id: id },
      { ...updatedOrderDetail, updatedAt: new Date() },
      { new: true },
    );
  }

  async findById(id: string): Promise<SalesOrder | null> {
    const salesOrder = await SalesOrderModel.findById(id);
    return salesOrder ? salesOrder.toJSON() : null;
  }

  async getAllSalesOrders(filter: any): Promise<SalesOrder[] | null> {
    return await SalesOrderModel.find(filter);
  }
}
