import { SalesOrderRepository } from '../../application/interface/salesOrder_repository.interface';
import { CreateSalesOrder, SalesOrder, SoService } from '../../application/interface/salesOrder.interface';
import { PriceType } from '@src/shared/enum/price_type.enum';
import { ClientRepository } from '@src/modules/client_module/application/interface/client_repository.interface';
import { UserRoles } from '@src/shared/enum/user_roles.enum';
import { ClientService } from '@src/modules/client_module/application/interface/client.interface';
import { BusinessConfigRepository } from '../../application/interface/business_cofig_repository.interface';
import { Types } from 'mongoose';
import { SoStatus } from '@src/shared/enum/so_status.enum';
import { ReportRepository } from '@src/modules/report_module/application/interface/report_repository.interface';
import {
  ContainerModel,
  Report,
  ServiceContainerModel,
  ServiceContainerMetaData,
} from '@src/modules/report_module/application/interface/report.interface';
import { Service } from '@src/modules/services_module/application/interface/services.interface';
import { ServiceRepository } from '@src/modules/services_module/application/interface/services_repository.interface';

export class SalesOrderServices {
  constructor(
    private salesOrderRepository: SalesOrderRepository,
    private clientRepository: ClientRepository,
    private config: BusinessConfigRepository,
    private reportRepository: ReportRepository,
    private serviceRepository: ServiceRepository,
  ) {}

  private async ServicePriceCalculation(
    noOfContainer: number,
    services: SoService[],
    clientServices: ClientService[],
    userRole: string,
    clientName: string,
    isFromUpdate: boolean,
  ): Promise<SoService[]> {
    const servicesWithPrices =
      (await Promise.all(
        services.map(async (service) => {
          const clientService = clientServices.find((cs) => {
            return !isFromUpdate
              ? cs.serviceId === service.serviceId.toString()
              : cs._id.toString() === service.serviceId.toString() || cs.serviceId === service.serviceId.toString();
          });
          if (!clientService) {
            throw new Error(`Service with ID ${service.serviceId} not found for client ${clientName}`);
          }
          let servicePrice = 0;
          let totalPrice: number = 0;
          if (service.price != null && userRole == UserRoles.SUPERADMIN) {
            servicePrice = service.price;
            totalPrice = service.price * (noOfContainer || 1);
          } else if (service.priceType == PriceType.CONTAINER1) {
            servicePrice = clientService.container1Price;
            totalPrice = clientService.container1Price * (noOfContainer || 1);
          } else if (service.priceType == PriceType.CONTAINER2) {
            servicePrice = clientService.container2Price;
            totalPrice = clientService.container2Price * (noOfContainer || 1);
          } else if (service.priceType == PriceType.CONTAINER3) {
            servicePrice = clientService.container3Price;
            totalPrice = clientService.container3Price * (noOfContainer || 1);
          } else if (service.priceType == PriceType.CONTAINER4) {
            servicePrice = clientService.container4Price;
            totalPrice = clientService.container4Price * (noOfContainer || 1);
          } else {
            throw new Error(`Service type ${service.priceType} not found`);
          }

          return {
            serviceId: clientService._id,
            serviceName: clientService.serviceName,
            priceType: service.priceType,
            price: servicePrice,
            totalPrice: totalPrice,
          };
        }),
      )) || [];

    return servicesWithPrices;
  }

  async createSalesOrder(userId: Types.ObjectId, data: CreateSalesOrder, userRole: string): Promise<void> {
    const client = await this.clientRepository.findByUserId(data.clientId);
    if (!client) {
      throw new Error(`Client with ID ${data.clientId} not found`);
    }
    const servicesList = await this.serviceRepository.getAllServices();
    const businessConfig = await this.config.getBusinessConfig();
    if (!businessConfig) {
      throw new Error(`Something went to wrong please try again later!`);
    }

    data.orderId = (businessConfig[0].soId + 1).toString();
    const servicesWithPrices = await this.ServicePriceCalculation(
      data.noOfContainer,
      data.services,
      client.services,
      userRole,
      data.clientName,
      false,
    );

    data.status = SoStatus.BOOKED;
    data.adminId = userId;

    data.services = servicesWithPrices;
    const totalServicePrice = servicesWithPrices.reduce((sum, service) => sum + (service.totalPrice ?? 0), 0);
    const totalExpensePrice = data.otherExpenses.reduce((sum, expenseInfo) => sum + expenseInfo.price, 0);

    let totalTax = 0;
    const calculatedTaxes = data.tax.map((tax) => {
      const taxAmount = ((totalServicePrice + totalExpensePrice) * (tax.cGST + tax.sGST)) / 100;
      totalTax += taxAmount;

      return {
        ...tax,
        taxPrice: taxAmount,
      };
    });

    data.tax = calculatedTaxes;
    data.totalTax = totalTax;
    data.totalInvoice = totalTax + totalExpensePrice + totalServicePrice;
    this.config.update(businessConfig[0]._id.toString(), { soId: businessConfig[0].soId + 1 });
    await this.setupReportDetails(data, null, servicesList ?? [], client.services, false, data.orderId);
    return this.salesOrderRepository.create(data);
  }

  async updateSalesOrder(id: string, updateDetails: Partial<SalesOrder>, userRole: string): Promise<SalesOrder | null> {
    const orderDetail = await this.salesOrderRepository.findById(id);
    if (!orderDetail) {
      throw new Error(`Sales Order doesn't found`);
    }

    const client = await this.clientRepository.findByUserId(updateDetails.clientId ?? orderDetail.clientId);
    if (!client) {
      throw new Error(`Client with ID ${orderDetail.clientId} not found`);
    }
    const servicesList = await this.serviceRepository.getAllServices();
    if (
      (updateDetails.clientId !== undefined &&
        updateDetails.clientId !== null &&
        orderDetail.clientId !== updateDetails.clientId) ||
      (updateDetails.services !== undefined &&
        updateDetails.services !== null &&
        orderDetail.services !== updateDetails.services) ||
      (updateDetails.noOfContainer !== undefined &&
        updateDetails.noOfContainer !== null &&
        orderDetail.noOfContainer !== updateDetails.noOfContainer)
    ) {
      await this.setupReportDetails(
        updateDetails,
        orderDetail,
        servicesList ?? [],
        client.services,
        true,
        orderDetail.orderId,
      );
    }
    if (userRole === UserRoles.ADMIN) {
      const servicesWithPrices = await this.ServicePriceCalculation(
        updateDetails.noOfContainer!,
        updateDetails.services!,
        client.services,
        userRole,
        updateDetails.clientName!,
        true,
      );

      updateDetails.services = servicesWithPrices;
      const totalServicePrice = servicesWithPrices.reduce((sum, service) => sum + (service.totalPrice ?? 0), 0);
      const totalExpensePrice =
        updateDetails.otherExpenses?.reduce((sum, expenseInfo) => sum + expenseInfo.price, 0) ?? 0;

      let totalTax = 0;
      const calculatedTaxes = updateDetails.tax?.map((tax) => {
        const taxAmount = ((totalServicePrice + totalExpensePrice) * (tax.cGST + tax.sGST)) / 100;
        totalTax += taxAmount;

        return {
          ...tax,
          taxPrice: taxAmount,
        };
      });

      updateDetails.tax = calculatedTaxes;
      updateDetails.totalTax = totalTax;
      updateDetails.totalInvoice = totalTax + totalExpensePrice + totalServicePrice;
    } else if (userRole === UserRoles.SUPERADMIN) {
      const updatedServicesWithPrices = await this.ServicePriceCalculation(
        updateDetails.noOfContainer ?? orderDetail.noOfContainer,
        updateDetails.services ?? orderDetail.services,
        client.services,
        userRole,
        updateDetails.clientName ?? orderDetail.clientName,
        true,
      );

      const totalServicePrice = updatedServicesWithPrices.reduce((sum, service) => sum + (service.totalPrice ?? 0), 0);
      const totalExpensePrice = (updateDetails.otherExpenses ?? orderDetail.otherExpenses).reduce(
        (sum, expenseInfo) => sum + expenseInfo.price,
        0,
      );

      let totalTax = 0;
      const calculatedTaxes =
        (updateDetails.tax ?? orderDetail.tax).map((tax) => {
          const taxAmount = ((totalServicePrice + totalExpensePrice) * (tax.cGST + tax.sGST)) / 100;
          totalTax += taxAmount;

          return {
            ...tax,
            taxPrice: taxAmount,
          };
        }) || [];

      updateDetails.services = updatedServicesWithPrices;
      updateDetails.tax = calculatedTaxes;
      updateDetails.totalTax = totalTax;
      updateDetails.totalInvoice = totalTax + totalServicePrice + totalExpensePrice;
    } else {
      throw new Error(`Permission Denied`);
    }

    return await this.salesOrderRepository.update(id, updateDetails);
  }

  async setupReportDetails(
    data: Partial<SalesOrder>,
    orderDetail: SalesOrder | null,
    servicesList: Service[],
    clientServicesList: ClientService[],
    isFromUpdate: boolean,
    orderId: string,
  ): Promise<void> {
    const existingServiceReports: ServiceContainerMetaData[] = [];
    const promise: Promise<ServiceContainerMetaData>[] = [];
    const promise2 = [];

    const existingReport = isFromUpdate ? await this.reportRepository.findReportBySalesOrder(orderId) : null;

    for (const service of data.services ?? []) {
      const serviceFromClient = clientServicesList.find((cs) => {
        return isFromUpdate
          ? cs.serviceId === service.serviceId.toString() || cs._id.toString() === service.serviceId.toString()
          : cs._id.toString() === service.serviceId.toString();
      });

      if (!serviceFromClient) {
        console.error(`Service from client not found for service: ${service.serviceName}`);
        throw new Error(`Service from client not found for service: ${service.serviceName}`);
      }

      const clientService = servicesList.find((cs) => {
        return cs._id.toString() === serviceFromClient?.serviceId;
      });

      if (!clientService) {
        console.error(`Client service not found for service: ${serviceFromClient.serviceName}`);
        throw new Error(`Client service not found for service: ${serviceFromClient.serviceName}`);
      }
      const existingServiceReport = existingReport?.serviceReports?.find(
        (report) => report.serviceName === service.serviceName,
      );

      const containerImages = clientService.serviceImage
        .filter((element) => Number(element.imageCount) > 0)
        .flatMap((element) => {
          const imageCount = Number(element.imageCount);
          return Array.from({ length: imageCount }, (_, i) => ({
            imageName: element.imageName,
            imageId: `${element.imageName}${i + 1}`,
            imageUrlLink: '',
          }));
        });

      const container: ContainerModel = { containerImages };
      const containerList = Array.from({ length: data.noOfContainer ?? 0 }, () => container);

      if (isFromUpdate && existingServiceReport) {
        if (data.noOfContainer !== orderDetail!.noOfContainer) {
          const serviceReport: ServiceContainerModel = {
            serviceName: existingServiceReport.serviceName,
            containerReports: containerList,
          };
          promise2.push(this.reportRepository.updateServiceReport(existingServiceReport.serviceId!, serviceReport));
        }
        existingServiceReports.push(existingServiceReport);
      } else {
        const serviceReport: ServiceContainerModel = {
          serviceName: service.serviceName,
          containerReports: containerList,
        };
        promise.push(
          this.reportRepository
            .createServiceReport(serviceReport)
            .then((id) => ({
              serviceName: serviceReport.serviceName,
              serviceId: id,
            }))
            .catch((error) => {
              throw new Error(`Failed to create service report: ${error.message}`);
            }),
        );
      }
    }

    if (isFromUpdate && existingReport) {
      const updatedServiceNames = data.services?.map((service) => service.serviceName) ?? [];
      const servicesToRemove =
        existingReport?.serviceReports?.filter((report) => !updatedServiceNames.includes(report.serviceName!)) ?? [];
      const promise3 = [];
      for (const serviceToRemove of servicesToRemove) {
        promise3.push(this.reportRepository.deleteServiceReport(new Types.ObjectId(serviceToRemove.serviceId)));
      }
      Promise.all(promise3);
    }

    let result = await Promise.all(promise);
    await Promise.all(promise2);
    result = result.concat(existingServiceReports);
    const reportData: Report = {
      orderId: data.orderId,
      isEmailSended: false,
      isReviewed: false,
      isSubmited: false,
      serviceReports: result,
    };

    if (isFromUpdate && existingReport) {
      await this.reportRepository.update(existingReport._id!.toString(), reportData);
    } else {
      await this.reportRepository.create(reportData);
    }
  }

  async getSalesOrderById(id: string): Promise<SalesOrder | null> {
    return this.salesOrderRepository.findById(id);
  }

  async getAllSalesOrders(
    userRole: string,
    userId: Types.ObjectId,
    startDateOfWeek: string,
    lastDateOfWeek: string,
  ): Promise<SalesOrder[] | null> {
    let filter = {};
    const startDate = new Date(startDateOfWeek).setHours(0, 0, 0, 0);
    const endDate = new Date(lastDateOfWeek).setHours(23, 59, 59, 59);

    const query = { $gte: startDate, $lte: endDate };

    switch (userRole) {
      case UserRoles.ADMIN:
        filter = {
          adminId: userId,
          orderDate: query,
        };
        break;
      case UserRoles.CLIENT:
        filter = {
          clientId: userId,
          orderDate: query,
        };
        break;
      case UserRoles.EMPLOYEE:
        filter = {
          employees: {
            $elemMatch: {
              employeeId: userId,
              isAssigned: true,
            },
          },
          orderDate: query,
        };
        break;
      case UserRoles.SUPERADMIN:
        filter = {
          orderDate: query,
        };
        break;
      default:
        throw new Error('Invalid user type');
    }
    const salesOrders = await this.salesOrderRepository.getAllSalesOrders(filter);
    if (!salesOrders) {
      return [];
    }
    return salesOrders.map((order) => this.sanitizeOrderResponse(order, userRole));
  }

  private sanitizeOrderResponse(order: SalesOrder, userType: string): SalesOrder {
    if (userType === 'admin' || userType === 'employee') {
      order.services.forEach((service) => {
        service.price = undefined;
        service.totalPrice = undefined;
      });
      order.totalTax = undefined;
      order.totalInvoice = undefined;
    }

    return order;
  }
}
