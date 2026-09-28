// 1. Define the exact shape of data our Register API expects to receive
export interface RegisterCredentials {
  username: string;
  email: string;
  password?: string; // Optional if your backend hashes or handles it uniquely
}

// 2. Define what the backend returns on a successful creation
export interface RegisterResponse {
  success: boolean;
  message: string;
  token?: string; // JWT token to log them in instantly
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

/**
 * Sends registration credentials to our fast backend server API endpoint.
 */
export const registerUser = async (
  credentials: RegisterCredentials,
): Promise<RegisterResponse> => {
  // Replace this placeholder string with your real local or deployed backend URL later!
  const API_URL = "http://localhost:5000/api/auth/register";

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  // If the server returns a bad status code (400, 500, etc.), throw an error
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Registration failed. Please try again.",
    );
  }

  return response.json();
};
