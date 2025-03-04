import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_KEY = new TextEncoder().encode(`${process.env.TOKEN_SECRET_KEY}`);
// interface dataType {
//   username: string;
//   email: string;
//   first_name: string;
//   last_name: string;
//   exp: number;
// }
export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // // ✅ ตรวจสอบความถูกต้องของ Token
    await jwtVerify(token, JWT_SECRET_KEY);


    return NextResponse.next();
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/", request.url));
  }

}

export const config = {
  matcher: "/home",
};
