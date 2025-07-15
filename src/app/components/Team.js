"use client";
import React, { useEffect, useState } from "react";
import { Box, Heading, Text, VStack, Spinner, Alert, AlertIcon, Button, Center, Badge } from "@chakra-ui/react";
import { getTeamMembers } from "../api";
import { useRouter } from "next/navigation";

export default function Team() {
  const [teamMembers, setTeamMembers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getTeamMembers()
      .then(data => {
        console.log('Team members API response:', data);
        setTeamMembers(data);
      })
      .catch(err => {
        console.error('Team members API error:', err);
        setError(err.message || "Failed to fetch team members");
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toISOString().slice(0, 10); // Always YYYY-MM-DD
  };

  const formatBalance = (balance) => {
    return `${balance || 0} USDT`;
  };

  return (
    <Box p={{ base: 4, md: 8 }} minH="100vh" maxW="800px" mx="auto">
      <Heading mb={6} fontSize={{ base: "2xl", md: "3xl" }} textAlign="center">
        فريق العمل الخاص بك
      </Heading>
      <Button mb={6} colorScheme="blue" onClick={() => router.push("/settings")}>العودة إلى الإعدادات</Button>
      {loading ? (
        <Center my={8}><Spinner /></Center>
      ) : error ? (
        <Alert status="error" my={8}><AlertIcon />{error}</Alert>
      ) : teamMembers && teamMembers.length === 0 ? (
        <Text color="gray.500" textAlign="center">لا يوجد أعضاء في فريقك بعد.</Text>
      ) : (
        <VStack align="stretch" spacing={4}>
          {teamMembers.map((tm) => (
            <Box key={tm._id} p={4} borderWidth={1} borderRadius="md" bg="white" boxShadow="sm">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Text fontWeight="bold" fontSize="lg">{tm.username}</Text>
                <Badge colorScheme="green" variant="subtle">
                  {formatBalance(tm.balance)}
                </Badge>
              </Box>
              <Text color="gray.600" mb={1}>
                <b>البريد الإلكتروني:</b> {tm.email}
              </Text>
              <Text color="gray.500" fontSize="sm">
                <b>تاريخ التسجيل:</b> {formatDate(tm.registrationDate)}
              </Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}
