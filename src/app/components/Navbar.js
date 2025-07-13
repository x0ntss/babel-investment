"use client";
import React from "react";
import { Box, Flex, IconButton, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillHome, AiFillSetting, AiFillInfoCircle } from "react-icons/ai"; // ✅ أضف الأيقونة

import { MdAccountBalanceWallet } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { to: "/", icon: <AiFillHome />, label: "الرئيسية" },
  { to: "/wallet", icon: <MdAccountBalanceWallet />, label: "المحفظة" },
  { to: "/tasks", icon: <FaTasks />, label: "المهام" },
  { to: "/about", icon: <AiFillInfoCircle />, label: "حول" }, // ✅ صفحة حول
  { to: "/settings", icon: <AiFillSetting />, label: "الإعدادات" },
];

export default function Navbar() {
  const bg = useColorModeValue("whiteAlpha.800", "blackAlpha.800");
  const { user } = useAuth();
  const pathname = usePathname();
  if (!user) return null;

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      w="100%"
      zIndex={999}
      bg={bg}
      p={4}
      backdropFilter="blur(10px)"
      boxShadow="0 -1px 6px rgba(0,0,0,0.2)"
    >
      <Flex justify="space-around" align="center" h="60px">
        {navItems.map((item, idx) => (
          <Link
            href={item.to}
            key={idx}
            style={{
              color: pathname === item.to ? "#3182CE" : "#666",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: "12px",
              textDecoration: "none",
            }}
          >
            <IconButton
              icon={item.icon}
              aria-label={item.label}
              variant="ghost"
              fontSize="22px"
              color="inherit"
              _hover={{ color: "#3182CE" }}
              isRound
            />
            {item.label}
          </Link>
        ))}
      </Flex>
    </Box>
  );
}
