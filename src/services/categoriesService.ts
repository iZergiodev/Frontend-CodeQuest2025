import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  color: string;
}

export interface UpdateCategoryDto {
  name: string;
  description: string;
  color: string;
}

class CategoriesService {
  private getAuthHeaders() {
    const token = localStorage.getItem("devtalles_token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await axios.get<Category[]>(
        `${BACKEND_URL}/api/categories`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await axios.get<Category>(
        `${BACKEND_URL}/api/categories/${id}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  }

  async getCategoryByName(name: string): Promise<Category> {
    try {
      const response = await axios.get<Category>(
        `${BACKEND_URL}/api/categories/name/${name}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching category by name:", error);
      throw error;
    }
  }

  async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    try {
      const response = await axios.post<Category>(
        `${BACKEND_URL}/api/categories`,
        categoryData,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async updateCategory(
    id: number,
    categoryData: UpdateCategoryDto
  ): Promise<Category> {
    try {
      const response = await axios.put<Category>(
        `${BACKEND_URL}/api/categories/${id}`,
        categoryData,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await axios.delete(
        `${BACKEND_URL}/api/categories/${id}`,
        this.getAuthHeaders()
      );
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
}

export const categoriesService = new CategoriesService();
