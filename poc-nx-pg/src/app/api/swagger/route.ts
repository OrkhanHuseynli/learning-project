import { NextRequest, NextResponse } from "next/server";
import { getApiDocs } from "./../../../lib/swagger-spec";

export async function GET(req: NextRequest) {
  const spec = await getApiDocs();
  return NextResponse.json(spec);
}
