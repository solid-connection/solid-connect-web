"use client";

import { createContext, useContext, useMemo, useState } from "react";

type LayoutContextType = {
  hideBottomNavigation: boolean;
  setHideBottomNavigation: React.Dispatch<React.SetStateAction<boolean>>;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};

type LayoutProviderProps = {
  children: React.ReactNode;
};

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const [hideBottomNavigation, setHideBottomNavigation] = useState(false);

  const contextValue = useMemo(() => ({ hideBottomNavigation, setHideBottomNavigation }), [hideBottomNavigation]);

  return <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>;
};
