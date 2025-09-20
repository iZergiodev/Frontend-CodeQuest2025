import Hero from "@/components/Hero";
import { PostCard } from "@/components/PostCard";
import { LoadMoreButton } from "@/components/LoadMoreButton";
import { usePagination } from "@/hooks/usePagination";
import { useCategories } from "@/services/postsService";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";

const Home = () => {
  const { user, followedSubcategories } = useAuth();
  const { data: categories = [] } = useCategories();

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

  const posts = useMemo(() => {
    if (!user) {
      return [];
    }

    if (followedSubcategories.size === 0) {
      return [];
    }

    return allPosts.filter(
      (post) =>
        post.subcategory &&
        followedSubcategories.has(post.subcategory.id.toString())
    );
  }, [allPosts, user, followedSubcategories]);

  if (!user) {
    return (
      <div className="bg-background">
        <Hero />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Inicia sesión para ver contenido personalizado</h3>
              <p className="text-muted-foreground mb-6">
                Accede a tu cuenta para ver posts de las subcategorías que sigues.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background flex items-center justify-center">
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
    <div className="bg-background">
      <Hero />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {followedSubcategories.size > 0 
                    ? "Posts de tus subcategorías seguidas" 
                    : "Personaliza tu feed"
                  }
                </h2>
                <p className="text-muted-foreground">
                  {followedSubcategories.size > 0 
                    ? "Contenido de las subcategorías que sigues"
                    : "Sigue las subcategorías que te interesan para ver contenido personalizado"
                  }
                </p>
              </div>

              {/* Empty state for users with no followed subcategories */}
              {followedSubcategories.size === 0 && (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-2xl">📝</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">¡Personaliza tu feed!</h3>
                    <p className="text-muted-foreground mb-6">
                      Sigue las subcategorías que te interesan para ver contenido relevante aquí.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">💡 <strong>Tip:</strong> Usa los botones "Seguir" en la barra lateral</p>
                      <p className="text-sm text-muted-foreground">🎯 <strong>Beneficio:</strong> Solo verás posts de tus temas favoritos</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty state for users with followed subcategories but no posts */}
              {followedSubcategories.size > 0 && posts.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No hay posts recientes</h3>
                    <p className="text-muted-foreground mb-6">
                      Las subcategorías que sigues no tienen posts nuevos en este momento.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">🔄 <strong>Actualiza:</strong> Los posts aparecerán aquí cuando se publiquen</p>
                      <p className="text-sm text-muted-foreground">📚 <strong>Explora:</strong> Visita otras categorías para descubrir contenido</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
                
            {posts.length > 0 && (
              <div className="space-y-6">
              {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post}
                    layout="horizontal"
                    showCategoriesAbove={true}
                  />
                ))}
              </div>
            )}
                
            {/* Load More */}
            {posts.length > 0 && hasMore && (
              <LoadMoreButton 
                onClick={loadMore}
                disabled={!hasMore}
                loading={isLoading}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
