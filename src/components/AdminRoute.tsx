import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role?.toLowerCase() !== 'admin')) {
      toast({
        title: "Acceso denegado",
        description: "Solo los administradores pueden acceder a esta página.",
        variant: "destructive",
      });
      navigate('/', { replace: true });
    }
  }, [loading, user, navigate, toast]);

  if (loading) {
    return <LoadingScreen message="Verificando permisos..." />;
  }

  if (!user) {
    return <LoadingScreen message="Redirigiendo..." />;
  }

  if (user.role?.toLowerCase() !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader className="text-center">
            <Crown className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            <CardTitle>Acceso Denegado</CardTitle>
            <CardDescription>
              Solo los administradores pueden acceder a esta página.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate("/")} className="w-full">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
