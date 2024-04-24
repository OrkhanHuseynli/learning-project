import { NextRequest, NextResponse } from "next/server";
import { AppContext } from "../../../context";
import { ContentDto } from "../../../dto";
import {
  validateContentCreateDto,
  validateContentDto,
} from "../../../dto/validators";

const prisma = AppContext.getPrisma();

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
              id: data.author_id,
            },
          },
          content: data.content,
          published: data.published,
        },
      });

      return Response.json(createdPost);
    } catch (e) {
      console.log(`Error while creating a post item`);
      console.log(e);
      return NextResponse.json(
        {
          message: `Failed while creating a post item with ${ContentDto.name}`,
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
      message: `Request body doesn't satisfy the expected contract for ${ContentDto.name}`,
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
      message: `Request body doesn't satisfy the expected contract for ${ContentDto.name}`,
    },
    {
      status: 500,
    }
  );
}
