import { ContentDto } from "../../../dto/content.dto";
import { createPost } from "./../../../../lib/dynamodb";

export async function GET(req: Request) {
  return new Response("Hi hello");
}

export async function POST(req: Request, res: Response) {
  console.log("********");
  const data = await req.json();
  const contentDto = data as ContentDto;
  if (contentDto.body !== null) {
    return Response.json(contentDto);
  }
  throw new Error(`Request body doesn't satisfy the expected contract`);
}
