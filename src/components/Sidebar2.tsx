import { TrendingUp, Calendar, Star, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TrendingPost, RecentActivity } from "@/types/blog";

interface SidebarProps {
  trendingPosts?: TrendingPost[];
  recentActivity?: RecentActivity[];
}

const Sidebar2 = ({ trendingPosts = [], recentActivity = [] }: SidebarProps) => {

  return (
    <aside className="w-80 space-y-6">
      {/* Trending Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Trending esta semana
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingPosts.length > 0 ? (
            trendingPosts.map((post) => (
              <div key={post.id} className="cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors">
                <h4 className="font-medium text-sm mb-1 hover:text-primary transition-colors">
                  {post.title}
                </h4>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{post.author.displayName}</span>
                  <span>{post.views.toLocaleString()} vistas</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay posts trending disponibles
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="text-sm">
                <p className="font-medium mb-1">{activity.title}</p>
                <p className="text-muted-foreground text-xs">{activity.timestamp}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay actividad reciente
            </p>
          )}
        </CardContent>
      </Card>
    </aside>
  );
};

export default Sidebar2;