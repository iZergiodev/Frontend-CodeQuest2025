import { Search, Menu, User, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import AuthModal from "@/components/AuthModal";
import UserMenu from "@/components/UserMenu";

const Header = () => {
  const { user, isAuthenticated, login } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="bg-devtalles-gradient rounded-lg p-2">
            <span className="text-white font-bold text-xl">DT</span>
          </div>
          <span className="text-2xl font-bold bg-devtalles-gradient bg-clip-text text-transparent">
            DevTalles Blog
          </span>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Buscar posts..." 
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Inicio
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Categorías
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Populares
            </a>
          </nav>
          
          <ThemeToggle />
          
          {isAuthenticated ? (
            <>
              <Button size="sm" className="bg-devtalles-gradient hover:opacity-90 hidden md:flex">
                <PenTool className="h-4 w-4 mr-2" />
                Escribir Post
              </Button>
              <UserMenu />
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex"
                onClick={handleOpenAuthModal}
              >
                <User className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>
              
              <Button 
                size="sm" 
                className="bg-devtalles-gradient hover:opacity-90"
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