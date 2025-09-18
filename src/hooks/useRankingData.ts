import { useState, useEffect, useCallback } from "react";
import {
  rankingService,
  RankingPost,
  RankingResponse,
} from "../services/rankingService";

export type RankingType = "trending" | "popular" | "most-popular";

interface UseRankingDataOptions {
  type: RankingType;
  limit?: number;
  categoryId?: number;
  subcategoryId?: number;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

export function useRankingData({
  type,
  limit = 20,
  categoryId,
  subcategoryId,
  autoRefresh = false,
  refreshInterval = 300000, // 5 minutes
}: UseRankingDataOptions) {
  const [posts, setPosts] = useState<RankingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let response: RankingResponse;

      switch (type) {
        case "trending":
          response = await rankingService.getTrendingPosts(
            limit,
            categoryId,
            subcategoryId
          );
          break;
        case "popular":
          response = await rankingService.getPopularPosts(
            limit,
            categoryId,
            subcategoryId
          );
          break;
        case "most-popular":
          response = await rankingService.getMostPopularPosts(limit);
          break;
        default:
          throw new Error(`Unknown ranking type: ${type}`);
      }

      setPosts(response.posts);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(`Error fetching ${type} posts:`, err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [type, limit, categoryId, subcategoryId]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    posts,
    loading,
    error,
    lastUpdated,
    refresh,
    refetch: fetchData,
  };
}

// Hook for popular posts by category
export function usePopularPostsByCategory(limitPerCategory = 5) {
  const [postsByCategory, setPostsByCategory] = useState<
    Record<string, RankingPost[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await rankingService.getPopularPostsByCategory(
        limitPerCategory
      );
      setPostsByCategory(response.postsByCategory);
    } catch (err) {
      console.error("Error fetching popular posts by category:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [limitPerCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    postsByCategory,
    loading,
    error,
    refetch: fetchData,
  };
}
