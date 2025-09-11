import { Search, Menu, User, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import AuthModal from "@/components/AuthModal";
import UserMenu from "@/components/UserMenu";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, isAuthenticated, login } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-1 pt-1">
      {/* clase container removida */}
      <div className="px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div onClick={() => navigate("/")} className="flex items-center space-x-2 pl-4 cursor-pointer">
          {/* <div className="bg-devtalles-gradient rounded-lg p-2"> */}
            <img src='./src/assets/DEVI LAPTOP BORDER.png' alt="Logo" className="h-11 w-11" /> {/* Aquí agregas tu imagen */}
          {/* </div> */}
          <span className="text-3xl font-bold bg-devtalles-gradient bg-clip-text text-transparent">
            DevBlog
          </span>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md absolute left-110">
          {/* <div> */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Buscar posts..."
              className="pl-14 bg-muted/50 w-200"
            />
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <Button size="sm" className="bg-devtalles-gradient hover:opacity-90 hidden md:flex rounded-2xl">
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
                className="hidden md:flex rounded-2xl"
                onClick={handleOpenAuthModal}
              >
                <User className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>

              <Button
                size="sm"
                className="bg-devtalles-gradient hover:opacity-90 rounded-2xl"
                onClick={handleOpenAuthModal}
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
        onLogin={login}
      />
    </header>
  );
};

export default Header;