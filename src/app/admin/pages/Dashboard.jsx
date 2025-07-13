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
    <Box p={8}>
      <Heading size="lg" mb={8}>Admin Dashboard</Heading>
      {loading ? <Spinner /> : error ? <Text color="red.500">{error}</Text> : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Stat p={6} shadow="md" borderRadius="lg" bg="white">
            <StatLabel>Total Users</StatLabel>
            <StatNumber>{stats.totalUsers}</StatNumber>
          </Stat>
          <Stat p={6} shadow="md" borderRadius="lg" bg="white">
            <StatLabel>Total Balance</StatLabel>
            <StatNumber>${stats.totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</StatNumber>
          </Stat>
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Dashboard; 