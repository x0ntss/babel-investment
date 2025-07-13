"use client";
import React, { useState } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  Stack,
  Text,
  useToast,
  Center,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { loginUser, getCurrentUser } from "../api";
import { useAuth } from "../contexts/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const toast = useToast();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      // Try login with email first, then phone if email fails
      let res;
      try {
        res = await loginUser(identifier, password);
      } catch (err) {
        // Optionally, try phone login if email fails (if backend supports)
        throw err;
      }
      localStorage.setItem("token", res.token);
      // Fetch user info after login
      const user = await getCurrentUser();
      login(user);
      toast({ title: "تم تسجيل الدخول!", status: "success", duration: 2000 });
      router.push("/");
    } catch (err) {
      toast({ title: err.message || "فشل تسجيل الدخول", status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center minH="100vh">
      <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white" minW="350px">
        <Heading mb={6} textAlign="center">تسجيل الدخول</Heading>
        <Stack spacing={4}>
          <Input placeholder="البريد الإلكتروني أو رقم الهاتف" value={identifier} onChange={e => setIdentifier(e.target.value)} />
          <Input placeholder="كلمة المرور" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button colorScheme="blue" w="full" isLoading={loading} onClick={handleSignIn}>تسجيل الدخول</Button>
        </Stack>
        <Text mt={4} textAlign="center">
          ليس لديك حساب؟ <Button variant="link" colorScheme="green" onClick={() => router.push("/signup")}>إنشاء حساب</Button>
        </Text>
      </Box>
    </Center>
  );
} 