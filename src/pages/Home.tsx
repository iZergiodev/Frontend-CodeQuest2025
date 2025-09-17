import Hero from "@/components/Hero";
import { PostCard } from "@/components/PostCard";
import { useBlogData } from "@/hooks/useBlogData";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
  const {
    posts,
    isLoading,
    error 
  } = useBlogData();
  const { user } = useAuth();

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
    <div className="min-h-screen bg-background">
      <Hero />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 pe-8">
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
              <div>
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post}
                  />
                ))}
              </div>
            )}
            
            {/* Load More */}
            {posts.length > 0 && (
              <div className="text-center mt-12">
                <button className="px-8 py-3 bg-devtalles-gradient text-white rounded-lg hover:opacity-90 transition-opacity">
                  Cargar más posts
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
