import { CurrentUserDto } from "../../dto";

export class UserService {
  getCurrentUser(): CurrentUserDto {
    const user = new CurrentUserDto();
    user.id = 1;
    return user;
  }
}
