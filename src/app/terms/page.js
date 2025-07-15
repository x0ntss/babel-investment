"use client";
import React from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Icon,
  Container,
  Card,
  CardBody,
  Divider,
  List,
  ListItem,
  ListIcon,
  Badge,
  Flex,
} from "@chakra-ui/react";
import {
  AiOutlineFileText,
  AiOutlineCheckCircle,
  AiOutlineUser,
  AiOutlineDollar,
  AiOutlineWithdraw,
  AiOutlineTeam,
  AiOutlineTask,
  AiOutlineLock,
  AiOutlineStop,
  AiOutlineEdit,
  AiOutlineMessage,
} from "react-icons/ai";
import { FaFileContract, FaUserCheck, FaMoneyBillWave, FaHandshake, FaUsers, FaTasks, FaShieldAlt, FaBan, FaEdit, FaEnvelope } from "react-icons/fa";

export default function TermsPage() {
  const termsSections = [
    {
      icon: FaFileContract,
      title: "قبول الشروط",
      content: "استخدامك للمنصة يعني موافقتك الكاملة على جميع الشروط والأحكام المذكورة في هذه الوثيقة. في حال عدم موافقتك، يُرجى التوقف عن استخدام المنصة فورًا.",
      color: "blue.500",
    },
    {
      icon: FaUserCheck,
      title: "الاشتراك والعضوية",
      items: [
        "يحق لكل مستخدم التسجيل بحساب واحد فقط.",
        "يجب على المستخدم إدخال بيانات صحيحة عند التسجيل.",
        "لا يجوز مشاركة الحساب مع أطراف أخرى.",
      ],
      color: "green.500",
    },
    {
      icon: FaMoneyBillWave,
      title: "الاستثمار والمخاطر",
      items: [
        "منصة بابل توفر فرص استثمارية واقعية ومنظمة، ولكن لا تضمن أرباحًا محددة.",
        "يتحمل المستخدم كامل المسؤولية عند اتخاذ قرار الاستثمار.",
        "لا يمكن استرداد رأس المال قبل انتهاء مدة العقد المحددة لكل خطة أو مشروع.",
      ],
      color: "orange.500",
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
      color: "purple.500",
    },
    {
      icon: FaUsers,
      title: "سياسة الإحالة",
      items: [
        "يتم منح مكافآت إحالة بنسبة 10% (أول أسبوع)، ثم 5% بعد ذلك.",
        "أي محاولة تلاعب بنظام الإحالة أو التسجيل المتكرر تؤدي إلى حظر الحساب نهائيًا.",
      ],
      color: "teal.500",
    },
    {
      icon: FaTasks,
      title: "المهام والمكافآت",
      items: [
        "المهام اليومية متاحة حسب مستوى VIP المفعّل.",
        "لا يجوز استخدام أدوات آلية (بوتات أو نقر آلي) لأداء المهام.",
        "يتم إلغاء المكافآت مباشرة في حال اكتشاف استخدام غير مشروع للنظام.",
      ],
      color: "cyan.500",
    },
    {
      icon: FaShieldAlt,
      title: "الخصوصية وحماية البيانات",
      items: [
        "تلتزم المنصة بعدم مشاركة أي معلومات خاصة بالمستخدمين مع أي جهة خارجية.",
        "جميع البيانات مشفّرة وآمنة ويتم التعامل معها بسرية تامة.",
      ],
      color: "indigo.500",
    },
    {
      icon: FaBan,
      title: "إيقاف الحسابات",
      items: [
        "تقديم بيانات مزيفة أو مضللة.",
        "إساءة استخدام نظام الإحالة أو المهام.",
        "محاولات اختراق أو التلاعب بأنظمة المنصة.",
      ],
      color: "red.500",
    },
    {
      icon: FaEdit,
      title: "التعديلات على السياسة",
      content: "يحق لإدارة منصة بابل تعديل هذه الشروط في أي وقت، ويتم إخطار المستخدمين عبر القناة الرسمية أو داخل التطبيق.",
      color: "pink.500",
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
            <Icon as={FaFileContract} boxSize={16} color="#d4af37" />
            <Heading
              fontSize={{ base: "3xl", md: "4xl" }}
              color="#d4af37"
              fontWeight="extrabold"
              letterSpacing="wider"
              style={{ fontFamily: 'Orbitron, monospace', textShadow: '0 0 8px #d4af37' }}
            >
              سياسة استخدام منصة بابل
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="white"
              maxW="800px"
              lineHeight="tall"
            >
              مرحبًا بك في منصة بابل للاستثمار الرقمي. باستخدامك للمنصة، فإنك توافق على الشروط والسياسات التالية:
            </Text>
          </VStack>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </Box>

        {/* Terms Sections */}
        <VStack spacing={8} align="stretch">
          {termsSections.map((section, index) => (
            <Card
              key={index}
              bg="white"
              borderRadius="xl"
              boxShadow="lg"
              border="2px solid"
              borderColor={section.color}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "xl",
              }}
              transition="all 0.3s ease"
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
                    bg={section.color}
                    color="white"
                    mr={4}
                  >
                    <Icon as={section.icon} boxSize={6} />
                  </Flex>
                  <Heading
                    size="md"
                    color={section.color}
                    fontWeight="bold"
                  >
                    {section.title}
                  </Heading>
                </Flex>
                
                {section.content ? (
                  <Text
                    color="gray.700"
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
                        <Text color="gray.700" fontSize="md">
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
          bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
          color="white"
          borderRadius="2xl"
          boxShadow="xl"
          p={8}
          mt={8}
          textAlign="center"
          dir="rtl"
        >
          <VStack spacing={4}>
            <Icon as={FaEnvelope} boxSize={12} color="white" />
            <Heading size="lg" fontWeight="bold">
              للتواصل والدعم
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              لأي استفسار أو طلب دعم، يرجى التواصل معنا من خلال:
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
              قناة التحديثات الرسمية
            </Badge>
          </VStack>
        </Card>
      </Container>
    </Box>
  );
} 