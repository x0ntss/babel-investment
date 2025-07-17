import React from "react";
import { Box, Heading, SimpleGrid, Text, VStack, HStack, Icon, Badge, Card, CardBody } from "@chakra-ui/react";
import { FaCrown, FaCoins, FaChartLine, FaStar, FaTrophy } from "react-icons/fa";

// بيانات المستويات
const levelsData = [
  { level: 1, dailyIncome: "1 USDT", investment: "50 USDT", color: "brand.neonBlue" },
  { level: 2, dailyIncome: "2 USDT", investment: "100 USDT", color: "brand.neonGreen" },
  { level: 3, dailyIncome: "4 USDT", investment: "200 USDT", color: "brand.neonPurple" },
  { level: 4, dailyIncome: "8 USDT", investment: "400 USDT", color: "brand.neonOrange" },
  { level: 5, dailyIncome: "16 USDT", investment: "800 USDT", color: "brand.neonCyan" },
];

export default function Levels() {
  return (
    <Box p={{ base: 4, md: 8 }} minH="100vh" maxW="1200px" mx="auto" mb={20}>
      <VStack spacing={8} align="stretch">
        <Heading 
          fontSize={{ base: "3xl", md: "4xl" }} 
          textAlign="center"
          className="gradient-text"
          fontWeight="extrabold"
          letterSpacing="wider"
        >
          المستويات
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {levelsData.map((level) => (
            <Card
              key={level.level}
              bg="rgba(0, 0, 0, 0.6)"
              backdropFilter="blur(20px)"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.1)"
              borderRadius="xl"
              boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
              overflow="hidden"
              position="relative"
              _hover={{ 
                transform: "translateY(-8px)",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 212, 255, 0.2)",
                borderColor: level.color,
              }}
              transition="all 0.3s ease"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                bg: level.color,
                opacity: 0.8,
              }}
            >
              <CardBody p={6}>
                <VStack spacing={4} align="center">
                  {/* Level Badge */}
                  <Badge
                    colorScheme="blue"
                    variant="solid"
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontSize="lg"
                    fontWeight="bold"
                    bg={level.color}
                    color="black"
                    boxShadow={`0 0 15px ${level.color}40`}
                  >
                    <HStack spacing={2}>
                      <Icon as={FaCrown} />
                      <Text>المستوى {level.level}</Text>
                    </HStack>
                  </Badge>

                  {/* Level Content */}
                  <VStack spacing={3} align="stretch" w="full">
                    <HStack spacing={3} justify="center">
                      <Icon as={FaCoins} color="brand.neonGreen" boxSize={5} />
                      <Text fontSize="lg" color="white" fontWeight="bold">
                        الدخل اليومي: {level.dailyIncome}
                      </Text>
                    </HStack>
                    
                    <HStack spacing={3} justify="center">
                      <Icon as={FaChartLine} color="brand.neonBlue" boxSize={5} />
                      <Text fontSize="lg" color="gray.300">
                        مبلغ الاستثمار: {level.investment}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* Special indicator for higher levels */}
                  {level.level >= 4 && (
                    <HStack spacing={2} mt={2}>
                      <Icon as={FaStar} color="brand.neonOrange" boxSize={4} />
                      <Text fontSize="sm" color="brand.neonOrange" fontWeight="bold">
                        مستوى مميز
                      </Text>
                    </HStack>
                  )}
                  
                  {level.level === 5 && (
                    <HStack spacing={2} mt={2}>
                      <Icon as={FaTrophy} color="brand.neonCyan" boxSize={4} />
                      <Text fontSize="sm" color="brand.neonCyan" fontWeight="bold">
                        المستوى الأعلى
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
