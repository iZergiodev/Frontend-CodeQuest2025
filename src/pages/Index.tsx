import React from "react";
import Hero from "@/components/Hero";
import { PostCard } from "@/components/PostCard";
import { LoadMoreButton } from "@/components/LoadMoreButton";
import { BlogFilters } from "@/components/Filters";
import { useBlogData } from "@/hooks/useBlogData";
import { useLoadMorePosts } from "@/hooks/useLoadMorePosts";

const Index = () => {
  const { 
    categories, 
    filters, 
    setFilters
  } = useBlogData();

  const {
    data: posts,
    hasMore,
    isLoading,
    error,
    loadMore
  } = useLoadMorePosts({
    enabled: true
  });

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
      <Hero />
      
      <main className="container mx-auto px-4 py-12">
        <BlogFilters 
          categories={categories}
          filters={filters}
          onFiltersChange={setFilters}
        />
        <div className="flex ga p-8">
          {/* Main Content */}
          <div className="flex-1 pe-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Últimos Posts
              </h2>
              <p className="text-muted-foreground">
                Descubre el contenido más reciente de nuestra comunidad
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                />
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMore && (
              <LoadMoreButton 
                onClick={loadMore}
                loading={isLoading}
                disabled={!hasMore}
              />
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default Index;
