import { PostCard } from "@/features/post/components/PostCard";
import { BlogFilters } from "@/shared/components/Filters";
import { useBlogData } from "@/hooks/useBlogData";
import Hero from "../components/Hero";

const Index = () => {
  const { posts, featuredPosts, categories, filters, setFilters, trendingPosts, recentActivity } = useBlogData();
  const featuredPost = featuredPosts[0];

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      <main className="container mx-auto px-4 py-12">
        <BlogFilters 
          categories={categories}
          filters={filters}
          onFiltersChange={setFilters}
        />
        <div className="flex ga p-8">
          {/* Main Content */}
          <div className="flex-1 pe-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Últimos Posts
              </h2>
              <p className="text-muted-foreground">
                Descubre el contenido más reciente de nuestra comunidad
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                />
              ))}
            </div>
            
            {/* Load More */}
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-devtalles-gradient text-white rounded-lg hover:opacity-90 transition-opacity">
                Cargar más posts
              </button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default Index;
