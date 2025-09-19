import { useState, useCallback } from "react";
import { PaginationParams, PaginatedResult } from "../types/blog";

interface UseLoadMoreOptions {
  initialPageSize?: number;
}

interface UseLoadMoreReturn<T> {
  data: T[];
  hasMore: boolean;
  isLoading: boolean;
  error: Error | null;
  loadMore: () => void;
  reset: () => void;
  setData: (data: PaginatedResult<T>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  pagination: PaginationParams;
}

export function useLoadMore<T>({
  initialPageSize = 12,
}: UseLoadMoreOptions = {}): UseLoadMoreReturn<T> {
  const [data, setDataState] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pagination: PaginationParams = {
    page: currentPage,
    pageSize: initialPageSize,
  };

  const setData = useCallback(
    (result: PaginatedResult<T>) => {
      if (currentPage === 1) {
        // First load - replace data
        setDataState(result.data);
      } else {
        // Load more - append data
        setDataState((prev) => [...prev, ...result.data]);
      }
      setHasMore(result.hasNextPage);
    },
    [currentPage]
  );

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasMore, isLoading]);

  const reset = useCallback(() => {
    setDataState([]);
    setHasMore(true);
    setCurrentPage(1);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    data,
    hasMore,
    isLoading,
    error,
    loadMore,
    reset,
    setData,
    setLoading,
    setError,
    pagination,
  };
}
