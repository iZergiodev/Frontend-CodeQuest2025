import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import {
  Eye,
  ArrowLeft,
  Image as ImageIcon,
  Tag,
  X,
  BookOpen,
  Calendar,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOpen } from "@/hooks/useOpen";
import { FloatingEdgeButton } from "@/components/FloatingEdgeButton";
import { useAuth } from "@/hooks/useAuth";
import { useCreatePost, useUpdatePost, useCategories, useSubcategoriesByCategory, usePostIdFromSlug, usePost } from "@/services/postsService";
import { useToast } from "@/hooks/use-toast";
import { useImageUpload } from "@/hooks/useImageUpload";

const CreatePost = () => {
  const { isOpen } = useOpen();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { slug } = useParams<{ slug?: string }>();

  // Detect if we're in edit mode
  const isEditMode = !!slug;
  const { postId, isLoading: slugLoading } = usePostIdFromSlug(slug || "");
  const { data: existingPost, isLoading: postLoading } = usePost(postId || "");

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
  const { data: subcategories = [], isLoading: subcategoriesLoading } = useSubcategoriesByCategory(Number(formData.categoryId));
  
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const { uploadPostCover, isUploading: isUploadingCover, uploadError: coverUploadError } = useImageUpload();

  // Load existing post data when in edit mode
  useEffect(() => {
    if (isEditMode && existingPost) {
      // Check if user is the author or an admin
      if (user && existingPost.authorId !== user.id && user.role?.toLowerCase() !== 'admin') {
        toast({
          title: "Acceso denegado",
          description: "Solo puedes editar tus propios posts",
          variant: "destructive",
        });
        navigate(-1);
        return;
      }

      setFormData({
        title: existingPost.title,
        summary: existingPost.excerpt || "",
        content: existingPost.content,
        categoryId: existingPost.category?.id?.toString() || "",
        subcategoryId: existingPost.subcategory?.id?.toString() || "",
        imageUrl: existingPost.coverImage || "",
        tags: existingPost.tags || [],
      });
    }
  }, [isEditMode, existingPost, user, toast, navigate]);

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

  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const uploadResult = await uploadPostCover(file);
        setFormData(prev => ({
          ...prev,
          imageUrl: uploadResult.secure_url
        }));
        
        toast({
          title: "Cover image uploaded!",
          description: "Your post cover has been uploaded successfully.",
        });
      } catch (error) {
        console.error('Cover image upload error:', error);
        toast({
          title: "Error de carga",
          description: coverUploadError || "No se pudo subir la imagen de portada. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    }
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

    if (!formData.categoryId) {
      toast({
        title: "Error",
        description: "Debes seleccionar una categoría",
        variant: "destructive",
      });
      return;
    }

    if (!formData.subcategoryId) {
      toast({
        title: "Error",
        description: "Debes seleccionar una subcategoría",
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

      if (isEditMode && postId) {
        // Update existing post
        await updatePostMutation.mutateAsync({
          id: postId,
          postData,
        });

        toast({
          title: "¡Éxito!",
          description: "Post actualizado exitosamente!",
        });

        navigate(`/post/${existingPost?.slug}`);
      } else {
        // Create new post
        await createPostMutation.mutateAsync({
          postData,
          authorId: user.id,
        });

        toast({
          title: "¡Éxito!",
          description: status === "published" ? "Post publicado exitosamente!" : "Borrador guardado!",
        });

        navigate("/");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      
      let errorMessage = isEditMode 
        ? "No se pudo actualizar el post. Inténtalo de nuevo."
        : "No se pudo crear el post. Inténtalo de nuevo.";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.status === 401) {
          errorMessage = "No estás autenticado. Por favor, inicia sesión.";
        } else if (axiosError.response?.status === 400) {
          errorMessage = "Datos inválidos. Verifica que todos los campos estén correctos.";
        } else if (axiosError.response?.status === 403) {
          errorMessage = "No tienes permisos para editar este post.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Show loading state when in edit mode and post is still loading
  if (isEditMode && (slugLoading || postLoading)) {
    return (
      <div className="bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando post para editar...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 py-8">
        <div ref={postRef} className="mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {isEditMode ? "Editar Post" : "Crear Nuevo Post"}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                {isEditMode 
                  ? "Modifica tu post y actualiza los cambios"
                  : "Escribe y publica contenido increíble para tu audiencia"
                }
              </p>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={() => handleSubmit("published")}
                disabled={!formData.title || !formData.content || !formData.categoryId || !formData.subcategoryId || createPostMutation.isPending || updatePostMutation.isPending}
                className="bg-devtalles-gradient hover:opacity-90 w-full sm:w-auto"
              >
                {createPostMutation.isPending || updatePostMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {isEditMode ? "Actualizar Post" : "Publicar"}
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
                    </div>
                    <div className="mt-2">
                      <MarkdownEditor
                        value={formData.content}
                        onChange={(val) => setFormData(prev => ({ ...prev, content: val || "" }))}
                        placeholder="Escribe tu contenido aquí..."
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
                      Categoría *
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
                        Subcategoría *
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
                        placeholder="URL de la imagen o sube una nueva..."
                        value={formData.imageUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                        disabled={isUploadingCover}
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
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageUpload}
                            className="hidden"
                            id="cover-image-upload"
                            disabled={isUploadingCover}
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            disabled={isUploadingCover}
                            onClick={() => document.getElementById('cover-image-upload')?.click()}
                          >
                            {isUploadingCover ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Subiendo...
                              </>
                            ) : (
                              <>
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Subir Imagen
                              </>
                            )}
                          </Button>
                        </div>
                        {formData.imageUrl && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                            disabled={isUploadingCover}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {isUploadingCover && (
                        <p className="text-sm text-orange-600">
                          Subiendo imagen de portada...
                        </p>
                      )}
                      {coverUploadError && (
                        <p className="text-sm text-red-600">
                          {coverUploadError}
                        </p>
                      )}
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