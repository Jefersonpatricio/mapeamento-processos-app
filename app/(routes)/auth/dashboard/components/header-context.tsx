import { createContext, useContext, ReactNode } from "react";

interface HeaderContextType {
  title: string;
  description?: string;
  showLastUpdated?: boolean;
  lastUpdated?: string;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({
  children,
  ...value
}: HeaderContextType & { children: ReactNode }) {
  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
}

export function useHeaderContext() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeaderContext must be used with HeaderProvider");
  }
  return context;
}
