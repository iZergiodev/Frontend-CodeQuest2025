import { useState, useMemo } from "react";
import type {
  Post,
  Category,
  BlogFilters,
  TrendingPost,
  RecentActivity,
} from "@/types/blog";

// Mock data for demonstration
const mockCategories: Category[] = [
  {
    id: "1",
    name: "React",
    slug: "react",
    color: "#61DAFB",
    description: "React tutorials and tips",
  },
  {
    id: "2",
    name: "TypeScript",
    slug: "typescript",
    color: "#3178C6",
    description: "TypeScript guides",
  },
  {
    id: "3",
    name: "Node.js",
    slug: "nodejs",
    color: "#339933",
    description: "Backend development",
  },
  {
    id: "4",
    name: "CSS",
    slug: "css",
    color: "#1572B6",
    description: "Styling and design",
  },
  {
    id: "5",
    name: "JavaScript",
    slug: "javascript",
    color: "#F7DF1E",
    description: "Core JavaScript",
  },
];

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Introducción a React Hooks: useState y useEffect",
    content: `
  React Hooks cambiaron la forma en la que escribimos componentes en React a partir de la versión 16.8. 
  Antes, para manejar estado o ciclo de vida necesitábamos clases, pero ahora podemos hacerlo todo en funciones, de forma más simple y legible.
  
  **useState** nos permite manejar variables reactivas dentro de un componente. Por ejemplo:
  
  \`\`\`jsx
  const [contador, setContador] = useState(0);
  \`\`\`
  
  Con este hook, cada vez que llamamos a \`setContador\` el componente se vuelve a renderizar mostrando el nuevo valor.
  
  **useEffect**, por otro lado, nos deja manejar efectos secundarios como peticiones a APIs, suscripciones o manipulación del DOM. Su sintaxis básica es:
  
  \`\`\`jsx
  useEffect(() => {
    console.log("Componente montado o actualizado");
  }, []);
  \`\`\`
  
  Este segundo argumento, el array de dependencias, es clave para controlar cuándo se ejecuta el efecto.
  
  En próximos artículos profundizaremos en cómo combinar Hooks y crear los tuyos propios para lógica reutilizable.`,
    excerpt:
      "Descubre cómo React Hooks simplifican el manejo de estado y efectos secundarios en componentes funcionales.",
    author: {
      id: "1",
      username: "devtalles_admin",
      email: "admin@devtalles.com",
      displayName: "DevTalles Team",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      role: "admin",
      bio: "Equipo de DevTalles",
      createdAt: "2024-01-01T00:00:00Z",
    },
    category: mockCategories[0],
    tags: ["hooks", "useState", "useEffect"],
    likes: 42,
    comments: [],
    createdAt: "2024-09-08T10:00:00Z",
    updatedAt: "2024-09-08T10:00:00Z",
    slug: "introduccion-react-hooks",
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    readTime: 5,
    published: true,
    featured: true,
  },
  {
    id: "2",
    title: "TypeScript: Tipos avanzados y utilidades",
    content: `
  TypeScript es mucho más que añadir tipos básicos a JavaScript. Entre sus herramientas más potentes están los **tipos avanzados** como los *Union Types*, *Intersection Types*, *Mapped Types* y *Conditional Types*.
  
  Por ejemplo, un tipo condicional nos permite definir un tipo que depende de otro:
  
  \`\`\`ts
  type EsString<T> = T extends string ? "sí" : "no";
  type Resultado = EsString<42>; // "no"
  \`\`\`
  
  Además, los **Utility Types** como \`Partial<T>\`, \`Pick<T, K>\` o \`Omit<T, K>\` ahorran tiempo y reducen duplicación de código.
  
  Una práctica recomendada es aprovechar estos tipos junto con interfaces bien diseñadas para lograr código más mantenible y menos propenso a errores.
  
  En un próximo artículo veremos cómo crear tus propios utility types para casos específicos de tu aplicación.`,
    excerpt:
      "Aprende a usar tipos condicionales, mapped types y utilidades para escribir código TypeScript más seguro y reutilizable.",
    author: {
      id: "2",
      username: "ts_expert",
      email: "ts@devtalles.com",
      displayName: "María García",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face",
      role: "user",
      bio: "TypeScript enthusiast",
      createdAt: "2024-01-15T00:00:00Z",
    },
    category: mockCategories[1],
    tags: ["typescript", "types", "utility-types"],
    likes: 28,
    comments: [],
    createdAt: "2024-09-07T14:30:00Z",
    updatedAt: "2024-09-07T14:30:00Z",
    slug: "typescript-tipos-avanzados",
    coverImage:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
    readTime: 8,
    published: true,
    featured: false,
  },
  {
    id: "3",
    title: "Construyendo APIs REST con Node.js y Express",
    content: `
  Crear una API REST con **Node.js** y **Express** es un proceso directo y muy flexible. Express nos ofrece un sistema de enrutado y middleware que facilita la organización del código.
  
  Un ejemplo mínimo de API sería:
  
  \`\`\`js
  import express from "express";
  const app = express();
  
  app.get("/api/usuarios", (req, res) => {
    res.json([{ id: 1, nombre: "Juan" }]);
  });
  
  app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
  \`\`\`
  
  Para APIs más grandes, se recomienda separar rutas, controladores y lógica de negocio en carpetas independientes, además de usar un ORM como Prisma o Sequelize para manejar la base de datos.
  
  También es importante manejar errores y validar datos para evitar problemas de seguridad.`,
    excerpt:
      "Guía práctica para crear una API REST con Node.js y Express, desde un ejemplo básico hasta buenas prácticas.",
    author: {
      id: "3",
      username: "backend_dev",
      email: "backend@devtalles.com",
      displayName: "Carlos Rodríguez",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      role: "user",
      bio: "Backend developer",
      createdAt: "2024-02-01T00:00:00Z",
    },
    category: mockCategories[2],
    tags: ["nodejs", "express", "api", "rest"],
    likes: 35,
    comments: [],
    createdAt: "2024-09-06T09:15:00Z",
    updatedAt: "2024-09-06T09:15:00Z",
    slug: "apis-rest-nodejs-express",
    coverImage:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    readTime: 12,
    published: true,
    featured: true,
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox: Cuándo usar cada uno",
    content: `
  **CSS Grid** y **Flexbox** son sistemas de layout complementarios. Grid está pensado para organizar elementos en dos dimensiones (filas y columnas), mientras que Flexbox se enfoca en una dimensión a la vez.
  
  Ejemplo básico con Grid:
  
  \`\`\`css
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }
  \`\`\`
  
  Ejemplo con Flexbox:
  
  \`\`\`css
  .container {
    display: flex;
    justify-content: space-between;
  }
  \`\`\`
  
  En general, usa Grid para layouts globales y Flexbox para alinear o distribuir elementos dentro de un contenedor específico.
  
  La clave está en combinarlos para aprovechar lo mejor de ambos.`,
    excerpt:
      "Comprende las diferencias entre CSS Grid y Flexbox, y aprende cuándo conviene usar cada técnica.",
    author: {
      id: "4",
      username: "css_ninja",
      email: "css@devtalles.com",
      displayName: "Ana López",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      role: "user",
      bio: "Frontend designer",
      createdAt: "2024-02-15T00:00:00Z",
    },
    category: mockCategories[3],
    tags: ["css", "grid", "flexbox", "layout"],
    likes: 19,
    comments: [],
    createdAt: "2024-09-05T16:45:00Z",
    updatedAt: "2024-09-05T16:45:00Z",
    slug: "css-grid-vs-flexbox",
    coverImage:
      "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=800&h=400&fit=crop",
    readTime: 6,
    published: true,
    featured: false,
  },
];

// Mock data for sidebar
const mockTrendingPosts: TrendingPost[] = [
  {
    id: "trending-1",
    title: "Guía completa de React Hooks",
    author: {
      id: "user-1",
      username: "fernando",
      email: "fernando@example.com",
      displayName: "Fernando Herrera",
      role: "admin",
      createdAt: "2024-01-01T00:00:00Z",
    },
    views: 2300,
    slug: "guia-completa-react-hooks",
  },
  {
    id: "trending-2",
    title: "Arquitectura limpia en Node.js",
    author: {
      id: "user-2",
      username: "maria",
      email: "maria@example.com",
      displayName: "María García",
      role: "user",
      createdAt: "2024-01-01T00:00:00Z",
    },
    views: 1800,
    slug: "arquitectura-limpia-nodejs",
  },
  {
    id: "trending-3",
    title: "TypeScript tips y trucos",
    author: {
      id: "user-3",
      username: "carlos",
      email: "carlos@example.com",
      displayName: "Carlos Ruiz",
      role: "user",
      createdAt: "2024-01-01T00:00:00Z",
    },
    views: 1500,
    slug: "typescript-tips-trucos",
  },
];

const mockRecentActivity: RecentActivity[] = [
  {
    id: "activity-1",
    type: "post",
    title: "Nuevo post publicado",
    description: "React Hooks avanzados",
    timestamp: "hace 2 horas",
    user: {
      id: "user-1",
      username: "fernando",
      email: "fernando@example.com",
      displayName: "Fernando Herrera",
      role: "admin",
      createdAt: "2024-01-01T00:00:00Z",
    },
  },
  {
    id: "activity-2",
    type: "comment",
    title: "10 nuevos comentarios",
    description: "En el post de TypeScript",
    timestamp: "hace 4 horas",
  },
  {
    id: "activity-3",
    type: "member",
    title: "5 nuevos miembros",
    description: "Se unieron a la comunidad",
    timestamp: "hace 6 horas",
  },
];

export function useBlogData() {
  const [filters, setFilters] = useState<BlogFilters>({});

  const filteredPosts = useMemo(() => {
    let result = [...mockPosts];

    // Filter by category
    if (filters.category) {
      result = result.filter((post) => post.category.slug === filters.category);
    }

    // Filter by search
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by tag
    if (filters.tag) {
      result = result.filter((post) => post.tags.includes(filters.tag));
    }

    // Sort posts
    if (filters.sortBy === "popular") {
      result.sort((a, b) => b.likes - a.likes);
    } else if (filters.sortBy === "trending") {
      result.sort(
        (a, b) => b.likes + b.comments.length - (a.likes + a.comments.length)
      );
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [filters]);

  const featuredPosts = mockPosts.filter((post) => post.featured);

  return {
    posts: filteredPosts,
    featuredPosts,
    categories: mockCategories,
    filters,
    setFilters,
    trendingPosts: mockTrendingPosts,
    recentActivity: mockRecentActivity,
  };
}
