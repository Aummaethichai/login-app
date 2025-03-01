/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
// import { Pool } from "pg";
import { ResponseMessages } from "@/utils/globalMessages";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

const supabaseUrl = `${process.env.SUPABASE_URL}`;
const supabaseAnonKey = `${process.env.SUPABASE_ANON_KEY}`;

// const client = await pool.connect();
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const cryptoSecretKey = `${process.env.CRYPTO_SECRET_KEY}`;

interface usersType {
  username: string;
  email: string;
  password: string;
}

async function decryptPassword(val: string) {
  try{
  const decodedPassword = decodeURIComponent(val);
    const bytes = CryptoJS.AES.decrypt(decodedPassword, cryptoSecretKey);
    const decrypt = bytes.toString(CryptoJS.enc.Utf8);
    return decrypt;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json(
        ResponseMessages.error(
          `กรุณากรอก ${!username ? "ชื่อผู้ใช้" : "รหัสผ่าน"}`,
          400
        ),
        {
          status: 400,
        }
      );
    }

    if (!username || !password) {
      return NextResponse.json(
        ResponseMessages.error(
          `กรุณากรอก ${!username ? "ชื่อผู้ใช้" : "รหัสผ่าน"}`,
          400
        ),
        {
          status: 400,
        }
      );
    }

    let col: string = "";
    if (username.includes("@gmail") || username.includes("@hotmail")) {
      col = "email";
    } else {
      col = "username";
    }

    const { data, error } = await supabase
      .from("users")
      .select("username, email, password")
      .eq(col, username);

    const users = data as usersType[] | null;
    if (!users?.length) {
      return NextResponse.json(
        // ResponseMessages.error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", 400),
        ResponseMessages.error("ชื่อผู้ใช้ไม่ถูกต้อง", 400),
        { status: 400 }
      );
    }

    if (error) {
      console.log(error);
      return NextResponse.json(ResponseMessages.error(error.message, 400), {
        status: 400,
      });
    }

    const decodedPass = await decryptPassword(password);
    const checkPass = await bcrypt.compare(`${decodedPass}`, users[0].password);
    if (!checkPass) {
      return NextResponse.json(
        ResponseMessages.error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", 400),
        { status: 400 }
      );
    }

    return NextResponse.json(
      ResponseMessages.success("เข้าสู่ระบบสำเร็จ", 200),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(ResponseMessages.error("Error"), { status: 500 });
  }
}
