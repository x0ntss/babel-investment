"use client";
import React from 'react';
import { Box, Flex, Link, Heading, Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

const AdminNavbar = ({ onLogout }) => {
  const pathname = usePathname();
  
  return (
  <Box bg="gray.700" color="white" px={8} py={4}>
    <Flex align="center" justify="space-between">
      <Heading size="md">Admin Panel</Heading>
      <Flex gap={6} align="center">
        <Link as={NextLink} href="/admin/dashboard" fontWeight={pathname === '/admin/dashboard' ? 'bold' : 'normal'} color={pathname === '/admin/dashboard' ? 'teal.200' : 'white'}>Dashboard</Link>
        <Link as={NextLink} href="/admin/users" fontWeight={pathname === '/admin/users' ? 'bold' : 'normal'} color={pathname === '/admin/users' ? 'teal.200' : 'white'}>Users</Link>
        <Link as={NextLink} href="/admin/transactions" fontWeight={pathname === '/admin/transactions' ? 'bold' : 'normal'} color={pathname === '/admin/transactions' ? 'teal.200' : 'white'}>Transactions</Link>
        <Button ml={8} colorScheme="red" size="sm" onClick={onLogout}>Logout</Button>
      </Flex>
    </Flex>
  </Box>
  );
};

export default AdminNavbar; 