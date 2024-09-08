/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReportRepository } from '../../application/interface/report_repository.interface';
import { Report, ServiceContainerMetaData, ServiceContainerModel } from '../../application/interface/report.interface';
import { generatePresignedUrls, PresignedUrl } from '../../infrastructure/persistence/pre_singed_url_service';
import { NextFunction } from 'express';
import HttpException from '@src/shared/utils/exceptions/http.exception';
import mongoose from 'mongoose';
import { ReportStatus } from '@src/shared/enum/report_status.enum';
import { UserRoles } from '@src/shared/enum/user_roles.enum';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDefined = (value: any) => value !== undefined && value !== null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateContainerReportDetails = (containerDetails: any): boolean => {
  const requiredFields = [
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
  ];
  return requiredFields.every((field) => isDefined(containerDetails[field]));
};

export class ReportServices {
  constructor(private reportRepository: ReportRepository) {}
  async createReport(reportDetails: Partial<Report>): Promise<void> {
    return this.reportRepository.create(reportDetails);
  }
  async updateServiceReport(
    reportId: string,
    serviceId: string,
    userRole: string,
    reportDetails: Partial<ServiceContainerModel>,
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
          if (isDefined(reportDetails.reportStatus)) {
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

            if (!isServiceReportIsPending) {
              serviceReport.reportStatus = ReportStatus.COMPLETED;
              if (serviceMetaForReport) {
                serviceMetaForReport.reportStatus = ReportStatus.COMPLETED;
              }
            }
            serviceReport.containerReports = reportDetails.containerReports;
          }
        }
        if (serviceReport) {
          await this.reportRepository.updateServiceReport(serviceId, serviceReport);
        }

        if (report) {
          await this.reportRepository.update(reportId, report);
        }

        const serviceIds = report.serviceReports?.map((serviceReport) =>
          serviceReport.serviceId != undefined ? serviceReport.serviceId?.toString() : '',
        );
        if (serviceIds) {
          const servicesStatus = await this.reportRepository.findStatusByIds(serviceIds);
          if (servicesStatus) {
            const allApproved = servicesStatus.every((service) => service.reportStatus === ReportStatus.REVIEWED);
            if (allApproved) {
              ///need to process to generate Report
            }
          }
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
    return this.reportRepository.findServiceReportById(id);
  }

  async generateBlackBlazePresignedUrls(
    bucketName: string,
    orderId: string,
    service: string,
    containerNo: string,
    fileNames: string[],
    orderDate: Date,
  ): Promise<PresignedUrl[]> {
    return generatePresignedUrls(bucketName, orderId, service, containerNo, fileNames, orderDate);
  }
}
