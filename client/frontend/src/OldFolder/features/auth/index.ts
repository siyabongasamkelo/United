// Public API exports for the Auth feature
export { RegisterForm } from "./components/RegisterForm";
export { LoginForm } from "./components/LoginForm";
export { ForgotPasswordForm } from "./components/ForgotPasswordForm";
export { ResetPasswordForm } from "./components/ResetPasswordForm"; // Added this line
export { registerUser } from "./api/register";
export { loginUser } from "./api/login";
export { forgotPassword } from "./api/forgotPassword";
export { resetPasswordUser } from "./api/resetPassword"; // Added this line
export type { RegisterCredentials, RegisterResponse } from "./api/register";
export type { LoginCredentials, LoginResponse } from "./api/login";
export type {
  ForgotPasswordCredentials,
  ForgotPasswordResponse,
} from "./api/forgotPassword";
export type {
  ResetPasswordCredentials,
  ResetPasswordResponse,
} from "./api/resetPassword"; // Added this line
