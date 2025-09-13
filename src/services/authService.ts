import { AuthUser, AuthResponse, DiscordLoginUrlResponse } from "../types/blog";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

class AuthService {
  private readonly TOKEN_KEY = "devtalles_token";
  private readonly USER_KEY = "devtalles_user";

  // Get Discord login URL from backend
  async getDiscordLoginUrl(): Promise<DiscordLoginUrlResponse> {
    try {
      console.log(
        `Attempting to fetch from: ${BACKEND_URL}/auth/discord/login`
      );

      const response = await fetch(`${BACKEND_URL}/auth/discord/login`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors", // Explicitly set CORS mode
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend error: ${response.status} - ${errorText}`);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Discord login URL received:", data);
      return data;
    } catch (error) {
      console.error("Error getting Discord login URL:", error);

      // Provide more specific error messages
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error("No se pudo conectar con el servidor.");
      }

      throw error;
    }
  }

  // Handle Discord callback with authorization code
  async handleDiscordCallback(code: string): Promise<AuthResponse> {
    try {
      console.log(
        `Attempting to handle Discord callback with code: ${code.substring(
          0,
          10
        )}...`
      );

      const response = await fetch(`${BACKEND_URL}/auth/discord/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
        mode: "cors",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `Backend error: ${response.status} - ${JSON.stringify(errorData)}`
        );
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Discord callback successful:", {
        token: data.token ? "present" : "missing",
        user: data.user?.username,
      });
      return data;
    } catch (error) {
      console.error("Error handling Discord callback:", error);

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          "No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:5000"
        );
      }

      throw error;
    }
  }

  // Store authentication data in localStorage
  storeAuthData(token: string, user: AuthUser): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Get stored token
  getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get stored user
  getStoredUser(): AuthUser | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        return null;
      }
    }
    return null;
  }

  // Clear authentication data
  clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Verify token with backend
  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("Error verifying token:", error);
      return null;
    }
  }

  // Logout (call backend if needed)
  async logout(): Promise<void> {
    const token = this.getStoredToken();

    if (token) {
      try {
        await fetch(`${BACKEND_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error logging out from backend:", error);
      }
    }

    this.clearAuthData();
  }
}

export const authService = new AuthService();
