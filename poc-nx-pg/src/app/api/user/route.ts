import { NextRequest, NextResponse } from "next/server";
import { AppServerContext } from "../../../serverContext";
import { PostDto } from "../../../dto";
import {
  validateContentCreateDto,
  validateContentDto,
  validateUserCreateDto,
} from "../../../dto/validators";
import { UserService } from "@/services/be/user.service";
import { UserCreateDto } from "src/dto/user.create.dto";

const prisma = AppServerContext.getPrisma();
const userService = new UserService();

export async function POST(req: Request, res: Response) {
  const data: UserCreateDto = await req.json();
  if (validateUserCreateDto(data)) {
    console.log("validated");
    try {
      const createdUser = await userService.createUser(data);
      return NextResponse.json(createdUser, { status: 201 });
    } catch (e) {
      console.log(`Error while creating a UserCreateDto item`);
      console.log(e);
      return NextResponse.json(
        {
          message: `Failed while creating a post item with ${UserCreateDto.name}`,
          e,
        },
        {
          status: 500,
        }
      );
    }
  }

  return NextResponse.json(
    {
      message: `Request body doesn't satisfy the expected contract for ${UserCreateDto.name}`,
    },
    {
      status: 500,
    }
  );
}
