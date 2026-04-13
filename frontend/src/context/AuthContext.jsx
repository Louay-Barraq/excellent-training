/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const parseJwt = (token) => {
    try {
        const [, payload] = token.split('.');
        if (!payload) return null;
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
                .join('')
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
};

const isTokenExpired = (token) => {
    const payload = parseJwt(token);
    const exp = payload?.exp;
    if (!exp) return false; // if missing, let backend decide
    return Date.now() >= exp * 1000;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const login = localStorage.getItem('login');
        const id = localStorage.getItem('userId');
        if (token && role && login && id) {
            if (isTokenExpired(token)) {
                sessionStorage.setItem('auth_reason', 'expired');
                localStorage.clear();
                return null;
            }
            return { token, role: role.toUpperCase(), login, id };
        }
        return null;
    });

    const loginUser = (data) => {
        const role = data.role.toUpperCase();
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', role);
        localStorage.setItem('login', data.login);
        localStorage.setItem('userId', data.id.toString());
        setUser({ token: data.token, role, login: data.login, id: data.id });
    };

    const logoutUser = () => {
        localStorage.clear();
        setUser(null);
    };

    // Proactive expiry check (e.g. tab kept open overnight)
    useEffect(() => {
        if (user?.token && isTokenExpired(user.token)) {
            sessionStorage.setItem('auth_reason', 'expired');
            localStorage.clear();
            setUser(null);
        }
    }, [user?.token]);

    // Optional: Synchronize tabs if needed
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'token' && !e.newValue) {
                setUser(null);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};