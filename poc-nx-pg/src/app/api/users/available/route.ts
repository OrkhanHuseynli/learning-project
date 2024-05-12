import { validateEmail } from "@/app/lib/validators";
import { UserService } from "@/services/be";
import { NextRequest, NextResponse } from "next/server";
import { AppServerContext } from "src/serverContext";

const userService = new UserService();

function genResponse(message: string, status: number) {
  return NextResponse.json(
    {
      message,
    },
    {
      status,
    }
  );
}


export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  let message = "User doesn't exist";

  try {
    if (!validateEmail(email)) {
      message = "Please provide a valid email address";
      return genResponse(message, 406);
    }
    const result = await userService.userExists(email);
    if (result) {
      message = "User exists";
      return genResponse(message, 200);
    }
    return genResponse(message, 404);
  } catch (e) {
    console.log(e);
    message = "Error during repository request";
    return genResponse(message, 500);
  }
}
