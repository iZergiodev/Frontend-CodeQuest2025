import { useMemo, useRef, useState } from "react";
import { ArrowLeft, User, Calendar, Clock, Trophy, History, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate, useParams } from "react-router-dom";
import { PostActions } from "@/components/PostActions";
import { CommentBox } from "@/components/CommentBox";
import { CommentsList } from "@/components/comments/CommentList";
import type { FlatComment } from "@/components/comments/CommentRow";
import { useOpen } from "@/hooks/useOpen";
import { FloatingEdgeButton } from "@/components/FloatingEdgeButton";
import { usePost, usePostIdFromSlug } from "@/services/postsService";
import { useCommentsByPost, useCreateComment } from "@/services/commentsService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


type SortKey = "top" | "new" | "old" | "controversial";


const PostDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<SortKey>("top");
  const { isOpen } = useOpen(); 
  const postRef = useRef<HTMLDivElement>(null);

  const handleBackClick = () => navigate(-1);


  const { postId, isLoading: slugLoading } = usePostIdFromSlug(slug || "");

  const { data: post, isLoading: postLoading, error: postError } = usePost(postId || "");
  
  const { data: comments = [], isLoading: commentsLoading } = useCommentsByPost(postId || "");
  
  const createCommentMutation = useCreateComment();

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return "ahora";
      if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
      if (diffInMinutes < 1440) return `hace ${Math.floor(diffInMinutes / 60)} h`;
      if (diffInMinutes < 10080) return `hace ${Math.floor(diffInMinutes / 1440)} d`;
      return `hace ${Math.floor(diffInMinutes / 10080)} sem`;
    } catch {
      return "—";
    }
  };

  const flatComments: FlatComment[] = useMemo(() => {
    return comments.map(comment => ({
      id: comment.id.toString(),
      author: comment.authorName,
      avatarUrl: comment.authorAvatar,
      timeAgo: formatTimeAgo(comment.createdAt),
      content: comment.content,
    }));
  }, [comments]);

  const sortMeta: Record<SortKey, { label: string; Icon: any }> = {
    top: { label: "Top", Icon: Trophy },
    new: { label: "Recientes", Icon: Clock },
    old: { label: "Antiguos", Icon: History },
    controversial: { label: "Controversiales", Icon: MessageSquare },
  };

  const score = (c: FlatComment) => (c.dust ?? 0) + (c.repliesCount ?? 0) * 2;
  const toTime = (c: FlatComment) => {
    const timeAgo = c.timeAgo;
    if (timeAgo.includes("ahora")) return Date.now();
    if (timeAgo.includes("min")) return Date.now() - parseInt(timeAgo.match(/\d+/)?.[0] || "0") * 60000;
    if (timeAgo.includes("h")) return Date.now() - parseInt(timeAgo.match(/\d+/)?.[0] || "0") * 3600000;
    if (timeAgo.includes("d")) return Date.now() - parseInt(timeAgo.match(/\d+/)?.[0] || "0") * 86400000;
    if (timeAgo.includes("sem")) return Date.now() - parseInt(timeAgo.match(/\d+/)?.[0] || "0") * 604800000;
    return 0;
  };

  const sortedComments = useMemo(() => {
    const arr = [...flatComments];
    switch (sortBy) {
      case "new": return arr.sort((a, b) => toTime(b) - toTime(a));
      case "old": return arr.sort((a, b) => toTime(a) - toTime(b));
      case "controversial": return arr.sort((a, b) => (b.repliesCount ?? 0) - (a.repliesCount ?? 0));
      case "top":
      default: return arr.sort((a, b) => score(b) - score(a));
    }
  }, [flatComments, sortBy]);

  const handleCommentSubmit = async (content: string) => {
    if (!user || !postId) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para comentar",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCommentMutation.mutateAsync({
        content,
        postId: parseInt(postId),
      });
      
      toast({
        title: "Comentario publicado",
        description: "Tu comentario se ha publicado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo publicar el comentario",
        variant: "destructive",
      });
    }
  };

  if (slugLoading || postLoading) {
    return (
      <div className="bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando post...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!postId || postError || !post) {
    return (
      <div className="bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Post no encontrado</h1>
            <p className="text-muted-foreground mb-6">El post que buscas no existe o ha sido eliminado.</p>
            <Button onClick={handleBackClick} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Wrapper principal del post: referencia para Floating UI */}
        <div ref={postRef} className="mx-auto">
          {/* Header autor */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                {post.authorAvatar ? (
                  <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                ) : (
                  <AvatarFallback className="bg-muted">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 min-w-0 leading-tight">
                <p className="text-sm font-medium truncate">{post.authorName}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(post.createdAt).toLocaleDateString("es-ES")}</span>
                  <Clock className="h-3 w-3" />
                  <span>{post.readTime} min</span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/10 text-primary">{post.category.name}</Badge>
              {post.tags.map((t, i) => (
                <Badge key={i} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          {post.coverImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img src={post.coverImage} alt={post.title} className="w-full h-96 object-cover" />
            </div>
          )}

          <div className="prose prose-lg max-w-none mb-12 prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground prose-blockquote:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-3xl font-bold mb-4 text-foreground">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-bold mb-3 text-foreground">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-bold mb-2 text-foreground">{children}</h3>,
                h4: ({ children }) => <h4 className="text-lg font-bold mb-2 text-foreground">{children}</h4>,
                p: ({ children }) => <p className="mb-4 text-foreground leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="mb-4 ml-6 list-disc text-foreground">{children}</ul>,
                ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal text-foreground">{children}</ol>,
                li: ({ children }) => <li className="mb-1 text-foreground">{children}</li>,
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono text-foreground">{children}</code>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-foreground">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }) => (
                  <a 
                    href={href} 
                    className="text-primary hover:text-primary/80 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border border-border rounded-lg">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-border px-4 py-2 bg-muted text-left font-semibold text-foreground">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-4 py-2 text-foreground">
                    {children}
                  </td>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <PostActions
            context="post"
            showSave
            showShare
            variant="pill"
            size="md"
            initialStartDust={post.likesCount}
            initialComments={post.commentsCount}
            initialSaves={0} // TODO: Add saves count when implemented
            initialShares={0} // TODO: Add shares count when implemented
            onCommentClick={() =>
              document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" })
            }
            onReport={() => console.log("report post")}
          />

          <div className="pt-8" id="comments">
            <CommentBox 
              onSubmit={handleCommentSubmit}
              placeholder="Escribe tu comentario..."
            />

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

            {commentsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando comentarios...</p>
              </div>
            ) : sortedComments.length > 0 ? (
              <CommentsList
                comments={sortedComments}
                onReply={() => {
                  document.getElementById("comment-box")?.scrollIntoView({ behavior: "smooth" });
                }}
                onReport={(c) => console.log("Denunciar comentario:", c.id)}
              />
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay comentarios aún. ¡Sé el primero en comentar!</p>
              </div>
            )}
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
