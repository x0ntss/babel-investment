"use client";
import React, { useState, useEffect } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { registerUser } from "../api";

function getQueryParam(name, searchParams) {
  return searchParams.get(name) || "";
}

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const codeFromUrl = getQueryParam("code", searchParams);
    if (codeFromUrl) setReferralCode(codeFromUrl);
  }, [searchParams]);

  const handleSignUp = async () => {
    // Email domain validation
    const allowedDomains = ["@gmail.com", "@hotmail.com"];
    if (!allowedDomains.some(domain => email.toLowerCase().endsWith(domain))) {
      setEmailError("يجب أن يكون البريد الإلكتروني Gmail أو Hotmail فقط");
      return;
    } else {
      setEmailError("");
    }
    setLoading(true);
    try {
      await registerUser({ username, email, phone, password, code: referralCode });
      toast({ title: "تم إنشاء الحساب بنجاح!", status: "success", duration: 2000 });
      router.push("/signin");
    } catch (err) {
      toast({ title: err.message || "فشل التسجيل", status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center minH="100vh">
      <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white" minW="350px">
        <Heading mb={6} textAlign="center">إنشاء حساب</Heading>
        <Stack spacing={4}>
          <Input placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} />
          <Input placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} isInvalid={!!emailError} />
          {emailError && <Text color="red.500" fontSize="sm">{emailError}</Text>}
          <Input placeholder="رقم الهاتف" value={phone} onChange={e => setPhone(e.target.value)} />
          <Input placeholder="كلمة المرور" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Input placeholder="رمز الإحالة (اختياري)" value={referralCode} onChange={e => setReferralCode(e.target.value)} />
          <Button colorScheme="green" w="full" isLoading={loading} onClick={handleSignUp}>إنشاء حساب</Button>
        </Stack>
        <Text mt={4} textAlign="center">
          لديك حساب بالفعل؟ <Button variant="link" colorScheme="blue" onClick={() => router.push("/signin")}>تسجيل الدخول</Button>
        </Text>
      </Box>
    </Center>
  );
} 