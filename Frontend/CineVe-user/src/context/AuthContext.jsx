import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const rawUser = localStorage.getItem("cineve_user");
    return rawUser ? JSON.parse(rawUser) : null;
  });

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

  const value = useMemo(() => ({ user, signIn, signOut }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
