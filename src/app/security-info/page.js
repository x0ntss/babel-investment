"use client";
import React from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Icon,
  SimpleGrid,
  Card,
  CardBody,
  Container,
  Flex,
  Badge,
} from "@chakra-ui/react";
import {
  AiOutlineEye,
  AiOutlineTeam,
} from "react-icons/ai";
import { FaShieldAlt, FaLock, FaChartLine, FaBell, FaExclamationTriangle, FaTelegram } from "react-icons/fa";

export default function SecurityInfoPage() {
  const securityFeatures = [
    {
      icon: AiOutlineEye,
      title: "وضوح كامل في أنظمة الاستثمار",
      description: "جميع تفاصيل الاشتراكات، شروط المشاريع، ونظام السحب مذكورة بوضوح دون أي خداع أو تلاعب.",
      color: "blue.500",
      bgColor: "blue.50",
    },
    {
      icon: FaLock,
      title: "حماية معلومات المستخدمين",
      description: "المنصة تعتمد على تشفير داخلي لحفظ بيانات المستخدمين وعدم مشاركتها مع أي طرف ثالث.",
      color: "green.500",
      bgColor: "green.50",
    },
    {
      icon: FaChartLine,
      title: "سجل شفاف",
      description: "كل عملية مالية (إيداع، سحب، أرباح، إحالات) يتم توثيقها لحظة بلحظة ضمن سجل المستخدم، ولا يمكن تعديلها أو إخفاؤها.",
      color: "purple.500",
      bgColor: "purple.50",
    },
    {
      icon: AiOutlineTeam,
      title: "فريق دعم ومراقبة داخلي",
      description: "تتم مراجعة جميع المعاملات يدويًا من فريق متخصص قبل الموافقة، لضمان حماية حقوق المستخدمين.",
      color: "orange.500",
      bgColor: "orange.50",
    },
    {
      icon: FaBell,
      title: "نعلن كل تحديث أو تغيير بشفافية",
      description: "سواء في الأرباح، الأنظمة، أو مواعيد الإطلاق – يتم إبلاغ الجميع عبر القناة الرسمية.",
      color: "teal.500",
      bgColor: "teal.50",
    },
    {
      icon: FaExclamationTriangle,
      title: "لا نعد بأرباح خيالية",
      description: "نحن لا نعد بأرباح خيالية أو وعود وهمية، بل نعمل بخطوات مدروسة ومشاريع حقيقية لضمان الاستمرارية.",
      color: "red.500",
      bgColor: "red.50",
    },
  ];

  return (
    <Box mb={20} p={{ base: 4, md: 8 }} minH="100vh" maxW="1200px" mx="auto">
      <Container maxW="container.xl">
        {/* Header Section */}
        <Box
          bgGradient="linear(135deg, brand.darkGreen 0%, #0f2027 100%)"
          borderRadius="2xl"
          boxShadow="0 0 24px 4px #d4af37, 0 2px 16px 0 #d4af37, 0 0 0 4px brand.darkGreen"
          border="2px solid #d4af37"
          p={{ base: 6, md: 8 }}
          mb={8}
          textAlign="center"
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
          <VStack spacing={4} position="relative" zIndex={1}>
            <Icon as={FaShieldAlt} boxSize={16} color="#d4af37" />
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              color="#d4af37"
              fontWeight="extrabold"
              letterSpacing="wider"
              style={{ fontFamily: 'Orbitron, monospace', textShadow: '0 0 8px #d4af37' }}
            >
              الأمان والشفافية
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="white"
              maxW="800px"
              lineHeight="tall"
            >
              نؤكد لجميع مستخدمي منصة بابل أن الأمان والشفافية هما من أهم أولوياتنا، ونعمل على الالتزام بالآتي:
            </Text>
          </VStack>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </Box>

        {/* Features Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
          {securityFeatures.map((feature, index) => (
            <Card
              key={index}
              bg={feature.bgColor}
              border="2px solid"
              borderColor={feature.color}
              borderRadius="xl"
              boxShadow="lg"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "xl",
                borderColor: feature.color,
              }}
              transition="all 0.3s ease"
              dir="rtl"
            >
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <Flex
                    align="center"
                    justify="center"
                    w={12}
                    h={12}
                    borderRadius="full"
                    bg={feature.color}
                    color="white"
                    mb={2}
                  >
                    <Icon as={feature.icon} boxSize={6} />
                  </Flex>
                  <Heading
                    size="md"
                    color={feature.color}
                    fontWeight="bold"
                    textAlign="right"
                    w="full"
                  >
                    {feature.title}
                  </Heading>
                  <Text
                    color="gray.700"
                    fontSize="md"
                    lineHeight="tall"
                    textAlign="right"
                  >
                    {feature.description}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Contact Section */}
        <Card
          bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
          color="white"
          borderRadius="2xl"
          boxShadow="xl"
          p={8}
          textAlign="center"
          dir="rtl"
        >
          <VStack spacing={4}>
            <Icon as={FaTelegram} boxSize={12} color="white" />
            <Heading size="lg" fontWeight="bold">
              تابعونا دائمًا عبر القناة الرسمية
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              للحصول على آخر التحديثات والأخبار المهمة
            </Text>
            <Badge
              colorScheme="white"
              variant="solid"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="md"
              cursor="pointer"
              _hover={{ transform: "scale(1.05)" }}
              transition="transform 0.2s"
              onClick={() => window.open("https://t.me/babel_vip", "_blank")}
            >
              انضم إلى القناة الرسمية
            </Badge>
          </VStack>
        </Card>
      </Container>
    </Box>
  );
} 