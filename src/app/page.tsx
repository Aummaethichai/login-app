"use client";
import { useEffect } from "react";
export default function Home() {

  useEffect(()=>{
    const checkConnect = async () => {
      try {
        // await fetch("/api/v1/check-connect");
        console.log("Database connection successful");
      } catch (error) {
        console.log("Database connection failed:", error);
      }
    }
    checkConnect();
  }, [])
  return (
    <div className="">

    </div>
  );
}
