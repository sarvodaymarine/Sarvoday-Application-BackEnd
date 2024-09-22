import mongoose from 'mongoose';
import { ContainerModel, Report, ServiceContainerModel } from './report.interface';

export interface ReportRepository {
  create(report: Report): Promise<void>;
  createServiceReport(serviceDetail: ServiceContainerModel): Promise<string>;
  update(id: string, report: Partial<Report>): Promise<Report | null>;
  findById(reportId: mongoose.Types.ObjectId): Promise<Report | null>;
  findReportBySalesOrder(orderId: string): Promise<Report | null>;
  findServiceReportById(serviceId: mongoose.Types.ObjectId): Promise<ServiceContainerModel | null>;
  updateServiceReport(
    id: string,
    updatedServiceReportDetail: Partial<ServiceContainerModel>,
  ): Promise<ServiceContainerModel | null>;
  updateServiceContainerPDFPath(
    serviceId: mongoose.Types.ObjectId,
    containerId: mongoose.Types.ObjectId,
    path: string,
  ): Promise<void>;
  findStatusByIds(
    serviceIds: string[],
  ): Promise<{ _id: mongoose.Types.ObjectId; reportStatus: string; containerReports: ContainerModel[] }[] | null>;
}
