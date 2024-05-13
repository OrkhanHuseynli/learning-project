import { LoginService } from "@/services/be";
import { generalResponse } from "lib/generate-response";
import { NextResponse } from "next/server";
import { UserLoginDto } from "src/dto/user.create.dto";
import { validateUserLoginDto } from "src/dto/validators";
import { validateEmail } from "src/lib/validators";
import { AppServerContext } from "src/serverContext";

const prisma = AppServerContext.getPrisma();
const loginService = new LoginService(prisma);

export async function POST(req: Request, res: Response) {
  const data: UserLoginDto = await req.json();
  if (validateUserLoginDto(data)) {
    if (!validateEmail(data.email)) {
      return generalResponse("Login: email is not valid", 400);
    }
    try {
      const user = await loginService.login(data);
      return NextResponse.json(user, { status: 200 });
    } catch (e) {
      console.log(`Error while trying to login`);
      console.log(e);
      return generalResponse(`Failed while trying to login. Username or password is incorrect`, 403)
    }
  }

  return generalResponse(
    `Request body doesn't satisfy the expected contract for ${UserLoginDto.name}`,
    500
  );
}
