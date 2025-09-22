import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  LogOut,
  Settings,
  User2,
  Moon,
  Stars,
  Crown,
} from "lucide-react";
import { useMemo } from "react";

type MenuRowProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  right?: React.ReactNode; // para el switch del dark mode
  asItem?: boolean;        // usa DropdownMenuItem (true) o un <div> custom
};

const MenuRow = ({ icon, label, onClick, right, asItem = true }: MenuRowProps) => {
  const base =
    "mx-1 rounded-xl px-3 py-2 h-10 flex items-center justify-between gap-3";
  const left =
    "flex min-w-0 items-center gap-2 text-sm leading-none text-foreground";
  const rightCls = "shrink-0 ml-2";

  if (asItem) {
    return (
      <DropdownMenuItem
        onClick={onClick}
        className={`${base} cursor-pointer hover:bg-muted focus:bg-muted`}
      >
        <div className={left}>
          <span className="shrink-0">{icon}</span>
          <span className="truncate">{label}</span>
        </div>
        {right && <div className={rightCls}>{right}</div>}
      </DropdownMenuItem>
    );
  }
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      className={`${base} cursor-pointer hover:bg-muted focus:bg-muted focus:outline-none`}
    >
      <div className={left}>
        <span className="shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      {right && <div className={rightCls}>{right}</div>}
    </div>
  );
};

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme, resolvedTheme, setTheme } = useTheme();

  if (!user) return null;

  const isDark = (resolvedTheme ?? theme) === "dark";

  const initials = useMemo(() => {
    const name = user.name || "User";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user.name]);

  const handleLogout = () => {
    logout();
    toast({ title: "Sesión cerrada", description: "Has cerrado sesión exitosamente." });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:bg-muted/60"
          aria-label="Abrir menú de usuario"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name || "User"} />
            <AvatarFallback className="bg-primary/90 text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={15}
        forceMount
        className="w-70 p-0 overflow-hidden rounded-2xl shadow-xl ring-1 ring-border/60 bg-popover"
      >
        {/* Header */}
        <div className="relative">
          <div
            aria-hidden
            className="h-10 w-full bg-[radial-gradient(120%_100%_at_0%_0%,hsl(var(--primary)/.25),transparent_60%)] dark:bg-[radial-gradient(120%_100%_at_0%_0%,hsl(var(--primary)/.35),transparent_60%)]"
          />
          <div className="px-4 pb-3">
            <div className="flex items-center gap-3">
              <div>
                <Avatar className="h-14 w-14 ring-2 ring-background shadow-sm">
                  <AvatarImage src={user.avatar} alt={user.name || "User"} />
                  <AvatarFallback className="bg-primary/90 text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold leading-none truncate">
                    {user.name || "User"}
                  </p>
                  {user.role?.toLowerCase() === 'admin' && (
                    <Crown className="h-3 w-3 text-yellow-500 fill-current" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {user.discordId ? user.discordUsername : user.email}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]">
                    <Stars className="h-3 w-3 text-yellow-500" />
                    <span className="font-medium">
                      {user.starDustPoints ?? 0} Stardust
                    </span>
                  </span>
                  {!!user.discordId && (
                    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#5865F2]" />
                      <span>Discord</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Filas alineadas: Mi Perfil / Dark Mode / Configuración */}
        <MenuRow
          icon={<User2 className="h-4 w-4" />}
          label="Mi Perfil"
          onClick={() => navigate("/profile")}
        />

        {/* Admin Panel - only for admin users */}
        {user.role?.toLowerCase() === 'admin' && (
          <MenuRow
            icon={<Crown className="h-4 w-4 text-yellow-500 fill-current" />}
            label="Panel de Administración"
            onClick={() => navigate("/admin")}
          />
        )}

        {/* Dark Mode: mantenemos mismo alto/estructura con right element */}
        <MenuRow
          icon={<Moon className="h-4 w-4" />}
          label="Dark Mode"
          asItem={false} // usamos <div> para no disparar onClick en el switch
          right={
            <Switch
              checked={isDark}
              onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
              aria-label="Cambiar tema"
            />
          }
          // click en la fila también toggles el switch
          onClick={() => setTheme(isDark ? "light" : "dark")}
        />

        <MenuRow
          icon={<Settings className="h-4 w-4" />}
          label="Configuración"
          onClick={() => navigate("/settings")}
        />


        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            handleLogout()
            navigate("/");
          }}
          className="mx-1 my-1.5 rounded-xl px-3 py-2 h-10 text-red-600 focus:text-red-600 hover:bg-red-600/10 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
