import { createBrowserRouter, Navigate } from "react-router-dom";
import { RegisterForm, LoginForm } from "../features/auth"; // Imported LoginForm

export const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <Navigate to="/register" replace />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
  {
    path: "/login",
    element: <LoginForm />, // Cleanly mounted!
  },
  {
    path: "/dashboard",
    element: <div>Dashboard Coming Soon!</div>,
  },
]);
