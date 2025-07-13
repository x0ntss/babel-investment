"use client";
import React from "react";
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
} from "@chakra-ui/react";
import OptimizedImage from "./OptimizedImage";
// Images are now served from public folder
const logo = "/images/lg.png";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FaLock, FaCrown, FaStar, FaCheckCircle } from "react-icons/fa";
import { formatUSDT, formatRange } from "../utils/numberFormat";
import { VIP_LEVELS } from "../utils/vipLevels";

const Home = React.memo(function Home() {
  const { user } = useAuth();
  const router = useRouter();

  // Transform VIP_LEVELS for display
  const DISPLAY_LEVELS = VIP_LEVELS.map(lvl => ({
    vip: `VIP ${lvl.level}`,
    invest: lvl.min,
    percent: `${lvl.percent[0]}% - ${lvl.percent[1]}%`
  }));

  const getVipColor = (idx, isCurrentLevel = false) => {
    if (isCurrentLevel) {
      return { 
        bg: "green.50", 
        border: "2px solid #48BB78", 
        badge: "green",
        textColor: "green.700",
        badgeColor: "green.500"
      };
    }
    if (idx < 4) return { bg: "gray.100", border: "1px solid #CBD5E0", badge: "gray", textColor: "gray.700", badgeColor: "gray.500" }; // Silver
    if (idx < 8) return { bg: "yellow.100", border: "1px solid #ECC94B", badge: "yellow", textColor: "yellow.700", badgeColor: "yellow.500" }; // Gold
    return { bg: "blue.100", border: "1px solid #63B3ED", badge: "blue", textColor: "blue.700", badgeColor: "blue.500" }; // Platinum
  };

  function calcDailyIncome(invest) {
    const min = invest * 0.01;
    const max = invest * 0.02;
    return formatRange(min, max);
  }

  return (
    <>
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
            bg="green.50" 
            border="2px solid green.200" 
            borderRadius="xl" 
            p={6} 
            mb={8} 
            maxW="md" 
            mx="auto"
            textAlign="center"
          >
            <Flex direction="column" align="center">
              <Icon as={FaCrown} color="green.500" boxSize={8} mb={2} />
              <Text fontSize="xl" fontWeight="bold" color="green.700" mb={1}>
                مستواك الحالي
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.600" mb={2}>
                {(() => {
                  const userBalance = user.balance ?? 0;
                  const highestUnlockedIdx = DISPLAY_LEVELS.reduce((acc, lvl, idx) => (userBalance >= lvl.invest ? idx : acc), -1);
                  return highestUnlockedIdx >= 0 ? DISPLAY_LEVELS[highestUnlockedIdx].vip : "VIP 0";
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
                <Box bg="teal.400" h="10px" borderRadius="full" width={`${progressToNext}%`} transition="width 0.5s" />
              </Box>
            </Box>
          ) : null;
        })()}
        <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={4} maxW="6xl" mx="auto">
          {(() => {
            const userBalance = user?.balance ?? 0;
            const highestUnlockedIdx = DISPLAY_LEVELS.reduce((acc, lvl, idx) => (userBalance >= lvl.invest ? idx : acc), -1);
            return DISPLAY_LEVELS.map((item, idx) => {
              const unlocked = userBalance >= item.invest;
              const isCurrentLevel = idx === highestUnlockedIdx && unlocked;
              const { bg, border, badge, textColor, badgeColor } = getVipColor(idx, isCurrentLevel);
              return (
                <Box
                  key={item.vip}
                  bg={bg}
                  border={border}
                  borderRadius="lg"
                  boxShadow={isCurrentLevel ? "0 0 20px rgba(72, 187, 120, 0.3)" : "sm"}
                  p={{ base: 2, md: 4 }}
                  textAlign="center"
                  position="relative"
                  transition="all 0.3s ease"
                  _hover={{ 
                    transform: unlocked ? "translateY(-4px) scale(1.02)" : undefined, 
                    boxShadow: unlocked ? (isCurrentLevel ? "0 0 25px rgba(72, 187, 120, 0.4)" : "md") : undefined 
                  }}
                  opacity={1}
                  filter="none"
                  cursor="pointer"
                  minH={{ base: "120px", md: "160px" }}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  mx="auto"
                  maxW={{ base: "95%", sm: "100%" }}
                  animation={isCurrentLevel ? "pulse 2s infinite" : "none"}
                >
                  {/* VIP Badge */}
                  <Badge
                    colorScheme={badge}
                    fontSize={{ base: "xs", md: "md" }}
                    px={2}
                    py={0.5}
                    borderRadius="full"
                    mb={1}
                    display="inline-flex"
                    alignItems="center"
                    opacity={unlocked ? 1 : 0.7}
                    bg={isCurrentLevel ? "green.500" : undefined}
                    color={isCurrentLevel ? "white" : undefined}
                  >
                    {item.vip}
                    {isCurrentLevel && (
                      <Icon as={FaCrown} color="yellow.300" ml={1} boxSize={4} title="مستواك الحالي" />
                    )}
                    {unlocked && !isCurrentLevel && (
                      <Icon as={FaCheckCircle} color={badgeColor} ml={1} boxSize={3} title="مفتوح" />
                    )}
                  </Badge>
                  {/* Investment Amount */}
                  <Text fontSize={{ base: "sm", md: "lg" }} fontWeight="bold" mb={1} color={unlocked ? (isCurrentLevel ? "green.700" : textColor) : "gray.400"}>
                    {formatUSDT(item.invest)}
                  </Text>
                  {/* Percent Info */}
                  <Text fontSize={{ base: "xs", md: "sm" }} color={unlocked ? (isCurrentLevel ? "green.600" : "gray.600") : "gray.400"} mb={0.5}>
                    نسبة العائد اليومي: <b>{item.percent}</b>
                  </Text>
                  {/* Daily Income */}
                  <Text fontSize={{ base: "xs", md: "sm" }} color={unlocked ? (isCurrentLevel ? "green.600" : "teal.600") : "gray.400"} fontWeight="medium" mb={1}>
                    الدخل اليومي: <b>{calcDailyIncome(item.invest)}</b>
                  </Text>
                  
                  {/* Current Level Indicator */}
                  {isCurrentLevel && (
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
                      <Flex align="center">
                        <Icon as={FaStar} mr={1} boxSize={3} />
                        المستوى الحالي
                      </Flex>
                    </Box>
                  )}
                  {/* Lock icon in the top right corner for locked cards */}
                  {!unlocked && (
                    <Box
                      position="absolute"
                      top={2}
                      right={2}
                      bg="rgba(255,255,255,0.8)"
                      borderRadius="full"
                      p={0.5}
                      zIndex={3}
                      boxShadow="sm"
                    >
                      <Icon as={FaLock} color="gray.500" boxSize={4} />
      </Box>
                  )}
                  {/* Lock message at the bottom for locked cards */}
                  {!unlocked && (
                    <Text mt={2} color="gray.500" fontWeight="bold" fontSize="xs">
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
 
          <Link href="https://t.me/llnvestorshouse" target="_blank" rel="noopener noreferrer">
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
            box-shadow: 0 0 20px rgba(72, 187, 120, 0.3);
          }
          50% {
            box-shadow: 0 0 25px rgba(72, 187, 120, 0.5);
          }
          100% {
            box-shadow: 0 0 20px rgba(72, 187, 120, 0.3);
          }
        }
      `}</style>
    </>
  );
});

export default Home;
