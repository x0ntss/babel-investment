"use client";
import React, { useEffect, useState } from "react";
import { Box, Heading, Text, VStack, Spinner, Alert, AlertIcon, Button, Center } from "@chakra-ui/react";
import { getTeamMembers } from "../api";
import { useRouter } from "next/navigation";

export default function Team() {
  const [teamMembers, setTeamMembers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getTeamMembers()
      .then(setTeamMembers)
      .catch(err => setError(err.message || "Failed to fetch team members"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box p={{ base: 4, md: 8 }} minH="100vh" maxW="600px" mx="auto">
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
            <Box key={tm._id} p={4} borderWidth={1} borderRadius="md" bg="white">
              <Text><b>اسم المستخدم:</b> {tm.username}</Text>
              <Text><b>البريد الإلكتروني:</b> {tm.email}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}
