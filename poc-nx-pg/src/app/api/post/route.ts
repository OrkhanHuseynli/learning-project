import { NextRequest, NextResponse } from "next/server";
import { AppServerContext } from "../../../serverContext";
import { PostDto } from "../../../dto";
import {
  validateContentCreateDto,
  validateContentDto,
} from "../../../dto/validators";
import { UserService } from "@/services/be";

const prisma = AppServerContext.getPrisma();
const userService = new UserService();

export async function GET(req: NextRequest) {
  const skip = Number(req.nextUrl.searchParams.get("skip"));
  const take = Number(req.nextUrl.searchParams.get("take"));

  let posts = null;
  try {
    posts = await prisma.post.findMany({
      skip: skip,
      take: Number(30),
      orderBy: {
        title: "desc",
      },
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        message: "Error during repository request",
      },
      {
        status: 500,
      }
    );
  }

  if (posts) {
    return NextResponse.json({ posts });
  }
  return NextResponse.json(
    {
      message: "this post was not found",
    },
    {
      status: 404,
    }
  );
}

/**
 * @swagger
 * /api/post:
 *   post:
 *     description: creates post
 *     tags: [Post]
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: Optional description in *Markdown*
 *       required: true
 *       content:
 *        application/json:
 *           schema:
 *            $ref: '#/components/schemas/PostCreateDto'
 *     responses:
 *       201:
 *         description: Created Post item
 *         content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/PostCreateDto'
 */
export async function POST(req: Request, res: Response) {
  const data = await req.json();

  if (validateContentCreateDto(data)) {
    console.log("validated");
    try {
      const createdPost = await prisma.post.create({
        data: {
          title: data.title,
          author: {
            connect: {
              id: userService.getCurrentUser().id,
            },
          },
          content: data.content,
          published: data.published,
        },
      });

      return NextResponse.json(createdPost, { status: 201 });
    } catch (e) {
      console.log(`Error while creating a post item`);
      console.log(e);
      return NextResponse.json(
        {
          message: `Failed while creating a post item with ${PostDto.name}`,
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
      message: `Request body doesn't satisfy the expected contract for ${PostDto.name}`,
    },
    {
      status: 500,
    }
  );
}

export async function PUT(req: Request, res: Response) {
  const data = await req.json();
  if (validateContentDto(data)) {
    console.log("validated");
    return Response.json(data);
  }
  return NextResponse.json(
    {
      message: `Request body doesn't satisfy the expected contract for ${PostDto.name}`,
    },
    {
      status: 500,
    }
  );
}
