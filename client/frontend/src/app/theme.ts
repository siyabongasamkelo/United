import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#4F46E5", // Our signature Electric Indigo code
      light: "#6366F1",
      dark: "#3730A3",
    },
    background: {
      default: "#F9FAFB", // Off-white clean layout background for speed
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","), // Using our native lightweight system font stack rule!
  },
});
