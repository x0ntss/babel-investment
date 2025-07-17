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
      color: "brand.neonBlue",
      bgColor: "rgba(0, 212, 255, 0.05)",
    },
    {
      icon: FaLock,
      title: "حماية معلومات المستخدمين",
      description: "المنصة تعتمد على تشفير داخلي لحفظ بيانات المستخدمين وعدم مشاركتها مع أي طرف ثالث.",
      color: "brand.neonGreen",
      bgColor: "rgba(0, 255, 127, 0.05)",
    },
    {
      icon: FaChartLine,
      title: "سجل شفاف",
      description: "كل عملية مالية (إيداع، سحب، أرباح، إحالات) يتم توثيقها لحظة بلحظة ضمن سجل المستخدم، ولا يمكن تعديلها أو إخفاؤها.",
      color: "brand.neonPurple",
      bgColor: "rgba(147, 51, 234, 0.05)",
    },
    {
      icon: AiOutlineTeam,
      title: "فريق دعم ومراقبة داخلي",
      description: "تتم مراجعة جميع المعاملات يدويًا من فريق متخصص قبل الموافقة، لضمان حماية حقوق المستخدمين.",
      color: "brand.neonOrange",
      bgColor: "rgba(255, 165, 0, 0.05)",
    },
    {
      icon: FaBell,
      title: "نعلن كل تحديث أو تغيير بشفافية",
      description: "سواء في الأرباح، الأنظمة، أو مواعيد الإطلاق – يتم إبلاغ الجميع عبر القناة الرسمية.",
      color: "brand.neonCyan",
      bgColor: "rgba(0, 255, 255, 0.05)",
    },
    {
      icon: FaExclamationTriangle,
      title: "لا نعد بأرباح خيالية",
      description: "نحن لا نعد بأرباح خيالية أو وعود وهمية، بل نعمل بخطوات مدروسة ومشاريع حقيقية لضمان الاستمرارية.",
      color: "red.400",
      bgColor: "rgba(239, 68, 68, 0.05)",
    },
  ];

  return (
    <Box mb={20} p={{ base: 4, md: 8 }} minH="100vh" maxW="1200px" mx="auto">
      <Container maxW="container.xl">
        {/* Header Section */}
        <Box
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(20px)"
          borderRadius="2xl"
          border="1px solid"
          borderColor="brand.glassBorder"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
          p={{ base: 6, md: 8 }}
          mb={8}
          textAlign="center"
          position="relative"
          overflow="hidden"
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
          <VStack spacing={6} position="relative" zIndex={1}>
            <Icon as={FaShieldAlt} boxSize={16} color="brand.neonBlue" filter="drop-shadow(0 0 12px brand.neonBlue)" />
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              className="gradient-text"
              fontWeight="extrabold"
              letterSpacing="wider"
            >
              الأمان والشفافية
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.300"
              maxW="800px"
              lineHeight="tall"
            >
              نؤكد لجميع مستخدمي منصة بابل أن الأمان والشفافية هما من أهم أولوياتنا، ونعمل على الالتزام بالآتي:
            </Text>
          </VStack>
        </Box>

        {/* Features Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
          {securityFeatures.map((feature, index) => (
            <Card
              key={index}
              bg="rgba(0, 0, 0, 0.6)"
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.1)"
              borderRadius="xl"
              boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: `0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px ${feature.color}40`,
                borderColor: feature.color,
                _before: {
                  opacity: 1,
                }
              }}
              transition="all 0.3s ease"
              overflow="hidden"
              position="relative"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                bg: feature.color,
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <Flex
                    align="center"
                    justify="center"
                    w={14}
                    h={14}
                    borderRadius="full"
                    bg={feature.bgColor}
                    border="2px solid"
                    borderColor={feature.color}
                    mb={2}
                    filter="drop-shadow(0 0 8px currentColor)"
                  >
                    <Icon as={feature.icon} boxSize={7} color={feature.color} />
                  </Flex>
                  <Heading
                    size="md"
                    color="white"
                    fontWeight="bold"
                    textAlign="right"
                    w="full"
                    textShadow="0 0 8px rgba(255, 255, 255, 0.3)"
                  >
                    {feature.title}
                  </Heading>
                  <Text
                    color="gray.300"
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
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor="brand.glassBorder"
          borderRadius="2xl"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
          p={8}
          textAlign="center"
          overflow="hidden"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            bgGradient: 'linear(90deg, brand.neonBlue, brand.neonCyan)',
            opacity: 0.8,
          }}
        >
          <VStack spacing={6} position="relative" zIndex={1}>
            <Icon as={FaTelegram} boxSize={12} color="brand.neonCyan" filter="drop-shadow(0 0 12px brand.neonCyan)" />
            <Heading size="lg" fontWeight="bold" color="white">
              تابعونا دائمًا عبر القناة الرسمية
            </Heading>
            <Text fontSize="lg" color="gray.300" opacity={0.9}>
              للحصول على آخر التحديثات والأخبار المهمة
            </Text>
            <Badge
              bg="brand.neonCyan"
              color="black"
              variant="solid"
              px={6}
              py={3}
              borderRadius="full"
              fontSize="md"
              cursor="pointer"
              _hover={{ 
                transform: "scale(1.05)",
                boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
              }}
              transition="all 0.3s ease"
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