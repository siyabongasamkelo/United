import { createBrowserRouter, Navigate } from "react-router-dom";
import { RegisterForm } from "../features/auth";
import { Box } from "@mui/material";

export const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <Navigate to="/register" replace />,
  },
  {
    path: "/register",
    // We wrap it in a strict full-screen Box right here to force the layout space open!
    element: (
      <Box sx={{ width: "100vw", height: "100vh", display: "block" }}>
        <RegisterForm />
      </Box>
    ),
  },
  {
    path: "/login",
    element: <div>Login Page Coming Soon!</div>,
  },
  {
    path: "/dashboard",
    element: <div>Dashboard Coming Soon!</div>,
  },
]);
