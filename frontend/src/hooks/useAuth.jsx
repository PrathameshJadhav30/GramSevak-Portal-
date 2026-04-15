import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { authApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("gp_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("gp_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await authApi.getProfile();
        setUser(data.data);
        localStorage.setItem("gp_user", JSON.stringify(data.data));
      } catch {
        localStorage.removeItem("gp_token");
        localStorage.removeItem("gp_user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [token]);

  const login = (tokenValue, userValue) => {
    localStorage.setItem("gp_token", tokenValue);
    localStorage.setItem("gp_user", JSON.stringify(userValue));
    setToken(tokenValue);
    setUser(userValue);
  };

  const logout = () => {
    localStorage.removeItem("gp_token");
    localStorage.removeItem("gp_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, isAuthenticated: Boolean(token), login, logout, setUser }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
