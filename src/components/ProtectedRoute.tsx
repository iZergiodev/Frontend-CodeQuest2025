import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Autenticación requerida",
        description: "Por favor, inicie sesión para acceder a esta página.",
        variant: "destructive",
      });
      navigate('/', { replace: true });
    }
  }, [loading, user, navigate, toast]);

  if (loading) {
    return <LoadingScreen message="Autenticando..." />;
  }

  if (!user) {
    return <LoadingScreen message="Redirigiendo a la página principal..." />;
  }

  return <>{children}</>;
};
