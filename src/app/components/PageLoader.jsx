"use client";
import React from 'react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

const PageLoader = ({ message = "جاري التحميل..." }) => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(255, 255, 255, 0.9)"
      backdropFilter="blur(4px)"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text color="gray.600" fontSize="lg">
          {message}
        </Text>
      </VStack>
    </Box>
  );
};

export default PageLoader; 