'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RootState } from '../../store';

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      // If user is already logged in, redirect away from public routes (like login/register) to dashboard
      router.push('/dashboard'); // or wherever the main app is
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized || isAuthenticated) {
    // Show nothing while redirecting
    return null;
  }

  return <>{children}</>;
}
