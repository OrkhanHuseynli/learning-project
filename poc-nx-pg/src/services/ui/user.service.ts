import { UserCreateDto } from "src/dto/user.create.dto";

const endpoint = "/api/post";

export class UserService {
  async createUser(postUpdateDto: UserCreateDto): Promise<any> {
    return fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: postUpdateDto.name,
        email: postUpdateDto.email,
        roles: postUpdateDto.roles,
      }),
    });
  }
}
