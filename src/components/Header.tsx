import { Search, Menu, User, PenTool, Trophy, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import AuthModal from "@/components/AuthModal";
import UserMenu from "@/components/UserMenu";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import logoDark from "@/assets/logo_d.svg?url";
import logoLight from "@/assets/logo_l.svg?url";
import nameLogo from "@/assets/name_logo.svg?url";

const Header = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  const handleOpenLoginModal = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenRegisterModal = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-1 pt-1">
      <div className="px-4 py-4 flex items-center justify-between">
        <div onClick={() => navigate("/")} className="flex items-center space-x-2 pl-4 cursor-pointer">
          <img
            src={theme === "dark" ? logoLight : logoDark}
            alt="Logo"
            className="h-11 w-11"
          />

          <img
            src={nameLogo}
            alt="DevBlog"
            className="h-8 w-auto"
            style={{
              filter: theme === "dark" ? "brightness(0) invert(1)" : "brightness(0) invert(0)"
            }}
          />
        </div>

        {user && (
          <>
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md">
              {/* <div> */}
              <div className="relative w-full">
                <Search className="absolute -left-25 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Buscar posts..."
                  className="pl-14 bg-muted/50 w-200 -ml-30"
                />
              </div>
            </div>
          </>
        )}

        {/* Navigation & Actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {user ? (
            <>
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-2">                
                {user.role?.toLowerCase() === 'admin' && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/admin/users")}
                    className="flex items-center gap-2"
                  >
                    <Crown className="h-4 w-4" />
                    Admin
                  </Button>
                )}
              </div>

              <Button 
                size="lg" 
                className="bg-devtalles-gradient hover:opacity-90 hidden md:flex rounded-xl"
                onClick={() => navigate("/create-post")}
              >
                <PenTool className="h-4 w-4 mr-2" />
                Escribir Post
              </Button>
              <UserMenu />
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="lg"
                className="hidden md:flex rounded-xl"
                onClick={handleOpenLoginModal}
              >
                <User className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>

              <Button
                size="lg"
                className="bg-devtalles-gradient hover:opacity-90 rounded-xl"
                onClick={handleOpenRegisterModal}
              >
                Unirse
              </Button>
            </>
          )}

          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onLogin={() => { }}
        initialMode={authModalMode}
      />
    </header>
  );
};

export default Header;