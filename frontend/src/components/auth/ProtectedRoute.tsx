// frontend/src/components/auth/ProtectedRoute.tsx
"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth state is determined and user is not authenticated, redirect
    if (isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // While checking auth state or if user is authenticated, show the children
  if (isAuthenticated === null || !isAuthenticated) {
    // we can return a loading spinner here for a better UX
    return <div>Loading...</div>;
  }
  
  return <>{children}</>;
}