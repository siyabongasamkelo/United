export interface ResetPasswordCredentials {
  token: string;
  password?: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Sends the new password along with the verification token to the backend server.
 */
export const resetPasswordUser = async (
  credentials: ResetPasswordCredentials,
): Promise<ResetPasswordResponse> => {
  const API_URL = "http://localhost:5000/api/auth/reset-password"; // Replace with real URL later

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
      errorData.message || "Link expired or invalid. Please request a new one.",
    );
  }

  return response.json();
};
