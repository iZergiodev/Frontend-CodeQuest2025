import Hero from "@/components/Hero";
import { PostCard } from "@/components/PostCard";
import { LoadMoreButton } from "@/components/LoadMoreButton";
import { useBlogData } from "@/hooks/useBlogData";
import { useRankingData } from "@/hooks/useRankingData";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Star, Users } from "lucide-react";

const Home = () => {
  const {
    posts,
    isLoading,
    error 
  } = useBlogData();
  const { user } = useAuth();

  const handleLoadMore = () => {
    // TODO: Implement load more logic
    console.log('Load more posts clicked');
  };

  // Get trending and popular posts
  const {
    posts: trendingPosts,
    loading: trendingLoading,
    error: trendingError
  } = useRankingData({
    type: 'trending',
    limit: 6,
    autoRefresh: true
  });

  const {
    posts: popularPosts,
    loading: popularLoading,
    error: popularError
  } = useRankingData({
    type: 'popular',
    limit: 6,
    autoRefresh: true
  });

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
          <div className="flex-1 pe-8">
            <Tabs defaultValue="following" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="following" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Siguiendo
                </TabsTrigger>
                <TabsTrigger value="trending" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="popular" className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Popular
                </TabsTrigger>
              </TabsList>

              <TabsContent value="following" className="space-y-6">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {posts.length > 0 ? "Posts de tus subcategorías seguidas" : "No hay posts disponibles"}
                  </h2>
                  <p className="text-muted-foreground">
                    {posts.length > 0 
                      ? "Contenido de las subcategorías que sigues"
                      : user 
                        ? "Sigue algunas subcategorías para ver contenido personalizado"
                        : "Inicia sesión para ver contenido personalizado"
                    }
                  </p>
                </div>

                {/* Empty state for users with no followed subcategories */}
                {user && posts.length === 0 && (
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
                
                {posts.length > 0 && (
                  <div className="space-y-6">
                    {posts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post}
                        layout="horizontal"
                      />
                    ))}
                  </div>
                )}
                
                {/* Load More */}
                {posts.length > 0 && (
                  <LoadMoreButton 
                    onClick={handleLoadMore}
                  />
                )}
              </TabsContent>

              <TabsContent value="trending" className="space-y-6">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-2">Posts Trending</h2>
                  <p className="text-muted-foreground">
                    Posts que están ganando momentum ahora mismo. Basado en actividad reciente en las últimas 24 horas.
                  </p>
                </div>

                {trendingLoading ? (
                  <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="h-32 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : trendingError ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error cargando posts trending</h3>
                    <p className="text-red-600">{trendingError}</p>
                  </div>
                ) : trendingPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay posts trending</h3>
                    <p className="text-muted-foreground">No hay posts trending en este momento.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {trendingPosts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={{
                          id: post.id.toString(),
                          title: post.title,
                          content: post.content,
                          excerpt: post.summary || post.content.substring(0, 150) + '...',
                          coverImage: post.imageUrl,
                          tags: post.tags,
                          createdAt: post.createdAt,
                          updatedAt: post.updatedAt,
                          readTime: Math.ceil(post.content.length / 200),
                          authorId: post.authorId,
                          authorName: post.authorName,
                          authorAvatar: post.authorAvatar,
                          category: post.categoryName ? {
                            id: Number(post.categoryId!),
                            name: post.categoryName,
                            color: post.categoryColor || '#6366f1',
                            slug: post.categoryName.toLowerCase().replace(/\s+/g, '-'),
                            createdAt: post.createdAt,
                            updatedAt: post.updatedAt
                          } : undefined,
                          subcategory: post.subcategoryName ? {
                            id: Number(post.subcategoryId!),
                            name: post.subcategoryName,
                            color: post.subcategoryColor || '#8b5cf6',
                            slug: post.subcategoryName.toLowerCase().replace(/\s+/g, '-'),
                            categoryId: Number(post.categoryId!),
                            createdAt: post.createdAt,
                            updatedAt: post.updatedAt
                          } : undefined,
                          likesCount: post.likesCount,
                          commentsCount: post.commentsCount,
                          visitsCount: post.visitsCount,
                          featured: false,
                          slug: `post-${post.id}`,
                          author: post.authorId,
                          published: true
                        }}
                        layout="horizontal"
                        showTrendingMetrics={true}
                        trendingScore={post.trendingScore}
                        recentActivity={{
                          likes: post.recentLikesCount,
                          comments: post.recentCommentsCount,
                          views: post.recentVisitsCount,
                          lastActivity: post.lastActivityAt
                        }}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="popular" className="space-y-6">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-2">Posts Populares</h2>
                  <p className="text-muted-foreground">
                    Los posts más atractivos y bien recibidos en la comunidad. Basado en engagement total a lo largo del tiempo.
                  </p>
                </div>

                {popularLoading ? (
                  <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="h-32 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : popularError ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error cargando posts populares</h3>
                    <p className="text-red-600">{popularError}</p>
                  </div>
                ) : popularPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay posts populares</h3>
                    <p className="text-muted-foreground">No hay posts populares en este momento.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {popularPosts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={{
                          id: post.id.toString(),
                          title: post.title,
                          content: post.content,
                          excerpt: post.summary || post.content.substring(0, 150) + '...',
                          coverImage: post.imageUrl,
                          tags: post.tags,
                          createdAt: post.createdAt,
                          updatedAt: post.updatedAt,
                          readTime: Math.ceil(post.content.length / 200),
                          authorId: post.authorId,
                          authorName: post.authorName,
                          authorAvatar: post.authorAvatar,
                          category: post.categoryName ? {
                            id: Number(post.categoryId!),
                            name: post.categoryName,
                            color: post.categoryColor || '#6366f1',
                            slug: post.categoryName.toLowerCase().replace(/\s+/g, '-'),
                            createdAt: post.createdAt,
                            updatedAt: post.updatedAt
                          } : undefined,
                          subcategory: post.subcategoryName ? {
                            id: Number(post.subcategoryId!),
                            name: post.subcategoryName,
                            color: post.subcategoryColor || '#8b5cf6',
                            slug: post.subcategoryName.toLowerCase().replace(/\s+/g, '-'),
                            categoryId: Number(post.categoryId!),
                            createdAt: post.createdAt,
                            updatedAt: post.updatedAt
                          } : undefined,
                          likesCount: post.likesCount,
                          commentsCount: post.commentsCount,
                          visitsCount: post.visitsCount,
                          featured: false,
                          slug: `post-${post.id}`,
                          author: post.authorId,
                          published: true
                        }}
                        layout="horizontal"
                        showPopularityMetrics={true}
                        popularityScore={post.popularityScore}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
