import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  TrendingUp,
  Code,
  Database,
  Globe,
  Smartphone,
  Brain,
  Users,
  BookOpen,
  Trophy,
  Calendar,
  Menu,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";


const categories = [
  { icon: Home, label: "Inicio", count: null, active: true },
  { icon: TrendingUp, label: "Trending", count: 42 },
  { icon: Code, label: "Frontend", count: 156 },
  { icon: Database, label: "Backend", count: 98 },
  { icon: Globe, label: "Fullstack", count: 73 },
  { icon: Smartphone, label: "Mobile", count: 45 },
  { icon: Brain, label: "AI/ML", count: 67 },
  { icon: Users, label: "DevOps", count: 34 },
];

const quickLinks = [
  { icon: BookOpen, label: "Guías" },
  { icon: Trophy, label: "Challenges" },
  { icon: Calendar, label: "Eventos" },
];

interface stateProp {
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const Sidebar = ({isOpen, setIsOpen}:stateProp) => {

  const conditionIsOpen = isOpen ? 'w-86 h-screen fixed top-20 left-0' : 'w-16 h-screen fixed top-20 left-0';
  return (
    <>
      <aside className={`${conditionIsOpen} overflow-y-auto p-4 border-r bg-background shadow-[4px_0_10px_-2px_rgba(0,0,0,0.2)] dark:bg-gray-900 dark:shadow-[4px_0_10px_-2px_rgba(0,0,0,0.7)] transition-all duration-300 ease-in-out`}>
        {isOpen && <div className="space-y-6">
          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
              Navegación
            </h3>
            <nav className="space-y-1">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={category.active ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 transition-smooth ${category.active ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'hover:bg-accent'
                    }`}
                >
                  <category.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{category.label}</span>
                  {category.count && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      {category.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </nav>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
              Quick Links
            </h3>
            <nav className="space-y-1">
              {quickLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start gap-3 transition-smooth hover:bg-accent"
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Button>
              ))}
            </nav>
          </div>

          {/* Trending Tags */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
              Tags Populares
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {['React', 'TypeScript', 'Node.js', 'Vue', 'Python', 'Docker', 'AWS', 'GraphQL'].map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-primary/10 hover:border-primary/20 transition-smooth"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          <Button>
            hola
          </Button>


          {/* Community Stats */}
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Estadísticas</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Miembros activos</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Posts hoy</span>
                <span className="font-medium">28</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Online ahora</span>
                <span className="font-medium text-success">156</span>
              </div>
            </div>
          </div>
        </div>}
      </aside>
      {/* BOTÓN FLOTANTE (fijo y visible siempre) */}
      <Button
        aria-label="Abrir/cerrar sidebar"
        variant="default"
        size="icon"
        className={`fixed top-1/2 -translate-y-1/2 ${isOpen ? 'left-[21.5rem]' : 'left-[4rem]'} -translate-x-1/2 z-50 rounded-full shadow-lg ring-1 ring-black/5 p-0 bg-white text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:ring-white/10 transition-all duration-300 ease-in-out`}
      onClick={() => setIsOpen(!isOpen)}  
      >
        {isOpen ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </Button>
    </>
  );
};
