import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService } from '../services/authService';
import { AuthUser } from '../types/blog';
import { useToast } from './use-toast';

// Create AuthContext
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  loginWithDiscord: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        const storedToken = authService.getStoredToken();
        
        
        if (storedUser && storedToken) {
          // Verify token with backend
          const verifiedUser = await authService.verifyToken(storedToken);
          if (verifiedUser) {
            setUser(verifiedUser);
            
            // Print user info for existing session
            console.log('🔄 User session restored! User info:');
            console.log('👤 User ID:', verifiedUser.id);
            console.log('👤 Username:', verifiedUser.username);
            console.log('📧 Email:', verifiedUser.email);
            console.log('🏷️ Display Name:', verifiedUser.displayName);
            console.log('🆔 Discord ID:', verifiedUser.discordId);
            console.log('👑 Role:', verifiedUser.role);
            console.log('📅 Created At:', verifiedUser.createdAt);
            console.log('🖼️ Avatar:', verifiedUser.avatar);
            console.log('📝 Bio:', verifiedUser.bio);
            
            // Show toast notification
            toast({
              title: "¡Bienvenido de vuelta!",
              description: `Hola ${verifiedUser.displayName}, tu sesión ha sido restaurada.`,
            });
          } else {
            // Token is invalid, clear stored data
            authService.clearAuthData();
          }
        } else {
          // Check for Discord callback
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

  const handleDiscordCallback = async (code: string) => {
    try {
      setLoading(true);
      const data = await authService.handleDiscordCallback(code);
      
      if (data.token && data.user) {
        authService.storeAuthData(data.token, data.user);
        setUser(data.user);
        
        toast({
          title: "¡Bienvenido!",
          description: `Hola ${data.user.displayName}, has iniciado sesión exitosamente.`,
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
      await authService.logout();
      setUser(null);

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
    } catch (error) {
      console.error('Logout error:', error);
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
    logout,
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};