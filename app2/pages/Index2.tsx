import MainLayout from "@/components/layout/MainLayout";
import PostCard from "@/components/forum/PostCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Users } from "lucide-react";

// Mock data para mostrar posts
const mockPosts = [
  {
    id: "1",
    title: "Mejores prácticas para React Hooks en 2024",
    content:
      "En este post exploraremos las mejores prácticas para usar React Hooks de manera eficiente, incluyendo useCallback, useMemo, y patrones avanzados que te ayudarán a optimizar tus aplicaciones React.",
    author: {
      name: "Carlos Azaustre",
      username: "carlosazaustre",
      avatar: "/api/placeholder/40/40",
    },
    category: "Frontend",
    tags: ["React", "Hooks", "JavaScript", "Performance"],
    likes: 127,
    comments: 23,
    readTime: "5",
    timeAgo: "2h",
    isLiked: true,
  },
  {
    id: "2", 
    title: "Introducción a Docker para desarrolladores Node.js",
    content:
      "Aprende cómo containerizar tus aplicaciones Node.js con Docker. Desde los conceptos básicos hasta técnicas avanzadas de optimización de imágenes y docker-compose para desarrollo local.",
    author: {
      name: "Fernando Herrera",
      username: "klerith",
      avatar: "/api/placeholder/40/40",
    },
    category: "Backend",
    tags: ["Docker", "Node.js", "DevOps", "Containers"],
    likes: 89,
    comments: 15,
    readTime: "8",
    timeAgo: "4h",
    isLiked: false,
  },
  {
    id: "3",
    title: "TypeScript: Tipos avanzados que debes conocer",
    content:
      "Descubre tipos avanzados en TypeScript como Conditional Types, Mapped Types, Template Literal Types y cómo pueden mejorar la robustez de tu código y la experiencia de desarrollo.",
    author: {
      name: "Miguel Ángel Durán",
      username: "midudev",
      avatar: "/api/placeholder/40/40",
    },
    category: "Frontend",
    tags: ["TypeScript", "JavaScript", "Types"],
    likes: 156,
    comments: 31,
    readTime: "6",
    timeAgo: "6h",
    isLiked: false,
  },
  {
    id: "4",
    title: "Building a GraphQL API with Apollo Server",
    content:
      "Tutorial completo sobre cómo construir una API GraphQL robusta usando Apollo Server, incluyendo autenticación, autorización, y mejores prácticas para el manejo de errores.",
    author: {
      name: "Jonathan MirCha",
      username: "jonmircha",
      avatar: "/api/placeholder/40/40",
    },
    category: "Backend",
    tags: ["GraphQL", "Apollo", "API", "Backend"],
    likes: 73,
    comments: 18,
    readTime: "12",
    timeAgo: "1d",
    isLiked: true,
  },
];

const Index = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Hero Section */}
        <div className="mb-8 text-center py-12 gradient-hero rounded-2xl border">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenido a <span className="text-primary">DevTalles Community</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            El foro de la comunidad de desarrolladores donde compartimos conocimiento, 
            resolvemos dudas y creamos juntos el futuro del desarrollo.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="hero" size="lg" className="gap-2">
              <TrendingUp className="h-5 w-5" />
              Explorar Posts Trending
            </Button>
            <Button variant="outline" size="lg">
              Unirse a Discord
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">1,247</span>
            </div>
            <p className="text-sm text-muted-foreground">Desarrolladores activos</p>
          </div>
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-success" />
              <span className="text-2xl font-bold">89</span>
            </div>
            <p className="text-sm text-muted-foreground">Posts esta semana</p>
          </div>
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-warning" />
              <span className="text-2xl font-bold">156</span>
            </div>
            <p className="text-sm text-muted-foreground">Usuarios online</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Posts Recientes</h2>
            <Badge variant="secondary" className="px-2 py-1">
              {mockPosts.length} posts
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              Más recientes
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              Más populares
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              Sin responder
            </Badge>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {mockPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="gap-2">
            Cargar más posts
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;