import apiClient from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

class LikesService {
  private commentLikesBaseUrl = "/api/CommentLike";
  private postLikesBaseUrl = "/api/PostLike";

  // Comment Likes
  async likeComment(commentId: number): Promise<{ message: string }> {
    const response = await apiClient.post(
      `${this.commentLikesBaseUrl}/${commentId}/like`
    );
    return response.data;
  }

  async unlikeComment(commentId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(
      `${this.commentLikesBaseUrl}/${commentId}/like`
    );
    return response.data;
  }

  async toggleCommentLike(
    commentId: number
  ): Promise<{ message: string; liked: boolean }> {
    const url = `${this.commentLikesBaseUrl}/${commentId}/toggle`;
    const response = await apiClient.post(url);
    return response.data;
  }

  async getCommentLikesCount(
    commentId: number
  ): Promise<{ commentId: number; likesCount: number }> {
    const response = await apiClient.get(
      `${this.commentLikesBaseUrl}/${commentId}/likes/count`
    );
    return response.data;
  }

  async isCommentLikedByUser(
    commentId: number
  ): Promise<{ commentId: number; isLiked: boolean }> {
    const response = await apiClient.get(
      `${this.commentLikesBaseUrl}/${commentId}/is-liked`
    );
    return response.data;
  }

  // Post Likes
  async likePost(postId: number): Promise<{ message: string }> {
    const response = await apiClient.post(
      `${this.postLikesBaseUrl}/${postId}/like`
    );
    return response.data;
  }

  async unlikePost(postId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(
      `${this.postLikesBaseUrl}/${postId}/like`
    );
    return response.data;
  }

  async togglePostLike(
    postId: number
  ): Promise<{ message: string; liked: boolean }> {
    const response = await apiClient.post(
      `${this.postLikesBaseUrl}/${postId}/toggle`
    );
    return response.data;
  }

  async getPostLikesCount(
    postId: number
  ): Promise<{ postId: number; likesCount: number }> {
    const response = await apiClient.get(
      `${this.postLikesBaseUrl}/${postId}/likes/count`
    );
    return response.data;
  }

  async isPostLikedByUser(
    postId: number
  ): Promise<{ postId: number; isLiked: boolean }> {
    const response = await apiClient.get(
      `${this.postLikesBaseUrl}/${postId}/is-liked`
    );
    return response.data;
  }
}

export const likesService = new LikesService();

// React Query hooks for comment likes
export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => likesService.likeComment(commentId),
    onSuccess: (_, commentId) => {
      // Invalidate comments queries
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      // Invalidate specific comment queries
      queryClient.invalidateQueries({
        queryKey: ["comments", commentId.toString()],
      });
    },
  });
};

export const useUnlikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => likesService.unlikeComment(commentId),
    onSuccess: (_, commentId) => {
      // Invalidate comments queries
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      // Invalidate specific comment queries
      queryClient.invalidateQueries({
        queryKey: ["comments", commentId.toString()],
      });
    },
  });
};

// React Query hooks for post likes
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => likesService.likePost(postId),
    onSuccess: (_, postId) => {
      // Invalidate posts queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      // Invalidate specific post queries
      queryClient.invalidateQueries({ queryKey: ["posts", postId.toString()] });
    },
  });
};

export const useUnlikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => likesService.unlikePost(postId),
    onSuccess: (_, postId) => {
      // Invalidate posts queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      // Invalidate specific post queries
      queryClient.invalidateQueries({ queryKey: ["posts", postId.toString()] });
    },
  });
};

// Toggle hooks for easier use
export const useToggleCommentLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) =>
      likesService.toggleCommentLike(commentId),
    onMutate: async (commentId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments"] });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(["comments"]);

      // Optimistically update the comments
      queryClient.setQueryData(["comments"], (old: any) => {
        if (!old) return old;

        const updateCommentLikes = (comments: any[]): any[] => {
          return comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likesCount: comment.isLikedByUser
                  ? comment.likesCount - 1
                  : comment.likesCount + 1,
                isLikedByUser: !comment.isLikedByUser,
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateCommentLikes(comment.replies),
              };
            }
            return comment;
          });
        };

        return Array.isArray(old) ? updateCommentLikes(old) : old;
      });

      // Return a context object with the snapshotted value
      return { previousComments };
    },
    onError: (err, commentId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousComments) {
        queryClient.setQueryData(["comments"], context.previousComments);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

export const useTogglePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => likesService.togglePostLike(postId),
    onMutate: async (postId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the previous values
      const previousPosts = queryClient.getQueryData(["posts"]);
      const previousPost = queryClient.getQueryData([
        "posts",
        postId.toString(),
      ]);

      // Optimistically update the posts list
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old || !Array.isArray(old)) return old;

        return old.map((post: any) => {
          if (post.id === postId.toString()) {
            return {
              ...post,
              likesCount: post.isLikedByUser
                ? post.likesCount - 1
                : post.likesCount + 1,
              isLikedByUser: !post.isLikedByUser,
            };
          }
          return post;
        });
      });

      // Optimistically update the specific post
      queryClient.setQueryData(["posts", postId.toString()], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          likesCount: old.isLikedByUser
            ? old.likesCount - 1
            : old.likesCount + 1,
          isLikedByUser: !old.isLikedByUser,
        };
      });

      // Return a context object with the snapshotted values
      return { previousPosts, previousPost };
    },
    onError: (err, postId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      if (context?.previousPost) {
        queryClient.setQueryData(
          ["posts", postId.toString()],
          context.previousPost
        );
      }
    },
    onSettled: (data, error, postId) => {
      // Always refetch after error or success to ensure server state
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", postId.toString()] });
    },
  });
};
