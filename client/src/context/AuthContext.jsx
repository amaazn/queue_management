import { createContext, useState, useEffect, useCallback } from "react";
import {
  loginRequest,
  fetchMe,
  logoutRequest,
} from "../services/authService.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const data = await fetchMe();
        setManager(data.manager);
      } catch {
        setManager(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);
    setManager(data.manager);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
    }
    setManager(null);
  }, []);

  const value = {
    manager,
    loading,
    isAuthenticated: !!manager,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
