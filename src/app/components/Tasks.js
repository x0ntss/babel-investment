"use client";
import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Button, useToast, Spinner, Flex, Circle } from "@chakra-ui/react";
import { getDailyTaskStatus, completeDailyTask, claimDailyReward, getCurrentUser } from "../api";
import { formatUSDT, formatRange } from "../utils/numberFormat";

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
    <Box p={{ base: 4, md: 8 }} mb={10} minH="100vh" display="flex" alignItems="center" justifyContent="center">
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Box textAlign="center" maxW="500px" w="100%">
          <Heading mb={6} fontSize={{ base: "2xl", md: "3xl" }}>
            المهمة اليومية
          </Heading>
          
          {/* Circular Progress Container */}
          <Box position="relative" mx="auto" mb={8}>
            {/* Outer Circle with Progress */}
            <Box
              position="relative"
              width="300px"
              height="300px"
              mx="auto"
            >
              {/* Background Circle */}
              <Circle
                size="300px"
                bg="gray.100"
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
                  ${timeLeft ? 'teal' : 'transparent'} 0deg ${timeLeft ? (timeLeft.percent * 3.6) : 0}deg,
                  transparent ${timeLeft ? (timeLeft.percent * 3.6) : 0}deg 360deg
                )`}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {/* Inner Circle */}
                <Circle
                  size="280px"
                  bg="white"
                  boxShadow="lg"
                  position="relative"
                >
                  <Flex direction="column" align="center" justify="center" height="100%">
                    <Text fontSize="2xl" fontWeight="bold" mb={2}>
                      المكافأة اليومية
                    </Text>
                    <Text fontSize="lg" color="gray.600" mb={1}>
                      {getTaskStatusText()}
                    </Text>

                    {/* Show time left only if task is completed and waiting period active */}
                    {timeLeft && !isTaskAvailable && (
                      <Text fontSize="md" color="gray.500" mb={4}>
                        الوقت المتبقي لإكمال المهمة التالية: {`${timeLeft.hours.toString().padStart(2, '0')}:${timeLeft.minutes.toString().padStart(2, '0')}`}
                      </Text>
                    )}

                    {/* Task Button - Only show when available */}
                    {isTaskAvailable && (
                      <Button
                        colorScheme="blue"
                        size="md"
                        isLoading={taskLoading}
                        onClick={handleCompleteTask}
                        mt={4}
                      >
                        إكمال المهمة
                      </Button>
                    )}
                  </Flex>
                </Circle>
              </Box>
            </Box>
          </Box>

          {/* Reward Information */}
          <Box mt={6}>
            <Text fontSize="md" color="gray.600" mb={4}>
              قيمة المكافأة المتوقعة: {formatRange(minReward, maxReward)}
            </Text>
            
            {rewardClaimed && (
              <Text color="green.600" fontWeight="bold" mb={4}>
                تم استلام مكافأة اليوم: {formatUSDT(lastRewardAmount)}
              </Text>
            )}
            
            {/* Claim Reward Button */}
            <Button
              colorScheme="teal"
              size="lg"
              isDisabled={!taskCompleted || rewardClaimed || rewardLoading}
              isLoading={rewardLoading}
              onClick={handleClaimReward}
              w="100%"
              maxW="300px"
            >
              استلام المكافأة اليومية
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
