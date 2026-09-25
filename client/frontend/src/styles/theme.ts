import { type DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  colors: {
    primary: "#9929EA", // Indigo 600
    primaryHover: "#4338CA", // Indigo 700
    background: "#FFFFFF", // Light gray bg
    surface: "#FFFFFF", // Card white
    text: "#111827", // Near black
    textMuted: "#6B7280", // Muted gray
    border: "#E5E7EB", // Light border
    error: "#EF4444", // Red soft alert
    success: "#10B981", // Green
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "16px",
    round: "9999px",
  },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: {
      sm: "12px",
      base: "14px",
      lg: "16px",
      xl: "20px",
      h1: "32px",
    },
  },
};
