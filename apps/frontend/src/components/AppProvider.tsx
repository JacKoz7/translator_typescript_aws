"use client";
import { IAuthUser } from "@/lib";
import React, { useContext, createContext, useState } from "react";
import { toast } from "sonner";

type IAppContext = {
  // user has 3 states - logged in, user not logged in, user dont have a account
  user: IAuthUser | null | undefined;
  setUser: (user: IAuthUser | null) => void;
  setError: (msg: string) => void;
  resetError: () => void;
};

const AppContext = createContext<IAppContext>({
  user: null,
  setUser: (user) => {},
  setError: (msg) => {},
  resetError: () => {},
});

function useInitialApp(): IAppContext {
  const [user, setUser] = useState<IAuthUser | null | undefined>(undefined);

  return {
    user,
    setUser,
    setError: (msg) => {
      toast.error(msg);
    },
    resetError: () => {
      toast.dismiss();
    },
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
