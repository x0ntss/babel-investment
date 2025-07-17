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
  Card,
  CardBody,
  Icon,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { getCurrentUser, updateAccountSettings } from "../api";
import { FaShieldAlt, FaEnvelope, FaPhone, FaKey, FaLock } from "react-icons/fa";

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

  if (loading) return (
    <Center minH="60vh">
      <Spinner size="xl" color="brand.neonBlue" thickness="4px" />
    </Center>
  );

  return (
    <Box p={{ base: 4, md: 8 }} minH="100vh" maxW={{ base: '100%', lg: '800px' }} mb={12} mx="auto">
      <Heading 
        mb={8} 
        fontSize={{ base: "3xl", md: "4xl" }} 
        textAlign="center"
        className="gradient-text"
        fontWeight="extrabold"
        letterSpacing="wider"
      >
        إعدادات الأمان
      </Heading>

      <VStack spacing={8}>
        {/* Email Settings */}
        <Card
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor="brand.glassBorder"
          borderRadius="2xl"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
          w="full"
          overflow="hidden"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            bg: 'brand.neonBlue',
            opacity: 0.8,
          }}
        >
          <CardBody p={6}>
            <VStack spacing={6} align="stretch">
              <Flex align="center" spacing={3}>
                <Icon as={FaEnvelope} color="brand.neonBlue" boxSize={6} />
                <Text fontSize="xl" fontWeight="bold" color="white">
                  تحديث البريد الإلكتروني
                </Text>
              </Flex>
              
              <Box>
                <Text mb={2} fontWeight="bold" color="gray.300">البريد الإلكتروني الحالي</Text>
                <Text mb={4} color="white" bg="rgba(255, 255, 255, 0.05)" p={3} borderRadius="lg" border="1px solid" borderColor="rgba(255, 255, 255, 0.1)">
                  {currentEmail}
                </Text>
              </Box>

              <Box>
                <Text mb={2} fontWeight="bold" color="gray.300">البريد الإلكتروني الجديد</Text>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  mb={2}
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid"
                  borderColor={emailError ? "red.400" : "rgba(255, 255, 255, 0.2)"}
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                  _focus={{
                    borderColor: "brand.neonBlue",
                    boxShadow: "0 0 0 1px brand.neonBlue",
                  }}
                  isInvalid={!!emailError}
                />
                {emailError && <Text color="red.400" fontSize="sm">{emailError}</Text>}
              </Box>

              <Box>
                <Text mb={2} fontWeight="bold" color="gray.300">كلمة السر الحالية (مطلوبة لتغيير البريد الإلكتروني)</Text>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  mb={2}
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid"
                  borderColor={oldPasswordError ? "red.400" : "rgba(255, 255, 255, 0.2)"}
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                  _focus={{
                    borderColor: "brand.neonBlue",
                    boxShadow: "0 0 0 1px brand.neonBlue",
                  }}
                  isInvalid={!!oldPasswordError}
                />
                {oldPasswordError && <Text color="red.400" fontSize="sm">{oldPasswordError}</Text>}
              </Box>

              <Button 
                colorScheme="blue" 
                w="100%" 
                isLoading={saving} 
                onClick={() => handleUpdate("email")}
                bg="brand.neonBlue"
                color="white"
                _hover={{
                  bg: "brand.neonBlue",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(0, 212, 255, 0.4)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.3s ease"
              >
                تحديث البريد الإلكتروني
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Phone Settings */}
        <Card
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor="brand.glassBorder"
          borderRadius="2xl"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
          w="full"
          overflow="hidden"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            bg: 'brand.neonGreen',
            opacity: 0.8,
          }}
        >
          <CardBody p={6}>
            <VStack spacing={6} align="stretch">
              <Flex align="center" spacing={3}>
                <Icon as={FaPhone} color="brand.neonGreen" boxSize={6} />
                <Text fontSize="xl" fontWeight="bold" color="white">
                  تحديث رقم الهاتف
                </Text>
              </Flex>

              <Box>
                <Text mb={2} fontWeight="bold" color="gray.300">رقم الهاتف</Text>
                <Input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  mb={2}
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid"
                  borderColor={phoneError ? "red.400" : "rgba(255, 255, 255, 0.2)"}
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                  _focus={{
                    borderColor: "brand.neonGreen",
                    boxShadow: "0 0 0 1px brand.neonGreen",
                  }}
                  isInvalid={!!phoneError}
                />
                {phoneError && <Text color="red.400" fontSize="sm">{phoneError}</Text>}
              </Box>

              <Button 
                colorScheme="green" 
                w="100%" 
                isLoading={saving} 
                onClick={() => handleUpdate("phone")}
                bg="brand.neonGreen"
                color="white"
                _hover={{
                  bg: "brand.neonGreen",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(0, 255, 127, 0.4)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.3s ease"
              >
                تحديث رقم الهاتف
              </Button>
            </VStack>
          </CardBody>
        </Card>

        {/* Password Settings */}
        <Card
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor="brand.glassBorder"
          borderRadius="2xl"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
          w="full"
          overflow="hidden"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            bg: 'brand.neonPurple',
            opacity: 0.8,
          }}
        >
          <CardBody p={6}>
            <VStack spacing={6} align="stretch">
              <Flex align="center" spacing={3}>
                <Icon as={FaLock} color="brand.neonPurple" boxSize={6} />
                <Text fontSize="xl" fontWeight="bold" color="white">
                  تغيير كلمة السر
                </Text>
              </Flex>

              <Box>
                <Text mb={2} fontWeight="bold" color="gray.300">كلمة سر جديدة</Text>
                <Input
                  type="password"
                  placeholder="كلمة سر جديدة"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  mb={2}
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid"
                  borderColor={passwordError ? "red.400" : "rgba(255, 255, 255, 0.2)"}
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                  _focus={{
                    borderColor: "brand.neonPurple",
                    boxShadow: "0 0 0 1px brand.neonPurple",
                  }}
                  isInvalid={!!passwordError}
                />
                {passwordError && <Text color="red.400" fontSize="sm">{passwordError}</Text>}
              </Box>

              <Box>
                <Text mb={2} fontWeight="bold" color="gray.300">كلمة السر الحالية (مطلوبة لتغيير كلمة السر)</Text>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  mb={2}
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid"
                  borderColor={oldPasswordError ? "red.400" : "rgba(255, 255, 255, 0.2)"}
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                  _focus={{
                    borderColor: "brand.neonPurple",
                    boxShadow: "0 0 0 1px brand.neonPurple",
                  }}
                  isInvalid={!!oldPasswordError}
                />
                {oldPasswordError && <Text color="red.400" fontSize="sm">{oldPasswordError}</Text>}
              </Box>

              <Button 
                colorScheme="purple" 
                w="100%" 
                isLoading={saving} 
                onClick={() => handleUpdate("password")}
                bg="brand.neonPurple"
                color="white"
                _hover={{
                  bg: "brand.neonPurple",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(147, 51, 234, 0.4)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.3s ease"
              >
                تحديث كلمة السر
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
