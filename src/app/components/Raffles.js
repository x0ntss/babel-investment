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
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useAuth } from "../contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

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
    <Box p={{ base: 4, md: 8 }} minH="100vh" maxW="600px" mx="auto">
      <Heading mb={6} fontSize={{ base: "2xl", md: "3xl" }} textAlign="center">
        رابط الاحالة الخاص بك
      </Heading>
      <Text mb={4} textAlign="center">
        شارك هذا الرابط مع أصدقائك للحصول على مكافأة 10% على اول ايداع :
      </Text>
      <InputGroup size="md" mb={4}>
        <Input value={raffleUrl} isReadOnly fontSize="md" />
        <InputRightElement width="4.5rem">
          <IconButton
            aria-label="نسخ الرابط"
            icon={<CopyIcon />}
            size="sm"
            onClick={handleCopy}
            colorScheme="blue"
          />
        </InputRightElement>
      </InputGroup>
      <Text mb={2} fontWeight="bold">رمز الاحالة الخاص بك:</Text>
      <Input
        value={raffleCode}
        onChange={e => setRaffleCode(e.target.value)}
        fontSize="md"
        mb={8}
      />
      <Button colorScheme="blue" onClick={() => router.push("/settings")}>العودة إلى الإعدادات</Button>
      {showSignUp && (
        <Button colorScheme="blue" onClick={() => router.push(`/signup?code=${raffleCode}`)}>
          تسجيل الدخول أو التسجيل
        </Button>
      )}
    </Box>
  );
} 