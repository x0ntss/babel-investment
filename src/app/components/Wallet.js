"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Input,
  useToast,
  Flex,
  Spinner,
  Center,
} from "@chakra-ui/react";
import OptimizedImage from "./OptimizedImage";
// Images are now served from public folder
const qrImage = "/images/qr.JPG";
const trxLogo = "/images/trx.png";
import { getCurrentUser, requestDeposit, requestWithdrawal, updateWalletAddress, isValidTronAddress, getWithdrawalConfig } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { formatUSDT, formatRange } from "../utils/numberFormat";

export default function Wallet() {
  const depositDisclosure = useDisclosure();
  const withdrawDisclosure = useDisclosure();
  const toast = useToast();
  const [depositProof, setDepositProof] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletInput, setWalletInput] = useState("");
  const [walletError, setWalletError] = useState("");
  const [withdrawalConfig, setWithdrawalConfig] = useState(null);
  const { refreshUser } = useAuth();
  const pollingRef = useRef(null);

  const fetchUser = () => {
    setLoading(true);
    Promise.all([
      getCurrentUser(),
      getWithdrawalConfig()
    ])
      .then(([userData, configData]) => {
        console.log('User data received:', userData); // Debug log
        setUser(userData);
        setWithdrawalConfig(configData);
      })
      .catch(err => setError(err.message || "Failed to fetch user info"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Wallet address validation
  const validateWallet = isValidTronAddress;

  const handleWalletSave = async () => {
    if (!validateWallet(walletInput)) {
      setWalletError("العنوان غير صالح. يجب أن يبدأ بـ T ويكون 34 حرفًا (TRON TRC20).");
      return;
    }
    setWalletError("");
    setActionLoading(true);
    try {
      await updateWalletAddress(walletInput);
      toast({ title: "تم تحديث عنوان المحفظة", status: "success", duration: 3000, isClosable: true });
      setWalletModalOpen(false);
      fetchUser();
    } catch (err) {
      setWalletError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendDeposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال مبلغ إيداع صالح.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!depositProof) {
      toast({
        title: "خطأ",
        description: "يرجى رفع دليل الإيداع (صورة).",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // Validate file type and size (max 5MB, image only)
    if (depositProof.size > 5 * 1024 * 1024) {
      toast({
        title: "خطأ",
        description: "حجم الصورة يجب أن يكون أقل من 5 ميجابايت.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!depositProof.type.startsWith("image/")) {
      toast({
        title: "خطأ",
        description: "يجب رفع صورة فقط كدليل إيداع.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setActionLoading(true);
    try {
      // Convert file to base64
      const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const proofBase64 = await fileToBase64(depositProof);
      await requestDeposit(Number(depositAmount), proofBase64);
    toast({
      title: "تم إرسال الإيداع",
      description: "جاري معالجة طلب الإيداع الخاص بك.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    setDepositProof(null);
      setDepositAmount("");
    depositDisclosure.onClose();
      await refreshUser();
      fetchUser();
      // Start polling for balance update
      if (user) {
        const initialBalance = user.balance;
        if (pollingRef.current) clearInterval(pollingRef.current);
        pollingRef.current = setInterval(async () => {
          const fresh = await refreshUser();
          if (fresh && fresh.balance > initialBalance) {
            fetchUser();
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            toast({ title: "تمت الموافقة على الإيداع! تم تحديث رصيدك.", status: "success", duration: 4000, isClosable: true });
          }
        }, 5000);
      }
    } catch (err) {
      toast({ title: "فشل الإيداع", description: err.message, status: "error", duration: 4000 });
    } finally {
      setActionLoading(false);
    }
  };

  // Withdrawal address logic
  useEffect(() => {
    if (user && user.walletAddress) {
      setWithdrawAddress(user.walletAddress);
    }
  }, [user]);

  const handleSendWithdraw = async () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال مبلغ سحب صالح.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Validate against maximum withdrawal amount
    if (withdrawalConfig && Number(withdrawAmount) > withdrawalConfig.maxWithdrawalAmount) {
      toast({
        title: "خطأ",
        description: `لا يمكن سحب أكثر من ${formatUSDT(withdrawalConfig.maxWithdrawalAmount)}. الحد الأقصى للسحب المتاح.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (!withdrawAddress || !validateWallet(withdrawAddress)) {
      toast({
        title: "خطأ",
        description: "يرجى إضافة عنوان محفظة TRON (TRC20) صالح قبل السحب.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setActionLoading(true);
    try {
      await requestWithdrawal(Number(withdrawAmount), withdrawAddress);
    toast({
      title: "تم إرسال طلب السحب",
      description: "سيتم معالجة طلبك قريبًا.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    setWithdrawAmount("");
    setWithdrawAddress("");
    withdrawDisclosure.onClose();
      fetchUser();
    } catch (err) {
      toast({ title: "فشل السحب", description: err.message, status: "error", duration: 4000 });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Center minH="60vh"><Spinner color="brand.neonBlue" size="xl" /></Center>;
  if (error) return <Center minH="60vh"><Text color="brand.error">{error}</Text></Center>;

  return (
    <Box p={{ base: 4, md: 8 }} minH="100vh">
      <Heading mb={4} textAlign="center" fontSize={{ base: "2xl", md: "3xl" }} className="gradient-text">
        لوحة تحكم المحفظة
      </Heading>

      <Text mb={8} fontSize="lg" textAlign="center" color="white">
        مرحبًا <b>{user.username}</b> في محفظتك الخاصة 👋
      </Text>

      {/* Wallet Address Section */}
      <Box bg="brand.glass" rounded="xl" p={{ base: 2, md: 6 }} mb={8} maxW={{ base: '100%', md: '600px' }} mx="auto" boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)" border="1px solid" borderColor="brand.glassBorder">
        <Flex align="center" justify="space-between">
          <Box>
            <Text fontWeight="bold" fontSize="lg" mb={1} color="white">عنوان المحفظة المرتبط:</Text>
            <Text fontSize="md" color={user.walletAddress ? "brand.neonGreen" : "gray.400"} wordBreak="break-all">
              {user.walletAddress || "لم يتم ربط عنوان بعد"}
            </Text>
          </Box>
          {!user.walletAddress && (
            <Button variant="neon" onClick={() => { setWalletInput(""); setWalletModalOpen(true); }}>
              إضافة عنوان
            </Button>
          )}
        </Flex>
      </Box>

      {/* Wallet Address Modal */}
      <Modal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent maxW={{ base: '95vw', md: '500px' }}>
          <ModalHeader>تحديث عنوان المحفظة</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="T..."
              value={walletInput}
              onChange={e => setWalletInput(e.target.value)}
              isInvalid={!!walletError}
              mb={2}
              dir="ltr"
              isDisabled={!!user.walletAddress}
            />
            {walletError && <Text color="red.500" fontSize="sm">{walletError}</Text>}
            <Text fontSize="sm" color="gray.500" mt={2}>
              يجب أن يبدأ بـ T ويكون 34 حرفًا (محفظة TRON TRC20)
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleWalletSave} isLoading={actionLoading} isDisabled={!!user.walletAddress}>
              حفظ
            </Button>
            <Button variant="ghost" onClick={() => setWalletModalOpen(false)}>إلغاء</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Stats Cards - 2-Column Grid Layout */}
      <Grid 
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(2, 1fr)" }} 
        gap={6} 
        mb={10}
        maxW="1200px"
        mx="auto"
      >
        {/* Capital Card */}
        <GridItem 
          bg="brand.glass" 
          rounded="xl" 
          p={{ base: 4, md: 6 }} 
          textAlign="center" 
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)" 
          border="1px solid"
          borderColor="brand.glassBorder"
          className="glow"
        >
          <Stat>
            <StatLabel fontSize="lg" mb={2} color="white">رأس المال</StatLabel>
            <StatNumber fontSize="2xl" color="brand.neonBlue">{formatUSDT(user.balance)}</StatNumber>
          </Stat>
        </GridItem>

        {/* Daily Income Card */}
        <GridItem 
          bg="brand.glass" 
          rounded="xl" 
          p={{ base: 4, md: 6 }} 
          textAlign="center" 
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)" 
          border="1px solid"
          borderColor="brand.glassBorder"
          className="glow"
        >
          <Stat>
            <StatLabel fontSize="lg" mb={2} color="white">الدخل اليومي المتوقع</StatLabel>
            <StatNumber fontSize="2xl" color="brand.neonGreen">
              {formatRange(user.dailyIncomeMin, user.dailyIncomeMax)}
            </StatNumber>
            <Text fontSize="sm" color="gray.300">({user.percentRange ? `${user.percentRange[0]}% - ${user.percentRange[1]}%` : "-"})</Text>
          </Stat>
        </GridItem>

        {/* Current Level Card */}
        <GridItem 
          bg="brand.glass" 
          rounded="xl" 
          p={{ base: 4, md: 6 }} 
          textAlign="center" 
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)" 
          border="1px solid"
          borderColor="brand.glassBorder"
          className="glow"
        >
          <Stat>
            <StatLabel fontSize="lg" mb={2} color="white">المستوى الحالي</StatLabel>
            <StatNumber fontSize="2xl" color="brand.neonPurple">{user.level ? `المستوى ${user.level}` : "-"}</StatNumber>
          </Stat>
        </GridItem>

        {/* Maximum Withdrawal Card */}
        {withdrawalConfig && (
          <GridItem 
            bg="brand.glass" 
            rounded="xl" 
            p={{ base: 4, md: 6 }} 
            textAlign="center" 
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)" 
            border="1px solid"
            borderColor="brand.glassBorder"
            className="glow"
          >
            <Stat>
              <StatLabel fontSize="lg" mb={2} color="white">الحد الأقصى للسحب المتاح</StatLabel>
              <StatNumber fontSize="2xl" color="brand.warning">
                {formatUSDT(withdrawalConfig.maxWithdrawalAmount)}
              </StatNumber>
            </Stat>
          </GridItem>
        )}
      </Grid>

      {/* Summary Card - Full Width */}
   

      {/* Action Buttons */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mb={10} maxW={{ base: '100%', md: '600px' }} mx="auto">
        <Button variant="solid" size="lg" w="100%" onClick={depositDisclosure.onOpen} className="glow">
          إيداع
        </Button>
        <Button variant="outline" colorScheme="red" size="lg" w="100%" onClick={withdrawDisclosure.onOpen} className="glow">
          سحب
        </Button>
      </Grid>

      {/* Transactions Table */}
      <Box bg="brand.glass" mb={16} rounded="xl" p={{ base: 2, md: 6 }} w="100%" maxW={{ base: '100%', md: '1000px' }} mx="auto" boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)" border="1px solid" borderColor="brand.glassBorder">
        <Heading fontSize="xl" mb={4} textAlign="center" color="white">سجل السحوبات والإيداعات</Heading>
        <Box overflowX="auto">
          <Table variant="simple" size="md" minW="350px">
            <Thead bg="rgba(255, 255, 255, 0.1)">
              <Tr>
                <Th textAlign="center" color="white">التاريخ</Th>
                <Th textAlign="center" color="white">النوع</Th>
                <Th textAlign="center" color="white">القيمة</Th>
                <Th textAlign="center" color="white">الحالة</Th>
              </Tr>
            </Thead>
            <Tbody>
              {user.transactions && user.transactions.length > 0 ? (
                user.transactions.slice().reverse()
                  .filter(tx => tx.type !== 'reward')
                  .map((tx, idx) => (
                  <Tr key={idx} _hover={{ bg: "rgba(255, 255, 255, 0.05)" }}>
                    <Td textAlign="center" color="white">{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "-"}</Td>
                    <Td textAlign="center" color="white">{
                      tx.type === "deposit"
                        ? "إيداع"
                        : tx.type === "withdrawal"
                        ? "سحب"
                        : tx.type === "reward"
                        ? "مكافأة"
                        : tx.type
                    }</Td>
                    <Td textAlign="center" color="white">{tx.amount} USDT</Td>
                    <Td textAlign="center" color={tx.status === "completed" ? "brand.neonGreen" : tx.status === "pending" ? "brand.warning" : "brand.error"}>
                      {tx.status === "completed" ? "تم التأكيد" : tx.status === "pending" ? "قيد المعالجة" : "مرفوض"}
                    </Td>
              </Tr>
                ))
              ) : (
              <Tr>
                  <Td colSpan={4} textAlign="center" color="gray.400">لا توجد معاملات بعد.</Td>
              </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* Modal for Deposit */}
      <Modal isOpen={depositDisclosure.isOpen} onClose={depositDisclosure.onClose} isCentered>
        <ModalOverlay bg="rgba(0,0,0,0.7)" backdropFilter="blur(10px)" />
        <ModalContent
          bg="brand.glass"
          color="white"
          border="1px solid"
          borderColor="brand.glassBorder"
          boxShadow="0 25px 50px rgba(0,0,0,0.7)"
          backdropFilter="blur(20px)"
          maxW={{ base: '95vw', md: '500px' }}
          className="glow"
        >
          <ModalHeader textAlign="center" fontSize="xl" fontWeight="bold" className="gradient-text">
            إيداع الأموال
          </ModalHeader>
          <ModalCloseButton color="white" _hover={{ color: 'brand.neonBlue' }} />
          <ModalBody>
            <Box
              bg="rgba(0,123,255,0.08)"
              border="1px solid"
              borderColor="brand.neonBlue"
              rounded="lg"
              p={3}
              mb={4}
              textAlign="center"
            >
              <Text fontWeight="bold" color="brand.neonBlue" fontSize="lg">الشبكة: TRC20</Text>
            </Box>
            <Flex justify="center" align="center" mb={6}>
              <Box
                bg="rgba(255,255,255,0.08)"
                p={3}
                rounded="xl"
                border="1px solid"
                borderColor="brand.glassBorder"
                mr={4}
              >
                <OptimizedImage src={trxLogo} alt="TRX Logo" width={50} />
              </Box>
              <Box
                bg="white"
                p={3}
                rounded="xl"
                border="1px solid"
                borderColor="brand.glassBorder"
                boxShadow="0 8px 32px rgba(0,0,0,0.3)"
              >
                <OptimizedImage src={qrImage} alt="QR Code" width={120} height={120} />
              </Box>
            </Flex>
            <Text mb={3} fontSize="md" color="gray.300">يرجى إرسال الإيداع إلى عنوان المحفظة التالي:</Text>
            <Box
              bg="rgba(0,255,0,0.08)"
              border="1px solid"
              borderColor="brand.neonGreen"
              color="brand.neonGreen"
              p={4}
              rounded="lg"
              fontWeight="bold"
              mb={6}
              textAlign="center"
              fontSize="sm"
              wordBreak="break-all"
              className="glow"
            >
              TACjVq51U2rmQ1uoPQoe2SnxDbBkDD5BRY
            </Box>
            <Text mb={3} fontSize="md" color="gray.300">أدخل مبلغ الإيداع (USDT):</Text>
            <Input
              placeholder="مثال: 150"
              type="number"
              min={1}
              mb={6}
              bg="rgba(255,255,255,0.08)"
              border="1px solid"
              borderColor="brand.glassBorder"
              color="white"
              _placeholder={{ color: 'gray.400' }}
              _focus={{ borderColor: 'brand.neonBlue', boxShadow: '0 0 0 1px var(--chakra-colors-brand-neonBlue)', bg: 'rgba(255,255,255,0.15)' }}
              value={depositAmount}
              onChange={e => setDepositAmount(e.target.value)}
            />
            <Text mb={3} fontSize="md" color="gray.300">ارفع صورة دليل الإيداع:</Text>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setDepositProof(e.target.files[0])}
              bg="rgba(255,255,255,0.08)"
              border="1px solid"
              borderColor="brand.glassBorder"
              color="white"
              _focus={{ borderColor: 'brand.neonBlue', boxShadow: '0 0 0 1px var(--chakra-colors-brand-neonBlue)', bg: 'rgba(255,255,255,0.15)' }}
              sx={{
                '::file-selector-button': {
                  background: 'var(--chakra-colors-brand-neonBlue)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  marginRight: '12px',
                  cursor: 'pointer',
                }
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="neon"
              w="100%"
              size="lg"
              onClick={handleSendDeposit}
              isLoading={actionLoading}
              className="glow"
            >
              إرسال الإيداع
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal for Withdraw */}
      <Modal isOpen={withdrawDisclosure.isOpen} onClose={withdrawDisclosure.onClose} isCentered>
        <ModalOverlay bg="rgba(0,0,0,0.7)" backdropFilter="blur(10px)" />
        <ModalContent
          bg="brand.glass"
          color="white"
          border="1px solid"
          borderColor="brand.glassBorder"
          boxShadow="0 25px 50px rgba(0,0,0,0.7)"
          backdropFilter="blur(20px)"
          maxW={{ base: '95vw', md: '500px' }}
          className="glow"
        >
          <ModalHeader textAlign="center" fontSize="xl" fontWeight="bold" className="gradient-text">
            طلب سحب الأموال
          </ModalHeader>
          <ModalCloseButton color="white" _hover={{ color: 'brand.neonBlue' }} />
          <ModalBody>
            {withdrawalConfig && (
              <Box bg="rgba(255,165,0,0.08)" rounded="md" p={4} mb={4} border="1px solid" borderColor="brand.neonBlue">
                <Text fontSize="sm" fontWeight="bold" color="brand.neonBlue" mb={2} textAlign="center">
                  الحد الأقصى للسحب المتاح
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="brand.neonGreen" textAlign="center" mb={2}>
                  {formatUSDT(withdrawalConfig.maxWithdrawalAmount)}
                </Text>
                <Text fontSize="xs" color="gray.300" textAlign="center">
                  رأس المال المودع: {formatUSDT(withdrawalConfig.vipCapital)} | الرصيد الحالي: {formatUSDT(withdrawalConfig.currentBalance)}
                </Text>
              </Box>
            )}
            <Text mb={3} fontSize="md" color="gray.300">أدخل المبلغ المراد سحبه (USDT):</Text>
            <Input
              placeholder="مثال: 150"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              mb={2}
              bg="rgba(255,255,255,0.08)"
              border="1px solid"
              borderColor="brand.glassBorder"
              color="white"
              _placeholder={{ color: 'gray.400' }}
              _focus={{ borderColor: 'brand.neonBlue', boxShadow: '0 0 0 1px var(--chakra-colors-brand-neonBlue)', bg: 'rgba(255,255,255,0.15)' }}
            />
            {withdrawalConfig && (
              <Text fontSize="xs" color="gray.500" mb={4} textAlign="center">
                الحد الأقصى: {formatUSDT(withdrawalConfig.maxWithdrawalAmount)}
              </Text>
            )}
            {withdrawAmount && !isNaN(Number(withdrawAmount)) && Number(withdrawAmount) > 0 && (
              <Box mb={2} textAlign="center">
                <Text color="orange.400" fontSize="md">
                  الضريبة (15%): {formatUSDT(Number(withdrawAmount) * 0.15)}
                </Text>
                <Text color="brand.neonGreen" fontSize="md">
                  صافي المبلغ بعد الضريبة: {formatUSDT(Number(withdrawAmount) * 0.85)}
                </Text>
              </Box>
            )}
            <Text mb={3} fontSize="md" color="gray.300">عنوان محفظة TRON (TRC20):</Text>
            <Input
              value={withdrawAddress || ""}
              isReadOnly
              mb={4}
              bg="rgba(255,255,255,0.08)"
              color={validateWallet(withdrawAddress) ? 'brand.neonGreen' : 'red.500'}
              border="1px solid"
              borderColor="brand.glassBorder"
              _placeholder={{ color: 'gray.400' }}
              _focus={{ borderColor: 'brand.neonBlue', boxShadow: '0 0 0 1px var(--chakra-colors-brand-neonBlue)', bg: 'rgba(255,255,255,0.15)' }}
              placeholder="يرجى إضافة عنوان محفظة TRON أولاً"
            />
            {!validateWallet(withdrawAddress) && (
              <Box textAlign="center" mb={2}>
                <Text color="red.500" fontSize="sm" mb={2}>يرجى إضافة عنوان محفظة TRON (TRC20) صالح قبل السحب.</Text>
                <Button variant="neon" size="sm" className="glow" onClick={() => { setWalletInput(user.walletAddress || ""); setWalletModalOpen(true); withdrawDisclosure.onClose(); }}>إضافة عنوان المحفظة</Button>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="neon"
              w="100%"
              size="lg"
              onClick={handleSendWithdraw}
              isLoading={actionLoading}
              isDisabled={!validateWallet(withdrawAddress)}
              className="glow"
            >
              إرسال طلب السحب
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
