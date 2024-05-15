import { UserLoginDto } from "src/dto/user.create.dto";
import { PrismaClient, Role } from "@prisma/client";
import { AuthService } from "src/auth/auth.service";
import { SessionService } from "./session.service";

export class LoginService {
  private prisma = undefined;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  // use this in a controller handling login request
  async login(userDto: UserLoginDto): Promise<any> {
    const user = {
      email: userDto.email,
    };
    const u = await this.prisma.user.findUnique({ where: user });
    console.log(u);
    const { id, email , roles} = u;
    await SessionService.createSession(
      id,
      email,
      SessionService.createExpDate(10)
    );
    return AuthService.validatePassword(userDto.password, u.password);
  }
}
