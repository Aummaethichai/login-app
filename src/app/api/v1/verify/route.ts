import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = `${process.env.TOKEN_SECRET_KEY}`;

export async function GET() {
    const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return NextResponse.json({ success: true, user: decoded });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}