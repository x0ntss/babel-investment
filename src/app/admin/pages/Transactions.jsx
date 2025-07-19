"use client";
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Spinner, 
  useToast, 
  Alert, 
  AlertIcon,
  Flex,
  Button,
  useColorModeValue,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import TransactionTable from '../components/TransactionTable';
import { getTransactions, reviewTransaction } from '../api/admin';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const toast = useToast();
  
  // Calculate statistics
  const stats = {
    total: transactions.length,
    pending: transactions.filter(t => t.status === 'pending').length,
    completed: transactions.filter(t => t.status === 'completed').length,
    rejected: transactions.filter(t => t.status === 'rejected').length,
    totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
    pendingAmount: transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + (t.amount || 0), 0)
  };
  
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch transactions');
      toast({
        title: 'Error',
        description: err.message || 'Failed to fetch transactions',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleReview = async (userId, transactionId, status, reason) => {
    setActionLoading(true);
    try {
      await reviewTransaction(userId, transactionId, status, reason);
      toast({ 
        title: `Transaction ${status} successfully`, 
        status: 'success', 
        duration: 3000,
        isClosable: true,
      });
      fetchTransactions(); // Refresh the list
    } catch (err) {
      toast({ 
        title: 'Action failed', 
        description: err.message, 
        status: 'error', 
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTransactions();
  };

  return (
    <Box 
      px={{ base: 4, md: 6, lg: 8 }} 
      py={{ base: 6, md: 8 }} 
      bg={bgColor} 
      minH="100vh" 
      w="full"
    >
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color={textColor}>
          Transactions Management
        </Heading>
        <Button
          leftIcon={<RepeatIcon />}
          onClick={handleRefresh}
          isLoading={loading}
          loadingText="Refreshing"
          size="sm"
          colorScheme="blue"
          variant="outline"
        >
          Refresh
        </Button>
      </Flex>

      {error && (
        <Alert status="error" mb={4} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {!loading && transactions.length > 0 && (
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
          <Stat>
            <StatLabel>Total Transactions</StatLabel>
            <StatNumber color="blue.400">{stats.total}</StatNumber>
            <StatHelpText>All time</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Pending</StatLabel>
            <StatNumber color="yellow.400">{stats.pending}</StatNumber>
            <StatHelpText>Awaiting review</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Completed</StatLabel>
            <StatNumber color="green.400">{stats.completed}</StatNumber>
            <StatHelpText>Successfully processed</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Total Amount</StatLabel>
            <StatNumber color="purple.400">${stats.totalAmount.toFixed(2)}</StatNumber>
            <StatHelpText>All transactions</StatHelpText>
          </Stat>
        </SimpleGrid>
      )}

      {loading ? (
        <Flex justify="center" align="center" py={12}>
          <Spinner size="lg" color="blue.400" />
          <Text ml={3} color={textColor}>Loading transactions...</Text>
        </Flex>
      ) : (
        <TransactionTable 
          transactions={transactions} 
          onReview={handleReview} 
          actionLoading={actionLoading}
        />
      )}

      {!loading && !error && transactions.length === 0 && (
        <Box textAlign="center" py={12}>
          <Text color="gray.500" fontSize="lg">
            No transactions found
          </Text>
          <Text color="gray.400" fontSize="sm" mt={2}>
            Transactions will appear here once users make deposits or withdrawals
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Transactions; 