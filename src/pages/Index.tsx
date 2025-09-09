import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";

const Index = () => {
  // Mock data for posts
  const posts = [
    {
      id: "1",
      title: "Guía Completa de React Hooks: De useState a Hooks Personalizados",
      excerpt: "Aprende todo sobre React Hooks desde lo básico hasta crear tus propios hooks personalizados. Una guía paso a paso con ejemplos prácticos.",
      author: "Fernando Herrera",
      date: "15 Mar 2024",
      category: "React",
      likes: 234,
      comments: 45,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=300&fit=crop",
      tags: ["React", "Hooks", "JavaScript"]
    },
    {
      id: "2",
      title: "Arquitectura Limpia en Node.js: Principios y Mejores Prácticas",
      excerpt: "Descubre cómo implementar arquitectura limpia en tus aplicaciones Node.js para crear código mantenible y escalable.",
      author: "María García",
      date: "12 Mar 2024",
      category: "Node.js",
      likes: 189,
      comments: 32,
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=300&fit=crop",
      tags: ["Node.js", "Architecture", "Backend"]
    },
    {
      id: "3",
      title: "TypeScript Tips y Trucos que Todo Desarrollador Debe Conocer",
      excerpt: "Una colección de consejos avanzados de TypeScript que mejorarán tu productividad y la calidad de tu código.",
      author: "Carlos Ruiz",
      date: "10 Mar 2024",
      category: "TypeScript",
      likes: 156,
      comments: 28,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop",
      tags: ["TypeScript", "Tips", "JavaScript"]
    },
    {
      id: "4",
      title: "Vue 3 Composition API: El Futuro del Desarrollo Vue",
      excerpt: "Explora las nuevas características de Vue 3 Composition API y cómo pueden mejorar tu flujo de desarrollo.",
      author: "Ana López",
      date: "8 Mar 2024",
      category: "Vue.js",
      likes: 142,
      comments: 19,
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=300&fit=crop",
      tags: ["Vue.js", "Composition API", "Frontend"]
    },
    {
      id: "5",
      title: "Microservicios con Docker: Guía Práctica para Principiantes",
      excerpt: "Aprende a crear y desplegar microservicios usando Docker con ejemplos prácticos y mejores prácticas.",
      author: "Luis Martínez",
      date: "5 Mar 2024",
      category: "DevOps",
      likes: 201,
      comments: 37,
      image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&h=300&fit=crop",
      tags: ["Docker", "Microservices", "DevOps"]
    },
    {
      id: "6",
      title: "Optimización de Performance en React: Técnicas Avanzadas",
      excerpt: "Técnicas avanzadas para optimizar el rendimiento de tus aplicaciones React y mejorar la experiencia del usuario.",
      author: "Elena Rodríguez",
      date: "3 Mar 2024",
      category: "React",
      likes: 178,
      comments: 24,
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=300&fit=crop",
      tags: ["React", "Performance", "Optimization"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Últimos Posts
              </h2>
              <p className="text-muted-foreground">
                Descubre el contenido más reciente de nuestra comunidad
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  postId={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  author={post.author}
                  date={post.date}
                  category={post.category}
                  likes={post.likes}
                  comments={post.comments}
                  image={post.image}
                  tags={post.tags}
                />
              ))}
            </div>
            
            {/* Load More */}
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-devtalles-gradient text-white rounded-lg hover:opacity-90 transition-opacity">
                Cargar más posts
              </button>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
