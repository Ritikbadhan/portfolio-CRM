'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingComponent from '../ui/LoadingComponent';

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Redirect away if already logged in (e.g. for login pages)
    const hasToken = false; // localStorage.getItem('token')
    if (hasToken) {
      router.push('/dashboard');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) return <LoadingComponent />;
  return <>{children}</>;
}
