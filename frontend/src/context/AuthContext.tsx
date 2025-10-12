// frontend/src/context/AuthContext.tsx
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// Define the shape of the context data
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // We'll use null as an initial state to indicate "we haven't checked yet"
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // This effect runs ONLY on the client, after the initial render.
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []); // The empty dependency array means this runs only once on mount.

  const login = (token: string) => {
    localStorage.setItem('accessToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
  };
  
  // While we are checking, we don't render the children to avoid the mismatch
  if (isAuthenticated === null) {
      return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};