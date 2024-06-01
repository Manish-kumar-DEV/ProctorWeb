"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { IUserToken, decrypt, getSession, removeSession } from "@/utils/auth";
import { useRouter } from "next/navigation";

interface IAuthContext {
  user: IUserToken | null;
  isLoading: boolean;
  isError: boolean;
  isAuthenticated: boolean;
  onLogin: (email: string, password: string) => Promise<void>;
  onLogout: () => void;
  onSignup: (userInfo: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isError: false,
  onSignup: () => Promise.resolve(),
  onLogin: () => Promise.resolve(),
  onLogout: () => {},
});
interface IAuthProvider {
  children: React.ReactNode;
}

export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }: IAuthProvider): React.ReactNode => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const user = await response.json();
          setUser(user.sessionData);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const onSignup = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        setUser(user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onLogin = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onLogout = () => {
    removeSession();
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isError,
        onSignup,
        onLogin,
        onLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
