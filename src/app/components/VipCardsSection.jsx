"use client";
import React from "react";
import { Box, Badge, Text, Icon, SimpleGrid, Flex } from "@chakra-ui/react";
import { FaLock, FaCrown, FaStar, FaCheckCircle } from "react-icons/fa";
import { formatUSDT, formatRange } from "../utils/numberFormat";
import { VIP_LEVELS } from "../utils/vipLevels";

export default function VipCardsSection({ user }) {
  // Transform VIP_LEVELS for display
  const DISPLAY_LEVELS = VIP_LEVELS.map(lvl => ({
    vip: `VIP ${lvl.level}`,
    invest: lvl.min,
    percent: `${lvl.percent[0]}% - ${lvl.percent[1]}%`
  }));

  const getVipCardStyle = (idx, isUnlocked, isCurrentLevel) => {
    if (isCurrentLevel) {
      return {
        bg: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(0, 255, 136, 0.1) 100%)",
        border: "2px solid",
        borderColor: "brand.neonGreen",
        boxShadow: "0 0 30px rgba(0, 255, 136, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3)",
        transform: "scale(1.02)",
        backdropFilter: "blur(20px)",
        _hover: {
          transform: "scale(1.05)",
          boxShadow: "0 0 40px rgba(0, 255, 136, 0.6), 0 12px 40px rgba(0, 0, 0, 0.4)",
        }
      };
    }
    if (isUnlocked) {
      if (idx < 4) {
        return {
          bg: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%)",
          border: "2px solid",
          borderColor: "brand.neonBlue",
          boxShadow: "0 8px 32px rgba(0, 212, 255, 0.2), 0 4px 16px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(20px)",
          _hover: {
            transform: "translateY(-4px) scale(1.02)",
            boxShadow: "0 12px 40px rgba(0, 212, 255, 0.3), 0 8px 24px rgba(0, 0, 0, 0.4)",
          }
        };
      } else if (idx < 8) {
        return {
          bg: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
          border: "2px solid",
          borderColor: "brand.neonPurple",
          boxShadow: "0 8px 32px rgba(168, 85, 247, 0.2), 0 4px 16px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(20px)",
          _hover: {
            transform: "translateY(-4px) scale(1.02)",
            boxShadow: "0 12px 40px rgba(168, 85, 247, 0.3), 0 8px 24px rgba(0, 0, 0, 0.4)",
          }
        };
      } else {
        return {
          bg: "linear-gradient(135deg, rgba(255, 0, 128, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
          border: "2px solid",
          borderColor: "brand.neonPink",
          boxShadow: "0 8px 32px rgba(255, 0, 128, 0.2), 0 4px 16px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(20px)",
          _hover: {
            transform: "translateY(-4px) scale(1.02)",
            boxShadow: "0 12px 40px rgba(255, 0, 128, 0.3), 0 8px 24px rgba(0, 0, 0, 0.4)",
          }
        };
      }
    } else {
      return {
        bg: "rgba(255, 255, 255, 0.02)",
        border: "1px solid",
        borderColor: "brand.darkBorder",
        opacity: 0.4,
        filter: "grayscale(0.5)",
        backdropFilter: "blur(10px)",
        _hover: {
          transform: "none",
          boxShadow: "sm",
        }
      };
    }
  };

  const getVipBadgeStyle = (idx, isUnlocked, isCurrentLevel) => {
    if (isCurrentLevel) {
      return {
        bg: "brand.neonGreen",
        color: "black",
        boxShadow: "0 0 20px rgba(0, 255, 136, 0.5)",
        fontWeight: "bold",
      };
    }
    if (isUnlocked) {
      if (idx < 4) return { 
        bg: "brand.neonBlue", 
        color: "black",
        boxShadow: "0 0 15px rgba(0, 212, 255, 0.4)",
      };
      if (idx < 8) return { 
        bg: "brand.neonPurple", 
        color: "white",
        boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)",
      };
      return { 
        bg: "brand.neonPink", 
        color: "white",
        boxShadow: "0 0 15px rgba(255, 0, 128, 0.4)",
      };
    }
    return { 
      bg: "brand.darkBorder", 
      color: "gray.400",
      opacity: 0.6,
    };
  };

  function calcDailyIncome(invest) {
    const min = invest * 0.01;
    const max = invest * 0.02;
    return formatRange(min, max);
  }

  const userBalance = user?.balance ?? 0;
  let currentLevel = 0;
  for (const lvl of VIP_LEVELS) {
    if (userBalance >= lvl.min) {
      currentLevel = lvl.level;
      break;
    }
  }

  return (
    <Box my={8}>
      <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={4} maxW="6xl" mx="auto">
        {DISPLAY_LEVELS.map((item, idx) => {
          const unlocked = userBalance >= item.invest;
          const isCurrentLevel = item.vip === `VIP ${currentLevel}` && unlocked;
          const cardStyle = getVipCardStyle(idx, unlocked, isCurrentLevel);
          const badgeStyle = getVipBadgeStyle(idx, unlocked, isCurrentLevel);
          return (
            <Box
              key={item.vip}
              borderRadius="lg"
              p={{ base: 3, md: 4 }}
              textAlign="center"
              position="relative"
              transition="all 0.3s ease"
              cursor={unlocked ? "pointer" : "default"}
              minH={{ base: "170px", md: "180px" }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              mx="auto"
              maxW={{ base: "100%", sm: "100%" }}
              animation={isCurrentLevel ? "pulse 2s infinite" : "none"}
              {...cardStyle}
            >
              {/* VIP Badge */}
              <Badge
                fontSize={{ base: "xs", md: "sm" }}
                px={3}
                py={1}
                borderRadius="full"
                mb={2}
                display="inline-flex"
                alignItems="center"
                gap={1}
                {...badgeStyle}
              >
                {item.vip}
                {isCurrentLevel && (
                  <Icon as={FaCrown} color="yellow.300" boxSize={4} title="مستواك الحالي" />
                )}
                {unlocked && !isCurrentLevel && (
                  <Icon as={FaCheckCircle} color="white" boxSize={3} title="مفتوح" />
                )}
              </Badge>
              {/* Investment Amount */}
              <Text 
                fontSize={{ base: "md", md: "lg" }} 
                fontWeight="bold" 
                mb={2} 
                color={unlocked ? (isCurrentLevel ? "brand.neonGreen" : "white") : "gray.400"}
                lineHeight="1.2"
              >
                {formatUSDT(item.invest)}
              </Text>
              {/* Percent Info */}
              <Text 
                fontSize={{ base: "xs", md: "sm" }} 
                color={unlocked ? (isCurrentLevel ? "brand.neonGreen" : "gray.300") : "gray.400"} 
                mb={1}
                lineHeight="1.3"
              >
                نسبة العائد اليومي: <b>{item.percent}</b>
              </Text>
              {/* Daily Income */}
              <Text 
                fontSize={{ base: "xs", md: "sm" }} 
                color={unlocked ? (isCurrentLevel ? "brand.neonGreen" : "brand.neonBlue") : "gray.400"} 
                fontWeight="medium" 
                mb={2}
                lineHeight="1.3"
              >
                الدخل اليومي: <b>{calcDailyIncome(item.invest)}</b>
              </Text>
              {/* Current Level Indicator */}
              {isCurrentLevel && (
                <>
                  <Box
                    position="absolute"
                    top={-2}
                    right={-2}
                    bg="brand.neonGreen"
                    color="black"
                    borderRadius="full"
                    px={2}
                    py={1}
                    fontSize="xs"
                    fontWeight="bold"
                    zIndex={4}
                    boxShadow="0 0 15px rgba(0, 255, 136, 0.5)"
                  >
                    <Flex align="center" gap={1}>
                      <Icon as={FaStar} boxSize={3} />
                      المستوى الحالي
                    </Flex>
                  </Box>
                  {/* Current Level Label inside card */}
                  <Box
                    position="absolute"
                    bottom={2}
                    left={2}
                    right={2}
                    bg="brand.neonGreen"
                    color="black"
                    borderRadius="md"
                    px={2}
                    py={1}
                    fontSize="xs"
                    fontWeight="bold"
                    textAlign="center"
                    zIndex={3}
                    boxShadow="0 0 10px rgba(0, 255, 136, 0.4)"
                  >
                    المستوى الحالي: {item.vip}
                  </Box>
                </>
              )}
              {/* Lock overlay for locked cards */}
              {!unlocked && (
                <>
                  <Box
                    position="absolute"
                    top={2}
                    right={2}
                    bg="rgba(255,255,255,0.1)"
                    borderRadius="full"
                    p={1}
                    zIndex={3}
                    boxShadow="0 0 10px rgba(255,255,255,0.2)"
                    backdropFilter="blur(10px)"
                  >
                    <Icon as={FaLock} color="gray.400" boxSize={4} />
                  </Box>
                  <Box
                    position="absolute"
                    inset={0}
                    bg="rgba(0,0,0,0.3)"
                    borderRadius="lg"
                    zIndex={1}
                    backdropFilter="blur(2px)"
                  />
                </>
              )}
              {/* Lock message for locked cards */}
              {!unlocked && (
                <Text 
                  mt={2} 
                  color="gray.400" 
                  fontWeight="bold" 
                  fontSize="xs"
                  textAlign="center"
                  zIndex={2}
                  position="relative"
                >
                  مغلق – يتطلب {formatUSDT(item.invest)}
                </Text>
              )}
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
} 