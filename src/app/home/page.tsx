"use client";

import { Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Send";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Home = () => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const router = useRouter();
  const handleLogout = async () => {
    // เรียก API ลบ cookie
    await fetch("/api/v1/logout");

    // ลบ localStorage
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");

    // Redirect ไปหน้า login
    router.push("/");
  };
  useEffect(() => {
    setFirstName(localStorage.getItem("first_name"));
    setLastName(localStorage.getItem("last_name"));
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center flex-col">
        <p>ยินดีตอนรับ</p>
        <h1>
          {firstName} {lastName}
        </h1>
      </div>
      <div className="absolute bottom-0 right-0 mb-2 mr-2">
        <Button
          onClick={handleLogout}
          variant="contained"
          endIcon={<LoginIcon />}
        >
          ออกจากระบบ
        </Button>
      </div>
    </div>
  );
};

export default Home;
