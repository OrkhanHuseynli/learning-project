import bcrypt from "bcrypt";
const saltRounds = 5;

// Hash a password
export class AuthService {
  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, saltRounds);
  }

  static validatePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
