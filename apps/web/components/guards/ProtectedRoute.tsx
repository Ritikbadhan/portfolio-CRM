'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingComponent from '../ui/LoadingComponent';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Placeholder authentication logic
    const hasToken = true; // localStorage.getItem('token')
    if (!hasToken) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) return <LoadingComponent />;
  return <>{children}</>;
}
