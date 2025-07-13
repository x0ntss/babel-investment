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
    <Box p={8} dir="rtl">
      <Heading size="lg" mb={4}>إدارة المعاملات</Heading>
      {loading ? <Spinner /> : error ? <Text color="red.500">{error}</Text> : <TransactionTable transactions={transactions} onReview={handleReview} actionLoading={actionLoading} rtl />}
    </Box>
  );
};

export default Transactions; 