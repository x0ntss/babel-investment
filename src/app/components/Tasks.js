"use client";
import React, { useEffect, useState } from "react";
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  useToast, 
  Spinner, 
  Flex, 
  Circle,
  VStack,
  HStack,
  Icon,
  Badge,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { getDailyTaskStatus, completeDailyTask, claimDailyReward, getCurrentUser } from "../api";
import { formatUSDT, formatRange } from "../utils/numberFormat";
import { FaTasks, FaClock, FaCheckCircle, FaGift, FaPlay } from "react-icons/fa";

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
          setTimeLeft({ hours, minutes, percent: 100 - (diff / (24 * 60 * 60 * 1000)) * 100 });
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
        description: res.message + (res.bonusEarned ? ` (+${res.bonusEarned} USDT)` : ""),
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

  // Calculate dynamic reward (1–2% of balance)
  const minReward = userBalance * 0.01;
  const maxReward = userBalance * 0.02;

  // Determine task status text
  const getTaskStatusText = () => {
    if (taskCompleted) {
      return "مكتمل";
    } else if (timeLeft) {
      return "في الانتظار";
    } else {
      return "متاح";
    }
  };

  // Determine if task is available
  const isTaskAvailable = !taskCompleted && !timeLeft;

  return (
    <Box p={{ base: 4, md: 8 }} mb={20} minH="100vh" maxW="1200px" mx="auto">
      {loading ? (
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" color="brand.neonBlue" thickness="4px" />
        </Flex>
      ) : (
        <VStack spacing={8} align="stretch">
          <Heading 
            fontSize={{ base: "3xl", md: "4xl" }} 
            textAlign="center"
            className="gradient-text"
            fontWeight="extrabold"
            letterSpacing="wider"
          >
            المهمة اليومية
          </Heading>
          
          {/* Main Task Card */}
          <Card
            bg="rgba(0, 0, 0, 0.6)"
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor="brand.glassBorder"
            borderRadius="2xl"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
            overflow="hidden"
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
            <CardBody p={8}>
              <VStack spacing={8}>
                {/* Circular Progress Container */}
                <Box position="relative" mx="auto">
                  <Box
                    position="relative"
                    width="300px"
                    height="300px"
                    mx="auto"
                  >
                    {/* Background Circle */}
                    <Circle
                      size="300px"
                      bg="rgba(255, 255, 255, 0.05)"
                      border="1px solid"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      position="absolute"
                      top="0"
                      left="0"
                    />
                    
                    {/* Progress Circle */}
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      width="300px"
                      height="300px"
                      borderRadius="50%"
                      background={`conic-gradient(
                        ${timeLeft ? 'brand.neonGreen' : 'transparent'} 0deg ${timeLeft ? (timeLeft.percent * 3.6) : 0}deg,
                        transparent ${timeLeft ? (timeLeft.percent * 3.6) : 0}deg 360deg
                      )`}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {/* Inner Circle */}
                      <Circle
                        size="280px"
                        bg="rgba(0, 0, 0, 0.8)"
                        backdropFilter="blur(20px)"
                        border="1px solid"
                        borderColor="brand.glassBorder"
                        position="relative"
                        boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
                      >
                        <VStack spacing={4} align="center" justify="center" height="100%">
                          <Icon as={FaTasks} boxSize={8} color="brand.neonBlue" />
                          <Text fontSize="xl" fontWeight="bold" color="white">
                            المكافأة اليومية
                          </Text>
                          
                          <Badge
                            colorScheme={taskCompleted ? "green" : timeLeft ? "orange" : "blue"}
                            variant="solid"
                            px={4}
                            py={2}
                            borderRadius="full"
                            fontSize="md"
                            fontWeight="bold"
                          >
                            <HStack spacing={2}>
                              <Icon as={taskCompleted ? FaCheckCircle : timeLeft ? FaClock : FaPlay} />
                              <Text>{getTaskStatusText()}</Text>
                            </HStack>
                          </Badge>

                          {/* Show time left only if task is completed and waiting period active */}
                          {timeLeft && !isTaskAvailable && (
                            <Text fontSize="md" color="gray.300" textAlign="center">
                              الوقت المتبقي لإكمال المهمة التالية: {`${timeLeft.hours.toString().padStart(2, '0')}:${timeLeft.minutes.toString().padStart(2, '0')}`}
                            </Text>
                          )}

                          {/* Task Button - Only show when available */}
                          {isTaskAvailable && (
                            <Button
                              variant="solid"
                              size="lg"
                              isLoading={taskLoading}
                              onClick={handleCompleteTask}
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
                              إكمال المهمة
                            </Button>
                          )}
                        </VStack>
                      </Circle>
                    </Box>
                  </Box>
                </Box>

                {/* Reward Information */}
                <VStack spacing={4} align="stretch">
                  <Text fontSize="lg" color="gray.300" textAlign="center">
                    قيمة المكافأة المتوقعة: {formatRange(minReward, maxReward)}
                  </Text>
                  
                  {rewardClaimed && (
                    <Text color="brand.neonGreen" fontWeight="bold" textAlign="center">
                      تم استلام مكافأة اليوم: {formatUSDT(lastRewardAmount)}
                    </Text>
                  )}
                  
                  {/* Claim Reward Button */}
                  <Button
                    variant="solid"
                    size="lg"
                    isDisabled={!taskCompleted || rewardClaimed || rewardLoading}
                    isLoading={rewardLoading}
                    onClick={handleClaimReward}
                    bg="brand.neonGreen"
                    color="black"
                    leftIcon={<FaGift />}
                    _hover={{
                      bg: "brand.neonGreen",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(0, 255, 127, 0.4)",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    _disabled={{
                      bg: "gray.600",
                      color: "gray.400",
                      cursor: "not-allowed",
                      transform: "none",
                      boxShadow: "none",
                    }}
                    transition="all 0.3s ease"
                  >
                    استلام المكافأة
                  </Button>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      )}
    </Box>
  );
}
