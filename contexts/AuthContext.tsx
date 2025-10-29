import React, { createContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../services/supabaseClient';

interface AuthContextType {
  user: UserProfile | null;
  login: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Listen for auth state changes from Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const profile: UserProfile = {
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.user_metadata.name,
          email: session.user.email!,
          picture: session.user.user_metadata.avatar_url || session.user.user_metadata.picture,
        };
        setUser(profile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (credential: string) => {
    const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: credential,
    });
    if (error) {
        console.error('Supabase login error:', error.message);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};