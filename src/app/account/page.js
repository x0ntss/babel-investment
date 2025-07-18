"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,

  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  Flex,

  Button,
  Skeleton,
  SkeletonText,

} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { 
  FaWallet, 
  FaChartLine, 
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaHistory,
  FaCog
} from "react-icons/fa";
import { formatUSDT } from "../utils/numberFormat";
import { VIP_LEVELS } from "../utils/vipLevels";
import VipCardsSection from "../components/VipCardsSection";

const AccountPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [accountData, setAccountData] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
      return;
    }

    // If user data is already available, use the pre-calculated totals
    if (user) {
      setAccountData({
        totalDeposits: user.totalDeposits || 0,
        totalWithdrawals: user.totalWithdrawals || 0,
      });
    }
  }, [user, loading, router]);

  const getCurrentVipLevel = () => {
    if (!user?.balance) return { level: 0, name: "VIP 0", nextLevel: null };
    
    const userBalance = user.balance;
    let currentLevel = 0;
    let nextLevel = null;
    
    for (let i = VIP_LEVELS.length - 1; i >= 0; i--) {
      if (userBalance >= VIP_LEVELS[i].min) {
        currentLevel = VIP_LEVELS[i].level;
        if (i > 0) {
          nextLevel = VIP_LEVELS[i - 1];
        }
        break;
      }
    }
    
    return {
      level: currentLevel,
      name: `VIP ${currentLevel}`,
      nextLevel,
      currentLevelData: VIP_LEVELS.find(lvl => lvl.level === currentLevel)
    };
  };

  const calculateDailyIncome = () => {
    const vipInfo = getCurrentVipLevel();
    if (!vipInfo.currentLevelData || !user?.balance) return { min: 0, max: 0 };
    
    const { percent } = vipInfo.currentLevelData;
    const min = user.balance * (percent[0] / 100);
    const max = user.balance * (percent[1] / 100);
    
    return { min, max };
  };

 



  if (loading) {
    return (
      <Container maxW="6xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Skeleton height="60px" />
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {[...Array(4)].map((_, i) => (
              <Card key={i} bg="brand.glass" border="1px solid" borderColor="brand.glassBorder">
                <CardBody>
                  <Skeleton height="20px" mb={2} />
                  <Skeleton height="30px" mb={2} />
                  <SkeletonText noOfLines={2} />
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  const dailyIncome = calculateDailyIncome();

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center" mb={8}>
          <Heading 
            size="2xl" 
            mb={4}
            className="gradient-text"
            fontWeight="800"
          >
            حسابي
          </Heading>
          <Text fontSize="lg" color="gray.300">
            مرحباً {user.username || user.email}، إليك نظرة عامة على حسابك
          </Text>
        </Box>

        

        {/* User Info Card (was VIP Status Card) */}
        <Card 
          bg="linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
          border="2px solid"
          borderColor="brand.primary"
          boxShadow="0 0 30px rgba(99, 102, 241, 0.2)"
          className="glow"
        >
          <CardBody p={8}>
            <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between">
              <VStack align="start" spacing={4}>
                {/* User First Name Avatar */}
                <Box
                  bg="brand.glass"
                  border="2px solid"
                  borderColor="brand.neonBlue"
                  color="white"
                  fontWeight="bold"
                  fontSize="2xl"
                  borderRadius="50%"
                  w="64px"
                  h="64px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 0 16px var(--chakra-colors-brand-neonBlue)"
                  mb={2}
                  className="glow"
                >
                  {(() => {
                    const name = user.username || user.email || "";
                    return name.split(/\s|@/)[0];
                  })()}
                </Box>
                {/* User Name */}
                <Text fontSize="lg" fontWeight="bold" color="white">
                  {user.username || user.email}
                </Text>
              </VStack>
              <VStack align="end" spacing={2}>
                <Text fontSize="sm" color="gray.400">الرصيد الحالي</Text>
                <Text fontSize="3xl" fontWeight="bold" className="gradient-text">
                  {formatUSDT(user.balance)}
                </Text>
              </VStack>
            </Flex>
          </CardBody>
        </Card>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 2, md: 2, lg: 4 }} spacing={6}>
          {/* Daily Income */}
          <Card bg="brand.glass" border="1px solid" borderColor="brand.glassBorder">
            <CardBody>
              <Stat>
                <StatLabel color="gray.400">
                  <Icon as={FaMoneyBillWave} mr={2} />
                  الدخل اليومي
                </StatLabel>
                <StatNumber fontSize="2xl" color="brand.neonGreen">
                  {formatUSDT(dailyIncome.min)} - {formatUSDT(dailyIncome.max)}
                </StatNumber>
                <StatHelpText color="gray.500">
                  حسب مستواك الحالي
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          {/* Total Deposits */}
          <Card bg="brand.glass" border="1px solid" borderColor="brand.glassBorder">
            <CardBody>
              <Stat>
                <StatLabel color="gray.400">
                  <Icon as={FaArrowDown} mr={2} />
                  إجمالي الإيداعات
                </StatLabel>
                <StatNumber fontSize="2xl" color="brand.primary">
                  {formatUSDT(accountData?.totalDeposits || 0)}
                </StatNumber>
                <StatHelpText color="gray.500">
                  <StatArrow type="increase" />
                  إجمالي ما تم إيداعه
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          {/* Total Withdrawals */}
          <Card bg="brand.glass" border="1px solid" borderColor="brand.glassBorder">
            <CardBody>
              <Stat>
                <StatLabel color="gray.400">
                  <Icon as={FaArrowUp} mr={2} />
                  إجمالي السحوبات
                </StatLabel>
                <StatNumber fontSize="2xl" color="brand.secondary">
                  {formatUSDT(accountData?.totalWithdrawals || 0)}
                </StatNumber>
                <StatHelpText color="gray.500">
                  <StatArrow type="decrease" />
                  إجمالي ما تم سحبه
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          {/* Total Earnings */}
          <Card bg="brand.glass" border="1px solid" borderColor="brand.glassBorder">
            <CardBody>
              <Stat>
                <StatLabel color="gray.400">
                  <Icon as={FaChartLine} mr={2} />
                  إجمالي الأرباح
                </StatLabel>
                <StatNumber fontSize="2xl" color="brand.success">
                  {formatUSDT((accountData?.totalWithdrawals || 0) + (user.balance || 0) - (accountData?.totalDeposits || 0))}
                </StatNumber>
                <StatHelpText color="gray.500">
                  الأرباح المحققة
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Quick Actions */}
        <Card bg="brand.glass" border="1px solid" borderColor="brand.glassBorder">
          <CardBody>
            <Heading size="md" mb={6} color="white">
              إجراءات سريعة
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Button
                leftIcon={<FaWallet />}
                variant="solid"
                size="lg"
                onClick={() => router.push("/wallet")}
                w="full"
              >
                المحفظة
              </Button>
              <Button
                leftIcon={<FaHistory />}
                variant="outline"
                size="lg"
                onClick={() => router.push("/team")}
                w="full"
              >
                الفريق
              </Button>
              <Button
                leftIcon={<FaCog />}
                variant="outline"
                size="lg"
                onClick={() => router.push("/settings")}
                w="full"
              >
                الإعدادات
              </Button>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* VIP Level Cards at the end of the page */}
        <VipCardsSection user={user} />
      </VStack>
    </Container>
  );
};

export default AccountPage; 