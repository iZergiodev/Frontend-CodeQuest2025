import { TrendingUp, Calendar, Star, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Sidebar = () => {
  const categories = [
    { name: "React", count: 45, color: "bg-blue-500" },
    { name: "Vue.js", count: 32, color: "bg-green-500" },
    { name: "Angular", count: 28, color: "bg-red-500" },
    { name: "Node.js", count: 38, color: "bg-green-600" },
    { name: "TypeScript", count: 41, color: "bg-blue-600" },
    { name: "JavaScript", count: 67, color: "bg-yellow-500" },
  ];

  const trendingPosts = [
    { title: "Guía completa de React Hooks", author: "Fernando Herrera", views: "2.3k" },
    { title: "Arquitectura limpia en Node.js", author: "María García", views: "1.8k" },
    { title: "TypeScript tips y trucos", author: "Carlos Ruiz", views: "1.5k" },
  ];

  return (
    <aside className="w-80 space-y-6">
      {/* Trending Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Trending esta semana
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingPosts.map((post, index) => (
            <div key={index} className="cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors">
              <h4 className="font-medium text-sm mb-1 hover:text-primary transition-colors">
                {post.title}
              </h4>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{post.author}</span>
                <span>{post.views} vistas</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Hash className="h-5 w-5 mr-2 text-primary" />
            Categorías Populares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${category.color} mr-3`}></div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <p className="font-medium mb-1">Nuevo post publicado</p>
            <p className="text-muted-foreground text-xs">hace 2 horas</p>
          </div>
          <div className="text-sm">
            <p className="font-medium mb-1">10 nuevos comentarios</p>
            <p className="text-muted-foreground text-xs">hace 4 horas</p>
          </div>
          <div className="text-sm">
            <p className="font-medium mb-1">5 nuevos miembros</p>
            <p className="text-muted-foreground text-xs">hace 6 horas</p>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};

export default Sidebar;