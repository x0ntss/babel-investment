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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  HStack
} from "@chakra-ui/react";
import OptimizedImage from "./OptimizedImage";
// Images are now served from public folder
const logo = "/images/lg.png";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import TopBannerCarousel from "./TopBannerCarousel";
import VipCardsSection from "./VipCardsSection";

const Home = React.memo(function Home() {
  const { user } = useAuth();
  const router = useRouter();

  // Modal logic
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Always show modal on homepage visit
    setShowModal(true);
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Telegram Modal - only on first visit */}
      <Modal isOpen={showModal} onClose={handleCloseModal} isCentered size={{ base: "xs", md: "md" }}>
        <ModalOverlay />
        <ModalContent p={0} borderRadius="lg" maxW={{ base: "90vw", md: "400px" }}>
          <ModalCloseButton top={0} left={2} right="unset" fontSize="lg" onClick={handleCloseModal} />
          <ModalBody p={6} textAlign="center" display="flex" flexDirection="column" alignItems="center">
            <Box mt={2} fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" mb={4} color="gray.800">
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
              <HStack spacing={4} w="full">
                <Button
                  colorScheme="blue"
                  onClick={() => router.push("/signup")}
                  size="lg"
                  px={8}
                  py={6}
                  fontWeight="bold"
                  fontSize="xl"
                  borderRadius="xl"
                  boxShadow="0 0 20px rgba(0, 212, 255, 0.2)"
                  _hover={{
                    bg: "brand.neonBlue",
                    color: "white",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0, 212, 255, 0.4)",
                  }}
                  transition="all 0.3s ease"
                  w="full"
                >
                  سجل الآن
                </Button>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  onClick={() => router.push("/signin")}
                  size="lg"
                  px={8}
                  py={6}
                  fontWeight="bold"
                  fontSize="xl"
                  borderRadius="xl"
                  boxShadow="0 0 10px rgba(0, 212, 255, 0.1)"
                  _hover={{
                    bg: "brand.neonBlue",
                    color: "white",
                    borderColor: "brand.neonBlue",
                  }}
                  transition="all 0.3s ease"
                  w="full"
                >
                  تسجيل الدخول
                </Button>
              </HStack>
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

      {/* VIP Cards Section - Only show when user is NOT logged in */}
      {!user && (
        <Box bg="transparent" color="white" py={{ base: 8, md: 20 }} px={8}>
          <Heading mb={8} fontSize="2xl" textAlign="center">
            مستويات VIP
          </Heading>
          <VipCardsSection user={user} />
        </Box>
      )}

      {/* Section 4: الأسئلة الشائعة */}
      <Box bg="brand.glass" py={{ base: 8, md: 20 }} px={{ base: 2, md: 8 }} textAlign="right">
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
      <Box bg="brand.glass" py={{ base: 8, md: 20 }} px={{ base: 2, md: 8 }} textAlign="right">
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
        bg="brand.darkCard"
        color="white"
        py={6}
        textAlign="center"
        pb="100px"
        borderTop="1px solid"
        borderColor="brand.glassBorder"
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
