"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface StoreData {
    _id: string;
    name: string;
    username: string;
  }

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  storeData: StoreData | null;
  setStoreData: (data: StoreData | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const userContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const useUserContext = () => useContext(userContext);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [storeData, setStoreData] = useState<StoreData | null>(null);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("jwtToken");
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, storeData, setStoreData, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
