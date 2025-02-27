import { NextRequest, NextResponse } from "next/server";
// import { Pool } from "pg";
import { ResponseMessages } from "@/utils/globalMessages";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
// import crypto from "crypto";
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

const supabaseUrl = `${process.env.SUPABASE_URL}`;
const supabaseAnonKey = `${process.env.SUPABASE_ANON_KEY}`;
// const cryptoSecretKey = `${process.env.CRYPTO_SECRET_KEY}`;

// const client = await pool.connect();
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// const encodeHash = (val: string) => {
//   const bytes = CryptoJS.AES.encrypt(val, cryptoSecretKey).toString();

//   const encrypt = bytes.toString(CryptoJS.enc.Utf8);
//   return encrypt;
// };

const hasPwHelper = async (pw:string) => {
  try {
    const myPlaintextPassword = pw;

    return await bcrypt.hash(myPlaintextPassword, 10);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, email, first_name, last_name } = body;
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

    if (!first_name || !last_name) {
      return NextResponse.json(
        ResponseMessages.error(
          `กรุณากรอก ${!first_name ? "ชื่อ" : "นามสกุล"}`,
          400
        ),
        {
          status: 400,
        }
      );
    }

    if (!email) {
      return NextResponse.json(ResponseMessages.error(`กรุณากรอกอีเมล`, 400), {
        status: 400,
      });
    }
    const find_dup_username = await supabase
      .from("users")
      .select("username")
      .eq("username", username);
    if (find_dup_username.data?.length !== 0) {
      return NextResponse.json(
        ResponseMessages.error("มีชื่อผู้ใช้นี้อยู่ในระบบแล้ว", 400),
        { status: 400 }
      );
    }
    const hashPassword = await hasPwHelper(password);
    const { error } = await supabase.from("users").insert([
      {
        username: username,
        password: hashPassword,
        email: email,
        first_name: first_name,
        last_name: last_name,
      },
    ]);

    if (error) {
      console.error(error);
      if (error.code === "23505") {
        return NextResponse.json(
          ResponseMessages.error("มีที่อยู่อีเมลนี้อยู่ในระบบแล้ว", 400),
          { status: 400 }
        );
      }
      return NextResponse.json(ResponseMessages.error(error.message, 500), {
        status: 500,
      });
    }

    return NextResponse.json(
      ResponseMessages.success("สร้างบัญชีสําเร็จ", 201),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(ResponseMessages.error("Error"));
  }
}
