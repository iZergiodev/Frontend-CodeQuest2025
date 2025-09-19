import React, { useState } from 'react';
import { useRankingData, usePopularPostsByCategory } from '../hooks/useRankingData';
import { PostCard } from '../components/PostCard';
import { LoadMoreButton } from '../components/LoadMoreButton';
import { BlogFilters } from '../components/Filters';
import { useCategories } from '../services/postsService';
import { RefreshCw, Star, TrendingUp, MessageCircle, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useLocation } from 'react-router-dom';
import type { BlogFilters as BlogFiltersType } from '../types/blog';
type RankingType = 'popular' | 'trending';

export default function PostRanking() {
  const location = useLocation();
  const isTrending = location.pathname === '/trending';
  const rankingType: RankingType = isTrending ? 'trending' : 'popular';

  const [filters, setFilters] = useState<BlogFiltersType>({
    category: undefined,
    subcategory: undefined,
    search: undefined,
    tag: undefined,
    author: undefined,
    sortBy: "latest"
  });
  const [displayLimit, setDisplayLimit] = useState(10);
  const { data: categories = [] } = useCategories();

  const selectedCategory = categories.find(c => c.slug === filters.category);
  const selectedCategoryId = selectedCategory ? selectedCategory.id : undefined;

  const {
    posts,
    loading,
    error,
    refresh
  } = useRankingData({
    type: rankingType,
    limit: displayLimit,
    categoryId: selectedCategoryId,
    subcategoryId: undefined, // We'll handle subcategory filtering differently
    autoRefresh: true,
    refreshInterval: rankingType === 'trending' ? 300000 : 600000 // 5 minutes for trending, 10 minutes for popular
  });


  const {
    postsByCategory,
    loading: loadingByCategory,
    error: errorByCategory
  } = usePopularPostsByCategory(5);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + 10);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const config = {
    popular: {
      icon: Star,
      iconColor: 'text-yellow-500',
      title: 'Posts Populares	',
      badge: { text: 'Más Querido', className: 'bg-yellow-100 text-yellow-800' },
      description: 'Los posts más queridos en la comunidad. Basado en el total de participación a lo largo del tiempo.',
      errorTitle: 'Error al cargar los posts populares',
      noPostsTitle: 'No hay posts populares',
      noPostsMessage: 'No hay posts populares en este momento. ¡Vuelve más tarde!',
      noPostsByCategoryTitle: 'No hay posts populares por categoría',
      noPostsByCategoryMessage: 'No hay posts populares organizados por categoría en este momento.',
      statsIcon: Star,
      statsIconColor: 'text-yellow-500'
    },
    trending: {
      icon: TrendingUp,
      iconColor: 'text-orange-500',
      title: 'Posts en Tendencia',
      badge: { text: 'Hot Now', className: 'bg-orange-100 text-orange-800' },
      description: 'Posts que están ganando momentum en este momento. Basado en la actividad reciente en las últimas 24 horas.',
      errorTitle: 'Error al cargar los posts en tendencia',
      noPostsTitle: 'No hay posts en tendencia',
      noPostsMessage: 'No hay posts en tendencia en este momento. ¡Vuelve más tarde!',
      noPostsByCategoryTitle: 'No hay posts en tendencia por categoría',
      noPostsByCategoryMessage: 'No hay posts en tendencia organizados por categoría en este momento.',
      statsIcon: TrendingUp,
      statsIconColor: 'text-orange-500'
    }
  };

  const currentConfig = config[rankingType];
  const IconComponent = currentConfig.icon;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">{currentConfig.errorTitle}</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={refresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate stats
  const totalLikes = posts.reduce((sum, post) => sum + post.likesCount, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.commentsCount, 0);
  const totalViews = posts.reduce((sum, post) => sum + post.visitsCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 ${isTrending ? 'bg-orange-500/10' : 'bg-yellow-500/10'} rounded-lg`}>
              <IconComponent className={`h-6 w-6 ${currentConfig.iconColor}`} />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              {currentConfig.title}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {currentConfig.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3">
              <IconComponent className={`h-8 w-8 ${currentConfig.iconColor}`} />
              <div>
                <h3 className="text-2xl font-bold text-foreground">{posts.length}</h3>
                <p className="text-muted-foreground">
                  {isTrending ? 'Posts en Tendencia' : 'Posts Populares'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="text-2xl font-bold text-foreground">{totalLikes}</h3>
                <p className="text-muted-foreground">Total Likes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="text-2xl font-bold text-foreground">{totalComments}</h3>
                <p className="text-muted-foreground">Total Comments</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Filters */}
          <div>
            <BlogFilters
              categories={categories}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              rankingType={true}
            />
          </div>


          {/* Posts */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <IconComponent className={`h-12 w-12 text-muted-foreground mx-auto mb-4`} />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {currentConfig.noPostsTitle}
              </h3>
              <p className="text-muted-foreground">
                {currentConfig.noPostsMessage}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {posts.map((post, index) => {
                return (
                  <div key={post.id} className="relative">
                    {index < 3 && (
                      <div className="absolute -top-2 -left-2 z-10 bg-amber-500 text-orange-50 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    )}
                    <PostCard
                      post={{
                        id: post.id.toString(),
                        title: post.title,
                        content: post.content,
                        excerpt: post.summary || post.content.substring(0, 150) + '...',
                        coverImage: post.imageUrl,
                        tags: post.tags,
                        createdAt: post.createdAt,
                        updatedAt: post.updatedAt,
                        authorId: post.authorId,
                        authorName: post.authorName,
                        authorAvatar: post.authorAvatar,
                        category: post.categoryName ? {
                          id: post.categoryId!,
                          name: post.categoryName,
                          color: post.categoryColor || '#6366f1',
                          slug: post.categoryName.toLowerCase().replace(/\s+/g, '-'),
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString()
                        } : {
                          id: 1,
                          name: 'General',
                          color: '#6366f1',
                          slug: 'general',
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString()
                        },
                        subcategory: post.subcategoryName ? {
                          id: post.subcategoryId!,
                          name: post.subcategoryName,
                          color: post.subcategoryColor || '#8b5cf6',
                          slug: post.subcategoryName.toLowerCase().replace(/\s+/g, '-'),
                          categoryId: post.categoryId!,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString()
                        } : undefined,
                        likesCount: post.likesCount,
                        commentsCount: post.commentsCount,
                        visitsCount: post.visitsCount,
                        readTime: Math.ceil(post.content.length / 200),
                        published: true,
                        featured: false,
                        slug: `post-${post.id}`,
                        author: post.authorId
                      }}
                      showTrendingMetrics={isTrending}
                      showPopularityMetrics={!isTrending}
                      trendingScore={post.trendingScore}
                      popularityScore={post.popularityScore}
                      recentActivity={{
                        likes: post.recentLikesCount,
                        comments: post.recentCommentsCount,
                        views: post.recentVisitsCount,
                        lastActivity: post.lastActivityAt
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {posts.length > 0 && posts.length >= displayLimit && (
            <LoadMoreButton onClick={handleLoadMore} />
          )}
        </div>
      </main>
    </div>
  );
}
