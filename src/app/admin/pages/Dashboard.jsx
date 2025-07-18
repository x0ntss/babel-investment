"use client";
import React, { useEffect, useState } from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Spinner, Text } from '@chakra-ui/react';
import { getAdminStats } from '../api/admin';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(err => setError(err.message || 'Failed to fetch stats'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box px={{ base: 4, md: 8, lg: 12 }} py={{ base: 6, md: 10, lg: 16 }} bg="gray.900" minH="100vh">
      <Heading size="lg" mb={8} color="white">
        Admin Dashboard
      </Heading>
      {loading ? <Spinner color="blue.400" /> : error ? <Text color="red.400">{error}</Text> : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Stat p={6} borderRadius="lg" boxShadow="md" bg="gray.800" textAlign="center">
            <StatLabel color="gray.300" fontWeight="bold">Total Users</StatLabel>
            <StatNumber color="white" fontSize="3xl">{stats.totalUsers}</StatNumber>
          </Stat>
          <Stat p={6} borderRadius="lg" boxShadow="md" bg="gray.800" textAlign="center">
            <StatLabel color="gray.300" fontWeight="bold">Total Balance</StatLabel>
            <StatNumber color="white" fontSize="3xl">${stats.totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</StatNumber>
          </Stat>
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Dashboard; 