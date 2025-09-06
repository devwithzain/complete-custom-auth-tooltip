'use client';

import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SELLER';
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/profile');

      if (!response.ok) {
        if (response.status === 401) {
          setUser(null);
          return;
        }
        throw new Error('Failed to fetch user');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refetch = () => {
    fetchUser();
  };

  return {
    user,
    loading,
    error,
    refetch,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isSeller: user?.role === 'SELLER',
    isUser: user?.role === 'USER',
  };
}

// Alternative hook for getting user data without loading state
export function getCurrentUser(): Promise<User | null> {
  return fetch('/api/auth/profile')
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          return null;
        }
        throw new Error('Failed to fetch user');
      }
      return response.json();
    })
    .catch(() => null);
}
