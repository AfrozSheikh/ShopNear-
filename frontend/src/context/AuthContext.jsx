import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services';
import { ROLES } from '../utils/constants';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage and validate token on mount
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');
        
        if (storedUser && accessToken) {
          const parsedUser = JSON.parse(storedUser);
          
          // Validate token is still valid by making a test request
          try {
            // Set the user first so the API can use the token
            setUser(parsedUser);
            
            // Test if token is valid (this will auto-refresh if needed)
            await api.get('/auth/validate').catch(() => {
              // If validation fails, token might be expired but refresh will handle it
              // The interceptor will auto-refresh if possible
            });
          } catch (error) {
            // If token validation fails completely, clear auth
            console.error('Token validation failed:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { user: userData, accessToken, refreshToken } = response.data;
      
      // Validate user data before storing
      if (!userData || !userData.email || !userData.role) {
        throw new Error('Invalid user data received');
      }
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data?.message || 'Login failed. Please try again.';
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { user: newUser, accessToken, refreshToken } = response.data;
      
      // Validate user data
      if (!newUser || !newUser.email || !newUser.role) {
        throw new Error('Invalid user data received');
      }
      
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data?.message || 'Registration failed. Please try again.';
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Clear local state first for immediate UI update
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Then try to logout on server (best effort)
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch (error) {
        console.error('Logout error:', error);
        // Ignore error as we've already cleared local state
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === ROLES.ADMIN,
    isShopOwner: user?.role === ROLES.SHOP_OWNER,
    isCustomer: user?.role === ROLES.CUSTOMER,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
