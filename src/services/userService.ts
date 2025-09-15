import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, CreateUserDto } from "../types/blog";
import apiClient from "../lib/api-client";

class UserService {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>("/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await apiClient.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      const response = await apiClient.post<User>("/users/register", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUserProfile(id: number, userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  // Get current user profile
  async getCurrentUserProfile(): Promise<User> {
    try {
      const token = localStorage.getItem("devtalles_token");
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
      const token = localStorage.getItem("devtalles_token");
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

// TanStack Query hooks for users
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getAllUsers(),
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => userService.getCurrentUserProfile(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserDto) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: Partial<User> }) =>
      userService.updateUserProfile(id, userData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
};

export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Partial<User>) =>
      userService.updateCurrentUserProfile(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useAddStarDustPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, points }: { userId: number; points: number }) =>
      userService.addStarDustPoints(userId, points),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
};
