/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { SalesOrder } from '@src/modules/sales_order_module/application/interface/salesOrder.interface';
import { ServiceContainerModel } from '../../application/interface/report.interface';
import { ReportRepository } from '../../application/interface/report_repository.interface';
import { ReportGenerator, TemplateData } from './pdf_generation_handler';
import { ClientRepositoryImpl } from '@src/modules/client_module/infrastructure/persistence/client.repository';
import { ImageUploadService } from '@src/s3_services/s3_image_upload_service';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { format } from 'date-fns';
import axios from 'axios';
import mongoose from 'mongoose';

export class GenerateServiceContainerPDFService {
  private serviceReport: ServiceContainerModel;
  private orderDetail: SalesOrder;
  private reportRepository: ReportRepository;

  constructor(serviceReport: ServiceContainerModel, orderDetail: SalesOrder, reportRepository: ReportRepository) {
    this.serviceReport = serviceReport;
    this.orderDetail = orderDetail;
    this.reportRepository = reportRepository;
  }

  private getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'TH';
    switch (day % 10) {
      case 1:
        return 'ST';
      case 2:
        return 'ND';
      case 3:
        return 'RD';
      default:
        return 'TH';
    }
  };

  private formatDateWithSuffix = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const ordinalSuffix = this.getOrdinalSuffix(day);

    return `${day}${ordinalSuffix} ${month}, ${year}`;
  };

  public async containerPDFgeneration(): Promise<void> {
    try {
      const date: Date = new Date();
      const reportDate: string = this.formatDateWithSuffix(date);
      const s3instance = new ImageUploadService();

      const clientInfo = await new ClientRepositoryImpl().findByUserId(this.orderDetail.clientId);
      const sarvoday_marine_logo = await s3instance.getSignedAWSFileOrIMageUrl('sarvoday_marine.png');
      const sarvoday_marine_stamp = await s3instance.getSignedAWSFileOrIMageUrl('sarvoday_marine.png');

      if (this.serviceReport.containerReports) {
        const promise2: any = [];
        const reportFolderMap: { id: mongoose.Types.ObjectId; temp: string; path: string }[] = [];
        for await (const element of this.serviceReport.containerReports) {
          if (clientInfo) {
            const pathsAndUrls: {
              url: string;
              name: string;
            }[] = [];

            if (element.containerImages) {
              const promise: any[] = [];
              element.containerImages.forEach((image) => {
                if (image.imagePath) {
                  promise.push(
                    s3instance.getSignedAWSFileOrIMageUrl(image.imagePath).then((signedUrl: string) => {
                      if (signedUrl) {
                        pathsAndUrls.push({ url: signedUrl, name: image.imageName ?? image.imageId ?? '' });
                      }
                    }),
                  );
                }
              });
              await Promise.all(promise);
            }

            const data: TemplateData = {
              sarvoday_marine_logo: sarvoday_marine_logo,
              orderId: this.orderDetail.orderId,
              reportDate: reportDate,
              customerName: this.orderDetail.clientName,
              customerAddress: clientInfo?.clientAddress ?? '',
              portLocation: this.orderDetail.locationAddress,
              orderDate: this.formatDateWithSuffix(this.orderDetail.orderDate),
              productName: this.orderDetail.products,
              containerSize: element.containerSize ?? '',
              containerNo: element.containerNo ?? '',
              netWeight: element.netWeight ?? '',
              typeOfBaggage: element.typeOfBaggage ?? '',
              noOfPkg: (element.noOfPkg ?? 0).toString(),
              baggageName: element.baggageName ?? '',
              maxGrossWeight: element.maxGrossWeight ?? '',
              tareWeight: element.tareWeight ?? '',
              backGround: element.background ?? '',
              packing: element.packing ?? '',
              survey: element.survey ?? '',
              batchNo: element.batchNo ?? '',
              lineSealNo: element.lineSealNo ?? '',
              customSealNo: element.customSealNo ?? '',
              conclusion: element.conclusion ?? '',
              company_signed_stamp: sarvoday_marine_stamp,
              images: pathsAndUrls,
            };
            const tempDir = os.tmpdir();
            const tempFilePath = path.join(tempDir, `${this.serviceReport.serviceName}-${element.containerNo}.pdf`);
            const s3ReportPath: string = `ReportPDFs/${format(date, 'yyyy/MM/dd')}/${this.orderDetail.orderId}/${this.serviceReport.serviceName}-${element.containerNo}.pdf`;
            if (element._id) {
              reportFolderMap.push({
                id: new mongoose.Types.ObjectId(element._id.toString()),
                temp: tempFilePath,
                path: s3ReportPath,
              });
            }
            const generator = new ReportGenerator(tempFilePath, data);
            promise2.push(generator.generatePDF());
          } else {
            throw new Error('having issue at the time of generate pdf, Customer not found');
          }
        }
        await Promise.all(promise2);
        const promise3: any = [];
        reportFolderMap.forEach((reportFileInfo) => {
          if (this.serviceReport._id) {
            promise3.push(
              this.uploadFileFromTempPathToS3(
                new mongoose.Types.ObjectId(this.serviceReport._id.toString()),
                reportFileInfo.id,
                reportFileInfo.temp,
                reportFileInfo.path,
                s3instance,
                this.reportRepository,
              ),
            );
          }
        });

        await Promise.all(promise3);
      } else {
        throw new Error('having issue at the time of generate pdf, Service Container details not found');
      }
    } catch (error) {
      console.log('error', error);
      throw new Error('having issue at the time of generate pdf');
    }
  }

  private async uploadFileFromTempPathToS3(
    serviceId: mongoose.Types.ObjectId,
    containerId: mongoose.Types.ObjectId,
    tempFilePath: string,
    s3Path: string,
    s3Service: ImageUploadService,
    reportRepository: ReportRepository,
  ): Promise<void> {
    try {
      const signedUrl = await s3Service.putSignedUrlforAWsImageUpload(s3Path);
      const fileBuffer = fs.readFileSync(tempFilePath);
      console.log('tempFilePath', tempFilePath);

      const response = await axios.put(signedUrl, fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Length': fileBuffer.length,
        },
      });
      console.log('response', response.status);
      if (response.status === 200) {
        await reportRepository.updateServiceContainerPDFPath(serviceId, containerId, s3Path);
        // fs.unlinkSync(tempFilePath);
      } else {
        console.error(`Failed to upload file. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
}
