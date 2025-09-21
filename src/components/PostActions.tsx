// components/PostActions.tsx
import { useMemo, useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark,
  BookmarkCheck,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type Size = "sm" | "md" | "lg";
type Variant = "pill" | "ghost"; // pill = con fondo/borde; ghost = solo en hover

type PostActionsProps = {
  // contadores
  initialLikes?: number;
  initialComments?: number;
  initialShares?: number;
  initialSaves?: number;

  // estados / callbacks
  defaultLikesActive?: boolean;
  defaultSavedActive?: boolean;
  onCommentClick?: () => void;
  onReport?: () => void;
  onSaveToggle?: (saved: boolean) => void;
  onLikeToggle?: () => void;

  // compartir
  shareUrl?: string;

  // visibilidad
  showShare?: boolean; // default: true
  showSave?: boolean;  // default: context === "post"
  context?: "post" | "comment";

  // UI
  size?: Size;                // sm | md | lg
  gapClass?: string;          // ej: "gap-1.5"
  className?: string;
  variant?: Variant;          // "pill" | "ghost"
  showLabels?: boolean;       // mostrar nombres junto a los íconos

  tooltips?: {
    likes?: string;
    comments?: string;
    save?: string;
    share?: string;
    more?: string;
  };
};

export function PostActions({
  // data
  initialLikes = 0,
  initialComments = 0,
  initialShares = 0,
  initialSaves = 0,
  defaultLikesActive = false,
  defaultSavedActive = false,
  // callbacks
  onCommentClick,
  onReport,
  onSaveToggle,
  onLikeToggle,
  // share
  shareUrl,
  // visibility
  context = "post",
  showShare = true,
  showSave, // si no se pasa, depende del context
  // UI
  size = "md",
  gapClass = "gap-2",
  className,
  variant = "pill",
  showLabels = false,
  tooltips,
}: PostActionsProps) {
  const [likesActive, setLikesActive] = useState(defaultLikesActive);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const [saved, setSaved] = useState(defaultSavedActive);
  const [saveCount, setSaveCount] = useState(initialSaves);

  const [shareCount, setShareCount] = useState(initialShares);
  const [copied, setCopied] = useState(false);

  // Sync internal state with prop changes
  useEffect(() => {
    setSaved(defaultSavedActive);
  }, [defaultSavedActive]);

  useEffect(() => {
    setLikesActive(defaultLikesActive);
  }, [defaultLikesActive]);

  useEffect(() => {
    setLikesCount(initialLikes);
  }, [initialLikes]);

  const url = useMemo(
    () => shareUrl ?? (typeof window !== "undefined" ? window.location.href : ""),
    [shareUrl]
  );

  const t = {
    likes: tooltips?.likes ?? "Dar Like",
    comments: tooltips?.comments ?? "Comentar",
    save: tooltips?.save ?? "Guardar",
    share: tooltips?.share ?? "Compartir",
    more: tooltips?.more ?? "Más opciones",
  };

  const k = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `${n}`;

  // toggles
  const toggleLikes = () => {
    if (onLikeToggle) {
      // Don't do optimistic updates when using external callbacks
      // Let the external callback (React Query mutation) handle the optimistic updates
      onLikeToggle();
    } else {
      // Only do optimistic updates when no external callback is provided
      setLikesActive((prev) => {
        const next = !prev;
        setLikesCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
        return next;
      });
    }
  };

  const toggleSave = () => {
    setSaved((prev) => {
      const next = !prev;
      setSaveCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      onSaveToggle?.(next);
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
      // cancelado
    }
  };

  // tokens por tamaño
  const TOKENS: Record<
    Size,
    { height: string; px: string; icon: string; text: string }
  > = {
    sm: { height: "h-8", px: "px-2.5", icon: "h-3.5 w-3.5", text: "text-xs" },
    md: { height: "h-9", px: "px-3", icon: "h-4 w-4", text: "text-sm" },
    lg: { height: "h-10", px: "px-3.5", icon: "h-5 w-5", text: "text-[0.95rem]" },
  };
  const S = TOKENS[size];

  // estilos base
  const pillBase =
    "rounded-full transition-colors inline-flex items-center justify-center gap-2";
  const pillVariant =
    variant === "pill"
      ? "bg-accent/50 hover:bg-accent text-foreground/90 shadow-sm border border-transparent"
      : "bg-transparent border border-transparent hover:bg-accent/40 hover:border-muted/40 text-muted-foreground";

  const baseBtn = cn(S.height, S.px, pillBase, pillVariant);

  const activeLikes = "";
  const activeSave = "";

  const _showSave = showSave ?? context === "post";

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn("flex items-center w-full", className)}>
        {/* grupo izquierdo */}
        <div className={cn("flex items-center", gapClass)}>
          {/* Likes */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleLikes}
                aria-pressed={likesActive}
                aria-label={t.likes}
                className={cn(baseBtn, likesActive && activeLikes)}
              >
                <Heart className={cn(S.icon, likesActive && "fill-current text-red-500")} />
                {showLabels && <span className={S.text}>Like</span>}
                <span className={S.text}>{k(likesCount)}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t.likes}</TooltipContent>
          </Tooltip>

          {/* Comentar */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={onCommentClick}
                aria-label={t.comments}
                className={baseBtn}
              >
                <MessageCircle className={S.icon} />
                {showLabels && <span className={S.text}>Comentar</span>}
                <span className={S.text}>{k(initialComments)}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t.comments}</TooltipContent>
          </Tooltip>

          {/* Guardar (solo en Post) */}
          {_showSave && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleSave}
                  aria-pressed={saved}
                  aria-label={t.save}
                  className={cn(baseBtn, saved && activeSave)}
                >
                  {saved ? (
                    <BookmarkCheck className={cn(S.icon, "fill-current text-indigo-900")} />
                  ) : (
                    <Bookmark className={S.icon} />
                  )}
                  {showLabels && <span className={S.text}>Guardar</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t.save}</TooltipContent>
            </Tooltip>
          )}

          {/* Compartir (opcional) */}
          {showShare && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleShare}
                  aria-label={t.share}
                  className={baseBtn}
                >
                  <Share2 className={S.icon} />
                  {showLabels && <span className={S.text}>Compartir</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{copied ? "Enlace copiado" : t.share}</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* grupo derecho: 3 puntos (reportar) */}
        <div className="ml-auto">
          <DropdownMenu>
            {/* Tooltip alrededor del trigger */}
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label={t.more}
                    className={baseBtn}
                  >
                    <MoreHorizontal className={S.icon} />
                    {/* sin label por requerimiento */}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>{t.more}</TooltipContent>
            </Tooltip>

            <DropdownMenuContent
              align="end"            // aparece pegado a la derecha
              sideOffset={6}
              className="min-w-[220px]"
            >
              <DropdownMenuItem
                onClick={() => onReport?.()}
                className="cursor-pointer"
              >
                <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
                  {/* puedes usar Flag si prefieres, dejo los 3 puntos para consistencia visual */}
                  <Flag className="h-4 w-4" />
                </span>
                <span>Denunciar</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <div className="px-2 py-1 text-xs text-muted-foreground">
                Usa esta opción para contenido ofensivo, spam o ilegal.
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
}
