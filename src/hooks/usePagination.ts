import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getPaginatedPosts,
  getPaginatedPostsByCategory,
  getPaginatedPostsByAuthor,
  getPaginatedPostsBySubcategory,
  getPaginatedPostsByFollowedSubcategories,
} from "@/services/postsService";
import { useLoadMore } from "./useLoadMore";
import type { Post, PaginationParams } from "@/types/blog";

type PaginationType =
  | "all"
  | "category"
  | "author"
  | "subcategory"
  | "followed";

interface UsePaginationOptions {
  type: PaginationType;
  categoryId?: number;
  authorId?: number;
  subcategoryId?: number;
  followedSubcategoryIds?: number[];
  sortBy?: string;
  enabled?: boolean;
  initialPageSize?: number;
}

export function usePagination({
  type,
  categoryId,
  authorId,
  subcategoryId,
  followedSubcategoryIds,
  sortBy = "recent",
  enabled = true,
  initialPageSize = 6,
}: UsePaginationOptions) {
  const loadMore = useLoadMore<Post>({
    initialPageSize,
  });

  const getQueryFn = () => {
    switch (type) {
      case "category":
        if (categoryId === undefined || categoryId === null) {
          return () =>
            Promise.resolve({
              data: [],
              hasNextPage: false,
              hasPreviousPage: false,
              page: 1,
              pageSize: 6,
              totalItems: 0,
              totalPages: 0,
            });
        }
        return () =>
          getPaginatedPostsByCategory(categoryId, loadMore.pagination);
      case "author":
        if (authorId === undefined || authorId === null) {
          return () =>
            Promise.resolve({
              data: [],
              hasNextPage: false,
              hasPreviousPage: false,
              page: 1,
              pageSize: 6,
              totalItems: 0,
              totalPages: 0,
            });
        }
        return () => getPaginatedPostsByAuthor(authorId, loadMore.pagination);
      case "subcategory":
        if (subcategoryId === undefined || subcategoryId === null) {
          return () =>
            Promise.resolve({
              data: [],
              hasNextPage: false,
              hasPreviousPage: false,
              page: 1,
              pageSize: 6,
              totalItems: 0,
              totalPages: 0,
            });
        }
        return () =>
          getPaginatedPostsBySubcategory(subcategoryId, loadMore.pagination);
      case "followed":
        if (!followedSubcategoryIds || followedSubcategoryIds.length === 0) {
          return () =>
            Promise.resolve({
              data: [],
              hasNextPage: false,
              hasPreviousPage: false,
              page: 1,
              pageSize: 6,
              totalItems: 0,
              totalPages: 0,
            });
        }
        return () =>
          getPaginatedPostsByFollowedSubcategories(
            followedSubcategoryIds,
            loadMore.pagination,
            sortBy
          );
      case "all":
      default:
        return () => getPaginatedPosts(loadMore.pagination);
    }
  };

  const getQueryKey = () => {
    const baseKey = ["posts", "paginated"];
    switch (type) {
      case "category":
        return [...baseKey, "category", categoryId, loadMore.pagination];
      case "author":
        return [...baseKey, "author", authorId, loadMore.pagination];
      case "subcategory":
        return [...baseKey, "subcategory", subcategoryId, loadMore.pagination];
      case "followed":
        return [
          ...baseKey,
          "followed",
          followedSubcategoryIds,
          sortBy,
          loadMore.pagination,
        ];
      case "all":
      default:
        return [...baseKey, loadMore.pagination];
    }
  };

  const isEnabled = () => {
    if (!enabled || loadMore.pagination.page <= 0) return false;

    switch (type) {
      case "category":
        return categoryId !== undefined && categoryId !== null;
      case "author":
        return authorId !== undefined && authorId !== null && authorId > 0;
      case "subcategory":
        return (
          subcategoryId !== undefined &&
          subcategoryId !== null &&
          subcategoryId > 0
        );
      case "followed":
        return (
          followedSubcategoryIds !== undefined &&
          followedSubcategoryIds.length > 0
        );
      case "all":
      default:
        return true;
    }
  };

  const {
    data: paginatedResult,
    isLoading,
    error,
  } = useQuery({
    queryKey: getQueryKey(),
    queryFn: getQueryFn(),
    enabled: isEnabled(),
  });

  useEffect(() => {
    if (paginatedResult) {
      loadMore.setData(paginatedResult);
    }
  }, [paginatedResult]);

  useEffect(() => {
    loadMore.setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    loadMore.setError(error);
  }, [error]);

  return {
    ...loadMore,
    isLoading: loadMore.isLoading || isLoading,
    error: loadMore.error || error,
  };
}
