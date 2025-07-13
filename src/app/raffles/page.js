"use client";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import Raffles from "../components/Raffles";

function RafflesWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Raffles />
    </Suspense>
  );
}

export default function RafflesPage() {
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

  return <RafflesWrapper />;
} 