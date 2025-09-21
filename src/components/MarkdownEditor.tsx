import React from 'react';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Escribe tu contenido aquí..."
}) => {
  const { uploadMarkdownImage, isUploading, uploadError } = useImageUpload();
  const { toast } = useToast();
  const { theme } = useTheme();

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const uploadResult = await uploadMarkdownImage(file);
      toast({
        title: "Image uploaded!",
        description: "Image has been uploaded successfully.",
      });
      return uploadResult.secure_url;
    } catch (error) {
      console.error('Markdown image upload error:', error);
      toast({
        title: "Error de carga",
        description: uploadError || "No se pudo subir la imagen. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          try {
            const imageUrl = await handleImageUpload(file);
            const imageMarkdown = `![${file.name}](${imageUrl})\n`;
            onChange(value + imageMarkdown);
          } catch (error) {
            console.error('Failed to upload pasted image:', error);
          }
        }
      }
    }
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          const imageUrl = await handleImageUpload(file);
          const imageMarkdown = `![${file.name}](${imageUrl})\n`;
          onChange(value + imageMarkdown);
        } catch (error) {
          console.error('Failed to upload dropped image:', error);
        }
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // Custom image command that handles file upload
  const customImageCommand = {
    ...commands.image,
    execute: async (state: any, api: any) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const imageUrl = await handleImageUpload(file);
            const imageMarkdown = `![${file.name}](${imageUrl})`;
            api.replaceSelection(imageMarkdown);
          } catch (error) {
            console.error('Failed to upload image:', error);
          }
        }
      };
      
      input.click();
    }
  };

  // Custom toolbar commands with our image upload
  const customCommands = [
    commands.title,
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.divider,
    commands.link,
    customImageCommand, // Our custom image command
    commands.quote,
    commands.code,
    commands.codeBlock,
    commands.divider,
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.checkedListCommand,
  ];

  return (
    <div 
      className="w-full"
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        data-color-mode={theme === "dark" ? "dark" : "light"}
        height={400}
        visibleDragbar={false}
        commands={customCommands}
        textareaProps={{
          placeholder: placeholder
        }}
      />
      
      {isUploading && (
        <p className="text-sm text-orange-600 mt-2">
          Subiendo imagen...
        </p>
      )}
      {uploadError && (
        <p className="text-sm text-red-600 mt-2">
          {uploadError}
        </p>
      )}
    </div>
  );
};
