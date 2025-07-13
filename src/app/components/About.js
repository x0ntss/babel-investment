import React from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import OptimizedImage from "./OptimizedImage";

// Images are now served from public folder
const logo = "/images/logo.JPG";

export default function About() {
  return (
    <Box
      p={{ base: 4, md: 8 }}
      minH="100vh"
      textAlign="center"
      display="flex"
      alignItems="center"
      mb={16}
      justifyContent="center"
    >
      <VStack
        spacing={6}
        maxW="700px"
        mx="auto"
        bg="whiteAlpha.200"
        rounded="2xl"
        p={8}
        boxShadow="0 8px 20px rgba(0,0,0,0.3)"
      >
        <OptimizedImage
          src={logo}
          alt="Babel Trade Logo"
          width={120}
          height={120}
          style={{
            borderRadius: '50%',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            marginBottom: '8px'
          }}
        />

        <Heading fontSize={{ base: "2xl", md: "3xl" }} color="brand.gold">
          حول منصة Babel investment
        </Heading>

        <Text fontSize="lg" color="white">
          منصة <b style={{ color: "#ffd700" }}>Babel investment</b> هي منصة استثمارية مبتكرة تهدف إلى تمكين المستخدمين
          من تحقيق <b style={{ color: "#00FF7F" }}>دخل يومي </b> عبر نظام المهام والمستويات، مع واجهة سهلة الاستخدام
          وتجربة متكاملة للتحكم في المحفظة والإيداعات.
        </Text>

        <Text fontSize="md" color="whiteAlpha.900">
          تم تأسيس المنصة في <b style={{ color: "#ffd700" }}>يوليو 2024</b>، وهي مصممة لتوفير فرص ربحية عادلة
          لجميع المستخدمين حول العالم.
        </Text>

        <Text fontSize="md" color="whiteAlpha.900">
          نحن نلتزم بأعلى معايير <b style={{ color: "#00BFFF" }}>الأمان والشفافية</b> ونوفر دعمًا فنيًا متواصلًا
          لضمان تجربة موثوقة لكل مستثمر.
        </Text>

        <Text fontSize="sm" color="whiteAlpha.700" mt={4}>
          انضم إلينا اليوم وابدأ رحلتك الاستثمارية بثقة ونجاح!
        </Text>
      </VStack>
    </Box>
  );
}
