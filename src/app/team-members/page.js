"use client";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Team from "../components/Team";

export default function TeamMembersPage() {
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

  return <Team />;
} 