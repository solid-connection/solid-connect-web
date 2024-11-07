"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

import TextModal from "@/components/modal/TextModal";

type AlertContextType = {
  alert: (message: string) => Promise<void>;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alertState, setAlertState] = useState<{ message: string; resolve: () => void } | null>(null);

  const alert = useCallback(
    (message: string): Promise<void> =>
      new Promise((resolve) => {
        setAlertState({ message, resolve });
      }),
    [],
  );

  const handleClose = () => {
    if (alertState) {
      alertState.resolve();
      setAlertState(null);
    }
  };

  const value = useMemo(() => ({ alert }), [alert]);

  return (
    <AlertContext.Provider value={value}>
      {children}
      {alertState && <TextModal isOpen handleClose={handleClose} title="알림" content={alertState.message} />}
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
