import { createContext, useContext, useMemo, useState } from "react";

const LayoutContext = createContext<
  | {
      hideBottomNavigation: boolean;
      setHideBottomNavigation: React.Dispatch<React.SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

export const useLayout = () => useContext(LayoutContext);

type LayoutProviderProps = {
  children: React.ReactNode;
};

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [hideBottomNavigation, setHideBottomNavigation] = useState(false);

  const contextValue = useMemo(() => ({ hideBottomNavigation, setHideBottomNavigation }), [hideBottomNavigation]);

  return <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>;
}
