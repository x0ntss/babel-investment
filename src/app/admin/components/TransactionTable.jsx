"use client";
import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Text, Button, HStack, Image, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from '@chakra-ui/react';

const TransactionTable = ({ transactions, onReview, rtl }) => {
  const [modalImage, setModalImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <Box mt={6} dir={rtl ? "rtl" : undefined}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>المستخدم</Th>
            <Th>النوع</Th>
            <Th>القيمة</Th>
            <Th>الحالة</Th>
            <Th>صورة الإثبات</Th>
            <Th>إجراءات</Th>
          </Tr>
        </Thead>
        <Tbody>
          {safeTransactions.length > 0 ? (
            safeTransactions.map((transaction, idx) => (
              <Tr key={transaction._id || idx}>
                <Td>{transaction?.username || 'Unknown User'}</Td>
                <Td>{transaction?.type === 'deposit' ? 'إيداع' : transaction?.type === 'withdrawal' ? 'سحب' : transaction?.type || 'Unknown'}</Td>
                <Td>{transaction?.amount || 0}</Td>
                <Td>{
                  transaction?.status === 'pending' ? 'قيد المراجعة' :
                  transaction?.status === 'completed' ? 'تمت الموافقة' :
                  transaction?.status === 'rejected' ? 'مرفوض' : transaction?.status || 'Unknown'
                }</Td>
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
                    />
                  ) : (
                    <Text color="gray.400" fontSize="sm">-</Text>
                  )}
                </Td>
                <Td>
                  {transaction?.status === 'pending' ? (
                    <HStack>
                      <Button colorScheme="green" size="sm" onClick={() => onReview(transaction?.userId, transaction?._id, 'completed')}>موافقة</Button>
                      <Button colorScheme="red" size="sm" onClick={() => onReview(transaction?.userId, transaction?._id, 'rejected')}>رفض</Button>
                    </HStack>
                  ) : (
                    <Text>-</Text>
                  )}
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={6}><Text>لا توجد معاملات.</Text></Td>
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
              <Image src={modalImage} alt="Deposit Proof Full" maxH="80vh" maxW="100%" m="auto" />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TransactionTable; 