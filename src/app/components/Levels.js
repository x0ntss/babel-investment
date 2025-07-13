import React from "react";
import { Box, Heading, SimpleGrid, Text, Stack } from "@chakra-ui/react";

// بيانات المستويات
const levelsData = [
  { level: 1, dailyIncome: "1 USDT", investment: "50 USDT" },
  { level: 2, dailyIncome: "2 USDT", investment: "100 USDT" },
  { level: 3, dailyIncome: "4 USDT", investment: "200 USDT" },
  { level: 4, dailyIncome: "8 USDT", investment: "400 USDT" },
  { level: 5, dailyIncome: "16 USDT", investment: "800 USDT" },
];

export default function Levels() {
  return (
    <Box p={8}>
      <Heading mb={6} textAlign="center">
        المستويات
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {levelsData.map((level) => (
          <Box
            key={level.level}
            p={6}
            bg="whiteAlpha.200"
            borderRadius="2xl"
            boxShadow="xl"
            transition="transform 0.3s"
            _hover={{ transform: "scale(1.05)" }}
            textAlign="center"
          >
            <Stack spacing={3}>
              <Text fontSize="2xl" fontWeight="bold">
                المستوى {level.level}
              </Text>
              <Text fontSize="lg">💰 الدخل اليومي: {level.dailyIncome}</Text>
              <Text fontSize="lg">💵 مبلغ الاستثمار: {level.investment}</Text>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
