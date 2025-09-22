import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Users,
  Eye,
  MessageCircle,
  Crown,
  Folder,
  Tag
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CategoriesManagement } from "@/components/admin/CategoriesManagement";
import { SubcategoriesManagement } from "@/components/admin/SubcategoriesManagement";
import { PostsManagement } from "@/components/admin/PostsManagement";
import { useAuth } from "@/hooks/useAuth";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if user is admin
  if (!user || user.role?.toLowerCase() !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader className="text-center">
            <Crown className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            <CardTitle>Acceso Denegado</CardTitle>
            <CardDescription>
              Solo los administradores pueden acceder a esta página.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate("/")} className="w-full">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Mock data for admin dashboard
  const stats = {
    totalPosts: 24,
    totalUsers: 156,
    totalViews: 12450,
    totalComments: 234
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Crown className="h-6 w-6 text-yellow-500 fill-current" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              Panel de Administración
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Gestiona categorías, subcategorías y posts desde aquí. Controla todo el contenido y configuración del blog.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                +2 desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +12% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizaciones</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +8% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comentarios</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalComments}</div>
              <p className="text-xs text-muted-foreground">
                +5% desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="h-10 gap-1 rounded-full dark:bg-muted/70 bg-violet-200 p-1">
            <TabsTrigger className="rounded-full px-4 data-[state=active]:bg-background" value="posts">
              <FileText className="h-4 w-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger className="rounded-full px-4 data-[state=active]:bg-background" value="categories">
              <Folder className="h-4 w-4 mr-2" />
              Categorías
            </TabsTrigger>
            <TabsTrigger className="rounded-full px-4 data-[state=active]:bg-background" value="subcategories">
              <Tag className="h-4 w-4 mr-2" />
              Subcategorías
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <PostsManagement />
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <CategoriesManagement />
          </TabsContent>

          <TabsContent value="subcategories" className="space-y-4">
            <SubcategoriesManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
