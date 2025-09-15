import axios, { AxiosInstance, AxiosResponse } from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("devtalles_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = localStorage.getItem("devtalles_token");
        if (token) {
          // Try to refresh the token
          const refreshResponse = await axios.post(
            `${BACKEND_URL}/auth/discord/refresh`,
            { token },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (refreshResponse.data.token) {
            localStorage.setItem("devtalles_token", refreshResponse.data.token);
            localStorage.setItem(
              "devtalles_user",
              JSON.stringify(refreshResponse.data.user)
            );

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear auth data and redirect to login
        localStorage.removeItem("devtalles_token");
        localStorage.removeItem("devtalles_user");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
