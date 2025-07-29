"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  useToast,
  Spinner,
  Flex,
  VStack,
  HStack,
  Icon,
  Card,
  CardBody,
  useTheme,
} from "@chakra-ui/react";
import {
  getDailyTaskStatus,
  completeDailyTask,
  claimDailyReward,
  getCurrentUser,
} from "../api";
import { formatUSDT } from "../utils/numberFormat";
import { FaTasks, FaCheckCircle, FaGift } from "react-icons/fa";
import { keyframes } from "@emotion/react";

export default function Tasks() {
  const [loading, setLoading] = useState(true);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [rewardLoading, setRewardLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [lastRewardAmount, setLastRewardAmount] = useState(0);
  const [lastTaskDate, setLastTaskDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const toast = useToast();
  const theme = useTheme();

  // Glowing animation
  const glow = keyframes`
    0% { box-shadow: 0 0 12px ${theme.colors.brand?.neonBlue || "#00eaff"}; }
    50% { box-shadow: 0 0 32px ${theme.colors.brand?.neonGreen || "#00ffb2"}; }
    100% { box-shadow: 0 0 12px ${theme.colors.brand?.neonBlue || "#00eaff"}; }
  `;

  // VIP Levels and reward ranges
  const vipLevels = [
    { level: 12, minBalance: 30000, rewardRange: [300, 600] },
    { level: 11, minBalance: 15000, rewardRange: [150, 300] },
    { level: 10, minBalance: 8000, rewardRange: [80, 160] },
    { level: 9, minBalance: 5000, rewardRange: [50, 100] },
    { level: 8, minBalance: 3000, rewardRange: [30, 60] },
    { level: 7, minBalance: 1500, rewardRange: [15, 30] },
    { level: 6, minBalance: 800, rewardRange: [8, 16] },
    { level: 5, minBalance: 500, rewardRange: [5, 10] },
    { level: 4, minBalance: 300, rewardRange: [3, 6] },
    { level: 3, minBalance: 150, rewardRange: [1.5, 3] },
    { level: 2, minBalance: 50, rewardRange: [0.5, 1] },
    { level: 1, minBalance: 25, rewardRange: [0.25, 0.5] },
  ];

  const getUserVipRewardRange = () => {
    const vip = vipLevels.find((v) => userBalance >= v.minBalance);
    if (vip) {
      return vip.rewardRange;
    }
    return null;
  };

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const [status, user] = await Promise.all([
        getDailyTaskStatus(),
        getCurrentUser(),
      ]);
      setTaskCompleted(status.taskCompleted);
      setRewardClaimed(status.rewardClaimed);
      setLastRewardAmount(status.lastRewardAmount || 0);
      setUserBalance(user.balance || 0);
      setLastTaskDate(user.lastTaskDate || null);
    } catch (err) {
      toast({
        title: "خطأ في تحميل حالة المهمة.",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line
  }, []);

  // Countdown logic
  useEffect(() => {
    let interval;
    if (lastTaskDate) {
      const updateCountdown = () => {
        const last = new Date(lastTaskDate);
        const now = new Date();
        const nextAvailable = new Date(last.getTime() + 24 * 60 * 60 * 1000);
        const diff = nextAvailable - now;
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft({
            hours,
            minutes,
            percent: 100 - (diff / (24 * 60 * 60 * 1000)) * 100,
          });
        } else {
          setTimeLeft(null);
        }
      };
      updateCountdown();
      interval = setInterval(updateCountdown, 1000 * 30); // update every 30s
    } else {
      setTimeLeft(null);
    }
    return () => clearInterval(interval);
  }, [lastTaskDate]);

  const handleCompleteTask = async () => {
    setTaskLoading(true);
    try {
      await completeDailyTask();
      toast({
        title: "تم إكمال المهمة!",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      fetchStatus();
    } catch (err) {
      toast({
        title: "خطأ",
        description: err.message || "فشل إكمال المهمة من الخادم.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setTaskLoading(false);
    }
  };

  const handleClaimReward = async () => {
    setRewardLoading(true);
    try {
      const res = await claimDailyReward();
      toast({
        title: "🎉 مبروك!",
        description:
          res.message + (res.bonusEarned ? ` (+${res.bonusEarned} USDT)` : ""),
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      fetchStatus();
    } catch (err) {
      toast({
        title: "خطأ",
        description: err.message || "فشل استلام المكافأة من الخادم.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setRewardLoading(false);
    }
  };

  const getTaskStatusText = () => {
    if (taskCompleted) {
      return "مكتمل";
    } else if (timeLeft) {
      return "في الانتظار";
    } else {
      return "متاح";
    }
  };

  const isTaskAvailable = !taskCompleted && !timeLeft;

  return (
    <Box p={{ base: 4, md: 8 }} mb={20} minH="100vh" maxW="600px" mx="auto">
      {loading ? (
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" color="brand.neonBlue" thickness="4px" />
        </Flex>
      ) : (
        <VStack spacing={8} align="stretch">
          <Box
            bgGradient="linear(90deg, brand.neonBlue, brand.neonGreen, brand.neonPurple)"
            borderRadius="2xl"
            px={4}
            py={3}
            mb={2}
            boxShadow="0 4px 32px rgba(0, 212, 255, 0.25)"
            textAlign="center"
            border="1.5px solid"
            borderColor="brand.glassBorder"
          >
            <Text
              color="white"
              fontWeight="extrabold"
              fontSize="2xl"
              letterSpacing="wide"
              textShadow="0 0 12px #00eaff"
            >
              المهمة اليومية
            </Text>
          </Box>

          {/* Main Task Card */}
          <Card
            bg="brand.glass"
            borderRadius="2xl"
            boxShadow="0 8px 32px rgba(0, 212, 255, 0.18)"
            border="1.5px solid"
            borderColor="brand.glassBorder"
            overflow="hidden"
            position="relative"
            style={{ animation: `${glow} 2.5s infinite alternate` }}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              bgGradient:
                "linear(90deg, brand.neonBlue, brand.neonGreen, brand.neonPurple)",
              opacity: 0.8,
            }}
          >
            <CardBody p={{ base: 6, md: 10 }}>
              <VStack spacing={8}>
                {/* Task Status & Reward */}
                <VStack spacing={2} align="center">
                  <Icon
                    as={FaTasks}
                    boxSize={12}
                    color="brand.neonBlue"
                    filter="drop-shadow(0 0 8px #00eaff)"
                  />
                  <Text
                    fontSize="2xl"
                    fontWeight="extrabold"
                    color="brand.neonBlue"
                    textShadow="0 0 8px #00eaff"
                  >
                    {getTaskStatusText()}
                  </Text>{" "}
                  {getUserVipRewardRange() ? (
                    <Text
                      color="brand.neonGreen"
                      fontWeight="bold"
                      fontSize="lg"
                    >
                      مكافأة اليوم: {formatUSDT(getUserVipRewardRange()[0])} -{" "}
                      {formatUSDT(getUserVipRewardRange()[1])}
                    </Text>
                  ) : (
                    <Text color="red.400" fontWeight="bold" fontSize="md">
                      الرصيد لا يكفي للحصول على مكافأة (الحد الأدنى 25 USDT)
                    </Text>
                  )}
                  {rewardClaimed && (
                    <Text
                      color="brand.neonPurple"
                      fontWeight="bold"
                      fontSize="md"
                    >
                      تم استلام مكافأة اليوم: +{formatUSDT(lastRewardAmount)}
                    </Text>
                  )}
                </VStack>

                {/* Action Buttons */}
                <HStack spacing={4} justify="center" flexWrap="wrap">
                  <Button
                    colorScheme="blue"
                    variant="solid"
                    size="lg"
                    isLoading={taskLoading}
                    isDisabled={!isTaskAvailable || taskCompleted}
                    onClick={handleCompleteTask}
                    bgGradient="linear(90deg, brand.neonBlue, brand.neonGreen)"
                    color="white"
                    fontWeight="extrabold"
                    boxShadow="0 0 16px #00eaff"
                    _hover={{
                      bg: "brand.neonBlue",
                      boxShadow: "0 0 24px #00eaff",
                    }}
                  >
                    <Icon as={FaCheckCircle} mr={2} /> إكمال المهمة
                  </Button>
                  <Button
                    colorScheme="purple"
                    variant="solid"
                    size="lg"
                    isLoading={rewardLoading}
                    isDisabled={!taskCompleted || rewardClaimed}
                    onClick={handleClaimReward}
                    bgGradient="linear(90deg, brand.neonPurple, brand.neonBlue)"
                    color="white"
                    fontWeight="extrabold"
                    boxShadow="0 0 16px #8f5bff"
                    _hover={{
                      bg: "brand.neonPurple",
                      boxShadow: "0 0 24px #8f5bff",
                    }}
                  >
                    <Icon as={FaGift} mr={2} /> استلام المكافأة
                  </Button>
                </HStack>

                {/* Countdown or Info */}
                {timeLeft && (
                  <Box mt={4} textAlign="center">
                    <Text
                      color="brand.neonBlue"
                      fontWeight="bold"
                      fontSize="md"
                    >
                      متبقي حتى المهمة القادمة:
                    </Text>
                    <Text
                      color="brand.neonGreen"
                      fontWeight="extrabold"
                      fontSize="2xl"
                    >
                      {timeLeft.hours} ساعة {timeLeft.minutes} دقيقة
                    </Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      )}
    </Box>
  );
}
