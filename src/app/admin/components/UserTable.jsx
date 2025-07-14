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
  HStack,
  Stack,
  Link as ChakraLink,
  Badge,
  Tooltip,
  useBreakpointValue,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { ChevronDownIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { componentStyles } from '../theme';
import { getLevelAndIncome } from '../../utils/vipLevels';

const UserTable = ({ users, onUpdateBalance }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const formatWalletAddress = (address) => {
    if (!address) return '-';
    if (address.length <= 20) return address;
    return `${address.substring(0, 10)}...${address.substring(address.length - 10)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'pending': return 'yellow';
      case 'suspended': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box mt={6} overflowX="auto">
      <Table {...componentStyles.adminTable}>
        <Thead bg="gray.50">
          <Tr>
            <Th>Username</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Code</Th>
            <Th>Balance</Th>
            <Th>VIP Capital</Th>
            <Th>Daily Income</Th>
            <Th>Wallet Address</Th>
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
              <Tr key={user._id} _hover={{ bg: 'gray.50' }}>
                <Td fontWeight="medium">{user.username}</Td>
                <Td>{user.email}</Td>
                <Td>{user.phone || <Text color="gray.400">-</Text>}</Td>
                <Td>{user.code || <Text color="gray.400">-</Text>}</Td>
                <Td>
                  <Badge colorScheme="blue" variant="subtle">
                    {user.balance} USDT
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme="purple" variant="subtle">
                    {user.vipCapital ?? 0} USDT
                  </Badge>
                </Td>
                <Td>
                  {(() => {
                    const { dailyIncomeMin, dailyIncomeMax } = getLevelAndIncome(user.vipCapital ?? 0);
                    return (
                      <Text fontSize="sm" color="teal.700">
                        {dailyIncomeMin.toFixed(2)} - {dailyIncomeMax.toFixed(2)} USDT
                      </Text>
                    );
                  })()}
                </Td>
                <Td>
                  {user.walletAddress ? (
                    <Tooltip label={user.walletAddress} placement="top">
                      <Text
                        fontSize="xs"
                        fontFamily="mono"
                        color="green.600"
                        cursor="pointer"
                        maxW="120px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        {formatWalletAddress(user.walletAddress)}
                      </Text>
                    </Tooltip>
                  ) : (
                    <Text color="gray.400" fontSize="sm">-</Text>
                  )}
                </Td>
                <Td>{user.referralCode || <Text color="gray.400">-</Text>}</Td>
                <Td>
                  <Badge colorScheme="green" variant="subtle">
                    {user.completedTasks ?? 0}
                  </Badge>
                </Td>
                <Td>
                  {user.lastTaskDate ? (
                    <Text fontSize="xs">
                      {new Date(user.lastTaskDate).toLocaleDateString()}
                    </Text>
                  ) : (
                    <Text color="gray.400" fontSize="sm">-</Text>
                  )}
                </Td>
                <Td>
                  <Button
                    as={NextLink}
                    href={`/admin/team/${user._id}`}
                    size="sm"
                    colorScheme="teal"
                    variant="outline"
                    rightIcon={<ExternalLinkIcon />}
                    {...componentStyles.adminButton}
                  >
                    View Team
                  </Button>
                </Td>
                <Td>
                  {isMobile ? (
                    <Menu>
                      <MenuButton
                        as={Button}
                        size="sm"
                        rightIcon={<ChevronDownIcon />}
                        {...componentStyles.adminButton}
                      >
                        Actions
                      </MenuButton>
                      <MenuList>
                        <MenuItem
                          onClick={() => onUpdateBalance(user, 'add')}
                          color="green.600"
                        >
                          Add Balance
                        </MenuItem>
                        <MenuItem
                          onClick={() => onUpdateBalance(user, 'subtract')}
                          color="red.600"
                        >
                          Subtract Balance
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem
                          as={NextLink}
                          href={`/admin/team/${user._id}`}
                          icon={<ExternalLinkIcon />}
                        >
                          View Team
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  ) : (
                    <HStack spacing={2}>
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={() => onUpdateBalance(user, 'add')}
                        {...componentStyles.adminButton}
                      >
                        Add
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => onUpdateBalance(user, 'subtract')}
                        {...componentStyles.adminButton}
                      >
                        Subtract
                      </Button>
                    </HStack>
                  )}
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={11}>
                <Text textAlign="center" color="gray.500" py={8}>
                  No users found.
                </Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UserTable; 