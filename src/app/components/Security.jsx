"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  Input,
  Button,
  Text,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { getCurrentUser, updateAccountSettings } from "../api";

export default function Security() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const toast = useToast();

  useEffect(() => {
    getCurrentUser()
      .then(user => {
        setCurrentEmail(user.email || "");
        setPhone(user.phone || "");
      })
      .catch(() => toast({ title: "فشل تحميل بيانات المستخدم", status: "error" }))
      .finally(() => setLoading(false));
  }, [toast]);

  const validateEmail = (val) => {
    const allowedDomains = ["@gmail.com", "@hotmail.com"];
    if (!val) return "البريد الإلكتروني مطلوب";
    if (!allowedDomains.some(domain => val.toLowerCase().endsWith(domain))) {
      return "يجب أن يكون البريد الإلكتروني Gmail أو Hotmail فقط";
    }
    return "";
  };
  const validatePhone = (val) => {
    if (!val) return "رقم الهاتف مطلوب";
    if (!/^\d{8,15}$/.test(val.replace(/\D/g, ""))) return "رقم الهاتف غير صالح";
    return "";
  };
  const validatePassword = (val) => {
    if (val && val.length < 6) return "كلمة السر يجب أن تكون 6 أحرف على الأقل";
    return "";
  };
  const validateOldPassword = (val) => {
    if (!val) return "كلمة السر الحالية مطلوبة";
    return "";
  };

  const handleUpdate = async (field) => {
    let valid = true;
    let data = {};
    if (field === "email") {
      const err = validateEmail(newEmail);
      setEmailError(err);
      if (err) valid = false;
      const oldErr = validateOldPassword(oldPassword);
      setOldPasswordError(oldErr);
      if (oldErr) valid = false;
      data.email = newEmail;
      data.oldPassword = oldPassword;
    }
    if (field === "phone") {
      const err = validatePhone(phone);
      setPhoneError(err);
      if (err) valid = false;
      data.phone = phone;
    }
    if (field === "password") {
      const err = validatePassword(password);
      setPasswordError(err);
      if (err) valid = false;
      const oldErr = validateOldPassword(oldPassword);
      setOldPasswordError(oldErr);
      if (oldErr) valid = false;
      data.password = password;
      data.oldPassword = oldPassword;
    }
    if (!valid) return;
    setSaving(true);
    try {
      await updateAccountSettings(data);
      toast({
        title: "تم التحديث",
        description: `${field === "email" ? "البريد الإلكتروني" : field === "phone" ? "رقم الهاتف" : "كلمة السر"} تم تحديثه بنجاح.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      if (field === "email") {
        setCurrentEmail(newEmail);
        setNewEmail("");
        setOldPassword("");
      }
      if (field === "password") {
        setPassword("");
        setOldPassword("");
      }
    } catch (err) {
      toast({
        title: "فشل التحديث",
        description: err.message || "حدث خطأ ما",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Center minH="60vh"><Spinner /></Center>;

  return (
    <Box  p={{ base: 4, md: 8 }} minH="100vh" maxW={{ base: '100%', sm: '500px' }} mb={12} mx="auto">
      <Heading mb={8} fontSize={{ base: "2xl", md: "3xl" }} textAlign="center">
        الأمان وتحديث المعلومات
      </Heading>

      <VStack spacing={6} bg="white" p={{ base: 2, md: 6 }} rounded="xl" boxShadow="lg">
        <Box w="100%">
          <Text mb={2} fontWeight="bold">البريد الإلكتروني الحالي</Text>
          <Text mb={2} color="gray.600" bg="gray.100" p={2} rounded="md">{currentEmail}</Text>
          <Text mb={2} fontWeight="bold">البريد الإلكتروني الجديد</Text>
          <Input
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            mb={2}
            bg="gray.100"
            isInvalid={!!emailError}
          />
          {emailError && <Text color="red.500" fontSize="sm">{emailError}</Text>}
          <Text mb={2} fontWeight="bold">كلمة السر الحالية (مطلوبة لتغيير البريد الإلكتروني)</Text>
          <Input
            type="password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            mb={2}
            bg="gray.100"
            isInvalid={!!oldPasswordError}
          />
          {oldPasswordError && <Text color="red.500" fontSize="sm">{oldPasswordError}</Text>}
          <Button colorScheme="blue" w="100%" isLoading={saving} onClick={() => handleUpdate("email")}>تحديث البريد الإلكتروني</Button>
        </Box>

        <Box w="100%">
          <Text mb={2} fontWeight="bold">رقم الهاتف الحالي</Text>
          <Input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            mb={2}
            bg="gray.100"
            isInvalid={!!phoneError}
          />
          {phoneError && <Text color="red.500" fontSize="sm">{phoneError}</Text>}
          <Button colorScheme="blue" w="100%" isLoading={saving} onClick={() => handleUpdate("phone")}>تحديث رقم الهاتف</Button>
        </Box>

        <Box w="100%">
          <Text mb={2} fontWeight="bold">تغيير كلمة السر</Text>
          <Input
            type="password"
            placeholder="كلمة سر جديدة"
            value={password}
            onChange={e => setPassword(e.target.value)}
            mb={2}
            bg="gray.100"
            isInvalid={!!passwordError}
          />
          {passwordError && <Text color="red.500" fontSize="sm">{passwordError}</Text>}
          <Text mb={2} fontWeight="bold">كلمة السر الحالية (مطلوبة لتغيير كلمة السر)</Text>
          <Input
            type="password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            mb={2}
            bg="gray.100"
            isInvalid={!!oldPasswordError}
          />
          {oldPasswordError && <Text color="red.500" fontSize="sm">{oldPasswordError}</Text>}
          <Button colorScheme="blue" w="100%" isLoading={saving} onClick={() => handleUpdate("password")}>تحديث كلمة السر</Button>
        </Box>
      </VStack>
    </Box>
  );
}
