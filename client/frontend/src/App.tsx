import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import { CssBaseline, Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "@clerk/clerk-react"; // 🎯 Keeping useAuth for safe loading gate checks
// import { useEffect } from "react";
// import { configureAxiosInterceptors } from "./shared/api/axiosInstance"; // 🛑 Bypassed for now

export default function App() {
  // 🔍 Check Clerk's connection state at the absolute root of the application
  const { isLoaded } = useAuth();

  // 🛑 TEMPORARILY DEACTIVATED THE INTERCEPTOR LOOP TO PREVENT OFFLINE SERVER DEADLOCKS
  /*
  const { session } = useSession();
  useEffect(() => {
    if (session) {
      configureAxiosInterceptors(session);
    }
  }, [session]);
  */

  // 🛡️ THE LOADING GATE:
  // Waits for Clerk to read browser cookies and tokens cleanly.
  if (!isLoaded) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#1e1b4b",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#f59e0b" }} />
        <Typography
          sx={{
            fontWeight: "700",
            color: "#ffffff",
            letterSpacing: 0.5,
            fontSize: "0.9rem",
          }}
        >
          SECURING UTS OPERATOR TERMINAL...
        </Typography>
      </Box>
    );
  }

  // 🚀 Once Clerk is 100% ready, load the application tree safely!
  return (
    <>
      {/* Resets standard browser CSS quirks cleanly across systems */}
      <CssBaseline />
      {/* Feeds our centralized routing map straight to the browser */}
      <RouterProvider router={router} />
    </>
  );
}
