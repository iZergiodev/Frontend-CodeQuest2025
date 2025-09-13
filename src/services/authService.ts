import { AuthUser, AuthResponse, DiscordLoginUrlResponse } from "../types/blog";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

class AuthService {
  private readonly TOKEN_KEY = "devtalles_token";
  private readonly USER_KEY = "devtalles_user";

  async getDiscordLoginUrl(): Promise<DiscordLoginUrlResponse> {
    try {
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
      return data;
    } catch (error) {
      console.error("Error getting Discord login URL:", error);

      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error("No se pudo conectar con el servidor.");
      }

      throw error;
    }
  }

  async handleDiscordCallback(code: string): Promise<AuthResponse> {
    try {
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

  storeAuthData(token: string, user: AuthUser): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

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

  clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

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

  async refreshJwtToken(token: string): Promise<AuthResponse | null> {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/discord/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
        mode: "cors",
      });

      if (!response.ok) {
        console.error(`JWT token refresh failed: ${response.status}`);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error refreshing JWT token:", error);
      return null;
    }
  }

  isJwtTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;
      const now = Date.now();
      return exp < now;
    } catch (error) {
      console.error("Error checking JWT token expiration:", error);
      return true;
    }
  }

  shouldRefreshJwtToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const sixDays = 6 * 24 * 60 * 60 * 1000; // 6 days

      // Refresh if token expires in less than 6 days
      return exp < now + sixDays;
    } catch (error) {
      console.error("Error checking if JWT token should be refreshed:", error);
      return true;
    }
  }

  async autoRefreshJwtToken(): Promise<AuthResponse | null> {
    const token = this.getStoredToken();
    if (!token) {
      return null;
    }

    if (this.shouldRefreshJwtToken(token)) {
      return await this.refreshJwtToken(token);
    }

    return null;
  }

  async handleUnauthorizedResponse(): Promise<boolean> {
    const token = this.getStoredToken();
    if (!token) {
      return false;
    }

    try {
      const refreshData = await this.refreshJwtToken(token);

      if (refreshData) {
        this.storeAuthData(refreshData.token, refreshData.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error refreshing JWT token after 401:", error);
      return false;
    }
  }

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

  async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        mode: "cors",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      return {
        token: data.token || "",
        user: this.transformUserToAuthUser(data.user || data),
      };
    } catch (error) {
      console.error("Error with email login:", error);
      throw error;
    }
  }

  async registerWithEmail(
    email: string,
    password: string,
    username: string,
    role: string = "User"
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          username,
          role,
        }),
        mode: "cors",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      return {
        token: data.token || "",
        user: this.transformUserToAuthUser(data.user || data),
      };
    } catch (error) {
      console.error("Error with email registration:", error);
      throw error;
    }
  }

  private transformUserToAuthUser(user: any): AuthUser {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      biography: user.biography,
      role: user.role,
      discordId: user.discordId,
      discordUsername: user.discordUsername,
      discordDiscriminator: user.discordDiscriminator,
      discordAvatar: user.discordAvatar,
      birthDate: user.birthDate,
      createdAt: user.createdAt,
      starDustPoints: user.starDustPoints || 0,
      // Computed properties
      displayName: user.name || user.username || user.email,
      bio: user.biography,
    };
  }

  async makeAuthenticatedRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = this.getStoredToken();

    if (!token) {
      throw new Error("No authentication token available");
    }

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    let response = await fetch(url, requestOptions);

    if (response.status === 401) {
      const refreshSuccess = await this.handleUnauthorizedResponse();

      if (refreshSuccess) {
        const newToken = this.getStoredToken();
        if (newToken) {
          requestOptions.headers = {
            ...requestOptions.headers,
            Authorization: `Bearer ${newToken}`,
          };
          response = await fetch(url, requestOptions);
        }
      } else {
        this.clearAuthData();
        throw new Error("Authentication failed - please log in again");
      }
    }

    return response;
  }
}

export const authService = new AuthService();
