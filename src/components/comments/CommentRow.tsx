// components/comments/CommentRow.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostActions } from "@/components/PostActions";
import { User } from "lucide-react";
import { useToggleCommentLike } from "@/services/likesService";

export type FlatComment = {
  id: string;
  author: string;
  avatarUrl?: string | null;
  timeAgo: string;
  content: string;
  dust?: number;
  likesCount?: number;
  repliesCount?: number;
  parentId?: number;
  replies?: FlatComment[];
  level?: number;
  isLikedByUser?: boolean;
};

type CommentRowProps = {
  c: FlatComment;
  onReply?: (c: FlatComment) => void;
  onReport?: (c: FlatComment) => void;
  className?: string;
  isLastReply?: boolean; // New prop to determine if the line should be hidden
};

export function CommentRow({ c, onReply, onReport, className, isLastReply }: CommentRowProps) {
  const level = c.level || 0;
  const maxLevel = 6;

  const toggleCommentLikeMutation = useToggleCommentLike();

  const handleLike = async () => {
    const commentId = parseInt(c.id);
    await toggleCommentLikeMutation.mutateAsync(commentId);
  };

  return (
    <div className={`flex ${className ?? ""}`}>
      {/* Container for Avatar and the vertical line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <Avatar className="h-8 w-8 z-10">
          {c.avatarUrl ? (
            <AvatarImage src={c.avatarUrl} alt={c.author} />
          ) : (
            <AvatarFallback className="bg-muted">
              <User className="h-4 w-4" />
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      <div className="ml-3 flex-grow">
        <div className="relative">
          {c.replies && c.replies.length > 0 && (
            <div className="absolute z-0 -left-[30px] top-5 h-full w-0.25 bg-gray-300 dark:bg-gray-600"></div>
          )}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-semibold text-sm">{c.author}</span>
            <span className="text-xs text-muted-foreground">{c.timeAgo}</span>
          </div>
          <div className="text-sm leading-6 text-foreground mb-3 whitespace-pre-wrap">
            {c.content}
          </div>
          <PostActions
            context="comment"
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
         {c.replies && c.replies.length > 0 && level < maxLevel && (
           <div className="mt-4 relative">
             {c.replies.map((reply, index, array) => {
               const replyIsLast = index === array.length - 1;
               return (
                   <div key={reply.id} className="relative">
                    {/* this is the vertical line */}
                    {!replyIsLast && (
                      <div className="absolute -left-[30px] -bottom-5 h-[110%] w-0.25 bg-gray-300 dark:bg-gray-600"></div>
                    )}

                    {/* Curved L-shaped connector */}
                    <div className="absolute -left-[30px] -top-2 h-6 w-8 border-l border-b rounded-bl-2xl border-gray-300 dark:border-gray-600"></div>
                   
                   <CommentRow
                     c={{ ...reply, level: level + 1 }}
                     onReply={onReply}
                     onReport={onReport}
                     className="mt-4 first:mt-0"
                     isLastReply={replyIsLast} // Pass the new prop
                   />
                 </div>
               );
             })}
           </div>
         )}
      </div>
    </div>
  );
}