import { Search, Menu, User, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";
import UserMenu from "@/components/UserMenu";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import logoDark from "@/assets/logo_d.svg?url";
import logoLight from "@/assets/logo_l.svg?url";
import nameLogo from "@/assets/name_logo.svg?url";

// nuevos
import NotificationBell from "@/components/NotificationBell";
import WritePostButton from "@/components/WritePostButton";

const Header = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();

  const handleOpenLoginModal = () => {
    setAuthModalMode("login");
    setIsAuthModalOpen(true);
  };
  const handleOpenRegisterModal = () => {
    setAuthModalMode("register");
    setIsAuthModalOpen(true);
  };
  const handleCloseAuthModal = () => setIsAuthModalOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-1 pt-1">
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo + nombre */}
        <div onClick={() => navigate("/")} className="flex items-center gap-2 pl-2 cursor-pointer">
          <img
            src={theme === "dark" ? logoLight : logoDark}
            alt="Logo"
            className="h-9 w-9"
          />
          <img
            src={nameLogo}
            alt="DevBlog"
            className="h-7 w-auto hidden md:block"
            style={{
              filter: theme === "dark" ? "brightness(0) invert(1)" : "brightness(0) invert(0)"
            }}
          />
        </div>

        {/* Search (centrado y liviano) */}
        {user && (
          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar posts..."
                className="pl-10 rounded-xl bg-muted/50"
              />
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Admin link si aplica */}
              {user.role?.toLowerCase() === "admin" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin/users")}
                  className="hidden md:inline-flex items-center gap-2 rounded-xl"
                >
                  <Crown className="h-4 w-4" />
                  Admin
                </Button>
              )}

              {/* Campanita */}
              <NotificationBell count={2} size="md" />

              {/* Escribir Post (rediseñado) */}
              <WritePostButton icon="pen" />

              {/* User menu */}
              <UserMenu />
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="lg"
                className="hidden md:inline-flex rounded-xl"
                onClick={handleOpenLoginModal}
              >
                <User className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>

              <Button
                size="lg"
                className="bg-devtalles-gradient hover:opacity-90 text-white rounded-xl"
                onClick={handleOpenRegisterModal}
              >
                Unirse
              </Button>
            </>
          )}

          {/* Menú móvil */}
          <Button variant="ghost" size="icon" className="md:hidden rounded-xl">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onLogin={() => {}}
        initialMode={authModalMode}
      />
    </header>
  );
};

export default Header;
