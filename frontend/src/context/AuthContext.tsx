import { createContext, useEffect, useMemo, useState } from "react";
import type { AuthContextValue, AuthResponse, AuthUser } from "../types/auth.types";
import { storage } from "../utils/storage";
import { useToken } from "../hooks/useToken";
import { authApi } from "../api/auth.api";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const { token, setToken, clearToken } = useToken();
  const [user, setUser] = useState<AuthUser | null>(storage.getUser<AuthUser>());
  const [isLoading, setIsLoading] = useState(true);

  const login = (data: AuthResponse) => {
    setToken(data.token);
    setUser(data.user);
    storage.setUser(data.user);
  };

  const logout = () => {
    clearToken();
    setUser(null);
    storage.clearAuth();
  };

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authApi.getMe();
        setUser(currentUser);
        storage.setUser(currentUser);
      } catch {
        clearToken();
        setUser(null);
        storage.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, [token, clearToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}