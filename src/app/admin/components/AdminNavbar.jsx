"use client";
import React, { useState } from 'react';
import { 
  Box, 
  Flex, 
  Link, 
  Heading, 
  Button, 
  IconButton, 
  Drawer, 
  DrawerBody, 
  DrawerHeader, 
  DrawerOverlay, 
  DrawerContent, 
  DrawerCloseButton, 
  VStack, 
  useDisclosure,
  Text,
  HStack
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { componentStyles, adminTheme } from '../theme';

const AdminNavbar = ({ onLogout }) => {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const navItems = [
    { href: '/admin/dashboard', label: 'لوحة التحكم' },
    { href: '/admin/users', label: 'المستخدمون' },
    { href: '/admin/transactions', label: 'المعاملات' },
    { href: '/admin/pages/Banners', label: 'الاعلانات' },
  ];

  const isActive = (href) => pathname === href;

  const NavLink = ({ href, label, isMobile = false }) => (
    <Link
      as={NextLink}
      href={href}
      fontWeight={isActive(href) ? 'bold' : 'normal'}
      color={isActive(href) ? 'teal.200' : 'white'}
      _hover={{ color: 'teal.100' }}
      px={isMobile ? 4 : 6}
      py={isMobile ? 3 : 2}
      borderRadius="md"
      transition="all 0.2s"
      display="block"
      w={isMobile ? 'full' : 'auto'}
      textAlign={isMobile ? 'left' : 'center'}
    >
      {label}
    </Link>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <Box 
        {...componentStyles.adminNavbar}
        display={{ base: 'none', md: 'block' }}
        bg={adminTheme.colors.background[900]}
        boxShadow={adminTheme.shadows.md}
        borderBottom="1px solid"
        borderColor={adminTheme.colors.background.cardBorder}
        fontFamily={adminTheme.fonts.heading}
      >
        <Flex align="center" justify="space-between" maxW="1200px" mx="auto">
          <Heading size="md" color={adminTheme.colors.text.heading} fontFamily={adminTheme.fonts.heading} letterSpacing="wider">
            لوحة تحكم الإدارة
          </Heading>
          <Flex gap={6} align="center">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
            <Button 
              colorScheme="blue" 
              size="sm" 
              onClick={onLogout}
              {...componentStyles.adminButton}
              bg={adminTheme.colors.background.accent}
              boxShadow={adminTheme.shadows.md}
            >
              تسجيل الخروج
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Mobile Navigation */}
      <Box 
        {...componentStyles.adminNavbar}
        display={{ base: 'block', md: 'none' }}
        bg={adminTheme.colors.background[900]}
        boxShadow={adminTheme.shadows.md}
        borderBottom="1px solid"
        borderColor={adminTheme.colors.background.cardBorder}
        fontFamily={adminTheme.fonts.heading}
      >
        <Flex align="center" justify="space-between" maxW="1200px" mx="auto">
          <Heading size="md" color={adminTheme.colors.text.heading} fontFamily={adminTheme.fonts.heading} letterSpacing="wider">
            لوحة تحكم الإدارة
          </Heading>
          <HStack spacing={2}>
            <IconButton
              icon={<HamburgerIcon />}
              variant="ghost"
              color={adminTheme.colors.text.heading}
              onClick={onOpen}
              aria-label="Open menu"
              size="sm"
            />
          </HStack>
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bg={adminTheme.colors.background[800]} color={adminTheme.colors.text.main} boxShadow={adminTheme.shadows.md}>
          <DrawerCloseButton color={adminTheme.colors.text.main} />
          <DrawerHeader borderBottomWidth="1px" borderColor={adminTheme.colors.background.cardBorder} fontFamily={adminTheme.fonts.heading}>
            <Text fontSize="lg" fontWeight="bold">لوحة تحكم الإدارة</Text>
          </DrawerHeader>
          <DrawerBody pt={6}>
            <VStack spacing={4} align="stretch">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} isMobile={true} />
              ))}
              <Button 
                colorScheme="blue" 
                size="sm" 
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                {...componentStyles.adminButton}
                bg={adminTheme.colors.background.accent}
                boxShadow={adminTheme.shadows.md}
                w="full"
                mt={4}
              >
                تسجيل الخروج
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AdminNavbar; 