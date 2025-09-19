// components/NotificationBell.tsx
import { Bell, Check, MessageSquare, Star, Trash2, Loader2 } from "lucide-react";
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
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

type BellSize = "md" | "lg";
type NotificationBellProps = { onOpenAll?: () => void; size?: BellSize };

const sizeMap: Record<BellSize, { btn: string; icon: string; badge: string }> = {
  md: { btn: "h-10 w-10", icon: "h-5 w-5", badge: "h-4 min-w-[1rem] text-[10px]" },
  lg: { btn: "h-11 w-11", icon: "h-6 w-6", badge: "h-4 min-w-[1.05rem] text-[10px]" },
};

export default function NotificationBell({ onOpenAll, size = "lg" }: NotificationBellProps) {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const hasUnread = unreadCount > 0;
  const sz = sizeMap[size];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Star className="h-4 w-4 mt-0.5 text-yellow-600" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 mt-0.5 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 mt-0.5 text-muted-foreground" />;
    }
  };

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
              {unreadCount > 9 ? "9+" : unreadCount}
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
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No hay notificaciones
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.slice(0, 10).map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={`px-4 py-3 ${!notification.isRead ? 'bg-accent' : ''}`}
                onSelect={() => !notification.isRead && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  {getNotificationIcon(notification.type)}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { 
                        addSuffix: true, 
                        locale: es 
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="px-4 py-3"
              onSelect={markAllAsRead}
            >
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4" />
                Marcar todo como leído
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
