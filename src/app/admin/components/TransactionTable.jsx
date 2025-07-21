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
  const bgHover = useColorModeValue('gray.300', 'gray.700');
  const textColor = useColorModeValue('black', 'white');
  const secondaryText = useColorModeValue('gray.700', 'gray.300');
  const fontSize = { base: 'xs', md: 'sm', lg: 'md' };

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
    <Box mt={6} dir={ "rtl"  } overflowX="auto" w="full" maxW="100%">
      <Table w="full" maxW="100%" fontSize={fontSize} bg={bgTable}>
        <Thead bg={bgHeader}>
          <Tr>
            <Th color={secondaryText} fontSize={fontSize}>المستخدم</Th>
            <Th color={secondaryText} fontSize={fontSize} display={{ base: 'none', md: 'table-cell' }}>النوع</Th>
            <Th color={secondaryText} fontSize={fontSize}>المبلغ</Th>
            <Th color={secondaryText} fontSize={fontSize}>الحالة</Th>
            <Th color={secondaryText} fontSize={fontSize} display={{ base: 'none', md: 'table-cell' }}>المحفظة</Th>
            <Th color={secondaryText} fontSize={fontSize} display={{ base: 'none', md: 'table-cell' }}>الإثبات</Th>
            <Th color={secondaryText} fontSize={fontSize}>إجراءات</Th>
          </Tr>
        </Thead>
        <Tbody>
          {safeTransactions.length > 0 ? (
            safeTransactions.map((transaction, idx) => (
              <Tr key={transaction._id || idx} _hover={{ bg: bgHover }}>
                <Td fontWeight="medium" color={textColor} fontSize={fontSize} maxW={{ base: '80px', md: '160px' }} isTruncated>
                  <Tooltip label={transaction?.username || 'مستخدم غير معروف'}>
                    {transaction?.username || 'مستخدم غير معروف'}
                  </Tooltip>
                </Td>
                <Td fontSize={fontSize} color={textColor} display={{ base: 'none', md: 'table-cell' }}>
                  <Badge colorScheme={getTypeColor(transaction?.type)} variant="subtle">
                    {transaction?.type === 'deposit' ? 'إيداع' : transaction?.type === 'withdrawal' ? 'سحب' : transaction?.type || 'غير معروف'}
                  </Badge>
                </Td>
                <Td fontSize={fontSize} color={textColor} maxW={{ base: '60px', md: '100px' }} isTruncated>
                  <Text fontWeight="bold" color="blue.400" fontSize={fontSize}>
                    {transaction?.amount || 0}
                  </Text>
                </Td>
                <Td fontSize={fontSize} color={textColor}>
                  <Badge colorScheme={getStatusColor(transaction?.status)} variant="subtle">
                    {transaction?.status === 'pending' ? 'قيد المراجعة' :
                     transaction?.status === 'completed' ? 'تمت الموافقة' :
                     transaction?.status === 'rejected' ? 'مرفوض' : transaction?.status || 'غير معروف'}
                  </Badge>
                </Td>
                <Td fontSize={fontSize} color={textColor} display={{ base: 'none', md: 'table-cell' }} maxW="120px" isTruncated>
                  {transaction?.type === 'withdrawal' && transaction?.walletAddress ? (
                    <Tooltip label={transaction.walletAddress} placement="top">
                      <Text 
                        fontSize={fontSize}
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
                    <Text color="gray.400" fontSize={fontSize}>-</Text>
                  )}
                </Td>
                <Td fontSize={fontSize} color={textColor} display={{ base: 'none', md: 'table-cell' }}>
                  {transaction?.type === 'deposit' && transaction?.proofImage ? (
                    <Image
                      src={getImageUrl(transaction.proofImage)}
                      alt="الإثبات"
                      boxSize="36px"
                      objectFit="cover"
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => handleImageClick(getImageUrl(transaction.proofImage))}
                      _hover={{ transform: 'scale(1.05)' }}
                      transition="transform 0.2s"
                    />
                  ) : (
                    <Text color="gray.400" fontSize={fontSize}>-</Text>
                  )}
                </Td>
                <Td fontSize={fontSize} color={textColor}>
                  {transaction?.status === 'pending' ? (
                    isMobile ? (
                      <Menu>
                        <MenuButton 
                          as={Button} 
                          size="sm" 
                          rightIcon={<ChevronDownIcon />}
                        >
                          ...
                        </MenuButton>
                        <MenuList>
                          <MenuItem 
                            onClick={() => onReview(transaction?.userId, transaction?._id, 'completed')}
                            color="green.300"
                          >
                            موافقة
                          </MenuItem>
                          <MenuItem 
                            onClick={() => onReview(transaction?.userId, transaction?._id, 'rejected')}
                            color="red.300"
                          >
                            رفض
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    ) : (
                      <HStack spacing={2}>
                        <Button 
                          colorScheme="green" 
                          size="sm" 
                          onClick={() => onReview(transaction?.userId, transaction?._id, 'completed')}
                        >
                          موافقة
                        </Button>
                        <Button 
                          colorScheme="red" 
                          size="sm" 
                          onClick={() => onReview(transaction?.userId, transaction?._id, 'rejected')}
                        >
                          رفض
                        </Button>
                      </HStack>
                    )
                  ) : (
                    <Text color="gray.400" fontSize={fontSize}>-</Text>
                  )}
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={7} fontSize={fontSize} color={textColor}>
                <Text textAlign="center" color="gray.500" py={8} fontSize={fontSize}>
                  لا توجد معاملات.
                </Text>
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