import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostActions } from "@/components/PostActions";
import { User } from "lucide-react";

export type FlatComment = {
  id: string;
  author: string;
  avatarUrl?: string | null;
  timeAgo: string;     // ej: "hace 40 min"
  content: string;
  dust?: number;       // contador DustPoint
  repliesCount?: number; // si quieres mostrar un número junto a "Responder"
};

type CommentRowProps = {
  c: FlatComment;
  onReply?: (c: FlatComment) => void;
  onReport?: (c: FlatComment) => void;
  className?: string;
};

export function CommentRow({ c, onReply, onReport, className }: CommentRowProps) {
  return (
    <div className={`py-5 ${className ?? ""}`}>
      {/* header */}
      <div className="flex items-center gap-3 mb-2">
        <Avatar className="h-8 w-8">
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
        size="sm"
        gapClass="gap-2"
        className="pl-11"
        showShare={false}
        initialDust={c.dust ?? 0}
        initialComments={c.repliesCount ?? 0}
        onCommentClick={() => onReply?.(c)}
        onReport={() => onReport?.(c)}
        tooltips={{ comments: "Responder", dust: "Dar DustPoint", report: "Denunciar comentario" }}
      />
    </div>
  );
}
