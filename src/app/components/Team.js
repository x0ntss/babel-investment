"use client";
import React, { useEffect, useState } from "react";
import { 
  Box, 
  Text, 
  VStack, 
  Spinner, 
  Alert, 
  AlertIcon, 
  Center, 

  HStack
} from "@chakra-ui/react";
import { getTeamReport } from "../api";
import { FaUsers,  FaMoneyBillWave } from "react-icons/fa";
import { useTheme } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

export default function Team() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  // Glowing animation for Web3 effect
  const glow = keyframes`
    0% { box-shadow: 0 0 8px ${theme.colors.brand?.neonBlue || '#00eaff'}; }
    50% { box-shadow: 0 0 24px ${theme.colors.brand?.neonGreen || '#00ffb2'}; }
    100% { box-shadow: 0 0 8px ${theme.colors.brand?.neonBlue || '#00eaff'}; }
  `;

  useEffect(() => {
    setLoading(true);
    getTeamReport()
      .then(setReport)
      .catch((err) => setError(err.message || "حدث خطأ أثناء جلب البيانات"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box
      p={{ base: 2, md: 6 }}
      minH="100vh"
      maxW="480px"
      mx="auto"
      bg={{ base: theme.colors.brand?.glass || "#10131a", md: "transparent" }}
      pt={4}
    >
      <Box
        bgGradient="linear(90deg, brand.neonBlue, brand.neonGreen, brand.neonPurple)"
        borderRadius="2xl"
        px={4}
        py={3}
        mb={4}
        boxShadow="0 4px 32px rgba(0, 212, 255, 0.25)"
        textAlign="center"
        border="1.5px solid"
        borderColor="brand.glassBorder"
      >
        <Text color="white" fontWeight="extrabold" fontSize="2xl" letterSpacing="wide" textShadow="0 0 12px #00eaff">
          تقرير الفريق
        </Text>
      </Box>

      {loading ? (
        <Center my={12}>
          <Spinner size="xl" color="brand.neonBlue" thickness="4px" />
        </Center>
      ) : error ? (
        <Alert status="error" my={8} borderRadius="xl">
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      ) : report ? (
        <VStack spacing={6} align="stretch">
          {/* Total Team Balance */}
          <Box
            bg="brand.glass"
            borderRadius="2xl"
            boxShadow="0 8px 32px rgba(0, 212, 255, 0.18)"
            px={4}
            py={5}
            textAlign="center"
            mb={2}
            border="1.5px solid"
            borderColor="brand.glassBorder"
            style={{ animation: `${glow} 2.5s infinite alternate` }}
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
            <HStack justify="center" spacing={3} mb={2}>
              <FaMoneyBillWave color={theme.colors.brand?.neonBlue || "#00BFAE"} size={32} style={{ filter: 'drop-shadow(0 0 8px #00eaff)' }} />
              <Text fontWeight="extrabold" fontSize="3xl" color="brand.neonBlue" textShadow="0 0 16px #00eaff">
                {report.totalTeamBalance} USDT
              </Text>
            </HStack>
            <Text color="brand.neonGreen" fontSize="md" fontWeight="bold" letterSpacing="wide">
              إجمالي رصيد الفريق
            </Text>
          </Box>

          {/* Special Members with Deposits */}
          <Box
            bg="brand.glass"
            borderRadius="2xl"
            boxShadow="0 4px 20px rgba(0, 255, 127, 0.10)"
            px={4}
            py={4}
            mb={2}
            border="1.5px solid"
            borderColor="brand.glassBorder"
          >
            <Text fontWeight="extrabold" color="brand.neonBlue" mb={3} fontSize="xl" letterSpacing="wide" textShadow="0 0 8px #00eaff">
              الأعضاء المميزون (قاموا بالإيداع)
            </Text>
            {report.specialMembers.length === 0 ? (
              <Text color="gray.400" textAlign="center">لا يوجد أعضاء مميزون.</Text>
            ) : (
              <VStack spacing={2} align="stretch">
                {report.specialMembers.map((member) => (
                  <Box key={member._id} bg="rgba(0,212,255,0.08)" borderRadius="md" px={3} py={2} boxShadow="0 0 8px #00eaff">
                    <HStack justify="space-between" flexWrap="wrap">
                      <VStack align="start" spacing={0} minW={0} flex={1}>
                        <Text fontWeight="bold" color="brand.neonGreen" fontSize="md" noOfLines={1}>الاسم: {member.username}</Text>
                        <Text color="brand.neonBlue" fontSize="sm" noOfLines={1}>راس المال: {member.balance} $</Text>
                        <Text color="brand.neonPurple" fontSize="xs">تاريخ التسجيل: {member.registrationDate}</Text>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>

          {/* Total Members */}
          <Box
            bg="brand.glass"
            borderRadius="2xl"
            boxShadow="0 4px 20px rgba(59,130,246,0.10)"
            px={4}
            py={4}
            mb={2}
            textAlign="center"
            border="1.5px solid"
            borderColor="brand.glassBorder"
          >
            <HStack justify="center" spacing={2} mb={1}>
              <FaUsers color={theme.colors.brand?.neonPurple || "#8f5bff"} style={{ filter: 'drop-shadow(0 0 8px #8f5bff)' }} />
              <Text fontWeight="extrabold" fontSize="2xl" color="brand.neonPurple" textShadow="0 0 8px #8f5bff">
                {report.totalMembers}
              </Text>
            </HStack>
            <Text color="brand.neonBlue" fontSize="md" fontWeight="bold">إجمالي عدد الأعضاء</Text>
          </Box>

          {/* Regular Members (No Deposit) */}
          <Box
            bg="brand.glass"
            borderRadius="2xl"
            boxShadow="0 4px 20px rgba(160,174,192,0.10)"
            px={4}
            py={4}
            mb={2}
            border="1.5px solid"
            borderColor="brand.glassBorder"
          >
            <Text fontWeight="extrabold" color="brand.neonPurple" mb={3} fontSize="xl" letterSpacing="wide" textShadow="0 0 8px #8f5bff">
              الأعضاء العاديون (لم يودعوا)
            </Text>
            {report.regularMembers.length === 0 ? (
              <Text color="gray.400" textAlign="center">لا يوجد أعضاء عاديون.</Text>
            ) : (
              <VStack spacing={2} align="stretch">
                {report.regularMembers.map((member) => (
                  <Box key={member._id} bg="rgba(143,91,255,0.08)" borderRadius="md" px={3} py={2}
                    display="flex" flexDirection={{ base: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ base: 'flex-start', sm: 'center' }}>
                    <VStack align="start" spacing={0} minW={0} flex={1}>
                      <Text fontWeight="bold" color="brand.neonPurple" fontSize="md" noOfLines={1}>الاسم: {member.username}</Text>
                      <Text color="brand.neonBlue" fontSize="sm" noOfLines={1}>راس المال: {member.balance} $</Text>
                      <Text color="brand.neonPurple" fontSize="xs">تاريخ التسجيل: {member.registrationDate}</Text>
                    </VStack>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        </VStack>
      ) : null}
    </Box>
  );
}
