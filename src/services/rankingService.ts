import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5110/api";

export interface RankingPost {
  id: number;
  title: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  categoryId?: number;
  categoryName?: string;
  categoryColor?: string;
  subcategoryId?: number;
  subcategoryName?: string;
  subcategoryColor?: string;
  likesCount: number;
  commentsCount: number;
  visitsCount: number;
  popularityScore: number;
  trendingScore: number;
  lastActivityAt: string;
  recentLikesCount: number;
  recentCommentsCount: number;
  recentVisitsCount: number;
}

export interface RankingResponse {
  posts: RankingPost[];
  count: number;
  type: string;
}

export interface PopularByCategoryResponse {
  postsByCategory: Record<string, RankingPost[]>;
  type: string;
}

export interface RecordEngagementRequest {
  postId: number;
  userId: number;
}

export interface RemoveEngagementRequest {
  postId: number;
  userId: number;
  type: "View" | "Like" | "Comment" | "Bookmark";
}

class RankingService {
  private baseUrl = `${API_BASE_URL}/Ranking`;

  // Get trending posts
  async getTrendingPosts(
    limit = 20,
    categoryId?: number,
    subcategoryId?: number
  ): Promise<RankingResponse> {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());
    if (categoryId) params.append("categoryId", categoryId.toString());
    if (subcategoryId) params.append("subcategoryId", subcategoryId.toString());

    const response = await axios.get(`${this.baseUrl}/trending?${params}`);
    return response.data;
  }

  // Get popular posts
  async getPopularPosts(
    limit = 20,
    categoryId?: number,
    subcategoryId?: number
  ): Promise<RankingResponse> {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());
    if (categoryId) params.append("categoryId", categoryId.toString());
    if (subcategoryId) params.append("subcategoryId", subcategoryId.toString());

    const response = await axios.get(`${this.baseUrl}/popular?${params}`);
    return response.data;
  }

  // Get most popular posts of all time
  async getMostPopularPosts(limit = 10): Promise<RankingResponse> {
    const response = await axios.get(
      `${this.baseUrl}/most-popular?limit=${limit}`
    );
    return response.data;
  }

  // Get popular posts by category
  async getPopularPostsByCategory(
    limitPerCategory = 5
  ): Promise<PopularByCategoryResponse> {
    const response = await axios.get(
      `${this.baseUrl}/popular-by-category?limitPerCategory=${limitPerCategory}`
    );
    return response.data;
  }

  // Record engagement events
  async recordView(postId: number, userId: number): Promise<void> {
    await axios.post(`${this.baseUrl}/record-view`, { postId, userId });
  }

  async recordLike(postId: number, userId: number): Promise<void> {
    await axios.post(`${this.baseUrl}/record-like`, { postId, userId });
  }

  async recordComment(postId: number, userId: number): Promise<void> {
    await axios.post(`${this.baseUrl}/record-comment`, { postId, userId });
  }

  async recordBookmark(postId: number, userId: number): Promise<void> {
    await axios.post(`${this.baseUrl}/record-bookmark`, { postId, userId });
  }

  // Remove engagement
  async removeEngagement(
    postId: number,
    userId: number,
    type: "View" | "Like" | "Comment" | "Bookmark"
  ): Promise<void> {
    await axios.delete(`${this.baseUrl}/remove-engagement`, {
      data: { postId, userId, type },
    });
  }

  // Admin functions
  async recalculateTrending(): Promise<void> {
    await axios.post(`${this.baseUrl}/recalculate-trending`);
  }

  async recalculatePopularity(): Promise<void> {
    await axios.post(`${this.baseUrl}/recalculate-popularity`);
  }
}

export const rankingService = new RankingService();
