import { Session } from "@/app/auth";
import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";

const authRoutes = ["/sign-in", "/sign-up"];
const passwordRoutes = ["/forgot-password", "/reset-password"];
// const adminRoutes = ["/admin"];

export default async function authMiddleware(req: NextRequest) {
  const pathName = req.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathName);
  const isPasswordRoute = passwordRoutes.includes(pathName);
  // const isAdminRoute = adminRoutes.includes(pathName);

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.NEXT_PUBLIC_URL,
      headers: {
        // get the cookie from the request
        cookie: req.headers.get("cookie") || "",
      },
    }
  );

  if (!session) {
    if (isAuthRoute || isPasswordRoute) {
      return NextResponse.next(); // allow that
    }

    // other routes require authentication
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // user is logged in
  if (isAuthRoute || isPasswordRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // anything else is allowed
  return NextResponse.next();
}

// this middleware will be executed for all routes, except for api routes, static files, and images.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
