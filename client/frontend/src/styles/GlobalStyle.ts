import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
*, *::before, *::after {
box-sizing: border-box;
margin: 0;
padding: 0;
}

body {
  font-family: ${(props) => props.theme.typography.fontFamily};
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

input, button {
font-family: inherit;
font-size: inherit;
border: none;
outline: none;
}

button {
cursor: pointer;
}
` as unknown as React.ComponentType;
