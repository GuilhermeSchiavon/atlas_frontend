'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getUser } from '@/utils/auth';
import { User } from '@/types';

export const useAuth = (requireAuth = false) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    const userData = getUser();

    if (token && userData) {
      setUser(userData);
    } else if (requireAuth) {
      // Salvar a URL atual para redirecionamento após login
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem('redirectAfterLogin', currentPath);
      router.push('/auth/login');
      return;
    }

    setIsLoading(false);
  }, [requireAuth, router]);

  return { user, isLoading, isAuthenticated: !!user };
};