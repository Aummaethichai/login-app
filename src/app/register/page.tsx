"use client";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import Stack from "@mui/joy/Stack";
import LinearProgress from "@mui/joy/LinearProgress";
// import Typography from '@mui/joy/Typography';
import Link from "next/link";
import Typography from "@mui/joy/Typography";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

const cryptoSecretKey = `${process.env.CRYPTO_SECRET_KEY}`;

const validateEmail = (email: string)=> {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email);
}

const encryptPassword = (password: string) => {
  const encrypted = CryptoJS.AES.encrypt(password, cryptoSecretKey).toString();
  return encodeURIComponent(encrypted);
};

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
  interface validateForm {
    empty_username: boolean;
    empty_password: boolean;
    empty_email: boolean;
    empty_first_name: boolean;
    empty_last_name: boolean;
    empty_confirm_password: boolean;
  }

  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertMatchPassword, setAlertMatchPassword] = useState(false);
  const [validateForm, setValidateForm] = useState<validateForm>({
    empty_username: false,
    empty_password: false,
    empty_email: false,
    empty_first_name: false,
    empty_last_name: false,
    empty_confirm_password: false,
  });

  const [alertSuccess, setAlertSuccess] = useState({
    show: false,
    message: "",
  });
  const [alertError, setAlertError] = useState({ show: false, message: "" });
  const [alertWarning, setAlertWarning] = useState({
    show: false,
    message: "",
  });
  const [isloading, setIsLoading] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  // const handleMouseDownPassword = (
  //   event: React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   event.preventDefault();
  // };

  // const handleMouseUpPassword = (
  //   event: React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   event.preventDefault();
  // };

  const showAlert = (
    type: "success" | "error" | "warning",
    message: string
  ) => {
    if (type === "error") {
      setAlertError({ show: true, message });
      setTimeout(() => {
        setAlertError({ show: false, message: "" });
      }, 5000);
    } else if (type === "success") {
      setAlertSuccess({ show: true, message });
      setTimeout(() => {
        setAlertSuccess({ show: false, message: "" });
      }, 5000);
    } else {
      setAlertWarning({ show: true, message });
      setTimeout(() => {
        setAlertWarning({ show: false, message: "" });
      }, 5000);
    }
  };

  const submitRegister = async () => {
    try {
      const newValidateForm = {
        empty_first_name: first_name === "",
        empty_last_name: last_name === "",
        empty_email: email === "" || !validateEmail(email),
        empty_username: username === "",
        empty_password: password === "",
        empty_confirm_password: confirmPassword === "",
      };
      setValidateForm(newValidateForm);

      if (!first_name) {
        showAlert("error", "กรุณากรอกชื่อ");
        return;
      }
      if (last_name === "") {
        showAlert("error", "กรุณากรอกนามสกุล");
        return;
      }
      if (email === "") {
        showAlert("error", "กรุณากรอกอีเมล");
        validateForm.empty_email = true;
        return;
      } else if (!validateEmail(email)) {
        validateForm.empty_email = true;
        showAlert("warning", "อีเมลไม่ถูกต้อง");
        return;
      }
      if (username === "") {
        showAlert("error", "กรุณากรอกชื่อผู้ใช้");
        return;
      }
      if (password === "") {
        showAlert("error", "กรุณากรอกรหัสผ่าน");
        return;
      }
      if (confirmPassword === "") {
        showAlert("error", "กรุณายืนยันรหัสผ่าน");
        return;
      }

      // เช็คว่า password และ confirmPassword ตรงกันหรือไม่
      setAlertMatchPassword(
        password !== confirmPassword && confirmPassword !== ""
      );
      const check_password =
        password === confirmPassword && confirmPassword !== "";
      if (!check_password) {
        showAlert("error", "Password ไม่ตรงกัน");
        setAlertMatchPassword(true);
        return;
      } else {
        setAlertMatchPassword(false);
      }
      setIsLoading(true);
      const encryptedPassword = encryptPassword(password);
      const response = await fetch("/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password: encryptedPassword,
          email,
          first_name,
          last_name,
        }),
      });
      const data = await response.json();
      if (data.status === "success" && data.status_code === 201) {
        setFirst_name("");
        setLast_name("");
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        showAlert("success", data.message);
      } else {
        showAlert("error", data.message);
        if (
          data.status === "error" &&
          data.status_code === 400 &&
          data.message === "มีที่อยู่อีเมลนี้อยู่ในระบบแล้ว"
        ) {
          validateForm.empty_email = true;
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const minLength = 12;
  return (
    <div className="">
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
      {alertWarning.show && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4">
          <Alert variant="filled" severity="warning">
            {alertWarning.message}
          </Alert>
        </div>
      )}
      <div>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography
              gutterBottom
              sx={{ color: "text.secondary", fontSize: 18 }}
            >
              สร้างบัญชีใหม่
            </Typography>
            <div className="flex mb-4 mt-3 justify-center gap-4">
              <TextField
                fullWidth
                autoComplete="off"
                error={validateForm.empty_first_name}
                id="firstname"
                label="ชื่อ"
                placeholder="ชื่อ"
                required
                value={first_name}
                onChange={(first_name) => {
                  setFirst_name(first_name.target.value);
                  if (first_name.target.value === "") {
                    validateForm.empty_first_name = true;
                  } else {
                    validateForm.empty_first_name = false;
                  }
                }}
              />
              <TextField
                fullWidth
                autoComplete="off"
                error={validateForm.empty_last_name}
                id="lastname"
                label="นามสกุล"
                placeholder="นามสกุล"
                required
                value={last_name}
                onChange={(last_name) => {
                  setLast_name(last_name.target.value);
                  if (last_name.target.value === "") {
                    validateForm.empty_last_name = true;
                  } else {
                    validateForm.empty_last_name = false;
                  }
                }}
              />
            </div>
            <div className="mb-4">
              <TextField
                fullWidth
                autoComplete="off"
                error={validateForm.empty_email}
                id="outlined-email"
                label="อีเมล"
                placeholder="อีเมล"
                required
                value={email}
                onChange={(email) => {
                  setEmail(email.target.value);
                  if (email.target.value === "") {
                    showAlert("error", "กรุณากรอกอีเมล");
                  } else if (!validateEmail(email.target.value)) {
                    validateForm.empty_email = true;
                  } else {
                    validateForm.empty_email = false;
                  }
                }}
              />
            </div>
            <div className="mb-4">
              <TextField
                fullWidth
                autoComplete="off"
                error={validateForm.empty_username}
                id="outlined-username"
                label="ชื่อผู้ใช้"
                placeholder="ชื่อผุ้ใช้"
                required
                value={username}
                onChange={(username) => {
                  setUsername(username.target.value);
                  if (username.target.value === "") {
                    validateForm.empty_username = true;
                  } else {
                    validateForm.empty_username = false;
                  }
                }}
              />
            </div>
            <div>
              <Stack
                spacing={0.5}
                sx={{ "--hue": Math.min(password.length * 10, 120), mb: 2 }}
              >
                <FormControl sx={{ m: 1 }} variant="outlined">
                  <InputLabel
                    required
                    htmlFor="adornment-password"
                    error={validateForm.empty_password}
                  >
                    รหัสผ่าน
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    autoComplete="off"
                    error={validateForm.empty_password}
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(password) => {
                      setPassword(password.target.value);
                      if (password.target.value === "") {
                        validateForm.empty_password = true;
                      } else {
                        validateForm.empty_password = false;
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
                <LinearProgress
                  determinate
                  size="sm"
                  value={Math.min((password.length * 100) / minLength, 100)}
                  sx={{
                    bgcolor: "background.level3",
                    color: "hsl(var(--hue) 80% 40%)",
                  }}
                />
                <Typography
                  level="body-xs"
                  sx={{
                    alignSelf: "flex-end",
                    color: "hsl(var(--hue) 80% 30%)",
                  }}
                >
                  {/* {password.length < 3 && ""}
                  {password.length >= 3 && password.length < 6 && "Weak"}
                  {password.length >= 6 && password.length < 10 && "Strong"}
                  {password.length >= 10 && "Very strong"} */}
                </Typography>
                <FormControl sx={{ m: 1 }} variant="outlined">
                  <InputLabel
                    error={
                      alertMatchPassword || validateForm.empty_confirm_password
                    }
                    required
                    htmlFor="adornment-password"
                  >
                    ยืนยันรหัสผ่าน
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    autoComplete="off"
                    error={
                      alertMatchPassword || validateForm.empty_confirm_password
                    }
                    id="outlined-adornment-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(confirm_password) => {
                      setConfirmPassword(confirm_password.target.value);
                      if (confirm_password.target.value === "") {
                        validateForm.empty_confirm_password = true;
                      } else {
                        validateForm.empty_confirm_password = false;
                      }
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showConfirmPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="ยืนยันรหัสผ่าน"
                  />
                  {validateForm.empty_confirm_password && (
                    <FormHelperText>
                      <a className="text-red-600">กรุณายืนยันรหัสผ่าน</a>
                    </FormHelperText>
                  )}
                  {alertMatchPassword &&
                    validateForm.empty_confirm_password === false && (
                      <FormHelperText>
                        <a className="text-red-600">รหัสผ่านไม่ตรงกัน</a>
                      </FormHelperText>
                    )}
                </FormControl>
              </Stack>
            </div>
            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{ mb: 2 }}
              onClick={submitRegister}
            >
              สมัคร
            </Button>
            <Link href={"/"}>
              <div className="flex justify-center">
                <Button size="large" variant="contained" color="success">
                  มีบัญชีแล้วใช่ไหม
                </Button>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
