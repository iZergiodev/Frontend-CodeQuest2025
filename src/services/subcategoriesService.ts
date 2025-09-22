import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export interface Subcategory {
  id: number;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  categoryName: string;
}

export interface CreateSubcategoryDto {
  name: string;
  description: string;
  color: string;
  categoryId: number;
}

export interface UpdateSubcategoryDto {
  name: string;
  description: string;
  color: string;
  categoryId: number;
}

class SubcategoriesService {
  private getAuthHeaders() {
    const token = localStorage.getItem("devtalles_token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  }

  async getAllSubcategories(): Promise<Subcategory[]> {
    try {
      const response = await axios.get<Subcategory[]>(
        `${BACKEND_URL}/api/subcategories`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      throw error;
    }
  }

  async getSubcategoryById(id: number): Promise<Subcategory> {
    try {
      const response = await axios.get<Subcategory>(
        `${BACKEND_URL}/api/subcategories/${id}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching subcategory:", error);
      throw error;
    }
  }

  async getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
    try {
      const response = await axios.get<Subcategory[]>(
        `${BACKEND_URL}/api/subcategories/category/${categoryId}`,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching subcategories by category:", error);
      throw error;
    }
  }

  async createSubcategory(
    subcategoryData: CreateSubcategoryDto
  ): Promise<Subcategory> {
    try {
      const response = await axios.post<Subcategory>(
        `${BACKEND_URL}/api/subcategories`,
        subcategoryData,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error creating subcategory:", error);
      throw error;
    }
  }

  async updateSubcategory(
    id: number,
    subcategoryData: UpdateSubcategoryDto
  ): Promise<Subcategory> {
    try {
      const response = await axios.put<Subcategory>(
        `${BACKEND_URL}/api/subcategories/${id}`,
        subcategoryData,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error updating subcategory:", error);
      throw error;
    }
  }

  async deleteSubcategory(id: number): Promise<void> {
    try {
      await axios.delete(
        `${BACKEND_URL}/api/subcategories/${id}`,
        this.getAuthHeaders()
      );
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      throw error;
    }
  }
}

export const subcategoriesService = new SubcategoriesService();
