import { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { authService, useDiscordLoginUrl, useDiscordCallback, useEmailLogin, useEmailRegister, useLogout, useTokenVerification } from '../services/authService';
import { User } from '../types/blog';
import { useToast } from './use-toast';
import { followService } from '../services/followService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  followedSubcategories: Set<string>;
  loginWithDiscord: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, username: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshFollows: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [followedSubcategories, setFollowedSubcategories] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // TanStack Query hooks
  const discordLoginUrlQuery = useDiscordLoginUrl();
  const discordCallbackMutation = useDiscordCallback();
  const emailLoginMutation = useEmailLogin();
  const emailRegisterMutation = useEmailRegister();
  const logoutMutation = useLogout();
  const tokenVerificationQuery = useTokenVerification();

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
            // Token is not expired, but verify it with the server
            try {
              const verifiedUser = await authService.verifyToken(storedToken);
              if (verifiedUser) {
                setUser(verifiedUser);
                await refreshFollows();
                toast({
                  title: "¡Bienvenid@ de vuelta!",
                  description: `Hola ${verifiedUser.name}, tu sesión ha sido restaurada.`,
                });
              } else {
                // Token verification failed, try to refresh
                const refreshData = await authService.autoRefreshJwtToken();
                if (refreshData) {
                  authService.storeAuthData(refreshData.token, refreshData.user);
                  setUser(refreshData.user);
                  await refreshFollows();
                  toast({
                    title: "Sesión actualizada",
                    description: "Tu sesión ha sido renovada automáticamente.",
                  });
                } else {
                  authService.clearAuthData();
                }
              }
            } catch (verifyError) {
              console.error('Token verification failed:', verifyError);
              authService.clearAuthData();
            }
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
    if (user) {
      refreshFollows();
    } else {
      setFollowedSubcategories(new Set());
    }
  }, [user]);

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
      if (discordLoginUrlQuery.data?.authUrl) {
        window.location.href = discordLoginUrlQuery.data.authUrl;
      } else if (!discordLoginUrlQuery.isLoading) {
        await discordLoginUrlQuery.refetch();
        if (discordLoginUrlQuery.data?.authUrl) {
          window.location.href = discordLoginUrlQuery.data.authUrl;
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      await emailLoginMutation.mutateAsync({ email, password });
      
      const storedUser = authService.getStoredUser();
      setUser(storedUser);
      await refreshFollows();
      
      toast({
        title: "¡Bienvenid@!",
        description: `Hola ${storedUser?.name}, has iniciado sesión exitosamente.`,
      });
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
      await emailRegisterMutation.mutateAsync({ email, password, username, role });
      
      const storedUser = authService.getStoredUser();
      setUser(storedUser);
      await refreshFollows();
      
      toast({
        title: "¡Cuenta creada!",
        description: `Hola ${storedUser?.name}, tu cuenta ha sido creada exitosamente.`,
      });
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
      await discordCallbackMutation.mutateAsync(code);
      
      const storedUser = authService.getStoredUser();
      setUser(storedUser);
      await refreshFollows();
      
      toast({
        title: "¡Bienvenid@!",
        description: `Hola ${storedUser?.name}, has iniciado sesión exitosamente.`,
      });
      
      window.history.replaceState({}, document.title, window.location.pathname);
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

      await logoutMutation.mutateAsync();
      setUser(null);
      setFollowedSubcategories(new Set());

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
      setFollowedSubcategories(new Set());
      
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
    }
  };

  const refreshFollows = async () => {
    if (!user) {
      setFollowedSubcategories(new Set());
      return;
    }

    try {
      const userFollows = await followService.getUserFollows();
      const followedIds = new Set(userFollows.followedSubcategories.map(sub => sub.id.toString()));
      setFollowedSubcategories(followedIds);
      console.log('Refreshed follows:', followedIds);
    } catch (error) {
      console.error('Error fetching user follows:', error);
    }
  };

  const value = {
    user,
    loading,
    followedSubcategories,
    loginWithDiscord,
    loginWithEmail,
    registerWithEmail,
    logout,
    refreshFollows,
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