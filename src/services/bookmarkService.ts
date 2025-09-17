import apiClient from "@/lib/api-client";
import {
  BookmarkDto,
  BookmarkResponseDto,
  UserBookmarksDto,
} from "@/types/blog";

class BookmarkService {
  private baseUrl = "/api/Bookmark";

  async toggleBookmark(postId: string): Promise<BookmarkResponseDto> {
    const response = await apiClient.post(`${this.baseUrl}/toggle/${postId}`);
    return response.data;
  }

  async getBookmarkStatus(postId: string): Promise<BookmarkResponseDto> {
    const response = await apiClient.get(`${this.baseUrl}/status/${postId}`);
    return response.data;
  }

  async getUserBookmarks(
    page: number = 1,
    pageSize: number = 10
  ): Promise<UserBookmarksDto> {
    const response = await apiClient.get(`${this.baseUrl}/my-bookmarks`, {
      params: { page, pageSize },
    });
    return response.data;
  }

  async getBookmarksByPost(
    postId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<BookmarkDto[]> {
    const response = await apiClient.get(
      `${this.baseUrl}/post/${postId}/bookmarks`,
      {
        params: { page, pageSize },
      }
    );
    return response.data;
  }

  async getBookmarkCount(postId: string): Promise<{ count: number }> {
    const response = await apiClient.get(`${this.baseUrl}/count/${postId}`);
    return response.data;
  }
}

export const bookmarkService = new BookmarkService();
