"use client";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Wallet from "../components/Wallet";

export default function WalletPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return <Wallet />;
} 