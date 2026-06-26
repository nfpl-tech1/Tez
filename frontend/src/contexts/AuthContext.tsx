import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi, type User } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (usernameOrEmail: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    clearAuth: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const clearAuth = useCallback(() => {
        setUser(null);
    }, []);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const currentUser = await authApi.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (usernameOrEmail: string, password: string) => {
        const response = await authApi.login(usernameOrEmail, password);
        if (response.success && response.user) {
            setUser(response.user);
        } else {
            throw new Error(response.message || 'Login failed');
        }
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        logout,
        clearAuth,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
