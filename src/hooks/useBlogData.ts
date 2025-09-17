import { useState, useMemo } from "react";
import type { BlogFilters } from "@/types/blog";
import { usePosts, useCategories } from "@/services/postsService";
import { useAuth } from "@/hooks/useAuth";

export function useBlogData() {
  const [filters, setFilters] = useState<BlogFilters>({});
  const { user, followedSubcategories } = useAuth();

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

    if (user && followedSubcategories.size > 0) {
      result = result.filter(
        (post) =>
          post.subcategory && followedSubcategories.has(post.subcategory.id)
      );
    }

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
      result.sort((a, b) => b.likesCount - a.likesCount);
    } else if (filters.sortBy === "trending") {
      result.sort(
        (a, b) =>
          b.likesCount +
          (b.commentsCount || 0) -
          (a.likesCount + (a.commentsCount || 0))
      );
    } else {
      // Default: sort by creation date (newest first)
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [posts, filters, user, followedSubcategories]);

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
