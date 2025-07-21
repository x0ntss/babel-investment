"use client";
import React, { useState, useEffect } from "react";
import {
  Heading,
  Input,
  Button,
  VStack,
  Text,
  useToast,
  Center,
  Icon,
  Card,
  CardBody,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerUser } from "../api";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus, FaSignInAlt, FaEye, FaEyeSlash, FaCode } from "react-icons/fa";

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
  const [referralCodeLocked, setReferralCodeLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const codeFromUrl = getQueryParam("code", searchParams);
    if (codeFromUrl) {
      setReferralCode(codeFromUrl);
      setReferralCodeLocked(true);
      // If not already on /signup, redirect
      if (window && window.location.pathname !== "/signup") {
        window.location.href = `/signup?code=${codeFromUrl}`;
      }
    }
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
    <Center minH="100vh" p={4}>
      <Card
        bg="rgba(0, 0, 0, 0.6)"
        backdropFilter="blur(20px)"
        border="1px solid"
        borderColor="brand.glassBorder"
        borderRadius="2xl"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
        overflow="hidden"
        position="relative"
        minW={{ base: "100%", sm: "450px" }}
        maxW="600px"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          bgGradient: 'linear(90deg, brand.neonBlue, brand.neonGreen, brand.neonPurple)',
          opacity: 0.8,
        }}
      >
        <CardBody p={8}>
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <VStack spacing={4}>
              <Icon as={FaUserPlus} boxSize={12} color="brand.neonGreen" />
              <Heading 
                fontSize={{ base: "2xl", md: "3xl" }} 
                textAlign="center"
                className="gradient-text"
                fontWeight="extrabold"
              >
                إنشاء حساب
              </Heading>
            </VStack>

            {/* Form */}
            <VStack spacing={6} align="stretch">
              <VStack spacing={2} align="stretch">
                <Text fontWeight="bold" color="white">اسم المستخدم</Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaUser} color="brand.neonBlue" />
                  </InputLeftElement>
                  <Input 
                    placeholder="أدخل اسم المستخدم"
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                    bg="rgba(255, 255, 255, 0.05)"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    _focus={{
                      borderColor: "brand.neonBlue",
                      boxShadow: "0 0 0 1px brand.neonBlue",
                    }}
                    _hover={{
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    }}
                  />
                </InputGroup>
              </VStack>

              <FormControl isInvalid={!!emailError}>
                <VStack spacing={2} align="stretch">
                  <Text fontWeight="bold" color="white">البريد الإلكتروني</Text>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FaEnvelope} color="brand.neonPurple" />
                    </InputLeftElement>
                    <Input 
                      placeholder="أدخل بريدك الإلكتروني"
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      bg="rgba(255, 255, 255, 0.05)"
                      border="1px solid"
                      borderColor={emailError ? "red.400" : "rgba(255, 255, 255, 0.2)"}
                      color="white"
                      _placeholder={{ color: "gray.400" }}
                      _focus={{
                        borderColor: emailError ? "red.400" : "brand.neonPurple",
                        boxShadow: emailError ? "0 0 0 1px red.400" : "0 0 0 1px brand.neonPurple",
                      }}
                      _hover={{
                        borderColor: emailError ? "red.400" : "rgba(255, 255, 255, 0.3)",
                      }}
                    />
                  </InputGroup>
                  {emailError && <FormErrorMessage color="red.400">{emailError}</FormErrorMessage>}
                </VStack>
              </FormControl>

              <VStack spacing={2} align="stretch">
                <Text fontWeight="bold" color="white">رقم الهاتف</Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaPhone} color="brand.neonOrange" />
                  </InputLeftElement>
                  <Input 
                    placeholder="أدخل رقم هاتفك"
                    value={phone} 
                    onChange={e => setPhone(e.target.value)}
                    bg="rgba(255, 255, 255, 0.05)"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    _focus={{
                      borderColor: "brand.neonOrange",
                      boxShadow: "0 0 0 1px brand.neonOrange",
                    }}
                    _hover={{
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    }}
                  />
                </InputGroup>
              </VStack>

              <VStack spacing={2} align="stretch">
                <Text fontWeight="bold" color="white">كلمة المرور</Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaLock} color="brand.neonGreen" />
                  </InputLeftElement>
                  <Input 
                    placeholder="أدخل كلمة المرور"
                    type={showPassword ? "text" : "password"}
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    bg="rgba(255, 255, 255, 0.05)"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    _focus={{
                      borderColor: "brand.neonGreen",
                      boxShadow: "0 0 0 1px brand.neonGreen",
                    }}
                    _hover={{
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    }}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                      icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                      variant="ghost"
                      color="gray.400"
                      _hover={{ color: "white" }}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </VStack>

              <VStack spacing={2} align="stretch">
                <Text fontWeight="bold" color="white">رمز الإحالة (اجباري)</Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaCode} color="brand.neonCyan" />
                  </InputLeftElement>
                  <Input 
                    placeholder="أدخل رمز الإحالة"
                    value={referralCode} 
                    onChange={e => setReferralCode(e.target.value)}
                    bg="rgba(255, 255, 255, 0.05)"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    _focus={{
                      borderColor: "brand.neonCyan",
                      boxShadow: "0 0 0 1px brand.neonCyan",
                    }}
                    _hover={{
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    }}
                    readOnly={referralCodeLocked}
                  />
                </InputGroup>
              </VStack>

              <Button 
                colorScheme="green" 
                w="full" 
                isLoading={loading} 
                onClick={handleSignUp}
                bg="brand.neonGreen"
                color="black"
                size="lg"
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
                إنشاء حساب
              </Button>
            </VStack>

            {/* Sign In Link */}
            <VStack spacing={4}>
              <Text color="gray.300" textAlign="center">
                لديك حساب بالفعل؟
              </Text>
              <Button 
                variant="outline" 
                colorScheme="blue" 
                onClick={() => router.push("/signin")}
                leftIcon={<FaSignInAlt />}
                borderColor="brand.neonBlue"
                color="brand.neonBlue"
                _hover={{
                  bg: "brand.neonBlue",
                  color: "white",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(0, 212, 255, 0.4)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.3s ease"
              >
                تسجيل الدخول
              </Button>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </Center>
  );
} 