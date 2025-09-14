import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Bell, User, Code2 } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg">DevTalles</h1>
              <p className="text-xs text-muted-foreground -mt-1">Community</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar posts, tecnologías, usuarios..." 
              className="pl-10 transition-smooth focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="transition-smooth hover:bg-accent">
            <Bell className="h-4 w-4" />
          </Button>
          
          <Button className="gap-2 gradient-primary hover:opacity-90 transition-smooth">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nuevo Post</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="transition-smooth hover:bg-accent">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;