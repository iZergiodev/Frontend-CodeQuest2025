import { useState, useCallback, useRef, useEffect } from "react";
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
  initialPageSize = 6,
}: UseLoadMoreOptions = {}): UseLoadMoreReturn<T> {
  const [data, setDataState] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollPositionRef = useRef<number>(0);
  const isAppendingRef = useRef<boolean>(false);

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
        // Load more - append data and preserve scroll position
        scrollPositionRef.current = window.scrollY;
        isAppendingRef.current = true;
        setDataState((prev) => [...prev, ...result.data]);

        const restoreScroll = () => {
          if (isAppendingRef.current) {
            window.scrollTo(0, scrollPositionRef.current);
          }
        };

        setTimeout(restoreScroll, 0);
        setTimeout(restoreScroll, 10);
        setTimeout(restoreScroll, 50);
        setTimeout(restoreScroll, 100);

        requestAnimationFrame(() => {
          restoreScroll();
          isAppendingRef.current = false;
        });
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
    isAppendingRef.current = false;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isAppendingRef.current) {
        window.scrollTo(0, scrollPositionRef.current);
      }
    };

    if (isAppendingRef.current) {
      window.addEventListener("scroll", handleScroll, { passive: false });
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [data.length]);

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
