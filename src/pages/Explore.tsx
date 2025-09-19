import { PostCard } from "@/components/PostCard";
import { LoadMoreButton } from "@/components/LoadMoreButton";
import { usePagination } from "@/hooks/usePagination";
import { useCategories } from "@/services/postsService";
import { useAuth } from "@/hooks/useAuth";
import { BlogFilters } from "@/components/Filters";
import { useState, useMemo } from "react";
import { Compass, Search } from "lucide-react";
import type { BlogFilters as BlogFiltersType } from "@/types/blog";

const Explore = () => {
  const { data: categories = [] } = useCategories();
  const [filters, setFilters] = useState<BlogFiltersType>({
    sortBy: "latest"
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Error al cargar contenido</h2>
          <p className="text-muted-foreground mb-4">No se pudo conectar con el servidor</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Compass className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Explorar</h1>
              <p className="text-muted-foreground text-lg">
                Descubre todos los posts de la comunidad
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <BlogFilters 
            categories={categories}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              {filteredPosts.length > 0 
                ? `${filteredPosts.length} posts encontrados`
                : "No se encontraron posts"
              }
            </h2>
            {filters.search && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
                <span>Buscando: "{filters.search}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No se encontraron posts</h3>
              <p className="text-muted-foreground mb-6">
                {filters.search || filters.category || filters.subcategory || filters.tag || filters.author
                  ? "Intenta ajustar los filtros para encontrar más contenido"
                  : "No hay posts disponibles en este momento"
                }
              </p>
              {(filters.search || filters.category || filters.subcategory || filters.tag || filters.author) && (
                <button
                  onClick={() => setFilters({ sortBy: "latest" })}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <LoadMoreButton 
                onClick={loadMore}
                disabled={!hasMore}
                loading={isLoading}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
