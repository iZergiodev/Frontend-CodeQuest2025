import apiClient from "@/lib/api-client";
import {
  FollowSubcategoryDto,
  FollowAllSubcategoriesDto,
  UserFollowsDto,
  SubcategoryWithFollowerCountDto,
} from "@/types/blog";

class FollowService {
  private baseUrl = "/api/UserFollow";

  async followSubcategory(subcategoryId: string): Promise<void> {
    const followDto: FollowSubcategoryDto = {
      subcategoryId: parseInt(subcategoryId),
    };
    await apiClient.post(`${this.baseUrl}/subcategory`, followDto);
  }

  async unfollowSubcategory(subcategoryId: string): Promise<void> {
    await apiClient.delete(
      `${this.baseUrl}/subcategory/${parseInt(subcategoryId)}`
    );
  }

  async followAllSubcategories(categoryId: string): Promise<void> {
    const followDto: FollowAllSubcategoriesDto = {
      categoryId: parseInt(categoryId),
    };
    await apiClient.post(
      `${this.baseUrl}/category/all-subcategories`,
      followDto
    );
  }

  async isFollowingSubcategory(subcategoryId: string): Promise<boolean> {
    const response = await apiClient.get(
      `${this.baseUrl}/status/subcategory/${parseInt(subcategoryId)}`
    );
    return response.data.isFollowing;
  }

  async getUserFollows(): Promise<UserFollowsDto> {
    const response = await apiClient.get(`${this.baseUrl}/my-follows`);
    return response.data;
  }

  async getSubcategoriesWithFollowerCount(): Promise<
    SubcategoryWithFollowerCountDto[]
  > {
    const response = await apiClient.get(
      `${this.baseUrl}/subcategories/follower-count`
    );
    return response.data;
  }

  async getSubcategoryWithFollowerCount(
    subcategoryId: string
  ): Promise<SubcategoryWithFollowerCountDto> {
    const response = await apiClient.get(
      `${this.baseUrl}/subcategory/${parseInt(subcategoryId)}/follower-count`
    );
    return response.data;
  }

  async getSubcategoryFollowerCount(subcategoryId: string): Promise<number> {
    const response = await apiClient.get(
      `${this.baseUrl}/subcategory/${parseInt(subcategoryId)}/follower-count`
    );
    return response.data.followerCount;
  }
}

export const followService = new FollowService();
