import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLoadMore } from "./useLoadMore";
import { getPaginatedPosts } from "../services/postsService";
import { Post } from "../types/blog";

interface UseLoadMorePostsOptions {
  enabled?: boolean;
}

export function useLoadMorePosts({
  enabled = true,
}: UseLoadMorePostsOptions = {}) {
  const loadMore = useLoadMore<Post>({
    initialPageSize: 12,
  });

  const {
    data: paginatedResult,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", "paginated", loadMore.pagination],
    queryFn: () => getPaginatedPosts(loadMore.pagination),
    enabled: enabled && loadMore.pagination.page > 0,
  });

  // Update load more data when result changes
  React.useEffect(() => {
    if (paginatedResult) {
      loadMore.setData(paginatedResult);
    }
  }, [paginatedResult]);

  // Update loading state
  React.useEffect(() => {
    loadMore.setLoading(isLoading);
  }, [isLoading]);

  // Update error state
  React.useEffect(() => {
    loadMore.setError(error);
  }, [error]);

  return {
    ...loadMore,
    isLoading: loadMore.isLoading || isLoading,
    error: loadMore.error || error,
  };
}
