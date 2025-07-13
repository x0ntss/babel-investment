"use client";
import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Text, Button, HStack, Stack, Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';

const UserTable = ({ users, onUpdateBalance }) => (
  <Box mt={6}>
    <Table variant="simple" size="sm">
      <Thead>
        <Tr>
          <Th>Username</Th>
          <Th>Email</Th>
          <Th>Phone</Th>
          <Th>Code</Th>
          <Th>Balance</Th>
          <Th>Referral Code</Th>
          <Th>Completed Tasks</Th>
          <Th>Last Task Date</Th>
          <Th>Team Members</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {users && users.length > 0 ? (
          users.map(user => (
            <Tr key={user._id}>
              <Td>{user.username}</Td>
              <Td>{user.email}</Td>
              <Td>{user.phone || <Text color="gray.400">-</Text>}</Td>
              <Td>{user.code || <Text color="gray.400">-</Text>}</Td>
              <Td>{user.balance}</Td>
              <Td>{user.referralCode || <Text color="gray.400">-</Text>}</Td>
              <Td>{user.completedTasks ?? <Text color="gray.400">-</Text>}</Td>
              <Td>{user.lastTaskDate ? new Date(user.lastTaskDate).toLocaleString() : <Text color="gray.400">-</Text>}</Td>
              <Td>
                <Button
                  as={NextLink}
                  href={`/admin/team/${user._id}`}
                  size="sm"
                  colorScheme="teal"
                  variant="link"
                >
                  رؤية أعضاء الفريق
                </Button>
              </Td>
              <Td>
                <HStack>
                  <Button colorScheme="green" size="sm" onClick={() => onUpdateBalance(user, 'add')}>Add</Button>
                  <Button colorScheme="red" size="sm" onClick={() => onUpdateBalance(user, 'subtract')}>Subtract</Button>
                </HStack>
              </Td>
            </Tr>
          ))
        ) : (
          <Tr>
            <Td colSpan={10}><Text>No users found.</Text></Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  </Box>
);

export default UserTable; 