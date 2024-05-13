import { validateEmail } from "src/lib/validators";
import { UserService } from "@/services/be";
import { NextRequest} from "next/server";
import { generalResponse } from "lib/generate-response";

const userService = new UserService();

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  let message = "User doesn't exist";

  try {
    if (!validateEmail(email)) {
      message = "Please provide a valid email address";
      return generalResponse(message, 406);
    }
    const result = await userService.userExists(email);
    if (result) {
      message = "User exists";
      return generalResponse(message, 200);
    }
    return generalResponse(message, 404);
  } catch (e) {
    console.log(e);
    message = "Error during repository request";
    return generalResponse(message, 500);
  }
}
