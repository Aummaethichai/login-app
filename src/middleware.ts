import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_KEY = new TextEncoder().encode(`${process.env.TOKEN_SECRET_KEY}`);
// interface dataTyp
export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  try {
    if (token) {
      await jwtVerify(token, JWT_SECRET_KEY);

      if (request.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/home", request.url));
      }
      return NextResponse.next();
    }
  } catch (error) {
    console.log(error);
    cookieStore.set("auth_token", "", { expires: new Date(0) });
    const response = NextResponse.redirect(new URL("/", request.url));
    return response
  }

  if (!token && request.nextUrl.pathname === "/home") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();

}

export const config = {
  matcher: ["/", "/home"],
};
