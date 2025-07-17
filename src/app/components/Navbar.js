"use client";
import React from "react";
import { 
  Box, 
  Flex, 
  IconButton, 
  Text, 
  HStack, 
  VStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillHome, AiFillSetting, AiFillInfoCircle } from "react-icons/ai";
import { MdAccountBalanceWallet } from "react-icons/md";
import { FaTasks, FaUser, FaBars, FaTimes } from "react-icons/fa";

const navItems = [
  { to: "/", icon: <AiFillHome />, label: "الرئيسية" },
  { to: "/account", icon: <FaUser />, label: "حسابي" },
  { to: "/wallet", icon: <MdAccountBalanceWallet />, label: "المحفظة" },
  { to: "/tasks", icon: <FaTasks />, label: "المهام" },
  { to: "/about", icon: <AiFillInfoCircle />, label: "حول" },
  { to: "/settings", icon: <AiFillSetting />, label: "الإعدادات" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <Box
        position="fixed"
        top={4}
        right={4}
        zIndex={9999}
        display={{ base: "block", md: "none" }}
      >
        <IconButton
          icon={<FaBars />}
          onClick={onOpen}
          variant="ghost"
          color="white"
          bg="rgba(0, 0, 0, 0.8)"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="brand.glassBorder"
          _hover={{
            bg: "rgba(0, 0, 0, 0.9)",
            transform: "scale(1.05)",
          }}
          size="lg"
          aria-label="Open menu"
        />
      </Box>

      {/* Mobile Drawer - Only visible on mobile */}
      <Drawer 
        isOpen={isOpen} 
        placement="right" 
        onClose={onClose} 
        size="full"
        display={{ base: "block", md: "none" }}
      >
        <DrawerOverlay bg="rgba(0, 0, 0, 0.8)" />
        <DrawerContent
          bg="rgba(0, 0, 0, 0.9)"
          backdropFilter="blur(20px)"
          borderLeft="1px solid"
          borderColor="brand.glassBorder"
          position="relative"
        >
          {/* Fixed Close Button */}
          <IconButton
            icon={<FaTimes />}
            onClick={onClose}
            variant="ghost"
            color="white"
            aria-label="إغلاق القائمة"
            position="fixed"
            top={4}
            left={4}
            zIndex={10001}
            bg="rgba(0,0,0,0.7)"
            _hover={{ bg: "rgba(255,255,255,0.1)" }}
            size="lg"
          />
          <DrawerHeader
            borderBottom="1px solid"
            borderColor="brand.glassBorder"
            bg="transparent"
            color="white"
          >
            {/* You can put a logo or title here if desired */}
          </DrawerHeader>
          <DrawerBody p={0}>
            <VStack h="full" spacing={0} align="stretch" justify="center">
              <VStack flex={1} spacing={0} p={6}>
                {navItems.map((item, idx) => {
                  const isActive = pathname === item.to;
                  return (
                    <Link href={item.to} key={idx} style={{ width: "100%" }}>
                      <Button
                        w="full"
                        variant="ghost"
                        justifyContent="flex-start"
                        h="70px"
                        px={6}
                        mb={3}
                        bg={isActive ? "rgba(0, 212, 255, 0.15)" : "transparent"}
                        border={isActive ? "2px solid" : "1px solid transparent"}
                        borderColor={isActive ? "brand.neonBlue" : "rgba(255, 255, 255, 0.1)"}
                        color={isActive ? "brand.neonBlue" : "white"}
                        _hover={{
                          bg: isActive ? "rgba(0, 212, 255, 0.2)" : "rgba(255, 255, 255, 0.1)",
                          transform: "translateX(-5px)",
                          boxShadow: isActive ? "0 0 20px rgba(0, 212, 255, 0.4)" : "0 0 10px rgba(255, 255, 255, 0.2)"
                        }}
                        transition="all 0.3s ease"
                        leftIcon={item.icon}
                        fontSize="xl"
                        fontWeight={isActive ? "600" : "400"}
                        onClick={onClose}
                        borderRadius="16px"
                        iconSpacing={4}
                        textShadow={isActive ? "0 0 8px rgba(0, 212, 255, 0.5)" : "none"}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </VStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Desktop Bottom Navbar - Only visible on md and larger screens */}
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={999}
        bg="rgba(0, 0, 0, 0.9)"
        backdropFilter="blur(20px)"
        borderTop="1px solid"
        borderColor="brand.glassBorder"
        boxShadow="0 -4px 20px rgba(0, 0, 0, 0.5)"
        display={{ base: "none", md: "block" }}
      >
        <Flex justify="center" align="center" px={6} py={4}>
          <HStack spacing={{ md: 2, lg: 4, xl: 6 }}>
            {navItems.map((item, idx) => {
              const isActive = pathname === item.to;
              return (
                <Link href={item.to} key={idx}>
                  <VStack spacing={1}>
                    <IconButton
                      icon={item.icon}
                      aria-label={item.label}
                      variant="ghost"
                      fontSize={{ md: "20px", lg: "24px", xl: "28px" }}
                      color={isActive ? "brand.neonBlue" : "white"}
                      bg={isActive ? "rgba(0, 212, 255, 0.15)" : "transparent"}
                      border={isActive ? "2px solid" : "1px solid transparent"}
                      borderColor={isActive ? "brand.neonBlue" : "rgba(255, 255, 255, 0.1)"}
                      borderRadius="16px"
                      _hover={{ 
                        color: "brand.neonBlue",
                        bg: "rgba(0, 212, 255, 0.1)",
                        transform: "translateY(-3px)",
                        boxShadow: isActive ? "0 0 25px rgba(0, 212, 255, 0.5)" : "0 0 15px rgba(0, 212, 255, 0.3)"
                      }}
                      _active={{
                        transform: "translateY(-1px)",
                      }}
                      transition="all 0.3s ease"
                      size={{ md: "md", lg: "lg", xl: "lg" }}
                      px={{ md: 3, lg: 4, xl: 5 }}
                      py={{ md: 2, lg: 3, xl: 4 }}
                      minW={{ md: "60px", lg: "70px", xl: "80px" }}
                      minH={{ md: "60px", lg: "70px", xl: "80px" }}
                    />
                    <Text
                      fontSize={{ md: "xs", lg: "sm", xl: "md" }}
                      color={isActive ? "brand.neonBlue" : "gray.300"}
                      fontWeight={isActive ? "600" : "400"}
                      textShadow={isActive ? "0 0 8px rgba(0, 212, 255, 0.5)" : "none"}
                    >
                      {item.label}
                    </Text>
                  </VStack>
                </Link>
              );
            })}
          </HStack>
        </Flex>
      </Box>
    </>
  );
}
