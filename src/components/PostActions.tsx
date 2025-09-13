import { useMemo, useState } from "react";
import { Sparkles, MessageCircle, Share2, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils"; // si no tienes cn, cambia por template strings

type Size = "sm" | "md" | "lg";

type PostActionsProps = {
  // contadores
  initialDust?: number;
  initialComments?: number;
  initialShares?: number;

  // estados / callbacks
  defaultDustActive?: boolean;
  onCommentClick?: () => void;
  onReport?: () => void; // callback al denunciar

  // compartir
  shareUrl?: string;
  showShare?: boolean; // <- nuevo: mostrar/ocultar botón de compartir (default true)

  // UI
  size?: Size; // <- nuevo
  gapClass?: string; // <- nuevo (ej: "gap-1", "gap-3")
  className?: string; // <- nuevo
  tooltips?: {
    dust?: string;
    comments?: string;
    share?: string;
    reported?: string;
    report?: string;
  };
};

export function PostActions({
  initialDust = 0,
  initialComments = 0,
  initialShares = 0,
  defaultDustActive = false,
  onCommentClick,
  onReport,
  shareUrl,
  showShare = true,
  size = "md",
  gapClass = "gap-2",
  className,
  tooltips,
}: PostActionsProps) {
  const [dustActive, setDustActive] = useState(defaultDustActive);
  const [dustCount, setDustCount] = useState(initialDust);
  const [shareCount, setShareCount] = useState(initialShares);
  const [copied, setCopied] = useState(false);

  const url = useMemo(
    () => shareUrl ?? (typeof window !== "undefined" ? window.location.href : ""),
    [shareUrl]
  );

  const t = {
    dust: tooltips?.dust ?? "Dar DustPoint",
    comments: tooltips?.comments ?? "Ver comentarios",
    share: tooltips?.share ?? "Compartir",
    reported: tooltips?.reported ?? "Denuncia enviada",
    report: tooltips?.report ?? "Denunciar comentario",
  };

  const k = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `${n}`;

  const handleDustToggle = () => {
    setDustActive((prev) => {
      const next = !prev;
      setDustCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      return next;
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ url, title: document.title });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }
      setShareCount((c) => c + 1);
    } catch {
      // cancelado o error
    }
  };

  // tokens por tamaño
  const TOKENS: Record<
    Size,
    { pill: string; icon: string; text: string; height: string; px: string }
  > = {
    sm: {
      height: "h-8",
      px: "px-2.5",
      pill: "rounded-full bg-accent/50 hover:bg-accent text-foreground/90 shadow-sm",
      icon: "h-3.5 w-3.5",
      text: "text-xs",
    },
    md: {
      height: "h-9",
      px: "px-3",
      pill: "rounded-full bg-accent/50 hover:bg-accent text-foreground/90 shadow-sm",
      icon: "h-4 w-4",
      text: "text-sm",
    },
    lg: {
      height: "h-10",
      px: "px-3.5",
      pill: "rounded-full bg-accent/50 hover:bg-accent text-foreground shadow",
      icon: "h-4.5 w-4.5",
      text: "text-[0.95rem]",
    },
  };

  const S = TOKENS[size];

  const basePill = cn(S.height, S.px, "gap-2", S.pill, "transition-colors");
  const activeDust =
    "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20";

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn("flex items-center", gapClass, className)}>
        {/* DustPoint */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDustToggle}
              aria-pressed={dustActive}
              aria-label={t.dust}
              className={cn(basePill, dustActive && activeDust)}
            >
              <Sparkles className={S.icon} />
              <span className={S.text}>{k(dustCount)}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t.dust}</TooltipContent>
        </Tooltip>

        {/* Comentarios / Responder */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={onCommentClick}
              aria-label={t.comments}
              className={basePill}
            >
              <MessageCircle className={S.icon} />
              <span className={S.text}>{k(initialComments)}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t.comments}</TooltipContent>
        </Tooltip>

        {/* Compartir (opcional) */}
        {showShare && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleShare}
                aria-label={t.share}
                className={basePill}
              >
                <Share2 className={S.icon} />
                <span className={S.text}>{copied ? "Copiado" : k(shareCount)}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{copied ? "Enlace copiado" : t.share}</TooltipContent>
          </Tooltip>
        )}

        {/* Denunciar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              aria-label={t.report}
              className={basePill}
            >
              <Flag className={S.icon} />
              <span className={S.text}>Reportar</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[220px]">
            <DropdownMenuItem
              onClick={() => onReport?.()}
              className="cursor-pointer"
            >
              <Flag className="mr-2 h-4 w-4" />
              <span>Denunciar comentario</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1 text-xs text-muted-foreground">
              Usa esta opción para contenido ofensivo, spam o ilegal.
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}
