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
  HStack, 
  Image, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalBody, 
  ModalCloseButton,
  ModalHeader,
  ModalFooter,
  Badge,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Spinner,
  Textarea,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const TransactionTable = ({ transactions, onReview, actionLoading }) => {
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionModal, setRejectionModal] = useState({ isOpen: false, transaction: null, reason: '' });
  
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

  const handleRejectClick = (transaction) => {
    setRejectionModal({ isOpen: true, transaction, reason: '' });
  };

  const handleRejectSubmit = () => {
    if (rejectionModal.transaction) {
      onReview(
        rejectionModal.transaction.userId, 
        rejectionModal.transaction._id, 
        'rejected', 
        rejectionModal.reason
      );
      setRejectionModal({ isOpen: false, transaction: null, reason: '' });
    }
  };

  const handleRejectCancel = () => {
    setRejectionModal({ isOpen: false, transaction: null, reason: '' });
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
    return `${process.env.REACT_APP_API_BASE || 'http://localhost:5000'}/${cleanPath}`;
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
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box w="100%" overflowX="auto" mt={6}>
      <Table variant="simple" size="sm" minW="800px">
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
                  <Tooltip label={transaction?.username || 'Unknown User'}>
                    <Text fontSize="xs" isTruncated maxW="100px">
                      {transaction?.username || 'Unknown User'}
                    </Text>
                  </Tooltip>
                </Td>
                <Td>
                  <Badge colorScheme={getTypeColor(transaction?.type)} fontSize="xs">
                    {transaction?.type === 'deposit' ? 'Deposit' : 
                     transaction?.type === 'withdrawal' ? 'Withdrawal' : 
                     transaction?.type === 'reward' ? 'Reward' : 
                     transaction?.type || 'Unknown'}
                  </Badge>
                </Td>
                <Td>
                  <Text fontWeight="bold" color="blue.400" fontSize="xs">
                    {transaction?.amount || 0}
                  </Text>
                </Td>
                <Td>
                  <Tooltip 
                    label={transaction?.status === 'rejected' && transaction?.rejectionReason ? 
                      `Rejection Reason: ${transaction.rejectionReason}` : 
                      transaction?.status === 'pending' ? 'Awaiting admin review' :
                      transaction?.status === 'completed' ? 'Transaction completed successfully' :
                      'Unknown status'
                    }
                    placement="top"
                  >
                    <Badge colorScheme={getStatusColor(transaction?.status)} fontSize="xs">
                      {transaction?.status === 'pending' ? 'Pending' :
                       transaction?.status === 'completed' ? 'Completed' :
                       transaction?.status === 'rejected' ? 'Rejected' : 
                       transaction?.status || 'Unknown'}
                    </Badge>
                  </Tooltip>
                </Td>
                <Td>
                  <Text fontSize="xs">
                    {formatDate(transaction?.createdAt)}
                  </Text>
                </Td>
                <Td>
                  {transaction?.type === 'withdrawal' && transaction?.walletAddress ? (
                    <Tooltip label={transaction.walletAddress} placement="top">
                      <Text 
                        fontSize="xs"
                        fontFamily="mono" 
                        color="green.300"
                        cursor="pointer"
                        maxW="120px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        {formatWalletAddress(transaction.walletAddress)}
                      </Text>
                    </Tooltip>
                  ) : (
                    <Text color="gray.400" fontSize="xs">-</Text>
                  )}
                </Td>
                <Td>
                  {transaction?.type === 'deposit' && transaction?.proofImage ? (
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
                    <Text color="gray.400" fontSize="xs">-</Text>
                  )}
                </Td>
                <Td>
                  {transaction?.status === 'pending' ? (
                    <HStack spacing={1}>
                      <Button
                        size="xs"
                        colorScheme="green"
                        onClick={() => onReview(transaction?.userId, transaction?._id, 'completed')}
                        isLoading={actionLoading}
                        loadingText="..."
                      >
                        Approve
                      </Button>
                      <Menu>
                        <MenuButton as={Button} size="xs" colorScheme="red">
                          Reject
                        </MenuButton>
                        <MenuList>
                          <MenuItem 
                            onClick={() => handleRejectClick(transaction)}
                            color="red.400"
                          >
                            Reject Transaction
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>
                  ) : (
                    <Text color="gray.400" fontSize="xs">-</Text>
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

      {/* Modal for rejection reason */}
      <Modal isOpen={rejectionModal.isOpen} onClose={handleRejectCancel} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Rejection Reason (Optional)</FormLabel>
              <Textarea
                value={rejectionModal.reason}
                onChange={(e) => setRejectionModal(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Enter reason for rejection..."
                rows={3}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleRejectCancel}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              onClick={handleRejectSubmit}
              isLoading={actionLoading}
              loadingText="Rejecting"
            >
              Reject Transaction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TransactionTable; 