"use client";
import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, useToast, Container } from '@chakra-ui/react';
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
      toast({ 
        title: `Transaction ${status}.`, 
        status: 'success', 
        duration: 2000 
      });
      fetchTransactions();
    } catch (err) {
      toast({ 
        title: 'Action failed', 
        description: err.message, 
        status: 'error', 
        duration: 3000 
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading size="lg" mb={6}>
        Transactions Management
      </Heading>
      
      {loading ? (
        <Box textAlign="center" py={8}>
          <Spinner size="lg" color="blue.500" />
          <Text mt={4} color="gray.600">Loading transactions...</Text>
        </Box>
      ) : error ? (
        <Box textAlign="center" py={8}>
          <Text color="red.500">{error}</Text>
        </Box>
      ) : (
        <TransactionTable 
          transactions={transactions} 
          onReview={handleReview} 
        />
      )}
    </Container>
  );
};

export default Transactions; 