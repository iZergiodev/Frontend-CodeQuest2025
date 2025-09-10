import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import { posts } from "@/data/post-mock.data";

const Index = () => {
  

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
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
                  postId={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  author={post.author}
                  date={post.date}
                  category={post.category}
                  likes={post.likes}
                  comments={post.comments}
                  image={post.image}
                  tags={post.tags}
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
          
          {/* Sidebar */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
