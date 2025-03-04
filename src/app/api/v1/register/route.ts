import { NextRequest, NextResponse } from "next/server";
import { ResponseMessages } from "@/utils/globalMessages";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

const supabaseUrl = `${process.env.SUPABASE_URL}`;
const supabaseAnonKey = `${process.env.SUPABASE_ANON_KEY}`;
const cryptoSecretKey = `${process.env.CRYPTO_SECRET_KEY}`;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function decryptPassword(password: string) {
  try{
    const decodedPassword = decodeURIComponent(password);
    const decrypt = CryptoJS.AES.decrypt(decodedPassword, cryptoSecretKey).toString(CryptoJS.enc.Utf8);
    return decrypt;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

const hashPassword = async (pw:string) => {
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
        ResponseMessages.ErrorBadRequest(
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
        ResponseMessages.ErrorBadRequest(
          `กรุณากรอก ${!first_name ? "ชื่อ" : "นามสกุล"}`,
          400
        ),
        {
          status: 400,
        }
      );
    }

    if (!email) {
      return NextResponse.json(ResponseMessages.ErrorBadRequest(`กรุณากรอกอีเมล`, 400), {
        status: 400,
      });
    }
    const find_dup_username = await supabase
      .from("users")
      .select("username")
      .eq("username", username);
    
    if (find_dup_username.data?.length !== 0) {
      const { response, options } = ResponseMessages.ErrorBadRequest(
        "มีชื่อผู้ใช้นี้อยู่ในระบบแล้ว"
      );
      return NextResponse.json(response, options);
    }
    const decryptedPassword = await decryptPassword(password);
    if (!decryptedPassword) {
      console.log("Error decrypting password");
    }
    const hashedPassword = await hashPassword(`${decryptedPassword}`); // 🔹 Hash ด้วย bcrypt
    
    if (!hashedPassword) {
      // return res.status(500).json({ message: "Error hashing password" });
      console.log("Error hashing password");
    }
    const { error } = await supabase.from("users").insert([
      {
        username: username,
        password: hashedPassword,
        email: email,
        first_name: first_name,
        last_name: last_name,
      },
    ]);

    if (error) {
      if (error.code === "23505") {
        const {response, options} = ResponseMessages.ErrorBadRequest('มีที่อยู่อีเมลนี้อยู่ในระบบแล้ว')
        return NextResponse.json(response, options);
      }
      return NextResponse.json({error: error.message}, {status: 500});
    }

    const { response, options } = ResponseMessages.Created("สร้างบัญชีสําเร็จ");
    return NextResponse.json(response, options);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.error();
  }
}
