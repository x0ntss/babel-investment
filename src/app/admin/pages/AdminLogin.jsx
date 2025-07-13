"use client";
import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack, Alert } from '@chakra-ui/react';
import { adminLogin } from '../api/admin';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { token } = await adminLogin(email, password);
      if (token) {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('isAdminAuthenticated', 'true');
        onLogin();
      } else {
        setError('Invalid admin credentials.');
      }
    } catch (err) {
      setError('Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={24} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
      <VStack as="form" spacing={6} onSubmit={handleSubmit}>
        <Heading size="lg">Admin Login</Heading>
        {error && <Alert status="error">{error}</Alert>}
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="text" value={email} onChange={e => setEmail(e.target.value)} />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </FormControl>
        <Button type="submit" colorScheme="teal" isLoading={loading} width="full">Login</Button>
      </VStack>
    </Box>
  );
};

export default AdminLogin; 