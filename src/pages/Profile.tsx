import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Shield, Stars, User, Bookmark, MessageSquare, FileText, Sparkles, ArrowLeft, Calendar, Edit, Camera, Loader2,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { FloatingEdgeButton } from "@/components/FloatingEdgeButton";
import { Button } from "@/components/ui/button";
import { bookmarkService } from "@/services/bookmarkService";
import { commentsService, CommentDto } from "@/services/commentsService";
import { usePostSlugFromId } from "@/services/postsService";
import { usePagination } from "@/hooks/usePagination";
import { Post } from "@/types/blog";
import { useToast } from "@/hooks/use-toast";
import { LoadMoreButton } from "@/components/LoadMoreButton";
import { useUpdateUser } from "@/services/userService";
import { DatePicker } from "@/components/ui/date-picker";



export const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [showPublicForm, setShowPublicForm] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);
  const [userComments, setUserComments] = useState<CommentDto[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const { toast } = useToast();
  
  // Profile edit form state
  const [editFormData, setEditFormData] = useState({
    name: "",
    biography: "",
    birthDate: undefined as Date | undefined,
    avatar: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  
  const updateUserMutation = useUpdateUser();

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setEditFormData({
        name: user.name || "",
        biography: user.biography || "",
        birthDate: user.birthDate ? new Date(user.birthDate) : undefined,
        avatar: user.avatar || "",
      });
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  // Fetch user posts using pagination
  const {
    data: userPosts = [],
    hasMore,
    isLoading: postsLoading,
    error: postsError,
    loadMore
  } = usePagination({
    type: 'author',
    authorId: user?.id ?? 0,
    enabled: !!user?.id,
  });

  const handleBackClick = () => navigate(-1);

  // Fetch bookmarked posts
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;
      
      setBookmarksLoading(true);
      try {
        const response = await bookmarkService.getUserBookmarks(1, 50); // Get first 50 bookmarks
        setBookmarkedPosts(response.bookmarks.map(bookmark => bookmark.post!).filter(Boolean));
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los posts guardados",
          variant: "destructive",
        });
      } finally {
        setBookmarksLoading(false);
      }
    };

    fetchBookmarks();
  }, [user, toast]);

  // Fetch user comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!user) return;
      
      setCommentsLoading(true);
      try {
        const comments = await commentsService.getCommentsByAuthor(user.id.toString());
        setUserComments(comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los comentarios",
          variant: "destructive",
        });
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [user, toast]);

  if (!user) {
    navigate("/");
    return null;
  }

  const provider =
    user.discordId
      ? { name: "Discord", dot: "bg-[#5865F2]", text: "text-[#5865F2]" }
      : { name: "Email", dot: "bg-blue-500", text: "text-blue-500" };

  const initials = (user.name ?? "User")
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const joinedAt = formatJoined(user.createdAt);

  // Form handlers
  const handleInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePublic = async () => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "No se encontró información del usuario.",
          variant: "destructive",
        });
        return;
      }

      const updateData: any = {
        name: editFormData.name,
        biography: editFormData.biography,
        birthDate: editFormData.birthDate ? editFormData.birthDate.toISOString().split('T')[0] : "",
      };

      // If there's a new avatar file, we'll need to handle file upload
      // For now, we'll just update the avatar URL if it's changed
      if (avatarPreview !== user?.avatar) {
        updateData.avatar = avatarPreview;
      }

      // Use the regular updateUserProfile method with the user ID from context
      const updatedUser = await updateUserMutation.mutateAsync({
        id: user.id,
        userData: updateData
      });
      
      // Update the user in the auth context
      setUser(updatedUser);
      
      toast({
        title: "¡Perfil actualizado!",
        description: "Tu perfil se ha actualizado correctamente.",
      });
      
      setShowPublicForm(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleCancelPublic = () => {
    // Reset form data to original user data
    if (user) {
      setEditFormData({
        name: user.name || "",
        biography: user.biography || "",
        birthDate: user.birthDate ? new Date(user.birthDate) : undefined,
        avatar: user.avatar || "",
      });
      setAvatarPreview(user.avatar || "");
      setAvatarFile(null);
    }
    setShowPublicForm(false);
  };

  return (
    <div className="bg-background">
      <motion.main className="container mx-auto px-4 py-6">
        {/* HEADER LIMPIO */}
        <div ref={contentRef} className="mb-4">
          <div className="flex items-start justify-between gap-4">
            {/* Izquierda: avatar + info */}
            <div className="flex items-start gap-4 min-w-0">
              <Avatar className="h-16 w-16 ring-4 ring-background shadow">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold leading-tight truncate">{user.name}</h1>
                  <Badge variant="outline" className={`${provider.text} border-current`}>
                    <Shield className="mr-1 h-3.5 w-3.5" />
                    {provider.name}
                  </Badge>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <Chip>
                    <Stars className="h-4 w-4 text-yellow-500" />
                    <span>{user.starDustPoints?.toLocaleString() ?? 0} Stardust</span>
                  </Chip>

                  <Chip>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Miembro desde: {joinedAt}</span>
                  </Chip>
                </div>
              </div>
            </div>

            {/* Derecha: acción */}
            <div className="shrink-0">
              <Button className="rounded-xl" onClick={() => setShowPublicForm(v => !v)}>
                {showPublicForm ? "Ocultar" : "Editar perfil"}
              </Button>
            </div>
          </div>
        </div>

        {/* PERFIL PÚBLICO (colapsable bajo el header) */}
        <AnimatePresence initial={false}>
          {showPublicForm && (
            <motion.section
              key="public-profile"
              className="mb-6"
              initial={{ height: 0, opacity: 0, y: -8 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ overflow: "hidden" }} // evita desbordes durante la animación de altura
            >
              <motion.div layout>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Perfil público</CardTitle>
                    <CardDescription>Controla cómo te ve la comunidad</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Foto de perfil</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={avatarPreview} alt={editFormData.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                              {editFormData.name ? editFormData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors">
                            <Camera className="h-3 w-3" />
                            <input
                              id="avatar-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Haz clic en la cámara para cambiar tu foto de perfil
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Formatos soportados: JPG, PNG, GIF (máx. 5MB)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input
                          id="name"
                          value={editFormData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                        <DatePicker
                          value={editFormData.birthDate}
                          onChange={(date) => setEditFormData(prev => ({ ...prev, birthDate: date }))}
                          placeholder="Selecciona tu fecha de nacimiento"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="biography">Biografía</Label>
                      <Textarea
                        id="biography"
                        value={editFormData.biography}
                        onChange={(e) => handleInputChange('biography', e.target.value)}
                        placeholder="Cuéntanos algo sobre ti..."
                        rows={4}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-4">
                      <Button 
                        className="rounded-xl" 
                        onClick={handleSavePublic}
                        disabled={updateUserMutation.isPending}
                      >
                        {updateUserMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Edit className="h-4 w-4 mr-2" />
                            Guardar cambios
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="rounded-xl" 
                        onClick={handleCancelPublic}
                        disabled={updateUserMutation.isPending}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* GRID 12: contenido + sidebar */}
        <motion.div className="grid gap-6 lg:grid-cols-12">
          {/* CONTENIDO (tabs) */}
          <div className="lg:col-span-8 space-y-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="h-10 gap-1 rounded-full dark:bg-muted/70 bg-violet-200 p-1">
                <TabsTrigger className="rounded-full px-4 data-[state=active]:bg-background" value="overview">
                  Actividad
                </TabsTrigger>
                <TabsTrigger className="rounded-full px-4 data-[state=active]:bg-background" value="posts">
                  Publicaciones
                </TabsTrigger>
                <TabsTrigger className="rounded-full px-4 data-[state=active]:bg-background" value="comments">
                  Comentarios
                </TabsTrigger>
                <TabsTrigger className="rounded-full px-4 data-[state=active]:bg-background" value="saved">
                  Guardados
                </TabsTrigger>
              </TabsList>

              {/* OVERVIEW */}
              <TabsContent value="overview" className="space-y-4">
                {postsLoading || commentsLoading ? (
                  <Card>
                    <CardContent className="p-10 text-center">
                      <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-muted">
                        <Sparkles className="h-6 w-6 animate-pulse" />
                      </div>
                      <p className="font-medium">Cargando actividad...</p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {(() => {
                      // Combine posts and comments and sort by most recent
                      const activities: Array<{ type: 'post', data: Post, date: string } | { type: 'comment', data: CommentDto, date: string }> = [
                        ...userPosts.map(p => ({ type: 'post' as const, data: p, date: p.createdAt })),
                        ...userComments.map(c => ({ type: 'comment' as const, data: c, date: c.createdAt }))
                      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                      return activities.length > 0 ? (
                        activities.map((activity) => {
                          if (activity.type === 'post') {
                            return <PostRow key={`post-${activity.data.id}`} p={activity.data} />;
                          } else {
                            return <CommentRow key={`comment-${activity.data.id}`} c={activity.data} />;
                          }
                        })
                      ) : (
                        <EmptyState icon={<Sparkles className="h-6 w-6" />} title="Aún no hay actividad">
                          Cuando publiques o comentes, verás tu actividad aquí.
                        </EmptyState>
                      );
                    })()}
                  </>
                )}
              </TabsContent>

              {/* POSTS */}
              <TabsContent value="posts" className="space-y-3">
                {postsLoading ? (
                  <Card>
                    <CardContent className="p-10 text-center">
                      <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-muted">
                        <FileText className="h-6 w-6 animate-pulse" />
                      </div>
                      <p className="font-medium">Cargando posts...</p>
                    </CardContent>
                  </Card>
                ) : userPosts.length ? (
                  <>
                    {userPosts.map(p => <PostRow key={p.id} p={p} />)}
                    {hasMore && (
                      <div className="mt-4">
                        <LoadMoreButton
                          onClick={loadMore}
                          disabled={!hasMore}
                          loading={postsLoading}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <EmptyState icon={<FileText className="h-6 w-6" />} title="Sin posts aún">
                    Crea tu primer post y compártelo con la comunidad.
                  </EmptyState>
                )}
              </TabsContent>

              {/* COMMENTS */}
              <TabsContent value="comments" className="space-y-3">
                {commentsLoading ? (
                  <Card>
                    <CardContent className="p-10 text-center">
                      <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-muted">
                        <MessageSquare className="h-6 w-6 animate-pulse" />
                      </div>
                      <p className="font-medium">Cargando comentarios...</p>
                    </CardContent>
                  </Card>
                ) : userComments.length ? (
                  userComments.map(c => <CommentRow key={c.id} c={c} />)
                ) : (
                  <EmptyState icon={<MessageSquare className="h-6 w-6" />} title="Sin comentarios">
                    Comenta en algún post para empezar a participar.
                  </EmptyState>
                )}
              </TabsContent>

              {/* SAVED */}
              <TabsContent value="saved" className="space-y-3">
                {bookmarksLoading ? (
                  <Card>
                    <CardContent className="p-10 text-center">
                      <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-muted">
                        <Bookmark className="h-6 w-6 animate-pulse" />
                      </div>
                      <p className="font-medium">Cargando posts guardados...</p>
                    </CardContent>
                  </Card>
                ) : bookmarkedPosts.length ? (
                  bookmarkedPosts.map(post => <BookmarkedPostRow key={post.id} post={post} onRemove={() => {
                    setBookmarkedPosts(prev => prev.filter(p => p.id !== post.id));
                  }} />)
                ) : (
                  <EmptyState icon={<Bookmark className="h-6 w-6" />} title="Nada guardado">
                    Guarda tus posts favoritos para verlos después.
                  </EmptyState>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* SIDEBAR STICKY */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24 self-start">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Métricas</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <MetricRow icon={<Stars className="h-5 w-5 text-yellow-500" />} label="Stardust points" value={user.starDustPoints?.toLocaleString() ?? "0"} />
                <MetricRow icon={<User className="h-5 w-5 text-muted-foreground" />} label="Nivel de perfil" value="Básico" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Conexión</CardTitle>
                <CardDescription>Método de acceso</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${provider.dot}`} />
                  <span className="font-medium">{provider.name}</span>
                </div>
                <Button size="sm" variant="outline" disabled>Cambiar</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Acciones rápidas</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" disabled>Privacidad</Button>
                <Button size="sm" variant="outline" disabled>Actividad</Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.main>

      <FloatingEdgeButton
        referenceRef={contentRef}
        onClick={handleBackClick}
        label="Volver"
        hideBelow="md"
        topPx={126}
        offsetMain={30}
        placement="left-start"
        className="cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </FloatingEdgeButton>
    </div>
  );
};

/* ---------- Helpers & subcomponentes ---------- */

function formatJoined(dateLike: any): string {
  try {
    const d = new Date(dateLike);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  } catch {
    return "—";
  }
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 bg-background/60">
      {children}
    </span>
  );
}

function MetricRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-right text-lg font-semibold">{value}</span>
    </div>
  );
}

function PostRow({ p }: { p: Post }) {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return "hoy";
      if (diffInDays === 1) return "hace 1 día";
      if (diffInDays < 7) return `hace ${diffInDays} días`;
      if (diffInDays < 30) return `hace ${Math.floor(diffInDays / 7)} sem`;
      return `hace ${Math.floor(diffInDays / 30)} mes`;
    } catch {
      return "—";
    }
  };

  const handleViewPost = () => {
    navigate(`/post/${p.slug}`);
  };

  const handleCardClick = () => {
    navigate(`/post/${p.slug}`);
  };

  return (
    <Card 
      className="hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-lg border px-2 py-1 text-xs text-muted-foreground">Post</div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{p.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{formatDate(p.createdAt)} • {p.likesCount} likes • {p.commentsCount} comentarios</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewPost();
            }}
          >
            Ver
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CommentRow({ c }: { c: CommentDto }) {
  const navigate = useNavigate();
  const { slug } = usePostSlugFromId(c.postId.toString());

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return "hoy";
      if (diffInDays === 1) return "hace 1 día";
      if (diffInDays < 7) return `hace ${diffInDays} días`;
      if (diffInDays < 30) return `hace ${Math.floor(diffInDays / 7)} sem`;
      return `hace ${Math.floor(diffInDays / 30)} mes`;
    } catch {
      return "—";
    }
  };

  const handleGoToPost = () => {
    if (slug) {
      navigate(`/post/${slug}`);
    } else {
      // Fallback to ID if slug not found
      navigate(`/post/${c.postId}`);
    }
  };

  return (
    <Card className="hover:bg-muted/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-lg border px-2 py-1 text-xs text-muted-foreground">Comment</div>
          <div className="min-w-0 flex-1">
            <p className="text-sm">{c.content}</p>
            <p className="text-xs text-muted-foreground mt-1">
              En: <span className="font-medium">{c.postTitle}</span> • {formatDate(c.createdAt)}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleGoToPost}>Ir al post</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SavedRow({ p }: { p: Post }) {
  return (
    <Card className="hover:bg-muted/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-lg border px-2 py-1 text-xs text-muted-foreground">Saved</div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{p.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{p.createdAt} • {p.likesCount} likes • {p.commentsCount} comentarios</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost">Ver</Button>
            <Button size="sm" variant="outline">Quitar</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BookmarkedPostRow({ post, onRemove }: { post: Post; onRemove: () => void }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveBookmark = async () => {
    setIsRemoving(true);
    try {
      await bookmarkService.toggleBookmark(post.id);
      onRemove();
      toast({
        title: "Post eliminado",
        description: "Se ha quitado de tus guardados",
      });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast({
        title: "Error",
        description: "No se pudo quitar el post de guardados",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const handleViewPost = () => {
    navigate(`/post/${post.slug}`);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return "hoy";
      if (diffInDays === 1) return "hace 1 día";
      if (diffInDays < 7) return `hace ${diffInDays} días`;
      if (diffInDays < 30) return `hace ${Math.floor(diffInDays / 7)} sem`;
      return `hace ${Math.floor(diffInDays / 30)} mes`;
    } catch {
      return "—";
    }
  };

  return (
    <Card className="hover:bg-muted/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-lg border px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
            <Bookmark className="h-3 w-3 inline mr-1" />
            Guardado
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{post.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDate(post.createdAt)} • {post.likesCount} likes • {post.commentsCount} comentarios
            </p>
            {post.excerpt && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={handleViewPost}>
              Ver
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRemoveBookmark}
              disabled={isRemoving}
            >
              {isRemoving ? "..." : "Quitar"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ icon, title, children }: { icon: React.ReactNode; title: string; children?: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-10 text-center">
        <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-muted">{icon}</div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{children}</p>
      </CardContent>
    </Card>
  );
}
