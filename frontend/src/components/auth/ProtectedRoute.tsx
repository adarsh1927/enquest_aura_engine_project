// frontend/src/components/auth/ProtectedRoute.tsx
"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'; // Import useState

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false); // Add a mounted state

  useEffect(() => {
    setIsMounted(true); // This will be true only after the first client render
  }, []);

  useEffect(() => {
    // Only run the redirect logic if the component is mounted and auth state is determined
    if (isMounted && isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, isMounted, router]);

  // On the server AND on the initial client render, isMounted is false.
  // We must return something that doesn't depend on auth state. A loading
  // state is fine, as long as it's consistent.
  if (!isMounted || isAuthenticated === null) {
    return <div>Loading...</div>; // Or a more sophisticated loading spinner component
  }

  // If we are mounted and authenticated, show the children.
  // If we are mounted and NOT authenticated, the useEffect will trigger a redirect,
  // so we might briefly see the children before the redirect happens.
  // Returning the loader here again prevents that flash.
  if (!isAuthenticated) {
     return <div>Loading...</div>;
  }

  return <>{children}</>;
}