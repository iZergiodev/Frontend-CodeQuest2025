import { useMemo, useRef, useState, useEffect } from "react";
import { ArrowLeft, User, Calendar, Clock, Trophy, History, MessageSquare, Edit } from "lucide-react";
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
import { useTogglePostLike } from "@/services/likesService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { bookmarkService } from "@/services/bookmarkService";
import { RelatedPosts } from "@/components/RelatedPosts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


type SortKey = "top" | "newest" | "oldest" | "controversial";


const PostDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { isOpen } = useOpen(); 
  const postRef = useRef<HTMLDivElement>(null);

  const handleBackClick = () => navigate(-1);


  const { postId, isLoading: slugLoading } = usePostIdFromSlug(slug || "");

  const { data: post, isLoading: postLoading, error: postError } = usePost(postId || "");
  
  const { data: comments = [], isLoading: commentsLoading } = useCommentsByPost(postId || "", sortBy);
  
  const createCommentMutation = useCreateComment();
  const togglePostLikeMutation = useTogglePostLike();

  // Load bookmark status when user and postId are available
  useEffect(() => {
    if (user && postId) {
      loadBookmarkStatus();
    }
  }, [user, postId]);

  const loadBookmarkStatus = async () => {
    try {
      const response = await bookmarkService.getBookmarkStatus(postId!.toString());
      setIsBookmarked(response.isBookmarked);
      console.log('Bookmark status loaded:', response.isBookmarked);
    } catch (error) {
      console.error('Error loading bookmark status:', error);
      setIsBookmarked(false);
    }
  };

  const handleBookmark = async () => {
    if (!user || !postId) {
      toast({
        title: "Acceso requerido",
        description: "Debes iniciar sesión para guardar posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await bookmarkService.toggleBookmark(postId.toString());
      setIsBookmarked(response.isBookmarked);
      
      toast({
        title: response.isBookmarked ? "Post guardado" : "Post eliminado de guardados",
        description: response.isBookmarked 
          ? "El post se ha guardado en tus marcadores." 
          : "El post se ha eliminado de tus marcadores.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo completar la acción.",
        variant: "destructive",
      });
    }
  };

  const handlePostLike = async () => {
    if (!user || !postId) {
      toast({
        title: "Acceso requerido",
        description: "Debes iniciar sesión para dar like.",
        variant: "destructive",
      });
      return;
    }

    try {
      await togglePostLikeMutation.mutateAsync(parseInt(postId));
    } catch (error: any) {
      console.error("Error toggling post like:", error);
      toast({
        title: "Error",
        description: "Error al cambiar el like del post. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

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
    const mapComment = (comment: any, level: number = 0): FlatComment => ({
      id: comment.id.toString(),
      author: comment.authorName?.trim() || "Usuario",
      authorId: comment.authorId,
      authorRole: comment.authorRole,
      avatarUrl: comment.authorAvatar,
      timeAgo: formatTimeAgo(comment.createdAt),
      content: comment.content,
      parentId: comment.parentId,
      level,
      replies: comment.replies?.map((reply: any) => mapComment(reply, level + 1)) || [],
      dust: comment.likesCount || 0,
      repliesCount: comment.repliesCount || 0,
      isLikedByUser: comment.isLikedByUser || false,
    });

    return comments.map(comment => mapComment(comment, 0));
  }, [comments]);

  // Helper function to find a comment by ID in the nested structure
  const findCommentById = (commentId: string, commentList: FlatComment[]): FlatComment | null => {
    for (const comment of commentList) {
      if (comment.id === commentId) {
        return comment;
      }
      if (comment.replies && comment.replies.length > 0) {
        const found = findCommentById(commentId, comment.replies);
        if (found) return found;
      }
    }
    return null;
  };

  const sortMeta: Record<SortKey, { label: string; Icon: any }> = {
    top: { label: "Top", Icon: Trophy },
    newest: { label: "Recientes", Icon: Clock },
    oldest: { label: "Antiguos", Icon: History },
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

  // Server-side sorting is now handled, so we just use the flatComments directly
  const sortedComments = flatComments;

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
      const commentContent = replyingTo 
        ? `@${comments.find(c => c.id.toString() === replyingTo)?.authorName || 'Usuario'} ${content}`
        : content;

      await createCommentMutation.mutateAsync({
        content: commentContent,
        postId: parseInt(postId),
        parentId: replyingTo ? parseInt(replyingTo) : undefined,
      });
      
      toast({
        title: replyingTo ? "Respuesta publicada" : "Comentario publicado",
        description: replyingTo ? "Tu respuesta se ha publicado correctamente" : "Tu comentario se ha publicado correctamente",
      });

      // Clear reply state
      setReplyingTo(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo publicar el comentario",
        variant: "destructive",
      });
    }
  };

  const handleReply = (comment: FlatComment) => {
    setReplyingTo(comment.id);
    // Scroll to comment input after a short delay
    setTimeout(() => {
      document.getElementById("comment-input")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-3 order-1">
            {/* Wrapper principal del post: referencia para Floating UI */}
            <div ref={postRef} className="mx-auto">
          {/* Header autor */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Avatar 
                className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                onClick={() => navigate(`/profile/${post.authorId}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/profile/${post.authorId}`);
                  }
                }}
                aria-label={`Ver perfil de ${post.authorName}`}
              >
                {post.authorAvatar ? (
                  <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                ) : (
                  <AvatarFallback className="bg-muted">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                )}
              </Avatar>

              <div 
                className="flex-1 min-w-0 leading-tight cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
                onClick={() => navigate(`/profile/${post.authorId}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/profile/${post.authorId}`);
                  }
                }}
                aria-label={`Ver perfil de ${post.authorName}`}
              >
                <p className="text-sm font-medium truncate">{post.authorName}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(post.createdAt).toLocaleDateString("es-ES")}</span>
                  <Clock className="h-3 w-3" />
                  <span>{post.readTime} min</span>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight flex-1">
                {post.title}
              </h1>
              
              {/* Edit button for post authors */}
              {user && post.authorId === user.id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/edit-post/${post.slug}`)}
                  className="gap-2 shrink-0"
                >
                  <Edit className="h-4 w-4" />
                  Editar post
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="secondary" 
                className="bg-background/90 text-foreground backdrop-blur-sm border border-border/50 text-sm font-medium"
              >
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: post.category.color }}
                />
                {post.category.name}
              </Badge>
              {post.subcategory && (
                <Badge 
                  variant="outline" 
                  className="bg-background/90 text-foreground backdrop-blur-sm border border-border/50 text-xs"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full mr-1.5"
                    style={{ backgroundColor: post.subcategory.color }}
                  />
                  {post.subcategory.name}
                </Badge>
              )}
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
            key={`post-actions-${postId}-${isBookmarked}-${post.likesCount}`}
            context="post"
            showSave
            showShare
            variant="pill"
            size="md"
            initialLikes={post.likesCount}
            initialComments={post.commentsCount}
            defaultSavedActive={isBookmarked}
            defaultLikesActive={post.isLikedByUser || false}
            onCommentClick={() => {
              // Scroll to comment input
              document.getElementById("comment-input")?.scrollIntoView({ behavior: "smooth" });
              // Trigger expansion and focus on the textarea after a short delay
              setTimeout(() => {
                // First click on the comment box to expand it
                const commentBox = document.querySelector('#comment-input > div') as HTMLDivElement;
                if (commentBox) {
                  commentBox.click();
                  // Then focus on the textarea after expansion
                  setTimeout(() => {
                    const textarea = document.querySelector('#comment-input textarea') as HTMLTextAreaElement;
                    if (textarea) {
                      textarea.focus();
                    }
                  }, 100);
                }
              }, 300);
            }}
            onSaveToggle={handleBookmark}
            onLikeToggle={handlePostLike}
            onReport={() => console.log("report post")}
          />


          <div className="pt-8" id="comments">
            {/* Comment Box - Only show if user is authenticated */}
            {user ? (
              <div id="comment-input">
                {replyingTo && (
                  <div className="mb-3 p-3 bg-muted/50 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Respondiendo a <span className="font-medium text-foreground">
                          {findCommentById(replyingTo, flatComments)?.author || 'Usuario'}
                        </span>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(null)}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                )}
                <CommentBox 
                  onSubmit={handleCommentSubmit}
                  placeholder={replyingTo ? "Escribe tu respuesta..." : "Escribe tu comentario..."}
                  autoFocus={!!replyingTo}
                />
              </div>
            ) : (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border/50 text-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary hover:text-primary/80"
                    onClick={() => {
                      // You might want to open login modal here
                      navigate('/login');
                    }}
                  >
                    Inicia sesión
                  </Button> para comentar
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 mb-8">
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
                  <DropdownMenuItem onClick={() => setSortBy("newest")} className="cursor-pointer">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Recientes</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("oldest")} className="cursor-pointer">
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
                onReply={handleReply}
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
          </div>

          {/* Related posts sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-2">
            <div className="lg:sticky lg:top-8">
              <RelatedPosts postId={postId} limit={5} />
            </div>
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
