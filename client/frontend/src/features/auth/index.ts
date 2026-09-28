// Public API exports for the Auth feature
export { RegisterForm } from "./components/RegisterForm";
export { LoginForm } from "./components/LoginForm"; // Added this line
export { registerUser } from "./api/register";
export { loginUser } from "./api/login"; // Added this line
export type { RegisterCredentials, RegisterResponse } from "./api/register";
export type { LoginCredentials, LoginResponse } from "./api/login"; // Added this line
