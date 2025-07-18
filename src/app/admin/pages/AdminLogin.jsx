'use client';
import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack, Alert, InputGroup, InputRightElement, IconButton, Text } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { adminLogin } from '../api/admin';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        setError('بيانات الدخول غير صحيحة');
      }
    } catch (err) {
      setError('بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={24} p={8} bg="gray.800" borderRadius="lg" boxShadow="md" dir="rtl">
      <VStack as="form" spacing={6} onSubmit={handleSubmit} align="stretch">
        <Heading size="lg" color="white" textAlign="center">
          تسجيل دخول الإدارة
        </Heading>
        {error && <Alert status="error" fontSize="md" borderRadius="md">{error}</Alert>}
        <FormControl id="email" isRequired>
          <FormLabel fontWeight="bold" color="white">
            البريد الإلكتروني
          </FormLabel>
          <Input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="أدخل البريد الإلكتروني" textAlign="right" fontFamily="inherit" bg="gray.700" color="white" borderRadius="lg" boxShadow="md" _placeholder={{ color: 'gray.400' }} />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel fontWeight="bold" color="white">
            كلمة المرور
          </FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              textAlign="right"
              fontFamily="inherit"
              bg="gray.700"
              color="white"
              borderRadius="lg"
              boxShadow="md"
              _placeholder={{ color: 'gray.400' }}
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button type="submit" width="full" fontWeight="bold" fontSize="lg" colorScheme="blue" boxShadow="md" isLoading={loading}>
          دخول
        </Button>
        <Text color="gray.400" fontSize="sm" textAlign="center">
          للاستخدام الإداري فقط
        </Text>
      </VStack>
    </Box>
  );
};

export default AdminLogin; 