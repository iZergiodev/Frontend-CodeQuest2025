import { useMemo, useRef, useState } from "react";
import { ArrowLeft, User, Calendar, Clock, Trophy, History, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { PostActions } from "@/components/PostActions";
import { CommentBox } from "@/components/CommentBox";
import { CommentsList } from "@/components/comments/CommentList";
import type { FlatComment } from "@/components/comments/CommentRow";
import { useOpen } from "@/hooks/useOpen";
import { FloatingEdgeButton } from "@/components/FloatingEdgeButton";


type SortKey = "top" | "new" | "old" | "controversial";

const TOP_PX = 128; // top fijo (≈ top-24). Ajusta para alinearlo a tu avatar/título

const PostDetail = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortKey>("top");
  const { isOpen } = useOpen(); 
  const postRef = useRef<HTMLDivElement>(null);

  const handleBackClick = () => navigate(-1);

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
    `,
    author: "Fernando Herrera",
    category: "React",
    tags: ["React", "Hooks", "JavaScript", "Frontend"],
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    authorAvatar: null as string | null,
    createdAt: "Hoy",
  };

  const comments: FlatComment[] = [
    { id: "1", author: "Aggressive_Pitch6623", timeAgo: "hace 40 min", content: "Un desastre absoluto Sommer desde ese partido contra el Barça...", dust: 1, repliesCount: 0 },
    { id: "2", author: "Vyphr", timeAgo: "hace 2 h", content: "Nuestra defensa está bien jodida y mentalmente no somos fuertes...", dust: 3, repliesCount: 3 },
  ];

  const sortMeta: Record<SortKey, { label: string; Icon: any }> = {
    top: { label: "Top", Icon: Trophy },
    new: { label: "Recientes", Icon: Clock },
    old: { label: "Antiguos", Icon: History },
    controversial: { label: "Controversiales", Icon: MessageSquare },
  };

  const score = (c: FlatComment) => (c.dust ?? 0) + (c.repliesCount ?? 0) * 2;
  const toTime = (c: FlatComment) => (c as any).timestamp ?? 0;

  const sortedComments = useMemo(() => {
    const arr = [...comments];
    switch (sortBy) {
      case "new": return arr.sort((a, b) => toTime(b) - toTime(a));
      case "old": return arr.sort((a, b) => toTime(a) - toTime(b));
      case "controversial": return arr.sort((a, b) => (b.repliesCount ?? 0) - (a.repliesCount ?? 0));
      case "top":
      default: return arr.sort((a, b) => score(b) - score(a));
    }
  }, [comments, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Wrapper principal del post: referencia para Floating UI */}
        <div ref={postRef} className="mx-auto max-w-5xl">
          {/* Header autor */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                {post.authorAvatar ? (
                  <AvatarImage src={post.authorAvatar} alt={post.author} />
                ) : (
                  <AvatarFallback className="bg-muted">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 min-w-0 leading-tight">
                <p className="text-sm font-medium truncate">{post.author}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{post.createdAt}</span>
                  <Clock className="h-3 w-3" />
                  <span>5 min</span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/10 text-primary">{post.category}</Badge>
              {post.tags.map((t, i) => (
                <Badge key={i} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          {post.image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-96 object-cover" />
            </div>
          )}

          <div className="prose prose-lg max-w-none mb-12">
            <div className="whitespace-pre-line text-foreground leading-relaxed">
              {post.content}
            </div>
          </div>

          <PostActions
            context="post"
            showSave
            showShare
            variant="pill"
            size="md"
            initialStartDust={172}
            initialComments={43}
            initialSaves={25}
            initialShares={12}
            onCommentClick={() =>
              document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" })
            }
            onReport={() => console.log("report post")}
          />

          <div className="pt-8" id="comments">
            <CommentBox onSubmit={() => console.log("comentario enviado")} />

            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ordenar por:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="rounded-full gap-2 h-8 px-3">
                    {(() => {
                      const { Icon, label } = sortMeta[sortBy];
                      return (
                        <>
                          <Icon className="h-4 w-4" />
                          <span className="text-sm">{label}</span>
                        </>
                      );
                    })()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[220px]">
                  <DropdownMenuItem onClick={() => setSortBy("top")} className="cursor-pointer">
                    <Trophy className="mr-2 h-4 w-4" />
                    <span>Top</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("new")} className="cursor-pointer">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Recientes</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("old")} className="cursor-pointer">
                    <History className="mr-2 h-4 w-4" />
                    <span>Antiguos</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("controversial")} className="cursor-pointer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Controversiales</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <CommentsList
              comments={sortedComments}
              onReply={() => {
                document.getElementById("comment-box")?.scrollIntoView({ behavior: "smooth" });
              }}
              onReport={(c) => console.log("Denunciar comentario:", c.id)}
            />
          </div>
        </div>
      </main>

      
      <FloatingEdgeButton
        referenceRef={postRef}
        onClick={handleBackClick}
        label="Volver"
        hideBelow="lg"      
        topPx={126}           
        offsetMain={30}      
        watch={isOpen}       
        className="cursor-pointer"         
      >
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </FloatingEdgeButton>
    </div>
  );
};

export default PostDetail;
