/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReportRepository } from '../../application/interface/report_repository.interface';
import {
  PathAndSignedUrl,
  Report,
  ServiceContainerMetaData,
  ServiceContainerModel,
} from '../../application/interface/report.interface';
import { NextFunction } from 'express';
import HttpException from '@src/shared/utils/exceptions/http.exception';
import mongoose, { Types } from 'mongoose';
import { ReportStatus } from '@src/shared/enum/report_status.enum';
import { UserRoles } from '@src/shared/enum/user_roles.enum';
import { SalesOrderRepository } from '@src/modules/sales_order_module/application/interface/salesOrder_repository.interface';
import { ImageUploadService } from '@src/s3_services/s3_image_upload_service';
import { format } from 'date-fns';
import { GenerateServiceContainerPDFService } from './generate_pdf_service';
import { SoStatus } from '@src/shared/enum/so_status.enum';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDefined = (value: any): boolean => value !== undefined && value !== null && value !== '';

const validateContainerImage = (image: any): boolean => {
  const requiredImageFields = ['imageName', 'imageId', 'imagePath'];
  return requiredImageFields.every((field) => isDefined(image[field]));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateContainerReportDetails = (containerDetails: any): boolean => {
  const baggageValidationRules: { [key: string]: string[] } = {
    Baggage1: [
      'containerNo',
      'containerSize',
      'batchNo',
      'noOfPkg',
      'maxGrossWeight',
      'tareWeight',
      'lineSealNo',
      'baggageName',
      'quantity',
      'netWeight',
      'comment',
      'background',
      'survey',
      'packing',
      'conclusion',
    ],
    Baggage2: [
      'containerNo',
      'containerSize',
      'batchNo',
      'noOfPkg',
      'maxGrossWeight',
      'tareWeight',
      'lineSealNo',
      'customSealNo',
      'baggageName',
      'netWeight',
      'comment',
      'background',
      'survey',
      'baggageCondition',
      'conclusion',
    ],
    Baggage3: [
      'containerNo',
      'containerSize',
      'batchNo',
      'noOfPkg',
      'maxGrossWeight',
      'tareWeight',
      'customSealNo',
      'baggageName',
      'netWeight',
      'comment',
      'background',
      'survey',
      'baggageCondition',
      'conclusion',
    ],
    Baggage4: [
      'containerNo',
      'containerSize',
      'batchNo',
      'noOfPkg',
      'maxGrossWeight',
      'tareWeight',
      'baggageName',
      'netWeight',
      'comment',
      'survey',
      'packing',
      'conclusion',
    ],

    default: [
      'containerNo',
      'maxGrossWeight',
      'tareWeight',
      'containerSize',
      'batchNo',
      'lineSealNo',
      'customSealNo',
      'typeOfBaggage',
      'baggageName',
      'quantity',
      'noOfPkg',
      'netWeight',
      'comment',
      'background',
      'survey',
      'packing',
      'baggageCondition',
      'conclusion',
    ],
  };

  const typeOfBaggage = containerDetails.typeOfBaggage || 'default';

  const requiredFields = baggageValidationRules[typeOfBaggage] || baggageValidationRules.default;

  const areRequiredFieldsValid = requiredFields.every((field) => isDefined(containerDetails[field]));

  const areContainerImagesValid = containerDetails.containerImages
    ? containerDetails.containerImages.every((image: any) => validateContainerImage(image))
    : true;
  console.log('areRequiredFieldsValid && areContainerImagesValid', areRequiredFieldsValid && areContainerImagesValid);
  return areRequiredFieldsValid && areContainerImagesValid;
};

export class ReportServices {
  constructor(
    private reportRepository: ReportRepository,
    private salesOrderRepository: SalesOrderRepository,
  ) {}
  async createReport(reportDetails: Partial<Report>): Promise<void> {
    return this.reportRepository.create(reportDetails);
  }
  async updateServiceReport(
    reportId: string,
    serviceId: string,
    userRole: string,
    reportDetails: Partial<ServiceContainerModel>,
    isReviewed: string,
    next: NextFunction,
  ): Promise<void> {
    try {
      const report = await this.reportRepository.findById(new mongoose.Types.ObjectId(reportId));
      if (!report) {
        next(new HttpException(404, 'Report not found'));
      } else {
        const serviceReport = await this.reportRepository.findServiceReportById(new mongoose.Types.ObjectId(serviceId));
        if (!serviceReport) {
          next(new HttpException(404, 'service report not found'));
        } else {
          const serviceMetaForReport = report.serviceReports?.find(
            (sr: ServiceContainerMetaData) => sr.serviceId === serviceId,
          );
          // Partial updates for report fields
          if (isDefined(reportDetails.reportStatus) && isReviewed === 'true') {
            if (reportDetails.reportStatus === ReportStatus.REVIEWED) {
              if (userRole === UserRoles.ADMIN || userRole === UserRoles.SUPERADMIN) {
                serviceReport.reportStatus = reportDetails.reportStatus;
                if (serviceMetaForReport) {
                  serviceMetaForReport.reportStatus = reportDetails.reportStatus;
                }
              } else {
                next(new HttpException(403, 'Access denied. You cannot have acces to reviewed the report'));
              }
            }
          }

          if (isDefined(reportDetails.containerReports) && reportDetails.containerReports) {
            let isServiceReportIsPending: boolean = false;
            reportDetails.containerReports.forEach((element) => {
              if (!validateContainerReportDetails(element)) {
                isServiceReportIsPending = true;
              }
            });

            if (isReviewed === 'false') {
              if (!isServiceReportIsPending) {
                serviceReport.reportStatus = ReportStatus.COMPLETED;
                if (serviceMetaForReport) {
                  serviceMetaForReport.reportStatus = ReportStatus.COMPLETED;
                }
              } else {
                serviceReport.reportStatus = ReportStatus.PENDING;
                if (serviceMetaForReport) {
                  serviceMetaForReport.reportStatus = ReportStatus.PENDING;
                }
              }
            }

            if (serviceReport.containerReports && reportDetails.containerReports) {
              const updatedReports = serviceReport.containerReports.map((element) => {
                const matchingReport = reportDetails.containerReports?.find(
                  (element2) => element._id?.toString() === element2.id?.toString(),
                );
                return matchingReport || element;
              });
              serviceReport.containerReports = updatedReports;
            }
          }
        }
        let orderDetails;
        if (serviceReport) {
          await this.reportRepository.updateServiceReport(serviceId, serviceReport);
          if (
            report.orderId &&
            (serviceReport.reportStatus == ReportStatus.COMPLETED ||
              serviceReport.reportStatus == ReportStatus.REVIEWED)
          ) {
            orderDetails = await this.salesOrderRepository.findByOrderId(report.orderId);
            if (orderDetails) {
              if (serviceReport.reportStatus == ReportStatus.REVIEWED) {
                new GenerateServiceContainerPDFService(
                  serviceReport,
                  orderDetails,
                  this.reportRepository,
                ).containerPDFgeneration();
              }
            } else {
              next(new HttpException(404, 'Internal server error'));
            }
          }
        }

        const serviceIds = report.serviceReports?.map((serviceReport) =>
          serviceReport.serviceId != undefined ? serviceReport.serviceId?.toString() : '',
        );
        if (serviceIds) {
          const servicesStatus = await this.reportRepository.findStatusByIds(serviceIds);
          if (servicesStatus) {
            const allApproved = servicesStatus.every((service) => service.reportStatus === ReportStatus.REVIEWED);
            if (allApproved) {
              if (orderDetails) {
                await this.salesOrderRepository.update(orderDetails._id.toString(), { status: SoStatus.COMPLETED });
              }
              report.isReviewed = true;
            }
          }
        }

        if (report) {
          await this.reportRepository.update(reportId, report);
        }
      }
    } catch (error) {
      console.error('Error updating report:', error);
      next(new HttpException(404, 'Internal server error'));
    }
  }

  async getReportById(orderId: string): Promise<Report | null> {
    return this.reportRepository.findReportBySalesOrder(orderId);
  }

  async getServiceReportById(orderId: string): Promise<ServiceContainerModel | null> {
    const id = new mongoose.Types.ObjectId(orderId);
    const serviceResponse = await this.reportRepository.findServiceReportById(id);
    if (serviceResponse) {
      if (serviceResponse.containerReports) {
        await Promise.all(
          serviceResponse.containerReports.map(async (containerReport) => {
            if (containerReport.containerReportPath) {
              containerReport.containerReportUrl = await new ImageUploadService().getSignedAWSFileOrIMageUrl(
                containerReport.containerReportPath,
              );
            }

            if (containerReport.containerImages) {
              await Promise.all(
                containerReport.containerImages.map(async (imageDetail) => {
                  if (imageDetail.imagePath) {
                    imageDetail.imageUrlLink = await new ImageUploadService().getSignedAWSFileOrIMageUrl(
                      imageDetail.imagePath,
                    );
                  }
                }),
              );
            }
          }),
        );
      }
    }
    return serviceResponse;
  }

  async getSignedUrlForImageUploadService(
    reportId: string,
    serviceReportId: string,
    containerId: string,
    images: any,
  ): Promise<PathAndSignedUrl[]> {
    const report = await this.reportRepository.findById(new Types.ObjectId(reportId));
    const promise: any[] = [];
    if (!report) {
      throw new Error('Fail to upload images!');
    } else if (images != null && images.length > 0) {
      const date = new Date();
      const pathsAndUrls: PathAndSignedUrl[] = [];
      images.forEach((element: { imageId: any; fileName: any }) => {
        const path: string = `ReportImages/${format(date, 'yyyy/MM/dd')}/${report.orderId}/${serviceReportId}/${containerId}/${element.imageId}/${element.fileName}`;
        promise.push(
          new ImageUploadService().putSignedUrlforAWsImageUpload(path).then((signedUrl: string) => {
            pathsAndUrls.push({ path, signedUrl });
          }),
        );
      });
      await Promise.all(promise);
      return pathsAndUrls;
    } else {
      throw new Error('Fail to upload images!');
    }
  }
}
