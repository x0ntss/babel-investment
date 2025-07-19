"use client";
import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, useToast } from '@chakra-ui/react';
import TransactionTable from '../components/TransactionTable';
import { getTransactions, reviewTransaction } from '../api/admin';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const toast = useToast();

  const fetchTransactions = () => {
    setLoading(true);
    getTransactions()
      .then(setTransactions)
      .catch(err => setError(err.message || 'Failed to fetch transactions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleReview = async (userId, transactionId, status) => {
    setActionLoading(true);
    try {
      await reviewTransaction(userId, transactionId, status);
      toast({ title: `Transaction ${status}.`, status: 'success', duration: 2000 });
      fetchTransactions();
    } catch (err) {
      toast({ title: 'Action failed', description: err.message, status: 'error', duration: 3000 });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box px={{ base: 2, md: 4, lg: 8 }} py={{ base: 4, md: 8, lg: 12 }} bg="gray.900" minH="100vh" w="full" maxW="100%">
      <Box
        bg="gray.800"
        borderRadius="lg"
        boxShadow="md"
        p={{ base: 2, md: 4 }}
        mb={6}
        w="full"
        maxW="100%"
      >
        <Heading size="lg" mb={2} color="white" textAlign="right">
          إدارة المعاملات
        </Heading>
        <Text color="gray.400" fontSize="sm" mb={2} textAlign="right">
          جميع معاملات المستخدمين (إيداع وسحب)
        </Text>
      </Box>
      <Box overflowX="auto" w="full" maxW="100%">
        <TransactionTable transactions={transactions} onReview={handleReview} actionLoading={actionLoading} rtl tableFontSize={{ base: 'xs', md: 'sm', lg: 'md' }} />
      </Box>
      {loading && (
        <Box w="full" textAlign="center" py={8}>
          <Spinner color="blue.400" size="xl" thickness="4px" />
        </Box>
      )}
      {error && (
        <Box w="full" textAlign="center" py={8}>
          <Text color="red.400" fontSize="lg">{error}</Text>
        </Box>
      )}
    </Box>
  );
};

export default Transactions; 