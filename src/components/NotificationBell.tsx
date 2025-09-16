// components/NotificationBell.tsx
import { Bell, Check, MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type BellSize = "md" | "lg";
type NotificationBellProps = { count?: number; onOpenAll?: () => void; size?: BellSize };

const sizeMap: Record<BellSize, { btn: string; icon: string; badge: string }> = {
  md: { btn: "h-10 w-10", icon: "h-5 w-5", badge: "h-4 min-w-[1rem] text-[10px]" },
  lg: { btn: "h-11 w-11", icon: "h-6 w-6", badge: "h-4 min-w-[1.05rem] text-[10px]" },
};

export default function NotificationBell({ count = 0, onOpenAll, size = "lg" }: NotificationBellProps) {
  const hasUnread = count > 0;
  const sz = sizeMap[size];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notificaciones"
          className={cn(
            "group relative rounded-xl transition-[background,box-shadow,transform,color] duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            "hover:bg-accent hover:text-accent-foreground active:scale-95",
            sz.btn
          )}
        >
          <Bell className={cn(sz.icon, "transition-colors group-hover:text-accent-foreground")} />
          {hasUnread && (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1 rounded-xl",
                "bg-red-500 text-white font-semibold shadow",
                "transition-transform group-active:scale-95",
                sz.badge
              )}
            >
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden">
        <DropdownMenuLabel className="py-3 px-4 flex items-center justify-between">
          <span className="text-sm font-medium">Notificaciones</span>
          {hasUnread && (
            <button onClick={onOpenAll} className="text-xs text-primary hover:underline">
              Ver todo
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="px-4 py-3">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-sm">Nueva respuesta en <span className="font-medium">“Mi setup de React 2025”</span></p>
              <p className="text-xs text-muted-foreground">hace 5 min</p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="px-4 py-3">
          <div className="flex items-start gap-3">
            <Star className="h-4 w-4 mt-0.5 text-yellow-600" />
            <div className="min-w-0">
              <p className="text-sm">Tu post recibió 10 upvotes</p>
              <p className="text-xs text-muted-foreground">hace 1 h</p>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4" />
            Marcar todo como leído
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
