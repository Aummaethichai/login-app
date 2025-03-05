/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
// import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const cryptoSecretKey = `${process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY}`;

const encryptPassword = async (password: string) => {
  const encrypted = CryptoJS.AES.encrypt(password, cryptoSecretKey).toString();
  const encodedPassword = encodeURIComponent(encrypted);
  return encodedPassword;
};

interface validateLoginForm {
  empty_username: boolean;
  empty_password: boolean;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [validateLoginForm, setValidateLoginForm] = useState<validateLoginForm>(
    {
      empty_username: false,
      empty_password: false,
    }
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isloading, setLoading] = useState(false);
  const [alertError, setAlertError] = useState({ show: false, message: "" });
  const [alertSuccess, setAlertSuccess] = useState({
    show: false,
    message: "",
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const showAlert = (
    type: "success" | "error",
    message: string
  ) => {
    if (type === "error") {
      setAlertError({ show: true, message });
      setTimeout(() => {
        setAlertError({ show: false, message: "" });
      }, 3500);
    } else if (type === "success") {
      setAlertSuccess({ show: true, message });
      setTimeout(() => {
        setAlertSuccess({ show: false, message: "" });
      }, 3500);
    }
  };

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

  const handleSubmit = async () => {
    try {
      const newValidateForm = {
        empty_username: username === "",
        empty_password: password === "",
      };
      setValidateLoginForm(newValidateForm);
      if (validateLoginForm.empty_username) {
        showAlert("error", "กรุณากรอกชื่อผู้ใช้");
        return;
      }
      if (validateLoginForm.empty_password) {
        showAlert("error", "กรุณากรอกรหัสผ่าน");
        return;
      }
      setLoading(true);
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
      if (data.status_code === 200) {
        showAlert("success", data.status_description);
        localStorage.setItem("first_name", data.result.first_name);
        localStorage.setItem("last_name", data.result.last_name);
        window.location.href = "/home";
      } else {
        showAlert('error', data.status_description);
        const newValidateForm = {
          empty_username: true,
          empty_password: true,
        };
        setValidateLoginForm(newValidateForm);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      {isloading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <CircularProgress size="10rem" />
        </div>
      )}
      {alertSuccess.show && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4">
          <Alert variant="filled" severity="success">
            {alertSuccess.message}
          </Alert>
        </div>
      )}
      {alertError.show && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4">
          <Alert variant="filled" severity="error">
            {alertError.message}
          </Alert>
        </div>
      )}
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
                value={username}
                error={validateLoginForm.empty_username}
                id="outlined-textarea"
                label="ชื่อผู้ใช้"
                placeholder="ชื่อผู้ใช้หรืออีเมล"
                onChange={(username) => {
                  setUsername(username.target.value);
                  validateLoginForm.empty_username = false;
                }}
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
                    error={validateLoginForm.empty_password}
                  >
                    รหัสผ่าน
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    autoComplete="off"
                    error={validateLoginForm.empty_password}
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
