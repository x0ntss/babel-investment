"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLogin from './pages/AdminLogin';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAdminAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    router.push('/admin/dashboard');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return <AdminLogin onLogin={handleLogin} />;
} 