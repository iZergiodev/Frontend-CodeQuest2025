import { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { authService } from '../services/authService';
import { AuthUser } from '../types/blog';
import { useToast } from './use-toast';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  loginWithDiscord: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, username: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        const storedToken = authService.getStoredToken();
        
        
        if (storedUser && storedToken) {
          if (authService.isJwtTokenExpired(storedToken)) {
            const refreshData = await authService.autoRefreshJwtToken();
            if (refreshData) {
              authService.storeAuthData(refreshData.token, refreshData.user);
              setUser(refreshData.user);
              
              toast({
                title: "Sesión actualizada",
                description: "Tu sesión ha sido renovada automáticamente.",
              });
            } else {
              authService.clearAuthData();
            }
          } else {
            setUser(storedUser);
            toast({
              title: "¡Bienvenido de vuelta!",
              description: `Hola ${storedUser.name}, tu sesión ha sido restaurada.`,
            });
          }
        } else {
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get('code');
          
          if (code) {
            await handleDiscordCallback(code);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    refreshIntervalRef.current = setInterval(async () => {
      const token = authService.getStoredToken();
      if (token && user) {
        try {
          const refreshData = await authService.autoRefreshJwtToken();
          if (refreshData) {
            authService.storeAuthData(refreshData.token, refreshData.user);
            setUser(refreshData.user);
          }
        } catch (error) {
          console.error('Periodic JWT token refresh failed:', error);
        }
      }
    }, 6 * 24 * 60 * 60 * 1000); // 6 days

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [user]);

  const loginWithDiscord = async () => {
    try {
      setLoading(true);
      const data = await authService.getDiscordLoginUrl();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await authService.loginWithEmail(email, password);
      
      if (data.token && data.user) {
        authService.storeAuthData(data.token, data.user);
        setUser(data.user);
        
        toast({
          title: "¡Bienvenido!",
          description: `Hola ${data.user.name}, has iniciado sesión exitosamente.`,
        });
      }
    } catch (error: any) {
      console.error('Email login error:', error);
      toast({
        title: "Error de autenticación",
        description: error.message || "No se pudo iniciar sesión. Inténtalo de nuevo.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string, username: string, role: string = "User") => {
    try {
      setLoading(true);
      const data = await authService.registerWithEmail(email, password, username, role);
      
      if (data.token && data.user) {
        authService.storeAuthData(data.token, data.user);
        setUser(data.user);
        
        toast({
          title: "¡Cuenta creada!",
          description: `Hola ${data.user.name}, tu cuenta ha sido creada exitosamente.`,
        });
      }
    } catch (error: any) {
      console.error('Email registration error:', error);
      toast({
        title: "Error al crear cuenta",
        description: error.message || "No se pudo crear la cuenta. Inténtalo de nuevo.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDiscordCallback = async (code: string) => {
    try {
      setLoading(true);
      const data = await authService.handleDiscordCallback(code);
      
      if (data.token && data.user) {
        authService.storeAuthData(data.token, data.user);
        setUser(data.user);
        
        toast({
          title: "¡Bienvenido!",
          description: `Hola ${data.user.name}, has iniciado sesión exitosamente.`,
        });
        
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      console.error('Callback error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }

      await authService.logout();
      setUser(null);

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      
      authService.clearAuthData();
      setUser(null);
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
    }
  };

  const value = {
    user,
    loading,
    loginWithDiscord,
    loginWithEmail,
    registerWithEmail,
    logout,
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};