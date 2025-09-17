import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { followService } from '@/services/followService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface FollowButtonProps {
  subcategoryId: string;
  followerCount?: number;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export const FollowButton = ({
  subcategoryId,
  followerCount = 0,
  size = 'sm',
  className = '',
}: FollowButtonProps) => {
  const [following, setFollowing] = useState(false);
  const [count, setCount] = useState(followerCount);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, followedSubcategories, refreshFollows } = useAuth();

  useEffect(() => {
    const isFollowing = followedSubcategories.has(subcategoryId);
    setFollowing(isFollowing);
  }, [followedSubcategories, subcategoryId]);

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Acceso requerido",
        description: "Debes iniciar sesión para seguir subcategorías.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (following) {
        await followService.unfollowSubcategory(subcategoryId);
        setFollowing(false);
        setCount(prev => Math.max(0, prev - 1));
        await refreshFollows();
        toast({
          title: "Dejaste de seguir",
          description: "Ya no recibirás notificaciones de esta subcategoría.",
        });
      } else {
        await followService.followSubcategory(subcategoryId);
        setFollowing(true);
        setCount(prev => prev + 1);
        await refreshFollows();
        toast({
          title: "Ahora sigues esta subcategoría",
          description: "Recibirás notificaciones de nuevos posts.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo completar la acción.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      size={size}
      variant="ghost"
      className={`p-2 h-8 w-8 transition-all duration-200 hover:bg-accent/50 ${
        following 
          ? "text-red-500 hover:text-red-600" 
          : "text-muted-foreground hover:text-foreground"
      } ${className}`}
    >
      <Heart 
        className={`h-4 w-4 transition-all duration-200 ${
          following ? "fill-current" : ""
        }`} 
      />
    </Button>
  );
};
