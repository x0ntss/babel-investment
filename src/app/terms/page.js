"use client";
import React from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Icon,
  Card,
  CardBody,
  List,
  ListItem,
  ListIcon,
  Flex,
  Button,
} from "@chakra-ui/react";
import {
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { FaFileContract, FaUserCheck, FaMoneyBillWave, FaHandshake, FaUsers, FaTasks, FaShieldAlt, FaBan, FaEdit, FaEnvelope, FaTelegram } from "react-icons/fa";

export default function TermsPage() {
  const termsSections = [
    {
      icon: FaFileContract,
      title: "قبول الشروط",
      content: "استخدامك للمنصة يعني موافقتك الكاملة على جميع الشروط والأحكام المذكورة في هذه الوثيقة. في حال عدم موافقتك، يُرجى التوقف عن استخدام المنصة فورًا.",
      color: "brand.neonBlue",
      bgColor: "rgba(0, 212, 255, 0.05)",
    },
    {
      icon: FaUserCheck,
      title: "الاشتراك والعضوية",
      items: [
        "يحق لكل مستخدم التسجيل بحساب واحد فقط.",
        "يجب على المستخدم إدخال بيانات صحيحة عند التسجيل.",
        "لا يجوز مشاركة الحساب مع أطراف أخرى.",
      ],
      color: "brand.neonGreen",
      bgColor: "rgba(0, 255, 127, 0.05)",
    },
    {
      icon: FaMoneyBillWave,
      title: "الاستثمار والمخاطر",
      items: [
        "منصة بابل توفر فرص استثمارية واقعية ومنظمة، ولكن لا تضمن أرباحًا محددة.",
        "يتحمل المستخدم كامل المسؤولية عند اتخاذ قرار الاستثمار.",
        "لا يمكن استرداد رأس المال قبل انتهاء مدة العقد المحددة لكل خطة أو مشروع.",
      ],
      color: "brand.neonOrange",
      bgColor: "rgba(255, 165, 0, 0.05)",
    },
    {
      icon: FaHandshake,
      title: "نظام السحب والإيداع",
      items: [
        "يمكن للمستخدم السحب 3 مرات في الشهر (كل 10 أيام).",
        "السحب يقتصر على الأرباح فقط، ولا يشمل رأس المال.",
        "يتم خصم ضريبة بنسبة 15% على أي عملية سحب.",
        "تأكيد الإيداع يتم يدويًا من قبل فريق الإدارة بعد التحقق من التحويل.",
      ],
      color: "brand.neonPurple",
      bgColor: "rgba(147, 51, 234, 0.05)",
    },
    {
      icon: FaUsers,
      title: "سياسة الإحالة",
      items: [
        "يتم منح مكافآت إحالة بنسبة 10% (أول أسبوع)، ثم 5% بعد ذلك.",
        "أي محاولة تلاعب بنظام الإحالة أو التسجيل المتكرر تؤدي إلى حظر الحساب نهائيًا.",
      ],
      color: "brand.neonCyan",
      bgColor: "rgba(0, 255, 255, 0.05)",
    },
    {
      icon: FaTasks,
      title: "المهام والمكافآت",
      items: [
        "المهام اليومية متاحة حسب مستوى VIP المفعّل.",
        "لا يجوز استخدام أدوات آلية (بوتات أو نقر آلي) لأداء المهام.",
        "يتم إلغاء المكافآت مباشرة في حال اكتشاف استخدام غير مشروع للنظام.",
      ],
      color: "brand.neonBlue",
      bgColor: "rgba(0, 212, 255, 0.05)",
    },
    {
      icon: FaShieldAlt,
      title: "الخصوصية وحماية البيانات",
      items: [
        "تلتزم المنصة بعدم مشاركة أي معلومات خاصة بالمستخدمين مع أي جهة خارجية.",
        "جميع البيانات مشفّرة وآمنة ويتم التعامل معها بسرية تامة.",
      ],
      color: "brand.neonGreen",
      bgColor: "rgba(0, 255, 127, 0.05)",
    },
    {
      icon: FaBan,
      title: "إيقاف الحسابات",
      items: [
        "تقديم بيانات مزيفة أو مضللة.",
        "إساءة استخدام نظام الإحالة أو المهام.",
        "محاولات اختراق أو التلاعب بأنظمة المنصة.",
      ],
      color: "red.400",
      bgColor: "rgba(239, 68, 80, 0.05)",
    },
    {
      icon: FaEdit,
      title: "التعديلات على السياسة",
      content: "يحق لإدارة منصة بابل تعديل هذه الشروط في أي وقت، ويتم إخطار المستخدمين عبر القناة الرسمية أو داخل التطبيق.",
      color: "brand.neonPurple",
      bgColor: "rgba(147, 51, 234, 0.05)",
    },
  ];

  return (
    <Box mb={20} p={{ base: 4, md: 8 }} minH="100vh" maxW="1200px" mx="auto">
      <VStack spacing={8} align="stretch">
        {/* Header Section */}
        <Box
          bg="rgba(0, 0, 0, 0.8)"
          backdropFilter="blur(20px)"
          border="1px solid rgba(255, 255, 255, 0.1)"
          borderRadius="2xl"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.03)"
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
          style={{ fontFamily: 'Orbitron, monospace' }}
          dir="rtl"
        >
          <VStack spacing={6} position="relative" zIndex={1}>
            <Icon as={FaFileContract} boxSize={16} color="brand.neonBlue" filter="drop-shadow(0 0 2px brand.neonBlue)" />
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              className="gradient-text"
              fontWeight="extrabold"
              letterSpacing="wider"
            >
              سياسة استخدام منصة بابل
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.300"
              maxW="800px"
              lineHeight="tall"
            >
              مرحبًا بك في منصة بابل للاستثمار الرقمي. باستخدامك للمنصة، فإنك توافق على الشروط والسياسات التالية:
            </Text>
          </VStack>
        </Box>

        {/* Terms Sections */}
        <VStack spacing={6} align="stretch">
          {termsSections.map((section, index) => (
            <Card
              key={index}
              bg="rgba(0, 0, 0, 0.6)"
              backdropFilter="blur(20px)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              borderRadius="xl"
              boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
              overflow="hidden"
              position="relative"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: `0 8px 30px rgba(0, 0, 0, 0.40), 0 0 0 4px ${section.color}40`,
                borderColor: section.color,
              }}
              transition="all 0.3s ease"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                bg: section.color,
                opacity: 0.8
              }}
              dir="rtl"
            >
              <CardBody p={6}>
                <Flex align="center" mb={4}>
                  <Flex
                    align="center"
                    justify="center"
                    w={12}
                    h={12}
                    borderRadius="full"
                    bg={section.bgColor}
                    border="2px solid"
                    borderColor={section.color}
                    color={section.color}
                    mr={4}
                    filter="drop-shadow(0 0px currentColor)"
                  >
                    <Icon as={section.icon} boxSize={6} />
                  </Flex>
                  <Heading
                    size="md"
                    color="white"
                    fontWeight="bold"
                  >
                    {section.title}
                  </Heading>
                </Flex>
                
                {section.content ? (
                  <Text
                    color="gray.300"
                    fontSize="md"
                    lineHeight="tall"
                    textAlign="right"
                  >
                    {section.content}
                  </Text>
                ) : section.items ? (
                  <List spacing={3} textAlign="right">
                    {section.items.map((item, itemIndex) => (
                      <ListItem key={itemIndex} display="flex" alignItems="start">
                        <ListIcon as={AiOutlineCheckCircle} color={section.color} mt={1} />
                        <Text color="gray.300">
                          {item}
                        </Text>
                      </ListItem>
                    ))}
                  </List>
                ) : null}
              </CardBody>
            </Card>
          ))}
        </VStack>

        {/* Contact Section */}
        <Card
          bg="rgba(0, 0, 0, 0.8)"
          backdropFilter="blur(20px)"
          border="1px solid rgba(255, 255, 255, 0.1)"
          borderRadius="2xl"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.03)"
          p={8}
          mt={8}
          textAlign="center"
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
          dir="rtl"
        >
          <VStack spacing={6} position="relative" zIndex={1}>
            <Icon as={FaEnvelope} boxSize={12} color="brand.neonCyan" filter="drop-shadow(0 0 2px brand.neonCyan)" />
            <Heading size="lg" fontWeight="bold" color="white">
              للتواصل والدعم
            </Heading>
            <Text fontSize="lg" color="gray.300">
              لأي استفسار أو طلب دعم، يرجى التواصل معنا من خلال:
            </Text>
            <Button
              leftIcon={<FaTelegram />}
              colorScheme="telegram"
              size="lg"
              bg="brand.neonCyan"
              color="black"
              _hover={{
                bg: "brand.neonCyan",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(0, 255, 255, 0.4)",
              }}
              _active={{
                transform: "translateY(0)",
              }}
              transition="all 0.3s ease"
              onClick={() => window.open("https://t.me/babel_vip", "_blank")}
            >
              قناة التحديثات الرسمية
            </Button>
          </VStack>
        </Card>
      </VStack>
    </Box>
  );
} 