import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom"; // ONLY RouterProvider! Delete BrowserRouter
import { router } from "./app/routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./app/theme";
import "./index.css"; // Or whatever your global CSS filename is!

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      <CssBaseline />
      {/* This delivers our centralized router context cleanly with zero loops! */}
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
