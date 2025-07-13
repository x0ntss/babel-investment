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
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
  AiOutlineLock,
  AiOutlineQuestionCircle,
  AiOutlineLogout,
  AiOutlineTeam,
} from "react-icons/ai";
import { FaTicketAlt, FaUserCircle, FaEnvelope, FaPhone, FaMoneyBillWave, FaTasks, FaKey, FaEthereum } from "react-icons/fa";
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

  const settingsItems = [
    {
      icon: AiOutlineLock,
      label: "الأمان",
      color: "blue.500",
      onClick: () => router.push("/security"),
    },
    {
      icon: AiOutlineQuestionCircle,
      label: "الدعم",
      color: "purple.500",
      onClick: () => window.open("https://t.me/babel_support", "_blank"),
    },
    {
      icon: AiOutlineTeam,
      label: "فريق العمل",
      color: "teal.500",
      onClick: () => router.push("/team-members"),
    },
    {
      icon: FaTicketAlt,
      label: "رمز الاحالة (Raffles)",
      color: "orange.500",
      onClick: () => router.push("/raffles"),
    },
    {
      icon: AiOutlineLogout,
      label: "تسجيل الخروج",
      color: "red.500",
      onClick: handleLogout,
    },
  ];

  return (
    <Box mb={20} p={{ base: 4, md: 8 }} minH="100vh" maxW="900px" mx="auto">
      <Heading mb={6} fontSize={{ base: "2xl", md: "3xl" }} textAlign="center">
        إعدادات الحساب
      </Heading>

      {loading ? (
        <Center my={8}><Spinner /></Center>
      ) : error ? (
        <Alert status="error" my={8}><AlertIcon />{error}</Alert>
      ) : user ? (
        <Box
          bgGradient="linear(135deg, brand.darkGreen 0%, #0f2027 100%)"
          borderRadius="2xl"
          boxShadow="0 0 24px 4px #d4af37, 0 2px 16px 0 #d4af37, 0 0 0 4px brand.darkGreen"
          border="2px solid #d4af37"
          p={{ base: 4, md: 8 }}
          mb={8}
          maxW={{ base: '100%', sm: '400px' }}
          mx="auto"
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            bgGradient: 'conic-gradient(from 90deg at 50% 50%, #d4af37, #fffbe6, brand.darkGreen, #d4af37)',
            filter: 'blur(40px)',
            opacity: 0.18,
            zIndex: 0,
            animation: 'spin 8s linear infinite',
          }}
          style={{ fontFamily: 'Orbitron, monospace' }}
          dir="rtl"
        >
          <Flex direction="column" align="center" zIndex={1} position="relative">
            <Avatar
              size="xl"
              name={user.username}
              icon={<FaUserCircle fontSize="2.5rem" />}
              bg="whiteAlpha.800"
              color="#d4af37"
              border="3px solid #d4af37"
              boxShadow="0 0 16px 2px #d4af37"
              mb={2}
            />
            <Text fontSize="2xl" fontWeight="extrabold" mb={1} letterSpacing="wider" color="#d4af37" style={{ fontFamily: 'Orbitron, monospace', textShadow: '0 0 8px #d4af37' }}>
              {user.username}
            </Text>
            <Flex align="center" mb={1} color="#fff" fontSize="md">
              <FaEnvelope style={{ marginLeft: 6, color: '#d4af37' }} />
              <Text><b>البريد الإلكتروني:</b> {user.email}</Text>
            </Flex>
            <Flex align="center" mb={1} color="#fff" fontSize="md">
              <FaPhone style={{ marginLeft: 6, color: '#d4af37' }} />
              <Text><b>رقم الهاتف:</b> {user.phone || <span style={{color:'#eee'}}>-</span>}</Text>
            </Flex>
            <Flex align="center" mb={1} color="#fff" fontSize="md">
              <FaMoneyBillWave style={{ marginLeft: 6, color: '#d4af37' }} />
              <Text><b>الرصيد:</b> {formatUSDT(user.balance)}</Text>
            </Flex>
            <Flex align="center" mb={1} color="#fff" fontSize="md">
              <FaKey style={{ marginLeft: 6, color: '#d4af37' }} />
              <Text><b>رمز الإحالة:</b> {user.referralCode || <span style={{color:'#eee'}}>-</span>}</Text>
            </Flex>
            <Flex align="center" mb={1} color="#fff" fontSize="md">
              <FaTasks style={{ marginLeft: 6, color: '#d4af37' }} />
              <Text><b>المهام المكتملة:</b> {user.completedTasks ?? <span style={{color:'#eee'}}>-</span>}</Text>
            </Flex>
            <Flex align="center" mb={1} color="#fff" fontSize="md">
              <FaEthereum style={{ marginLeft: 6, color: '#d4af37' }} />
              <Text fontWeight="medium" ml={2}><b>تاريخ آخر مهمة:</b></Text>
              <Text>{user.lastTaskDate ? new Date(user.lastTaskDate).toLocaleString() : <span style={{color:'#eee'}}>-</span>}</Text>
            </Flex>
          </Flex>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </Box>
      ) : null}

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
        {settingsItems.map((item, idx) => (
          <Card
            as="button"
            key={idx}
            onClick={item.onClick}
            _hover={{ boxShadow: "xl" }}
            transition="0.2s"
            py={6}
          >
            <CardBody as={Center} flexDirection="column">
              <Icon as={item.icon} boxSize={10} color={item.color} mb={2} />
              <Text fontSize="md" fontWeight="medium" textAlign="center">
                {item.label}
              </Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
