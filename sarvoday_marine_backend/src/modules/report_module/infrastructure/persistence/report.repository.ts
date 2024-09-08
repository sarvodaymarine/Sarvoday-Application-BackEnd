import mongoose from 'mongoose';
import { Report, ServiceContainerModel } from '../../application/interface/report.interface';
import { ReportRepository } from '../../application/interface/report_repository.interface';
import { IServiceContainerModel, ReportModel, ServiceReportModel } from '../../domain/models/report.model';

export class ReportRepositoryImpl implements ReportRepository {
  async create(order: Report): Promise<void> {
    const salesReport = new ReportModel(order);
    await salesReport.save();
  }

  async createServiceReport(serviceDetail: ServiceContainerModel): Promise<string> {
    const serviceReport = new ServiceReportModel(serviceDetail);
    const savedReport = await serviceReport.save();
    return (savedReport._id as unknown as string).toString();
  }

  async update(id: string, updatedReportDetail: Partial<Report>): Promise<Report | null> {
    return await ReportModel.findOneAndUpdate(
      { _id: id },
      { ...updatedReportDetail, updatedAt: new Date() },
      { new: true },
    );
  }

  async updateServiceReport(id: string, updatedServiceReportDetail: Partial<ServiceContainerModel>): Promise<void> {
    await ServiceReportModel.findOneAndUpdate(
      { _id: id },
      { ...updatedServiceReportDetail, updatedAt: new Date() },
      { new: true },
    );
  }

  async findById(reportId: mongoose.Types.ObjectId): Promise<Report | null> {
    const report = await ReportModel.findOne(reportId);
    return report ? report.toJSON() : null;
  }

  async findReportBySalesOrder(orderId: string): Promise<Report | null> {
    const report = await ReportModel.findOne({ orderId: orderId });
    return report ? report.toJSON() : null;
  }

  async findServiceReportById(serviceId: mongoose.Types.ObjectId): Promise<ServiceContainerModel | null> {
    console.log("serviceId", serviceId);
    const serviceReport = await ServiceReportModel.findOne({ _id: serviceId }).exec();
    console.log('ServiceReport', serviceReport);
    return serviceReport ? serviceReport.toJSON() : null;
  }

  async findStatusByIds(
    serviceIds: string[],
  ): Promise<{ _id: mongoose.Types.ObjectId; reportStatus: string }[] | null> {
    const objectIdList = serviceIds.map((id) => new mongoose.Types.ObjectId(id));
    const services = await ServiceReportModel.find({ _id: { $in: objectIdList } }, { _id: 1, reportStatus: 1 }).exec();
    const filteredServices = services.map((service) => {
      const { _id, reportStatus } = service.toObject<IServiceContainerModel>();
      if (typeof reportStatus !== 'string') {
        throw new Error(`something went to wrong`);
      }

      return { _id, reportStatus };
    });
    return filteredServices;
  }
}
