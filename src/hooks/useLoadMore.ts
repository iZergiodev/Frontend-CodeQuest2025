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
        isAppendingRef.current = false;
      } else {
        // Load more - append data and preserve scroll position
        setDataState((prev) => [...prev, ...result.data]);

        // Restore scroll position after state update
        if (isAppendingRef.current && scrollPositionRef.current !== undefined) {
          // Use multiple attempts to ensure scroll position is maintained
          const restoreScroll = () => {
            window.scrollTo({
              top: scrollPositionRef.current,
              behavior: "instant",
            });
          };

          // Immediate restoration
          restoreScroll();

          // Additional attempts with different timings
          requestAnimationFrame(restoreScroll);
          setTimeout(restoreScroll, 0);
          setTimeout(restoreScroll, 10);
          setTimeout(restoreScroll, 50);
          setTimeout(() => {
            restoreScroll();
            isAppendingRef.current = false;
          }, 100);
        }
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
      // Capture scroll position right when load more is clicked
      scrollPositionRef.current = window.scrollY;
      isAppendingRef.current = true;
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
    if (!isAppendingRef.current) return;

    const handleScroll = () => {
      if (isAppendingRef.current && scrollPositionRef.current !== undefined) {
        // Prevent any scrolling during append operation
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: "instant",
        });
      }
    };

    // Add scroll listener with high priority
    window.addEventListener("scroll", handleScroll, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [data.length, isAppendingRef.current]);

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
