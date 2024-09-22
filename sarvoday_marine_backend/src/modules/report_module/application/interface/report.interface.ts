import { ReportStatus } from '@src/shared/enum/report_status.enum';
import { ObjectId } from 'mongoose';

export interface ContainerImageConfig {
  imageName?: string;
  imageId?: string;
  imageUrlLink?: string;
  imagePath?: string;
}

export interface PathAndSignedUrl {
  path: string;
  signedUrl: string;
}

export interface ContainerModel {
  id?: string;
  _id?: ObjectId;
  containerNo?: string;
  maxGrossWeight?: string;
  tareWeight?: string;
  containerSize?: string;
  batchNo?: string;
  lineSealNo?: string;
  customSealNo?: string;
  typeOfBaggage?: string;
  baggageName?: string;
  quantity?: number;
  noOfPkg?: number;
  netWeight?: string;
  comment?: string;
  background?: string;
  survey?: string;
  packing?: string;
  baggageCondition?: string;
  conclusion?: string;
  containerImages?: ContainerImageConfig[];
  containerReportPath?: string;
  containerReportUrl?: string;
}

export interface ServiceContainerModel {
  _id?: ObjectId;
  serviceName?: string;
  isEdited?: boolean;
  reportStatus?: ReportStatus;
  containerReports?: ContainerModel[];
}

export interface ServiceContainerMetaData {
  serviceId?: string;
  serviceName?: string;
  reportStatus?: ReportStatus;
}

export interface Report {
  orderId?: string;
  serviceReports?: ServiceContainerMetaData[];
  isReviewed?: boolean;
  isSubmited?: boolean;
  isEmailSended?: boolean;
}
