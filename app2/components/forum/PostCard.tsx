import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, BookmarkPlus, MoreHorizontal } from "lucide-react";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  readTime: string;
  timeAgo: string;
  isLiked?: boolean;
}

const PostCard = ({ 
  title, 
  content, 
  author, 
  category, 
  tags, 
  likes, 
  comments, 
  readTime, 
  timeAgo,
  isLiked = false
}: PostCardProps) => {
  return (
    <article className="bg-card border rounded-xl p-6 transition-smooth hover:bg-card-hover shadow-card hover:shadow-elegant group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {author.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm">{author.name}</h4>
              <span className="text-muted-foreground text-sm">@{author.username}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {category}
              </Badge>
              <span>•</span>
              <span>{timeAgo}</span>
              <span>•</span>
              <span>{readTime} min de lectura</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-smooth">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2 leading-tight hover:text-primary cursor-pointer transition-smooth">
          {title}
        </h2>
        <p className="text-muted-foreground leading-relaxed line-clamp-3">
          {content}
        </p>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs px-2 py-1 hover:bg-primary/10 hover:border-primary/20 transition-smooth cursor-pointer"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-2 transition-smooth ${isLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likes}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="gap-2 transition-smooth hover:text-primary">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{comments}</span>
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 transition-smooth hover:text-primary">
            <BookmarkPlus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 transition-smooth hover:text-primary">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;