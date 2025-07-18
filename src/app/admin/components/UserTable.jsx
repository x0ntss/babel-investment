"use client";
import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Button,
  Badge,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  HStack
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const UserTable = ({ users, onUpdateBalance }) => {
  const bgTable = useColorModeValue('gray.100', 'gray.800');
  const bgHeader = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('black', 'white');

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'pending': return 'yellow';
      case 'suspended': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box w="100%" overflowX="auto" mt={6}>
      <Table variant="simple" size="sm" minW="800px">
        <Thead bg={bgHeader}>
          <Tr>
            <Th>User</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Balance</Th>
            <Th>VIP</Th>
            <Th>Ref Code</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody bg={bgTable} color={textColor}>
          {users && users.length > 0 ? (
            users.map(user => (
              <Tr key={user._id}>
                <Td>
                  <Tooltip label={user.username}>
                    <Text fontSize="xs" isTruncated>{user.username}</Text>
                  </Tooltip>
                </Td>
                <Td>
                  <Tooltip label={user.email}>
                    <Text fontSize="xs" isTruncated>{user.email}</Text>
                  </Tooltip>
                </Td>
                <Td>
                  <Text fontSize="xs">{user.phone || '-'}</Text>
                </Td>
                <Td>
                  <Badge colorScheme="blue" fontSize="xs">{user.balance}</Badge>
                </Td>
                <Td>
                  <Badge colorScheme="purple" fontSize="xs">{user.vipCapital ?? 0}</Badge>
                </Td>
                <Td>
                  <Text fontSize="xs">{user.referralCode || '-'}</Text>
                </Td>
                <Td>
                  <HStack spacing={1}>
                    <Button
                      as={NextLink}
                      href={`/admin/team/${user._id}`}
                      size="xs"
                      colorScheme="teal"
                      variant="outline"
                      rightIcon={<ExternalLinkIcon />}
                    >
                      Team
                    </Button>
                    <Menu>
                      <MenuButton as={Button} size="xs" colorScheme="gray">
                        ...
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => onUpdateBalance(user, 'add')} color="green.400">Add Balance</MenuItem>
                        <MenuItem onClick={() => onUpdateBalance(user, 'subtract')} color="red.400">Subtract Balance</MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={7} textAlign="center" py={4} fontSize="sm" color="gray.500">
                No users found.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UserTable;
