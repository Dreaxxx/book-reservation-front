import { AuthContext } from '@/app/hooks/useAuth';
import React from 'react';

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const value = {
    user: { id: 'U1', name: 'User One', email: 'a@b.com' },
    token: 'token',
    loading: false,
    login: async () => {},
    register: async () => {},
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
