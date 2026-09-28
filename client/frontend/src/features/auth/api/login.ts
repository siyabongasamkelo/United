export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

/**
 * Sends login credentials to our backend server API endpoint.
 */
export const loginUser = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const API_URL = "http://localhost:5000/api/auth/login"; // Replace with real URL later

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Login failed. Please check your credentials.",
    );
  }

  return response.json();
};
