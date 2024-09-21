import { CreateEmployee, Employee, EmployeeResponse } from '../../application/interface/employee.interface';
import { EmployeeRepository } from '../../application/interface/employee_repository.interface';
import { EmployeeModel } from '../../domain/models/employee.model';

export class EmployeeRepositoryImpl implements EmployeeRepository {
  async create(employee: CreateEmployee /*options: { session?: ClientSession }*/): Promise<void> {
    const employeeModel = new EmployeeModel(employee);
    await employeeModel.save(/*options*/);
  }

  async update(id: string, updatedEmployeeDetail: Partial<Employee>): Promise<Employee | null> {
    return await EmployeeModel.findOneAndUpdate({ _id: id }, { $set: updatedEmployeeDetail }, { new: true }).exec();
  }

  async delete(id: string): Promise<Employee | null> {
    return await EmployeeModel.findByIdAndUpdate({ _id: id }, { $set: { isDeleted: true } }, { new: true }).exec();
  }

  // async findById(id: string): Promise<Employee | null> {
  //   const employee = await EmployeeModel.findById(id);
  //   return employee ? (employee.toObject() as Employee) : null;
  // }

  // async findByMobile(countryCode: string, mobile: string): Promise<Employee | null> {
  //   const employee = await EmployeeModel.findOne({ countryCode, mobile });
  //   return employee ? (employee.toObject() as Employee) : null;
  // }

  async getAllEmployeesDetails(): Promise<EmployeeResponse[] | null> {
    const employeeList = await EmployeeModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetail',
        },
      },
      {
        $unwind: {
          path: '$userDetail',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          'userDetail.isDeleted': false,
        },
      },
      {
        $project: {
          userId: 1,
          userRole: 1,
          firstName: 1,
          lastName: 1,
          isDeleted: 1,

          userDetail: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            isDeleted: 1,
            email: 1,
            isActive: 1,
            userRole: 1,
            countryCode: 1,
            mobile: 1,
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    if (employeeList != null) return employeeList as EmployeeResponse[];
    return employeeList;
  }

  async getAllEmployees(): Promise<Employee[] | null> {
    const employeeList = await EmployeeModel.find();
    return employeeList;
  }
}
