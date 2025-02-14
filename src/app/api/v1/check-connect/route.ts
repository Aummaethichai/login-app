import { NextResponse } from "next/server";
import { Pool } from "pg";
import { ResponseMessages } from "@/utils/globalMessages";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const client = await pool.connect();
  try {
    // ตรวจสอบการเชื่อมต่อ
    await client.query("SELECT NOW()");
    console.log("Database connection successful");
    return NextResponse.json(
      ResponseMessages.success("Connection successful")
    );
  } catch (error) {
    console.error("Database connection failed:", error);
    return NextResponse.json(
      ResponseMessages.error(`Connection failed ${error}`),
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
