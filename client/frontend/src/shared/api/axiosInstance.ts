import axios from "axios";

// ❶ Create the global Axios client pointing straight to our versioned API entry gateway
export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1", // ⚡ Appended /v1 to match backend route namespaces perfectly
});

/**
 * 🚀 THE TELEMETRY NETWORK INTERCEPTOR
 * This runs automatically before every network hit to inject secure authentication tokens
 */
export const configureAxiosInterceptors = (clerkSession: any) => {
  // REQUEST INTERCEPTOR: Automatically hydrates headers with fresh short-lived tokens
  api.interceptors.request.use(
    async (config) => {
      try {
        // 1. Instantly pull a cryptographically signed JWT token string from Clerk
        const token = await clerkSession.getToken();

        // 2. Append it straight into the Authorization header block
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error(
          "🚫 Network Interceptor: Failed to resolve secure session token.",
          error,
        );
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // ❷ RESPONSE INTERCEPTOR: Automatically parses server error payloads smoothly for our contexts
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Extract our clean functional factory error message returned by our backend errorMiddleware
      const serverErrorMessage =
        error.response?.data?.message ||
        "An unexpected network operational failure occurred.";

      // Overwrite the generic Axios error message with our specific server response details
      const customError = new Error(serverErrorMessage);
      (customError as any).status = error.response?.status;
      (customError as any).data = error.response?.data;

      return Promise.reject(customError);
    },
  );
};
