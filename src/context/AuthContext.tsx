import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    role: string | null;
    email: string | null;
    login: (token: string, role: string, email: string) => void;
    logout: () => void;
    isAdmin: () => boolean;
    isDirector: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
    const [email, setEmail] = useState<string | null>(localStorage.getItem('email'));

    const login = (token: string, role: string, email: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('email', email);
        setToken(token);
        setRole(role);
        setEmail(email);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        setToken(null);
        setRole(null);
        setEmail(null);
        window.location.href = '/login';
    };

    const isAdmin = () => role === 'ADMIN';
    const isDirector = () => role === 'DIRECTOR' || role === 'ADMIN';

    return (
        <AuthContext.Provider value={{ token, role, email, login, logout, isAdmin, isDirector }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}