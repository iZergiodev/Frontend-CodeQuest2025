import { User, UserDto, CreateUserDto, UserLoginDto } from "../types/blog";
import { authService } from "./authService";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

class UserService {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${BACKEND_URL}/users`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${BACKEND_URL}/users/${id}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Usuario no encontrado");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${BACKEND_URL}/users/register`,
        {
          method: "POST",
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUserProfile(id: number, userData: Partial<User>): Promise<User> {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${BACKEND_URL}/users/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const response = await authService.makeAuthenticatedRequest(
        `${BACKEND_URL}/users/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  // Get current user profile
  async getCurrentUserProfile(): Promise<User> {
    try {
      const token = authService.getStoredToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      // Decode JWT token to get user ID
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.nameid || payload.sub;

      if (!userId) {
        throw new Error("User ID not found in token");
      }

      return await this.getUserById(parseInt(userId));
    } catch (error) {
      console.error("Error fetching current user profile:", error);
      throw error;
    }
  }

  // Update current user profile
  async updateCurrentUserProfile(userData: Partial<User>): Promise<User> {
    try {
      const token = authService.getStoredToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      // Decode JWT token to get user ID
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.nameid || payload.sub;

      if (!userId) {
        throw new Error("User ID not found in token");
      }

      return await this.updateUserProfile(parseInt(userId), userData);
    } catch (error) {
      console.error("Error updating current user profile:", error);
      throw error;
    }
  }

  async addStarDustPoints(userId: number, points: number): Promise<User> {
    try {
      const user = await this.getUserById(userId);
      const updatedUser = await this.updateUserProfile(userId, {
        ...user,
        starDustPoints: user.starDustPoints + points,
      });
      return updatedUser;
    } catch (error) {
      console.error("Error adding StarDust points:", error);
      throw error;
    }
  }
}

export const userService = new UserService();
