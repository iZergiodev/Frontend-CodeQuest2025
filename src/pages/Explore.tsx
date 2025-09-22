import { PostCard } from "@/components/PostCard";
import { LoadMoreButton } from "@/components/LoadMoreButton";
import { usePagination } from "@/hooks/usePagination";
import { useCategories } from "@/services/postsService";
import { BlogFilters } from "@/components/Filters";
import { useState, useMemo, useEffect } from "react";
import { Compass, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import type { BlogFilters as BlogFiltersType } from "@/types/blog";

const Explore = () => {
  const { data: categories = [] } = useCategories();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<BlogFiltersType>({
    sortBy: "latest"
  });

  // Initialize filters with URL search parameter
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setFilters(prev => ({
        ...prev,
        search: searchParam
      }));
    }
  }, [searchParams]);

  const {
    data: allPosts = [],
    hasMore,
    isLoading,
    error,
    loadMore
  } = usePagination({
    type: 'all',
    enabled: true
  });

  const filteredPosts = useMemo(() => {
    let result = [...allPosts];

    if (filters.category) {
      result = result.filter((post) => post.category.slug === filters.category);
    }

    if (filters.subcategory) {
      result = result.filter((post) => post.subcategory?.slug === filters.subcategory);
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

    if (filters.author) {
      result = result.filter((post) => 
        post.authorName.toLowerCase().includes(filters.author.toLowerCase())
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
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [allPosts, filters]);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const refresh = () => {
    window.location.reload();
  };

  // Calculate stats
  const totalLikes = filteredPosts.reduce((sum, post) => sum + post.likesCount, 0);
  const totalComments = filteredPosts.reduce((sum, post) => sum + post.commentsCount, 0);
  const totalViews = filteredPosts.reduce((sum, post) => sum + post.visitsCount, 0);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar contenido</h3>
              <p className="text-red-600 mb-4">{error instanceof Error ? error.message : 'An error occurred'}</p>
              <Button onClick={refresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Compass className="h-6 w-6 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Explorar
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Descubre todos los posts de la comunidad. Explora contenido de todas las categorías y encuentra lo que más te interese.
          </p>
        </div>


        <div className="space-y-6">
          {/* Filters */}
          <div className="-px-4">
            <BlogFilters
              categories={categories}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Posts */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <Compass className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No se encontraron posts
              </h3>
              <p className="text-muted-foreground">
                {filters.search || filters.category || filters.subcategory || filters.tag || filters.author
                  ? "Intenta ajustar los filtros para encontrar más contenido"
                  : "No hay posts disponibles en este momento"
                }
              </p>
              {(filters.search || filters.category || filters.subcategory || filters.tag || filters.author) && (
                <Button
                  onClick={() => setFilters({ sortBy: "latest" })}
                  className="mt-4"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPosts.map((post, index) => (
                <div key={post.id} className="relative">
                  <PostCard 
                    post={post}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredPosts.length > 0 && hasMore && (
            <LoadMoreButton onClick={loadMore} loading={isLoading} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Explore;
