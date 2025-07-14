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
  Badge,
  Tooltip,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider
} from '@chakra-ui/react';
import { ChevronDownIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { componentStyles } from '../theme';

const TransactionTable = ({ transactions, onReview, rtl }) => {
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

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
      default: return 'gray';
    }
  };

  return (
    <Box mt={6} dir={rtl ? "rtl" : undefined} overflowX="auto">
      <Table {...componentStyles.adminTable}>
        <Thead bg="gray.50">
          <Tr>
            <Th>المستخدم</Th>
            <Th>النوع</Th>
            <Th>القيمة</Th>
            <Th>الحالة</Th>
            <Th>عنوان المحفظة</Th>
            <Th>صورة الإثبات</Th>
            <Th>إجراءات</Th>
          </Tr>
        </Thead>
        <Tbody>
          {safeTransactions.length > 0 ? (
            safeTransactions.map((transaction, idx) => (
              <Tr key={transaction._id || idx} _hover={{ bg: 'gray.50' }}>
                <Td fontWeight="medium">{transaction?.username || 'Unknown User'}</Td>
                <Td>
                  <Badge colorScheme={getTypeColor(transaction?.type)} variant="subtle">
                    {transaction?.type === 'deposit' ? 'إيداع' : transaction?.type === 'withdrawal' ? 'سحب' : transaction?.type || 'Unknown'}
                  </Badge>
                </Td>
                <Td>
                  <Text fontWeight="bold" color="blue.600">
                    {transaction?.amount || 0} USDT
                  </Text>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(transaction?.status)} variant="subtle">
                    {transaction?.status === 'pending' ? 'قيد المراجعة' :
                     transaction?.status === 'completed' ? 'تمت الموافقة' :
                     transaction?.status === 'rejected' ? 'مرفوض' : transaction?.status || 'Unknown'}
                  </Badge>
                </Td>
                <Td>
                  {transaction?.type === 'withdrawal' && transaction?.walletAddress ? (
                    <Tooltip label={transaction.walletAddress} placement="top">
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
                        {formatWalletAddress(transaction.walletAddress)}
                      </Text>
                    </Tooltip>
                  ) : (
                    <Text color="gray.400" fontSize="sm">-</Text>
                  )}
                </Td>
                <Td>
                  {transaction?.type === 'deposit' && transaction?.proofImage ? (
                    <Image
                      src={getImageUrl(transaction.proofImage)}
                      alt="صورة الإثبات"
                      boxSize="50px"
                      objectFit="cover"
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => handleImageClick(getImageUrl(transaction.proofImage))}
                      _hover={{ transform: 'scale(1.05)' }}
                      transition="transform 0.2s"
                    />
                  ) : (
                    <Text color="gray.400" fontSize="sm">-</Text>
                  )}
                </Td>
                <Td>
                  {transaction?.status === 'pending' ? (
                    isMobile ? (
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
                            onClick={() => onReview(transaction?.userId, transaction?._id, 'completed')}
                            color="green.600"
                          >
                            موافقة
                          </MenuItem>
                          <MenuItem 
                            onClick={() => onReview(transaction?.userId, transaction?._id, 'rejected')}
                            color="red.600"
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
                          {...componentStyles.adminButton}
                        >
                          موافقة
                        </Button>
                        <Button 
                          colorScheme="red" 
                          size="sm" 
                          onClick={() => onReview(transaction?.userId, transaction?._id, 'rejected')}
                          {...componentStyles.adminButton}
                        >
                          رفض
                        </Button>
                      </HStack>
                    )
                  ) : (
                    <Text color="gray.400">-</Text>
                  )}
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={7}>
                <Text textAlign="center" color="gray.500" py={8}>
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
    </Box>
  );
};

export default TransactionTable; 