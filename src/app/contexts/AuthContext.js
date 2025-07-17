"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  // Refresh user info from backend
  const refreshUser = async () => {
    try {
      setLoading(true);
      const freshUser = await getCurrentUser();
      setUser(freshUser);
      return freshUser;
    } catch (error) {
      console.error("Error refreshing user:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Optionally refresh user data from server
          try {
            const freshUser = await getCurrentUser();
            setUser(freshUser);
          } catch (error) {
            console.error("Failed to refresh user data:", error);
            // Keep the saved user data if refresh fails
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
