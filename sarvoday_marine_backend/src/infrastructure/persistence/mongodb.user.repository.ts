// import { UserRepository } from '@src/modules/authentication_module/application/interface/user_repository.interface';
// import { User } from '@src/modules/authentication_module/domain/entities/user.entity';
// import { UserModel } from '@src/modules/authentication_module/application/models/user.model';
// import Email from '@src/shared/valueIbjects/email';

// export class MongoUserRepository implements UserRepository {
//   async save(user: User): Promise<void> {
//     const userDocument = new UserModel(user);
//     await userDocument.save();
//   }

//   async findById(id: string): Promise<User | null> {
//     const userDocument = await UserModel.findById(id);
//     return userDocument
//       ? new User(
//           userDocument.id,
//           userDocument.name,
//           new Email(userDocument.email),
//           userDocument.countryCode,
//           userDocument.mobile,
//           userDocument.isActive,
//           userDocument.isDeleted,
//         )
//       : null;
//   }
// }
