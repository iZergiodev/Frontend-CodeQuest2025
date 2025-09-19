import { useParams, useSearchParams } from "react-router-dom";
import { PostCard } from "@/components/PostCard";
import { useCategory, useSubcategoriesByCategory, usePosts, useCategories } from "@/services/postsService";
import { BlogFilters } from "@/components/Filters";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect, useRef } from "react";
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
  const { data: posts = [] } = usePosts();
  const { data: categories = [] } = useCategories();
  const [filters, setFilters] = useState<BlogFiltersType>({
    category: categorySlug,
    subcategory: searchParams.get('subcategory') || undefined,
    sortBy: "latest"
  });

  const handleBackClick = () => navigation(-1)

  const category = posts.find(post => 
    post.category.slug === categorySlug
  )?.category;


  const { data: subcategories = [] } = useSubcategoriesByCategory(category?.id || 0);
  const { isLoading: categoryLoading } = useCategory(category?.id || 0);


  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      category: categorySlug,
      subcategory: searchParams.get('subcategory') || undefined
    }));
  }, [categorySlug, searchParams]);

  const filteredPosts = useMemo(() => {
    let result = posts.filter(post => post.category.slug === categorySlug);

    if (filters.subcategory) {
      result = result.filter(post => post.subcategory?.slug === filters.subcategory);
    }

    if (filters.tag) {
      result = result.filter(post => post.tags && post.tags.includes(filters.tag));
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
    }

    if (filters.sortBy === "popular") {
      result.sort((a, b) => b.likesCount - a.likesCount);
    } else if (filters.sortBy === "trending") {
      result.sort((a, b) => 
        b.likesCount + b.commentsCount - (a.likesCount + a.commentsCount)
      );
    } else {
      result.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [posts, categorySlug, filters]);

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando categoría...</p>
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

        {/* Filters */}
        <div className="mb-8">
          <BlogFilters 
            categories={categories}
            filters={filters}
            onFiltersChange={(newFilters) => {
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
            }}
            categoryPage={true}
          />
        </div>

        {/* Posts Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {filters.subcategory 
                ? `${subcategories.find(s => s.slug === filters.subcategory)?.name} Posts`
                : `${category.name} Posts`
              }
            </h2>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No hay posts que coincidan con los filtros seleccionados
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-12">
        <button className="px-8 py-3 bg-devtalles-gradient text-white rounded-lg hover:opacity-90 transition-opacity">
          Cargar más posts
        </button>
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
