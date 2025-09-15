import { useState, useMemo } from "react";
import type { BlogFilters } from "@/types/blog";
import { usePosts, useCategories } from "@/services/postsService";

export function useBlogData() {
  const [filters, setFilters] = useState<BlogFilters>({});

  // Fetch real data from API
  const {
    data: posts = [],
    isLoading: postsLoading,
    error: postsError,
  } = usePosts();
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (filters.category) {
      result = result.filter((post) => post.category.slug === filters.category);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          (post.tags &&
            post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
      );
    }

    if (filters.tag) {
      result = result.filter(
        (post) => post.tags && post.tags.includes(filters.tag)
      );
    }

    // Sort posts
    if (filters.sortBy === "popular") {
      result.sort((a, b) => b.likes - a.likes);
    } else if (filters.sortBy === "trending") {
      result.sort(
        (a, b) =>
          b.likes +
          (b.comments?.length || 0) -
          (a.likes + (a.comments?.length || 0))
      );
    } else {
      // Default: sort by creation date (newest first)
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [posts, filters]);

  const featuredPosts = posts.filter((post) => post.featured);

  return {
    posts: filteredPosts,
    featuredPosts,
    categories,
    filters,
    setFilters,
    isLoading: postsLoading || categoriesLoading,
    error: postsError || categoriesError,
  };
}
