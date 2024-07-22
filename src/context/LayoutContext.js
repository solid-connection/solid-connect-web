import { createContext, useContext, useState } from "react";

const LayoutContext = createContext();

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider = ({ children }) => {
  const [hideBottomNavigation, setHideBottomNavigation] = useState(false);

  return (
    <LayoutContext.Provider value={{ hideBottomNavigation, setHideBottomNavigation }}>
      {children}
    </LayoutContext.Provider>
  );
};
