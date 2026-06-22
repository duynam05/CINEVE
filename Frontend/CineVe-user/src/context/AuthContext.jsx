import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/clientApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const rawUser = localStorage.getItem("cineve_user");
    return rawUser ? JSON.parse(rawUser) : null;
  });
  const [bootstrapping, setBootstrapping] = useState(Boolean(localStorage.getItem("cineve_access_token")));

  useEffect(() => {
    const token = localStorage.getItem("cineve_access_token");

    if (!token) {
      setBootstrapping(false);
      return;
    }

    authApi.me()
      .then((currentUser) => {
        localStorage.setItem("cineve_user", JSON.stringify(currentUser));
        setUser(currentUser);
      })
      .catch(() => {
        localStorage.removeItem("cineve_access_token");
        localStorage.removeItem("cineve_refresh_token");
        localStorage.removeItem("cineve_user");
        setUser(null);
      })
      .finally(() => setBootstrapping(false));
  }, []);

  const signIn = (authResult) => {
    if (authResult?.token) {
      localStorage.setItem("cineve_access_token", authResult.token);
    }

    if (authResult?.refreshToken) {
      localStorage.setItem("cineve_refresh_token", authResult.refreshToken);
    }

    if (authResult?.user) {
      localStorage.setItem("cineve_user", JSON.stringify(authResult.user));
      setUser(authResult.user);
    }
  };

  const signOut = () => {
    localStorage.removeItem("cineve_access_token");
    localStorage.removeItem("cineve_refresh_token");
    localStorage.removeItem("cineve_user");
    setUser(null);
  };

  const updateUser = (nextUser) => {
    localStorage.setItem("cineve_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const value = useMemo(() => ({ user, signIn, signOut, updateUser, bootstrapping }), [user, bootstrapping]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
