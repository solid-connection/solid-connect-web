import React, { createContext, useContext, useState } from "react";

import TextModal from "@/components/modal/TextModal";

type AlertContextType = {
  alert: (message: string) => Promise<void>;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alertState, setAlertState] = useState<{ message: string; resolve: () => void } | null>(null);

  const alert = (message: string): Promise<void> => {
    return new Promise((resolve) => {
      setAlertState({ message, resolve });
    });
  };

  const handleClose = () => {
    if (alertState) {
      alertState.resolve();
      setAlertState(null);
    }
  };

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      {alertState && <TextModal isOpen={true} handleClose={handleClose} title="알림" content={alertState.message} />}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert는 AlertProvider 내에서 사용해야 합니다.");
  }
  return context;
};
