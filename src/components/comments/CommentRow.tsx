import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostActions } from "@/components/PostActions";
import { User } from "lucide-react";
import { useToggleCommentLike } from "@/services/likesService";

export type FlatComment = {
  id: string;
  author: string;
  avatarUrl?: string | null;
  timeAgo: string;     // ej: "hace 40 min"
  content: string;
  dust?: number;       // contador DustPoint (legacy)
  likesCount?: number; // contador de likes
  repliesCount?: number; // si quieres mostrar un número junto a "Responder"
  parentId?: number;   // for nested comments
  replies?: FlatComment[]; // nested replies
  level?: number;      // nesting level for indentation
  isLikedByUser?: boolean; // whether current user has liked this comment
};

type CommentRowProps = {
  c: FlatComment;
  onReply?: (c: FlatComment) => void;
  onReport?: (c: FlatComment) => void;
  className?: string;
};

export function CommentRow({ c, onReply, onReport, className }: CommentRowProps) {
  const level = c.level || 0;
  const maxLevel = 6; // Increased max level for deeper nesting
  const isMaxLevel = level >= maxLevel;
  
  const toggleCommentLikeMutation = useToggleCommentLike();

  const handleLike = async () => {
    const commentId = parseInt(c.id);
    await toggleCommentLikeMutation.mutateAsync(commentId);
  };
  
  // Calculate indentation based on level (Reddit style)
  const leftPadding = Math.min(level * 24, maxLevel * 24); // 24px per level like Reddit
  const lineWidth = 1; // Thinner line like Reddit
  const lineOffset = leftPadding - 12; // Position of the connecting line

  return (
    <div className={`relative ${className ?? ""}`}>
      {/* Main comment */}
      <div className={`py-3 ${isMaxLevel ? 'pl-0' : ''}`} style={{ paddingLeft: isMaxLevel ? 0 : `${leftPadding}px` }}>
        {/* Reddit-style connecting lines */}
        {level > 0 && (
          <>
            {/* Vertical line extending down from parent */}
            <div 
              className="absolute left-0 top-0 w-px bg-border/40"
              style={{
                left: `${lineOffset}px`,
                width: '1px',
                height: '100%'
              }}
            />
            {/* Horizontal line connecting to avatar */}
            <div 
              className="absolute left-0 w-3 h-px bg-border/40"
              style={{
                left: `${lineOffset}px`,
                top: '20px', // Align with avatar center
                width: '12px'
              }}
            />
          </>
        )}

        {/* header */}
        <div className="flex items-center gap-3 mb-2 relative">
          <Avatar className="h-8 w-8 relative z-10">
            {c.avatarUrl ? (
              <AvatarImage src={c.avatarUrl} alt={c.author} />
            ) : (
              <AvatarFallback className="bg-muted">
                <User className="h-4 w-4" />
              </AvatarFallback>
            )}
          </Avatar>

          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold truncate">{c.author}</span>
              <span className="text-xs text-muted-foreground">{c.timeAgo}</span>
            </div>
          </div>
        </div>

        {/* texto (sin bordes) */}
        <div className="pl-11 text-sm leading-6 text-foreground mb-3 whitespace-pre-wrap">
          {c.content}
        </div>

        {/* acciones: DustPoint + Responder + Reportar (sin compartir por defecto) */}
        <PostActions
          context="comment"
          className="pl-10"
          // showLabels
          showSave={false}
          showShare={false}
          variant="ghost"
          size="sm"
          gapClass="gap-2"
          initialLikes={c.dust ?? 0}
          initialComments={c.repliesCount ?? 0}
          defaultLikesActive={c.isLikedByUser}
          onLikeToggle={handleLike}
          onCommentClick={() => onReply?.(c)}
          onReport={() => onReport?.(c)}
        />
      </div>

      {/* Render replies if they exist and we haven't reached max level */}
      {c.replies && c.replies.length > 0 && !isMaxLevel && (
        <div className="relative">
          <div className="space-y-0">
            {c.replies.map((reply, index) => (
              <CommentRow
                key={reply.id}
                c={{ ...reply, level: level + 1 }}
                onReply={onReply}
                onReport={onReport}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
