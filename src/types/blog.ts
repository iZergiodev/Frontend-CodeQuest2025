export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: User;
  category: Category;
  tags: string[];
  likes: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  coverImage?: string;
  readTime: number;
  published: boolean;
  featured: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  displayName: string;
  bio?: string;
  role: "admin" | "user";
  discordId?: string;
  createdAt: string;
}

// Authentication related types
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  displayName: string;
  bio?: string;
  role: "admin" | "user";
  discordId?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface DiscordLoginUrlResponse {
  authUrl: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  parentId?: string;
  replies?: Comment[];
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFilters {
  category?: string;
  search?: string;
  tag?: string;
  author?: string;
  sortBy?: "latest" | "popular" | "trending";
}

export interface TrendingPost {
  id: string;
  title: string;
  author: User;
  views: number;
  slug: string;
}

export interface RecentActivity {
  id: string;
  type: "post" | "comment" | "member";
  title: string;
  description: string;
  timestamp: string;
  user?: User;
}
