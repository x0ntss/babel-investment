"use client";
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
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
  }, []);

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
        <div dir="rtl" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%)' }}>
          {isAuthenticated && <AdminNavbar onLogout={handleLogout} />}
          <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem', borderRadius: 16, background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
            {children}
          </main>
        </div>
      </ChakraProvider>
    </CacheProvider>
  );
} 