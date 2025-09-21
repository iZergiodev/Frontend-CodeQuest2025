import apiClient from "@/lib/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface CommentDto {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  postId: number;
  postTitle: string;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  parentId?: number;
  replies: CommentDto[];
  likesCount: number;
  repliesCount: number;
}

export interface CreateCommentDto {
  content: string;
  postId: number;
  parentId?: number;
}

export interface UpdateCommentDto {
  content: string;
}

class CommentsService {
  private baseUrl = "/api/Comments";

  async getAllComments(): Promise<CommentDto[]> {
    const response = await apiClient.get(this.baseUrl);
    return response.data;
  }

  async getComment(id: string): Promise<CommentDto> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getCommentsByPost(postId: string): Promise<CommentDto[]> {
    const response = await apiClient.get(`${this.baseUrl}/post/${postId}`);
    return response.data;
  }

  async getCommentsByAuthor(authorId: string): Promise<CommentDto[]> {
    const response = await apiClient.get(`${this.baseUrl}/author/${authorId}`);
    return response.data;
  }

  async createComment(commentData: CreateCommentDto): Promise<CommentDto> {
    const response = await apiClient.post(this.baseUrl, commentData);
    return response.data;
  }

  async updateComment(
    id: string,
    commentData: UpdateCommentDto
  ): Promise<CommentDto> {
    const response = await apiClient.put(`${this.baseUrl}/${id}`, commentData);
    return response.data;
  }

  async deleteComment(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  async getCommentCountByAuthor(
    authorId: string
  ): Promise<{ authorId: number; count: number }> {
    const response = await apiClient.get(
      `${this.baseUrl}/author/${authorId}/count`
    );
    return response.data;
  }
}

export const commentsService = new CommentsService();

// React Query hooks for comments
export const useComments = () => {
  return useQuery({
    queryKey: ["comments"],
    queryFn: () => commentsService.getAllComments(),
  });
};

export const useComment = (id: string) => {
  return useQuery({
    queryKey: ["comments", id],
    queryFn: () => commentsService.getComment(id),
    enabled: !!id,
  });
};

export const useCommentsByPost = (postId: string) => {
  return useQuery({
    queryKey: ["comments", "post", postId],
    queryFn: () => commentsService.getCommentsByPost(postId),
    enabled: !!postId,
  });
};

export const useCommentsByAuthor = (authorId: string) => {
  return useQuery({
    queryKey: ["comments", "author", authorId],
    queryFn: () => commentsService.getCommentsByAuthor(authorId),
    enabled: !!authorId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentData: CreateCommentDto) =>
      commentsService.createComment(commentData),
    onSuccess: (data) => {
      // Invalidate and refetch comments for the post
      queryClient.invalidateQueries({
        queryKey: ["comments", "post", data.postId.toString()],
      });
      // Invalidate comments count for the post
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      commentData,
    }: {
      id: string;
      commentData: UpdateCommentDto;
    }) => commentsService.updateComment(id, commentData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", "post", data.postId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["comments", data.id.toString()],
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => commentsService.deleteComment(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
