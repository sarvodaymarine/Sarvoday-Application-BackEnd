import { ReportStatus } from "aws-sdk/clients/inspector";

export interface ContainerImageConfig {
  imageName?: string;
  imageId?: string;
  imageUrlLink?: string;
}

export interface ContainerModel {
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
  containerReportUrl?: string;
}

export interface ServiceContainerModel {
  serviceName?: string;
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
