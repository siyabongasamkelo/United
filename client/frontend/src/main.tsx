import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./app/theme";
import "./index.css";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";
import { UserProvider } from "./features/users/context/UserContext";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Clerk Publishable Key in frontend environment configuration file.",
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* ❶ CLERK PROVIDER MUST WRAP EVERYTHING FIRST */}
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ThemeProvider theme={theme}>
        <UserProvider>
          <CssBaseline />

          {/* ❷ TOAST CONTAINER LIVES INSIDE THE THEME AND CLERK CONTEXT */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="colored"
          />

          {/* ❸ APP ROUTER RENDERS SAFELY HERE */}
          <App />
        </UserProvider>
      </ThemeProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
