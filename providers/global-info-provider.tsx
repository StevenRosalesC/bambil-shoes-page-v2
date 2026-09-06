"use client";

import React, { createContext, useContext, useState } from "react";
import { GlobalDataData } from "@/types/GlobalInfo";

interface GlobalInfoContextType {
  globalInfo: GlobalDataData | null;
  setGlobalInfo: React.Dispatch<React.SetStateAction<GlobalDataData | null>>;
}

export const GlobalInfoContext = createContext<GlobalInfoContextType>({
  globalInfo: null,
  setGlobalInfo: () => {},
});

interface GlobalInfoProviderProps {
  children: React.ReactNode;
  initialData: GlobalDataData | null;
}

export const GlobalInfoProvider = ({
  children,
  initialData,
}: GlobalInfoProviderProps) => {
  const [globalInfo, setGlobalInfo] = useState<GlobalDataData | null>(initialData);

  return (
    <GlobalInfoContext.Provider value={{ globalInfo, setGlobalInfo }}>
      {children}
    </GlobalInfoContext.Provider>
  );
};

// Custom hook for convenient consumption in client components
export const useGlobalInfo = () => {
  const context = useContext(GlobalInfoContext);
  if (!context) {
    throw new Error("useGlobalInfo must be used within a GlobalInfoProvider");
  }
  return context;
};

