import { UserLoginDto } from "src/dto/user.create.dto";
import { PrismaClient, Role } from "@prisma/client";
import { AuthService } from "src/auth/auth.service";

export class LoginService {
  private prisma = undefined;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  // use this in a controller handling login request
  async login(userDto: UserLoginDto): Promise<any> {
    const user = {
      email: userDto.email,
      password: AuthService.hashPassword(userDto.password),
    };
    const u = await this.prisma.user.findUnique({ where: user });
    return u;
  }
}
