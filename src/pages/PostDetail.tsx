import { ArrowLeft, User, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useOpen } from "@/hooks/useOpen";
import { PostActions } from "@/components/PostActions";
import { CommentBox } from "@/components/CommentBox";
import { FlatComment } from "@/components/comments/CommentRow";
import { CommentsList } from "@/components/comments/CommentList";



const PostDetail = () => {
  const navigate = useNavigate();

  const { isOpen } = useOpen();

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
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    authorAvatar: null,
    createdAt: 'Hoy'
  };

  const comments: FlatComment[] = [
    {
      id: "1",
      author: "Aggressive_Pitch6623",
      timeAgo: "hace 40 min",
      content: "Un desastre absoluto Sommer desde ese partido contra el Barça...",
      dust: 1,
      repliesCount: 0,
    },
    {
      id: "2",
      author: "Vyphr",
      timeAgo: "hace 2 h",
      content: "Nuestra defensa está bien jodida y mentalmente no somos fuertes...",
      dust: 3,
      repliesCount: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header*/}
          <div className="mb-6">

            {/* Header: back + avatar + meta */}
            <div className="flex items-center gap-3 mb-3">

              {/* Avatar */}
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.authorAvatar} alt={post.author} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>

              {/* Nombre + fecha */}
              <div className="flex-1 min-w-0 leading-tight">
                <p className="text-sm font-medium truncate">{post.author}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{post.createdAt}</span>
                  <Clock className="h-3 w-3" />
                  <span>{'5'} min</span>
                </div>
              </div>
            </div>

            {/* Título */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              {post.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/10 text-primary">{post.category}</Badge>
              {post.tags.map((tag, i) => (
                <Badge key={i} variant="outline">
                  {tag}
                </Badge>
              ))}
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

          {/* botones comment */}
          <PostActions
            size="md"
            gapClass="gap-2"
            showShare
            initialDust={172}
            initialComments={43}
            initialShares={12}
            onCommentClick={() =>
              document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" })
            }
            onReport={() => console.log('true')}
          />

          {/* Comments Section */}
          <div className="pt-8">
            {/* <h3 className="text-2xl font-bold mb-6">Comentarios ({comments.length})</h3> */}

            {/* Add Comment */}
            <CommentBox onSubmit={() => console.log('comentario enviado')} />


            {/* <Card className="mb-8">
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
            </Card> */}

            {/* Comments List */}
            <CommentsList
              comments={comments}
              onReply={(c) => {
                // abre tu CommentBox o hace scroll
                document.getElementById("comment-box")?.scrollIntoView({ behavior: "smooth" });
              }}
              onReport={(c) => {
                // abre modal de denuncia o lanza acción
                console.log("Denunciar comentario:", c.id);
              }}
            />


            {/* <div className="space-y-6 mt-6">
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
            </div> */}
          </div>
        </div>
      </main>

      <button
        onClick={handleBackClick}
        className={`p-1.5 fixed top-36.5 -translate-y-1/2 ${isOpen ? 'left-[40.5rem]' : 'left-[32rem]'} -translate-x-1/2 z-50 rounded-full shadow-lg ring-1 ring-black/5 p-0 bg-white text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:ring-white/10 transition-all duration-300 ease-in-out`}
      >
        <ArrowLeft className="h-6 w-6 text-muted-foreground" />
      </button>

    </div>
  );
};

export default PostDetail;