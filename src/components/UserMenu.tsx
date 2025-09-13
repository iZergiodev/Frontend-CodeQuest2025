import { LogOut, Settings, BookOpen, Heart, Star, User, Crown, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.displayName || 'User'} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
              {user.role?.toLowerCase() === 'admin' && (
                <Crown className="h-3 w-3 text-red-500" />
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email || 'No email'}
            </p>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-yellow-600">
                <Star className="h-3 w-3" />
                <span>{user.starDustPoints} StarDust</span>
              </div>
              {user.discordId && (
                <span className="text-[#5865F2]">• Discord</span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Mi Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Mis Posts</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Heart className="mr-2 h-4 w-4" />
          <span>Posts Guardados</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;