import { UserRoles } from '@src/shared/enum/user_roles.enum';

export interface BaseUser {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobile: string;
  userRole: UserRoles;
  isActive: boolean;
  isDeleted: boolean;
}
