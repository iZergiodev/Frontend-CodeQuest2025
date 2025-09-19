// components/NotificationBell.tsx
import { Bell, Check, MessageSquare, Star, Trash2, Loader2, Heart } from "lucide-react";
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
import { useState, useEffect } from "react";

type BellSize = "md" | "lg";
type NotificationBellProps = { onOpenAll?: () => void; size?: BellSize };

const sizeMap: Record<BellSize, { btn: string; icon: string; badge: string }> = {
  md: { btn: "h-10 w-10", icon: "h-5 w-5", badge: "h-4 min-w-[1rem] text-[10px]" },
  lg: { btn: "h-11 w-11", icon: "h-6 w-6", badge: "h-4 min-w-[1.05rem] text-[10px]" },
};

export default function NotificationBell({ onOpenAll, size = "lg" }: NotificationBellProps) {
  const { notifications, unreadCount, isLoading, error, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications, refreshNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [sseStatus, setSseStatus] = useState('disconnected');
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);
  const hasUnread = unreadCount > 0;
  const sz = sizeMap[size];

  // Refresh notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to avoid rapid API calls
      const timeoutId = setTimeout(() => {
        refreshNotifications();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, refreshNotifications]);

  // Monitor SSE connection status
  useEffect(() => {
    const checkConnection = () => {
      if (notifications.length > 0 || !error) {
        setSseStatus('connected');
      } else {
        setSseStatus('disconnected');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    
    return () => clearInterval(interval);
  }, [notifications.length, error]);

  useEffect(() => {
    if (isOpen && notifications.length > lastNotificationCount) {
      const newCount = notifications.length - lastNotificationCount;
      setNewNotificationCount(prev => prev + newCount);
      
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }
      
      const timeoutId = setTimeout(() => {
        setNewNotificationCount(0);
      }, 3000);
      
      return () => clearTimeout(timeoutId);
    }
    
    setLastNotificationCount(notifications.length);
  }, [notifications.length, isOpen, lastNotificationCount]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 mt-0.5 text-red-600" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 mt-0.5 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 mt-0.5 text-muted-foreground" />;
    }
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
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
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Notificaciones</span>
              <div className={`w-2 h-2 rounded-full ${
                sseStatus === 'connected' ? 'bg-green-500' : 
                sseStatus === 'connecting' ? 'bg-yellow-500' : 
                'bg-red-500'
              }`} title={`SSE: ${sseStatus}`} />
              {newNotificationCount > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-xs text-blue-500 font-medium">
                    +{newNotificationCount} nueva{newNotificationCount > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => refreshNotifications()} 
              className={`flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-all duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Actualizar notificaciones"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <span>↻</span>}
            </button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">Cargando...</span>
          </div>
        ) : error ? (
          <div className="px-4 py-8 text-center text-sm text-red-500">
            <p>Error al cargar notificaciones</p>
            <p className="text-xs text-muted-foreground mt-1">
              {error.message}
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No hay notificaciones
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.slice(0, 10).map((notification, index) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={`px-4 py-3 group cursor-pointer transition-all duration-300 ${
                  !notification.isRead ? 'bg-violet-200 dark:bg-indigo-950 border-l-2 border-l-primary' : 'hover:bg-violet-300 dark:hover:bg-indigo-900'
                }`}
                onSelect={() => !notification.isRead && markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="relative">
                    {getNotificationIcon(notification.type)}
                    {!notification.isRead && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <span className="text-xs text-primary font-medium">Nuevo</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { 
                        addSuffix: true, 
                        locale: es 
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        title="Marcar como leído"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      title="Eliminar notificación"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
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
            <DropdownMenuItem 
              className="px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              onSelect={deleteAllNotifications}
            >
              <div className="flex items-center gap-2 text-sm">
                <Trash2 className="h-4 w-4" />
                Eliminar todas las notificaciones
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
