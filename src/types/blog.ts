export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: number;
  authorId: number;
  authorAvatar?: string;
  authorName: string;
  category: Category;
  subcategory?: Subcategory;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  visitsCount: number;
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

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DiscordLoginUrlResponse {
  authUrl: string;
}

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
  followerCount?: number;
  isFollowing?: boolean;
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
  subcategory?: string;
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

export interface FollowSubcategoryDto {
  subcategoryId: number;
}

export interface FollowAllSubcategoriesDto {
  categoryId: number;
}

export interface SubcategoryWithFollowerCountDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  categoryId: string;
  categoryName?: string;
  followerCount: number;
}

export interface UserFollowsDto {
  followedSubcategories: Subcategory[];
}

export interface BookmarkDto {
  id: number;
  userId: number;
  postId: number;
  createdAt: string;
  post?: Post;
}

export interface CreateBookmarkDto {
  postId: number;
}

export interface BookmarkResponseDto {
  isBookmarked: boolean;
  bookmarkCount: number;
}

export interface UserBookmarksDto {
  bookmarks: BookmarkDto[];
  totalCount: number;
}
