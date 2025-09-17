import { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from '@uiw/react-md-editor';
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import {
  Save,
  Eye,
  ArrowLeft,
  Image as ImageIcon,
  Tag,
  X,
  BookOpen,
  Calendar,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOpen } from "@/hooks/useOpen";
import { FloatingEdgeButton } from "@/components/FloatingEdgeButton";
import { useAuth } from "@/hooks/useAuth";
import { useCreatePost, useCategories, useSubcategoriesByCategory } from "@/services/postsService";
import { useToast } from "@/hooks/use-toast";

const CreatePost = () => {
  const { isOpen } = useOpen();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    categoryId: "",
    subcategoryId: "",
    imageUrl: "",
    tags: [] as string[],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: subcategories = [], isLoading: subcategoriesLoading } = useSubcategoriesByCategory(formData.categoryId);
  
  const createPostMutation = useCreatePost();

  const [newTag, setNewTag] = useState("");
  const [previewMode, setPreviewMode] = useState<"edit" | "live" | "preview">("live");
  const postRef = useRef<HTMLDivElement>(null);



  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleBackClick = () => navigate(-1);


  if (!user) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (status: "draft" | "published") => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para crear un post",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "El título es obligatorio",
        variant: "destructive",
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Error",
        description: "El contenido es obligatorio",
        variant: "destructive",
      });
      return;
    }

    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        summary: formData.summary.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        subcategoryId: formData.subcategoryId ? parseInt(formData.subcategoryId) : undefined,
        tags: formData.tags,
      };

      console.log("Sending post data:", postData);
      console.log("Author ID:", user.id);

      await createPostMutation.mutateAsync({
        postData,
        authorId: user.id,
      });

      toast({
        title: "¡Éxito!",
        description: status === "published" ? "Post publicado exitosamente!" : "Borrador guardado!",
      });

      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      
      let errorMessage = "No se pudo crear el post. Inténtalo de nuevo.";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.status === 401) {
          errorMessage = "No estás autenticado. Por favor, inicia sesión.";
        } else if (axiosError.response?.status === 400) {
          errorMessage = "Datos inválidos. Verifica que todos los campos estén correctos.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 py-8">
        <div ref={postRef} className="mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            {/* <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button> */}

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">Crear Nuevo Post</h1>
              <p className="text-muted-foreground mt-1">
                Escribe y publica contenido increíble para tu audiencia
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSubmit("draft")}
                disabled={!formData.title || createPostMutation.isPending}
              >
                {createPostMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Guardar Borrador
              </Button>
              <Button
                onClick={() => handleSubmit("published")}
                disabled={!formData.title || !formData.content || createPostMutation.isPending}
                className="bg-devtalles-gradient hover:opacity-90"
              >
                {createPostMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                Publicar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Title */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Contenido Principal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">
                      Título del Post *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Escribe un título atractivo..."
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="mt-2 text-lg font-semibold"
                    />
                  </div>

                  <div>
                    <Label htmlFor="summary" className="text-sm font-medium">
                      Extracto
                    </Label>
                    <Textarea
                      id="summary"
                      placeholder="Breve descripción que aparecerá en las tarjetas de preview..."
                      value={formData.summary}
                      onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                      className="mt-2 min-h-[100px] resize-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="content" className="text-sm font-medium">
                        Contenido del Post *
                      </Label>
                      <div className="flex gap-1">
                        <Button
                          variant={previewMode === "edit" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPreviewMode("edit")}
                          className="text-xs px-2 py-1 h-7"
                        >
                          Editar
                        </Button>
                        <Button
                          variant={previewMode === "live" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPreviewMode("live")}
                          className="text-xs px-2 py-1 h-7"
                        >
                          En Vivo
                        </Button>
                        <Button
                          variant={previewMode === "preview" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPreviewMode("preview")}
                          className="text-xs px-2 py-1 h-7"
                        >
                          Vista Previa
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2" data-color-mode={theme === "dark" ? "dark" : "light"}>
                      <MDEditor
                        value={formData.content}
                        onChange={(val) => setFormData(prev => ({ ...prev, content: val || "" }))}
                        preview={previewMode}
                        hideToolbar={false}
                        height={400}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Editor Markdown con vista previa en tiempo real • Cambia entre modos usando los botones arriba
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Post Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Configuración
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">
                      Categoría
                    </Label>
                    <Select 
                      value={formData.categoryId} 
                      onValueChange={(value) => setFormData(prev => ({ 
                        ...prev, 
                        categoryId: value,
                        subcategoryId: "" // Reset subcategory when category changes
                      }))}
                      disabled={categoriesLoading}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder={categoriesLoading ? "Cargando categorías..." : "Selecciona una categoría"} />
                      </SelectTrigger>
                      <SelectContent>
                        {(categories as any[]).map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.categoryId && (
                    <div>
                      <Label htmlFor="subcategory" className="text-sm font-medium">
                        Subcategoría
                      </Label>
                      <Select 
                        value={formData.subcategoryId} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, subcategoryId: value }))}
                        disabled={subcategoriesLoading}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder={subcategoriesLoading ? "Cargando subcategorías..." : "Selecciona una subcategoría"} />
                        </SelectTrigger>
                        <SelectContent>
                          {(subcategories as any[]).map((subcategory) => (
                            <SelectItem key={subcategory.id} value={subcategory.id}>
                              {subcategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="imageUrl" className="text-sm font-medium">
                      Imagen de Portada
                    </Label>
                    <div className="mt-2 space-y-2">
                      <Input
                        id="imageUrl"
                        placeholder="URL de la imagen..."
                        value={formData.imageUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      />
                      {formData.imageUrl && (
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <Button variant="outline" size="sm" className="w-full">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Subir Imagen
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Etiquetas
                  </CardTitle>
                  <CardDescription>
                    Añade etiquetas para ayudar a organizar tu contenido
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nueva etiqueta..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTag()}
                        className="flex-1"
                      />
                      <Button onClick={addTag} size="sm" disabled={!newTag}>
                        Añadir
                      </Button>
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTag(tag)}
                              className="h-4 w-4 p-0 hover:bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
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
        offsetMain={12}
        watch={isOpen}
        className="cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </FloatingEdgeButton>
    </div>
  );
};

export default CreatePost;