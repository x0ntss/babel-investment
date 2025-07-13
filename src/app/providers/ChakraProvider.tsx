"use client";
import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";

export function ChakraProviders({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
} 