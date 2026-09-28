export interface ForgotPasswordCredentials {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Sends the reset password link request to our backend server API endpoint.
 */
export const forgotPassword = async (
  credentials: ForgotPasswordCredentials,
): Promise<ForgotPasswordResponse> => {
  const API_URL = "http://localhost:5000/api/auth/forgot-password"; // Replace with real URL later

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
      errorData.message ||
        "Something went wrong. Please check your email and try again.",
    );
  }

  return response.json();
};
