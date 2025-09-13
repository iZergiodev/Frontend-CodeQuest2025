import { useState } from "react";
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
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOpen } from "@/hooks/useOpen";

const CreatePost = () => {
  const {isOpen} = useOpen();

  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    image: "",
    tags: [] as string[],
    status: "draft"
  });
  
  const [newTag, setNewTag] = useState("");
  const [previewMode, setPreviewMode] = useState<"edit" | "live" | "preview">("live");

  const categories = ["React", "Node.js", "TypeScript", "Vue.js", "DevOps", "JavaScript", "CSS", "Python"];

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

  const handleSubmit = (status: "draft" | "published") => {
    // Here you would normally save to your backend
    console.log("Saving post:", { ...formData, status });
    
    // Show success message and redirect
    alert(status === "published" ? "Post publicado exitosamente!" : "Borrador guardado!");
    navigate("/admin");
  };

  return (
    <div className="bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto">
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
                disabled={!formData.title}
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Borrador
              </Button>
              <Button 
                onClick={() => handleSubmit("published")}
                disabled={!formData.title || !formData.content}
                className="bg-devtalles-gradient hover:opacity-90"
              >
                <Eye className="h-4 w-4 mr-2" />
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
                    <Label htmlFor="excerpt" className="text-sm font-medium">
                      Extracto
                    </Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Breve descripción que aparecerá en las tarjetas de preview..."
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
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
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="image" className="text-sm font-medium">
                      Imagen de Portada
                    </Label>
                    <div className="mt-2 space-y-2">
                      <Input
                        id="image"
                        placeholder="URL de la imagen..."
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      />
                      {formData.image && (
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                          <img 
                            src={formData.image} 
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
      <button
        onClick={() => navigate(-1)}
        className={`p-1.5 fixed top-36 -translate-y-1/2 ${isOpen ? 'left-[25.5rem]' : 'left-[17rem]'} -translate-x-1/2 z-50 rounded-full shadow-lg ring-1 ring-black/5 p-0 bg-white text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:ring-white/10 transition-all duration-300 ease-in-out`}
      >
        <ArrowLeft className="h-6 w-6 text-muted-foreground" />
      </button>
    </div>
  );
};

export default CreatePost;