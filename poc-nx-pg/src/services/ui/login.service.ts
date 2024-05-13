import { UserLoginDto } from "src/dto/user.create.dto";

const loginEndpoint = "/api/auth/login";

export class LoginService {
  static async login(userLoginDto: UserLoginDto): Promise<boolean> {
    const result = await fetch(loginEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userLoginDto),
    });
    if (result.status === 200) {
      return true;
    }
    console.log(result);
    return false;
  }
}
