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

  private getStartOfWeek(): Date {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

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
              : cs._id.toString() === service.serviceId.toString();
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
    const client = await this.clientRepository.findById(data.clientId);
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
    await this.setupReportDetails(data, servicesList ?? [], client.services, false);
    return this.salesOrderRepository.create(data);
  }

  async updateSalesOrder(id: string, updateDetails: Partial<SalesOrder>, userRole: string): Promise<SalesOrder | null> {
    const orderDetail = await this.salesOrderRepository.findById(id);
    console.log('updateDetails', updateDetails);
    if (!orderDetail) {
      throw new Error(`Sales Order doesn't found`);
    }

    const client = await this.clientRepository.findById(updateDetails.clientId ?? orderDetail.clientId);
    if (!client) {
      throw new Error(`Client with ID ${orderDetail.clientId} not found`);
    }
    const servicesList = await this.serviceRepository.getAllServices();
    await this.setupReportDetails(updateDetails, servicesList ?? [], client.services, true);

    if (userRole === UserRoles.ADMIN) {
      // const oldServiceIds = orderDetail.services.map((s) => s.serviceId.toString());
      // const newServices =
      //   updateDetails.services?.filter((service) => !oldServiceIds.includes(service.serviceId.toString())) || [];
      // const updatedNewServicesWithPrices = await this.ServicePriceCalculation(
      //   updateDetails.noOfContainer ?? orderDetail.noOfContainer,
      //   newServices,
      //   client.services,
      //   userRole,
      //   updateDetails.clientName ?? orderDetail.clientName,
      // );
      // if (updateDetails.noOfContainer != undefined && updateDetails.noOfContainer === 0) {
      //   throw new Error(`Count of container must be greter than 0`);
      // }
      // let updatedOldServiceWithPrice = orderDetail.services;
      // if (updateDetails.noOfContainer !== orderDetail.noOfContainer) {
      //   updatedOldServiceWithPrice = await Promise.all(
      //     orderDetail.services.map(async (service) => {
      //       return {
      //         serviceId: service.serviceId,
      //         serviceName: service.serviceName,
      //         priceType: service.priceType,
      //         price: service.price,
      //         totalPrice: (service.price ?? 0) * (updateDetails.noOfContainer ?? 1),
      //       };
      //     }),
      //   );
      // }

      // const totalNewServicePrice = updatedNewServicesWithPrices.reduce(
      //   (sum, service) => sum + (service.totalPrice ?? 0),
      //   0,
      // );
      // const totalOldServicePrice = updatedOldServiceWithPrice.reduce(
      //   (sum, service) => sum + (service.totalPrice ?? 0),
      //   0,
      // );

      // const totalExpensePrice = (updateDetails.otherExpenses ?? orderDetail.otherExpenses).reduce(
      //   (sum, expenseInfo) => sum + expenseInfo.price,
      //   0,
      // );

      // let totalTax = 0;
      // const calculatedTaxes =
      //   (updateDetails.tax ?? orderDetail.tax).map((tax) => {
      //     const taxAmount =
      //       ((totalNewServicePrice + totalOldServicePrice + totalExpensePrice) * (tax.cGST + tax.sGST)) / 100;
      //     totalTax += taxAmount;

      //     return {
      //       ...tax,
      //       taxPrice: taxAmount,
      //     };
      //   }) || [];

      // updateDetails.tax = calculatedTaxes;
      // updateDetails.totalTax = totalTax;
      // updateDetails.totalInvoice = totalTax + totalExpensePrice + totalNewServicePrice + totalOldServicePrice;
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
    servicesList: Service[],
    clientServicesList: ClientService[],
    isFromUpdate: boolean,
  ): Promise<void> {
    const serviceReports: ServiceContainerModel[] = [];
    const promise: Promise<ServiceContainerMetaData>[] = [];
    for (const service of data.services ?? []) {
      const serviceFromClient = clientServicesList.find((cs) =>
        isFromUpdate
          ? cs.serviceId === service.serviceId.toString()
          : cs._id.toString() === service.serviceId.toString(),
      );

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
      console.log('clientService', clientService);
      const containerImages = clientService.serviceImage
        .filter((element) => {
          console.log('Filtering element with imagecount:', element.imageCount);
          const imageCount = Number(element.imageCount);
          return imageCount > 0;
        })
        .flatMap((element) => {
          console.log('element', element);
          const imageCount = Number(element.imageCount);
          return Array.from({ length: imageCount }, (_, i) => ({
            imageName: element.imageName,
            imageId: `${element.imageName}${i + 1}`,
            imageUrlLink: '',
          }));
        });

      console.log('Container Images:', containerImages);

      const container: ContainerModel = { containerImages };
      const containerList = Array.from({ length: data.noOfContainer ?? 0 }, () => container);

      const serviceReport: ServiceContainerModel = {
        serviceName: service.serviceName,
        containerReports: containerList,
      };
      serviceReports.push(serviceReport);
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

    const result = await Promise.all(promise);
    const reportData: Report = {
      orderId: data.orderId,
      isEmailSended: false,
      isReviewed: false,
      isSubmited: false,
      serviceReports: result,
    };

    await this.reportRepository.create(reportData);
  }

  async getSalesOrderById(id: string): Promise<SalesOrder | null> {
    return this.salesOrderRepository.findById(id);
  }

  async getAllSalesOrders(userRole: string, userId: Types.ObjectId): Promise<SalesOrder[] | null> {
    let filter = {};

    switch (userRole) {
      case 'admin':
        filter = {
          adminId: userId,
          createdAt: { $gte: this.getStartOfWeek() },
        };
        break;
      case 'client':
        filter = {
          clientId: userId,
          createdAt: { $gte: this.getStartOfWeek() },
        };
        break;
      case 'employee':
        filter = {
          'employees.employeeId': userId,
          'employees.isAssigned': true,
          createdAt: { $gte: this.getStartOfWeek() },
        };
        break;
      case 'superadmin':
        filter = {
          createdAt: { $gte: this.getStartOfWeek() },
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
    }

    return order;
  }
}
