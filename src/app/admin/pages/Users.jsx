"use client";
import React, { useEffect, useState } from 'react';
import {
  Box, Table, Thead, Tbody, Tr, Th, Td, Button, Input, useToast, IconButton, Tooltip, Spinner, Center, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, NumberInput, NumberInputField, HStack
} from '@chakra-ui/react';
import { CopyIcon, AddIcon, MinusIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [balanceAction, setBalanceAction] = useState(null); // 'add' or 'deduct'
  const [amount, setAmount] = useState('');
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/users', {
      headers: {
        'Authorization': localStorage.getItem('adminToken') ? `Bearer ${localStorage.getItem('adminToken')}` : ''
      }
    })
      .then(async res => {
        if (res.status === 401) {
          setError('غير مصرح – يرجى تسجيل الدخول مرة أخرى');
          setUsers([]);
          setLoading(false);
          setTimeout(() => router.push('/admin'), 1500);
          return;
        }
        if (!res.ok) {
          const err = await res.text();
          setError('حدث خطأ: ' + err);
          setUsers([]);
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (!error) {
          setError('البيانات غير صالحة');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('فشل الاتصال بالخادم');
        setLoading(false);
      });
  }, []);

  const handleCopy = (wallet) => {
    navigator.clipboard.writeText(wallet);
    toast({ title: 'تم النسخ بنجاح', status: 'success', duration: 1500, isClosable: true, position: 'top' });
  };

  const openBalanceModal = (user, action) => {
    setSelectedUser(user);
    setBalanceAction(action);
    setAmount('');
    onOpen();
  };

  const handleBalanceSubmit = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast({ title: 'يرجى إدخال مبلغ صحيح', status: 'error' });
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${selectedUser._id}/balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('adminToken') ? `Bearer ${localStorage.getItem('adminToken')}` : ''
        },
        body: JSON.stringify({ action: balanceAction, amount: Number(amount) })
      });
      if (!res.ok) throw new Error('فشل تحديث الرصيد');
      toast({ title: 'تم تحديث الرصيد بنجاح', status: 'success' });
      setUsers(users => users.map(u => u._id === selectedUser._id ? { ...u, balance: balanceAction === 'add' ? u.balance + Number(amount) : u.balance - Number(amount) } : u));
      onClose();
    } catch {
      toast({ title: 'فشل تحديث الرصيد', status: 'error' });
    }
  };

  if (loading) {
    return <Center minH="60vh"><Spinner size="xl" color="blue.500" thickness="4px" /></Center>;
  }
  if (error) {
    return <Center minH="60vh"><Text color="red.500" fontSize="lg">{error}</Text></Center>;
  }

  return (
    <Box p={4}>
      <Input
        placeholder="بحث عن مستخدم..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        mb={4}
        size="lg"
        borderRadius="md"
        bg="gray.50"
        _placeholder={{ color: 'gray.400' }}
        textAlign="right"
      />
      <Box overflowX={{ base: 'auto', md: 'visible' }}>
        <Table variant="simple" size="md" bg="white" borderRadius="lg" boxShadow="md" minW="800px">
          <Thead>
            <Tr>
              <Th>اسم المستخدم</Th>
              <Th>البريد الإلكتروني</Th>
              <Th>رقم الجوال</Th>
              <Th>العنوان</Th>
              <Th>الرصيد</Th>
              <Th>رمز الإحالة</Th>
              <Th>إجراءات</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(users) && users.filter(u => u.username.includes(search) || u.email.includes(search)).map(user => (
              <Tr key={user._id}>
                <Td>{user.username}</Td>
                <Td>{user.email}</Td>
                <Td>{user.phone}</Td>
                <Td>
                  <Tooltip label="نسخ العنوان" aria-label="نسخ العنوان">
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(user.walletAddress)} rightIcon={<CopyIcon />}>
                      {user.walletAddress}
                    </Button>
                  </Tooltip>
                </Td>
                <Td>{user.balance}</Td>
                <Td>{user.referralCode}</Td>
                <Td>
                  <HStack spacing={1}>
                    <Tooltip label="إضافة رصيد">
                      <IconButton icon={<AddIcon />} size="sm" colorScheme="green" onClick={() => openBalanceModal(user, 'add')} />
                    </Tooltip>
                    <Tooltip label="خصم رصيد">
                      <IconButton icon={<MinusIcon />} size="sm" colorScheme="red" onClick={() => openBalanceModal(user, 'deduct')} />
                    </Tooltip>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{balanceAction === 'add' ? 'إضافة رصيد' : 'خصم رصيد'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>المستخدم: {selectedUser?.username}</Text>
            <NumberInput min={1} value={amount} onChange={setAmount} width="100%">
              <NumberInputField placeholder="أدخل المبلغ" textAlign="right" />
            </NumberInput>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleBalanceSubmit}>
              {balanceAction === 'add' ? 'إضافة' : 'خصم'}
            </Button>
            <Button onClick={onClose}>إلغاء</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 