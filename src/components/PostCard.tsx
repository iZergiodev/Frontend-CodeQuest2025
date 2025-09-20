import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Heart, MessageSquare, User, Bookmark, Share2, TrendingUp, Star, Eye } from "lucide-react";
import type { Post } from "@/types/blog";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { bookmarkService } from "@/services/bookmarkService";
import { useToast } from "@/hooks/use-toast";

interface PostCardProps {
  post: Post;
  onTagClick?: (tag: string) => void;
  layout?: 'default' | 'horizontal';
  compact?: boolean;
  showTrendingMetrics?: boolean;
  showPopularityMetrics?: boolean;
  trendingScore?: number;
  popularityScore?: number;
  showCategoriesAbove?: boolean;
  recentActivity?: {
    likes: number;
    comments: number;
    views: number;
    lastActivity: string;
  };
}

export function PostCard({ 
  post, 
  onTagClick, 
  layout = 'default', 
  compact = false,
  showTrendingMetrics = false,
  showPopularityMetrics = false,
  trendingScore = 0,
  popularityScore = 0,
  showCategoriesAbove = false,
}: PostCardProps) {
  const navigate = useNavigate();
  const [showAllTags, setShowAllTags] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadBookmarkStatus();
    }
  }, [user, post.id]);

  const loadBookmarkStatus = async () => {
    try {
      const response = await bookmarkService.getBookmarkStatus(post.id);
      setIsBookmarked(response.isBookmarked);
    } catch (error) {
      console.error('Error loading bookmark status:', error);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Acceso requerido",
        description: "Debes iniciar sesión para guardar posts.",
        variant: "destructive",
      });
      return;
    }

    setBookmarkLoading(true);
    try {
      const response = await bookmarkService.toggleBookmark(post.id);
      setIsBookmarked(response.isBookmarked);
      
      toast({
        title: response.isBookmarked ? "Post guardado" : "Post eliminado de guardados",
        description: response.isBookmarked 
          ? "El post se ha guardado en tus marcadores." 
          : "El post se ha eliminado de tus marcadores.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo completar la acción.",
        variant: "destructive",
      });
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  // Reusable components
  const AuthorInfo = () => (
    <div className="flex items-center space-x-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={post.authorAvatar} alt={post.authorName} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {post.authorName?.charAt(0) || <User className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{post.authorName}</p>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{new Date(post.createdAt).toLocaleDateString("es-ES")}</span>
          <Clock className="h-3 w-3 ml-2" />
          <span>{post.readTime} min</span>
        </div>
      </div>
    </div>
  );

  const TitleAndExcerpt = () => (
    <>
      <h3 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
        {post.title}
      </h3>
      <p className="text-muted-foreground line-clamp-2">
        {post.excerpt}
      </p>
    </>
  );

  const CategoryBadges = () => (
    <div className="flex flex-wrap gap-2">
      <Badge 
        variant="secondary" 
        className="bg-background/90 text-foreground backdrop-blur-sm border border-border/50 text-sm font-medium"
      >
        <div
          className="w-2 h-2 rounded-full mr-2"
          style={{ backgroundColor: post.category.color }}
        />
        {post.category.name}
      </Badge>
      {post.subcategory && (
        <Badge 
          variant="outline" 
          className="bg-background/90 text-foreground backdrop-blur-sm border border-border/50 text-xs"
        >
          <div
            className="w-1.5 h-1.5 rounded-full mr-1.5"
            style={{ backgroundColor: post.subcategory.color }}
          />
          {post.subcategory.name}
        </Badge>
      )}
    </div>
  );

  const Tags = () => (
    post.tags && post.tags.length > 0 && (
      <div className="flex flex-wrap gap-1">
        {(showAllTags ? post.tags : post.tags.slice(0, 3)).map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="text-xs cursor-pointer py-1 px-4 dark:hover:bg-indigo-950 hover:bg-violet-200 hover:border-violet-400 dark:hover:border-indigo-800 transition-colors"
            onClick={() => onTagClick?.(tag)}
          >
            {tag}
          </Badge>
        ))}
        {post.tags.length > 3 && !showAllTags && (
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => setShowAllTags(true)}
          >
            +{post.tags.length - 3}
          </Badge>
        )}
        {post.tags.length > 3 && showAllTags && (
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => setShowAllTags(false)}
          >
            Ver menos
          </Badge>
        )}
      </div>
    )
  );

  const CoverImage = ({ className = "" }: { className?: string }) => (
    <div className={`relative overflow-hidden ${className}`}>
      {post.coverImage ? (
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-devtalles-blue via-devtalles-purple to-devtalles-blue flex items-center justify-center">
          <div className="text-center text-white/80">
            <div className="text-4xl font-bold mb-2">DevTalles</div>
            <div className="text-sm opacity-75">Blog de Programación</div>
          </div>
        </div>
      )}
      
      {!showCategoriesAbove && (
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <Badge 
            variant="secondary" 
            className="bg-background/90 text-foreground backdrop-blur-sm border border-border/50 text-sm font-medium"
          >
            <div
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: post.category.color }}
            />
            {post.category.name}
          </Badge>
          {post.subcategory && (
            <Badge 
              variant="outline" 
              className="bg-background/90 text-foreground backdrop-blur-sm border border-border/50 text-xs"
            >
              <div
                className="w-1.5 h-1.5 rounded-full mr-1.5"
                style={{ backgroundColor: post.subcategory.color }}
              />
              {post.subcategory.name}
            </Badge>
          )}
        </div>
      )}
      
      {post.featured && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-gradient-to-r from-devtalles-blue to-devtalles-purple">
            Destacado
          </Badge>
        </div>
      )}
    </div>
  );

  const EngagementMetrics = () => {
    if (!showTrendingMetrics && !showPopularityMetrics) return null;

    return (
      <div className="space-y-2">
        {showTrendingMetrics && (
          <div className="flex items-center gap-1 text-orange-600 text-xs">
            <TrendingUp className="h-3 w-3" />
            <span className="font-medium">Trending: {trendingScore.toFixed(1)}</span>
          </div>
        )}
        
        {showPopularityMetrics && (
          <div className="flex items-center gap-1 text-yellow-600 text-xs">
            <Star className="h-3 w-3" />
            <span className="font-medium">Popularity: {popularityScore.toFixed(1)}</span>
          </div>
        )}
      </div>
    );
  };

  const Footer = () => (
    <div className="flex flex-col space-y-3 px-6 py-4 border-t">
      <EngagementMetrics />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span>{post.likesCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.commentsCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{post.visitsCount}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {user && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 w-8"
                onClick={handleBookmark}
                disabled={bookmarkLoading}
              >
                <Bookmark 
                  className={`h-4 w-4 transition-colors ${
                    isBookmarked 
                      ? "fill-current text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  } ${bookmarkLoading ? "opacity-50" : ""}`} 
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-8 w-8"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={() => navigate(`/post/${post.slug}`)}>
            {compact ? "Ver →" : "Leer más →"}
          </Button>
        </div>
      </div>
    </div>
  );

  if (layout === 'horizontal') {
    return (
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-post-hover hover:-translate-y-1 flex flex-col h-full">
        <div className="flex flex-1">
          <div className="flex-1 flex flex-col p-6">
            {showCategoriesAbove && (
              <div className="mb-4">
                <CategoryBadges />
              </div>
            )}
            <div className="space-y-3 flex-1">
              <AuthorInfo />
              <TitleAndExcerpt />
              <Tags />
            </div>
          </div>
          <div className="relative">
            <CoverImage className="w-48 flex-shrink-0 h-full" />
            {!showCategoriesAbove && (
              <div className="absolute top-4 left-4">
                <CategoryBadges />
              </div>
            )}
          </div>
        </div>
        <Footer />
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-post-hover hover:-translate-y-1 flex flex-col h-full">
      <div className="relative">
        <CoverImage className="h-48 w-full" />
        {showCategoriesAbove && (
          <div className="absolute top-4 left-4 z-10">
            <CategoryBadges />
          </div>
        )}
      </div>
      
      <CardHeader className="space-y-3 flex-1">
        <AuthorInfo />
        <TitleAndExcerpt />
      </CardHeader>

      <CardContent className="space-y-4">
        <Tags />
      </CardContent>

      <Footer />
    </Card>
  );
}