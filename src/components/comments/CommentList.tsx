// components/comments/CommentsList.tsx
import { FlatComment, CommentRow } from "./CommentRow";

type CommentsListProps = {
  comments: FlatComment[];
  onReply?: (c: FlatComment) => void;
  onReport?: (c: FlatComment) => void;
};

export function CommentsList({ comments, onReply, onReport }: CommentsListProps) {
  return (
    // The parent container must be a flexbox column to ensure children grow properly.
    <div className="flex flex-col space-y-6">
      {comments.map((c) => (
        <CommentRow
          key={c.id}
          c={c}
          onReply={onReply}
          onReport={onReport}
          className="" // The bottom border and padding will be handled by the children.
        />
      ))}
    </div>
  );
}