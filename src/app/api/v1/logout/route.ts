import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // ลบ cookie โดยตั้งค่าหมดอายุ
  response.cookies.set("auth_token", "", { expires: new Date(0) });

  return response;
}