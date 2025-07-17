"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Icon,
  Text,
  useToast,
  SimpleGrid,
  Card,
  CardBody,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  Avatar,
  Flex,
  Badge,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
  AiOutlineLock,
  AiOutlineQuestionCircle,
  AiOutlineLogout,
  AiOutlineTeam,
} from "react-icons/ai";
import { FaTicketAlt, FaUserCircle, FaEnvelope, FaPhone, FaMoneyBillWave, FaTasks, FaKey, FaEthereum, FaCalendarAlt, FaShieldAlt, FaFileContract, FaCrown } from "react-icons/fa";
import { getCurrentUser, getTeamMembers } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { formatUSDT } from "../utils/numberFormat";

export default function Settings() {
  const toast = useToast();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamMembers, setTeamMembers] = useState(null);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(err => setError(err.message || "Failed to fetch user info"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    router.push("/signin");
  };

  const handleShowTeam = async () => {
    setTeamLoading(true);
    setTeamError(null);
    try {
      const members = await getTeamMembers();
      setTeamMembers(members);
    } catch (err) {
      setTeamError(err.message || "Failed to fetch team members");
    } finally {
      setTeamLoading(false);
    }
  };

  const getCurrentVipLevel = () => {
    if (!user?.balance) return 0;
    if (user.balance >= 10000) return 8;
    if (user.balance >= 5000) return 4;
    if (user.balance >= 1000) return 1;
    return 0;
  };

  const vipLevel = getCurrentVipLevel();

  const settingsItems = [
    {
      icon: AiOutlineLock,
      label: "إعدادات الأمان",
      color: "brand.neonBlue",
      onClick: () => router.push("/security"),
    },
    {
      icon: FaShieldAlt,
      label: "الأمان والشفافية",
      color: "brand.neonGreen",
      onClick: () => router.push("/security-info"),
    },
    {
      icon: AiOutlineQuestionCircle,
      label: "الدعم",
      color: "brand.neonPurple",
      onClick: () => window.open("https://t.me/babel_support", "_blank"),
    },
    {
      icon: AiOutlineTeam,
      label: "فريق العمل",
      color: "brand.neonCyan",
      onClick: () => router.push("/team-members"),
    },
    {
      icon: FaTicketAlt,
      label: "رمز الاحالة (Raffles)",
      color: "brand.neonOrange",
      onClick: () => router.push("/raffles"),
    },
    {
      icon: FaFileContract,
      label: "سياسة الاستخدام",
      color: "brand.neonPink",
      onClick: () => router.push("/terms"),
    },
    {
      icon: AiOutlineLogout,
      label: "تسجيل الخروج",
      color: "red.400",
      onClick: handleLogout,
    },
  ];

  return (
    <Box mb={20} p={{ base: 4, md: 8 }} minH="100vh" maxW="1200px" mx="auto">
      <Heading 
        mb={8} 
        fontSize={{ base: "3xl", md: "4xl" }} 
        textAlign="center"
        className="gradient-text"
        fontWeight="extrabold"
        letterSpacing="wider"
      >
        إعدادات الحساب
      </Heading>

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
      ) : user ? (
        <Box
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(20px)"
          borderRadius="2xl"
          border="1px solid"
          borderColor="brand.glassBorder"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
          p={{ base: 6, md: 8 }}
          mb={8}
          maxW={{ base: '100%', lg: '800px' }}
          mx="auto"
          position="relative"
          overflow="hidden"
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
          <VStack spacing={6} align="stretch">
            {/* User Header */}
            <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between">
              <HStack spacing={4}>
                <Avatar
                  size="xl"
                  name={user.username}
                  icon={<FaUserCircle fontSize="2.5rem" />}
                  bg="linear-gradient(135deg, brand.neonBlue, brand.neonPurple)"
                  color="white"
                  border="3px solid"
                  borderColor="brand.neonBlue"
                  boxShadow="0 0 20px rgba(0, 212, 255, 0.4)"
                />
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="white">
                    {user.username}
                  </Text>
                  <Badge
                    colorScheme={vipLevel >= 8 ? "purple" : vipLevel >= 4 ? "orange" : "blue"}
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                  >
            
                  </Badge>
                </VStack>
              </HStack>
              <Text fontSize="xl" fontWeight="bold" color="brand.neonGreen">
                {formatUSDT(user.balance)}
              </Text>
            </Flex>

            {/* User Details Grid */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Flex align="center" p={3} bg="rgba(255, 255, 255, 0.05)" borderRadius="lg">
                <FaEnvelope style={{ marginLeft: 8, color: 'brand.neonBlue' }} />
                <Text color="white" fontSize="sm">
                  <b>البريد الإلكتروني:</b> {user.email}
                </Text>
              </Flex>
              <Flex align="center" p={3} bg="rgba(255, 255, 255, 0.05)" borderRadius="lg">
                <FaPhone style={{ marginLeft: 8, color: 'brand.neonGreen' }} />
                <Text color="white" fontSize="sm">
                  <b>رقم الهاتف:</b> {user.phone || <span style={{color:'#888'}}>-</span>}
                </Text>
              </Flex>
              <Flex align="center" p={3} bg="rgba(255, 255, 255, 0.05)" borderRadius="lg">
                <FaKey style={{ marginLeft: 8, color: 'brand.neonPurple' }} />
                <Text color="white" fontSize="sm">
                  <b>رمز الإحالة:</b> {user.referralCode || <span style={{color:'#888'}}>-</span>}
                </Text>
              </Flex>
              <Flex align="center" p={3} bg="rgba(255, 255, 255, 0.05)" borderRadius="lg">
                <FaTasks style={{ marginLeft: 8, color: 'brand.neonOrange' }} />
                <Text color="white" fontSize="sm">
                  <b>المهام المكتملة:</b> {user.completedTasks ?? <span style={{color:'#888'}}>-</span>}
                </Text>
              </Flex>
              <Flex align="center" p={3} bg="rgba(255, 255, 255, 0.05)" borderRadius="lg">
                <FaEthereum style={{ marginLeft: 8, color: 'brand.neonCyan' }} />
                <Text color="white" fontSize="sm">
                  <b>تاريخ آخر مهمة:</b> {user.lastTaskDate ? new Date(user.lastTaskDate).toLocaleString() : <span style={{color:'#888'}}>-</span>}
                </Text>
              </Flex>
              <Flex align="center" p={3} bg="rgba(255, 255, 255, 0.05)" borderRadius="lg">
                <FaCalendarAlt style={{ marginLeft: 8, color: 'brand.neonPink' }} />
                <Text color="white" fontSize="sm">
                  <b>تاريخ التسجيل:</b> {user.registrationDate ? new Date(user.registrationDate).toISOString().slice(0, 10) : <span style={{color:'#888'}}>-</span>}
                </Text>
              </Flex>
            </SimpleGrid>
          </VStack>
        </Box>
      ) : null}

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {settingsItems.map((item, idx) => (
          <Card
            as="button"
            key={idx}
            onClick={item.onClick}
            bg="rgba(0, 0, 0, 0.6)"
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.1)"
            borderRadius="xl"
            boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
        
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
              bg: item.color,
              opacity: 0,
              transition: 'opacity 0.3s ease',
            }}
            _hover={{
              _before: {
                opacity: 1,
              }
            }}
          >
            <CardBody as={Center} flexDirection="column" p={6}>
              <Icon 
                as={item.icon} 
                boxSize={12} 
                color={item.color} 
                mb={4}
                filter="drop-shadow(0 0 8px currentColor)"
              />
              <Text 
                fontSize="lg" 
                fontWeight="600" 
                textAlign="center"
                color="white"
                textShadow="0 0 8px rgba(255, 255, 255, 0.3)"
              >
                {item.label}
              </Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
