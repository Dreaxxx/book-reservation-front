import axios from 'axios';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { authApi } from '../api/api';
import { AuthUser, AuthContextValue } from '../lib/types';
import { AuthContext } from '../hooks/useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const applyTokenAndUser = useCallback((authToken: string | null, user?: AuthUser) => {
        if (authToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            localStorage.setItem('token', authToken);
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, []);

    useEffect(() => {
        const authToken = localStorage.getItem('token');
        const loggedUser = localStorage.getItem('user');

        if (authToken && loggedUser) {
            setToken(authToken);
            setUser(JSON.parse(loggedUser));
            applyTokenAndUser(authToken, JSON.parse(loggedUser));
        }
        setLoading(false);
    }, [applyTokenAndUser]);

    const login = useCallback(
        async (email: string, password: string) => {
            const res = await authApi.login({ email, password });
            console.log('res : ', res);
            const authToken = res.accessToken;
            const loggedUser = res.user;

            if (!authToken) throw new Error('Token manquant');

            setToken(authToken);
            setUser(loggedUser);
            applyTokenAndUser(authToken);
        },
        [applyTokenAndUser],
    );

    const register = useCallback(
        async (name: string, email: string, password: string) => {
            await authApi.register({ name, email, password });
            await authApi.login({ email, password });
        },
        [login],
    );

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            token,
            loading,
            login,
            register,
        }),
        [user, token, loading, login, register],
    );

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;
}
