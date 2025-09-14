import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
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
import { useOpen } from "@/hooks/useOpen";


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

export const Sidebar = () => {

  const {isOpen, setIsOpen} = useOpen();

  return (
    <>
        <aside 
          className={`${isOpen ? "w-86" : "w-16"} fixed top-20 left-0 h-[calc(100dvh-5rem)] overflow-y-auto p-4 border-r bg-background transition-all duration-300 ease-in-out sidebar-scroll`}
        >
        {isOpen && <div className="space-y-6">
          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold mt-3 mb-3 text-muted-foreground uppercase tracking-wider">
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
          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
              Tags Populares
            </h3>
            <div className="grid grid-cols-3 gap-2 mx-4">
              {['React', 'TypeScript', 'Node.js', 'Vue','React', 'TypeScript', 'Node.js', 'Vue','React', 'TypeScript', 'Node.js', 'Vue','React', 'TypeScript', 'Node.js', 'Vue','React', 'TypeScript', 'Node.js', 'Vue','React', 'TypeScript', 'Node.js', 'Vue','React', 'TypeScript', 'Node.js', 'Vue','React', 'TypeScript', 'Node.js', 'Vue', 'Python', 'Docker', 'AWS', 'GraphQL'].map((tag, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-xs p-1.5 rounded-xl cursor-pointer hover:bg-primary/10 hover:border-primary/20 transition-smooth w-auto justify-center"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>


          {/* Community Stats */}
          <div className="bg-card border rounded-lg p-4 mb-4">
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
