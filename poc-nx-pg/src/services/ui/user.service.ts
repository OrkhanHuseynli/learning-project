import { UserCreateDto } from "src/dto/user.create.dto";

const endpoint = "/api/user";

export class UserService {
  async createUser(userCreateDto: UserCreateDto): Promise<boolean> {
    console.log("createUser");
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userCreateDto.name,
        lastName: userCreateDto.lastName,
        email: userCreateDto.email,
        roles: userCreateDto.roles,
        password: userCreateDto.password,
      }),
    });
    if (result.status === 201) {
      return true;
    }
    console.log(result);
    return false;
  }
}
