import { useParams } from "react-router-dom";
import { PostCard } from "@/components/PostCard";
import { useCategory, useSubcategoriesByCategory, usePosts, useCategories } from "@/services/postsService";
import { BlogFilters } from "@/components/Filters";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { BlogFilters as BlogFiltersType } from "@/types/blog";

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const { data: posts = [] } = usePosts();
  const { data: categories = [] } = useCategories();
  const [filters, setFilters] = useState<BlogFiltersType>({
    category: categorySlug,
    sortBy: "latest"
  });

  const category = posts.find(post => 
    post.category.slug === categorySlug
  )?.category;

  const { data: subcategories = [] } = useSubcategoriesByCategory(category?.id || "");
  const { data: categoryData, isLoading: categoryLoading } = useCategory(category?.id || "");


  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      category: categorySlug,
      subcategory: undefined
    }));
  }, [categorySlug]);

  const filteredPosts = useMemo(() => {
    let result = posts.filter(post => post.category.slug === categorySlug);

    if (filters.subcategory) {
      result = result.filter(post => post.subcategory?.id === filters.subcategory);
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
      result.sort((a, b) => b.likes - a.likes);
    } else if (filters.sortBy === "trending") {
      result.sort((a, b) => 
        b.likes + (b.comments?.length || 0) - (a.likes + (a.comments?.length || 0))
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
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => navigate("/")} 
            variant="ghost" 
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <h1 className="text-4xl font-bold text-foreground">{category.name}</h1>
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
            onFiltersChange={setFilters}
            categoryPage={true}
          />
        </div>

        {/* Posts Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {category.name} Posts
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
    </div>
  );
};

export default CategoryPage;
