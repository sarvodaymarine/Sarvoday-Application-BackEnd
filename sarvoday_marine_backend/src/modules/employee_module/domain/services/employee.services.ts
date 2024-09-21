import mongoose from 'mongoose';
import { CreateEmployee, Employee, EmployeeResponse } from '../../application/interface/employee.interface';
import { EmployeeRepository } from '../../application/interface/employee_repository.interface';
import { UserRoles } from '@src/shared/enum/user_roles.enum';

export class EmployeeServices {
  constructor(private employeeRepository: EmployeeRepository) {}

  async createEmployeeService(
    userRef: mongoose.Types.ObjectId,
    firstName: string,
    lastName: string,
    userRole: UserRoles,
    // assignLocations: mongoose.Types.ObjectId[],
    // options: { session?: ClientSession } = {},
  ): Promise<void> {
    const employee: CreateEmployee = {
      userId: userRef._id,
      firstName: firstName,
      lastName: lastName,
      userRole: userRole,
      isDeleted: false,
      // assignLocations: assignLocations,
    };

    return await this.employeeRepository.create(employee /*options*/);
  }

  async updateEmployee(id: string, updateDetails: Partial<Employee>): Promise<Employee | null> {
    return await this.employeeRepository.update(id, updateDetails);
  }

  async deleteEmployee(id: string): Promise<Employee| null> {
    return await this.employeeRepository.delete(id);
  }

  // async getEmployeeById(id: string): Promise<Employee | null> {
  //   return this.employeeRepository.findById(id);
  // }

  // async getEmployeeByMobile(countryCode: string, mobile: string): Promise<Employee | null> {
  //   return this.employeeRepository.findByMobile(countryCode, mobile);
  // }

  async getAllEmployeesDetails(): Promise<EmployeeResponse[] | null> {
    return await this.employeeRepository.getAllEmployeesDetails();
  }

  async getAllEmployees(): Promise<Employee[] | null> {
    return await this.employeeRepository.getAllEmployees();
  }

  // async disableAndEnableEmployee(): Promise<Employee[] | null> {
  //   return await this.employeeRepository.getAllEmployees();
  // }
}
