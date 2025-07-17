"use client";
import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { loginUser, getCurrentUser } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignInPage() {
  const router = useRouter();
  const toast = useToast();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      router.push("/account");
    } catch (err) {
      toast({ title: err.message || "فشل تسجيل الدخول", status: "error", duration: 3000 });
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
        minW={{ base: "100%", sm: "400px" }}
        maxW="500px"
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
              <Icon as={FaSignInAlt} boxSize={12} color="brand.neonBlue" />
              <Heading 
                fontSize={{ base: "2xl", md: "3xl" }} 
                textAlign="center"
                className="gradient-text"
                fontWeight="extrabold"
              >
                تسجيل الدخول
              </Heading>
            </VStack>

            {/* Form */}
            <VStack spacing={6} align="stretch">
              <VStack spacing={2} align="stretch">
                <Text fontWeight="bold" color="white">البريد الإلكتروني أو رقم الهاتف</Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FaEnvelope} color="brand.neonBlue" />
                  </InputLeftElement>
                  <Input 
                    placeholder="أدخل بريدك الإلكتروني أو رقم هاتفك"
                    value={identifier} 
                    onChange={e => setIdentifier(e.target.value)}
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

              <Button 
                colorScheme="blue" 
                w="full" 
                isLoading={loading} 
                onClick={handleSignIn}
                bg="brand.neonBlue"
                color="white"
                size="lg"
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
                تسجيل الدخول
              </Button>
            </VStack>

            {/* Sign Up Link */}
            <VStack spacing={4}>
              <Text color="gray.300" textAlign="center">
                ليس لديك حساب؟
              </Text>
              <Button 
                variant="outline" 
                colorScheme="green" 
                onClick={() => router.push("/signup")}
                leftIcon={<FaUserPlus />}
                borderColor="brand.neonGreen"
                color="brand.neonGreen"
                _hover={{
                  bg: "brand.neonGreen",
                  color: "black",
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
          </VStack>
        </CardBody>
      </Card>
    </Center>
  );
} 