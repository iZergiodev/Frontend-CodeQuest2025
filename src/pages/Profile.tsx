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
  Shield, Stars, User, Bookmark, MessageSquare, FileText, Sparkles, ArrowLeft, Calendar,
} from "lucide-react";
import { useRef, useState } from "react";
import { FloatingEdgeButton } from "@/components/FloatingEdgeButton";
import { Button } from "@/components/ui/button";

/* Tipos y mocks igual que antes */
type Post = { id: string; title: string; createdAt: string; upvotes: number; comments: number };
type Comment = { id: string; body: string; createdAt: string; postTitle: string; upvotes: number };

const mockPosts: Post[] = [
  { id: "p1", title: "Mi setup de React 2025", createdAt: "hace 3 d", upvotes: 42, comments: 12 },
  { id: "p2", title: "Patrones útiles con Zustand", createdAt: "hace 1 sem", upvotes: 31, comments: 6 },
];

const mockComments: Comment[] = [
  { id: "c1", body: "Buen tip, también se puede con useMemo…", createdAt: "hace 2 d", postTitle: "Optimizar renders", upvotes: 8 },
  { id: "c2", body: "Me encantó el enfoque de los hooks!", createdAt: "hace 5 d", postTitle: "Hooks avanzados", upvotes: 5 },
];

const mockSaved: Post[] = [
  { id: "s1", title: "Guía de testing en React", createdAt: "hace 4 d", upvotes: 120, comments: 34 },
];

export const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [showPublicForm, setShowPublicForm] = useState(false);

  const handleBackClick = () => navigate(-1);

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

  /* Handlers para el formulario de Perfil público */
  const handleSavePublic = () => {
    // aquí iría tu lógica real de guardado
    setShowPublicForm(false);
  };
  const handleCancelPublic = () => setShowPublicForm(false);

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
              <Button variant="secondary" className="rounded-full" onClick={() => setShowPublicForm(v => !v)}>
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
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Nombre para mostrar</Label>
                      <Input defaultValue={user.name} placeholder="Tu nombre" />
                    </div>
                    <div className="space-y-2">
                      <Label>Nombre de usuario</Label>
                      <Input defaultValue={user.username ?? ""} placeholder="usuario" />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label>Bio</Label>
                      <Textarea placeholder="Cuéntanos algo sobre ti…" />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <Button className="rounded-full" onClick={handleSavePublic}>Guardar cambios</Button>
                      <Button variant="ghost" className="rounded-full" onClick={handleCancelPublic}>Cancelar</Button>
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
              <TabsList className="h-10 gap-1 rounded-full bg-muted/50 p-1">
                <TabsTrigger className="rounded-full px-4 data-[state=active]:bg-background" value="overview">
                  Overview
                </TabsTrigger>
                <TabsTrigger className="rounded-full px-4 data-[state=active]:bg-background" value="posts">
                  Posts
                </TabsTrigger>
                <TabsTrigger className="rounded-full px-4 data-[state=active]:bg-background" value="comments">
                  Comments
                </TabsTrigger>
                <TabsTrigger className="rounded-full px-4 data-[state=active]:bg-background" value="saved">
                  Saved
                </TabsTrigger>
              </TabsList>

              {/* OVERVIEW */}
              <TabsContent value="overview" className="space-y-4">
                {mockPosts.slice(0, 1).map(p => (
                  <PostRow key={p.id} p={p} />
                ))}
                {mockComments.slice(0, 2).map(c => (
                  <CommentRow key={c.id} c={c} />
                ))}
                {mockPosts.length === 0 && mockComments.length === 0 && (
                  <EmptyState icon={<Sparkles className="h-6 w-6" />} title="Aún no hay actividad">
                    Cuando publiques o comentes, verás tu actividad aquí.
                  </EmptyState>
                )}
              </TabsContent>

              {/* POSTS */}
              <TabsContent value="posts" className="space-y-3">
                {mockPosts.length ? mockPosts.map(p => <PostRow key={p.id} p={p} />) : (
                  <EmptyState icon={<FileText className="h-6 w-6" />} title="Sin posts aún">
                    Crea tu primer post y compártelo con la comunidad.
                  </EmptyState>
                )}
              </TabsContent>

              {/* COMMENTS */}
              <TabsContent value="comments" className="space-y-3">
                {mockComments.length ? mockComments.map(c => <CommentRow key={c.id} c={c} />) : (
                  <EmptyState icon={<MessageSquare className="h-6 w-6" />} title="Sin comentarios">
                    Comenta en algún post para empezar a participar.
                  </EmptyState>
                )}
              </TabsContent>

              {/* SAVED */}
              <TabsContent value="saved" className="space-y-3">
                {mockSaved.length ? mockSaved.map(s => <SavedRow key={s.id} p={s} />) : (
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
                <Button size="sm" variant="outline" disabled>Personalizar perfil</Button>
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
  return (
    <Card className="hover:bg-muted/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-lg border px-2 py-1 text-xs text-muted-foreground">Post</div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{p.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{p.createdAt} • {p.upvotes} upvotes • {p.comments} comentarios</p>
          </div>
          <Button variant="ghost" size="sm">Ver</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CommentRow({ c }: { c: Comment }) {
  return (
    <Card className="hover:bg-muted/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-lg border px-2 py-1 text-xs text-muted-foreground">Comment</div>
          <div className="min-w-0 flex-1">
            <p className="text-sm">{c.body}</p>
            <p className="text-xs text-muted-foreground mt-1">
              En: <span className="font-medium">{c.postTitle}</span> • {c.createdAt} • {c.upvotes} upvotes
            </p>
          </div>
          <Button variant="ghost" size="sm">Ir al post</Button>
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
            <p className="text-xs text-muted-foreground mt-0.5">{p.createdAt} • {p.upvotes} upvotes • {p.comments} comentarios</p>
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
