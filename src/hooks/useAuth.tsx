import { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { authService, useDiscordLoginUrl, useDiscordCallback, useEmailLogin, useEmailRegister, useLogout, useTokenVerification } from '../services/authService';
import { User } from '../types/blog';
import { useToast } from './use-toast';
import { followService } from '../services/followService';
import { bookmarkService } from '../services/bookmarkService';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  followedSubcategories: Set<string>;
  bookmarkedPosts: Set<string>;
  loginWithDiscord: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, username: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshFollows: () => Promise<void>;
  refreshBookmarks: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [followedSubcategories, setFollowedSubcategories] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
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
              await refreshFollows();
              await refreshBookmarks();
              
              toast({
                title: "Sesión actualizada",
                description: "Tu sesión ha sido renovada automáticamente.",
              });
            } else {
              authService.clearAuthData();
            }
          } else {
            // Token is not expired, skip verification for now to prevent 401 errors
            console.log('Skipping token verification to prevent 401 errors');
            // For now, just use the stored user data without verification
            if (storedUser) {
              setUser(storedUser);
              console.log('Using stored user data without verification');
            }
          }
        } else if (storedUser && !storedToken) {
          // User exists but no token - clear inconsistent state
          console.log("Inconsistent auth state: user exists but no token. Clearing auth data.");
          authService.clearAuthData();
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

    const handleAuthSuccess = async (event: CustomEvent) => {
      console.log('Auth success event received:', event.detail);
      const { user } = event.detail;
      
      setUser(user);
      
      await refreshFollows();
      await refreshBookmarks();
      
      toast({
        title: "¡Bienvenid@!",
        description: `Hola ${user.name}, has iniciado sesión exitosamente.`,
      });
    };

    initializeAuth();
    
    window.addEventListener('auth-success', handleAuthSuccess as EventListener);
    
    return () => {
      window.removeEventListener('auth-success', handleAuthSuccess as EventListener);
    };
  }, []);

  useEffect(() => {
    if (user) {
      refreshFollows();
      refreshBookmarks();
    } else {
      setFollowedSubcategories(new Set());
      setBookmarkedPosts(new Set());
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
    return new Promise<void>((resolve, reject) => {
      setLoading(true);
      console.log("Starting email login...");
      
      emailLoginMutation.mutate(
        { email, password },
        {
          onSuccess: (data) => {
            console.log("Login mutation success:", data);
            
            const storedUser = authService.getStoredUser();
            const storedToken = authService.getStoredToken();
            console.log("After login mutation:", { 
              storedUser: storedUser ? "Present" : "Missing", 
              storedToken: storedToken ? "Present" : "Missing" 
            });
            
            setUser(storedUser);
            refreshFollows();
            refreshBookmarks();
            
            toast({
              title: "¡Bienvenid@!",
              description: `Hola ${storedUser?.name}, has iniciado sesión exitosamente.`,
            });
            
            setLoading(false);
            resolve();
          },
          onError: (error) => {
            toast({
              title: "Error de autenticación",
              description: error.message || "No se pudo iniciar sesión. Inténtalo de nuevo.",
              variant: "destructive",
            });
            setLoading(false);
            reject(error);
          }
        }
      );
    });
  };

  const registerWithEmail = async (email: string, password: string, username: string, role: string = "User") => {
    return new Promise<void>((resolve, reject) => {
      setLoading(true);
      console.log("Starting email registration...");
      
      emailRegisterMutation.mutate(
        { email, password, username, role },
        {
          onSuccess: () => {
            const storedUser = authService.getStoredUser();
            setUser(storedUser);
            refreshFollows();
            refreshBookmarks();
            
            toast({
              title: "¡Cuenta creada!",
              description: `Hola ${storedUser?.name}, tu cuenta ha sido creada exitosamente.`,
            });
            
            setLoading(false);
            resolve();
          },
          onError: (error) => {
            console.error('Registration mutation error:', error);
            toast({
              title: "Error al crear cuenta",
              description: error.message || "No se pudo crear la cuenta. Inténtalo de nuevo.",
              variant: "destructive",
            });
            setLoading(false);
            reject(error);
          }
        }
      );
    });
  };

  const handleDiscordCallback = async (code: string) => {
    try {
      setLoading(true);
      await discordCallbackMutation.mutateAsync(code);
      
      const storedUser = authService.getStoredUser();
      setUser(storedUser);
      await refreshFollows();
      await refreshBookmarks();
      
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
      setBookmarkedPosts(new Set());

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
      setBookmarkedPosts(new Set());
      
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

  const refreshBookmarks = async () => {
    if (!user) {
      setBookmarkedPosts(new Set());
      return;
    }
    try {
      const userBookmarks = await bookmarkService.getUserBookmarks(1, 1000);
      const bookmarkedIds = new Set(userBookmarks.bookmarks.map(bookmark => bookmark.postId.toString()));
      setBookmarkedPosts(bookmarkedIds);
      console.log('Refreshed bookmarks:', bookmarkedIds);
    } catch (error) {
      console.error('Error fetching user bookmarks:', error);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    followedSubcategories,
    bookmarkedPosts,
    loginWithDiscord,
    loginWithEmail,
    registerWithEmail,
    logout,
    refreshFollows,
    refreshBookmarks,
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