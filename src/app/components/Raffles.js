"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  useToast,
  IconButton,
  InputGroup,
  InputRightElement,
  VStack,
  HStack,
  Icon,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { FaLink, FaCopy, FaArrowLeft, FaGift, FaShare } from "react-icons/fa";

function getQueryParam(name, searchParams) {
  return searchParams.get(name) || "";
}

export default function Raffles() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [raffleCode, setRaffleCode] = useState("");
  const [raffleUrl, setRaffleUrl] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    // Extract code from URL or use user's referralCode
    const codeFromUrl = getQueryParam("code", searchParams);
    if (codeFromUrl) {
      setRaffleCode(codeFromUrl);
      setShowSignUp(true);
      setTimeout(() => {
        router.push(`/signup?code=${codeFromUrl}`);
      }, 0);
    } else if (user && user.referralCode) {
      setRaffleCode(user.referralCode);
    }
  }, [searchParams, user, router]);

  useEffect(() => {
    if (raffleCode) {
      const baseUrl = window.location.origin + window.location.pathname;
      setRaffleUrl(`${baseUrl}?code=${raffleCode}`);
    }
  }, [raffleCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(raffleUrl);
    toast({ title: "تم نسخ الرابط!", status: "success", duration: 2000 });
  };

  return (
    <Box p={{ base: 4, md: 8 }} minH="100vh" maxW="800px" mx="auto" mb={20}>
      <VStack spacing={8} align="stretch">
        <Heading 
          fontSize={{ base: "3xl", md: "4xl" }} 
          textAlign="center"
          className="gradient-text"
          fontWeight="extrabold"
          letterSpacing="wider"
        >
          رابط الاحالة الخاص بك
        </Heading>

        <Card
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor="brand.glassBorder"
          borderRadius="2xl"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
          overflow="hidden"
          position="relative"
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
              {/* Header Section */}
              <VStack spacing={4}>
                <Icon as={FaGift} boxSize={12} color="brand.neonOrange" />
                <Text fontSize="lg" color="gray.300" textAlign="center" lineHeight="tall">
                  شارك هذا الرابط مع أصدقائك للحصول على مكافأة <Text as="span" color="brand.neonGreen" fontWeight="bold">10%</Text> على اول ايداع
                </Text>
              </VStack>

              {/* Referral URL Section */}
              <VStack spacing={4} align="stretch">
                <HStack spacing={3}>
                  <Icon as={FaLink} color="brand.neonBlue" boxSize={5} />
                  <Text fontWeight="bold" color="white">رابط الاحالة:</Text>
                </HStack>
                
                <InputGroup size="lg">
                  <Input 
                    value={raffleUrl} 
                    isReadOnly 
                    fontSize="md"
                    bg="rgba(255, 255, 255, 0.05)"
                    border="1px solid"
                    borderColor="rgba(255, 255, 255, 0.2)"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    _focus={{
                      borderColor: "brand.neonBlue",
                      boxShadow: "0 0 0 1px brand.neonBlue",
                    }}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      aria-label="نسخ الرابط"
                      icon={<FaCopy />}
                      size="md"
                      onClick={handleCopy}
                      bg="brand.neonBlue"
                      color="white"
                      _hover={{
                        bg: "brand.neonBlue",
                        transform: "scale(1.05)",
                        boxShadow: "0 0 15px rgba(0, 212, 255, 0.4)",
                      }}
                      transition="all 0.3s ease"
                    />
                  </InputRightElement>
                </InputGroup>
              </VStack>

              {/* Referral Code Section */}
              <VStack spacing={4} align="stretch">
                <HStack spacing={3}>
                  <Icon as={FaShare} color="brand.neonPurple" boxSize={5} />
                  <Text fontWeight="bold" color="white">رمز الاحالة الخاص بك:</Text>
                </HStack>
                
                <Input
                  value={raffleCode}
                  onChange={e => setRaffleCode(e.target.value)}
                  fontSize="md"
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.2)"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
                  _focus={{
                    borderColor: "brand.neonPurple",
                    boxShadow: "0 0 0 1px brand.neonPurple",
                  }}
                />
              </VStack>

              {/* Action Buttons */}
              <VStack spacing={4}>
                <Button 
                  colorScheme="blue" 
                  onClick={() => router.push("/settings")}
                  leftIcon={<FaArrowLeft />}
                  bg="brand.neonBlue"
                  color="white"
                  size="lg"
                  w="full"
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
                  العودة إلى الإعدادات
                </Button>
                
                {showSignUp && (
                  <Button 
                    colorScheme="green" 
                    onClick={() => router.push(`/signup?code=${raffleCode}`)}
                    bg="brand.neonGreen"
                    color="black"
                    size="lg"
                    w="full"
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
                    تسجيل الدخول أو التسجيل
                  </Button>
                )}
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
} 