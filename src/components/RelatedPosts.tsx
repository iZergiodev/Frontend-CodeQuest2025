import { useRelatedPosts } from "@/services/postsService";
import { PostCard } from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RelatedPostsProps {
  postId: string;
  limit?: number;
  className?: string;
}

export function RelatedPosts({ postId, limit = 5, className = "" }: RelatedPostsProps) {
  const { data: relatedPosts = [], isLoading, error } = useRelatedPosts(postId, limit);
  const navigate = useNavigate();

  const handlePostClick = (postSlug: string) => {
    navigate(`/post/${postSlug}`);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Posts Relacionados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="rounded-lg border border-border overflow-hidden">
              <Skeleton className="h-20 w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return null;
  }

  if (relatedPosts.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Posts Relacionados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No se encontraron posts relacionados por tags, subcategoría o categoría.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Posts Relacionados
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {relatedPosts.map((post) => (
          <div key={post.id} className="transform transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-md">
            <div 
              className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => handlePostClick(post.slug)}
            >
              {/* Image banner */}
              <div className="w-full h-20 overflow-hidden">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-devtalles-blue via-devtalles-purple to-devtalles-blue flex items-center justify-center">
                    <div className="text-center text-white/80">
                      <div className="text-sm font-bold">DevTalles</div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-3 space-y-2">
                {/* Author info */}
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span className="font-medium">{post.authorName}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString("es-ES")}</span>
                  <span>•</span>
                  <span>{post.readTime} min</span>
                </div>
                
                {/* Full title */}
                <h4 className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
                
                {/* Excerpt */}
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-md">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
