import { NextRequest, NextResponse } from "next/server";
import { ResponseMessages } from "@/utils/globalMessages";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const supabaseUrl = `${process.env.SUPABASE_URL}`;
const supabaseAnonKey = `${process.env.SUPABASE_ANON_KEY}`;

// const client = await pool.connect();
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const cryptoSecretKey = `${process.env.CRYPTO_SECRET_KEY}`;
const JWT_SECRET_KEY = new TextEncoder().encode(`${process.env.TOKEN_SECRET_KEY}`);
interface usersType {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

async function decryptPassword(val: string) {
  try {
    const decodedPassword = decodeURIComponent(val);
    const bytes = CryptoJS.AES.decrypt(decodedPassword, cryptoSecretKey);
    const decrypt = bytes.toString(CryptoJS.enc.Utf8);
    return decrypt;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;
    if (!username || !password) {
      const { response, options } = ResponseMessages.ErrorBadRequest(
        `กรุณากรอก ${!username ? "ชื่อผู้ใช้" : "รหัสผ่าน"}`,
        400
      );
      return NextResponse.json(response, options);
    }

    if (!username || !password) {
      const { response, options } = ResponseMessages.ErrorBadRequest(
        `กรุณากรอก ${!username ? "ชื่อผู้ใช้" : "รหัสผ่าน"}`,
        400
      );
      return NextResponse.json(response, options);
    }

    let col: string = "";
    if (username.includes("@gmail") || username.includes("@hotmail")) {
      col = "email";
    } else {
      col = "username";
    }

    const { data, error } = await supabase
      .from("users")
      .select("username, email, password, first_name, last_name")
      .eq(col, username);

    const users = data as usersType[] | null;
    if (!users?.length) {
      const { response, options } = ResponseMessages.ErrorBadRequest(
        "ชื่อผู้ใช้ไม่ถูกต้อง",
        400
      );
      return NextResponse.json(response, options);
    }

    if (error) {
      const { response, options } = ResponseMessages.ErrorBadRequest(
        error.message,
        400
      );
      return NextResponse.json(response, options);
    }

    const decodedPass = await decryptPassword(password);
    const checkPass = await bcrypt.compare(`${decodedPass}`, users[0].password);
    if (!checkPass) {
      const { response, options } = ResponseMessages.ErrorBadRequest(
        "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        400
      );
      return NextResponse.json(response, options);
    }

    const payload = {
      username: users[0].username,
      email: users[0].email,
      first_name: users[0].first_name,
      last_name: users[0].last_name,
    };

    const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(JWT_SECRET_KEY);
    
    const { response, options } = ResponseMessages.Success(
      "เข้าสู่ระบบสําเร็จ",
      200,
      payload
    );
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth_token",
      value: token,
      httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript
      secure: process.env.NODE_ENV === "production", // ใช้ Secure cookie บน HTTPS
      maxAge: 60 * 60, // หมดอายุใน 1 ชม.
      path: "/", // ใช้ได้กับทุกหน้า
    });
    return NextResponse.json(response, options);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { status_code: 500, status_description: error },
      { status: 500 }
    );
  }
}
