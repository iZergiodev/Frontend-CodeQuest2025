import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const PostDetail = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };
  const post = {
    title: "Guía Completa de React Hooks: De useState a Hooks Personalizados",
    content: `
Los React Hooks revolucionaron la forma en que escribimos componentes en React. En esta guía completa, 
exploraremos desde los hooks básicos hasta la creación de hooks personalizados que pueden transformar 
tu código.

## ¿Qué son los React Hooks?

Los hooks son funciones especiales que te permiten "engancharte" a las características de React. 
Fueron introducidos en React 16.8 y nos permiten usar estado y otras características de React 
sin escribir una clase.

## useState: Manejando el Estado Local

El hook más básico y fundamental es useState. Te permite agregar estado local a componentes funcionales:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Has hecho clic {count} veces</p>
      <button onClick={() => setCount(count + 1)}>
        Hacer clic
      </button>
    </div>
  );
}
\`\`\`

## useEffect: Efectos Secundarios

useEffect te permite realizar efectos secundarios en componentes funcionales:

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Has hecho clic \${count} veces\`;
  });

  return (
    <div>
      <p>Has hecho clic {count} veces</p>
      <button onClick={() => setCount(count + 1)}>
        Hacer clic
      </button>
    </div>
  );
}
\`\`\`

## Hooks Personalizados

Los hooks personalizados son una convención que nos permite extraer lógica de componentes:

\`\`\`javascript
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}
\`\`\`

## Conclusión

Los React Hooks han cambiado la forma en que desarrollamos aplicaciones React, haciendo el código 
más limpio, reutilizable y fácil de entender. ¡Experimenta con ellos en tus proyectos!
    `,
    author: "Fernando Herrera",
    date: "15 de Marzo, 2024",
    category: "React",
    tags: ["React", "Hooks", "JavaScript", "Frontend"],
    likes: 234,
    comments: 45,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop"
  };

  const comments = [
    {
      id: 1,
      author: "María González",
      content: "Excelente artículo! Me ayudó mucho a entender mejor los hooks personalizados.",
      date: "hace 2 horas",
      likes: 12
    },
    {
      id: 2,
      author: "Carlos Ruiz",
      content: "¿Podrías hacer un artículo sobre useContext también? Sería genial.",
      date: "hace 5 horas",
      likes: 8
    },
    {
      id: 3,
      author: "Ana López",
      content: "Los ejemplos están muy claros. Gracias por compartir!",
      date: "hace 1 día",
      likes: 15
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al blog
          </Button>
          
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-primary/10 text-primary">
                {post.category}
              </Badge>
              {post.tags.slice(1).map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{post.date}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-1" />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {post.comments}
                </Button>
                <Button variant="ghost" size="sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Featured Image */}
          {post.image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}
          
          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="whitespace-pre-line text-foreground leading-relaxed">
              {post.content}
            </div>
          </div>
          
          {/* Comments Section */}
          <div className="border-t pt-8">
            <h3 className="text-2xl font-bold mb-6">Comentarios ({comments.length})</h3>
            
            {/* Add Comment */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <Textarea 
                  placeholder="¿Qué opinas sobre este artículo?" 
                  className="mb-4"
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button className="bg-devtalles-gradient hover:opacity-90">
                    Publicar Comentario
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{comment.author}</p>
                          <p className="text-sm text-muted-foreground">{comment.date}</p>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4 mr-1" />
                        {comment.likes}
                      </Button>
                    </div>
                    
                    <p className="text-foreground">{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;