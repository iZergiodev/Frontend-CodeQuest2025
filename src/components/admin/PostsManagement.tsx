import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePosts } from "@/services/postsService";
import { PostsSection } from "@/components/PostsSection";
import { FileText } from "lucide-react";

export const PostsManagement = () => {
  const navigate = useNavigate();
  const { data: posts = [], isLoading, error } = usePosts();

  return (
    <PostsSection
      posts={posts}
      isLoading={isLoading}
      error={error}
      showFilters={true}
      layout="admin"
      isAdminView={true}
      title="Gestión de Posts"
      description="Administra los posts del blog"
      emptyTitle="No se encontraron posts"
      emptyIcon={<FileText className="h-12 w-12" />}
    />
  );
};