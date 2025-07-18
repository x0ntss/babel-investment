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
    <Box px={{ base: 2, md: 4, lg: 8 }} py={{ base: 4, md: 8, lg: 12 }} bg="gray.900" minH="100vh" w="full" maxW="100%" dir="rtl">
      <Heading size="lg" mb={4} color="white">
        إدارة المعاملات
      </Heading>
      <Box overflowX="auto" w="full" maxW="100%">
        <TransactionTable transactions={transactions} onReview={handleReview} actionLoading={actionLoading} rtl tableFontSize={{ base: 'xs', md: 'sm', lg: 'md' }} />
      </Box>
      {loading && <Spinner color="blue.400" />}
      {error && <Text color="red.400">{error}</Text>}
    </Box>
  );
};

export default Transactions; 