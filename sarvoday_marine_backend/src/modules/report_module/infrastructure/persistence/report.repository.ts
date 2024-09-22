import mongoose from 'mongoose';
import { ContainerModel, Report, ServiceContainerModel } from '../../application/interface/report.interface';
import { ReportRepository } from '../../application/interface/report_repository.interface';
import { ReportModel, ServiceReportModel } from '../../domain/models/report.model';

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

  async updateServiceContainerPDFPath(
    serviceId: mongoose.Types.ObjectId,
    containerId: mongoose.Types.ObjectId,
    path: string,
  ): Promise<void> {
    console.log(`serviceId: ${serviceId}, containerId: ${containerId}, path: ${path}`);
    await ServiceReportModel.updateOne(
      {
        _id: serviceId,
        'containerReports._id': containerId,
      },
      {
        $set: { 'containerReports.$.containerReportPath': path },
      },
    );
  }

  async updateServiceReport(
    id: string,
    updatedServiceReportDetail: Partial<ServiceContainerModel>,
  ): Promise<ServiceContainerModel | null> {
    const updatedReport = await ServiceReportModel.findOneAndUpdate(
      { _id: id },
      { ...updatedServiceReportDetail, updatedAt: new Date() },
      { new: true },
    );
    if (!updatedReport) {
      throw new Error(`Service report with id ${id} not found.`);
    }
    return updatedReport;
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
    console.log('serviceId', serviceId);
    const serviceReport = await ServiceReportModel.findOne({ _id: serviceId }).exec();
    console.log('ServiceReport', serviceReport);
    return serviceReport ? serviceReport.toJSON() : null;
  }

  async findStatusByIds(
    serviceIds: string[],
  ): Promise<{ _id: mongoose.Types.ObjectId; reportStatus: string; containerReports: ContainerModel[] }[] | null> {
    const objectIdList = serviceIds.map((id) => new mongoose.Types.ObjectId(id));

    const services = await ServiceReportModel.find(
      { _id: { $in: objectIdList } },
      { _id: 1, reportStatus: 1, containerReports: 1 },
    ).exec();

    const filteredServices = services.map((service) => {
      const { _id, reportStatus, containerReports } = service.toObject<ServiceContainerModel>();

      if (!(_id instanceof mongoose.Types.ObjectId)) {
        throw new Error('Invalid _id type');
      }

      if (typeof reportStatus !== 'string') {
        throw new Error(`Unexpected reportStatus type`);
      }

      if (!containerReports) {
        throw new Error(`Missing containerReports`);
      }

      return { _id: _id, reportStatus, containerReports };
    });

    return filteredServices;
  }
}
