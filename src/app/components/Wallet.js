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

  if (loading) return <Center minH="60vh"><Spinner /></Center>;
  if (error) return <Center minH="60vh"><Text color="red.500">{error}</Text></Center>;

  return (
    <Box p={{ base: 4, md: 8 }} minH="100vh">
      <Heading mb={4} textAlign="center" fontSize={{ base: "2xl", md: "3xl" }}>
        لوحة تحكم المحفظة
      </Heading>

      <Text mb={8} fontSize="lg" textAlign="center" color="white">
        مرحبًا <b>{user.username}</b> في محفظتك الخاصة 👋
      </Text>

      {/* Wallet Address Section */}
      <Box bg="white" rounded="xl" p={{ base: 2, md: 6 }} mb={8} maxW={{ base: '100%', md: '600px' }} mx="auto" boxShadow="md" color="gray.800">
        <Flex align="center" justify="space-between">
          <Box>
            <Text fontWeight="bold" fontSize="lg" mb={1}>عنوان المحفظة المرتبط:</Text>
            <Text fontSize="md" color={user.walletAddress ? "green.600" : "gray.500"} wordBreak="break-all">
              {user.walletAddress || "لم يتم ربط عنوان بعد"}
            </Text>
          </Box>
          {!user.walletAddress && (
            <Button colorScheme="teal" onClick={() => { setWalletInput(""); setWalletModalOpen(true); }}>
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

      {/* Stats Grid */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} mb={10}>
        <GridItem bg="white" rounded="xl" p={{ base: 2, md: 6 }} textAlign="center" boxShadow="md" color="gray.800">
          <Stat>
            <StatLabel fontSize="lg" mb={2}>رأس المال</StatLabel>
            <StatNumber fontSize="2xl" color="blue.600">{formatUSDT(user.balance)}</StatNumber>
          </Stat>
        </GridItem>

        <GridItem bg="white" rounded="xl" p={{ base: 2, md: 6 }} textAlign="center" boxShadow="md" color="gray.800">
          <Stat>
            <StatLabel fontSize="lg" mb={2}>الدخل اليومي المتوقع</StatLabel>
            <StatNumber fontSize="2xl" color="green.600">
              {formatRange(user.dailyIncomeMin, user.dailyIncomeMax)}
            </StatNumber>
            <Text fontSize="sm" color="gray.500">({user.percentRange ? `${user.percentRange[0]}% - ${user.percentRange[1]}%` : "-"})</Text>
          </Stat>
        </GridItem>

        <GridItem bg="white" rounded="xl" p={{ base: 2, md: 6 }} textAlign="center" boxShadow="md" color="gray.800">
          <Stat>
            <StatLabel fontSize="lg" mb={2}>المستوى الحالي</StatLabel>
            <StatNumber fontSize="2xl" color="purple.600">{user.level ? `المستوى ${user.level}` : "-"}</StatNumber>
          </Stat>
        </GridItem>
      </Grid>

      {/* Maximum Withdrawal Amount Display */}
      {withdrawalConfig && (
        <Box bg="white" rounded="xl" p={{ base: 4, md: 6 }} mb={8} maxW={{ base: '100%', md: '600px' }} mx="auto" boxShadow="md" color="gray.800">
          <Flex direction="column" align="center" textAlign="center">
            <Text fontSize="lg" fontWeight="bold" mb={2} color="orange.600">
              الحد الأقصى للسحب المتاح
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="green.600" mb={2}>
              {formatUSDT(withdrawalConfig.maxWithdrawalAmount)}
            </Text>
            <Text fontSize="sm" color="gray.500">
              رأس المال المودع: {formatUSDT(withdrawalConfig.vipCapital)} | 
              الرصيد الحالي: {formatUSDT(withdrawalConfig.currentBalance)}
            </Text>
            <Text fontSize="xs" color="gray.400" mt={1}>
              يمكنك سحب الأرباح فقط 
            </Text>
          </Flex>
        </Box>
      )}

      {/* Action Buttons */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mb={10} maxW={{ base: '100%', md: '600px' }} mx="auto">
        <Button colorScheme="blue" size="lg" w="100%" onClick={depositDisclosure.onOpen} boxShadow="md">
          إيداع
        </Button>
        <Button colorScheme="red" size="lg" w="100%" boxShadow="md" onClick={withdrawDisclosure.onOpen}>
          سحب
        </Button>
      </Grid>

      {/* Transactions Table */}
      <Box bg="white" mb={16} rounded="xl" p={{ base: 2, md: 6 }} w="100%" maxW={{ base: '100%', md: '1000px' }} mx="auto" boxShadow="md" color="gray.800">
        <Heading fontSize="xl" mb={4} textAlign="center">سجل السحوبات والإيداعات</Heading>
        <Box overflowX="auto">
          <Table variant="simple" size="md" minW="350px">
            <Thead bg="gray.100">
              <Tr>
                <Th textAlign="center">التاريخ</Th>
                <Th textAlign="center">النوع</Th>
                <Th textAlign="center">القيمة</Th>
                <Th textAlign="center">الحالة</Th>
              </Tr>
            </Thead>
            <Tbody>
              {user.transactions && user.transactions.length > 0 ? (
                user.transactions.slice().reverse().map((tx, idx) => (
                  <Tr key={idx}>
                    <Td textAlign="center">{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "-"}</Td>
                    <Td textAlign="center">{tx.type === "deposit" ? "إيداع" : "سحب"}</Td>
                    <Td textAlign="center">{tx.amount} USDT</Td>
                    <Td textAlign="center" color={tx.status === "completed" ? "green.500" : tx.status === "pending" ? "yellow.500" : "red.500"}>
                      {tx.status === "completed" ? "تم التأكيد" : tx.status === "pending" ? "قيد المعالجة" : "مرفوض"}
                    </Td>
              </Tr>
                ))
              ) : (
              <Tr>
                  <Td colSpan={4} textAlign="center">لا توجد معاملات بعد.</Td>
              </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* Modal for Deposit */}
      <Modal isOpen={depositDisclosure.isOpen} onClose={depositDisclosure.onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="white" color="gray.800">
          <ModalHeader textAlign="center">إيداع الأموال</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}><b>الشبكة:</b> TRC20</Text>

            <Flex justify="center" align="center" mb={4}>
              <OptimizedImage src={trxLogo} alt="TRX Logo" width={50} height={50} style={{ marginRight: '16px' }} />
              <OptimizedImage src={qrImage} alt="QR Code" width={120} height={120} />
            </Flex>

            <Text mb={2}>يرجى إرسال الإيداع إلى عنوان المحفظة التالي:</Text>
            <Box bg="gray.100" color="black" p={4} rounded="md" fontWeight="bold" mb={4} textAlign="center" fontSize="sm" wordBreak="break-all">
            TACjVq51U2rmQ1uoPQoe2SnxDbBkDD5BRY
            </Box>

            <Text mb={2}>أدخل مبلغ الإيداع (USDT):</Text>
            <Input placeholder="مثال: 150" type="number" min={1} mb={4} bg="white" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} />

            <Text mb={2}>ارفع صورة دليل الإيداع:</Text>
            <Input type="file" accept="image/*" onChange={(e) => setDepositProof(e.target.files[0])} bg="white" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" w="100%" onClick={handleSendDeposit} isLoading={actionLoading}>إرسال الإيداع</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for Withdraw */}
      <Modal isOpen={withdrawDisclosure.isOpen} onClose={withdrawDisclosure.onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="white" color="gray.800">
          <ModalHeader textAlign="center">طلب سحب الأموال</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Maximum Withdrawal Amount Display */}
            {withdrawalConfig && (
              <Box bg="orange.50" rounded="md" p={4} mb={4} border="1px" borderColor="orange.200">
                <Text fontSize="sm" fontWeight="bold" color="orange.700" mb={2} textAlign="center">
                  الحد الأقصى للسحب المتاح
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="green.600" textAlign="center" mb={2}>
                  {formatUSDT(withdrawalConfig.maxWithdrawalAmount)}
                </Text>
                <Text fontSize="xs" color="gray.600" textAlign="center">
                  رأس المال المودع: {formatUSDT(withdrawalConfig.vipCapital)} | 
                  الرصيد الحالي: {formatUSDT(withdrawalConfig.currentBalance)}
                </Text>
              </Box>
            )}

            <Text mb={2}>أدخل المبلغ المراد سحبه (USDT):</Text>
            <Input placeholder="مثال: 150" type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} mb={2} bg="white" />
            {withdrawalConfig && (
              <Text fontSize="xs" color="gray.500" mb={4} textAlign="center">
                الحد الأقصى: {formatUSDT(withdrawalConfig.maxWithdrawalAmount)}
              </Text>
            )}
            {/* Tax and net amount label */}
            {withdrawAmount && !isNaN(Number(withdrawAmount)) && Number(withdrawAmount) > 0 && (
              <Box mb={2} textAlign="center">
                <Text color="orange.500" fontSize="md">
                  الضريبة (15%): { formatUSDT(Number(withdrawAmount) * 0.15) }
                </Text>
                <Text color="green.600" fontSize="md">
                  صافي المبلغ بعد الضريبة: { formatUSDT(Number(withdrawAmount) * 0.85) }
                </Text>
              </Box>
            )}
            <Text mb={2}>عنوان محفظة TRON (TRC20):</Text>
            <Input
              value={withdrawAddress || ""}
              isReadOnly
              mb={4}
              bg="gray.100"
              color={validateWallet(withdrawAddress) ? "green.600" : "red.500"}
              placeholder="يرجى إضافة عنوان محفظة TRON أولاً"
            />
            {!validateWallet(withdrawAddress) && (
              <Box textAlign="center" mb={2}>
                <Text color="red.500" fontSize="sm" mb={2}>يرجى إضافة عنوان محفظة TRON (TRC20) صالح قبل السحب.</Text>
                <Button colorScheme="teal" size="sm" onClick={() => { setWalletInput(user.walletAddress || ""); setWalletModalOpen(true); withdrawDisclosure.onClose(); }}>إضافة عنوان المحفظة</Button>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              w="100%"
              onClick={handleSendWithdraw}
              isLoading={actionLoading}
              isDisabled={!validateWallet(withdrawAddress)}
            >
              إرسال طلب السحب
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
