import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthResponse, User, DiscordLoginUrlResponse } from "../types/blog";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5110";

class AuthService {
  private readonly TOKEN_KEY = "devtalles_token";
  private readonly USER_KEY = "devtalles_user";

  async getDiscordLoginUrl(): Promise<DiscordLoginUrlResponse> {
    try {
      const response = await axios.get<DiscordLoginUrlResponse>(
        `${BACKEND_URL}/api/auth/discord/login`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting Discord login URL:", error);

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
          throw new Error("No se pudo conectar con el servidor.");
        }
        throw new Error(error.response?.data?.message || error.message);
      }

      throw error;
    }
  }

  async handleDiscordCallback(code: string): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${BACKEND_URL}/api/auth/discord/callback`,
        { code },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error handling Discord callback:", error);

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
          throw new Error(
            "No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:5000"
          );
        }
        throw new Error(error.response?.data?.message || error.message);
      }

      throw error;
    }
  }

  storeAuthData(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getStoredUser(): User | null {
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

    sessionStorage.clear();

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.includes("auth") ||
          key.includes("token") ||
          key.includes("user") ||
          key.includes("devtalles"))
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.user;
    } catch (error) {
      console.error("Error verifying token:", error);
      return null;
    }
  }

  async refreshJwtToken(token: string): Promise<AuthResponse | null> {
    try {
      const response = await axios.post<AuthResponse>(
        `${BACKEND_URL}/api/auth/discord/refresh`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error refreshing JWT token:", error);
      return null;
    }
  }

  public isJwtTokenExpired(token: string): boolean {
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
    this.clearAuthData();
    this.clearUrlParameters();
  }

  private clearUrlParameters(): void {
    try {
      const url = new URL(window.location.href);
      const authParams = ["code", "state", "error", "error_description"];

      let hasChanges = false;
      authParams.forEach((param) => {
        if (url.searchParams.has(param)) {
          url.searchParams.delete(param);
          hasChanges = true;
        }
      });

      if (hasChanges) {
        window.history.replaceState(
          {},
          document.title,
          url.pathname + url.search
        );
      }
    } catch (error) {
      console.error("Error clearing URL parameters:", error);
    }
  }

  async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/users/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return {
        token: response.data.Token || response.data.token || "",
        user: this.transformUserToAuthUser(
          response.data.User || response.data.user || response.data
        ),
      };
    } catch (error) {
      console.error("Error with email login:", error);

      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }

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
      // First, register the user
      const registerResponse = await axios.post(
        `${BACKEND_URL}/api/users/register`,
        {
          email,
          password,
          username,
          role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration response:", registerResponse.data);

      // After successful registration, automatically log the user in
      const loginResponse = await this.loginWithEmail(email, password);

      return loginResponse;
    } catch (error) {
      console.error("Error with email registration:", error);

      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }

      throw error;
    }
  }

  private transformUserToAuthUser(user: any): User {
    console.log("authService: Transforming user:", user);
    console.log("authService: user.id:", user.id);
    console.log("authService: user.ID:", user.ID);
    console.log("authService: user.Id:", user.Id);
    console.log("authService: All user keys:", Object.keys(user));
    console.log("authService: All user values:", Object.values(user));

    // Try to get the ID from various possible sources
    let userId = 0;
    if (user.id) {
      userId = Number(user.id);
      console.log("authService: Using user.id:", user.id, "->", userId);
    } else if (user.ID) {
      userId = Number(user.ID);
      console.log("authService: Using user.ID:", user.ID, "->", userId);
    } else if (user.Id) {
      userId = Number(user.Id);
      console.log("authService: Using user.Id:", user.Id, "->", userId);
    } else {
      console.log("authService: No ID found in user object");
    }

    console.log("authService: Final userId:", userId);

    const transformedUser = {
      id: userId,
      username: user.username || user.Username,
      email: user.email || user.Email,
      name: user.name || user.Name,
      avatar: user.avatar || user.Avatar,
      biography: user.biography || user.Biography,
      role: user.role || user.Role,
      discordId: user.discordId || user.DiscordId,
      discordUsername: user.discordUsername || user.DiscordUsername,
      discordDiscriminator:
        user.discordDiscriminator || user.DiscordDiscriminator,
      discordAvatar: user.discordAvatar || user.DiscordAvatar,
      birthDate: user.birthDate || user.BirthDate,
      createdAt: user.createdAt || user.CreatedAt,
      starDustPoints: user.starDustPoints || user.StarDustPoints || 0,
    };
    console.log("authService: Transformed user:", transformedUser);
    return transformedUser;
  }
}

export const authService = new AuthService();

// TanStack Query hooks for authentication
export const useDiscordLoginUrl = () => {
  return useQuery({
    queryKey: ["discord-login-url"],
    queryFn: () => authService.getDiscordLoginUrl(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDiscordCallback = () => {
  return useMutation({
    mutationFn: (code: string) => authService.handleDiscordCallback(code),
    onSuccess: (data) => {
      authService.storeAuthData(data.token, data.user);
    },
  });
};

export const useEmailLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      console.log("Mutation function called with:", { email });
      return authService.loginWithEmail(email, password);
    },
    onSuccess: (data) => {
      console.log("Email login success, storing auth data:", data);
      authService.storeAuthData(data.token, data.user);
      console.log(
        "Auth data stored. Token:",
        data.token ? "Present" : "Missing"
      );
    },
    onError: (error) => {
      console.error("Email login mutation error:", error);
    },
  });
};

export const useEmailRegister = () => {
  return useMutation({
    mutationFn: ({
      email,
      password,
      username,
      role,
    }: {
      email: string;
      password: string;
      username: string;
      role?: string;
    }) => authService.registerWithEmail(email, password, username, role),
    onSuccess: (data) => {
      console.log("Email registration success, storing auth data:", data);
      authService.storeAuthData(data.token, data.user);
      console.log(
        "Auth data stored. Token:",
        data.token ? "Present" : "Missing"
      );
    },
  });
};

export const useTokenVerification = () => {
  const token = authService.getStoredToken();

  return useQuery({
    queryKey: ["verify-token", token],
    queryFn: () => authService.verifyToken(token!),
    enabled: !!token,
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
  });
};
