import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    userEmail: string | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VALID_EMAIL = 'user@root.com';
const VALID_PASSWORD = '14875021';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const email = localStorage.getItem('userEmail');

        if (loggedIn && email) {
            setIsAuthenticated(true);
            setUserEmail(email);
        }
    }, []);

    const login = (email: string, password: string): boolean => {
        if (email === VALID_EMAIL && password === VALID_PASSWORD) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            setIsAuthenticated(true);
            setUserEmail(email);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        setIsAuthenticated(false);
        setUserEmail(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
