"use client";
import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import AdminNavbar from './components/AdminNavbar';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status from localStorage
    const authStatus = localStorage.getItem('isAdminAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return children; // Let the login page handle authentication
  }

  return (
    <>
      <AdminNavbar onLogout={handleLogout} />
      <Box as="main" minH="100vh" bg="gray.50">
        {children}
      </Box>
    </>
  );
} 