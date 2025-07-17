"use client";
import { useAuth } from "../contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import PageLoader from "./PageLoader";
import { Box } from "@chakra-ui/react";

export default function ClientLayout({ children }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Don't show main navigation on admin routes
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
    <Box position="relative" minH="100vh">
      {isLoading && <PageLoader />}
      
      {/* Sticky Bottom Navbar - only after login and not on admin routes */}
      {user && !isAdminRoute && <Navbar />}
      
      <Box
        pb={user && !isAdminRoute ? { base: "80px", md: "90px" } : 0}
        minH="100vh"
        bg="transparent"
        position="relative"
        zIndex={1}
      >
        {children}
      </Box>
    </Box>
  );
} 