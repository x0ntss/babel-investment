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
import { FaLock, FaCrown } from "react-icons/fa";

const Home = React.memo(function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const VIP_LEVELS = [
    { vip: "VIP 1", invest: 25, percent: "1% - 2%" },
    { vip: "VIP 2", invest: 50, percent: "1% - 2%" },
    { vip: "VIP 3", invest: 150, percent: "1% - 2%" },
    { vip: "VIP 4", invest: 300, percent: "1% - 2%" },
    { vip: "VIP 5", invest: 500, percent: "1% - 2%" },
    { vip: "VIP 6", invest: 800, percent: "1% - 2%" },
    { vip: "VIP 7", invest: 1500, percent: "1% - 2%" },
    { vip: "VIP 8", invest: 3000, percent: "1% - 2%" },
    { vip: "VIP 9", invest: 5000, percent: "1% - 2%" },
    { vip: "VIP 10", invest: 8000, percent: "1% - 2%" },
    { vip: "VIP 11", invest: 15000, percent: "1% - 2%" },
    { vip: "VIP 12", invest: 30000, percent: "1% - 2%" },
  ];

  const getVipColor = (idx) => {
    if (idx < 4) return { bg: "gray.100", border: "1px solid #CBD5E0", badge: "gray" }; // Silver
    if (idx < 8) return { bg: "yellow.100", border: "1px solid #ECC94B", badge: "yellow" }; // Gold
    return { bg: "blue.100", border: "1px solid #63B3ED", badge: "blue" }; // Platinum
  };

  function calcDailyIncome(invest) {
    const min = (invest * 0.01).toFixed(2);
    const max = (invest * 0.02).toFixed(2);
    return `${min} – ${max} USDT`;
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
        {/* Progress to next VIP */}
        {(() => {
          const userBalance = user?.balance ?? 0;
          const nextVipIdx = VIP_LEVELS.findIndex((lvl) => userBalance < lvl.invest);
          const nextVip = nextVipIdx !== -1 ? VIP_LEVELS[nextVipIdx] : null;
          const progressToNext = nextVip ? Math.min(100, Math.round((userBalance / nextVip.invest) * 100)) : 100;
          return nextVip ? (
            <Box maxW="lg" mx="auto" mb={10}>
              <Text textAlign="center" mb={2} color="gray.700">
                تحتاج إلى <b>{nextVip.invest - userBalance}</b> USDT إضافية لفتح {nextVip.vip}
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
            const highestUnlockedIdx = VIP_LEVELS.reduce((acc, lvl, idx) => (userBalance >= lvl.invest ? idx : acc), -1);
            return VIP_LEVELS.map((item, idx) => {
              const { bg, border, badge } = getVipColor(idx);
              const unlocked = userBalance >= item.invest;
              const isHighest = idx === highestUnlockedIdx && unlocked;
              return (
                <Box
                  key={item.vip}
                  bg={bg}
                  border={
                    isHighest
                      ? "2px solid #F6AD55"
                      : unlocked
                      ? border
                      : "1.5px dashed #A0AEC0"
                  }
                  borderRadius="lg"
                  boxShadow={isHighest ? "0 0 0 2px #F6E05E" : "sm"}
                  p={{ base: 2, md: 4 }}
                  textAlign="center"
                  position="relative"
                  transition="transform 0.2s, box-shadow 0.2s, border 0.2s"
                  _hover={{ transform: unlocked ? "translateY(-4px) scale(1.02)" : undefined, boxShadow: unlocked ? "md" : undefined }}
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
                  >
                    {item.vip}
                    {isHighest && (
                      <Icon as={FaCrown} color="orange.400" ml={1} boxSize={4} title="مستواك الحالي" />
                    )}
                  </Badge>
                  {/* Investment Amount */}
                  <Text fontSize={{ base: "sm", md: "lg" }} fontWeight="bold" mb={1} color={unlocked ? "gray.700" : "gray.400"}>
                    {item.invest} USDT
                  </Text>
                  {/* Percent Info */}
                  <Text fontSize={{ base: "xs", md: "sm" }} color={unlocked ? "gray.600" : "gray.400"} mb={0.5}>
                    نسبة العائد اليومي: <b>{item.percent}</b>
                  </Text>
                  {/* Daily Income */}
                  <Text fontSize={{ base: "xs", md: "sm" }} color={unlocked ? "teal.600" : "gray.400"} fontWeight="medium" mb={1}>
                    الدخل اليومي: <b>{calcDailyIncome(item.invest)}</b>
                  </Text>
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
                      مغلق – يتطلب {item.invest} USDT
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
    </>
  );
});

export default Home;
