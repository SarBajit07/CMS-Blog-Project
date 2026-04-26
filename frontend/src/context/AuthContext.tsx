'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { apiFetch, setAccessToken } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to initialize user via /me endpoint
  const initAuth = useCallback(async () => {
    try {
      const data = await apiFetch('/auth/me', { method: 'GET' });
      if (data && data.success) {
        const { accessToken, user } = data.data;
        setAccessToken(accessToken);
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        throw new Error('Not authenticated');
      }
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if user has an old localStorage token and remove it for security
    localStorage.removeItem('accessToken');
    
    initAuth();
  }, [initAuth]);

  const login = async (email: string, password: string) => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.success) {
        const { accessToken, user } = data.data;
        setAccessToken(accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        toast.success('Welcome back, ' + user.username + '!');
        router.push('/');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong during login');
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });

      if (data.success) {
        toast.success('Account created! You can now log in.');
        router.push('/auth/login');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong during registration');
      throw error;
    }
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('user');
    setUser(null);
    
    // Call backend logout to clear refresh cookie
    apiFetch('/auth/logout', { method: 'POST' })
      .then(() => {
        toast.info('Logged out successfully');
        router.push('/');
      })
      .catch(() => {
        toast.info('Logged out locally');
        router.push('/');
      });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
