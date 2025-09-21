import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/api-client";
import type {
  Post,
  Category,
  Subcategory,
  PaginatedResult,
  PaginationParams,
} from "../types/blog";

interface PostDto {
  id: number;
  title: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  authorAvatar?: string;
  authorName: string;
  categoryId?: number;
  categoryName?: string;
  categoryColor?: string;
  subcategoryId?: number;
  subcategoryName?: string;
  subcategoryColor?: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  visitsCount: number;
  isLikedByUser?: boolean;
}

interface CreatePostDto {
  title: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  categoryId?: number;
  subcategoryId?: number;
  tags?: string[];
}

interface CategoryDto {
  id: number;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

interface SubcategoryDto {
  id: number;
  name: string;
  description?: string;
  color?: string;
  categoryId: number;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}

const transformPostDto = (dto: PostDto): Post => {
  return {
    id: dto.id.toString(),
    title: dto.title,
    content: dto.content,
    excerpt: dto.summary || "Sin resumen",
    author: dto.authorId,
    authorId: dto.authorId,
    authorAvatar: dto.authorAvatar,
    authorName: dto.authorName,
    category: {
      id: dto.categoryId || 0,
      name: dto.categoryName || "Sin categoría",
      slug:
        dto.categoryName?.toLowerCase().replace(/\s+/g, "-") || "sin-categoria",
      description: "",
      color: dto.categoryColor || "#6366f1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    subcategory: dto.subcategoryId
      ? {
          id: dto.subcategoryId,
          name: dto.subcategoryName || "",
          slug: dto.subcategoryName?.toLowerCase().replace(/\s+/g, "-") || "",
          description: "",
          color: dto.subcategoryColor || "#6366f1",
          categoryId: dto.categoryId || 0,
          categoryName: dto.categoryName || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : undefined,
    tags: dto.tags,
    likesCount: dto.likesCount,
    commentsCount: dto.commentsCount,
    visitsCount: dto.visitsCount,
    isLikedByUser: dto.isLikedByUser,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    slug: dto.title.toLowerCase().replace(/\s+/g, "-"),
    coverImage: dto.imageUrl,
    readTime: Math.ceil(dto.content.length / 1000), // Estimate
    published: true,
    featured: false,
  };
};

const transformCategoryDto = (dto: CategoryDto): Category => {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.name.toLowerCase().replace(/\s+/g, "-"),
    description: dto.description || "",
    color: dto.color || "#6366f1",
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
};

const transformSubcategoryDto = (dto: SubcategoryDto): Subcategory => {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.name.toLowerCase().replace(/\s+/g, "-"),
    description: dto.description || "",
    color: dto.color || "#6366f1",
    categoryId: dto.categoryId,
    categoryName: dto.categoryName || "",
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
};

// API functions
const postsApi = {
  getAllPosts: async (): Promise<Post[]> => {
    const response = await apiClient.get<PostDto[]>("/api/posts");
    return response.data.map(transformPostDto);
  },

  getPostById: async (id: string): Promise<Post> => {
    const response = await apiClient.get<PostDto>(`/api/posts/${id}`);
    return transformPostDto(response.data);
  },

  getPostsByAuthor: async (authorId: number): Promise<Post[]> => {
    const response = await apiClient.get<PostDto[]>(
      `/api/posts/author/${authorId}`
    );
    return response.data.map(transformPostDto);
  },

  getPostsByCategory: async (categoryId: number): Promise<Post[]> => {
    const response = await apiClient.get<PostDto[]>(
      `/api/posts/category/${categoryId}`
    );
    return response.data.map(transformPostDto);
  },

  createPost: async (
    postData: CreatePostDto,
    authorId: number
  ): Promise<Post> => {
    const response = await apiClient.post<PostDto>(
      `/api/posts?authorId=${authorId}`,
      postData
    );
    return transformPostDto(response.data);
  },

  updatePost: async (id: string, postData: CreatePostDto): Promise<Post> => {
    const response = await apiClient.put<PostDto>(`/api/posts/${id}`, postData);
    return transformPostDto(response.data);
  },

  deletePost: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/posts/${id}`);
  },
};

const categoriesApi = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<CategoryDto[]>("/api/categories");
    return response.data.map(transformCategoryDto);
  },

  getCategoryById: async (id: number): Promise<Category> => {
    const response = await apiClient.get<CategoryDto>(`/api/categories/${id}`);
    return transformCategoryDto(response.data);
  },

  getCategoryByName: async (name: string): Promise<Category> => {
    const response = await apiClient.get<CategoryDto>(
      `/api/categories/name/${name}`
    );
    return transformCategoryDto(response.data);
  },

  createCategory: async (categoryData: {
    name: string;
    description?: string;
    color?: string;
  }): Promise<Category> => {
    const response = await apiClient.post<CategoryDto>(
      "/api/categories",
      categoryData
    );
    return transformCategoryDto(response.data);
  },

  updateCategory: async (
    id: number,
    categoryData: { name?: string; description?: string; color?: string }
  ): Promise<Category> => {
    const response = await apiClient.put<CategoryDto>(
      `/api/categories/${id}`,
      categoryData
    );
    return transformCategoryDto(response.data);
  },

  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/categories/${id}`);
  },
};

const subcategoriesApi = {
  getAllSubcategories: async (): Promise<Subcategory[]> => {
    const response = await apiClient.get<SubcategoryDto[]>(
      "/api/subcategories"
    );
    return response.data.map(transformSubcategoryDto);
  },

  getSubcategoryById: async (id: number): Promise<Subcategory> => {
    const response = await apiClient.get<SubcategoryDto>(
      `/api/subcategories/${id}`
    );
    return transformSubcategoryDto(response.data);
  },

  getSubcategoriesByCategory: async (
    categoryId: number
  ): Promise<Subcategory[]> => {
    const response = await apiClient.get<SubcategoryDto[]>(
      `/api/subcategories/category/${categoryId}`
    );
    return response.data.map(transformSubcategoryDto);
  },
};

// React Query hooks for posts
export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: postsApi.getAllPosts,
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => postsApi.getPostById(id),
    enabled: !!id,
  });
};

export const usePostsByAuthor = (authorId: number) => {
  return useQuery({
    queryKey: ["posts", "author", authorId],
    queryFn: () => postsApi.getPostsByAuthor(authorId),
    enabled: !!authorId,
  });
};

export const usePostsByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ["posts", "category", categoryId],
    queryFn: () => postsApi.getPostsByCategory(categoryId),
    enabled: !!categoryId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postData,
      authorId,
    }: {
      postData: CreatePostDto;
      authorId: number;
    }) => postsApi.createPost(postData, authorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, postData }: { id: string; postData: CreatePostDto }) =>
      postsApi.updatePost(id, postData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", variables.id] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// React Query hooks for categories
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAllCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoriesApi.getCategoryById(id),
    enabled: !!id,
  });
};

export const useCategoryByName = (name: string) => {
  return useQuery({
    queryKey: ["categories", "name", name],
    queryFn: () => categoriesApi.getCategoryByName(name),
    enabled: !!name,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: {
      name: string;
      description?: string;
      color?: string;
    }) => categoriesApi.createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      categoryData,
    }: {
      id: number;
      categoryData: { name?: string; description?: string; color?: string };
    }) => categoriesApi.updateCategory(id, categoryData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", variables.id] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// React Query hooks for subcategories
export const useSubcategories = () => {
  return useQuery({
    queryKey: ["subcategories"],
    queryFn: subcategoriesApi.getAllSubcategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSubcategory = (id: number) => {
  return useQuery({
    queryKey: ["subcategories", id],
    queryFn: () => subcategoriesApi.getSubcategoryById(id),
    enabled: !!id,
  });
};

export const useSubcategoriesByCategory = (categoryId: number) => {
  return useQuery({
    queryKey: ["subcategories", "category", categoryId],
    queryFn: () => subcategoriesApi.getSubcategoriesByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Slug to ID mapping utilities
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD") // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks (accents)
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .trim();
};

export const findPostBySlug = (
  posts: Post[],
  slug: string
): Post | undefined => {
  return posts.find((post) => {
    const generatedSlug = generateSlug(post.title);
    // Try exact match first
    if (generatedSlug === slug) return true;

    // Try normalizing the input slug (in case it has accents)
    const normalizedSlug = slug
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .trim();

    return generatedSlug === normalizedSlug;
  });
};

export const findPostIdBySlug = (
  posts: Post[],
  slug: string
): string | undefined => {
  const post = findPostBySlug(posts, slug);
  return post?.id;
};

// Hook to get post ID from slug using all posts
export const usePostIdFromSlug = (slug: string) => {
  const { data: posts = [] } = usePosts();

  const postId = findPostIdBySlug(posts, slug);
  const post = findPostBySlug(posts, slug);

  // Debug logging
  console.log("Slug mapping debug:", {
    slug,
    postsCount: posts.length,
    postTitles: posts.map((p) => p.title),
    generatedSlugs: posts.map((p) => generateSlug(p.title)),
    foundPostId: postId,
    foundPost: post?.title,
  });

  return {
    postId,
    post,
    isLoading: !posts.length,
  };
};

// Hook to get post slug from ID using all posts
export const usePostSlugFromId = (id: string) => {
  const { data: posts = [] } = usePosts();

  const post = posts.find((p) => p.id === id);

  return {
    slug: post?.slug,
    post,
    isLoading: !posts.length,
  };
};

// Paginated API functions
export const getPaginatedPosts = async (
  params: PaginationParams
): Promise<PaginatedResult<Post>> => {
  const response = await apiClient.get<PaginatedResult<PostDto>>(
    `/api/Posts/paginated?page=${params.page}&pageSize=${params.pageSize}`
  );

  return {
    ...response.data,
    data: response.data.data.map(transformPostDto),
  };
};

export const getPaginatedPostsByAuthor = async (
  authorId: number,
  params: PaginationParams
): Promise<PaginatedResult<Post>> => {
  const response = await apiClient.get<PaginatedResult<PostDto>>(
    `/api/Posts/author/${authorId}/paginated?page=${params.page}&pageSize=${params.pageSize}`
  );

  return {
    ...response.data,
    data: response.data.data.map(transformPostDto),
  };
};

export const getPaginatedPostsByCategory = async (
  categoryId: number,
  params: PaginationParams
): Promise<PaginatedResult<Post>> => {
  const response = await apiClient.get<PaginatedResult<PostDto>>(
    `/api/Posts/category/${categoryId}/paginated?page=${params.page}&pageSize=${params.pageSize}`
  );

  return {
    ...response.data,
    data: response.data.data.map(transformPostDto),
  };
};

export const getPaginatedPostsBySubcategory = async (
  subcategoryId: number,
  params: PaginationParams
): Promise<PaginatedResult<Post>> => {
  const response = await apiClient.get<PaginatedResult<PostDto>>(
    `/api/Posts/subcategory/${subcategoryId}/paginated?page=${params.page}&pageSize=${params.pageSize}`
  );

  return {
    ...response.data,
    data: response.data.data.map(transformPostDto),
  };
};

export { postsApi, categoriesApi };
