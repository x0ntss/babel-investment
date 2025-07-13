"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '../pages/Dashboard';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAdminAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Dashboard />;
} 