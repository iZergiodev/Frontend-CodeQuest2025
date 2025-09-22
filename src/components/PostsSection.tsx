import { useState, useMemo, ReactNode } from "react";
import { PostCard } from "@/components/PostCard";
import { LoadMoreButton } from "@/components/LoadMoreButton";
import { BlogFilters } from "@/components/Filters";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCategories, useDeletePost } from "@/services/postsService";
import type { Post, BlogFilters as BlogFiltersType, Category } from "@/types/blog";
import { 
  Edit, 
  Trash2, 
  FileText,
  RefreshCw
} from "lucide-react";

export interface PostsSectionProps {
  // Data
  posts: Post[];
  isLoading?: boolean;
  error?: Error | null;
  
  // Pagination
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  
  // Filtering
  showFilters?: boolean;
  categories?: Category[];
  initialFilters?: BlogFiltersType;
  onFiltersChange?: (filters: BlogFiltersType) => void;
  
  // Layout
  layout?: 'grid' | 'horizontal' | 'admin';
  gridColumns?: 1 | 2 | 3;
  showCategoriesAbove?: boolean;
  
  // Admin functionality
  isAdminView?: boolean;
  onDeletePost?: (id: string) => Promise<void>;
  
  // Empty state
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  
  // Header
  title?: string;
  description?: string;
  headerActions?: ReactNode;
  
  // Error handling
  onRetry?: () => void;
  
  // Custom rendering
  renderPost?: (post: Post, index: number) => ReactNode;
}

export const PostsSection = ({
  posts,
  isLoading = false,
  error = null,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  showFilters = false,
  categories = [],
  initialFilters = {},
  onFiltersChange,
  layout = 'grid',
  gridColumns = 2,
  showCategoriesAbove = false,
  isAdminView = false,
  onDeletePost,
  emptyTitle = "No se encontraron posts",
  emptyDescription = "No hay posts disponibles en este momento",
  emptyIcon,
  title,
  description,
  headerActions,
  onRetry,
  renderPost
}: PostsSectionProps) => {
  const [filters, setFilters] = useState<BlogFiltersType>(initialFilters);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: defaultCategories = [] } = useCategories();
  const deletePostMutation = useDeletePost();

  // Use provided categories or default
  const availableCategories = categories.length > 0 ? categories : defaultCategories;

  // Handle filters change
  const handleFiltersChange = (newFilters: BlogFiltersType) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  // Filter posts based on current filters
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.authorName.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        (post.category?.name && post.category.name.toLowerCase().includes(searchLower)) ||
        (post.subcategory?.name && post.subcategory.name.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (filters.category) {
      const category = availableCategories.find(c => c.slug === filters.category);
      if (category) {
        result = result.filter(post => post.category?.id === category.id);
      }
    }

    // Subcategory filter
    if (filters.subcategory) {
      result = result.filter(post => post.subcategory?.slug === filters.subcategory);
    }

    // Tag filter
    if (filters.tag) {
      result = result.filter(post => post.tags.includes(filters.tag));
    }

    // Author filter
    if (filters.author) {
      result = result.filter(post => 
        post.authorName.toLowerCase().includes(filters.author.toLowerCase())
      );
    }

    // Sort posts
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
  }, [posts, filters, availableCategories]);

  // Handle post deletion
  const handleDeletePost = async (id: string, title: string) => {
    try {
      if (onDeletePost) {
        await onDeletePost(id);
      } else {
        await deletePostMutation.mutateAsync(id);
      }
      toast({
        title: "Éxito",
        description: `Post "${title}" eliminado exitosamente`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al eliminar el post",
        variant: "destructive",
      });
    }
  };

  // Default post renderer
  const defaultRenderPost = (post: Post, index: number) => {
    if (isAdminView) {
      return (
        <div key={post.id} className="relative group">
          {/* Admin Actions Overlay */}
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/edit-post/${post.slug}`);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="h-8 w-8 p-0 bg-destructive/90 backdrop-blur-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar post?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente el post "{post.title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeletePost(post.id.toString(), post.title)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          {/* Post Card */}
          <PostCard post={post} isAdminView={true} />
        </div>
      );
    }

    return (
      <PostCard 
        key={post.id}
        post={post}
        layout={layout === 'horizontal' ? 'horizontal' : 'default'}
        showCategoriesAbove={showCategoriesAbove}
      />
    );
  };

  // Error state
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Error al cargar contenido
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error.message || 'Ocurrió un error inesperado'}
            </p>
            <Button onClick={onRetry || (() => window.location.reload())} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    const gridCols = layout === 'admin' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                    gridColumns === 1 ? 'grid-cols-1' :
                    gridColumns === 3 ? 'grid-cols-1 lg:grid-cols-3' :
                    'grid-cols-1 lg:grid-cols-2';

    return (
      <div className={`grid ${gridCols} gap-6`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Main content
  return (
    <div className="space-y-6">
      {/* Header */}
      {(title || description || headerActions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {title && <h2 className="text-2xl font-bold text-foreground">{title}</h2>}
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <BlogFilters 
          categories={availableCategories}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      )}

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          {emptyIcon && (
            <div className="mx-auto mb-4 w-12 h-12 text-muted-foreground">
              {emptyIcon}
            </div>
          )}
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {emptyTitle}
          </h3>
          <p className="text-muted-foreground">
            {emptyDescription}
          </p>
        </div>
      ) : (
        <div className={
          layout === 'horizontal' ? 'space-y-6' :
          layout === 'admin' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :
          gridColumns === 1 ? 'grid grid-cols-1 gap-6' :
          gridColumns === 3 ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' :
          'grid grid-cols-1 lg:grid-cols-2 gap-6'
        }>
          {filteredPosts.map((post, index) => 
            renderPost ? renderPost(post, index) : defaultRenderPost(post, index)
          )}
        </div>
      )}

      {/* Load More */}
      {filteredPosts.length > 0 && hasMore && onLoadMore && (
        <div className="flex justify-center mt-8">
          <LoadMoreButton 
            onClick={onLoadMore}
            disabled={!hasMore}
            loading={loadingMore}
          />
        </div>
      )}
    </div>
  );
};
