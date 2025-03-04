/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
// import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Divider, FormControl, IconButton, InputAdornment, InputLabel, LinearProgress, OutlinedInput, Stack, TextField } from "@mui/material";
import Link from "next/link";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const cryptoSecretKey = `${process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY}`;

const encryptPassword = async (password: string) => {
  const encrypted = CryptoJS.AES.encrypt(password, cryptoSecretKey).toString();
  const encodedPassword = encodeURIComponent(encrypted);
  return encodedPassword
};

interface validateLoginForm {
  empty_username: boolean;
  empty_password: boolean;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [validateLoginForm, setValidateLoginForm] = useState<validateLoginForm>({
    empty_username: false,
    empty_password: false,
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

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

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const encryptedPassword = await encryptPassword(password);

    const response = await fetch("/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password: encryptedPassword,
      }),
    });
    
    const data = await response.json();
    if(data.status_code === 200){
      localStorage.setItem('first_name',data.result.first_name)
      localStorage.setItem('last_name',data.result.last_name)
      window.location.href = "/home";
    }
  };

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
            <Stack
                spacing={0.5}
                sx={{ "--hue": Math.min(password.length * 10, 120), mb: 2 }}
              >
                <FormControl sx={{ m: 1 }} variant="outlined">
                  <InputLabel
                    required
                    htmlFor="adornment-password"
                    // error={validateForm.empty_password}
                  >
                    รหัสผ่าน
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    autoComplete="off"
                    // error={validateForm.empty_password}
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(password) => {
                      setPassword(password.target.value);
                      if (password.target.value === "") {
                        validateLoginForm.empty_password = true;
                      } else {
                        validateLoginForm.empty_password = false;
                      }
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowPassword}
                          // onMouseDown={handleMouseDownPassword}
                          // onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="รหัสผ่าน"
                  />
                </FormControl>
              </Stack>
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
                <Button size="large" variant="contained" color="success">
                  สร้างบัญชีใหม่
                </Button>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
