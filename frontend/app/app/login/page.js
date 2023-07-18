"use client";

import { useState, useEffect, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { signIn, useSession } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Maragusan A&E Credit Corporation
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const { data: session, status } = useSession();
  const [loginTextError, setLoginTextError] = useState("");
  const [loginError, setLoginError] = useState(false);
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") redirect("/");
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await signIn("credentials", {
      username: data.get("username"),
      password: data.get("password"),
      redirect: false,
    })
      .then((response) => {
        console.log(response);
        if (response.error == null) router.push("/dashboard/home");
        else {
          setLoginError(true);
          if (response.error == "CredentialsSignin")
            setLoginTextError("Sign in credential error!");
          else if (response.error == "fetch failed") {
            console.log(response);
            setLoginTextError("Server error!");
          } else {
            setLoginTextError("Error: " + response.error);
          }
        }
      })
      .catch((response) => {
        console.log(response);
        setLoginError(true);
        setLoginTextError("Sign in error! Check console");
      });
  };

  if (status === "loading")
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Slide in={true} direction="up">
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            ref={containerRef}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              MARAGUSAN A&E CREDIT CORP
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {loginError ? (
                <Alert severity="error">{loginTextError}</Alert>
              ) : (
                <></>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Slide>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
