"use client";
import React, { useState } from 'react';
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
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Image
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const TransactionTable = ({ transactions, onReview }) => {
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bgTable = useColorModeValue('gray.100', 'gray.800');
  const bgHeader = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('black', 'white');

  // Safety check for transactions data
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const handleImageClick = (imgUrl) => {
    setModalImage(imgUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  // Helper to get full image URL or base64
  const getImageUrl = (proofImage) => {
    if (!proofImage) return null;
    if (proofImage.startsWith('data:')) return proofImage; // base64
    // Remove any leading slashes and ensure /uploads/ prefix
    let cleanPath = proofImage.replace(/^\/+/, '');
    if (!cleanPath.startsWith('uploads/')) {
      cleanPath = 'uploads/' + cleanPath;
    }
    return `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000'}/${cleanPath}`;
  };

  const formatWalletAddress = (address) => {
    if (!address) return '-';
    if (address.length <= 20) return address;
    return `${address.substring(0, 10)}...${address.substring(address.length - 10)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'yellow';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'deposit': return 'blue';
      case 'withdrawal': return 'orange';
      case 'reward': return 'purple';
      default: return 'gray';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box w="100%" overflowX="auto" mt={6}>
      <Table variant="simple" size="sm" minW="900px">
        <Thead bg={bgHeader}>
          <Tr>
            <Th>User</Th>
            <Th>Type</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
            <Th>Date</Th>
            <Th>Wallet</Th>
            <Th>Proof</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody bg={bgTable} color={textColor}>
          {safeTransactions.length > 0 ? (
            safeTransactions.map((transaction, idx) => (
              <Tr key={transaction._id || idx}>
                <Td>
                  <Tooltip label={transaction.username || 'Unknown User'}>
                    <Text fontSize="xs" isTruncated maxW="120px">
                      {transaction.username || 'Unknown User'}
                    </Text>
                  </Tooltip>
                </Td>
                <Td>
                  <Badge colorScheme={getTypeColor(transaction.type)} fontSize="xs">
                    {transaction.type === 'deposit' ? 'Deposit' : 
                     transaction.type === 'withdrawal' ? 'Withdrawal' : 
                     transaction.type === 'reward' ? 'Reward' : 
                     transaction.type || 'Unknown'}
                  </Badge>
                </Td>
                <Td>
                  <Text fontSize="xs" fontWeight="bold" color="blue.400">
                    {transaction.amount || 0}
                  </Text>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(transaction.status)} fontSize="xs">
                    {transaction.status === 'pending' ? 'Pending' :
                     transaction.status === 'completed' ? 'Completed' :
                     transaction.status === 'rejected' ? 'Rejected' : 
                     transaction.status || 'Unknown'}
                  </Badge>
                </Td>
                <Td>
                  <Text fontSize="xs" color="gray.600">
                    {formatDate(transaction.createdAt)}
                  </Text>
                </Td>
                <Td>
                  {transaction.type === 'withdrawal' ? (
                    <Tooltip label={transaction.walletAddress || 'No wallet address set'}>
                      <Text fontSize="xs" fontFamily="mono" color="green.500" maxW="100px" isTruncated>
                        {transaction.walletAddress ? formatWalletAddress(transaction.walletAddress) : 'No address'}
                      </Text>
                    </Tooltip>
                  ) : (
                    <Text fontSize="xs" color="gray.400">-</Text>
                  )}
                </Td>
                <Td>
                  {transaction.type === 'deposit' && transaction.proofImage ? (
                    <Image
                      src={getImageUrl(transaction.proofImage)}
                      alt="Proof"
                      boxSize="32px"
                      objectFit="cover"
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => handleImageClick(getImageUrl(transaction.proofImage))}
                      _hover={{ transform: 'scale(1.05)' }}
                      transition="transform 0.2s"
                    />
                  ) : (
                    <Text fontSize="xs" color="gray.400">-</Text>
                  )}
                </Td>
                <Td>
                  {transaction.status === 'pending' ? (
                    <Menu>
                      <MenuButton as={Button} size="xs" colorScheme="gray">
                        Actions
                      </MenuButton>
                      <MenuList>
                        <MenuItem 
                          onClick={() => onReview(transaction.userId, transaction._id, 'completed')}
                          color="green.400"
                        >
                          Approve
                        </MenuItem>
                        <MenuItem 
                          onClick={() => onReview(transaction.userId, transaction._id, 'rejected')}
                          color="red.400"
                        >
                          Reject
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  ) : (
                    <Text fontSize="xs" color="gray.400">-</Text>
                  )}
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={8} textAlign="center" py={4} fontSize="sm" color="gray.500">
                No transactions found.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      
      {/* Modal for full-size image */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={0} display="flex" alignItems="center" justifyContent="center">
            {modalImage && (
              <Image 
                src={modalImage} 
                alt="Deposit Proof Full" 
                maxH="80vh" 
                maxW="100%" 
                m="auto" 
                borderRadius="md"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TransactionTable; 