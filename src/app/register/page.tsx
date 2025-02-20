"use client";
import { useEffect, useState } from "react";

// import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import Stack from "@mui/joy/Stack";
import LinearProgress from "@mui/joy/LinearProgress";
// import Typography from '@mui/joy/Typography';
import Link from "next/link";
import Typography from "@mui/joy/Typography";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

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
    email: string;
    first_name: string;
    last_name: string;
  }

  const [formData, setFormData] = useState<loginForm>({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const minLength = 12;
  const handleRegister = () => {};
  return (
    <div className="flex justify-center items-center">
      <div>
        <Card sx={{ minWidth: 475 }}>
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
                id="outlined-textarea"
                label="ชื่อ"
                placeholder="ชื่อ"
                required
                // value={first_name}
                onChange={(first_name) =>
                  setFirst_name(first_name.target.value)
                }
              />
              <TextField
                fullWidth
                id="outlined-textarea"
                label="นามสกุล"
                placeholder="นามสกุล"
                required
                onChange={(last_name) => setLast_name(last_name.target.value)}
              />
            </div>
            <div className="mb-4">
              <TextField
                fullWidth
                id="outlined-textarea"
                label="อีเมล"
                placeholder="อีเมล"
                required
                onChange={(email) => setEmail(email.target.value)}
              />
            </div>
            <div className="mb-4">
              <TextField
                fullWidth
                id="outlined-textarea"
                label="ชื่อผู้ใช้"
                placeholder="ชื่อผุ้ใช้"
                required
                onChange={(username) => setUsername(username.target.value)}
              />
            </div>
            <div>
              <Stack
                spacing={0.5}
                sx={{ "--hue": Math.min(password.length * 10, 120), mb: 2 }}
              >
                <FormControl sx={{ m: 1 }} variant="outlined">
                  <InputLabel htmlFor="adornment-password">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    onChange={(password) => setPassword(password.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
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
                  {password.length < 3 && ""}
                  {password.length >= 3 && password.length < 6 && "Weak"}
                  {password.length >= 6 && password.length < 10 && "Strong"}
                  {password.length >= 10 && "Very strong"}
                </Typography>
              </Stack>
            </div>
            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{ mb: 2 }}
              onClick={handleRegister}
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
          {/* <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions> */}
        </Card>
      </div>
    </div>
  );
}
