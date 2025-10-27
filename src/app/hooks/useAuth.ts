'use client';

import { createContext, useContext } from 'react';
import { AuthContextValue } from '../lib/types';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
    return ctx;
}
