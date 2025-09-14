
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Shield, Stars, User, Bookmark, MessageSquare, FileText, Sparkles, Bell, Mail,
  ArrowLeft,
} from "lucide-react";
import { useRef, useState } from "react";
import { FloatingEdgeButton } from "@/shared/components/FloatingEdgeButton";
import { useOpen } from "@/hooks/useOpen";
import { Button } from "@/shared/components/ui/button";

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
  const {isOpen} = useOpen()
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>();
  const navegation = useNavigate()

  const handleBackClick = () => navegation(-1);

  if (!user) {
    navigate("/");
    return null;
  }

  const provider =
    user.discordId
      ? { name: "Discord", dot: "bg-[#5865F2]", text: "text-[#5865F2]" }
      : { name: "Email", dot: "bg-blue-500", text: "text-blue-500" };

  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-6xl px-4 py-6">
        {/* HEAD */}
        <div ref={contentRef} className="mb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-background shadow">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold leading-tight truncate">{user.name}</h1>
                <Badge variant="outline" className={`${provider.text} border-current`}>
                  <Shield className="mr-1 h-3.5 w-3.5" />
                  {provider.name}
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
                  <Stars className="h-4 w-4 text-yellow-500" />
                  {user.starDustPoints?.toLocaleString() ?? 0} Stardust
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  ID: {user.id}
                </span>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              <Button variant="secondary" className="rounded-full">Editar perfil</Button>
              <Button className="rounded-full">Crear post</Button>
            </div>
          </div>
        </div>

        {/* GRID 12: contenido + sidebar */}
        <div className="grid gap-6 lg:grid-cols-12">
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
                <TabsTrigger className="rounded-full px-4 data-[state=active]:bg-background" value="settings">
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* OVERVIEW: mezcla ligera de posts + comments */}
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

              {/* SETTINGS */}
              <TabsContent value="settings">
                <SettingsPanel
                  defaultName={user.name}
                  defaultUsername={user.username ?? ""}
                  defaultEmail={user.email}
                />
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
        </div>
      </main>
      <FloatingEdgeButton
        referenceRef={contentRef}
        onClick={handleBackClick}
        label="Volver"
        hideBelow="lg"
        topPx={126}
        offsetMain={20}
        watch={isOpen}
        className="cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </FloatingEdgeButton>
    </div>
  );
}

/* ---------- Subcomponentes ---------- */

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

/* ---------- Settings Panel ---------- */

function SettingsPanel({
  defaultName,
  defaultUsername,
  defaultEmail,
}: {
  defaultName: string;
  defaultUsername: string;
  defaultEmail: string;
}) {
  return (
    <div className="space-y-6">
      {/* Perfil público */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Perfil público</CardTitle>
          <CardDescription>Controla cómo te ve la comunidad</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Nombre para mostrar</Label>
            <Input defaultValue={defaultName} placeholder="Tu nombre" />
          </div>
          <div className="space-y-2">
            <Label>Nombre de usuario</Label>
            <Input defaultValue={defaultUsername} placeholder="usuario" />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Label>Bio</Label>
            <Textarea placeholder="Cuéntanos algo sobre ti…" />
          </div>
          <div className="sm:col-span-2">
            <Button className="rounded-full">Guardar cambios</Button>
          </div>
        </CardContent>
      </Card>

      {/* Cuenta */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Cuenta</CardTitle>
          <CardDescription>Datos privados y seguridad</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input defaultValue={defaultEmail} readOnly className="bg-muted/40" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Contraseña actual</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label>Nueva contraseña</Label>
            <Input type="password" placeholder="Al menos 8 caracteres" />
          </div>
          <div className="space-y-2">
            <Label>Confirmar contraseña</Label>
            <Input type="password" placeholder="Repite la contraseña" />
          </div>
          <div className="sm:col-span-2">
            <Button variant="outline" className="rounded-full">Actualizar contraseña</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Notificaciones</CardTitle>
          <CardDescription>Elige qué quieres recibir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NotifyRow label="Menciones y respuestas" />
          <NotifyRow label="Nuevos comentarios en mis posts" />
          <NotifyRow label="Boletín y novedades" />
          <Separator />
          <div className="flex justify-end">
            <Button className="rounded-full">
              <Bell className="mr-2 h-4 w-4" /> Guardar preferencias
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotifyRow({ label }: { label: string }) {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">Email y push (si están disponibles)</p>
      </div>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}
