export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: AuthUser;
  category: Category;
  subcategory?: Subcategory;
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

// Base user interface
export interface User {
  id: number;
  username?: string;
  email: string;
  name?: string;
  avatar?: string;
  biography?: string;
  role?: string;
  discordId?: string;
  discordUsername?: string;
  discordDiscriminator?: string;
  discordAvatar?: string;
  birthDate: string;
  createdAt: string;
  starDustPoints: number;
}

// User with computed properties for frontend display
export interface AuthUser extends User {
  // Computed properties for display
  displayName: string;
  bio?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface DiscordLoginUrlResponse {
  authUrl: string;
}

// Backend DTOs
export interface CreateUserDto {
  username?: string;
  password: string;
  email: string;
  role?: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

// Backend DTO (includes password for API calls)
export interface UserDto extends User {
  password?: string;
}

export interface UserRegisterDto {
  id?: string;
  email: string;
  password: string;
  username: string;
  role?: string;
  avatar?: string;
  biography?: string;
  birthDate: string;
  createdAt: string;
  starDustPoints: number;
}

export interface UserLoginResponseDto {
  user?: UserRegisterDto;
  token?: string;
  message?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  categoryId: string;
  categoryName?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: AuthUser;
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
  author: AuthUser;
  views: number;
  slug: string;
}

export interface RecentActivity {
  id: string;
  type: "post" | "comment" | "member";
  title: string;
  description: string;
  timestamp: string;
  user?: AuthUser;
}
