import { NextRequest, NextResponse } from "next/server";
import { AppContext } from "../../../../context";
import { ContentDto } from "../../../../dto";
import {
  validateContentDto,
  validateContentUpdateDto,
} from "../../../../dto/validators";

const prisma = AppContext.getPrisma();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: number } }
) {
  const id = params.slug;
  console.log(`Searching for post with id = ${id}`);
  let post = null;
  try {
    post = await prisma.post.findFirst({
      where: {
        id: Number(id),
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

  if (post) {
    return NextResponse.json({ post });
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

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: number } }
) {
  const id = params.slug;
  const data = await req.json();
  if (validateContentUpdateDto(data)) {
    console.log("validated");
    try {
      let result = await prisma.post.update({
        where: {
          id: Number(params.slug),
        },
        data: data,
      });

      return Response.json(result);
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
