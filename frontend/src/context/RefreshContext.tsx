import { createContext, useContext, useState, ReactNode } from "react";

interface RefreshContextType {
  refresh: boolean;
  setRefresh: (value: boolean | ((prev: boolean) => boolean)) => void; 
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider = ({ children }: { children: ReactNode }) => {
  const [refresh, setRefresh] = useState<boolean>(false);


  return (
    <RefreshContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error("useRefresh must be used within a RefreshProvider");
  }
  return context;
};
