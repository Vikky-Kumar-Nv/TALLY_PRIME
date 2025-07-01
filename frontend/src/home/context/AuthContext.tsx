import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  hasSubscription: boolean;
  subscriptionPlan?: 'basic' | 'professional' | 'enterprise';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  updateSubscription: (plan: 'basic' | 'professional' | 'enterprise') => void;
}

interface RegisterData {
  fullName: string;
  email: string;
  address: string;
  phoneNo: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Validate the parsed user data
        if (parsedUser && parsedUser.id && parsedUser.email) {
          setUser(parsedUser);
        } else {
          // Clear invalid user data
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic validation - in real app, this would call API
      if (!email || !password) {
        setIsLoading(false);
        return false;
      }
      
      // Simple mock validation - in production, this would be server-side
      if (password.length < 3) {
        setIsLoading(false);
        return false;
      }
      
      // Mock user data - in real app, this would come from API
      const mockUser: User = {
        id: '1',
        email,
        fullName: email.split('@')[0] || 'User', // Use email prefix as name
        hasSubscription: false,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setIsLoading(false);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic validation
      if (!userData.email || !userData.password || !userData.fullName) {
        setIsLoading(false);
        return false;
      }
      
      // Mock registration - in real app, this would call API
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        fullName: userData.fullName,
        hasSubscription: false,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsLoading(false);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      // Clear any other auth-related data if needed
      localStorage.removeItem('selectedPlan');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if localStorage fails, still clear the user state
      setUser(null);
    }
  };

  const updateSubscription = (plan: 'basic' | 'professional' | 'enterprise') => {
    try {
      if (user) {
        const updatedUser = {
          ...user,
          hasSubscription: true,
          subscriptionPlan: plan,
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        console.warn('Cannot update subscription: No user logged in');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        updateSubscription,
      }}
    >
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
