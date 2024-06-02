import { NextRequest, NextResponse } from "next/server";
// import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";
import { SessionService } from "./auth/be/session.service";

// 1. Specify protected and public routes
const protectedRoutes = ["/admin", "/user", "/page", "/post", "/posts"];
const publicRoutes = ["/login", "/signup"];
const redirectMap = new Map<string, string>([["/home", "/"]]);

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path)
  // const isPublicRoute = publicRoutes.includes(path)

  // // 3. Decrypt the session from the cookie
  const cookie = cookies().get("session")?.value;
  if (
    (cookie === null || cookie === undefined) &&
    !publicRoutes.includes(path)
  ) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  console.log(cookie);
  const session = await SessionService.decrypt(cookie);

  console.log("you session is here");
  console.log(session);
  if (session) {
    console.log(session);
  }

  // 5. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // // 6. Redirect to /dashboard if the user is authenticated
  // if (
  //   isPublicRoute &&
  //   session?.userId &&
  //   !req.nextUrl.pathname.startsWith('/posts')
  // ) {
  //   return NextResponse.redirect(new URL('/posts', req.nextUrl))
  // }

  if (redirectMap.has(path)) {
    return NextResponse.redirect(new URL(redirectMap.get(path), req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      has: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },

    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      has: [{ type: "header", key: "x-present" }],
      missing: [{ type: "header", key: "x-missing", value: "prefetch" }],
    },
  ],
};
