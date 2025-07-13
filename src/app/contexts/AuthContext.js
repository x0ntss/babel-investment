"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  // Refresh user info from backend
  const refreshUser = async () => {
    try {
      const freshUser = await getCurrentUser();
      setUser(freshUser);
      return freshUser;
    } catch {
      // Optionally handle error
      return null;
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
