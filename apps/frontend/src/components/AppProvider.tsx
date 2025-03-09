"use client";
import { IAuthUser } from "@/lib";
import { ITranslateResult } from "@sff/shared-types";
import React, { useContext, createContext, useState } from "react";
import { toast } from "sonner";

type IAppContext = {
  user: IAuthUser | null | undefined;
  setUser: (user: IAuthUser | null) => void;
  setError: (msg: string) => void;
  resetError: () => void;
  selectedTranslation: ITranslateResult | null;
  setSelectedTranslation: (item: ITranslateResult) => void;
};

const AppContext = createContext<IAppContext>({
  user: null,
  setUser: () => {}, 
  setError: () => {}, 
  resetError: () => {},
  selectedTranslation: null,
  setSelectedTranslation: () => {}, 
});

function useInitialApp(): IAppContext {
  const [selectedTranslation, setSelectedTranslation] =
    useState<ITranslateResult | null>(null);
  const [user, setUser] = useState<IAuthUser | null | undefined>(undefined);

  return {
    user,
    setUser,
    setError: (msg: string) => {
      toast.error(msg); 
    },
    resetError: () => {
      toast.dismiss();
    },
    selectedTranslation,
    setSelectedTranslation,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const initialValue = useInitialApp();
  return (
    <AppContext.Provider value={initialValue}>{children}</AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
