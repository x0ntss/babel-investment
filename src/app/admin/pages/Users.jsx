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
    return <Center minH="60vh"><Spinner size="xl" color="blue.400" thickness="4px" /></Center>;
  }
  if (error) {
    return <Center minH="60vh"><Text color="red.400" fontSize="lg">{error}</Text></Center>;
  }

  return (
    <Box px={{ base: 2, md: 4, lg: 8 }} py={{ base: 4, md: 8, lg: 12 }} bg="gray.900" minH="100vh" w="full" maxW="100%">
      <Input
        placeholder="بحث عن مستخدم..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        mb={4}
        size="lg"
        borderRadius="lg"
        bg="gray.800"
        color="white"
        _placeholder={{ color: 'gray.400' }}
        textAlign="right"
        boxShadow="md"
        w="full"
        maxW="100%"
      />
      <Box overflowX="auto" w="full" maxW="100%">
        <Table variant="simple" size="md" bg="gray.800" borderRadius="lg" boxShadow="md" w="full" maxW="100%" fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}>
          <Thead bg="gray.700">
            <Tr>
              <Th color="gray.300" fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}>اسم المستخدم</Th>
              <Th color="gray.300" fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}>البريد الإلكتروني</Th>
              <Th color="gray.300" fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}>رقم الجوال</Th>
              <Th color="gray.300" fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}>العنوان</Th>
              <Th color="gray.300" fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}>الرصيد</Th>
              <Th color="gray.300" fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}>رمز الإحالة</Th>
              <Th color="gray.300" fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}>إجراءات</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(users) && users.filter(u => u.username.includes(search) || u.email.includes(search)).map(user => (
              <Tr key={user._id} _hover={{ bg: 'gray.700' }}>
                <Td color="white" fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}>{user.username}</Td>
                <Td color="white" fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}>{user.email}</Td>
                <Td color="white" fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}>{user.phone}</Td>
                <Td fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}>
                  <Tooltip label="نسخ العنوان" aria-label="نسخ العنوان">
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(user.walletAddress)} rightIcon={<CopyIcon />} color="blue.400">
                      {user.walletAddress}
                    </Button>
                  </Tooltip>
                </Td>
                <Td color="white" fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}>{user.balance}</Td>
                <Td color="white" fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}>{user.referralCode}</Td>
                <Td fontSize={{ base: 'xs', md: 'sm', lg: 'md' }}>
                  <HStack spacing={1}>
                    <Tooltip label="إضافة رصيد">
                      <IconButton icon={<AddIcon />} size="sm" colorScheme="green" onClick={() => openBalanceModal(user, 'add')} boxShadow="md" />
                    </Tooltip>
                    <Tooltip label="خصم رصيد">
                      <IconButton icon={<MinusIcon />} size="sm" colorScheme="red" onClick={() => openBalanceModal(user, 'deduct')} boxShadow="md" />
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
        <ModalContent bg="gray.800" color="white" boxShadow="md" borderRadius="lg" border="1px solid" borderColor="gray.700">
          <ModalHeader>{balanceAction === 'add' ? 'إضافة رصيد' : 'خصم رصيد'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2} color="white">المستخدم: {selectedUser?.username}</Text>
            <NumberInput min={1} value={amount} onChange={setAmount} width="100%">
              <NumberInputField placeholder="أدخل المبلغ" textAlign="right" />
            </NumberInput>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleBalanceSubmit} boxShadow="md">
              {balanceAction === 'add' ? 'إضافة' : 'خصم'}
            </Button>
            <Button onClick={onClose}>إلغاء</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 