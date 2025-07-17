"use client";
import React from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  HStack,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillHome, AiFillSetting, AiFillInfoCircle } from "react-icons/ai";
import { MdAccountBalanceWallet } from "react-icons/md";
import { FaTasks, FaUser } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { user } = useAuth();

  // Build nav items based on login state
  let navItems = [
    { to: "/account", icon: <FaUser />, label: user ? "الرئيسية" : "حسابي" },
    { to: "/wallet", icon: <MdAccountBalanceWallet />, label: "المحفظة" },
    { to: "/tasks", icon: <FaTasks />, label: "المهام" },
    { to: "/about", icon: <AiFillInfoCircle />, label: "حول" },
    { to: "/settings", icon: <AiFillSetting />, label: "الإعدادات" },
  ];
  if (!user) {
    navItems = [
      { to: "/", icon: <AiFillHome />, label: "الرئيسية" },
      ...navItems,
    ];
  }

  return (
    <Box
      as="nav"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={999}
      bg="rgba(0, 0, 0, 0.95)"
      backdropFilter="blur(20px)"
      borderTop="1px solid"
      borderColor="brand.glassBorder"
      boxShadow="0 -4px 20px rgba(0, 0, 0, 0.5)"
      width="100%"
      py={{ base: 2, md: 3 }}
      px={{ base: 1, md: 6 }}
    >
      <Flex
        justify="center"
        align="center"
        width="100%"
        overflowX={isMobile ? "auto" : "visible"}
        flexWrap={isMobile ? "nowrap" : "wrap"}
        sx={isMobile ? {
          '::-webkit-scrollbar': { display: 'none' },
          '-ms-overflow-style': 'none',
          'scrollbarWidth': 'none',
        } : {}}
      >
        <HStack
          spacing={{ base: 1, sm: 2, md: 4, lg: 6 }}
          width="auto"
          justifyContent="center"
          flexWrap={isMobile ? "nowrap" : "wrap"}
        >
          {navItems.map((item, idx) => {
            const isActive = pathname === item.to;
            return (
              <Link href={item.to} key={idx} style={{ minWidth: 0 }}>
                <VStack
                  spacing={0}
                  minW={{ base: "60px", sm: "70px", md: "80px" }}
                  maxW={{ base: "90px", sm: "110px", md: "120px" }}
                  px={{ base: 1, sm: 2, md: 3 }}
                  py={1}
                  borderRadius="lg"
                  bg={isActive ? "rgba(0, 212, 255, 0.15)" : "transparent"}
                  border={isActive ? "2px solid" : "1px solid transparent"}
                  borderColor={isActive ? "brand.neonBlue" : "rgba(255, 255, 255, 0.1)"}
                  _hover={{
                    bg: isActive ? "rgba(0, 212, 255, 0.2)" : "rgba(255,255,255,0.05)",
                    boxShadow: isActive ? "0 0 20px rgba(0, 212, 255, 0.4)" : "0 0 10px rgba(255,255,255,0.1)",
                  }}
                  transition="all 0.2s"
                  style={{ flex: '0 0 auto' }}
                  align="center"
                >
                  <IconButton
                    icon={item.icon}
                    aria-label={item.label}
                    variant="ghost"
                    fontSize={{ base: "22px", sm: "24px", md: "28px" }}
                    color={isActive ? "brand.neonBlue" : "white"}
                    bg="transparent"
                    borderRadius="full"
                    _hover={{ color: "brand.neonBlue" }}
                    _active={{ color: "brand.neonBlue" }}
                    size="lg"
                    minW="auto"
                    minH="auto"
                    px={0}
                    py={0}
                  />
                  <Text
                    fontSize={{ base: "xs", sm: "sm", md: "md" }}
                    color={isActive ? "brand.neonBlue" : "gray.300"}
                    fontWeight={isActive ? "600" : "400"}
                    textShadow={isActive ? "0 0 8px rgba(0, 212, 255, 0.5)" : "none"}
                    mt={1}
                    noOfLines={1}
                    textAlign="center"
                    width="100%"
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
  );
}
