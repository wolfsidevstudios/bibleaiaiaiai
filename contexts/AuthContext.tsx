import React, { createContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { getUserProfile, saveUserProfile, removeUserProfile } from '../services/storageService';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: UserProfile | null;
  login: (credential: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getUserProfile();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (credential: string) => {
    // Decode the JWT to get user profile information
    const decoded: { name: string; email: string; picture: string; } = jwtDecode(credential);
    const profile: UserProfile = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
    };
    saveUserProfile(profile);
    setUser(profile);
  };

  const logout = () => {
    removeUserProfile();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
