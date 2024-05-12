import { UserCreateDto } from "src/dto/user.create.dto";
import { CurrentUserDto, UserDto } from "../../dto";
import { AppServerContext } from "src/serverContext";
import { Role } from "@prisma/client";
import { AuthService } from "src/auth/auth.service";

const prisma = AppServerContext.getPrisma();

export class UserService {
  getCurrentUser(): CurrentUserDto {
    // TODO: must be derived from JWT
    const user = new CurrentUserDto();
    user.id = 1;
    user.roles = [Role.admin];
    user.email = "admin@email.com";
    return user;
  }

  async createUser(userDto: UserCreateDto): Promise<any> {
    const currentUser: CurrentUserDto = new UserService().getCurrentUser();

    const user = {
      name: userDto.name,
      lastName: userDto.lastName,
      email: userDto.email,
      roles: userDto.roles as Role[],
      password: AuthService.hashPassword(userDto.password),
      createdBy: currentUser.email,
      updatedBy: currentUser.email,
    };
    const createUser = await prisma.user.create({ data: user });
    return createUser;
  }

  async userExists(email: string): Promise<boolean> {
    const createUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return createUser ? true : false;
  }
}
