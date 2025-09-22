import { useParams, useSearchParams } from "react-router-dom";
import { PostsSection } from "@/components/PostsSection";
import { useCategory, useSubcategoriesByCategory, useCategories } from "@/services/postsService";
import { usePagination } from "@/hooks/usePagination";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { BlogFilters as BlogFiltersType } from "@/types/blog";
import { FloatingEdgeButton } from "@/components/FloatingEdgeButton";

const CategoryPage = () => {
  const contentRef = useRef();
  const navigation = useNavigate();
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: categories = [] } = useCategories();
  const [filters, setFilters] = useState<BlogFiltersType>({
    category: categorySlug,
    subcategory: searchParams.get('subcategory') || undefined,
    sortBy: "latest"
  });

  const handleBackClick = () => navigation(-1)


  const category = categories.find(cat => cat.slug === categorySlug);

  const { data: subcategories = [] } = useSubcategoriesByCategory(category?.id || 0);
  const { isLoading: categoryLoading } = useCategory(category?.id || 0);

  const {
    data: posts = [],
    hasMore,
    isLoading: postsLoading,
    error: postsError,
    loadMore
  } = usePagination({
    type: 'category',
    categoryId: category?.id || 0,
    enabled: !!category?.id,
  });


  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      category: categorySlug,
      // Reset subcategory when category changes, only preserve if explicitly in URL
      subcategory: prevFilters.category === categorySlug ? (searchParams.get('subcategory') || undefined) : undefined
    }));
  }, [categorySlug, searchParams]);

  const handleFiltersChange = (newFilters: BlogFiltersType) => {
    setFilters(newFilters);
    // Update URL parameters
    const newSearchParams = new URLSearchParams();
    if (newFilters.subcategory) {
      newSearchParams.set('subcategory', newFilters.subcategory);
    }
    const newUrl = newSearchParams.toString() 
      ? `/category/${categorySlug}?${newSearchParams.toString()}`
      : `/category/${categorySlug}`;
    navigate(newUrl, { replace: true });
  };

  if (categoryLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando categoría...</p>
        </div>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Error al cargar posts</h2>
          <p className="text-muted-foreground mb-4">No se pudieron cargar los posts de esta categoría</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Categoría no encontrada</h2>
          <p className="text-muted-foreground mb-4">La categoría que buscas no existe</p>
          <Button onClick={() => navigate("/")} variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div ref={contentRef} className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <h1 className="text-4xl font-bold text-foreground">{category.name}</h1>
            {filters.subcategory && (
              <div className="flex items-center gap-2 ml-4">
                <span className="text-muted-foreground">/</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: subcategories.find(s => s.slug === filters.subcategory)?.color }}
                  />
                  <span className="text-xl font-semibold text-foreground">
                    {subcategories.find(s => s.slug === filters.subcategory)?.name}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {category.description && (
            <p className="text-muted-foreground text-lg">{category.description}</p>
          )}
        </div>

        <PostsSection
          posts={posts}
          isLoading={postsLoading}
          error={postsError}
          hasMore={hasMore}
          onLoadMore={loadMore}
          loadingMore={postsLoading}
          showFilters={true}
          categories={categories}
          initialFilters={filters}
          onFiltersChange={handleFiltersChange}
          categoryPage={true}
          layout="grid"
          gridColumns={2}
          title={
            filters.subcategory 
              ? `${subcategories.find(s => s.slug === filters.subcategory)?.name} Posts`
              : `${category.name} Posts`
          }
          emptyTitle="No se encontraron posts"
          emptyDescription="No hay posts que coincidan con los filtros seleccionados"
        />
      </div>


      <FloatingEdgeButton
        referenceRef={contentRef}
        onClick={handleBackClick}
        label="Volver"
        hideBelow="md"
        topPx={140}
        offsetMain={10}
        placement="left-start"
        className="cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </FloatingEdgeButton>
    </div>
  );
};

export default CategoryPage;
