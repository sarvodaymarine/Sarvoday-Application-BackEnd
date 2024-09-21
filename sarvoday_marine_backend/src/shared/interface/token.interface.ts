import { Schema } from 'mongoose';
import { UserRoles } from '../enum/user_roles.enum';

interface Token extends Object {
  id: Schema.Types.ObjectId;
  userRole: UserRoles;
  expiresIn: number;
}

export default Token;
