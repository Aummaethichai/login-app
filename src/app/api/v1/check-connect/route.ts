'use server'
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// สร้าง Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    // ลองดึงข้อมูลจาก Supabase เพื่อตรวจสอบการเชื่อมต่อ
    const { data, error } = await supabase.from("users").select("id").limit(1);

    if (error) {
      console.error("Supabase connection error:", error.message);
      return NextResponse.json({ error: "Failed to connect to Supabase" }, { status: 500 });
    }
    console.log("Connected to Supabase successfully");
    return NextResponse.json({ message: "Connected to Supabase successfully", data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}