"use client";
import { useEffect, useState } from "react";

// import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Divider, TextField } from "@mui/material";
import Link from "next/link";

export default function Home() {
  useEffect(() => {
    const checkConnect = async () => {
      try {
        // await fetch("/api/v1/check-connect");
        console.log("Database connection successful");
      } catch (error) {
        console.log("Database connection failed:", error);
      }
    };
    checkConnect();
  }, []);
  interface loginForm {
    username: string;
    password: string;
    // email: string;
    // firstname: string;
    // lastname: string;
  }

  const [formData, setFormData] = useState<loginForm>({
    username: "",
    password: "",
    // email: "",
    // firstname: "",
    // lastname: "",
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    setFormData({
      username: username,
      password: password,
    })

    // รอสร้าง user
    const response = await fetch("/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log(data);
  };

  console.log(formData)
  return (
    <div className="flex justify-center items-center">
      <div className="">
        <Card sx={{ minWidth: 345 }}>
          <CardContent>
            <Typography
              gutterBottom
              sx={{ color: "text.secondary", fontSize: 18 }}
            >
              เข้าสู่ระบบ
            </Typography>
            <div className="mb-4 mt-3">
              <TextField
                fullWidth
                id="outlined-textarea"
                label="ชื่อผู้ใช้"
                placeholder="ชื่อผู้ใช้หรืออีเมล"
                onChange={(username) => setUsername(username.target.value)}
              />
            </div>
            <div className="mb-4">
              <TextField
                fullWidth
                id="outlined-textarea"
                label="รหัสผ่าน"
                placeholder="รหัสผ่าน"
                onChange={(password) => setPassword(password.target.value)}
              />
            </div>
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={handleSubmit}
            >
              เข้าสู่ระบบ
            </Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                my: 2,
              }}
            >
              <Divider sx={{ flexGrow: 1 }} />
              <Typography sx={{ mx: 2, color: "gray" }}>หรือ</Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>
            <Link href={"/register"}>
            <div className="flex justify-center">
              <Button
                size="large"
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                สร้างบัญชีใหม่
              </Button>
            </div>
            </Link>
          </CardContent>
          {/* <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions> */}
        </Card>
      </div>
    </div>
  );
}
