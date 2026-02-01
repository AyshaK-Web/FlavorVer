'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

type User = {
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, pass: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_KEY = 'flavorverse-demo-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(DEMO_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load user from localStorage', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const login = (email: string, pass: string) => {
    if (email === 'demo@january2.com' && pass === 'password') {
      const demoUser: User = { email };
      try {
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      } catch (error) {
         console.error('Failed to save user to localStorage', error);
      }
      setUser(demoUser);
    } else {
      throw new Error('Invalid email or password.');
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(DEMO_USER_KEY);
    } catch (error) {
      console.error('Failed to remove user from localStorage', error);
    }
    setUser(null);
  };
  
  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isInitialized,
    login,
    logout,
  }), [user, isInitialized]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
