// components/comments/CommentsList.tsx
import { FlatComment, CommentRow } from "./CommentRow";

type CommentsListProps = {
  comments: FlatComment[];
  onReply?: (c: FlatComment) => void;
  onReport?: (c: FlatComment) => void;
};

export function CommentsList({ comments, onReply, onReport }: CommentsListProps) {
  return (
    <div className="space-y-0">
      {comments.map((c) => (
        <CommentRow
          key={c.id}
          c={c}
          onReply={onReply}
          onReport={onReport}
          className="border-b border-border/20 last:border-b-0"
        />
      ))}
    </div>
  );
}
