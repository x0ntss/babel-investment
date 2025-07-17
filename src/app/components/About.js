"use client";
import React from "react";
import { Box, Heading, Text, VStack, Icon, HStack, Badge } from "@chakra-ui/react";
import OptimizedImage from "./OptimizedImage";
import { FaRocket, FaShieldAlt, FaGlobe, FaCalendarAlt, FaStar } from "react-icons/fa";

// Images are now served from public folder
const logo = "/images/logo.JPG";

export default function About() {
  return (
    <Box
      p={{ base: 4, md: 8 }}
      minH="100vh"
      maxW="1200px"
      mx="auto"
      mb={20}
    >
      <VStack spacing={8} align="stretch">
        <Heading 
          fontSize={{ base: "3xl", md: "4xl" }} 
          textAlign="center"
          className="gradient-text"
          fontWeight="extrabold"
          letterSpacing="wider"
        >
          حول منصة Babel Investment
        </Heading>

        <Box
          bg="rgba(0, 0, 0, 0.6)"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor="brand.glassBorder"
          borderRadius="2xl"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
          overflow="hidden"
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
        >
          <VStack spacing={8} p={8} position="relative" zIndex={1}>
            {/* Logo Section */}
            <VStack spacing={4}>
             
                <OptimizedImage
                  src={logo}
                  alt="Babel Trade Logo"
                  width={120}
                  height={120}
                  style={{
                    border: '3px solid rgba(255, 255, 255, 0.2)',
                  }}
                />
              
              <Badge
                colorScheme="blue"
                variant="solid"
                px={4}
                py={2}
                borderRadius="full"
                fontSize="md"
                fontWeight="bold"
                bg="linear-gradient(135deg, brand.neonBlue, brand.neonCyan)"
                color="black"
              >
                <HStack spacing={2}>
                  <FaStar />
                  <Text>منصة استثمارية مبتكرة</Text>
                </HStack>
              </Badge>
            </VStack>

            {/* Main Content */}
            <VStack spacing={6} align="stretch">
              <Text fontSize="lg" color="white" lineHeight="tall" textAlign="center">
                منصة <Text as="span" color="brand.neonBlue" fontWeight="bold">Babel Investment</Text> هي منصة استثمارية مبتكرة تهدف إلى تمكين المستخدمين
                من تحقيق <Text as="span" color="brand.neonGreen" fontWeight="bold">دخل يومي</Text> عبر نظام المهام والمستويات، مع واجهة سهلة الاستخدام
                وتجربة متكاملة للتحكم في المحفظة والإيداعات.
              </Text>

              <Text fontSize="md" color="gray.300" lineHeight="tall" textAlign="center">
                تم تأسيس المنصة في <Text as="span" color="brand.neonOrange" fontWeight="bold">2025-7-15</Text>، وهي مصممة لتوفير فرص ربحية عادلة
                لجميع المستخدمين حول العالم.
              </Text>

              <Text fontSize="md" color="gray.300" lineHeight="tall" textAlign="center">
                نحن نلتزم بأعلى معايير <Text as="span" color="brand.neonPurple" fontWeight="bold">الأمان والشفافية</Text> ونوفر دعمًا فنيًا متواصلًا
                لضمان تجربة موثوقة لكل مستثمر.
              </Text>
            </VStack>

            {/* Features Grid */}
            <VStack spacing={4} align="stretch">
              <Text fontSize="lg" fontWeight="bold" color="white" textAlign="center" mb={4}>
                مميزات المنصة
              </Text>
              
              <HStack spacing={4} justify="center" flexWrap="wrap">
                <VStack spacing={2} p={4} bg="rgba(255, 255, 255, 0.05)" borderRadius="lg" minW="120px">
                  <Icon as={FaRocket} color="brand.neonBlue" boxSize={6} />
                  <Text fontSize="sm" color="gray.300" textAlign="center">استثمار مبتكر</Text>
                </VStack>
                
                <VStack spacing={2} p={4} bg="rgba(255, 255, 255, 0.05)" borderRadius="lg" minW="120px">
                  <Icon as={FaShieldAlt} color="brand.neonGreen" boxSize={6} />
                  <Text fontSize="sm" color="gray.300" textAlign="center">أمان عالي</Text>
                </VStack>
                
                <VStack spacing={2} p={4} bg="rgba(255, 255, 255, 0.05)" borderRadius="lg" minW="120px">
                  <Icon as={FaGlobe} color="brand.neonPurple" boxSize={6} />
                  <Text fontSize="sm" color="gray.300" textAlign="center">وصول عالمي</Text>
                </VStack>
                
                <VStack spacing={2} p={4} bg="rgba(255, 255, 255, 0.05)" borderRadius="lg" minW="120px">
                  <Icon as={FaCalendarAlt} color="brand.neonOrange" boxSize={6} />
                  <Text fontSize="sm" color="gray.300" textAlign="center">دخل يومي</Text>
                </VStack>
              </HStack>
            </VStack>

            <Text fontSize="lg" color="brand.neonCyan" fontWeight="bold" textAlign="center" mt={4}>
              انضم إلينا اليوم وابدأ رحلتك الاستثمارية بثقة ونجاح! 🚀
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
