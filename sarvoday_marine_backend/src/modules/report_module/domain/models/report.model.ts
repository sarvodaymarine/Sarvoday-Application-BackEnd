import { Schema, model, Document } from 'mongoose';
import {
  ContainerImageConfig,
  ContainerModel,
  Report,
  ServiceContainerMetaData,
  ServiceContainerModel,
} from '../../application/interface/report.interface';
import { ReportStatus } from '@src/shared/enum/report_status.enum';

const ImageConfigSchema = new Schema<ContainerImageConfig>({
  imageName: { type: String, required: true },
  imageId: { type: String, required: true },
  imagePath: { type: String, required: false, default: '' },
});

interface IContainerModel extends ContainerModel {
  id: string;
}

const ContainerModelSchema = new Schema<IContainerModel>({
  containerNo: { type: String, required: false },
  maxGrossWeight: { type: String, required: false },
  tareWeight: { type: String, required: false },
  containerSize: { type: String, required: false },
  batchNo: { type: String, required: false },
  lineSealNo: { type: String, required: false },
  customSealNo: { type: String, required: false },
  typeOfBaggage: { type: String, required: false },
  baggageName: { type: String, required: false },
  quantity: { type: Number, required: false },
  noOfPkg: { type: Number, required: false },
  netWeight: { type: String, required: false },
  comment: { type: String, required: false },
  background: { type: String, required: false },
  survey: { type: String, required: false },
  packing: { type: String, required: false },
  baggageCondition: { type: String, required: false },
  conclusion: { type: String, required: false },
  containerImages: { type: [ImageConfigSchema], required: false },
  containerReportPath: { type: String, required: false, default: '' },
  containerReportUrl: { type: String, required: false },
});

const ServiceContainerModelSchema = new Schema<ServiceContainerModel>({
  serviceName: { type: String, required: true },
  isEdited: { type: String, required: false },
  reportStatus: { type: String, required: false, default: 'Pending', enum: ReportStatus },
  containerReports: { type: [ContainerModelSchema], required: false },
});

const serviceReportMetaDataConfigSchema = new Schema<ServiceContainerMetaData>({
  serviceName: { type: String, required: true },
  serviceId: { type: String, required: true },
  reportStatus: { type: String, required: false, default: 'Pending', enum: ReportStatus },
});

interface IReportModel extends Report, Document {}

const ReportModelSchema = new Schema<IReportModel>(
  {
    orderId: { type: String, required: false },
    serviceReports: { type: [serviceReportMetaDataConfigSchema], required: false },
    isReviewed: { type: Boolean, required: false, default: false },
    isSubmited: { type: Boolean, required: false, default: false },
    isEmailSended: { type: Boolean, required: false, default: false },
  },
  { timestamps: true },
);

ReportModelSchema.set('toJSON', { getters: true });
ReportModelSchema.set('toObject', { getters: true });

export const ServiceReportModel = model<ServiceContainerModel>('ServiceReports', ServiceContainerModelSchema);
export const ReportModel = model<IReportModel>('Reports', ReportModelSchema);
