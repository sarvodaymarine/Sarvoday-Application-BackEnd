import { CreateEmployee, Employee, EmployeeResponse } from './employee.interface';

export interface EmployeeRepository {
  create(employee: CreateEmployee /*options: { session?: ClientSession }*/): Promise<void>;
  update(id: string, employee: Partial<Employee>): Promise<Employee | null>;
  delete(id: string): Promise<Employee | null>;
  // findById(id: string): Promise<Employee | null>;
  // findByMobile(coutryCode: string, mobile: string): Promise<Employee | null>;
  getAllEmployeesDetails(): Promise<EmployeeResponse[] | null>;
  getAllEmployees(): Promise<Employee[] | null>;
}
