"use client";
import { useAuth } from "../contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import PageLoader from "./PageLoader";

export default function ClientLayout({ children }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Don't show main Navbar on admin routes
  const isAdminRoute = pathname?.startsWith('/admin');
  
  // Handle navigation loading states
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events?.on('routeChangeStart', handleStart);
    router.events?.on('routeChangeComplete', handleComplete);
    router.events?.on('routeChangeError', handleComplete);

    return () => {
      router.events?.off('routeChangeStart', handleStart);
      router.events?.off('routeChangeComplete', handleComplete);
      router.events?.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <div>
      {isLoading && <PageLoader />}
      {user && !isAdminRoute && <Navbar />}
      {children}
    </div>
  );
} 