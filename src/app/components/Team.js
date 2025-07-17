"use client";
import React, { useEffect, useState } from "react";
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Spinner, 
  Alert, 
  AlertIcon, 
  Button, 
  Center, 
  Badge,
  Card,
  CardBody,
  Flex,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { getTeamMembers } from "../api";
import { useRouter } from "next/navigation";
import { FaUsers, FaUser, FaEnvelope, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";

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
    return new Date(dateString).toISOString().slice(0, 10);
  };

  const formatBalance = (balance) => {
    return `${balance || 0} USDT`;
  };

  return (
    <Box p={{ base: 4, md: 8 }} minH="100vh" maxW="1200px" mx="auto" mb={20}>
      <Heading 
        mb={8} 
        fontSize={{ base: "3xl", md: "4xl" }} 
        textAlign="center"
        className="gradient-text"
        fontWeight="extrabold"
        letterSpacing="wider"
      >
        فريق العمل الخاص بك
      </Heading>

      <Button 
        mb={8} 
        colorScheme="blue" 
        onClick={() => router.push("/settings")}
        leftIcon={<FaArrowLeft />}
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
        العودة إلى الإعدادات
      </Button>

      {loading ? (
        <Center my={12}>
          <Spinner size="xl" color="brand.neonBlue" thickness="4px" />
        </Center>
      ) : error ? (
        <Alert 
          status="error" 
          my={8} 
          bg="rgba(239, 68, 68, 0.1)"
          border="1px solid"
          borderColor="red.400"
          borderRadius="xl"
        >
          <AlertIcon color="red.400" />
          <Text color="red.400">{error}</Text>
        </Alert>
      ) : teamMembers && teamMembers.length === 0 ? (
        <Box
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(20px)"
          borderRadius="2xl"
          border="1px solid"
          borderColor="brand.glassBorder"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
          p={8}
          textAlign="center"
        >
          <VStack spacing={4}>
            <Icon as={FaUsers} boxSize={12} color="gray.400" />
            <Text color="gray.400" fontSize="lg">
              لا يوجد أعضاء في فريقك بعد.
            </Text>
          </VStack>
        </Box>
      ) : (
        <VStack align="stretch" spacing={6}>
          {teamMembers.map((tm, index) => (
            <Card
              key={tm._id}
              bg="rgba(0, 0, 0, 0.6)"
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.1)"
              borderRadius="xl"
              boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
              _hover={{ 
                transform: "translateY(-4px)",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 212, 255, 0.2)",
                borderColor: "brand.neonBlue",
              }}
              transition="all 0.3s ease"
              overflow="hidden"
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                bg: `hsl(${index * 60}, 70%, 60%)`,
                opacity: 0.8,
              }}
            >
              <CardBody p={6}>
                <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "start", md: "center" }}>
                  <VStack align="start" spacing={3} flex={1}>
                    <HStack spacing={3}>
                      <Icon as={FaUser} color="brand.neonBlue" boxSize={5} />
                      <Text fontWeight="bold" fontSize="xl" color="white">
                        {tm.username}
                      </Text>
                    </HStack>
                    
                    <HStack spacing={3}>
                      <Icon as={FaEnvelope} color="brand.neonGreen" boxSize={4} />
                      <Text color="gray.300" fontSize="md">
                        {tm.email}
                      </Text>
                    </HStack>
                    
                    <HStack spacing={3}>
                      <Icon as={FaCalendarAlt} color="brand.neonPurple" boxSize={4} />
                      <Text color="gray.300" fontSize="md">
                        تاريخ التسجيل: {formatDate(tm.registrationDate)}
                      </Text>
                    </HStack>
                  </VStack>
                  
                  <Badge
                    colorScheme="green"
                    variant="solid"
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontSize="lg"
                    fontWeight="bold"
                    bg="linear-gradient(135deg, brand.neonGreen, brand.neonCyan)"
                    color="black"
                    boxShadow="0 0 15px rgba(0, 255, 127, 0.3)"
                  >
                    {formatBalance(tm.balance)}
                  </Badge>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </Box>
  );
}
