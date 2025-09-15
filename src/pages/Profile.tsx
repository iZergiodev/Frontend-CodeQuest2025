import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Stars, User, Shield } from "lucide-react";
import Header from "@/components/Header";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return null;
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getProviderInfo = (provider: "email" | "discord") => {
    return provider === "discord" 
      ? { name: "Discord", color: "bg-[#5865F2]", textColor: "text-[#5865F2]" }
      : { name: "Email", color: "bg-blue-500", textColor: "text-blue-500" };
  };

  const providerInfo = getProviderInfo(user.provider);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4 hover:bg-muted"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">Mi Perfil</h1>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24 border-4 border-primary/10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                <Badge variant="outline" className={`${providerInfo.textColor} border-current`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {providerInfo.name}
                </Badge>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="break-all">{user.email}</span>
                </div>
                
                {user.stardustPoints !== undefined && (
                  <div className="flex items-center gap-3 text-sm">
                    <Stars className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{user.stardustPoints.toLocaleString()} Stardust Points</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>ID: {user.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats and Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Stars className="h-5 w-5 text-yellow-500" />
                    Stardust Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {user.stardustPoints?.toLocaleString() || "0"}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Puntos acumulados por tu actividad
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Método de Acceso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${providerInfo.color}`}></div>
                    <span className="font-medium">{providerInfo.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {user.provider === "discord" ? "Conectado a través de Discord" : "Acceso con email y contraseña"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <Card>
              <CardHeader>
                <CardTitle>Información de la Cuenta</CardTitle>
                <CardDescription>
                  Detalles de tu perfil de DevTalles Community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
                    <p className="mt-1 text-sm">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="mt-1 text-sm break-all">{user.email}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">ID de Usuario</label>
                    <p className="mt-1 text-sm font-mono text-xs bg-muted px-2 py-1 rounded">
                      {user.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Proveedor</label>
                    <p className="mt-1 text-sm capitalize">{user.provider}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones de Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" disabled>
                    Editar Perfil
                  </Button>
                  <Button variant="outline" disabled>
                    Configuración de Privacidad
                  </Button>
                  <Button variant="outline" disabled>
                    Historial de Actividad
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Estas funciones estarán disponibles próximamente
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;