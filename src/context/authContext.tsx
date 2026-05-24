"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { auth, AuthUser } from "@/lib/auth";

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user: AuthUser, rememberMe?: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function getInitialUser(): AuthUser | null {
  if (typeof window === "undefined") return null; // SSR guard
  const savedUser = auth.getUser();
  if (savedUser && auth.getAccessToken()) return savedUser;
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getInitialUser);

  const login = (accessToken: string, refreshToken: string, user: AuthUser, rememberMe = false) => {
    auth.save(accessToken, refreshToken, user, rememberMe);
    setUser(user);
    };

  const logout = () => {
    auth.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}