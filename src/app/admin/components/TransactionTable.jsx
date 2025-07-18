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
  MenuDivider,
  useColorModeValue
} from '@chakra-ui/react';
import { ChevronDownIcon, ExternalLinkIcon } from '@chakra-ui/icons';

const TransactionTable = ({ transactions, onReview, rtl, tableFontSize }) => {
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const fontSize = tableFontSize || { base: 'xs', md: 'sm', lg: 'md' };
  const bgTable = useColorModeValue('gray.100', 'gray.800');
  const bgHeader = useColorModeValue('gray.200', 'gray.700');
  const bgHover = useColorModeValue('gray.300', 'gray.700');
  const textColor = useColorModeValue('black', 'white');
  const secondaryText = useColorModeValue('gray.700', 'gray.300');

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
    <Box mt={6} dir={rtl ? "rtl" : undefined} overflowX="auto" w="full" maxW="100%">
      <Table w="full" maxW="100%" fontSize={fontSize} bg={bgTable}>
        <Thead bg={bgHeader}>
          <Tr>
            <Th color={secondaryText} fontSize={fontSize}>User</Th>
            <Th color={secondaryText} fontSize={fontSize} display={{ base: 'none', md: 'table-cell' }}>Type</Th>
            <Th color={secondaryText} fontSize={fontSize}>Amount</Th>
            <Th color={secondaryText} fontSize={fontSize}>Status</Th>
            <Th color={secondaryText} fontSize={fontSize} display={{ base: 'none', md: 'table-cell' }}>Wallet</Th>
            <Th color={secondaryText} fontSize={fontSize} display={{ base: 'none', md: 'table-cell' }}>Proof</Th>
            <Th color={secondaryText} fontSize={fontSize}>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {safeTransactions.length > 0 ? (
            safeTransactions.map((transaction, idx) => (
              <Tr key={transaction._id || idx} _hover={{ bg: bgHover }}>
                <Td fontWeight="medium" color={textColor} fontSize={fontSize} maxW={{ base: '80px', md: '160px' }} isTruncated>
                  <Tooltip label={transaction?.username || 'Unknown User'}>
                    {transaction?.username || 'Unknown User'}
                  </Tooltip>
                </Td>
                <Td fontSize={fontSize} color={textColor} display={{ base: 'none', md: 'table-cell' }}>
                  <Badge colorScheme={getTypeColor(transaction?.type)} variant="subtle">
                    {transaction?.type === 'deposit' ? 'Dep' : transaction?.type === 'withdrawal' ? 'Wdr' : transaction?.type || 'Unknown'}
                  </Badge>
                </Td>
                <Td fontSize={fontSize} color={textColor} maxW={{ base: '60px', md: '100px' }} isTruncated>
                  <Text fontWeight="bold" color="blue.400" fontSize={fontSize}>
                    {transaction?.amount || 0}
                  </Text>
                </Td>
                <Td fontSize={fontSize} color={textColor}>
                  <Badge colorScheme={getStatusColor(transaction?.status)} variant="subtle">
                    {transaction?.status === 'pending' ? 'Pending' :
                     transaction?.status === 'completed' ? 'Done' :
                     transaction?.status === 'rejected' ? 'Rejected' : transaction?.status || 'Unknown'}
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
                      alt="Proof"
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
                            Approve
                          </MenuItem>
                          <MenuItem 
                            onClick={() => onReview(transaction?.userId, transaction?._id, 'rejected')}
                            color="red.300"
                          >
                            Reject
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
                          Approve
                        </Button>
                        <Button 
                          colorScheme="red" 
                          size="sm" 
                          onClick={() => onReview(transaction?.userId, transaction?._id, 'rejected')}
                        >
                          Reject
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
                  No transactions found.
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