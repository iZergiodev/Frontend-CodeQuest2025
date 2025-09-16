import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      {/* Título de la página */}
      <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>

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
              <Input defaultValue={user?.email ?? ""} readOnly className="bg-muted/40" />
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
