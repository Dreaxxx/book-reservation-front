'use client';

import { useEffect, type ReactNode } from 'react';
import { bootstrapAuth } from './lib/auth';
import { AuthProvider } from './providers/auth-providers';

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    bootstrapAuth();
  }, []);

  return <AuthProvider>{children}</AuthProvider>;
}
