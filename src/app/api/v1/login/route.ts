import { NextRequest, NextResponse } from "next/server";
// import { Pool } from "pg";
import { ResponseMessages } from "@/utils/globalMessages";
import { createClient } from "@supabase/supabase-js";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

const supabaseUrl = `${process.env.SUPABASE_URL}`;
const supabaseAnonKey = `${process.env.SUPABASE_ANON_KEY}`;

// const client = await pool.connect();
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const reqTest = searchParams.get("test");
//     const QueryOne = await client.query(`
//         SELECT id FROM users`);

//     console.log("eiei", QueryOne);
//     console.log(reqTest);
//     console.log("Request received:", req);
//     return NextResponse.json(ResponseMessages.success("API is working!"));
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(ResponseMessages.error("Error"));
//   }
// }

// export async function POST(req: NextRequest) {
//     try {
//       const body = await req.json();
//       const { username, password, email, firstname, lastname } = body;
//       if(!username || !password) {
//         return NextResponse.json(ResponseMessages.error(`Required ${!username ? "username" : "password"}`, 400));
//       }

//       if(!firstname || !lastname) {
//         return NextResponse.json(ResponseMessages.error(`Required ${!firstname ? "firstname" : "lastname"}`, 400));
//       }

//       if(!email) {
//         return NextResponse.json(ResponseMessages.error(`Require Email`, 400));
//       }

//       await client.query(
//         `INSERT INTO users
//           (username, password, email, first_name, last_name)
//         VALUES ($1, $2, $3, $4, $5)`,
//         [username, password, email, firstname, lastname]
//       );

//       return NextResponse.json(ResponseMessages.success("Create User Successful", 201),{ status: 201 });
//     } catch (error) {
//       console.error("Error:", error);
//       return NextResponse.json(ResponseMessages.error(`Error ${error}`), { status: 500 });
//     }
//   }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, email, firstname, lastname } = body;
    if (!username || !password) {
      return NextResponse.json(
        ResponseMessages.error(
          `Required ${!username ? "username" : "password"}`,
          400
        )
      );
    }

    if (!firstname || !lastname) {
      return NextResponse.json(
        ResponseMessages.error(
          `Required ${!firstname ? "firstname" : "lastname"}`,
          400
        )
      );
    }

    if (!email) {
      return NextResponse.json(ResponseMessages.error(`Require Email`, 400));
    }

    const { error } = await supabase.from("users").insert([
      {
        username: username,
        password: password,
        email: email,
        first_name: firstname,
        last_name: lastname
      },
    ]);

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json(ResponseMessages.error(`${error.message}`, 500), { status: 500 });
    }

    return NextResponse.json(ResponseMessages.success("Create User Successful", 201), { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(ResponseMessages.error("Error"));
  }
}
