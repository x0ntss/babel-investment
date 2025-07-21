"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Heading,
  Spinner,
  Divider,
  Alert,
  AlertIcon,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
} from "@chakra-ui/react";
import TransactionTable from "../../components/TransactionTable";

export default function UserDetailsPage() {
  const { userId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("adminToken");
    Promise.all([
      fetch(`/api/admin/users/${userId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      }).then((res) => (res.ok ? res.json() : Promise.reject(res))),
      fetch(`/api/admin/transactions?userId=${userId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      }).then((res) => (res.ok ? res.json() : Promise.reject(res))),
    ])
      .then(([userData, txs]) => {
        setUser(userData);
        setTransactions(txs);
      })
      .catch(async (err) => {
        let msg = "فشل تحميل بيانات المستخدم";
        if (err.status === 401) {
          msg = "غير مصرح – يرجى تسجيل الدخول مرة أخرى";
          setTimeout(() => router.push("/admin"), 1500);
        } else if (err.status === 404) {
          msg = "المستخدم غير موجود";
        }
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [userId, router]);

  if (loading) {
    return (
      <Box minH="60vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="blue.400" thickness="4px" />
      </Box>
    );
  }
  if (error) {
    return (
      <Box minH="60vh" display="flex" alignItems="center" justifyContent="center">
        <Alert status="error" borderRadius="md" maxW="400px">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }
  if (!user) return null;

  return (
    <Box px={{ base: 2, md: 4, lg: 8 }} py={{ base: 4, md: 8, lg: 12 }} bg="gray.900" minH="100vh" w="full" maxW="100%">
      <Heading size="lg" mb={4} color="white">
        تفاصيل المستخدم
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 8 }} mb={8} w="full" maxW="100%">
        <VStack align="start" spacing={2} bg="gray.800" p={{ base: 4, md: 6 }} borderRadius="lg" boxShadow="md" w="full" maxW="100%">
          <Stat w="full">
            <StatLabel color="gray.300">اسم المستخدم</StatLabel>
            <StatNumber color="white" fontSize={{ base: 'md', md: 'xl' }} overflowWrap="anywhere">{user.username}</StatNumber>
          </Stat>
          <Stat w="full">
            <StatLabel color="gray.300">البريد الإلكتروني</StatLabel>
            <StatNumber color="white" fontSize={{ base: 'sm', md: 'lg' }} overflowWrap="anywhere">{user.email}</StatNumber>
          </Stat>
          <Stat w="full">
            <StatLabel color="gray.300">رقم الجوال</StatLabel>
            <StatNumber color="white" fontSize={{ base: 'sm', md: 'lg' }} overflowWrap="anywhere">{user.phone}</StatNumber>
          </Stat>
          <Stat w="full">
            <StatLabel color="gray.300">العنوان</StatLabel>
            <StatNumber color="white" fontSize={{ base: 'xs', md: 'md' }} overflowWrap="anywhere" wordBreak="break-all" isTruncated>
              <Box as="span" w="full" maxW="100%" overflow="hidden" textOverflow="ellipsis">
                <Box as="span" display="inline-block" maxW="100%" overflow="hidden" textOverflow="ellipsis">
                  <span title={user.walletAddress}>{user.walletAddress}</span>
                </Box>
              </Box>
            </StatNumber>
          </Stat>
          <Stat w="full">
            <StatLabel color="gray.300">الرصيد</StatLabel>
            <StatNumber color="white" fontSize={{ base: 'sm', md: 'lg' }}>{user.balance}</StatNumber>
          </Stat>
          <Stat w="full">
            <StatLabel color="gray.300">رمز الإحالة</StatLabel>
            <StatNumber color="white" fontSize={{ base: 'sm', md: 'lg' }} overflowWrap="anywhere">{user.referralCode}</StatNumber>
          </Stat>
          {/* Add more user fields as needed */}
        </VStack>
        {/* You can add more related data here, e.g., team members, stats, etc. */}
      </SimpleGrid>
      <Divider my={8} />
      <Heading size="md" mb={4} color="white">
        معاملات المستخدم
      </Heading>
      <Box bg="gray.800" p={4} borderRadius="lg" boxShadow="md" w="full" maxW="100%">
        <TransactionTable transactions={transactions} />
      </Box>
    </Box>
  );
} 