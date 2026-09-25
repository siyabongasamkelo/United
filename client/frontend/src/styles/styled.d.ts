import "styled-components";
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryHover: string;
      background: string;
      surface: string;
      text: string;
      textMuted: string;
      border: string;
      error: string;
      success: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      round: string;
    };
    typography: {
      fontFamily: string;
      fontSize: {
        sm: string;
        base: string;
        lg: string;
        xl: string;
        h1: string;
      };
    };
  }
}
