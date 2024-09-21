import { CreateUser } from '@src/modules/authentication_module/application/interface/user.interface';
import { UserRoles } from '@src/shared/enum/user_roles.enum';
import mongoose from 'mongoose';

interface CreateEmployee {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  userRole: UserRoles;
  isDeleted: boolean;
  // assignLocations: mongoose.Types.ObjectId[];
}

interface Employee extends CreateEmployee {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface EmployeeResponse extends Employee {
  userDetail: CreateUser;
  // assignLocations: Location[];
}
export { Employee, CreateEmployee, EmployeeResponse };
