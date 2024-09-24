/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ServiceContainerModel } from '../../application/interface/report.interface';
import { ReportRepository } from '../../application/interface/report_repository.interface';
import { ReportGenerator, TemplateData } from './pdf_generation_handler';
import { SalesOrder } from '@src/modules/sales_order_module/application/interface/salesOrder.interface';
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
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  private formatDateWithSuffix = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const ordinalSuffix = this.getOrdinalSuffix(day);

    return `${day}${ordinalSuffix} ${month}, ${year}`;
  };

  public async containerPDFgeneration(): Promise<void> {
    try {
      console.log('service PDF Generation Start');
      const date: Date = new Date();
      const reportDate: string = this.formatDateWithSuffix(date);
      const s3instance = new ImageUploadService();

      const clientInfo = await new ClientRepositoryImpl().findByUserId(this.orderDetail.clientId);
      if (!clientInfo) {
        throw new Error('having issue at the time of generate pdf, Customer not found');
      }
      const getImagePromise = [];
      getImagePromise.push(s3instance.getSignedAWSFileOrIMageUrl('Picture1.png'));
      getImagePromise.push(s3instance.getSignedAWSFileOrIMageUrl('Picture1.png'));
      const headerImages = await Promise.all(getImagePromise);

      if (this.serviceReport.containerReports) {
        const promise2: any[] = [];
        const promise3: any[] = [];

        const allContainerPromises = this.serviceReport.containerReports.map(async (element) => {
          const pathsAndUrls: {
            url: string;
            name: string;
          }[] = [];

          if (element.containerImages) {
            const imagePromises: any[] = element.containerImages.map(async (image) => {
              if (image.imagePath) {
                return s3instance.getSignedAWSFileOrIMageUrl(image.imagePath).then((signedUrl: string) => {
                  if (signedUrl) {
                    pathsAndUrls.push({ url: signedUrl, name: image.imageName ?? image.imageId ?? '' });
                  }
                });
              }
              return Promise.resolve();
            });

            await Promise.all(imagePromises);
          }

          const data: TemplateData = {
            sarvoday_marine_logo: headerImages.length > 0 ? headerImages[0] : '',
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
            company_signed_stamp: headerImages.length > 1 ? headerImages[1] : '',
            images: pathsAndUrls,
          };

          const tempDir = os.tmpdir();
          const tempFilePath = path.join(tempDir, `${this.serviceReport.serviceName}-${element.containerNo}.pdf`);
          const s3ReportPath: string = `ReportPDFs/${format(date, 'yyyy/MM/dd')}/${this.orderDetail.orderId}/${this.serviceReport.serviceName}-${element.containerNo}.pdf`;

          const generator = new ReportGenerator(tempFilePath, data);
          promise2.push(generator.generatePDF());

          if (this.serviceReport._id && element._id) {
            promise3.push(
              this.uploadFileFromTempPathToS3(
                new mongoose.Types.ObjectId(this.serviceReport._id.toString()),
                new mongoose.Types.ObjectId(element._id.toString()),
                tempFilePath,
                s3ReportPath,
                s3instance,
                this.reportRepository,
              ),
            );
          }
        });

        await Promise.all(allContainerPromises);

        await Promise.all(promise2);
        console.log('PDF Generated');
        await Promise.all(promise3);
        console.log('PDF Uploaded');
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

      const response = await axios.put(signedUrl, fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Length': fileBuffer.length,
        },
      });
      console.log('response', response.status);
      if (response.status === 200) {
        await reportRepository.updateServiceContainerPDFPath(serviceId, containerId, s3Path);
        fs.unlinkSync(tempFilePath);
      } else {
        console.error(`Failed to upload file. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
}
