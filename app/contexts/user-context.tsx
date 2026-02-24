"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useLayoutEffect,
} from "react";

interface User {
  name: string;
  email?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
        } catch {
          setUser({ name: storedUser });
        }
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <>{children}</>;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  return context;
}
