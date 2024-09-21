import { genSalt, hash, compare } from 'bcryptjs';
export class PasswordHasher {
  async hashPassword(password: string): Promise<string> {
    // Use a robust hashing library like bcrypt
    const salt = await genSalt(10);
    return await hash(password, salt);
  }

  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await compare(plainPassword, hashedPassword);
  }
}
