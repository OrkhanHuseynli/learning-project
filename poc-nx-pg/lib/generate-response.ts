import { NextResponse } from "next/server";

export  function generalResponse(message: string, status: number) {
    return NextResponse.json(
      {
        message,
      },
      {
        status,
      }
    );
  }