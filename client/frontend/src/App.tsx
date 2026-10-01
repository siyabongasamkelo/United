import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import { CssBaseline } from "@mui/material";

export default function App() {
  return (
    <>
      {/* Resets standard browser CSS quirks cleanly across systems */}
      <CssBaseline />
      {/* Feeds our centralized routing map straight to the browser */}
      <RouterProvider router={router} />
    </>
  );
}
