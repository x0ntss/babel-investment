"use client";
import { ChakraProvider, extendTheme, Box } from '@chakra-ui/react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtl from 'stylis-plugin-rtl';
import AdminNavbar from './components/AdminNavbar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const theme = extendTheme({
  direction: 'rtl',
  fonts: {
    heading: 'Tajawal, Cairo, Arial, sans-serif',
    body: 'Tajawal, Cairo, Arial, sans-serif',
  },
  colors: {
    brand: {
      50: '#f5f7fa',
      100: '#e4e7ed',
      200: '#cfd8dc',
      300: '#b0bec5',
      400: '#90a4ae',
      500: '#78909c',
      600: '#607d8b',
      700: '#546e7a',
      800: '#455a64',
      900: '#263238',
    },
  },
});

const cacheRtl = createCache({
  key: 'chakra-rtl',
  stylisPlugins: [rtl],
});

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      setIsAuthenticated(!!token);
      setChecked(true);
      if (!token && window.location.pathname !== '/admin') {
        router.replace('/admin');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
    router.replace('/admin');
  };

  if (!checked) {
    return null;
  }

  // Always render children at /admin (login page), otherwise protect
  if (!isAuthenticated && typeof window !== 'undefined' && window.location.pathname !== '/admin') {
    return null;
  }

  return (
    <CacheProvider value={cacheRtl}>
      <ChakraProvider theme={theme} resetCSS>
        <Box
          minH="100vh"
          bg="gray.900"
          fontFamily="Tajawal, Cairo, Arial, sans-serif"
          color="white"
          sx={{
            '::-webkit-scrollbar': { width: '8px', background: 'rgba(0,0,0,0.2)' },
            '::-webkit-scrollbar-thumb': { background: '#2563eb', borderRadius: '8px' },
          }}
          w="full"
          maxW="100%"
        >
          {isAuthenticated && <AdminNavbar onLogout={handleLogout} />}
          <Box as="main" w="full" maxW="100%" p={0} m={0} bg="transparent">
            {children}
          </Box>
        </Box>
      </ChakraProvider>
    </CacheProvider>
  );
} 