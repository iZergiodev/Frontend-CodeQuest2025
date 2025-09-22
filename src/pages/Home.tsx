import Hero from "@/components/Hero";
import { PostsSection } from "@/components/PostsSection";
import { usePagination } from "@/hooks/usePagination";
import { useAuth } from "@/hooks/useAuth";
import { useMemo, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Clock, TrendingUp, Star, Calendar } from "lucide-react";

type SortKey = "recent" | "popular" | "trending" | "oldest";

const Home = () => {
  const { user, followedSubcategories } = useAuth();
  const [sortBy, setSortBy] = useState<SortKey>("recent");

  // Convert Set to Array for the API call
  const followedSubcategoryIds = useMemo(() => {
    return Array.from(followedSubcategories).map(id => parseInt(id));
  }, [followedSubcategories]);

  const {
    data: posts = [],
    hasMore,
    isLoading,
    error,
    loadMore
  } = usePagination({
    type: 'followed',
    followedSubcategoryIds,
    sortBy,
    enabled: !!user && followedSubcategories.size > 0
  });

  const sortOptions = [
    { value: "recent", label: "Recientes", icon: Clock },
    { value: "popular", label: "Populares", icon: Star },
    { value: "trending", label: "Tendencia", icon: TrendingUp },
    { value: "oldest", label: "Más antiguos", icon: Calendar },
  ] as const;

  const currentSortOption = sortOptions.find(option => option.value === sortBy) || sortOptions[0];

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
            <PostsSection
              posts={posts}
              isLoading={isLoading}
              error={error}
              hasMore={hasMore}
              onLoadMore={loadMore}
              loadingMore={isLoading}
              layout="horizontal"
              showCategoriesAbove={true}
              title={
                followedSubcategories.size > 0 
                  ? "Posts de tus subcategorías seguidas" 
                  : "Personaliza tu feed"
              }
              description={
                followedSubcategories.size > 0 
                  ? "Contenido de las subcategorías que sigues"
                  : "Sigue las subcategorías que te interesan para ver contenido personalizado"
              }
              headerActions={
                followedSubcategories.size > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Ordenar por:</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <currentSortOption.icon className="h-4 w-4" />
                          {currentSortOption.label}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {sortOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => setSortBy(option.value as SortKey)}
                            className="flex items-center gap-2"
                          >
                            <option.icon className="h-4 w-4" />
                            {option.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              }
              emptyTitle={
                followedSubcategories.size === 0 
                  ? "¡Personaliza tu feed!" 
                  : "No hay posts disponibles"
              }
              emptyDescription={
                followedSubcategories.size === 0 
                  ? "Sigue las subcategorías que te interesan para ver contenido relevante aquí."
                  : "Las subcategorías que sigues no tienen posts en este momento."
              }
              emptyIcon={
                followedSubcategories.size === 0 
                  ? <span className="text-2xl">📝</span>
                  : <span className="text-2xl">🔍</span>
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
