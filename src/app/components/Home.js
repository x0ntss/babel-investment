"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  VStack,
  Stack,
  Link,
  Badge,
  SimpleGrid,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import OptimizedImage from "./OptimizedImage";
// Images are now served from public folder
const logo = "/images/lg.png";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FaLock, FaCrown, FaStar, FaCheckCircle } from "react-icons/fa";
import { formatUSDT, formatRange } from "../utils/numberFormat";
import { VIP_LEVELS } from "../utils/vipLevels";
import TopBannerCarousel from "./TopBannerCarousel";

const Home = React.memo(function Home() {
  const { user } = useAuth();
  const router = useRouter();

  // Transform VIP_LEVELS for display
  const DISPLAY_LEVELS = VIP_LEVELS.map(lvl => ({
    vip: `VIP ${lvl.level}`,
    invest: lvl.min,
    percent: `${lvl.percent[0]}% - ${lvl.percent[1]}%`
  }));

  const getVipCardStyle = (idx, isUnlocked, isCurrentLevel) => {
    if (isCurrentLevel) {
      // Current level - vibrant green with glow effect
      return {
        bg: "linear-gradient(135deg, green.50 0%, green.100 100%)",
        border: "2px solid",
        borderColor: "green.400",
        boxShadow: "0 0 25px rgba(72, 187, 120, 0.4), 0 4px 12px rgba(0, 0, 0, 0.1)",
        transform: "scale(1.02)",
        _hover: {
          transform: "scale(1.05)",
          boxShadow: "0 0 30px rgba(72, 187, 120, 0.6), 0 8px 20px rgba(0, 0, 0, 0.15)",
        }
      };
    }
    
    if (isUnlocked) {
      // Unlocked cards - vibrant social-style colors based on tier
      if (idx < 4) {
        // Silver tier - blue gradient
        return {
          bg: "linear-gradient(135deg, blue.50 0%, blue.100 100%)",
          border: "2px solid",
          borderColor: "blue.400",
          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)",
          _hover: {
            transform: "translateY(-4px) scale(1.02)",
            boxShadow: "0 8px 20px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)",
          }
        };
      } else if (idx < 8) {
        // Gold tier - orange gradient
        return {
          bg: "linear-gradient(135deg, orange.50 0%, orange.100 100%)",
          border: "2px solid",
          borderColor: "orange.400",
          boxShadow: "0 4px 12px rgba(245, 101, 101, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)",
          _hover: {
            transform: "translateY(-4px) scale(1.02)",
            boxShadow: "0 8px 20px rgba(245, 101, 101, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)",
          }
        };
      } else {
        // Platinum tier - purple gradient
        return {
          bg: "linear-gradient(135deg, purple.50 0%, purple.100 100%)",
          border: "2px solid",
          borderColor: "purple.400",
          boxShadow: "0 4px 12px rgba(147, 51, 234, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)",
          _hover: {
            transform: "translateY(-4px) scale(1.02)",
            boxShadow: "0 8px 20px rgba(147, 51, 234, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)",
          }
        };
      }
    } else {
      // Locked cards - muted grayscale
      return {
        bg: "gray.50",
        border: "1px solid",
        borderColor: "gray.300",
        opacity: 0.6,
        filter: "grayscale(0.3)",
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
        bg: "green.500",
        color: "white",
        boxShadow: "0 2px 8px rgba(72, 187, 120, 0.4)",
      };
    }
    
    if (isUnlocked) {
      if (idx < 4) return { bg: "blue.500", color: "white" };
      if (idx < 8) return { bg: "orange.500", color: "white" };
      return { bg: "purple.500", color: "white" };
    }
    
    return { bg: "gray.400", color: "white" };
  };

  function calcDailyIncome(invest) {
    const min = invest * 0.01;
    const max = invest * 0.02;
    return formatRange(min, max);
  }

  // Modal logic
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Only show if not seen before
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem("homepage_telegram_modal_seen");
      if (!seen) {
        setShowModal(true);
      }
    }
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("homepage_telegram_modal_seen", "1");
    }
  };

  return (
    <>
      {/* Telegram Modal - only on first visit */}
      <Modal isOpen={showModal} onClose={handleCloseModal} isCentered size={{ base: "xs", md: "md" }}>
        <ModalOverlay />
        <ModalContent p={0} borderRadius="lg" maxW={{ base: "90vw", md: "400px" }}>
          <ModalCloseButton top={2} left={2} right="unset" fontSize="lg" onClick={handleCloseModal} />
          <ModalBody p={6} textAlign="center" display="flex" flexDirection="column" alignItems="center">
            <Box fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" mb={4} color="gray.800">
              تابع القناة الرسمية التابعة للمنصة لمعرفة آخر التحديثات والتطورات
            </Box>
            <Button
              as="a"
              href="https://t.me/babel_vip"
              target="_blank"
              rel="noopener noreferrer"
              colorScheme="telegram"
              size="lg"
              w="full"
              mb={2}
            >
              t.me/babel_vip
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <TopBannerCarousel />
      {/* Section 1: المقدمة */}
      <Box
        p={{ base: 2, md: 8 }}
        textAlign="center"
        bg="transparent"
        minH="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {/* Logo at top for mobile */}
        <Box display={{ base: "block", md: "none" }} mb={6}>
          <OptimizedImage
            src={logo}
            alt="USDT"
            width={200}
            height={150}
            priority={true}
            style={{
              width: '60%',
              maxWidth: '200px',
              height: 'auto',
              margin: '0 auto',
            }}
          />
        </Box>

        <Heading mb={4} fontSize={{ base: "2xl", md: "4xl" }}>
          مرحبًا بك في منصة بابل للاستثمار
        </Heading>

        <Text mb={6} fontSize={{ base: "md", md: "lg" }} maxW="3xl" mx="auto">
          منصة بابل هي وجهتك الآمنة والموثوقة للاستثمار في العملات الرقمية.
          نمنحك فرصة لتنمية أموالك مع خطط يومية واضحة وعوائد مضمونة عبر مستويات
          متعددة تناسب جميع المستثمرين.
        </Text>

        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="center"
          gap={6}
          w="full"
          mt={8}
        >
          <VStack spacing={4} w={{ base: "100%", md: "auto" }}>
            <Text fontSize="lg" fontWeight="medium">
              ابدأ الاستثمار الآن وحقق أرباحًا يومية!
            </Text>
            {!user && (
              <>
                <Button
                  colorScheme="blue"
                  size="lg"
                  w={{ base: "80%", md: "200px" }}
                  onClick={() => router.push("/signin")}
                >
                  تسجيل الدخول
                </Button>
                <Button
                  colorScheme="green"
                  size="lg"
                  w={{ base: "80%", md: "200px" }}
                  onClick={() => router.push("/signup")}
                >
                  إنشاء حساب
                </Button>
              </>
              )}
          </VStack>

          {/* Logo for desktop - hidden on mobile since it's now at top */}
          <Box display={{ base: "none", md: "block" }}>
            <OptimizedImage
              src={logo}
              alt="USDT"
              width={300}
              height={200}
              priority={true}
              style={{
                width: '70%',
                maxWidth: '300px',
                height: 'auto',
                margin: '0 auto',
              }}
            />
          </Box>
        </Flex>
      </Box>

      {/* Section 3: مستويات VIP (بطاقات) */}
      <Box bg="white" color="black" py={{ base: 8, md: 20 }} px={8}>
        <Heading mb={8} fontSize="2xl" textAlign="center">
          مستويات VIP
        </Heading>
        
        {/* Current Level Summary */}
        {user && (
          <Box 
            bg="linear-gradient(135deg, green.50 0%, green.100 100%)"
            border="2px solid green.400"
            borderRadius="xl" 
            p={6} 
            mb={8} 
            maxW="md" 
            mx="auto"
            textAlign="center"
            boxShadow="0 0 25px rgba(72, 187, 120, 0.3)"
          >
            <Flex direction="column" align="center">
              <Icon as={FaCrown} color="green.500" boxSize={8} mb={2} />
              <Text fontSize="xl" fontWeight="bold" color="green.700" mb={1}>
                مستواك الحالي
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.600" mb={2}>
                {(() => {
                  const userBalance = user.balance ?? 0;
                  // Find the highest level the user has reached
                  let currentLevel = 0;
                  for (const lvl of VIP_LEVELS) {
                    if (userBalance >= lvl.min) {
                      currentLevel = lvl.level;
                      break; // VIP_LEVELS is ordered from highest to lowest, so first match is highest level
                    }
                  }
                  return currentLevel > 0 ? `VIP ${currentLevel}` : "VIP 0";
                })()}
              </Text>
              <Text fontSize="sm" color="green.600">
                رصيدك: {formatUSDT(user.balance)}
              </Text>
            </Flex>
          </Box>
        )}
        
        {/* Progress to next VIP */}
        {(() => {
          const userBalance = user?.balance ?? 0;
          const nextVipIdx = DISPLAY_LEVELS.findIndex((lvl) => userBalance < lvl.invest);
          const nextVip = nextVipIdx !== -1 ? DISPLAY_LEVELS[nextVipIdx] : null;
          const progressToNext = nextVip ? Math.min(100, Math.round((userBalance / nextVip.invest) * 100)) : 100;
          return nextVip ? (
            <Box maxW="lg" mx="auto" mb={10}>
              <Text textAlign="center" mb={2} color="gray.700">
                تحتاج إلى <b>{formatUSDT(nextVip.invest - userBalance)}</b> إضافية لفتح {nextVip.vip}
              </Text>
              <Box bg="gray.100" borderRadius="full" h="10px" w="100%" mb={2}>
                <Box 
                  bg="linear-gradient(90deg, teal.400 0%, green.400 100%)" 
                  h="10px" 
                  borderRadius="full" 
                  width={`${progressToNext}%`} 
                  transition="width 0.5s" 
                />
              </Box>
            </Box>
          ) : null;
        })()}
        
        <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={4} maxW="6xl" mx="auto">
          {(() => {
            const userBalance = user?.balance ?? 0;
            // Calculate current level properly
            let currentLevel = 0;
            for (const lvl of VIP_LEVELS) {
              if (userBalance >= lvl.min) {
                currentLevel = lvl.level;
                break;
              }
            }
            
            return DISPLAY_LEVELS.map((item, idx) => {
              const unlocked = userBalance >= item.invest;
              // Check if this card represents the current level
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
                  minH={{ base: "140px", md: "180px" }}
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
                    color={unlocked ? (isCurrentLevel ? "green.700" : "gray.700") : "gray.400"}
                    lineHeight="1.2"
                  >
                    {formatUSDT(item.invest)}
                  </Text>
                  
                  {/* Percent Info */}
                  <Text 
                    fontSize={{ base: "xs", md: "sm" }} 
                    color={unlocked ? (isCurrentLevel ? "green.600" : "gray.600") : "gray.400"} 
                    mb={1}
                    lineHeight="1.3"
                  >
                    نسبة العائد اليومي: <b>{item.percent}</b>
                  </Text>
                  
                  {/* Daily Income */}
                  <Text 
                    fontSize={{ base: "xs", md: "sm" }} 
                    color={unlocked ? (isCurrentLevel ? "green.600" : "teal.600") : "gray.400"} 
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
                        bg="green.500"
                        color="white"
                        borderRadius="full"
                        px={2}
                        py={1}
                        fontSize="xs"
                        fontWeight="bold"
                        zIndex={4}
                        boxShadow="lg"
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
                        bg="green.500"
                        color="white"
                        borderRadius="md"
                        px={2}
                        py={1}
                        fontSize="xs"
                        fontWeight="bold"
                        textAlign="center"
                        zIndex={3}
                        boxShadow="md"
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
                        bg="rgba(255,255,255,0.9)"
                        borderRadius="full"
                        p={1}
                        zIndex={3}
                        boxShadow="sm"
                      >
                        <Icon as={FaLock} color="gray.500" boxSize={4} />
                      </Box>
                      <Box
                        position="absolute"
                        inset={0}
                        bg="rgba(0,0,0,0.1)"
                        borderRadius="lg"
                        zIndex={1}
                      />
                    </>
                  )}
                  
                  {/* Lock message for locked cards */}
                  {!unlocked && (
                    <Text 
                      mt={2} 
                      color="gray.500" 
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
            });
          })()}
        </SimpleGrid>
      </Box>

      {/* Section 4: الأسئلة الشائعة */}
      <Box bg="rgba(0,0,0,0.4)" py={{ base: 8, md: 20 }} px={{ base: 2, md: 8 }} textAlign="right">
        <Heading mb={8} fontSize="2xl" textAlign="center">
          الأسئلة الشائعة
        </Heading>
        <Stack spacing={8} maxW="4xl" mx="auto" fontSize="lg">
          <Box>
            <Text fontWeight="bold" mb={2}>
              كيف أبدأ الاستثمار؟
            </Text>
            <Text>
              سجل حسابك، اختر المستوى المناسب، ثم قم بالإيداع وابدأ بتحقيق
              أرباحك اليومية.
            </Text>
          </Box>
          <Box>
            <Text fontWeight="bold" mb={2}>
              هل الأرباح مضمونة؟
            </Text>
            <Text>
              نعم، المنصة تقدم عوائد ثابتة بعقود استثمارية شفافة وموثوقة.
            </Text>
          </Box>
          <Box>
            <Text fontWeight="bold" mb={2}>
              كيف أسحب الأرباح؟
            </Text>
            <Text>
              يمكنك سحب أرباحك بسهولة من لوحة التحكم باستخدام محفظتك الرقمية.
            </Text>
          </Box>
        </Stack>
      </Box>
      
      {/* Section 2: المميزات */}
      <Box bg="rgba(0,0,0,0.4)" py={{ base: 8, md: 20 }} px={{ base: 2, md: 8 }} textAlign="right">
        <Heading mb={8} fontSize="2xl" textAlign="center">
          مميزات منصة بابل
        </Heading>
        <Stack spacing={5} maxW="4xl" mx="auto" fontSize="lg">
          <Text>✅ عوائد يومية ثابتة تبدأ من 1% الى 2% يوميًا حسب رأس المال.</Text>
          <Text>✅ تنوع المستويات لتناسب جميع رؤوس الأموال.</Text>
          <Text>✅ دعم احترافي وخدمة عملاء على مدار الساعة.</Text>
          <Text>✅ لوحة تحكم متقدمة لمتابعة أرباحك وسحوباتك.</Text>
          <Text>✅ نظام إحالة يتيح لك زيادة أرباحك من دعوة أصدقائك.</Text>
        </Stack>
      </Box>
      
      <Box
        bg="blackAlpha.800"
        color="white"
        py={6}
        textAlign="center"
        pb="100px"
      >
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="center"
          spacing={6}
        >
          <Link href="https://t.me/babel_vip" target="_blank" rel="noopener noreferrer">
            تيليجرام
          </Link>
        </Stack>
        <Text mt={4} fontSize="sm">
          © {new Date().getFullYear()} منصة بابل. جميع الحقوق محفوظة.
        </Text>
      </Box>
      
      <style jsx global>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 25px rgba(72, 187, 120, 0.4);
          }
          50% {
            box-shadow: 0 0 35px rgba(72, 187, 120, 0.6);
          }
          100% {
            box-shadow: 0 0 25px rgba(72, 187, 120, 0.4);
          }
        }
      `}</style>
    </>
  );
});

export default Home;
