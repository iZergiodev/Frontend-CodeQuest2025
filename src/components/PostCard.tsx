import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Heart, MessageSquare, User } from "lucide-react";
import type { Post } from "@/types/blog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface PostCardProps {
  post: Post;
  onTagClick?: (tag: string) => void;
}

export function PostCard({ post, onTagClick }: PostCardProps) {
  const navigate = useNavigate();
  const [showAllTags, setShowAllTags] = useState(false);
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-post-hover hover:-translate-y-1 flex flex-col h-full">
      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <Badge 
              variant="secondary" 
              className="bg-background/90 text-foreground backdrop-blur-sm border border-border/50"
            >
              <div
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: post.category.color }}
              />
              {post.category.name}
            </Badge>
          </div>
          {post.featured && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-devtalles-blue to-devtalles-purple">
                Destacado
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="space-y-3 flex-1">
        {/* Author info */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.avatar} alt={post.author.displayName} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{post.author.displayName}</p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(post.createdAt).toLocaleDateString("es-ES")}</span>
              <Clock className="h-3 w-3 ml-2" />
              <span>{post.readTime} min</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {(showAllTags ? post.tags : post.tags.slice(0, 3)).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
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
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t">
        {/* Engagement metrics */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments.length}</span>
          </div>
        </div>

        {/* Read more button */}
        <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={() => navigate(`/post/${post.slug}`)}>
          Leer más →
        </Button>
      </CardFooter>
    </Card>
  );
}