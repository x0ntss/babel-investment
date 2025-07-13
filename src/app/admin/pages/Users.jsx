"use client";
import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, useToast } from '@chakra-ui/react';
import UserTable from '../components/UserTable';
import { getUsers, updateUserBalance } from '../api/admin';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const toast = useToast();

  const fetchUsers = () => {
    setLoading(true);
    getUsers()
      .then(setUsers)
      .catch(err => setError(err.message || 'Failed to fetch users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateBalance = async (user, action) => {
    const input = window.prompt(`Enter amount to ${action === 'add' ? 'add to' : 'subtract from'} ${user.username}'s balance:`);
    if (!input) return;
    const amount = parseFloat(input);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: 'Invalid amount', status: 'error', duration: 2000 });
      return;
    }
    setActionLoading(true);
    try {
      await updateUserBalance(user._id, action, amount);
      toast({ title: `Balance updated.`, status: 'success', duration: 2000 });
      fetchUsers();
    } catch (err) {
      toast({ title: 'Action failed', description: err.message, status: 'error', duration: 3000 });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box p={8}>
      <Heading size="lg" mb={4}>User Management</Heading>
      {loading ? <Spinner /> : error ? <Text color="red.500">{error}</Text> : <UserTable users={users} onUpdateBalance={handleUpdateBalance} actionLoading={actionLoading} />}
    </Box>
  );
};

export default Users; 